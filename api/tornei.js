// api/tornei.js
module.exports = function (app, mongoose) {
    const Torneo = mongoose.model('Torneo', mongoose.Schema({
        nome_torneo: String,
        data: Date,
        organizzatore: String,
        sede: String,
        max_partecipanti: Number,
        partecipanti: Number
    }));

    //GET EVERY BOOK
    app.get('/tornei', (req, res) => {
        Torneo.find({}, function(err, Tornei){
            if(err){
              console.log(err);
            } else{
                res.render('pages/lista_tornei',{tornei: Tornei})
                console.log('retrieved list of names', Tornei.length, Tornei[0]);
            }
        })
    })

//PUT 
app.put('/aggiungiTorneo', (req, res) => {

    const nuovo_Torneo = new Torneo({
        nome_torneo: req.body.nome_torneo,
        data: req.body.data,
        organizzatore: req.body.organizzatore,
        sede: req.body.sede,
        max_partecipanti: req.body.max_partecipanti,
        partecipanti: req.body.partecipanti
    })
    nuovo_Torneo.save().then(() => console.log('Torneo salvato'));
    res.send(Torneo.nuovo_Torneo)
})
//GET ONE BOOK
app.get('/torneo/:id', (req, res) => {
    const id = req.params.id;
    console.log('id:' + id)
    Torneo.find({ "_id": id }, function (err, docs) { res.send(docs) })
});

//DELETE
app.delete('/torneo/:id', (req, res) => {
    const ObjectID = require('mongoose').ObjectID;
    const id = req.params.id;
    const query = { '_id': new ObjectID(id) };
    Torneo.find({ "_id": id }, function (err, docs) {
        if (docs.organizzatore == req.session.username) {
            Torneo.findByIdAndRemove(id, function (docs, err) {
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