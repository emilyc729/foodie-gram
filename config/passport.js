var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var Foodie = require('../models/foodie');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
},
    function (accessToken, refreshToken, profile, cb) {
        // a user has logged in with OAuth...
        console.log(profile);
        Foodie.findOne({ 'googleId': profile.id }, function (err, foodie) {
            if (err) return cb(err);
            if (foodie) {
                if (!foodie.avatar) {
                    foodie.avatar = profile.photos[0].value;
                    foodie.save(function (err) {
                        return cb(null, foodie);
                    });
                } else {
                    return cb(null, foodie);
                }
            } else {
                var newFoodie = new Foodie({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    avatar: profile.photos[0].value,
                    username: profile.name.givenName + profile.name.familyName[0] + profile.id.substring(profile.id.length - 2)
                });
                newFoodie.save(function (err) {
                    if (err) return cb(err);
                    return cb(null, newFoodie);
                });
            }
        });
    }
));

//Serialize
//after log in: what we want stored in session
passport.serializeUser(function (foodie, done) {
    done(null, foodie.id);
});

//DeSerialize
//called everytime there's a request
//attach content received from db to req.user for passport
passport.deserializeUser(function (id, done) {
    Foodie.findById(id, function (err, foodie) {
        done(err, foodie);
    });
});
