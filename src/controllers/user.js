const bcrypt = require('bcrypt');
const User = require('../models/user');
const emailSender = require('../helpers/emailSender');

const create = user => {
  console.log(user);
  const { password, ...data } = user;
  const hashedPassword = bcrypt.hashSync(password, 10);
  User.create({ ...data, password: hashedPassword });
  emailSender.sendWelcomeEmail(user);
};

const getById = userId => {
  return User.findById(userId);
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

const updateFiscalCategory = async (userId, category) => {
  User.findByIdAndUpdate(
    userId,
    { $set: { fiscalCategory: category } },
    (err, user) => {
      if (err) console.log(err);
    }
  );
};

const updateFiscalData = async (userId, fiscalData) => {
  User.findByIdAndUpdate(
    userId,
    { $set: { fiscalData: fiscalData } },
    (err, user) => {
      if (err) console.log(err);
    }
  );
};

const setMonotributistaData = async (userId, monotributistaDataId) => {
  User.findByIdAndUpdate(
    userId,
    { $set: { monotributistaData: monotributistaDataId } },
    (err, user) => {
      if (err) console.log(err);
    }
  );
};

const setRelDepData = async (userId, relDepDataId) => {
  User.findByIdAndUpdate(
    userId,
    { $set: { relDepData: relDepDataId } },
    (err, user) => {
      if (err) console.log(err);
    }
  );
};

module.exports = {
  create,
  getById,
  getByEmail,
  getByUsername,
  login,
  updateFiscalCategory,
  updateFiscalData,
  setMonotributistaData,
  setRelDepData,
};
