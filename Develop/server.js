// Setting up dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

// Setting up Express
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

// Start server
app.listen(PORT, () => console.log(`Notes App Is Live at ${PORT}`));

// Creating a API GET
const notes = require("./db/db.json");
app.get("/api/notes", (req,res) => res.json(notes));

// API POST
app.post("/api/notes", (req,res) => {
    notes.push(req.body);
    
    let id = 1;
    
    // assigning id for notes
    notes.forEach((notes) => {
        notes.id = id;
        id++;
        return notes;
    });

    res.json(true);

    fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
        if(err) throw err;
    })

    res.end();
})

// Creating a delete function
app.delete("/api/notes.html/:id", function (req,res) {
    const deleteNote = req.params.id;
    for(let i = 0; i < notes.length; i++) {
        if (notes[i].id === Number(deleteNote)) {
            notes.splice(i,1);
        }

        fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
            if(err) throw err;
        })
        res.end();
    }
})

// HTML GET
app.get("/notes.html", (req,res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// Default to home
app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});