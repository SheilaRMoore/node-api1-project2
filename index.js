// implement your API here
const db = require('./data/db');
const express = require('express'); // import the express package


const server = express();// creates the server

server.listen(4000, () => {
    console.log('server listening on port 4000');// watch for connections on port 
});

server.use(express.json());
// handle requests to the root of the api, the / route
server.get('/', (req, res) => {
    res.send('server is returning data');
});
 
//add user
server.post('/api/users', (req, res) => {
    
    const newUser = req.body;

    db.insert(newUser)
        .then(add => {
            if (add.name === "" || add.bio === "") {
                res.status(400).json({ success: false, message: 'Please provide name and bio for the user' });
            }
            else {
                const  userNew =
                    {
                        id: shortid.generate(),
                        name: add.name,
                        bio: add.bio
                    }

                res.status(201).json({ success: true, message: 'User created' });
            }
        })
        
        .catch(err => res.status(500).json({ success: false, errorMessage: 'There was error saving user to the database', err }))
});
server.get('/api/users', (req,res) => {
    db.find()
        .then(getUser => {
            res.status(200).json(getUser);
        })
        
        .catch(err => res.status(500).json({ success: false, errorMessage: 'The users info cannot be retirieved'}))
})

//get users

server.get('/api/users/:id', (req, res) => {
    
    const { id } = req.params;
    
    db.findById(id)
        .then(getID => {
            if (getID) {
                console.log(getID);
                res.status(200).json(getID);
            }
            else {
                res.status(404).json({success: false, errorMessage: 'The user with the specified ID does not exist' });
            }
        })
        .catch(err => res.status(500).json({ success: false, errorMessage:'The user info cannot be retrieved' }))
})

//delete user
server.delete('/api/users/:id', (req, res) => {
    
    const { id } = req.params;

    db.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(200).json(deleted);
            }
            else {
                res.status(404).json({ success: false, errorMessage: 'The user with the specified ID does not exist' });
            }
        })
        .catch(err => res.status(500).json({ success: false, errorMessage: 'The user cannot be removed' }))
})
        
        //update user
        
        server.put('/api/users/:id', (req, res) => {
            const { id } = req.params;
            const newInfo = req.body;
        
            db.update(id, newInfo)
        
                .then(updated => {
                
                    if (updated) {
                        res.status(200).json(newInfo); 
                    }
        
                    else if (!newInfo.name || !newInfo.bio) {
                        res.status(400).json({ success: false, errorMessage: 'Please provide name and bio for the user' });
                    }
                    
                    else  {
                        res.status(404).json({ success: false, errorMessage: 'The user with the specified ID does not exist' });
                    } 
                }) 
                .catch(err => res.status(500).json({ success: false, errorMessage: 'The user information could not be modified' }))
        });
 
