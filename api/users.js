module.exports = function(app) {
    const User = require('./models/user');
    
    /*app.get('/v2/users/me', async (req, res) => {
        if(!req.loggedUser) {
            return;
        }

        let user = await User.findOne({email: req.loggedUser.email});
        
        res.status(200).json({
            self: '/v2/users/' + user.id,
            email: user.email
        });
    });*/
    
    app.get('/v2/users', async (req, res) => {
        if(!req.loggedUser) {
            return;
        }

        let user = await User.findOne({email: req.loggedUser.email});
        
        res.status(200).json({
            self: '/v2/users/' + user.id,
            email: user.email
        });
    });

    app.get('/v2/search', async (req, res) => {
        if (req.query.username){
            User.find( { username: { "$regex": req.query.username, "$options": "i" } },(err,user)=>{
                if(user){
                    return res.status(200).json(user);
                }else{
                    return  res.status(404).send('Ricerca fallita')
                }
                
            })
        }/*
        else
            users = await User.find().exec();

        users = users.map( (entry) => {
            return {
                self: '/v2/users/' + entry.id,
                username: entry.username
            }
        })*/

        //return res.status(200).json(users);
    })
    
    app.post('/v2/users', async (req, res) => {
        
        let user = new User({
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            attacco: req.body.attacco,
            difesa: req.body.difesa,
            spin: req.body.spin,
            controllo: req.body.controllo,
            all_around: req.body.all_around
        });

        user = await user.save().then(() => console.log("user inserito"));
        
        let userId = user.id;

        //Link to the newly created resource is returned in the Location header
        res.location("/v2/users/" + userId).status(201).send();
    });

}