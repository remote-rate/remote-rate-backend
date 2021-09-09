'use strict';

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());
require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to the database');
});


const UserModel = require('./models/users.js');
const PORT = process.env.PORT;

const jwt = require('jsonwebtoken');

// all of this came from jsonwebtoken docs
// ---------------------------------------
var jwksClient = require('jwks-rsa');
const { response } = require('express');
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

app.get('/landing', (request, response) => {

  try {
    const token = request.headers.authorization.split(' ')[1];
    jwt.verify(token, getKey, {}, function (err, user) {
      if (err) {
        response.status(500).send('invlaid token');
      }
      response.send(user);
    });
  } catch (err) {
    response.status(500).send('Auth0 Error')
  }
});
app.get('/profile', (request, response) => {
  try {
    UserModel.find({}, (error, userData) => {
      response.status(200).send(userData);
    })
  } catch (error) {
    response.status(500).send(error);
  }
})
app.post('/profile', (request, response) => {
  try {
    let { email, homeLat, homeLon, curEmployer, curSalary, curRemote, commuteDist, newCommuteTime, milesPerGal } = request.body;
    let newUser = new UserModel({ email, homeLat, homeLon, homeLat, homeLon, curEmployer, curSalary, curRemote, commuteDist, newCommuteTime, milesPerGal });
    newUser.save();
    response.status(200).send('user added!');
  } catch (err) {
    response.status(500).send('Error in server');
  }
});
app.put('/newoffer/:id', async (request, response) => {
  try {
    const id = request.params.id;
    let updateUser = await UserModel.findByIdAndUpdate(id, request.body, { new: true, overwrite: true });
    response.status(200).send(updateUser);
  } catch (err) {
    response.status(500).send('Error in server when adding offer');
  }
});

app.put('/profile/:id', async (request, response) => {
  const id = request.params.id;
  const offer = await UserModel.findByIdAndUpdate(id, request.body, { new: true, overwrite: true});
  response.status(200).send('Deleted');
});

app.get('/clear', clear);

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
