// Client ID: 312056016407-nfaj1gi6tnl37seoumiv5b6r45if1u6h.apps.googleusercontent.com
// Client Secret: bUl74CvG9vc3xc6wkEInGVAd

//const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('./models/user')

const CLIENT_ID = '312056016407-nfaj1gi6tnl37seoumiv5b6r45if1u6h.apps.googleusercontent.com'
const CLIENT_SECRET = 'bUl74CvG9vc3xc6wkEInGVAd'

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: "http://localhost:3000/login/auth/google/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ userID: profile.id })
                .then((existingUser) => {
                    if (existingUser) { 
                        done(null, existingUser)
                    } else {
                        new User({ 
                            userID: profile.id,
                            name: profile.name.givenName,
                            shared: 0,
                            downloaded: 0
                        })
                        .save()
                        .then((user) => {
                            done(null, user)
                        })
                    }
                })
        }
    ))

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then((user) => {
                done(null, user)
            })
    })
}

//(err, user) => { return done(err, user)
    