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
require('./api/api_index')(app,mongoose);
app.listen(4000, () => {
    console.log('server started!');
  });


