const express = require('express')
const router = express.Router()

const Assignment = require('../models/assignment')
const Course = require('../models/course')

const documentMimeType = ['application/pdf']

const checkAuthenticated = require('../check-authenticated')

router.get('/', checkAuthenticated, async (req, res) => {
    let assignments
    try {
        assignments = await Assignment.find().sort('desc')
    } catch {
        assignments = []
    }
    res.render('assignments/index', { assignments: assignments })
})

router.get('/new', checkAuthenticated, (req, res) => {
    renderNewPage(res, new Assignment())
})

router.post('/', checkAuthenticated, async(req, res) => {
    const assignment = new Assignment({
        title: req.body.title,
        course: req.body.course,
        description: req.body.description,
        author: req.user.id
    })
    saveDocument(assignment, req.body.document)
    try {
        await assignment.save()
        res.redirect('/assignments')
    } catch(err) {
        console.log(err)
        renderNewPage(res, assignment, true)
    }
})

router.get('/:id', checkAuthenticated, async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('course').populate('author').exec()
        res.render('assignments/show', { assignment: assignment })
    } catch(err) {
        console.log(err)
        res.redirect('/assignments')
    }
})

router.get('/:id/edit', checkAuthenticated, async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
        renderEditPage(res, assignment)
    } catch {
        res.redirect('/assignments')
    }
})

router.put('/:id', checkAuthenticated, async (req, res) => {
    let assignment
    try {
        assignment = await Assignment.findById(req.params.id)
        assignment.title = req.body.title
        assignment.course = req.body.course
        assignment.description = req.body.description
        if (req.body.document != null && req.body.document !== '') {
            saveDocument(assignment, req.body.document)
        }
        await assignment.save()
        res.redirect(`/assignments/${assignment.id}`)
    } catch(err) {
        console.log(err)
        if (assignment != null) {
            renderEditPage(res, assignment, true)
        } else {
            res.redirect('/assignments')
        }
    }
})

router.delete('/:id', checkAuthenticated, async(req, res) => {
    let assignment
    try {
        assignment = await Assignment.findById(req.params.id)
        assignment.remove()
        res.redirect('back')
    } catch {
        res.render('assignments/show', {
            assignment: assignment,
            errorMessage: 'Deleting assignment error!'
        })
    }
})

function renderNewPage(res, assignment, hasError = false) {
    renderFormPage(res, assignment, 'new', hasError)
}

function renderEditPage(res, assignment, hasError = false) {
    renderFormPage(res, assignment, 'edit', hasError)
}

async function renderFormPage(res, assignment, form, hasError = false) {
    try {
        const courses = await Course.find({})
        const params = {
            courses: courses,
            assignment: assignment,
        }
        if (hasError) {
            if (form == 'edit') {
                params.errorMessage = 'Updating assignment error!'
            } else {
                params.errorMessage = 'Creating assignment error!'
            }
        }   
        res.render(`assignments/${form}`, params)
    } catch {
        res.redirect('/assignments')
    }
}

function saveDocument(assignment, documentEncoded) {
    if (documentEncoded == null) return
    const document = JSON.parse(documentEncoded)
    if (document != null && documentMimeType.includes(document.type)) {
        assignment.document = new Buffer.from(document.data, 'base64')
        assignment.documentType = document.type
    }
}

module.exports = router