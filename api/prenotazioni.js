// api/Prenotazione.js
module.exports = function (app, mongoose) {
    const Prenotazione = mongoose.model('prenotazione', mongoose.Schema({
        prenotatore: String,
        giorno: Date,
        sede: String
    }));

    app.get('/v1/prenotazioni', (req, res) => {
        console.log(req.user)
        req.query.username = req.session.user;
        res.locals.query = req.query;
        Prenotazione.find({}, function (err, Prenotazioni) {
            if (err) {
                console.log(err);
            } else {

                res.send({ session: req.session, prenotazioni: Prenotazioni })
                console.log('retrieved list of names', Prenotazioni.length, Prenotazioni[0]);
            }
        })
    })

    //PUT 
    app.put('/v1/aggiungiPrenotazione/:id', async function (req, res) {
        //const ObjectID = require('mongoose').ObjectID;
        const id = req.params.id;
        const query = { 'id': id };
        ;
        const body = {
            prenotatore: req.body.prenotatore,
            giorno: req.body.giorno,
            sede: req.body.sede
        };
        try {
            res.json(await Prenotazione.findById(id).update(req.params.prenotatore, body));
            console.log("prenotazione riuscita");
        } catch (err) {
            console.error(`Errore nella prenotazione`, err.message);
            next(err);
        }



    });


    //DELETE
    app.delete('/v1/rimuoviPrenotazione/', async function (req, res) {
        const id = req.body.id;
        const query = { 'id': id };
        const body = {
            prenotatore: req.body.prenotatore,
        };
        try {
            res.json(await Prenotazione.findById(id).update(req.params.prenotatore, body));
            
            console.log("rimozione prenotazione riuscita");
        } catch (err) {
            console.error(`Errore nella rimozione della prenotazione`, err.message);
            next(err);
        }

    })


app.get('/prenotazioni',(req, res)=>{

    res.render('pages/ricerca_prenotazioni',req.session);




}
)
}