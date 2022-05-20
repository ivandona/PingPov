// api/Prenotazione.js
module.exports = function (app, mongoose) {
    const Prenotazione = mongoose.model('prenotazione', mongoose.Schema({
        prenotatore: String,
        giorno: Date,
        sede: String
    }));

    //GET EVERY BOOK
    app.get('/v1/prenotazioni', (req, res) => {
        
        req.query.username=req.session.user;
        res.locals.query=req.query
        console.log(res.locals.query);
        Prenotazione.find({}, function(err, Prenotazioni){
            if(err){
              console.log(err);
            } else{

                res.render('pages/ricerca_prenotazioni',{prenotazioni: Prenotazioni})
                console.log('retrieved list of names', Prenotazioni.length, Prenotazioni[0]);
            }
        })
    })

//PUT 
app.put('/v1/aggiungiPrenotazione/:id',async function(req, res){
    //const ObjectID = require('mongoose').ObjectID;
    const id = req.params.id;
    const query = { 'id':id };
  ;
    const body = {
      prenotatore: req.body.prenotatore,
      giorno: req.body.giorno,
      sede: req.body.sede
    };
    try{
    res.json(await Prenotazione.findById(id).update(req.params.prenotatore,body));
    }  catch (err) {
        console.error(`Iscrizione non riuscita`, err.message);
        next(err);
      }
   

  
});
//GET ONE BOOK
app.get('/v1/Prenotazione/:id', (req, res) => {
    const id = req.params.id;
    console.log('id:' + id)
    Prenotazione.find({ "_id": id }, function (err, docs) { res.send(docs) })
});

//DELETE
app.delete('/v1/Prenotazione/:id', (req, res) => {
    const ObjectID = require('mongoose').ObjectID;
    const id = req.params.id;
    const query = { '_id': new ObjectID(id) };
    Prenotazione.find({ "_id": id }, function (err, docs) {
        if (docs.organizzatore == req.session.username) {
            Prenotazione.findByIdAndRemove(id, function (docs, err) {
                if (err) {
                    res.send('Prenotazione non trovato')
                } else {
                    res.send('Prenotazione correttamente cancellato')
                }
            });
        } else {
            res.send("Non sei tu l'organizzatore")
        }
    })

})
}