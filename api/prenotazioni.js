// api/Prenotazione.js
module.exports = function (app, mongoose) {
    const tokenChecker = require('./tokenChecker')
    const Prenotazione = mongoose.model('prenotazione', mongoose.Schema({
        prenotatore: String,
        giorno: Date,
        sede: String
    }));
    // restituisce un file json contenente tutte le prenotazioni corrispondenti alla ricerca effettuata
    app.get('/v2/prenotazioni',tokenChecker,async (req, res) => {
        req.query.username = req.user.displayName;
        res.user = req.user
        res.locals.query = req.query;
        Prenotazione.find({}, function (err, Prenotazioni) {
            if (err) {
                return res.status(404).send(err);
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
                return res.status(200).json(risultato)
            }
        })
    })

    // inserisce una prenotazione da parte dell'utente
    app.put('/v2/prenota/',tokenChecker, async function (req, res) {
        //const ObjectID = require('mongoose').ObjectID;
        const id = req.body.pre_id;
        if(!req.body.prenotatore || !id){
            return res.send(400).send('Errore, prenotatore non definito')
        }
        const query = { 'prenotatore': req.body.prenotatore };
        res.user = req.user
        const body = {
            prenotatore: req.body.prenotatore,
        };
        try {
            return res.status(200).json(await Prenotazione.findByIdAndUpdate(id, body));
            ("prenotazione riuscita");
        } catch (err) {
            console.error(`Errore nella prenotazione`, err.message);
            return res.status(404).send('Prenotazione non trovata')
        }
    });


    //elimina la prenotazione effettuata dall'utente
    app.delete('/v2/prenota/',tokenChecker, async function (req, res) {
        ("chiamata delete")
        const id = req.body.pre_id;
        res.user = req.user
        if(!req.user || !id){
            return res.status(400).send('Errore, prenotatore non definito')
        }
        const query = { 'id': id };
        const body = {
            prenotatore: req.body.prenotatore,
        };
        try {
            return res.status(200).json(await Prenotazione.findByIdAndUpdate(id, body));
        } catch (err) {
            return res.status(400);
        }

    })

    // fa il render della pagina delle prenotazioni
    app.get('/prenotazioni', tokenChecker, (req, res) => {
        return res.render('pages/prenotazioni/ricerca_prenotazioni', { user: req.user });
    }
    )
}