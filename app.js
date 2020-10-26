'use strict';

const express = require('express');
const app = express();
const morgan = require('morgan');
const usersRoute = require('./routes');
module.exports = app; // this line is only used to make testing easier.

// remember to plug in your router and any other middleware you may need here.
app.use(morgan('dev'));
app.use(express.json());

app.use('/users', usersRoute);

if (!module.parent) app.listen(3000, () => {
  console.log('Server is listening on port 3000!');
}); // conditional prevents a very esoteric EADDRINUSE issue with mocha watch + supertest + npm test.
