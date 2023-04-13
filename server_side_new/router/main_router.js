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

router.use((req, res, next) => { res.setHeader("Access-Control-Allow-Origin", "*"); res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" ); next(); });


//Get the index.html page
router.get('/', function (req, res) {
    const filePath = path.join(__dirname, '../public/index.html');
    res.sendFile(filePath);
});


// Register new USER
router.post('/newUser', (req, res) => {

    userService.addUser(req.body)
        .then(userFullName => {
            res.status(200).send(userFullName);
        })
        .catch(err => {
            res.status(err.code).send(err);
        });
});

// to login
router.post('/login', (req, res) => {

    userService.login(req.body)
        .then(userMatch => {
            res.status(200).send(userMatch);
        })
        .catch(err => {
            res.status(err.code).send(err);
        });
});

// Register new Property
router.post('/newProperty', (req, res) => {

    userService.addProperty(req.body)
        .then(newPropertyAddress => {
            res.status(200).send(newPropertyAddress);
        })
        .catch(err => {
            res.status(err.code).send(err);
        });
});

// Register new Workspace
router.post('/newWorkspace', (req, res) => {

    userService.addWorkspace(req.body)
        .then(newWorkspaceType => {
            res.status(200).send(newWorkspaceType);
        })
        .catch(err => {
            //  console.error('passed here', err);
            res.status(err.code).send(err);
        });
});

router.get('/findPropertyByOwner', async (req, res) => {

    const user_id = req.query.user_id;

    userService.findPropertyByOwner(user_id)
        .then(filteredProperties => {
            res.status(200).send(filteredProperties);
        })
        .catch(err => {
            res.status(err.code).send(err);
        });
});

router.get('/findWorkspaceByOwner', async (req, res) => {

    const user_id = req.query.user_id;

    userService.findWorkspaceByOwner(user_id)
        .then(filteredWorkspaces => {
            res.status(200).send(filteredWorkspaces);
        })
        .catch(err => {
            res.status(err.code).send(err);
        });
});

router.get('/getWorkspaceByOwner', async (req, res) => {

    const user_id = req.query.user_id;

    userService.getWorkspaceByOwner(user_id)
        .then(filteredWorkspaces => {
            res.status(200).send(filteredWorkspaces);
        })
        .catch(err => {
            res.status(err.code).send(err);
        });
});

module.exports = router;