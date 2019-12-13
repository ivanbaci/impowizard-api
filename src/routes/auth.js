const express = require('express');
const Joi = require('@hapi/joi');
const requestValidator = require('../helpers/requestValidator');
const userController = require('../controllers/user');

const router = express.Router();

const userSchema = Joi.object()
  .keys({
    email: Joi.string()
      .email()
      .required(),
    username: Joi.string()
      .max(20)
      .required(),
    password: Joi.string().required(),
  })
  .unknown(false);

router.post(
  '/register',
  requestValidator.validateRequest(userSchema),
  async (req, res, next) => {
    try {
      if (await userController.getByUsername(req.body.username)) {
        return next({
          name: 'InvalidUsername',
          description: 'Username already taken. It must be unique.',
        });
      } else if (await userController.getByEmail(req.body.email)) {
        return next({
          name: 'InvalidEmail',
          description: 'An admin user with that email already exists.',
        });
      }
      await userController.create(req.body);
      res.status(201).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

module.exports = router;
