const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');


//*****************Route 1: Get all the notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")  //status code 500 bhej do and json me ye bhej do
    }
})

//*****************Route 2: Add the notes using: POST "/api/notes/addnotes". Login required
router.post('/addnotes', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 2 }),
    body('description', 'description length should be min. 8').isLength({ min: 5 }),
], async (req, res) => {
    // const notes = await Notes.find({ user: req.user.id });

    try {
        //if there are errors in validation of length of anything, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });  //status code 400 bhej do and json me ye bhej do
        }


        const { title, description, tag } = req.body;   //doing destructuring


        //ye note ek promise return karega
        const notes = new Notes({
            title, description, tag, user: req.user.id
        })

        const saveNotes = await notes.save();

        res.json(saveNotes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")  //status code 500 bhej do and json me ye bhej do
    }
})

//*****************Route 3: Update the notes using: PUT "/api/notes/updatenotes". Login required
router.put('/updatenotes/:id', fetchuser, async (req, res) => {   //yaha par "/:id" isiliye lagayi hai taaki jiska vo note vo bas vahi note ko updat ekar sake baaki koi naa kare and hum ek validation bhi lagayege iske liye

    const { title, description, tag } = req.body;   //doing destructuring

    try {
        // create a new notes obejct
        const newNote = {};  //agr body me title aa raha hai, to apne title ko update kar do, aur agr mahi aa raha means user title ko update nahi karna chahata hai
        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }  //same goes with descriotion and tag
        if (tag) { newNote.tag = tag; }

        //find the note to be updated and update it
        let notes = await Notes.findById(req.params.id);  //ye vo id hai jo apn de rahe hai, upar in the url line 53

        //agr note exists hee nahi karta hai
        if (!notes) {
            return res.status(404).send("No such note found")
        }

        //agr koi user logged in hai and vo kisi dusre ka note k access karne ka try kar raha hai tab ye kar do
        if (notes.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }

        //agr upar ke dono chize laagu nahi ho rahe means aona user legit hai and vo update karna chahta hai khudke he note ko
        notes = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ notes });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")  //status code 500 bhej do and json me ye bhej do
    }
})

//*****************Route 4: Delete the notes using: DELETE "/api/notes/deletenotes". Login required
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {   //yaha par "/:id" isiliye lagayi hai taaki jiska vo note vo bas vahi note ko updat ekar sake baaki koi naa kare and hum ek validation bhi lagayege iske liye

    try {
        //jo insaan delete kar raha hai, kya ye note usi ka hai

        //find the note to be deleted and delete it
        let notes = await Notes.findById(req.params.id);  //ye vo id hai jo apn de rahe hai, upar in the url line 53

        //agr note exists hee nahi karta hai
        if (!notes) {
            return res.status(404).send("Not found")
        }

        //agr koi user logged in hai and vo kisi dusre ka note k access karne ka try kar raha hai tab ye kar do
        //Allow deleteion only if he owns this note
        if (notes.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }

        //agr upar ke dono chize laagu nahi ho rahe means aona user legit hai and vo update karna chahta hai khudke he note ko
        notes = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", notes });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured")  //status code 500 bhej do and json me ye bhej do
    }
})

module.exports = router