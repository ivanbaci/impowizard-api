const MonotributistaData = require('../models/monotributistaData');
const constants = require('../helpers/constants');

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

module.exports = {
  create,
};
