//list of apis
const apiBooks = require('./books');
const apiAuth = require('./google_login');
const apiTornei = require('./tornei');
const apiPrenotazioni = require('./prenotazioni');

module.exports = function(app,mongoose) {
  apiBooks(app,mongoose);
  apiAuth(app);
  apiTornei(app,mongoose);
  apiPrenotazioni(app,mongoose);
};



