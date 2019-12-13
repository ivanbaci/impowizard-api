const express = require('express');
const Joi = require('@hapi/joi');
const requestValidator = require('../helpers/requestValidator');

const router = express.Router();

const categorySchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    code: Joi.string()
      .valid('MONOTRIBUTO', 'REL_DEPENDENCIA')
      .required(),
  })
  .unknown(false);

router.post(
  '/:id/category',
  requestValidator.validateRequest(categorySchema),
  async (req, res, next) => {
    try {
      await userController.updateCategory(req.body);
      res.status(201).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

module.exports = router;
