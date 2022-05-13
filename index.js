//requiring express
const express = require('express');
//use session
const session = require('express-session');
//connection to db
const mongoose = require('mongoose');
//requiring passport for login states
global.passport = require('passport');

mongoose.connect('mongodb+srv://Hydran00:aaa@cluster0.5c9ts.mongodb.net/test');
global.path = require('path')

//declaring app
const app = express();
app.use(passport.initialize());

app.set('view engine', 'ejs');
app.use(require('body-parser').json());
//declaring session
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));
app.use(passport.session());
//get method for login
app.get('/auth', function(req, res) {
  res.render('pages/auth');
});


// Starting app after calling every api
require('./api/api_index')(app,mongoose);
app.listen(4000, () => {
    console.log('server started!');
  });


