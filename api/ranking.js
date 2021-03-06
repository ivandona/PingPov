module.exports = function (app, mongoose) {
    const tokenChecker = require('./tokenChecker')
    const User = require('./models/user');
    
    
    // Restituisce un json contenente gli utenti ordinati per rank discendente
    app.get('/v2/ranking', async function (req, res) {
        User.find({}).select('-password').sort({ rank: -1 }).then(function (result, err) {
            if (err) {
                res.status(500).send("Errore nella ricerca dei rank");
                console.log(err);
            }
            else {
                res.status(200).json(result)
            }
        });
    })
    
    // viene chiamata per il render della pagina in cui si visualizza la leaderboard      
    app.get('/ranking', (req, res) => {
        res.status(200).render('pages/leaderboard', { user: req.user })
    });

}