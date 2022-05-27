module.exports = function (app) {
    const jwt = require('jsonwebtoken');
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
        //req.session.email=String(userProfile.emails[0].value);
        //cerca email nel db
        let user = await User.findOne({email: req.user.emails[0].value}).exec();
        if(!user){
            //email non trovata
            console.log(req.session.email + " non trovata");
            //apre pagina registrazione
            let path_name = ('pages/registrazione');
            
            res.render(path_name,{user: userProfile, session: req.session });
        }else{
            req.user.rank = user.rank
            let path_name = ('pages/profilo');
            res.render(path_name,{user: req.user});
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
    });

    app.get('/v1/profilo', (req, res) => {
        res.render('pages/profilo', { user: req.user });
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
        callbackURL: "https://pingpov.herokuapp.com/auth/google/callback"
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
            //Creazione del token
            // if user is found and password is right create a token
            var payload = {
                user: req.user,
                // other data encrypted in the token	
            }
            var options = {
                expiresIn: 86400 // expires in 24 hours
            }
            var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
            req.token = token
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.SUPER_SECRET,
              }).status(200).json({ message: token });
        });
    app.get('/v1/auth/logout',function(req, res){
        req.logout();
        res.render('pages/home.ejs',{ user : req.user})
    })
}
