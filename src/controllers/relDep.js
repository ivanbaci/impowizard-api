const RelDepData = require('../models/relDepData');
const constants = require('../helpers/constants');
const moment = require('moment');

const create = async relDepData => {
  const dataSaved = await RelDepData.create(relDepData);
  return dataSaved.id;
};

module.exports = {
  create,
};
