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

const getTaxes = async id => {
  const relDepData = await RelDepData.findById(id);
  const gananciasValue = getGananciasTaxValue(relDepData);
  const {
    aportesSocialesTotalValue,
    jubilacionValue,
    pamiValue,
    obraSocialValue,
  } = getAportesSocialesTaxValue(relDepData.salary);
  const taxes = [
    {
      name: 'Bienes Personales',
      value: 3481.27,
      expirationDate: '15/02/2020',
      paymentsExpired: 0,
      lastPaymentDate: '16/12/2019',
      status: 'enTermino',
    },
    {
      name: 'Ganancias',
      value: gananciasValue,
      expirationDate: '02/01/2020',
      paymentsExpired: 0,
      lastPaymentDate: '02/12/2019',
      status: 'enTermino',
    },
    {
      name: 'Aportes Sociales',
      value: aportesSocialesTotalValue,
      expirationDate: '02/01/2020',
      paymentsExpired: 0,
      lastPaymentDate: '02/12/2019',
      status: 'enTermino',
      jubilacionValue: jubilacionValue,
      pamiValue: pamiValue,
      obraSocialValue: obraSocialValue,
    },
  ];
  return taxes;
};

const getGananciasTaxValue = relDepData => {
  if (relDepData.salary < 47584) {
    return 0;
  } else if (
    relDepData.isMarried &&
    relDepData.sonsQuantity >= 2 &&
    relDepData.salary < 61046
  ) {
    return 0;
  }
  return getGananciaValueFromGananciaNeta(relDepData);
};

const getGananciaValueFromGananciaNeta = relDepData => {
  const totalDeductValue = calculateDeducts(relDepData);
  const gananciaNetaImponible = relDepData.salary - totalDeductValue;
  console.log(gananciaNetaImponible);
  if (gananciaNetaImponible < 2753.32) {
    return 0;
  } else if (gananciaNetaImponible < 5506.63) {
    return 137.67 + (gananciaNetaImponible - 2753.32) * 0.09;
  } else if (gananciaNetaImponible < 8259.95) {
    return 385.46 + (gananciaNetaImponible - 5506.63) * 0.12;
  } else if (gananciaNetaImponible < 11013.27) {
    return 715.86 + (gananciaNetaImponible - 8259.95) * 0.15;
  } else if (gananciaNetaImponible < 16519.9) {
    return 1128.86 + (gananciaNetaImponible - 11013.27) * 0.19;
  } else if (gananciaNetaImponible < 22026.54) {
    return 2175.12 + (gananciaNetaImponible - 16519.9) * 0.23;
  } else if (gananciaNetaImponible < 33039.81) {
    return 3441.65 + (gananciaNetaImponible - 22026.54) * 0.27;
  } else if (gananciaNetaImponible < 44053.08) {
    return 6415.23 + (gananciaNetaImponible - 33039.81) * 0.31;
  } else {
    return 9829.34 + (gananciaNetaImponible - 44053.08) * 0.35;
  }
};

const calculateDeducts = relDepData => {
  const { aportesSocialesTotalValue } = getAportesSocialesTaxValue(
    relDepData.salary
  );
  const personalDeducts = getPersonalDeducts(relDepData);
  const permittedDeducts = getPermittedDeducts(relDepData);
  return aportesSocialesTotalValue + personalDeducts + permittedDeducts;
};

const getAportesSocialesTaxValue = salary => {
  return {
    aportesSocialesTotalValue: salary * 0.17,
    jubilacionValue: salary * 0.11,
    pamiValue: salary * 0.03,
    obraSocialValue: salary * 0.03,
  };
};

const getPersonalDeducts = relDepData => {
  return (
    7154 +
    34339.5 +
    3363.4 * relDepData.sonsQuantity +
    (relDepData.isMarried ? 6669.5 : 0)
  );
};

const getPermittedDeducts = relDepData => {
  if (relDepData.paysRental) {
    return relDepData.rentalValue * 0.4 > 7154
      ? 7154
      : relDepData.rentalValue * 0.4;
  }
  return 0;
};

module.exports = {
  create,
  addReceipt,
  getAllReceipts,
  getReceiptsByYear,
  getTaxes,
};
