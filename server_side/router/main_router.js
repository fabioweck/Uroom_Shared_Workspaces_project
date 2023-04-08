//To initialize router
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
const path = require('path');
const fs = require('fs');
const userService = require('../services/userService');


router.use(express.static('./public')); //  to use script in html, need to use static inside router file instead server file. 
router.use(express.static('./repository'))



//Get the index.html page
router.get('/', function (req, res) {
    const filePath = path.join(__dirname, '../public/index.html');
    res.sendFile(filePath);
});


// Handle POST requests to /signup --- Register new STAFF
router.post('/newUser', (req, res) => {
    try {
        const user = userService.addUser(req.body);
        res.status(200).send({ user: user });
    } catch (error) {
        res.status(error.code).send(error.message);
    }
});


// to login
router.post('/login', (req, res) => {

    const { emailAddress, password } = req.body;

    const filePath = path.join(__dirname, '../repository/users.json');
    console.log('passed ghere')
    const data = fs.readFileSync(filePath);
    const users = JSON.parse(data);
    const user = users.find(u => u.emailAddress === emailAddress);
    console.log(user);
    if (!user) {
        // User not found
        res.status(401).send({ message: 'Email not found' });
    } else if (user.password !== password) {
        // Passwords don't match
        res.status(401).send({ message: 'Invalid password' });
    } else {
        // User authenticated

        res.status(200).send({ user_id: user.user_id });
    }
});

module.exports = router;