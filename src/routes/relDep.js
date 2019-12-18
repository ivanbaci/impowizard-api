const express = require('express');
const Joi = require('@hapi/joi');
const requestValidator = require('../helpers/requestValidator');
const relDepController = require('../controllers/relDep');
const userController = require('../controllers/user');

const router = express.Router();

const relDepDataSchema = Joi.object()
  .keys({
    location: {
      province: Joi.string(),
      city: Joi.string(),
    },
    isMarried: Joi.boolean().required(),
    salary: Joi.number().required(),
    sonsQuantity: Joi.number().required(),
    paysRental: Joi.boolean().required(),
    rentalValue: Joi.number().required(),
  })
  .unknown(false);

router.post(
  '/:id',
  requestValidator.validateRequest(relDepDataSchema),
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const relDepData = req.body;
      const relDepDataId = await relDepController.create(relDepData);
      await userController.setRelDepData(userId, relDepDataId);
      res.status(201).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

module.exports = router;
