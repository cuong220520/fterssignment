const express = require('express')
const router = express.Router()
const passport = require('passport')

const checkNotAuthenticated = require('../check-not-authenticated')

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('login/login')
})

router.get('/auth/google', checkNotAuthenticated, 
    passport.authenticate('google', { 
        scope: ['email', 'profile', 'openid'] 
    })
)

router.get('/auth/google/callback', checkNotAuthenticated, 
    passport.authenticate('google', {
        successRedirect: '../../../',
        failureRedirect: '/'
    })
)

module.exports = router