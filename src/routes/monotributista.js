const express = require('express');
const Joi = require('@hapi/joi');
const requestValidator = require('../helpers/requestValidator');
const monotributistaController = require('../controllers/monotributista');
const userController = require('../controllers/user');

const router = express.Router();

const monotributistaDataSchema = Joi.object()
  .keys({
    activity: Joi.string()
      .valid('SERVICE_PROVISION', 'PRODUCTS_SALE')
      .required(),
    location: {
      province: Joi.string().required(),
      city: Joi.string().required(),
    },
    earnings: Joi.number().required(),
    hasShop: Joi.boolean().required(),
    shopDetails: {
      quantity: Joi.number(),
      area: Joi.number(),
      paysRental: Joi.boolean(),
      rentalValue: Joi.number(),
      consumedEnergy: Joi.number(),
    },
  })
  .unknown(false);

router.post(
  '/:userId',
  requestValidator.validateRequest(monotributistaDataSchema),
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const monotributistaData = req.body;
      const monotributistaDataId = await monotributistaController.create(
        monotributistaData
      );
      await userController.setMonotributistaData(userId, monotributistaDataId);
      res.status(201).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

module.exports = router;
