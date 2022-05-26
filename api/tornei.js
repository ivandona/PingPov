// api/tornei.js
module.exports = function (app, mongoose) {
    const tokenChecker = require('./tokenChecker')
    const Torneo = mongoose.model('Torneo', mongoose.Schema({
        nome_torneo: String,
        data: Date,
        organizzatore: String,
        sede: String,
        max_partecipanti: Number,
        giocatori: [String]
    }));

    //Get della lista dei tornei attivi
    app.get('/v2/tornei', function (req, res){
        Torneo.find({}, function (err, Tornei) {
            if (err) {
                console.log(err);
            } else {
                res.send(Tornei)
            }
        })
    })
    //Api di post per la creazione di tornei
    app.post('/v2/tornei/creaTorneo', tokenChecker, (req, res) => {
        console.log(req.body)
        const nuovo_Torneo = new Torneo({
            nome_torneo: req.body.torneo.nome_torneo,
            data: req.body.torneo.data,
            organizzatore: req.user.displayName,
            sede: req.body.torneo.sede,
            max_partecipanti: req.body.torneo.numero_partecipanti
        })
        if (req.body.torneo.admin_gioca == true) {
            nuovo_Torneo.giocatori.push(req.user.displayName);
        }

        if (nuovo_Torneo.organizzatore == "" || nuovo_Torneo.organizzatore == undefined) {
            res.send("Errore, login non eseguito");
            return;
        }
        nuovo_Torneo.save().then(() => console.log('Torneo salvato'));
        res.status(400).json(nuovo_Torneo).send(Torneo.nuovo_Torneo);
    });


    //Api di post per l'iscrizione ad un torneo dato l'id (nell'url)
    app.post('/v2/iscrizione/', tokenChecker, async function (req, res) {
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
    app.delete('/v2/iscrizione/', tokenChecker, async function (req, res) {
        const nome_utente = req.user.displayName;
        let id = req.query.id;
        console.log('disiscrizione')
        try {
            res.status(200).json(await Torneo.findById(id).updateOne({ $pull: { giocatori: nome_utente } }))
        } catch (err) {
            console.error(`Error while updating programming language`, err.message);
        }
    });
    app.get('/v2/tornei/:id',  async function (req, res) {
        const id = req.params.id;
        Torneo.findOne({ _id: req.params.id }).lean().then((torneo,err) => {
            if (torneo) {
                res.status(200).json(torneo)
            } else {
                res.status(404).json(err)
            }
        })
    });

//Api di delete di un torneo dato il suo id nell'url
app.delete('/v2/tornei/:id',tokenChecker, async function (req, res) {
    let id = req.params.id;
    let name = req.user.displayName; 
    Torneo.findOne({ _id: req.params.id }).lean().then((torneo,err) => {
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
app.put('/v2/tornei/:id', (req, res) => {
    const id = req.params.id;
    Torneo.find({ "_id": id }, function (err, docs) {
        if (docs.organizzatore == req.session.username) {
            Torneo.findByIdAndUpdate(id, function (err, docs) {
                if (err) {
                    res.send('Torneo non trovato')
                } else {
                    res.send('Torneo correttamente cancellato')
                }
            });
        } else {
            res.send("Non sei tu l'organizzatore")
        }
    })
})





//FRONT END


//Get pagina web con lista tornei attivi
app.get('/tornei', tokenChecker, (req, res) => {
    console.log(req.token)
    res.render('pages/lista_tornei', { user: req.user })
})
//Get pagina web con il form per la creazione di tornei
app.get('/tornei/creaTorneo', (req, res) => {
    res.render("pages/crea_torneo", { user: req.user });
});
app.get('/tornei/:id', (req, res) => {
    res.render("pages/torneo", { user: req.user, id : req.params.id });
});

}