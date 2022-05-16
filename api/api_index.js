//list of apis
const apiBooks = require('./books');
const apiAuth = require('./google_login');
const apiTornei = require('./tornei');
const apiUsers = require('./users');
module.exports = function(app,mongoose) {
  apiBooks(app,mongoose);
  apiAuth(app);
  apiTornei(app,mongoose);
  apiUsers(app, mongoose);
};



