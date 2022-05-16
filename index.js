//requiring express
const express = require('express');
//use session
const session = require('express-session');

const mongoose = require('mongoose');
//requiring passport for login states
global.passport = require('passport');
//db credentials
require('dotenv').config()
//console.log(process.env) // remove this after you've confirmed it working
/*var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];*/
//declaring app
const app = express();
//connection to db
mongoose.connect(process.env.DB_URL);
global.path = require('path');

app.use(passport.initialize());
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(require('body-parser').json());
//declaring session
app.use(session({
  resave: false,
  saveUninitialized: true,
  logged:false,
  username:'',
  rank:'',
  secret: 'thisismysecret' 
}));
app.use(passport.session());
//get method for login
app.get('/auth', function(req, res) {
  res.render('pages/auth');
});
app.get('/home', function(req, res) {
  res.render('pages/home');
});
function requireAutentication(req,res,next){
  if(req.session.logged == true || req.originalUrl.includes('/auth')){
      next();
  }else{
      res.render('pages/auth');
  }
}
//app.all('*',requireAutentication)

// Starting app after calling every api
require('./api/api_index')(app,mongoose);
app.listen(4000, () => {
  console.log('server started!');
});


