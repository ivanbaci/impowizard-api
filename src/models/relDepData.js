const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReceiptSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const RelDepDataSchema = new Schema({
  location: {
    province: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  salary: {
    type: Number,
    required: true,
  },
  sonsQuantity: {
    type: Number,
    required: true,
  },
  isMarried: {
    type: Boolean,
    required: true,
  },
  paysRental: {
    type: Boolean,
    required: true,
  },
  rentalValue: {
    type: Number,
  },
  receipts: [ReceiptSchema],
});

module.exports = mongoose.model('RelDepData', RelDepDataSchema);
