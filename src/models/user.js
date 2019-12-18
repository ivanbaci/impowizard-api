const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fiscalData: {
    name: {
      type: String,
    },
    lastName: {
      type: String,
    },
    cuit: {
      type: String,
    },
  },
  fiscalCategory: {
    type: String,
    enum: ['MONOTRIBUTISTA', 'REL_DEPENDENCIA'],
  },
  monotributistaData: {
    type: Schema.Types.ObjectId,
    ref: 'MonotributistaData',
  },
  relDepData: {
    type: Schema.Types.ObjectId,
    ref: 'RelDepData',
  },
});

module.exports = mongoose.model('User', UserSchema);
