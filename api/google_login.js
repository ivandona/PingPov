
module.exports = function (app) {
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    //importa variabili nel file .env
    require('dotenv').config();
    //importa schema di User
    const User = require('./user');
    //var used for storing profile information
    var userProfile;
    //result of logging
    
    app.get('/v1/auth/success', async function (req, res) {
        req.session.email=String(userProfile.emails[0].value);
        //cerca email nel db
        let user = await User.findOne({email: req.session.email}).exec();
        if(!user){
            //email non trovata
            console.log(req.session.email + " non trovata");
            req.session.logged=true;
            //apre pagina registrazione
            let path_name = ('pages/registrazione');
            res.render(path_name,{user: userProfile, log_status: req.session.logged});
        }else{
            //email trovata
            console.log(req.session.email + " email trovata");
            req.session.logged=true;
            req.session.username=userProfile.displayName;
            //apre pagina success
            let path_name = ('pages/success');
            res.render(path_name,{user:userProfile,log_status:req.session.logged});
        }
        
    });
    app.get('/v1/auth/error', (req, res) => res.send("error logging in"));

    //POST per salvare dati nel db
    app.post('/v1/auth/registrazione', (req, res) => {
        const new_user = new User({
            email: userProfile.emails[0].value,
            name: userProfile.displayName,
            username: req.body.username,
            attacco: req.body.attacco,
            difesa: req.body.difesa,
            spin: req.body.spin,
            controllo: req.body.controllo,
            all_around: req.body.all_around
        })
        new_user.save().then(() => console.log('user inserito'));
        res.redirect('/v1/auth/success');
        /*req.session.logged=true;
        req.session.username=userProfile.displayName;
        let path_name = ('pages/success');
        res.render(path_name,{user:userProfile,log_status:req.session.logged});*/
    });

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });
    const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
            res.redirect('/v1/auth/success');
        });
    app.get('/v1/auth/logout',function(req, res){
        req.session.log_status = false;
        req.session.user='';
        req.session.rank='';
        res.render('pages/home.ejs')
    })
}