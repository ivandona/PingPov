
module.exports = function (app) {
    //var used for storing profile information
    var userProfile;
    //result of logging
    
    app.get('/v1/auth/success', (req, res) => {
        if(userProfile.id){
            req.session.logged=true;
        }
        //req.session.nickname=GET_FROM_DB
        let path_name = ('pages/success');
        res.render(path_name,{user:userProfile,log_status:req.session.logged});
    })
    app.get('/v1/auth/error', (req, res) => res.send("error logging in"));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });
    const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    const GOOGLE_CLIENT_ID = ''
    const GOOGLE_CLIENT_SECRET = '';

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/google/callback"
    },
        function (accessToken, refreshToken, profile, done) {
            userProfile = profile;
            return done(null, userProfile);
        }
    ));

    app.get('/v1/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/auth/error' }),
        function (req, res) {
            // Successful authentication, redirect success.
            req.session.user = userProfile
            //console.log(req.session.user)
            //console.log(path.basename(path.dirname('api_index.js'))+'/views/pages/success')
            res.redirect('/auth/success');
        });
    app.get('/v1/auth/logout',function(req, res){
        req.session.log_status = false;
        req.session.username='';
        req.session.rank='';
    })
}