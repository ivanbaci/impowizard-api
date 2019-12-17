const MonotributistaData = require('../models/monotributistaData');
const constants = require('../helpers/constants');
const moment = require('moment');

const create = async monotributistaData => {
  const monotributoCategory = getMonotributoCategory(monotributistaData);
  monotributistaData.category = monotributoCategory;
  const dataSaved = await MonotributistaData.create(monotributistaData);
  return dataSaved.id;
};

const getMonotributoCategory = monotributistaData => {
  const activity = monotributistaData.activity;
  const earnings = monotributistaData.earnings;
  const hasShop = monotributistaData.hasShop;
  const shopDetails = monotributistaData.shopDetails;

  if (isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_A_LIMITS)) {
    return 'A';
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_B_LIMITS)
  ) {
    return 'B';
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_C_LIMITS)
  ) {
    return 'C';
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_D_LIMITS)
  ) {
    return 'D';
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_E_LIMITS)
  ) {
    return 'E';
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_F_LIMITS)
  ) {
    return 'F';
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_G_LIMITS)
  ) {
    return 'G';
  } else if (
    isCategoryH(
      earnings,
      hasShop,
      shopDetails,
      activity,
      constants.CATEGORY_H_LIMITS
    )
  ) {
    return 'H';
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_I_LIMITS)
  ) {
    return 'I';
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_J_LIMITS)
  ) {
    return 'J';
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_K_LIMITS)
  ) {
    return 'K';
  } else {
    return 'No category';
  }
};

const isCategory = (earnings, hasShop, shopDetails, limits) => {
  if (
    earnings < limits.earnings &&
    (!hasShop ||
      (shopDetails.area < limits.area &&
        shopDetails.consumedEnergy < limits.energy &&
        (!shopDetails.paysRental || shopDetails.rentalValue < limits.rental)))
  ) {
    return true;
  }
  return false;
};

const isCategoryH = (earnings, hasShop, shopDetails, activity, limits) => {
  if (isCategory(earnings, hasShop, shopDetails, limits)) {
    return true;
  } else if (activity === 'SERVICE_PROVISION') {
    return true;
  }
  return false;
};

const getById = id => {
  return MonotributistaData.findById(id);
};

const getTaxes = async id => {
  const monotributistaData = await MonotributistaData.findById(id);
  const monotributoValue = getMonotributoTaxValue(monotributistaData.category);
  const taxes = {
    bienesPersonales: {
      value: 2562.32,
      expirationDate: '25/06/2020',
      paymentsExpired: 0,
    },
    monotributo: {
      value: monotributoValue,
      expirationDate: '20/12/2019',
      paymentsExpired: 0,
    },
  };
  return taxes;
};

const getMonotributoTaxValue = category => {
  if (category === 'A') {
    return constants.MONOTRIBUTO_VALUE.CATEGORY_A;
  } else if (category === 'B') {
    return constants.MONOTRIBUTO_VALUE.CATEGORY_B;
  } else if (category === 'C') {
    return constants.MONOTRIBUTO_VALUE.CATEGORY_C;
  } else if (category === 'D') {
    return constants.MONOTRIBUTO_VALUE.CATEGORY_D;
  } else if (category === 'E') {
    return constants.MONOTRIBUTO_VALUE.CATEGORY_E;
  } else if (category === 'F') {
    return constants.MONOTRIBUTO_VALUE.CATEGORY_F;
  } else if (category === 'G') {
    return constants.MONOTRIBUTO_VALUE.CATEGORY_G;
  } else if (category === 'H') {
    return constants.MONOTRIBUTO_VALUE.CATEGORY_H;
  } else if (category === 'I') {
    return constants.MONOTRIBUTO_VALUE.CATEGORY_I;
  } else if (category === 'J') {
    return constants.MONOTRIBUTO_VALUE.CATEGORY_J;
  } else if (category === 'K') {
    return constants.MONOTRIBUTO_VALUE.CATEGORY_K;
  }
};

const addBill = (id, bill) => {
  bill.date = moment(bill.date, 'DD/MM/YYYY');
  MonotributistaData.findByIdAndUpdate(
    id,
    { $push: { bills: bill } },
    (err, data) => {
      if (err) console.log(err);
    }
  );
};

const getAllBillsByYear = async (id, year) => {
  const monotributistaData = await MonotributistaData.findById(id);
  return monotributistaData.bills.filter(
    bill => moment(bill.date).format('YYYY') === year
  );
};

module.exports = {
  create,
  getById,
  getTaxes,
  addBill,
  getAllBillsByYear,
};
