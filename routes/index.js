const express = require('express')
const router = express.Router()

const checkAuthenticated = require('../check-authenticated')

router.get('/', checkAuthenticated, (req, res) => {
    res.render('index', { name: 'Cuong' })
})

router.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut();
    res.redirect('/login')
})

module.exports = router