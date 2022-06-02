module.exports = function (app, mongoose) {
    const tokenChecker = require('./tokenChecker')
    const User = require('./user');
 
            

app.get('/v2/ranking', async function (req, res){
            
            User.find({}).sort( {rank:-1} ).then(function (result, err) {
                if(err){
                    res.status(404).send("Errore nella ricerca dei rank");
                    console.log(err);
                }
                else{
                    res.status(200).json(result)
                }
            });
     });
        
app.get('/ranking',(req, res) => {
    
    res.status(200).render('pages/leaderboard', { user: req.user })



});

}