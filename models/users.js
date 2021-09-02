'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  homeAddress: { type: String, required: true },
  curEmployer: { type: String},
  employerLoc: { type: String, required: true },
  curSalary: { type: Number, required: true },
  curRemote: { type: Boolean, required: true},
  commuteDist: { type: Number, required: true},
  milesPerGal: { type: Number, required: true},
  newSalary: { type: Number },
  newEmployer: { type: String },
  newRemote: { type: Boolean },
  newLocation: { type: String }
});

const BookModel = mongoose.model('user', userSchema);

module.exports = BookModel;
