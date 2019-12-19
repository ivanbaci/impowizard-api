const MonotributistaData = require('../models/monotributistaData');
const constants = require('../helpers/constants');
const moment = require('moment');

const create = async monotributistaData => {
  const { monotributoCategory, nextCategory } = getMonotributoCategory(
    monotributistaData
  );
  monotributistaData.category = monotributoCategory;
  if (monotributoCategory === 'NOT') {
    monotributistaData.notMonotributista = true;
  }
  monotributistaData.nextCategory = nextCategory;
  console.log(monotributistaData);
  const dataSaved = await MonotributistaData.create(monotributistaData);
  return dataSaved.id;
};

const getMonotributoCategory = monotributistaData => {
  const activity = monotributistaData.activity;
  const earnings = monotributistaData.earnings;
  const hasShop = monotributistaData.hasShop;
  const shopDetails = monotributistaData.shopDetails;

  if (isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_A_LIMITS)) {
    return {
      monotributoCategory: 'A',
      nextCategory: 'B',
    };
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_B_LIMITS)
  ) {
    return {
      monotributoCategory: 'B',
      nextCategory: 'C',
    };
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_C_LIMITS)
  ) {
    return {
      monotributoCategory: 'C',
      nextCategory: 'D',
    };
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_D_LIMITS)
  ) {
    return {
      monotributoCategory: 'D',
      nextCategory: 'E',
    };
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_E_LIMITS)
  ) {
    return {
      monotributoCategory: 'E',
      nextCategory: 'F',
    };
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_F_LIMITS)
  ) {
    return {
      monotributoCategory: 'F',
      nextCategory: 'G',
    };
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_G_LIMITS)
  ) {
    return {
      monotributoCategory: 'g',
      nextCategory: 'F',
    };
  } else if (
    isCategoryH(
      earnings,
      hasShop,
      shopDetails,
      activity,
      constants.CATEGORY_H_LIMITS
    )
  ) {
    if (activity === 'SERVICE_PROVISION') {
      return {
        monotributoCategory: 'H',
        nextCategory: 'NOT',
      };
    } else {
      return {
        monotributoCategory: 'H',
        nextCategory: 'I',
      };
    }
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_I_LIMITS)
  ) {
    return {
      monotributoCategory: 'I',
      nextCategory: 'J',
    };
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_J_LIMITS)
  ) {
    return {
      monotributoCategory: 'J',
      nextCategory: 'K',
    };
  } else if (
    isCategory(earnings, hasShop, shopDetails, constants.CATEGORY_K_LIMITS)
  ) {
    return {
      monotributoCategory: 'K',
      nextCategory: 'NOT',
    };
  } else {
    return {
      monotributoCategory: 'NOT',
      nextCategory: 'NOT',
    };
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

const getCategoryLimits = async id => {
  const monotributistaData = await getById(id);
  if (monotributistaData.category === 'A') {
    return calculateLimits(constants.CATEGORY_A_LIMITS);
  } else if (monotributistaData.category === 'B') {
    return calculateLimits(constants.CATEGORY_B_LIMITS);
  } else if (monotributistaData.category === 'C') {
    return calculateLimits(constants.CATEGORY_C_LIMITS);
  } else if (monotributistaData.category === 'D') {
    return calculateLimits(constants.CATEGORY_D_LIMITS);
  } else if (monotributistaData.category === 'E') {
    return calculateLimits(constants.CATEGORY_E_LIMITS);
  } else if (monotributistaData.category === 'F') {
    return calculateLimits(constants.CATEGORY_F_LIMITS);
  } else if (monotributistaData.category === 'G') {
    return calculateLimits(constants.CATEGORY_G_LIMITS);
  } else if (monotributistaData.category === 'H') {
    return calculateLimits(constants.CATEGORY_H_LIMITS);
  } else if (monotributistaData.category === 'I') {
    return calculateLimits(constants.CATEGORY_I_LIMITS);
  } else if (monotributistaData.category === 'J') {
    return calculateLimits(constants.CATEGORY_J_LIMITS);
  } else if (monotributistaData.category === 'K') {
    return calculateLimits(constants.CATEGORY_K_LIMITS);
  }
};

const calculateLimits = limits => {
  const biannualLimits = {};
  for (var key in limits) {
    if (limits.hasOwnProperty(key)) {
      biannualLimits[key] = limits[key];
    }
  }

  const monthLimits = {};
  for (var key in limits) {
    if (limits.hasOwnProperty(key)) {
      monthLimits[key] = limits[key];
    }
  }
  Object.freeze(limits);

  Object.keys(biannualLimits).map(function(key, index) {
    biannualLimits[key] = Number((biannualLimits[key] * 0.5).toFixed(2));
  });

  Object.keys(monthLimits).map(function(key, index) {
    monthLimits[key] = Number((monthLimits[key] / 12).toFixed(2));
  });
  return {
    anualLimits: limits,
    biannualLimits: biannualLimits,
    monthLimits: monthLimits,
  };
};

const getById = id => {
  return MonotributistaData.findById(id);
};

const getTaxes = async id => {
  const monotributistaData = await MonotributistaData.findById(id);
  const monotributoValue = getMonotributoTaxValue(monotributistaData.category);
  const taxes = {
    bienesPersonales: {
      name: 'Bienes Personales',
      value: 2562.32,
      expirationDate: '17/02/2020',
      paymentsExpired: 0,
      lastPaymentDate: '18/12/2019',
      status: 'enTermino',
    },
    monotributo: {
      name: 'Monotributo',
      value: monotributoValue,
      expirationDate: '20/12/2019',
      paymentsExpired: 0,
      lastPaymentDate: '19/11/2019',
      status: 'porVencer',
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

const getAllBills = async id => {
  const monotributistaData = await MonotributistaData.findById(id);
  return monotributistaData.bills;
};

const getBillsByYear = async (id, year) => {
  const monotributistaData = await MonotributistaData.findById(id);
  return monotributistaData.bills.filter(
    bill => moment(bill.date).format('YYYY') === year
  );
};

const deleteBill = (monotributistaDataId, billId) => {
  MonotributistaData.findByIdAndUpdate(
    monotributistaDataId,
    {
      $pull: { bills: { _id: billId } },
    },
    (err, data) => {
      if (err) console.log(err);
    }
  );
};

module.exports = {
  create,
  getById,
  getCategoryLimits,
  getTaxes,
  addBill,
  getAllBills,
  getBillsByYear,
  deleteBill,
};
