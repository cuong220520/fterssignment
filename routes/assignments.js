const express = require('express')
const router = express.Router()

const Assignment = require('../models/assignment')
const Course = require('../models/course')

const documentMimeType = ['application/pdf']

const checkAuthenticated = require('../check-authenticated')

router.get('/', checkAuthenticated, async (req, res) => {
    searchOptions = {}

    if (req.query.title != null && req.query.title != '') {
        searchOptions.title = new RegExp(req.query.title, 'i')
    }

    if (req.query.grade != null && req.query.grade != '') {
        searchOptions.grade = new RegExp(req.query.grade, 'i')
    }

    try {
        const assignments = await Assignment.find(searchOptions)
        res.render('assignments/index', {
            assignments: assignments,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/assignments')
    }

    // let assignments
    // try {
    //     assignments = await Assignment.find().sort('desc')
    // } catch {
    //     assignments = []
    // }
    // res.render('assignments/index', { assignments: assignments })
})

router.get('/new', checkAuthenticated, (req, res) => {
    renderNewPage(res, new Assignment())
})

router.post('/', checkAuthenticated, async(req, res) => {
    const changedTitle = req.body.title + ' - ' + req.user.name
    const assignment = new Assignment({
        title: changedTitle,
        course: req.body.course,
        description: req.body.description,
        author: req.user.id,
        grade: req.body.grade
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
        const user = req.user
        const comments = Comment.findById(req.params.id)
        res.render('assignments/show', { assignment: assignment, user: user, commentsByUser: comments })
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
        const changedTitle = req.body.title + ' - ' + req.user.name
        assignment = await Assignment.findById(req.params.id)
        assignment.title = changedTitle
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
        res.redirect('/assignments')
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