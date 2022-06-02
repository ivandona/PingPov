//list of apis
const apiAuth = require('./google_login');
const apiTornei = require('./tornei');
const apiPrenotazioni = require('./prenotazioni');
const apiModalità_di_gioco = require('./modalita_di_gioco');
const apiRanking = require('./ranking');

module.exports = function(app,mongoose) {
  apiAuth(app);
  apiTornei(app,mongoose);
  apiPrenotazioni(app,mongoose);
  apiModalità_di_gioco(app,mongoose);
  apiRanking(app,mongoose);

};



