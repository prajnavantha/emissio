var passport = require('passport');

var Strategy = require('passport-facebook').Strategy;



//passport
passport.use(new Strategy({
    clientID: "787579241399148",//process.env.CLIENT_ID,
    clientSecret:"ab0ce40e68e4a4889eca4bb9b5215ecb",// process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/facebook/return',
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {

    return cb(null, profile);
  }));

 passport.serializeUser(function(user, cb) {
   cb(null, user);
 });

 passport.deserializeUser(function(obj, cb) {
   cb(null, obj);
 });


module.exports = passport;
