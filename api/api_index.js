//list of apis
const apiAuth = require('./google_login');
const apiTornei = require('./tornei');
const apiPrenotazioni = require('./prenotazioni');
const apiUsers = require('./users');
const apiModalità_di_gioco = require('./modalita_di_gioco');

module.exports = function(app,mongoose) {
  apiAuth(app);
  apiTornei(app,mongoose);
  apiPrenotazioni(app,mongoose);
  apiUsers(app,mongoose);
  apiModalità_di_gioco(app,mongoose);
};



