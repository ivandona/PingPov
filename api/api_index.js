//list of apis

const apiBooks = require('./books');
const apiAuth = require('./google_login');
module.exports = function(app,mongoose) {
  apiBooks(app,mongoose);
  apiAuth(app);
};



