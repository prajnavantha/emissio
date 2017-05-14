var passport = require('passport');

var Strategy = require('passport-facebook').Strategy;
var config = require('./config')



passport.use(new Strategy({
    clientID: config.fbClientId,//process.env.CLIENT_ID,
    clientSecret:config.fbClientSecret,// process.env.CLIENT_SECRET,
    callbackURL: config.fbCallbackUrl,
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
