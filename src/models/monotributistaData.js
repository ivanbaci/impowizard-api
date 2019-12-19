const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BillSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { _id: true }
);

const MonotributistaDataSchema = new Schema({
  activity: {
    type: String,
    enum: ['SERVICE_PROVISION', 'PRODUCTS_SALE'],
    required: true,
  },
  location: {
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  earnings: {
    type: Number,
    required: true,
  },
  hasShop: {
    type: Boolean,
    required: true,
  },
  shopDetails: {
    quantity: {
      type: Number,
    },
    area: {
      type: Number,
    },
    paysRental: {
      type: Boolean,
    },
    rentalValue: {
      type: Number,
    },
    consumedEnergy: {
      type: Number,
    },
  },
  category: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    required: true,
  },
  nextCategory: {
    type: String,
    enum: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'NOT'],
    required: true,
  },
  notMonotributista: {
    type: Boolean,
    required: true,
    default: false,
  },
  bills: [BillSchema],
});

module.exports = mongoose.model('MonotributistaData', MonotributistaDataSchema);
