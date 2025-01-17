// Import the Express module
const express = require('express');

// Create a new router object
const router = express.Router();

const Checklist = require('../models/checklist')

// Define a route handler for GET requests to the root URL of this router ('/')
router.get('/', async (req, res) => {
    try {
        let checklists = await Checklist.find({});
        res.status(200).render('checklists/index', { checklists: checklists })
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Error when displaying the code'})
    }
})

router.get('/new', async(req, res) => {
    try {
        let checklist = new Checklist(); //Creating a empty object not saved on database
        res.status(200).render('checklists/new', { checklist: checklist })
    } catch (error) {
        res.status(500).render('pages/error', {errors: 'Error when form was loaded'})
    }
})

router.get('/:id/edit', async(req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id);
        res.status(200).render('checklists/edit', { checklist: checklist })
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Error when displaying the edition of list'})
    }
})

router.post('/', async (req, res) => {
    let { name } = req.body.checklist;
    let checklist = new Checklist({ name })

    try {
        await checklist.save();
        res.redirect('/checklists');
    } catch (error) {
        res.status(422).render('checklists/new', { checklists: {...checklist, error}})
    }
})


router.get('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id).populate('tasks');
        res.status(200).render('checklists/show', { checklist });
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Error when displaying the list of tasks'})
    }
});


router.put('/:id', async (req, res) => {
    let { name } = req.body.checklist;
    
    try {
        let checklist = await Checklist.findById(req.params.id);

        if (!checklist) {
            return res.status(404).render('pages/error', { error: 'Checklist not found' });
        }

        checklist.name = name;
        await checklist.save();

        res.redirect('/checklists');
    } catch (error) {
        let errors = error.errors;
        res.status(422).render('checklists/edit', { checklist: { ...checklist.toObject(), errors } });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findByIdAndDelete(req.params.id);
        res.redirect('/checklists');
    } catch (error) {
        res.status(500).render('pages/error', {error: 'Error when delete the list of task'})
    }
})

// Export the router object so it can be used in other parts of the application
module.exports = router;
