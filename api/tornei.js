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
                return res.status(503).send("Problema di accesso al database");
            } else {
                return res.status(200).send(Tornei)
            }
        })
    })
    //Api di post per la creazione di tornei
    app.post('/v2/tornei', tokenChecker, (req, res) => {
        const nuovo_Torneo = new Torneo({
            nome_torneo: req.body.nome_torneo,
            data: req.body.data,
            organizzatore: req.user.displayName,
            sede: req.body.sede,
            max_partecipanti: req.body.numero_partecipanti,
            risultati: []
        })
        if (typeof (req.body.nome_torneo) == 'undefined' || typeof (req.body.data) == 'undefined' || typeof (req.body.sede) == 'undefined'
            || typeof (req.body.numero_partecipanti) == 'undefined' || typeof (req.body.admin_gioca) == 'undefined') {
            return res.status(400).send('Non tutti i campi sono stati definiti')
        }
        if (req.body.nome_torneo == '' || req.body.data == '' || !(Date.parse(req.body.data) > 0) ||
            (req.body.sede != 'Povo0' && req.body.sede != 'Povo1') || req.body.numero_partecipanti > 64 || req.body.numero_partecipanti < 2 ||
            (req.body.admin_gioca !== true && req.body.admin_gioca !== false)) {
            return res.status(400).send('Dati non validi')
        }
        if (Date.parse(req.body.data) < Date.now()) {
            return res.status(400).send('Data già passata')
        }

        if (req.body.admin_gioca == true) {
            nuovo_Torneo.giocatori.push(req.user.displayName);
        };
        nuovo_Torneo.save().then(() => console.log('Torneo salvato'));
        res.status(200).json(nuovo_Torneo).send(Torneo.nuovo_Torneo);
    });


    //Api di post per l'iscrizione ad un torneo dato l'id (nell'url)
    app.post('/v2/iscrizione-torneo/:id', tokenChecker, async function (req, res) {
        const nome_utente = req.user.displayName;
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('Id non valido')
        }
        try {
            let torneo = await Torneo.findById(id);
            if(torneo==null){
                return res.status(404).send('Torneo non trovato')
            }
            if (torneo.giocatori.includes(nome_utente)) {
                return res.status(403).send('Sei già iscritto');
            }
            if (torneo.giocatori.length < torneo.max_partecipanti) {
                torneo.giocatori.push(nome_utente);
                torneo.save();
                return res.status(201).send('Iscrizione effettuata');
            } else {
                return res.status(403).send('Posti finiti');
            }

        } catch (err) {
            res.status(400).send('Errore di accesso al database');

        }
    });
    //Api di post per la disiscrizione ad un torneo dato l'id nell'url
    app.delete('/v2/iscrizione-torneo/:id', tokenChecker, async function (req, res) {
        const nome_utente = req.user.displayName;
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('Id non valido')
        }
        try {
            let torneo = await Torneo.findById(id);
            if(torneo==null){
                return res.status(404).send('Torneo non trovato')
            }
            if (torneo.giocatori.includes(nome_utente)) {
                let index = torneo.giocatori.indexOf(nome_utente)
                torneo.giocatori.splice(index, 1)
                console.log(nome_utente, ' ', torneo.giocatori, index)
                torneo.save();
                return res.status(200).send('Disiscrizione avvenuta')
            } else {
                return res.status(403).send('Non sei iscritto al torneo')
            }
        } catch (err) {
            return res.status(500).send('Errore di accesso al database');
        }
    });
    app.get('/v2/tornei/:id', async function (req, res) {
        let id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('Id non valido')
        }
        Torneo.findById(id).lean().then((torneo, err) => {
            if (torneo) {
                if(torneo==null){
                    return res.status(404).send('Torneo non trovato')
                }
                return res.status(200).json(torneo)
            } else {
                return res.status(500).send('Errore accesso db')
            }
        })
    });

    //Api di delete di un torneo dato il suo id nell'url
    app.delete('/v2/tornei/:id', tokenChecker, async function (req, res) {
        let id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('Id non valido')
        }
        let name = req.user.displayName;
        let torneo = await Torneo.findById(id)
        if (torneo == null) {
            return res.status(404).send('Torneo non trovato')
        }
        if (torneo.organizzatore == name) {
            await torneo.remove({_id:id}, function (err, docs) {
                return res.status(200).send('Torneo correttamente cancellato')
            })
        } else {
            res.status(401).send("Non sei tu l'organizzatore")
        };
    })
//API per vedere i risultati dei match di un torneo
app.get('/v2/risultati-torneo/:id', async function (req, res) {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send('Id non valido')
    }
    Torneo.findOne({ _id: id }).lean().then((torneo, err) => {
        if (torneo) {
            if(torneo==null){
                return res.status(404).send('Torneo non trovato')
            }
            res.status(200).json(torneo.risultati)
        } else {
            res.status(500).send(err)
        }
    })
})
//API per l'invio di risultati di un torneo
app.post('/v2/risultati-torneo/:id', tokenChecker, async function (req, res) {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send('Id non valido')
    }
    Torneo.findOne({ _id: id }).lean().then(async (torneo, err) => {
        if(torneo==null){
            return res.status(404).send('Torneo non trovato')
        }
        if(!req.body.player1 || !req.body.player2 || req.body.score1 =='undefined'|| req.body.score2=='undefined'){
            return res.status(400).send('Body della richiesta non completo');
        }
        let risultato_gia_presente = false;
        if(!torneo.giocatori.includes(req.body.player1)|| !torneo.giocatori.includes(req.body.player2)){
            return res.status(403).send("Impossibile aggiungere risultati che comprendano giocatori" +
            "che non partecipano al torneo")            
        }
        if(typeof(req.body.score1)!='number' || typeof(req.body.score2)!='number'){
            return res.status(403).send('Score non numerico')
        }
        for (let x = 0; x < torneo.risultati.length; x++) {
            if (torneo.risultati[x].includes(' '+req.body.player1+' ') && torneo.risultati[x].includes(' '+req.body.player2+' ')) {
                risultato_gia_presente = true;
                console.log(torneo.risultati[x])
                break;
            }
        }
        if (risultato_gia_presente) {
            return res.status(403).send("Impossibile aggiungere risultati di partite gia giocate")
        } else {
            let ris ='('+req.body.score1+'/'+req.body.score2+') '+req.body.player1+' vs ' + req.body.player2+ ' '
            await Torneo.findById(id).updateOne({ $addToSet: { risultati: ris } })
            return res.status(200).send('Risultato correttamente aggiunto')
        }
    });
});
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

