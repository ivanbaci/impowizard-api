const express = require('express');
const Joi = require('@hapi/joi');
const requestValidator = require('../helpers/requestValidator');
const userController = require('../controllers/user');
const { generateToken } = require('../helpers/tokenGenerator');

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

const loginSchema = Joi.object()
  .keys({
    username: Joi.string()
      .max(20)
      .required(),
    password: Joi.string().required(),
  })
  .unknown(false);

router.post(
  '/login',
  requestValidator.validateRequest(loginSchema),
  async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
      const matched = await userController.login(username, password);
      if (!matched) return next({ name: 'InvalidLogin' });
      let user = await userController.getByUsername(username);

      const { email } = user;
      user.password = undefined;

      res.status(200).json({
        user,
        token: generateToken({ username, email }),
      });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  }
);

module.exports = router;
