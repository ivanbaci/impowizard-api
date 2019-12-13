const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = config.server.JWT_SECRET;
const JWT_TIMEOUT = config.server.JWT_TIMEOUT;

const generateToken = data => {
  return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_TIMEOUT });
};

module.exports = { generateToken };
