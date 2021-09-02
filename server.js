'use strict';

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/remote-rate', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to the database');
});

require('dotenv').config();

const UserModel = require('./models/users.js');
const PORT = process.env.PORT;

// const fuel = require('./modules/fuel.js');

// app.get('/fuel', fuelHandler);

app.get('/seed', seed);

// function fuelHandler(request, response) {
//   const { lat, lon } = request.query;
//   fuel(lat, lon)
//     .then(avgFuel => response.send(avgFuel))
//     .catch((error) => {
//       console.error(error);
//       response.status(200).send('Sorry. Something went wrong!');
//     });
// }

function seed(request, response) {
  let users = UserModel.find({});
  if (users.length < 3) {
    let user1 = new UserModel({
      email: 'phillipdeanmurphy@gmail.com',
      homeAddress: '123 Main St. Atlanta, GA',
      curEmployer: 'Dr. Robotnik Labs',
      employerLoc: '456 IHateSonic Dr. Hooville, MD',
      curSalary: 85000,
      curRemote: false,
      commuteDist: 18,
      milesPerGal: 27,
      newSalary: { type: Number },
      newEmployer: { type: String },
      newRemote: { type: Boolean },
      newLocation: { type: String }
    });
    user1.save();

    let user2 = new UserModel({
      email: 'phillipdeanmurphy@gmail.com',
      homeAddress: '123 Main St. Atlanta, GA',
      curEmployer: 'Dr. Robotnik Labs',
      employerLoc: '456 IHateSonic Dr. Hooville, MD',
      curSalary: 85000,
      curRemote: false,
      commuteDist: 18,
      milesPerGal: 27,
      newSalary: 90000,
      newEmployer: 'Sonic & Tails Inc.',
      newRemote: false,
      newLocation: 'Emerald City'
      });
    user2.save();
  }
  response.send('Seeded The Database');
}

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
