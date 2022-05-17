// api/Prenotazione.js
module.exports = function (app, mongoose) {
    const Prenotazione = mongoose.model('prenotazione', mongoose.Schema({
        prenotatore: String,
        giorno: Date,
        sede: String
    }));

    //GET EVERY BOOK
    app.get('/prenotazioni', (req, res) => {
        console.log("efnsd");
        res.locals.query = req.query;

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
app.put('/aggiungiPrenotazione/:id',async function(req, res){
    //const ObjectID = require('mongoose').ObjectID;
 
    const id = req.params.id;
    const query = { 'id':id };
    const body = {
      prenotatore:req.body.prenotatore,
      giorno:req.body.giorno,
      sede:req.body.sede,
      utente:req.utente 
    };
    try{
    res.json(await Prenotazione.findById(id).update(req.params.prenotatore,body));
    }  
    catch (err) {
        console.error(`Error while updating programming language`, err.message);
        next(err);
      }
   

  
});
app.delete('/aggiungiPrenotazione/:id',async function(req, res){
    //const ObjectID = require('mongoose').ObjectID;
    console.log(req.session.user.displayName);
    console.log(req.body.prenotatore);
    if(' '+(req.session.user.displayName) == req.body.prenotatore){
    const id = req.params.id;
    const query = { 'id':id };
    const body = {
      prenotatore:'',
      
    };
    try{
    res.json(await Prenotazione.findById(id).update(req.params.prenotatore,body));
    }  
    catch (err) {
        console.error(`Error while updating programming language`, err.message);
        next(err);
      }
    }else{
        res.send("non puoi annullare la prentoazione di un'altra persona");
    }

  
});


//GET ONE BOOK
app.get('/Prenotazione/:id', (req, res) => {
    const id = req.params.id;
    console.log('id:' + id)
    Prenotazione.find({ "_id": id }, function (err, docs) { res.send(docs) })
});

//DELETE
app.delete('/Prenotazione/:id', (req, res) => {
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