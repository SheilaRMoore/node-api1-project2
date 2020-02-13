// implement your API here
const express = require('express');
const port = 5000;
const db = require('./data/db.js');
const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.send("You have arrived");
});


server.post('/api/users', (req, res) => {
    const newUser = req.body;
    if (newUser.name && newUser.bio) {
        db.insert(newUser)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({
            errorMessage:
                "There was an error while saving the user to the database"
            });
        });
    } else {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    }
});