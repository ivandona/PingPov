module.exports = function (app) {
    const jwt = require('jsonwebtoken');
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const tokenChecker = require('./tokenChecker');
    //importa variabili nel file .env
    require('dotenv').config();
    //importa schema di User
    const User = require('./models/user');
    //var used for storing profile information
    var userProfile;
    //result of logging
    
    app.get('/v2/auth/success', async function (req, res) {
        //req.session.email=String(userProfile.emails[0].value);
        //cerca email nel db
        let user = await User.find({email: req.user.emails[0].value}).exec();
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
    app.get('/v2/auth/error', (req, res) => res.send("error logging in"));

    //POST per salvare dati nel db
    app.post('/v2/auth/registrazione',async (req, res) => {
        if (userProfile.displayName==null){
            return res.redirect('/v2/profilo');
        }
        let searchedUser = await User.findOne({displayName: userProfile.displayName});
        if(searchedUser !=null){
            return res.redirect('/v2/profilo');
        }
        const new_user = new User({
            email: userProfile.emails[0].value,
            displayName: userProfile.displayName,
            attacco: req.body.attacco,
            difesa: req.body.difesa,
            spin: req.body.spin,
            controllo: req.body.controllo,
            all_around: req.body.all_around,
            rank : 100
        })
        new_user.save().then(() => {return res.redirect('/v2/profilo');})
    });
    app.get('/v2/ricerca_profilo', async (req, res) => {
        let searchedUser = await User.findOne({ _id: req.query.id });
        res.render('pages/profilo', { searched_user: searchedUser, user: req.user });
    });
    app.get('/v2/profilo', tokenChecker, async function (req, res) {
        let mail;
        if(req.user.emails==null){
            mail = req.user.email
        }else{
            mail =req.user.emails[0].value
        } 
        let searchedUser = await User.findOne({email: mail});
        if(searchedUser==null){
            return res.render('pages/registrazione');
        }
        return res.render('pages/profilo', { searched_user: searchedUser, user:req.user });
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
        callbackURL: 'http://localhost:4000/auth/google/callback'//"https://pingpov.herokuapp.com/auth/google/callback"
    },
        function (accessToken, refreshToken, profile, done) {
            userProfile = profile;
            console.log(userProfile)
            return done(null, userProfile);
        }
    ));

    app.get('/v2/auth/google',
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
            console.log('token: '+token)
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.SUPER_SECRET,
            }).status(200).redirect('/v2/profilo');
        });
    app.get('/v2/auth/logout',function(req, res){
        req.user="";
        res.clearCookie("token").status(200).render('pages/home',{user:""});
    })
}
