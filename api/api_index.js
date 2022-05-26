//list of apis
const apiAuth = require('./google_login');
const apiTornei = require('./tornei');
const apiPrenotazioni = require('./prenotazioni');

module.exports = function(app,mongoose) {
  //app.use('',tokenChecker)
  apiAuth(app);
  apiTornei(app,mongoose);
  apiPrenotazioni(app,mongoose);
};



