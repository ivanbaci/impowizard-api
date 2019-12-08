const bcrypt = require('bcrypt');
const User = require('../models/user');

const create = user => {
  const { password, ...data } = user;
  const hashedPassword = bcrypt.hashSync(password, 10);
  User.create({ ...data, password: hashedPassword });
};

const getByEmail = email => {
  console.log('email');
  console.log(email);
  return User.findOne({ email: email });
};

const getByUsername = username => {
  console.log('username');
  console.log(username);
  return User.findOne({ username: username });
};

module.exports = {
  create,
  getByEmail,
  getByUsername,
};
