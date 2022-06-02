const { max } = require('underscore');

// api/tornei.js
module.exports = function (app, mongoose) {
    const tokenChecker = require('./tokenChecker')
    const Torneo = mongoose.model('Torneo', mongoose.Schema({
        nome_torneo: String,
        data: Date,
        organizzatore: String,
        sede: { type: String, enum: ['Povo1', 'Povo0'] },
        max_partecipanti: Number,
        giocatori: [String],
        risultati: [String]
    }));

    //Get della lista dei tornei attivi
    app.get('/v2/tornei', function (req, res) {
        Torneo.find({}, function (err, Tornei) {
            if (err) {
                res.status(503).send("Problema di accesso al database");
            } else {
                res.status(200).send(Tornei)
            }
        })
    })
    //Api di post per la creazione di tornei
    app.post('/v2/tornei', tokenChecker, (req, res) => {
        console.log(req.body)
        const nuovo_Torneo = new Torneo({
            nome_torneo: req.body.nome_torneo,
            data: req.body.data,
            organizzatore: req.user.displayName,
            sede: req.body.sede,
            max_partecipanti: req.body.max_partecipanti,
            risultati: []
        })
        if(typeof(req.body.nome_torneo)=='undefined' || typeof(req.body.data)=='undefined' || typeof(req.body.sede)=='undefined' 
            || typeof(req.body.max_partecipanti)=='undefined' || typeof(req.body.admin_gioca)=='undefined'){
            return res.status(400).send('Non tutti i campi sono stati definiti')
        }
        if(req.body.nome_torneo='' || req.body.data=='' || !(Date.parse(req.body.data)>0) || 
        (req.body.sede!='Povo0' && req.body.sede !='Povo1') || req.body.max_partecipanti>64 || req.body.max_partecipanti<2 ||
        (req.body.admin_gioca!==true && req.body.admin_gioca!==false)){
            return res.status(400).send('Dati non validi')
        }
        if(Data.parse(req.body.data)<Date.now()){
            res.status(400).send('Data non valida')
        }

        if (req.body.admin_gioca == true) {
            nuovo_Torneo.giocatori.push(req.user.displayName);
        }

        if (nuovo_Torneo.organizzatore == "" || nuovo_Torneo.organizzatore == undefined) {
            res.send("Errore, login non eseguito");
            return;
        }
        nuovo_Torneo.save().then(() => console.log('Torneo salvato'));
        res.status(200).json(nuovo_Torneo).send(Torneo.nuovo_Torneo);
    });


    //Api di post per l'iscrizione ad un torneo dato l'id (nell'url)
    app.post('/v2/iscrizione-torneo/', tokenChecker, async function (req, res) {
        const nome_utente = req.user.displayName;
        const id = req.query.id;
        console.log('iscrizione')
        try {
            res.status(200).json(await Torneo.findById(id).updateOne({ $addToSet: { giocatori: nome_utente } }));
        } catch (err) {
            console.error('Error while updating programming language', err.message);

        }
    });
    //Api di post per la disiscrizione ad un torneo dato l'id nell'url
    app.delete('/v2/iscrizione-torneo/', tokenChecker, async function (req, res) {
        const nome_utente = req.user.displayName;
        let id = req.query.id;
        console.log('disiscrizione')
        try {
            res.status(200).json(await Torneo.findById(id).updateOne({ $pull: { giocatori: nome_utente } }))
        } catch (err) {
            console.error(`Error while updating programming language`, err.message);
        }
    });
    app.get('/v2/tornei/:id', async function (req, res) {
        let id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('Id non valido')
        }
        Torneo.findById(id).lean().then((torneo, err) => {
            if (torneo) {
                return res.status(200).json(torneo)
            } else {
                return res.status(40).send('Errore accesso db')
            }
        })
    });

    //Api di delete di un torneo dato il suo id nell'url
    app.delete('/v2/tornei/:id', tokenChecker, async function (req, res) {
        let id = req.params.id;
        let name = req.user.displayName;
        Torneo.findOne({ _id: req.params.id }).lean().then((torneo, err) => {
            if (torneo.organizzatore == name) {
                Torneo.findByIdAndRemove(id, function (err, docs) {
                    if (err) {
                        res.status(404).send('Torneo non trovato')
                    } else {
                        res.status(200).send('Torneo correttamente cancellato')
                    }
                });
            } else {
                res.status(401).send("Non sei tu l'organizzatore")
            }
        })

    })
    //API per vedere i risultati dei match di un torneo
    app.get('/v2/risultati-torneo/:id', async function (req, res) {
        let id = req.params.id;
        Torneo.findOne({ _id: req.params.id }).lean().then((torneo, err) => {
            if (torneo) {
                res.status(200).json(torneo.risultati)
            } else {
                res.status(404).send(err)
            }
        })
    })
    //API per l'invio di risultati di un torneo
    app.post('/v2/risultati-torneo/:id', tokenChecker, async function (req, res) {
        let id = req.params.id;
        Torneo.findOne({ _id: req.params.id }).lean().then(async (torneo, err) => {
            let players_and_score = req.body.score.split(") ", 5);
            let players = players_and_score[1].split(' vs ');
            let risultato_gia_presente = false;
            for (let x = 0; x < torneo.risultati.length; x++) {
                if (torneo.risultati[x].includes(players[0]) && torneo.risultati[x].includes(players[1])) {
                    risultato_gia_presente = true;
                    break;
                }
            }
            if (risultato_gia_presente) {
                res.status(403).send("Impossibile aggiungere risultati di partite gia giocate")
            } else {
                await Torneo.findById(id).updateOne({ $addToSet: { risultati: req.body.score } })
                res.status(200).send(req.body)
            }

        })

    })
    //FRONT END


    //Get pagina web con lista tornei attivi
    app.get('/tornei', tokenChecker, (req, res) => {
        console.log(req.token)
        res.render('pages/tornei/lista_tornei', { user: req.user })
    })
    //Get pagina web con il form per la creazione di tornei
    app.get('/tornei/creaTorneo', (req, res) => {
        res.render("pages/tornei/crea_torneo", { user: req.user });
    });
    //Get della pagina del torneo, se sei l'organizzatore accederai ad ulteriori funzionalità
    app.get('/tornei/:id', tokenChecker, (req, res) => {
        Torneo.findOne({ _id: req.params.id }).lean().then((torneo, err) => {
            if (torneo) {
                if (torneo.organizzatore == req.user.displayName) {
                    res.render('pages/tornei/torneo_admin', { user: req.user, id: req.params.id })
                } else {
                    res.render("pages/tornei/torneo_user", { user: req.user, id: req.params.id });
                }
            } else {
                res.status(404).json(err)
            }
        })
    });
}

