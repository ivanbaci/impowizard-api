const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
});

module.exports = mongoose.model('MonotributistaData', MonotributistaDataSchema);
