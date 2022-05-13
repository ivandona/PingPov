const GOOGLE_CLIENT_ID ='71410486894-clfqt9gadnobb4j27vn4sk36dbh0l5di.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET ="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";
const SERVER_ROOT_URI = "http://localhost:4000";
const UI_ROOT_URI = "http://localhost:3000";
const JWT_SECRET = "shhhhh";
const COOKIE_NAME = "auth_token";


module.exports = function (app) {
    const { append } = require('express/lib/response');
    const { google } = require('googleapis');
    const querystring = require('querystring');

    const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        'https:/localhost:4000/auth/google',
    );

    function getGoogleAuthURL() {
        /*
         * Generate a url that asks permissions to the user's email and profile
         */
        const scopes = [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ];
    
        return oauth2Client.generateAuthUrl({
          access_type: 'offline',
          prompt: 'consent',
          scope: scopes, // If you only need one scope you can pass it as string
        });
    }
    
    async function getGoogleUser({ code }) {
        const { tokens } = await oauth2Client.getToken(code);
      
        // Fetch the user's profile with the access token and bearer
        const googleUser = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${tokens.id_token}`,
              },
            },
          )
          .then(res => res.data)
          .catch(error => {
            throw new Error(error.message);
          });
      
        return googleUser;
    }
    async function googleAuth(input, context) {
        const googleUser = await getGoogleUser({ code: input.code });
        let user = await this.userModel
          .findOne({ githubId: String(googleUser.id) })
          .exec();
        if (user) {
          // Update their profile
    
        }
    
        if (!user) {
          // Create the user in the database
          user = new User()
        }
    
        // Generate a JWT, add it as a cookie
    
        return user;
    }
    
    app.get('/auth/google/url', async(req, res) => {
           auth_link = getGoogleUser()
           //res.send(auth_link)
    });
    app.get('/auth/google/'),(req, res) => {
        getGoogleUser(4)
    }
}
