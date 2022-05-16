// api/users.js
module.exports = function (app, mongoose) {
    //GET EVERY USER
    app.get('/users', (req, res) => {
        res.send('Response')
    });
  
    //POST FUNZIONA
    app.post('/users', (req, res) => {
        const User =  mongoose.model('User',{
            name: String,
            email: String,
            statistiche: {
                attacco: Number, 
                difesa: Number, 
                spin: Number, 
                chop: Number, 
                all_around: Number
            }
        })
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            stastistiche: {
                attacco: req.body.attacco,
                difesa: req.body.difesa,
                spin: req.body.spin,
                chop: req.body.chop,
                all_around: req.body.all_around
            }
        })
        user.save().then(() => console.log('meow'));
        res.send(user.name)
    })
    //GET ONE USER
    app.get('/users/:id', (req, res) => {
        //const schema =  mongoose.model('Book',schema
        //const id = req.params.id;
        User.find({ "_id": id},function (err, docs) {res.send(docs)})  
    });
    //PUT
    app.put('/users/:id', (req, res) => {
        const ObjectID = require('mongoose').ObjectID;
        const id = req.params.id;
        const query = { '_id': new ObjectID(id) };
        const body = {
            name: req.body.name,
            email: req.body.email,
            stastistiche: {
                attacco: req.body.attacco,
                difesa: req.body.difesa,
                spin: req.body.spin,
                chop: req.body.chop,
                all_around: req.body.all_around
            }
        };
    database.collection('users').update(query, body, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
    })
    //DELETE
    app.delete('/users/:id', (req, res) => {
        const ObjectID = require('mongoose').ObjectID;
        const id = req.params.id;
        const query = { '_id': new ObjectID(id) };
        database.collection('users').remove(query, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    })
  } 