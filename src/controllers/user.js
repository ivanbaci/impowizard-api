const bcrypt = require('bcrypt');
const User = require('../models/user');

const create = user => {
  const { password, ...data } = user;
  const hashedPassword = bcrypt.hashSync(password, 10);
  User.create({ ...data, password: hashedPassword });
};

const getByEmail = email => {
  return User.findOne({ email: email });
};

const getByUsername = username => {
  return User.findOne({ username: username });
};

const login = async (username, password) => {
  const user = await getByUsername(username);

  if (!user) return false;
  const match = await bcrypt.compare(password, user.password);
  return match;
};

module.exports = {
  create,
  getByEmail,
  getByUsername,
  login,
};
