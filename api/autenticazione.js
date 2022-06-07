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
            return res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
        }
        // password non fornita
        if (!req.body.password) {
            return res.status(400).json({ success: false, message: 'Authtentication failed. No password provided' });
        }
        // password non presente nel db
        if (user.password == null || user.password == '') {
            return res.status(400).json({ success: false, message: 'Authtentication failed. Login con questa email consentito solo tramite google' })
        }
        // check if password matches
        if (user.password != req.body.password) {
            return res.status(406).json({ success: false, message: 'Authentication failed. Wrong password.' });
        }
        
        // if user is found and password is right create a token
        var payload = {
            user: user
            // other data encrypted in the token	
        }
        var options = {
            expiresIn: 86400 // expires in 24 hours
        }
        var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        return res.status(200).json({
            success: true,
            secure: process.env.SUPER_SECRET,
            token: token
        });
    });
    app.post('/autenticazione', async function(req, res) {
        let email = req.body.email;
        console.log(req.body)
        // find the user
        let password = req.body.password;
        let user = await User.findOne({
            email: email
        }).exec();
        // user not found
        if (!user) {
            return res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
        }
        // password non fornita
        if (!password) {
            return res.status(400).json({ success: false, message: 'Authtentication failed. No password provided' });
        }
        // password non presente nel db
        if (user.password == null || user.password == '') {
            return res.status(400).json({ success: false, message: 'Authtentication failed. Login con questa email consentito solo tramite google' })
        }
        // check if password matches
        if (user.password != password) {
            return res.status(406).json({ success: false, message: 'Authentication failed. Wrong password.' });
        }
        
        // if user is found and password is right create a token
        var payload = {
            user: user
            // other data encrypted in the token	
        }
        var options = {
            expiresIn: 86400 // expires in 24 hours
        }
        var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        return res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: process.env.SUPER_SECRET,
        }).status(200).redirect('/v2/profilo');
    });
}