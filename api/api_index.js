//list of apis
const apiAuth = require('./google_login');
const apiTornei = require('./tornei');
const apiPrenotazioni = require('./prenotazioni');
<<<<<<< HEAD
=======

>>>>>>> 34a631da2a8fba20e0202433fbb2235354a30b65

module.exports = function(app,mongoose) {
  apiAuth(app);
  apiTornei(app,mongoose);
  apiPrenotazioni(app,mongoose);
};



