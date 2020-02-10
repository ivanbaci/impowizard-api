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
      value: 4381.27,
      expirationDate: '15/02/2020',
      paymentsExpired: 0,
      lastPaymentDate: '16/12/2019',
      status: 'porVencer',
    },
    {
      name: 'Ganancias',
      value: gananciasValue,
      expirationDate: '02/03/2020',
      paymentsExpired: 0,
      lastPaymentDate: '02/02/2019',
      status: 'enTermino',
    },
    {
      name: 'Aportes Sociales',
      value: aportesSocialesTotalValue,
      expirationDate: '02/03/2020',
      paymentsExpired: 0,
      lastPaymentDate: '02/02/2019',
      status: 'enTermino',
      jubilacionValue: jubilacionValue,
      pamiValue: pamiValue,
      obraSocialValue: obraSocialValue,
    },
  ];
  return taxes;
};

const getGananciasTaxValue = relDepData => {
  if (relDepData.salary < 55261) {
    return 0;
  } else if (relDepData.isMarried && relDepData.salary < 64145) {
    return 0;
  } else if (
    relDepData.isMarried &&
    relDepData.sonsQuantity >= 2 &&
    relDepData.salary < 73104
  ) {
    return 0;
  }
  return getGananciaValueFromGananciaNeta(relDepData);
};

const getGananciaValueFromGananciaNeta = relDepData => {
  const totalDeductValue = calculateDeducts(relDepData);
  const gananciaNetaImponible = relDepData.salary - totalDeductValue;
  if (gananciaNetaImponible < 3975) {
    return 0;
  } else if (gananciaNetaImponible < 7944.86) {
    return 198.63 + (gananciaNetaImponible - 3975) * 0.09;
  } else if (gananciaNetaImponible < 11917.29) {
    return 556.14 + (gananciaNetaImponible - 7944.86) * 0.12;
  } else if (gananciaNetaImponible < 15889.72) {
    return 1032.83 + (gananciaNetaImponible - 11917.29) * 0.15;
  } else if (gananciaNetaImponible < 23909.58) {
    return 1628.7 + (gananciaNetaImponible - 15889.72) * 0.19;
  } else if (gananciaNetaImponible < 31779.44) {
    return 3138.22 + (gananciaNetaImponible - 23909.58) * 0.23;
  } else if (gananciaNetaImponible < 47669.16) {
    return 4965.54 + (gananciaNetaImponible - 31779.44) * 0.27;
  } else if (gananciaNetaImponible < 63558.88) {
    return 9255.76 + (gananciaNetaImponible - 47669.16) * 0.31;
  } else {
    return 14181.58 + (gananciaNetaImponible - 63558.88) * 0.35;
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
    10321.1 +
    49541.59 +
    4852.37 * relDepData.sonsQuantity +
    (relDepData.isMarried ? 9622.1 : 0)
  );
};

const getPermittedDeducts = relDepData => {
  if (relDepData.paysRental) {
    return relDepData.rentalValue * 0.4 > 10321.1
      ? 10321.1
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
