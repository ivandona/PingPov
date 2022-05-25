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

    app.get('/v1/tornei', (req, res) => {
        req.query.username = req.user.displayName;
        res.locals.query=req.query;
        Torneo.find({}, function(err, Tornei){
            if(err){
              console.log(err);
            } else{
                //res.render('pages/lista_tornei',{ user : req.user, tornei: Tornei})
                res.send(Tornei)
            }
        })
    })

    app.get('/tornei', (req, res) => {
        res.render('pages/lista_tornei')
    })




app.get('/v1/tornei/creaTorneo', (req, res) => {
    res.render("pages/crea_torneo", { user : req.user});
});



app.post('/v1/tornei/creaTorneo',(req, res) => {
    console.log(req.session.user)
    const nuovo_Torneo = new Torneo({
        nome_torneo: req.body.torneo.nome_torneo,
        data: req.body.torneo.data,
        organizzatore: req.user.displayName,
        sede: req.body.torneo.sede,
        max_partecipanti: req.body.torneo.numero_partecipanti,
        numero_partecipanti: 0,
    })
    if (req.body.torneo.admin_gioca == true){
        nuovo_Torneo.giocatori.push(req.user.displayName);
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

    const nome_utente=req.user.displayName; 
    const id= req.params.id;
    try{
        res.json(await Torneo.findById(id).update({ $addToSet: { giocatori: nome_utente } }));
        }  catch (err) {
            console.error(`Error while updating programming language`, err.message);
            next(err);
          }
       

});
app.delete('/v1/disiscrivi/:id' , async function(req,res){

    const nome_utente=req.user.displayName; 
    const id= req.params.id;
    try{
        res.json(await Torneo.findById(id).update({ $pull: { giocatori: nome_utente } }));
        }  catch (err) {
            console.error(`Error while updating programming language`, err.message);
            next(err);
          }
       

});



//GET ONE BOOK
app.get('/v1/tornei/:id', (req, res) => {
    const id = req.params.id;
    Torneo.find({ "_id": id }).lean().exec((err, torneo)=> { res.render('pages/torneo',{user : req.user, torneo:JSON.stringify(torneo)}) })
});

//DELETE
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
/*
app.get('/v1/torneo', (req, res) => {

    res.render("pages/torneo", { session: req.session })
})*/
}