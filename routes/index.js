const express = require('express')
const router = express.Router()

const User = require('../models/user')

const checkAuthenticated = require('../check-authenticated')

router.get('/', checkAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id)
    res.render('index', { user: user })
})

router.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut();
    res.redirect('/login')
})

module.exports = router