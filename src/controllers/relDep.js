const RelDepData = require('../models/relDepData');
const constants = require('../helpers/constants');
const moment = require('moment');

const create = async relDepData => {
  const dataSaved = await RelDepData.create(relDepData);
  return dataSaved.id;
};

const addReceipt = async (id, receipt) => {
  receipt.date = moment(receipt.date, 'DD/MM/YYYY');
  RelDepData.findByIdAndUpdate(
    id,
    { $push: { receipts: receipt } },
    (err, data) => {
      if (err) console.log(err);
    }
  );
};

const getAllReceipts = async id => {
  const relDepData = await RelDepData.findById(id);
  return relDepData.receipts;
};

const getReceiptsByYear = async (id, year) => {
  const relDepData = await RelDepData.findById(id);
  return relDepData.receipts.filter(
    receipt => moment(receipt.date).format('YYYY') === year
  );
};

module.exports = {
  create,
  addReceipt,
  getAllReceipts,
  getReceiptsByYear,
};
