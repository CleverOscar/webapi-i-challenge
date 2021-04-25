const express = require('express');

const database = require('./db.js');

const server = express();

server.use(express.json());


server.get('/', (req,res) => {
    res.status(200);
    res.send('Welcome To ExpressJS');
});

server.get('/api/users', (req, res) => {
    database.find().then(users => {
        console.log(users);
        res.status(200).json(users);
    }).catch(err => res.status(500).json({message: err.message}))
})

server.post('/api/users', (req, res) => {
    const {newUser} = req.body;

    if(!newUser.name || !newUser.bio) {
        res.status(500).json({message: "User name and Bio required"})
    }else {
        database.insert(newUser)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => 
                res.status(500).json({message: err.message}))
    }

})

server.get('/api/users/:id', (req, res) =>{

    //to find the user, we need to store the id we pass into our function

    const {id} = req.params;

    database.findById(id).then(user => {
        if(!user){
            res.status(404).json({message: "user does not exists"})
        } else {
            res.status(200).json(user)
        }
    }).catch(err => {res.status(500).json({message: err.message})})
   
})

server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;

    const changes = req.body;

    database.update(id, changes)
        .then(id => {
            res.status(200).json(changes)
        })
        .catch(err => res.status(500).json({message: err.message}))

})


server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;

    database.remove(id).then(id => {
        res.status(200).json(id)
    }).catch(err => {
        res.status(500).json({message: err.message})
    })

})


module.exports = server;