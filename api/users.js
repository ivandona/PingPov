module.exports = function(app) {
    const User = require('/models/user');
    
    app.get('/me', async (req, res) => {
        if(!req.loggedUser) {
            return;
        }

        let user = await User.findOne({email: req.loggedUser.email});
        
        res.status(200).json({
            self: 'v1/students/' + user.id,
            email: user.email
        });
    });

    app.get('', async (req, res) => {
        let users;
        
        if (req.query.email)
            users = await User.find({ email: req.query.email }).exec();
        else
            users = await User.find().exec();

        users = users.map( (entry) => {
            return {
                self: 'v1/users' + entry.id,
                email: entry.email
            }
        })

        res.status(200).json(users);
    })
    
    app.post('', async (req, res) => {
        
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
        res.location("/v1/users/" + userId).status(201).send();
    });

}