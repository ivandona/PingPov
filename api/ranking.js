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

    app.get('/v2/ranking', (req, res) => {
        console.log(req.user)
        req.query.username = req.session.user;
        res.user=req.session.user
        res.locals.query = req.query;
        
        
        
        r1 = User.findOne({username : match.squadra1[0]})
        r2 = User.findById({username : match.squadra1[0]})
        
        media = Math.floor((r1+r2)/2);
        p1= req.body.score_sq1;
        p2=req.body.score_sq2;
        add= (Math.pow(Math.abs(p1-p2),2))/(10*(Math.pow((p1+p2),2))) * media;
        User.findById()
    })


}