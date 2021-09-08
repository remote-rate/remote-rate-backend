# remote-rate-backend

## Contributors:

* Charlie Fadness
* Zach Winterton
* Quentin Young
* Phil Murphy

## Overview

Remote Rate on the server end takes in inforamtion from the front end to save it to mongoDB. From here we can access the data and send it back to the front end to be used and shown to the user. We make use of CRUD on the Database to future customize for maximum usability.

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->

- Pull down/clone the Repo
- Do `npm i` to install all the nessessary packages inside this server file while in your terminal
- Create a .env file
  - Follow the sample.env for reference
  - Place your key:
    - PORT=
- Run `npm start` or using the package `npx nodemon`

- PC Users
  - You need to run mongoose `sudo mongod --dbpath db` on a seperate terminal

- [Heroku Link]()

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->

- Express
- Cors
- Dotenv
- Node.js
- JSON
- MongoDB
- Auth0

## Change Log
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an example:

01-01-2001 4:59pm - Application now has a fully-functional express server, with a GET route for the location resource. -->

## Credit and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->

- [Auth0 Docs](https://auth0.com/docs)
- [Heroku](https://www.heroku.com/)

