module.exports = function (app, mongoose) {
    const tokenChecker = require('./tokenChecker')
    const User = mongoose.model('user', mongoose.Schema({
        email: String,
        name: String,
        username: String,
        attacco: Number, 
        difesa: Number, 
        spin: Number, 
        controllo: Number, 
        all_around: Number,
        rank: Number
    }));



}