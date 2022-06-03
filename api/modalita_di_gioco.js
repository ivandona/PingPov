const User = require('./user');
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
            score_sq1: { type: Number, default: -1 },
            score_sq2: { type: Number, default: -1 }
        },
        modalità: { type: String, enum: ['Singolo', 'Doppio','Ranked'] }
    }));



    app.post('/v2/match', tokenChecker, (req, res) => {
        //let day=new Date(Date.parse(req.body.data + 'T' +req.query['ora'] +':00'))
        let current_date_ms = Date.now();
        let req_data_ms = Date.parse(req.body.data);
        if (req_data_ms < current_date_ms) {
            console.log(current_date_ms - req_data_ms);
            return res.status(403).send('Data non valida in quanto già passata').end();
        }
        if (req.body.modalità != 'Singolo' && req.body.modalità != 'Doppio' && req.body.modalità!= 'Ranked') {
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
                if (match.modalità == 'Singolo' || match.modalità=='Ranked') {
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
            if (match.squadra1.includes(req.user.displayName)) {
                await Match.findById(id).updateOne({ $pull: { squadra1: req.user.displayName } });
                return res.status(200).send('Disiscrizione match completata');
            }
            if (match.squadra2.includes(req.user.displayName)) {
                await Match.findById(id).updateOne({ $pull: { squadra2: req.user.displayName } });
                return res.status(200).send('Disiscrizione match completata');
            }
            return res.status(200).send('Non sei iscritto a questo match');
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
                console.log(match.modalità)
                //inizio ranking
                if(match.modalità=='Ranked'){

                let p1 = req.body.score_sq1;
                let p2 = req.body.score_sq2;
                console.log(match.squadra1[0])
                console.log(match.squadra2[0])
                let r1, r2;
                User.find({ "name": match.squadra1[0] }, async function (err, utente) {
                    console.log("utente: ")
                    console.log(utente)
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("rank: ")
                        r1 = utente[0].rank;
                        console.log(r1)
                        if (!r1) {
                            r1 = 100;
                        }
                    }
                    User.find({ "name": match.squadra2[0] }, async function (err, utente) {
                        console.log("utente: ")
                        console.log(utente)
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("rank: ")
                            r2 = utente[0].rank;
                            console.log(r2)
                            if (!r2) {
                                r2 = 100;
                            }
                            r1,r2=cambia_risultati(r1,r2,p1,p2)
                            console.log(r1)
                            console.log(r2)
                           
                            
                           await User.find({ name: match.squadra1[0] }).updateOne({$set:{ "rank" : r1 }});
                           await User.find({ name: match.squadra2[0] }).updateOne({$set :{ "rank" : r2 }});
                        }
                    })
               
               
               
                })
               
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















    //FRONT END
    app.get('/match', tokenChecker, (req, res) => {
        res.render('pages/matchlist', { user: req.user })
    })
    app.get('/match/creaMatch', tokenChecker, (req, res) => {
        res.render('pages/crea_match', { user: req.user })
    })
    app.get('/match/i-miei-match', tokenChecker, (req, res) => {
        res.render('pages/miei_match', { user: req.user })
    })



const  cambia_risultati= function(r1,r2,p1,p2){ 
                media = Math.floor((r1 + r2) / 2);
               
                add = (Math.pow(Math.abs(p1 - p2), 2)) / (10 * (Math.pow((p1 + p2), 2))) * media;
                add=Math.floor(add);
                if (r1 != 0 && r2 != 0) {
                    //se entrambi i giocatori hanno rank maggiore di zero
                    if (p1 > p2) {
                        r1 = r1 + add;
                        r2 = r2 - add;
                    } else {
                        r1 = r1 - add;
                        r2 = r2 + add;
                    }
                } else {
                    //se r1 è zero
                    if (r1 == 0) {
                        //se r2 è zero
                        if (r2 == 0) {
                            //vince g1
                            if (p1 > p2) {
                                r1 = r1 + 50;

                            }
                            //vince g2
                            else {
                                r2 = r2 + 50;
                            }
                        }
                        //se r2 non è zero
                        else {
                            //vince g1
                            if (p1 > p2) {
                                r1 = r2;
                                r2 = r2 - add;
                            }
                            //vince g2
                            else {
                                r2 = r2 + add;
                            }
                        }
                    }
                    // r1 non è zero
                    else {
                        if (r2 == 0) {
                            //vince g1
                            if (p1 > p2) {
                                r1 = r2;
                                r2 = r2 - add;
                            }
                            //vince g2
                            else {
                                r2 = r2 + add;
                            }
                        }
                    }


                }
                return r1,r2;
            }
          
        }