const User = require('./models/user'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// ---------------------------------------------------------
// da rivedere
// ---------------------------------------------------------

module.exports = function(app) {
    // ---------------------------------------------------------
    // route to authenticate and get a new token
    // ---------------------------------------------------------
    app.post('/v2/autenticazione', async function(req, res) {
        
        // find the user
        let user = await User.findOne({
            email: req.body.email
        }).exec();
        
        // user not found
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        }
        
        // check if password matches
        if (user.password != req.body.password) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        }
        
        // if user is found and password is right create a token
        var payload = {
            user: req.user
            // other data encrypted in the token	
        }
        var options = {
            expiresIn: 86400 // expires in 24 hours
        }
        var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.SUPER_SECRET,
        }).status(200).redirect('/v2/home');
    });
}