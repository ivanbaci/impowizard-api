const express = require('express');
const Joi = require('@hapi/joi');
const requestValidator = require('../helpers/requestValidator');

const router = express.Router();

router.post('/fiscal-data');

module.exports = router;
