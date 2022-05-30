// api/Prenotazione.js
module.exports = function (app, mongoose) {
    const tokenChecker = require('./tokenChecker')
    const Prenotazione = mongoose.model('prenotazione', mongoose.Schema({
        prenotatore: String,
        giorno: Date,
        sede: String
    }));

    app.get('/v2/prenotazioni', (req, res) => {
        console.log(req.user)
        req.query.username = req.session.user;
        res.user=req.session.user
        res.locals.query = req.query;
        Prenotazione.find({}, function (err, Prenotazioni) {
            if (err) {
                res.status(404);
                console.log(err);
            } else {
                risultato=[];
                for(i=0; i<Prenotazioni.length;i++){
                if(Prenotazioni[i]['sede']==req.query['sede']){
                    day=new Date(Date.parse(req.query['data'] + 'T' +req.query['ora'] +':00'))
                    if(day< Prenotazioni[i]['giorno']){
                        risultato.push(Prenotazioni[i]);
                    }
                }

                }
                res.status(200).json(risultato)
            }
        })
    })

    //PUT 
    app.put('/v2/prenota/', async function (req, res) {
        //const ObjectID = require('mongoose').ObjectID;
        const id = req.body.pre_id;
        const query = { 'prenotatore': req.body.prenotatore };
        res.user=req.user
        console.log(id);
        console.log(req.body.prenotatore)
        const body = {
            prenotatore: req.body.prenotatore,
        };
        try {
            res.status(200).json(await Prenotazione.findByIdAndUpdate(id,body));
            console.log("prenotazione riuscita");
        } catch (err) {
            console.error(`Errore nella prenotazione`, err.message);
            res.status(404);
            next(err);
        }



    });


    //DELETE
    app.delete('/v1/prenota/:id', async function (req, res) {
        res.user=req.user

        id=req.params.id;
        console.log(id)
        const body = {
            prenotatore: '',
        };
        try {
            res.status(200).json(await Prenotazione.findByIdAndUpdate(id,body));
            
            console.log("rimozione prenotazione riuscita");
        } catch (err) {
            res.status(404)
            console.error(`Errore nella rimozione della prenotazione`, err.message);
            next(err);
        }

    })


app.get('/prenotazioni',(req, res)=>{
    res.render('pages/ricerca_prenotazioni',{user : req.user});




}
)
}