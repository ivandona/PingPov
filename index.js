//requiring express
const express = require('express');
const { MongoTailableCursorError } = require('mongodb');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./pingpov.json');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
/*const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PingPov',
      version: '1.0.0',
    },
  },
  apis: ['./api/*'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);*/
const tokenChecker = require('./api/tokenChecker');
const mongoose = require('mongoose');
//requiring passport for login states
global.passport = require('passport');
require('dotenv').config()


global.path = require('path')

//declaring app
const app = express();
//const tokenChecker = require('./api/tokenChecker.js')

//connection to db
const MongoStore = require('connect-mongo');
global.path = require('path');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(passport.initialize());
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(require('body-parser').json());
app.use(cookieParser())

//get method for login
app.get('/v2/auth', function (req, res) {
  res.render('pages/auth', { user:req.user });
});
app.get('/v2/home', function (req, res) {
  res.render('pages/home', { user:req.user });
});
app.use('/v2/prenotazioni', tokenChecker);
function requireAutentication(req, res, next) {
  if (req.isAuthenticated() == true || req.originalUrl.includes('/auth')) {
    next();
  } else {
    res.render('pages/auth', { user: req.user });
  }
}
app.get('/', function (req, res) {
  res.redirect('/v2/home');
});

require('./api/api_index')(app, mongoose);

module.exports = app;
