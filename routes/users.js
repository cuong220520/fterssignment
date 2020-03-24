const express = require('express')
const router = express.Router()

const User = require('../models/user')
const Assignment = require('../models/assignment')

const checkAuthenticated = require('../check-authenticated')

router.get('/:id', checkAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const assignments = await Assignment.find({ author: user.id })
        res.render('users/index', { 
            user: user, 
            assignmentsByUser: assignments 
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router