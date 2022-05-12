// index.js
const express = require('express');
//connection to db
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Hydran00:aaa@cluster0.5c9ts.mongodb.net/test');
const path = require('path')
const app = express();
// parse application/json
app.use(require('body-parser').json());
app.get('/home',(req, res) => {
  console.log(path.join(__dirname, 'views/index.html'))
  res.sendFile(path.join(__dirname, 'views/index.html'))
})
// register endpoints
require('./api/index')(app, mongoose);
app.listen(3000, () => {
    console.log('server started!');
  });
