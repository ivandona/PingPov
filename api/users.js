module.exports = function(app) {
    const User = require('./models/user');
    app.get('/v2/search', async (req, res) => {
        if (!(req.query.displayName=='' || req.query.displayName===null || req.query.displayName==='undefined')){
            User.find( { displayName: { "$regex": req.query.displayName, "$options": "i" } },(err,user)=>{
                if(user){
                    let u = [];
                    let size;
                    if(user.length<10){
                        size = user.length;
                    }
                    for(let i=0;i<size;i++){
                        u.push(user[i]);
                    }
                    return res.status(200).json(u);
                }else{
                    return  res.status(404).send('Ricerca fallita');
                }
                
            }).select('-password');
        }else{
            return res.status(400).send('Query non definita')
        }
    })
    
    app.post('/v2/users', async (req, res) => {
        
        let user = new User({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName,
            attacco: req.body.attacco,
            difesa: req.body.difesa,
            spin: req.body.spin,
            controllo: req.body.controllo,
            all_around: req.body.all_around
        });
        //controllo validità email
        if (!user.email || typeof user.email != 'string' || !checkIfEmailInString(user.email)) {
            res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
            return;
        }
        //controllo se email è già nel database
        let userCheck = await User.find({email: user.email});
        if (userCheck.length != 0) {
            return res.status(406).json({ error: 'Email già registrata'} );
        }
        //controllo validità password
        if (user.password == null || user.password.length < 6 || user.password.includes(' ')) {
            return res.status(406).json({ error: 'La password deve essere di almeno 6 caratteri e non contenere spazi'} );
        }
        if (req.body.displayName == null || typeof user.attacco != 'number' || typeof user.difesa != 'number' || typeof user.spin != 'number' || typeof user.controllo != 'number' || typeof user.all_around != 'number' ) {
            return res.status(406).json({ error: 'Richiesta non valida'} );
        }
        await user.save().then(() => console.log("user inserito"));
        return res.status(201).json(user);
    });
};
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}