const express = require('express');
const Joi = require('@hapi/joi');
const requestValidator = require('../helpers/requestValidator');
const userController = require('../controllers/user');

const router = express.Router();

const categorySchema = Joi.object()
  .keys({
    category: Joi.string()
      .valid('MONOTRIBUTISTA', 'REL_DEPENDENCIA')
      .required(),
  })
  .unknown(false);

router.put(
  '/:id/category',
  requestValidator.validateRequest(categorySchema),
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const category = req.body.category;
      await userController.updateFiscalCategory(userId, category);
      res.status(204).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

const fiscalDataSchema = Joi.object()
  .keys({
    fiscalData: {
      name: Joi.string().required(),
      lastName: Joi.string().required(),
      cuit: Joi.string().required(),
    },
  })
  .unknown(false);

router.put(
  '/:id/fiscal-data',
  requestValidator.validateRequest(fiscalDataSchema),
  async (req, res, next) => {
    try {
      await userController.updateFiscalData(req.params.id, req.body.fiscalData);
      res.status(204).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

router.use('/:id/monotributista', require('./monotributista'));

module.exports = router;
