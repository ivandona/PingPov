// api/tornei.js
module.exports = function (app, mongoose) {
    const Torneo = mongoose.model('Torneo', mongoose.Schema({
        nome_torneo: String,
        data: Date,
        organizzatore: String,
        sede: String,
        max_partecipanti: Number,
        numero_partecipanti: Number,
        giocatori: [String]
    }));


    //GET EVERY BOOK
    app.get('/v1/tornei', (req, res) => {
        console.log(req.session.user);
        req.query.username=req.session.user;
        res.locals.query=req.query;
        Torneo.find({}, function(err, Tornei){
            if(err){
              console.log(err);
            } else{
                res.render('pages/lista_tornei',{tornei: Tornei})
            }
        })
    })

app.get('/v1/tornei/creaTorneo', (req, res) => {
    res.render("pages/crea_torneo");
});



app.post('/v1/tornei/creaTorneo',(req, res) => {
    console.log(req.session.username)
    const nuovo_Torneo = new Torneo({
        nome_torneo: req.body.torneo.nome_torneo,
        data: req.body.torneo.data,
        organizzatore: req.session.username,
        sede: req.body.torneo.sede,
        max_partecipanti: req.body.torneo.numero_partecipanti,
        numero_partecipanti: 0,
    })
    if (req.body.torneo.admin_gioca == true){
        nuovo_Torneo.giocatori.push(req.session.username);
        nuovo_Torneo.numero_partecipanti =1
    }
    
    if (nuovo_Torneo.organizzatore == "" || nuovo_Torneo.organizzatore == undefined){
        res.send("Errore, login non eseguito");
        return;
    }
    nuovo_Torneo.save().then(() => console.log('Torneo salvato'));
    console.log(nuovo_Torneo);
    res.send(Torneo.nuovo_Torneo);
});



app.post('/v1/iscrivi/:id' , async function(req,res){

    const nome_utente=req.body.username; 
    const id= req.params.id;
    try{
        res.json(await Torneo.findById(id).update({ $push: { giocatori: nome_utente } }));
        }  catch (err) {
            console.error(`iscrizione non riuscita`, err.message);
            next(err);
          }
    console.log("iscrizione avvenuta");

});
app.post('/v1/disiscrivi/:id' , async function(req,res){

    const nome_utente=req.body.username; 
    const id= req.params.id;
    try{
        res.json(await Torneo.findById(id).update({ $pull: { giocatori: nome_utente } }));
        }  catch (err) {
            console.error(`disiscrizione non riuscita`, err.message);
            next(err);
          }
       
          console.log("disiscrizione avvenuta");

});



//GET ONE BOOK
app.get('/v1/torneo/:id', (req, res) => {
    const id = req.params.id;
    Torneo.find({ "_id": id }).lean().exec((err, torneo)=> { res.render('pages/torneo',{torneo:JSON.stringify(torneo)}) })
});

//DELETE
app.delete('/v1/tornei/:id', (req, res) => {
    const id = req.params.id;
    Torneo.find({ "_id": id }, function (err, docs) {
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

app.put('/v1/torneo/:id', (req, res) => {
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



}