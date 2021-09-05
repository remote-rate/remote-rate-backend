'use strict';

// install first
// require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());

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
      response.status(200).send(userData);
    })
  } catch (error) {
    response.status(500).send(error);
  }
})


// app.put('/newoffer/:id', async(request, response) => {
//   try {
//     console.log('this is a new offer', request.body);
//     const id = request.params.id;

//     let updatedUser = await UserModel.findByIdAndUpdate(
//       id,
//       { newJob: request.body },
//       { new: true, overwrite: true }
//     );
//     response.status(200).send(updatedUser);
//   } catch (err) {
//     response.status(500).send('Error in server when adding offer');
//   }
// });


app.put('/newoffer/:id', async (request, response) => {
  try {
    console.log('this is a new offer', request.body);
    const id = request.params.id;

    let retrievedUser = await UserModel.find(
      { _id: id },

    );
    console.log('before retrievedUser ', retrievedUser.newJob);
    retrievedUser.newJob = request.body
    console.log('after retrievedUser ', retrievedUser.newJob);

    response.status(200).send(retrievedUser);
  } catch (err) {
    response.status(500).send('Error in server when adding offer');
  }
});

// app.post('/profile', async (request, response) => {
//   let { newSalary, newEmployer, newRemote, newLocation, workLat, workLon } = request.body;
//   try {
//     let updatedUser = await UserModel.findByIdAndUpdate(
//       id,
//       { newSalary, newEmployer, newRemote, newLocation, workLat, workLon },
//       { new: true, overwrite: true }
//     );
//     response.status(200).send(updatedUser);
//   } catch (err) {
//     response.status(500).send("Error updating the books information");
//   }
// })

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



class Offer {
  constructor(data) {
    this.newSalary = data.newSalary;
    this.newEmployer = data.newEmployer;
    this.newRemote = data.newRemote;
    this.newLocation = data.newLocation;
  }
}

// app.post('/profile', (request, response) => {
//   try {
//     let { email, homeLat, homeLon, curEmployer, curSalary, curRemote, commuteDist, milesPerGal } = request.body;
//     let newUser = new UserModel({ email, homeLat, homeLon, curEmployer, curSalary, curRemote, commuteDist, milesPerGal });
//     newUser.save();
//     console.log(newUser);
//     response.status(200).send('user added!');
//   } catch (err) {
//     response.status(500).send('Error in server');
//   }
// });

// app.post('./newoffer', (request, response) => {
//   try {
//     let {newSalary, newEmployer, newRemote, newLocation, workLat, workLon, } = request.body;
//   new UserModel({
//     newJob: [
//       newSalary,
//       newEmployer,
//       newRemote,
//       newLocation,
//       workLat,
//       workLon,
//     ]
//   })
// } catch (error) {
//   console.log(error)
// }

// })









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
app.get('/clear', clear);

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
