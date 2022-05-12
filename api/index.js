// api/index.js
const apiBooks = require('./books');
module.exports = function(app,mongoose) {
  apiBooks(app,mongoose);
 // other routes
};