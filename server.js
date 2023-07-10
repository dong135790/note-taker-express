const express = require('express');
const path = require('path')
// Need to grab process enviroment ?
// '??' -> Just like the or operator, but will only check null value. 
// So if process.env.PORT is null, we will use PORT number 3001
const PORT = process.env.PORT ?? 3001;
// Setting up instance of application
const app = express();
const fs = require('fs');
const uuid = require('./helpers/uuid');
const savedNotes = require('./db/db.json');

// To load js css... Only way to serve static assets is if we expose the directory to public
app.use(express.static('public'));

// Middleware for parsing application/json
app.use(express.json());
// 'urlencoded data represents a URL encoded form.
app.use(express.urlencoded({ extended: true}));
// Request (technically 4 based on instruction GET (notes, *, /api/notes) POST (/api/notes))


app.get('/notes', (req, res) => {
    // Serve the HTML page.
    return res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    // Serve the HTML page.
    return res.sendFile(path.join(__dirname, 'public/notes.html'));
});


// POST request to add new note
app.post('/api/notes', (req, res) => {
    console.log(`Success! ${req.method} request received to add a note`)
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    
    if (title && text ) {
        // Create a new note object
        const newNote = {
            title, 
            text,
            review_id: uuid()
        };
        let newFile = fs.readFileSync('./db/db.json');
        const notes = JSON.parse(newFile);
        
        notes.push(newNote);
        // Converts the new data into string so we can save it.
        const noteString = JSON.stringify(notes, null, 2)
        
        fs.writeFile('./db/db.json', noteString, (err) => {
            err
            ? console.log(err)
            : console.log(`Note for ${newNote.text} has been written to a new JSON file`)
        });
        
        const response = {
            status: "success",
            body: newNote
        };
        
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(200).json('Error in adding note')
    }
});

// if you use '*', it must be on the bottom or it will override every click to index.html page
app.get('*', (req, res) => {
    // Serve the HTML page.
    return res.sendFile(path.join(__dirname, 'public/index.html'));
});

// 127.0.0.1 is the same thing is localhost
app.listen(PORT, () => {
    console.log(`Application is running @ http://localhost:${PORT}`)
});