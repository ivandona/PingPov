// api/Prenotazione.js
module.exports = function (app, mongoose) {
    const tokenChecker = require('./tokenChecker')
    const Prenotazione = mongoose.model('prenotazione', mongoose.Schema({
        prenotatore: String,
        giorno: Date,
        sede: String
    }));
    // restituisce un file json contenente tutte le prenotazioni corrispondenti alla ricerca effettuata
    app.get('/v2/prenotazioni', (req, res) => {
        console.log(req.user)
        req.query.username = req.user.displayName;
        res.user = req.user
        res.locals.query = req.query;
        Prenotazione.find({}, function (err, Prenotazioni) {
            if (err) {
                res.status(404).send(err);
            } else {
                risultato = [];
                for (i = 0; i < Prenotazioni.length; i++) {
                    if (Prenotazioni[i]['sede'] == req.query['sede']) {
                        day = new Date(Date.parse(req.query['data'] + 'T' + req.query['ora'] + ':00'))
                        if (day < Prenotazioni[i]['giorno']) {
                            risultato.push(Prenotazioni[i]);
                        }
                    }

                }
                res.status(200).json(risultato)
            }
        })
    })

    // inserisce una prenotazione da parte dell'utente
    app.put('/v2/prenota/', async function (req, res) {
        //const ObjectID = require('mongoose').ObjectID;
        const id = req.body.pre_id;
        const query = { 'prenotatore': req.body.prenotatore };
        res.user = req.user
        console.log(id);
        console.log(req.body.prenotatore)
        const body = {
            prenotatore: req.body.prenotatore,
        };
        try {
            res.send(200).json(await Prenotazione.findByIdAndUpdate(id, body));
            console.log("prenotazione riuscita");
        } catch (err) {
            console.error(`Errore nella prenotazione`, err.message);
            next(err);
        }



    });


    //elimina la prenotazione effettuata dall'utente
    app.delete('/v2/prenota/', async function (req, res) {
        console.log("chiamata delete")
        const id = req.body.pre_id;
        res.user = req.user
        const query = { 'id': id };
        const body = {
            prenotatore: req.body.prenotatore,
        };
        try {
            res.status(200).json(await Prenotazione.findByIdAndUpdate(id, body));

            console.log("rimozione prenotazione riuscita");
        } catch (err) {
            console.error(`Errore nella rimozione della prenotazione`, err.message);
            next(err);
        }

    })

    // fa il render della pagina delle prenotazioni
    app.get('/prenotazioni', tokenChecker, (req, res) => {
        res.render('pages/prenotazioni/ricerca_prenotazioni', { user: req.user });
    }
    )
}