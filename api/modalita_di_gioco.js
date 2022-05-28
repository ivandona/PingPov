const user = require('./user');

// api/tornei.js
module.exports = function (app, mongoose) {
    const tokenChecker = require('./tokenChecker')
    const Match = mongoose.model('Match', mongoose.Schema({
        squadra1: [String],
        squadra2: [String],
        organizzatore: String,
        data: Date,
        sede: { type: String, enum: ['Povo1', 'Povo0'] },
        risultato: {
            score_sq1: { type: Number, default: 0 },
            score_sq2: { type: Number, default: 0 }
        },
        modalità: { type: String, enum: ['Singolo', 'Doppio'] }
    }));

    app.post('/v2/match', tokenChecker, (req, res) => {
        //let day=new Date(Date.parse(req.body.data + 'T' +req.query['ora'] +':00'))
        let current_date_ms = Date.now();
        let req_data_ms = Date.parse(req.body.data);
        if (req.body.modalità != 'Singolo' && req.body.modalità != 'Doppio') {
            res.status(403).send('Modalità specificata diversa tra quelle disponibili (Singolo,Doppio)').end();
            return;
        }
        if (req.body.sede != 'Povo0' && req.body.sede != 'Povo1') {
            res.status(403).send('Sede specificata diversa tra quelle disponibili (Povo0,Povo1)').end();
            return;
        }
        let nuovo_match = new Match();
        nuovo_match.squadra1.push(req.user.displayName);
        nuovo_match.organizzatore = req.user.displayName;
        nuovo_match.data = req.body.data;
        nuovo_match.sede = req.body.sede;
        nuovo_match.modalità = req.body.modalità;
        nuovo_match.save().then(() => console.log('Match salvato'));
        res.status(200).send(nuovo_match).end();
        return;

    })
    app.get('/v2/match', async function (req, res) {
        Match.find({}, function (err, match) {
            if (err) {
                res.status(404).send(err)
            } else {
                res.status(200).send(match)
            }
        })
    })
    app.delete('/v2/match/:id', tokenChecker, async function (req, res) {
        let id = req.params.id;
        Match.findOne({ _id: id }).lean().then(async (match, err) => {
            if (err) {
                res.status(404).send('Match non trovato')
                return
            }
            if (match.organizzatore == req.user.displayName) {
                Match.findByIdAndRemove(id, function (err, docs) {
                    res.status(200).send('Match correttamente cancellato')
                })
            } else {
                res.status(401).send("Non sei tu l'organizzatore")
            }
        })
    })
    app.post('/v2/iscrizione-match/:id', tokenChecker, async function (req, res) {
        let id = req.params.id;
        Match.findOne({ _id: id }).lean().then(async (match, err) => {
            if (err) {
                return res.status(404).send('Match non trovato')
            }
            if (match.squadra1.includes(req.user.displayName) || match.squadra2.includes(req.user.displayName)) {
                return res.status(403).send('Sei gia iscritto a questo match');
            }
            else {
                let max_size;
                if (match.modalità == 'Singolo') {
                    max_size = 1
                } else {
                    max_size = 2;
                }
                //controllo numero giocatori
                if (match.squadra1.length < max_size) {
                    await Match.findById(id).updateOne({ $push: { squadra1: req.user.displayName } });
                    return res.status(200).send('Iscrizione avvenuta in squadra #1')
                }
                else {
                    if (match.squadra2.length < max_size) {
                        await Match.findById(id).updateOne({ $push: { squadra2: req.user.displayName } });
                        return res.status(200).send('Iscrizione avvenuta in squadra #2')
                    } else {
                        return res.status(403).send('Match già al completo')
                    }
                }
            }
        })

    })
    app.delete('/v2/iscrizione-match/:id', tokenChecker, async function (req, res) {
        let id = req.params.id;
        Match.findOne({ _id: id }).lean().then(async (match, err) => {
            if (err) {
                return res.status(404).send('Match non trovato')
            }
            if (match.squadra1.includes(req.user.displayName)){
                await Match.findById(id).updateOne({ $pull: { squadra1: req.user.displayName } });
                return res.status(200).send('Disiscrizione match completata');
            }
            if (match.squadra2.includes(req.user.displayName)){
                await Match.findById(id).updateOne({ $pull: { squadra1: req.user.displayName } });
                return res.status(200).send('Disiscrizione match completata');
            }
            return res.status(200).send('Non sei iscritto a questo match');
        })
    })
    //FRONT END
    app.get('/match', tokenChecker, (req, res) => {
        res.render('pages/matchlist', { user: req.user })
    })
}