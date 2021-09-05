'use strict';

// install first
// require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());

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


const jwt = require('jsonwebtoken');

// all of this came from jsonwebtoken docs
// ---------------------------------------
var jwksClient = require('jwks-rsa');
const { response } = require('express');
const { setMaxListeners } = require('./models/users.js');
var client = jwksClient({
  // EXCEPTION!  jwksUri comes from your single page application -> settings -> advanced settings -> endpoint -> the jwks one
  jwksUri: 'https://dev-cb3cs25j.us.auth0.com/.well-known/jwks.json'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}
// ---------------------------------------

// ---- testing endpoints ----- //
app.get('/landing', (request, response) => {

  // TODO: 
  // STEP 1: get the jwt from the headers
  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken
  // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end

  try {
    const token = request.headers.authorization.split(' ')[1];
    jwt.verify(token, getKey, {}, function (err, user) {
      if (err) {
        response.status(500).send('invlaid token');
      }
      console.log('user: ', user);
      response.send(user);
    });
  } catch (err) {
    console.log('auth0 error', err)
    response.status(500).send('Auth0 Error')
  }
});
app.get('/profile', (request, response) => {
  try {
      UserModel.find({}, (error, userData) => {
        console.log(userData);
        response.status(200).send(userData);
      })
  } catch (error) {
    response.status(500).send(error);
  }
})
app.post('/profile', (request, response) => {
  try {
    let { 
      email,
      homeLat,
      homeLon,
      curEmployer,
      curSalary,
      curRemote,
      commuteDist,
      milesPerGal,
      newJob: {
        newSalary,
        newEmployer,
        newRemote,
        newLocation,
        workLat,
        workLon
      } } = request.body;


    let newUser = new UserModel({ 
      email, 
      homeLat, 
      homeLon, 
      curEmployer, 
      curSalary, 
      curRemote, 
      commuteDist, 
      milesPerGal,
      newJob: {
        newSalary,
        newEmployer,
        newRemote,
        newLocation,
        workLat,
        workLon, }
      })

    newUser.save();
    console.log('inside Post', newUser);
    response.status(200).send('user added!');
  } catch (err) {
    response.status(500).send('Error in server');
  }
});
app.put('/newoffer/:id', async(request, response) => {
  try {
    console.log('this is a new offer inside PUT', request.body);
    const id = request.params.id;
    console.log('id', id);

    // let updateUser = await UserModel.findByIdAndUpdate(id, request.body, { new: true, overwrite: true });

    let updateUser = await UserModel.find(
      { _id: id },
    );

    console.log('before retrievedUser ', updateUser);
    updateUser.newJob = request.body
    console.log('after retrievedUser ', updateUser.newJob); 
    console.log('after retrievedUser whole', updateUser); 

    response.status(200).send(updateUser);
  } catch (err) {
    response.status(500).send('Error in server when adding offer');
  }
});


app.get('/seed', seed);
app.get('/clear', clear);


// Functions
async function seed(request, response) {
  let users = await UserModel.find({});
  console.log('seed length', users.length, 'users', users)
  if (users.length < 3) {
    let user1 = new UserModel({
      email: process.env.EMAIL,
      homeLat: 32.1656,
      homeLon: 82.9001,
      homeAddress: '123 Main St. Atlanta, GA',
      curEmployer: 'Dr. Robotnik Labs',
      employerLoc: '456 IHateSonic Dr. Hooville, MD',
      curSalary: 85000,
      curRemote: false,
      commuteDist: 18,
      milesPerGal: 27,
      newJob: [{
        newSalary: 50,
        newEmployer: 'Google',
        newRemote: false,
        newLocation: 'seattle, wa',
      }]
    });
    user1.save();

    let user2 = new UserModel({
      email: process.env.EMAIL,
      homeLat: 32.1656,
      homeLon: 82.9001,
      homeAddress: '123 Main St. Atlanta, GA',
      curEmployer: 'Georgia Peaches',
      employerLoc: 'Atlanta, GA',
      curSalary: 85000,
      curRemote: false,
      commuteDist: 18,
      milesPerGal: 27,
      newJob: [{
        newSalary: 90000,
        newEmployer: 'Sonic & Tails Inc.',
        newRemote: false,
        newLocation: 'Emerald City'
      }]
    });
    user2.save();

    let user3 = new UserModel({
      email: process.env.EMAIL,
      homeLat: 47,
      homeLon: 122,
      curEmployer: 'Google',
      employerLoc: 'Seattle, WA',
      curSalary: 50000,
      curRemote: false,
      commuteDist: 30,
      milesPerGal: 20,
      newJob: [{
        newSalary: 100000,
        newEmployer: 'AWS',
        newRemote: false,
        newLocation: 'Seattle'
      }]
    })
    user3.save();

  }
  response.send('Seeded The Database');
}
async function addUser(obj) {
  let newUser = new UserModel(obj);
  return await newUser.save();
}
async function clear(request, response) {
  try {
    await UserModel.deleteMany({});
    response.status(200).send('Bombed the DBase');
  }
  catch (err) {
    response.status(500).send('Error in clearing database');
  }
}

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
