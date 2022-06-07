const express =require('express');
const app = express();

const apiAuth = require('./google_login');
const apiTornei = require('./tornei');
const apiPrenotazioni = require('./prenotazioni');
const apiModalità_di_gioco = require('./modalita_di_gioco');
const apiRanking = require('./ranking');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})  

module.exports = app;
