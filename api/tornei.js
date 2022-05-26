// api/tornei.js
module.exports = function (app, mongoose) {
    const jwt = require('jsonwebtoken');
    const Torneo = mongoose.model('Torneo', mongoose.Schema({
        nome_torneo: String,
        data: Date,
        organizzatore: String,
        sede: String,
        max_partecipanti: Number,
        giocatori: [String]
    }));
    const tokenChecker = function(req, res,next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
      
        // if there is no token
        if (!token) {
          return res.status(401).send({ 
            success: false,
            message: 'No token provided.'
          });
        }
      
        // decode token, verifies secret and checks exp
        jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
          if (err) {
            return res.status(403).send({
              success: false,
              message: 'Failed to authenticate token.'
            });		
          } else {
            // if everything is good, save to request for use in other routes
            console.log(decoded)
            req.user = decoded.user;
            console.log(req.user.displayName)
            next();
          }
        });
        
      };
    //Get della lista dei tornei attivi
    app.get('/v1/tornei', tokenChecker, (req, res) => {
        req.query.username = req.user.displayName;
        res.locals.query = req.query;
        Torneo.find({}, function (err, Tornei) {
            if (err) {
                console.log(err);
            } else {
                res.send(Tornei)
            }
        })
    })
    //Api di post per la creazione di tornei
    app.post('/v1/tornei/creaTorneo', (req, res) => {
        console.log(req.query)
        const nuovo_Torneo = new Torneo({
            nome_torneo: req.query.nome_torneo,
            data: req.query.data,
            organizzatore: "test",
            sede: req.query.sede,
            max_partecipanti: req.query.numero_partecipanti
        })
        if (req.body.torneo.admin_gioca == true) {
            nuovo_Torneo.giocatori.push(req.user.displayName);
        }

        if (nuovo_Torneo.organizzatore == "" || nuovo_Torneo.organizzatore == undefined) {
            res.send("Errore, login non eseguito");
            return;
        }
        nuovo_Torneo.save().then(() => console.log('Torneo salvato'));
        res.send(Torneo.nuovo_Torneo);
    });


    //Api di post per l'iscrizione ad un torneo dato l'id (nell'url)
    app.post('/v1/iscrizione/', async function (req, res) {
        const nome_utente = req.user.displayName;
        const id = req.query.id;
        console.log('iscrizione')
        try {
            res.json(await Torneo.findById(id).updateOne({ $addToSet: { giocatori: nome_utente } }));
            res.status(400)
            res.send('Iscrizione avvenuta')
        } catch (err) {
            console.error('Error while updating programming language', err.message);

        }
    });
    //Api di post per la disiscrizione ad un torneo dato l'id (nell'url)
    app.delete('/v1/iscrizione/', async function (req, res) {
        const nome_utente = req.user.displayName;
        let id = req.query.id;
        console.log('disiscrizione')
        try {
            res.json(await Torneo.findById(id).updateOne({ $pull: { giocatori: nome_utente } }))
        } catch (err) {
            console.error(`Error while updating programming language`, err.message);
        }
    });

    //Api di delete di un torneo dato il suo id nell'url
    app.delete('/v1/tornei/:id', (req, res) => {

        const id = req.params.id;
        Torneo.find({ "_id": id }.lean(), function (err, docs) {
            if (docs.organizzatore == req.session.username) {
                Torneo.findByIdAndRemove(id, function (err, docs) {
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

    app.put('/v1/tornei/:id', (req, res) => {
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

    //Get pagina web con lista tornei attivi
    app.get('/tornei', tokenChecker, (req, res) => {
        console.log(req.token)
        res.render('pages/lista_tornei', { user: req.user})
    })
    //Get pagina web con il form per la creazione di tornei
    app.get('/v1/tornei/creaTorneo', (req, res) => {
        res.render("pages/crea_torneo", { user: req.user });
    });

}