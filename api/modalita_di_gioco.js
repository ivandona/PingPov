const user = require('./user');

// api/tornei.js
module.exports = function (app, mongoose) {
    const tokenChecker = require('./tokenChecker');
    const Match = mongoose.model('Match', mongoose.Schema({
        squadra1: [String],
        squadra2: [String],
        organizzatore: String,
        data: Date,
        sede: { type: String, enum: ['Povo1', 'Povo0'] },
        risultato: {
            score_sq1: { type: Number, default: -1 },
            score_sq2: { type: Number, default: -1 }
        },
        modalità: { type: String, enum: ['Singolo', 'Doppio'] },
    }));
    const checkStatoMatch = function (match) {
        let current_date_ms = Date.now();
        let match_date_ms = Date.parse(match.data);
        if (current_date_ms < match_date_ms) {
            return 1; //match non ancora giocato
        } else {
            if (match.modalità == 'Doppio' && (match.squadra1.length + match.squadra2.length) == 4) {
                return 2 //doppio giocato   
            }
            if (match.modalità == 'Singolo' && (match.squadra1.length + match.squadra2.length) == 2) {
                return 2 //singolo giocato
            } else {
                return 0 //partita scaduta => non disputata
            }
        }

    }

    //Creazione di un match
    app.post('/v2/match', tokenChecker, (req, res) => {
        let current_date_ms = Date.now();
        let req_data_ms = Date.parse(req.body.data);
        if (req_data_ms < current_date_ms) {
            console.log(current_date_ms - req_data_ms);
            return res.status(403).send('Data non valida in quanto già passata').end();
        }
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
    //Ottieni lista dei match
    app.get('/v2/match', async function (req, res) {
        let current_date_ms = Date.now();
        Match.find({}, function (err, match) {
            if (err) {
                res.status(404).send(err)
            } else {
                let matches = [];
                for (let i = 0; i < match.length; i++) {
                    if (Date.parse(match[i]['data']) > current_date_ms) {
                        matches.push(match[i])
                    }
                }
                res.status(200).send(matches)
            }
        })
    })
    
    //Retrieve delle partite organizzate dall'utente
    app.get('/v2/match/i-miei-match', tokenChecker, async function (req, res) {
        Match.find({ organizzatore: req.user.displayName }, function (err, match) {
            if (err) {
                res.status(404).send("Nessuna partita trovata")
            } else {
                res.status(200).send(match)
            }
        })
    })
    //Elimina un match non giocato
    app.delete('/v2/match/:id', tokenChecker, async function (req, res) {
        let id = req.params.id;
        Match.findOne({ _id: id }).lean().then(async (match, err) => {
            if (err) {
                return res.status(404).send('Match non trovato')
            }
            if (match.organizzatore == req.user.displayName && checkStatoMatch(match) < 2) {
                //elimina se sei organizzatore ed il match non è stato giocatod
                Match.findByIdAndRemove(id, function (err, docs) {
                    return res.status(200).send('Match correttamente cancellato')
                })
            } else {
                //non sei organizzatore
                if (match.organizzatore != req.user.displayName) {
                    return res.status(401).send("Non sei tu l'organizzatore");
                }
                //match già giocato
                return res.status(401).send("Match già giocato");
            }
        })
    })
    //Iscriviti ad un torneo
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
                let current_date_ms = Date.now();
                let req_data_ms = Date.parse(match.data);
                if (current_date_ms > req_data_ms) {
                    return res.status(403).send('Match terminato')
                }
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
            let current_date_ms = Date.now();
            let req_data_ms = Date.parse(match.data);
            if (current_date_ms > req_data_ms) {
                return res.status(403).send('Non puoi disiscriverti da partite terminate')
            }
            if (match.squadra1.includes(req.user.displayName) && match.organizzatore != req.displayName) {
                await Match.findById(id).updateOne({ $pull: { squadra1: req.user.displayName } });
                return res.status(200).send('Disiscrizione match completata');
            }
            if (match.squadra2.includes(req.user.displayName) && match.organizzatore != req.displayName) {
                await Match.findById(id).updateOne({ $pull: { squadra2: req.user.displayName } });
                return res.status(200).send('Disiscrizione match completata');
            }
            return res.status(200).send('Non sei iscritto a questo match oppure ne sei l\'organizzatore');
        })
    })
    app.post('/v2/risultati-match/:id', tokenChecker, async function (req, res) {
        Match.findById(req.params.id, (err, match) => {
            if (err) {
                return res.status(404).send('Match non trovato').end();
            } else {
                console.log(req.body)
                if (match.organizzatore != req.user.displayName) {
                    return res.status(401).send('Non sei tu l\'organizzatore').end()
                }
                Match.findByIdAndUpdate(req.params.id, {
                    $set: {
                        'risultato.score_sq1': req.body.score_sq1,
                        'risultato.score_sq2': req.body.score_sq2
                    }
                }, function (err, docs) {
                    if (err) {
                        return res.status(404).send("Errore nell'update del risultato").end()
                    } else {

                        return res.status(400).send('Risultato correttamente aggiornato').end()
                    }
                });
            }
        })
    })
    app.get('/v2/match/cronologia-match', tokenChecker, async function (req, res) {
        Match.find( {$or:[{ squadra1: req.user.displayName, 'risultato.score_sq1': { $gt: -1 } },
            { squadra2: req.user.displayName, 'risultato.score_sq2': { $gt: -1 } }]}, function (err, match) {
                if(match){
                    return res.status(200).json(match)
                }else{
                    return res.status(404).send('Nessun match trovato')
                }
            })

    })
    















    //FRONT END
    app.get('/match', tokenChecker, (req, res) => {
        res.render('pages/match/lista_match', { user: req.user })
    })
    app.get('/match/creaMatch', tokenChecker, (req, res) => {
        res.render('pages/match/crea_match', { user: req.user })
    })
    app.get('/match/i-miei-match', tokenChecker, (req, res) => {
        res.render('pages/match/miei_match', { user: req.user })
    })
    app.get('/match/cronologia-match', tokenChecker, (req, res) => {
        res.render('pages/match/cronologia_match', { user: req.user })
    })
}