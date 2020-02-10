const express = require('express');
const Joi = require('@hapi/joi');
const requestValidator = require('../helpers/requestValidator');
const monotributistaController = require('../controllers/monotributista');
const userController = require('../controllers/user');

const router = express.Router();

const monotributistaDataSchema = Joi.object()
  .keys({
    activity: Joi.string()
      .valid('SERVICE_PROVISION', 'PRODUCTS_SALE')
      .required(),
    location: {
      province: Joi.string().required(),
      city: Joi.string().required(),
    },
    earnings: Joi.number().required(),
    hasShop: Joi.boolean().required(),
    shopDetails: {
      quantity: Joi.number(),
      area: Joi.number(),
      paysRental: Joi.boolean(),
      rentalValue: Joi.number(),
      consumedEnergy: Joi.number(),
    },
  })
  .unknown(false);

router.post(
  '/:id',
  requestValidator.validateRequest(monotributistaDataSchema),
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const monotributistaData = req.body;
      const monotributistaDataId = await monotributistaController.create(
        monotributistaData
      );
      await userController.setMonotributistaData(userId, monotributistaDataId);
      res.status(201).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

router.put('/:id', async (req, res, next) => {
  try {
    const monotributistaDataId = req.params.id;
    const newMonotributistaData = req.body;
    const shouldRecategorize = await monotributistaController.update(
      monotributistaDataId,
      newMonotributistaData
    );
    res.status(200).send({ shouldRecategorize: shouldRecategorize });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/:id/category-limits', async (req, res, next) => {
  try {
    const user = await userController.getById(req.params.id);
    const categoryLimits = await monotributistaController.getCategoryLimits(
      user.monotributistaData
    );
    res.status(200).send(categoryLimits);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/:id/tax-situation', async (req, res, next) => {
  try {
    const user = await userController.getById(req.params.id);
    const data = await monotributistaController.getById(
      user.monotributistaData
    );
    delete data.bills;
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/:id/tax', async (req, res, next) => {
  try {
    const user = await userController.getById(req.params.id);
    const taxes = await monotributistaController.getTaxes(
      user.monotributistaData
    );
    res.status(200).send(taxes);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

const billSchema = Joi.object()
  .keys({
    date: Joi.string().required(),
    value: Joi.number().required(),
    title: Joi.string().required(),
    description: Joi.string(),
  })
  .unknown(false);

router.post(
  '/:id/bill',
  requestValidator.validateRequest(billSchema),
  async (req, res, next) => {
    try {
      const user = await userController.getById(req.params.id);
      await monotributistaController.addBill(user.monotributistaData, req.body);
      res.status(201).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

router.get('/:id/bill', async (req, res, next) => {
  const year = req.query.year;
  try {
    const user = await userController.getById(req.params.id);
    const bills = year
      ? await monotributistaController.getBillsByYear(
          user.monotributistaData,
          year
        )
      : await monotributistaController.getAllBills(user.monotributistaData);
    res.status(200).send(bills);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.delete('/:id/bill/:billId', async (req, res, next) => {
  try {
    const user = await userController.getById(req.params.id);
    await monotributistaController.deleteBill(
      user.monotributistaData,
      req.params.billId
    );
    res.status(202).send();
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
