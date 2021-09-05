'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String },
  homeLat: { type: String, required: true },
  homeLon: { type: String, required: true },
  workLat: { type: String},
  workLon: { type: String},
  curEmployer: { type: String },
  employerLoc: { type: String },
  curSalary: { type: Number},
  curRemote: { type: Boolean},
  commuteDist: { type: Number},
  milesPerGal: { type: Number},
  newJob: [{
    newSalary: { type: Number },
    newEmployer: { type: String },
    newRemote: { type: Boolean },
    newLocation: { type: String }
  }]
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
