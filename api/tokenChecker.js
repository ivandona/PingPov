const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const tokenChecker = function(req, res,next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['token'] || req.token || req.cookies.token;
	// if there is no token
	if (!token) {
		req.user=""
	  	return res.status(401).render('pages/auth',{user:""})
	}
  
	// decode token, verifies secret and checks exp
	jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
	  if (err) {
		req.user="";
		return res.status(401).render('pages/auth',{user:""});
	  } else {
		// if everything is good, save to request for use in other routes
		req.user = decoded.user;
		next();
	  }
	});
	
  };

module.exports = tokenChecker