//list of apis
const apiAuth = require('./google_login');
const apiTornei = require('./tornei');
const apiPrenotazioni = require('./prenotazioni');
<<<<<<< HEAD
const apiUsers = require('./users');

=======
const apiModalità_di_gioco = require('./modalita_di_gioco');
>>>>>>> origin/modalita_di_gioco

module.exports = function(app,mongoose) {
  apiAuth(app);
  apiTornei(app,mongoose);
  apiPrenotazioni(app,mongoose);
<<<<<<< HEAD
  apiUsers(app,mongoose);
=======
  apiModalità_di_gioco(app,mongoose);
>>>>>>> origin/modalita_di_gioco
};



