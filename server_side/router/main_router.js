//To initialize router
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
const path = require('path');
const fs = require('fs');
const userService = require('../services/userService');
const multer = require('multer'); // Multer is a middleware for handling multipart/form-data
router.use(express.static('./public')); //  to use script in html, need to use static inside router file instead server file. 
router.use(express.static('./repository'))

function generateID() {
    return Math.floor(Math.random() * 900000) + 100000;
}

router.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.header(

        "Access-Control-Allow-Headers",

        "Origin, X-Requested-With, Content-Type, Accept"

    );
    next();
});




//Get the index.html page
router.get('/', function (req, res) {
    const filePath = path.join(__dirname, '../public/index.html');
    res.sendFile(filePath);
});


// Register new USER
router.post('/newUser', (req, res) => {

    userService.addUser(req.body)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(err.code).send(err);
        });
});

// Update data for current User
router.post('/updateUser', (req, res) => {

    userService.updateUser(req.body)
        .then(data => {
            res.status(200).send(data);
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


// Update data for current Property
router.post('/updateProperty', (req, res) => {

    userService.updateProperty(req.body)
        .then(data => {
            res.status(200).send(data);
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


// Update data for current Workspace
router.post('/updateWorkspace', (req, res) => {

    userService.updateWorkspace(req.body)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
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

router.get('/getReservedDate', async (req, res) => {

    const workspace_id = req.query.workspace_id;

    userService.getReservedDate(workspace_id)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(err.code).send(err);
        });
});

// Register new Bookings
router.post('/updateReservedDate', (req, res) => {
    //console.log('This is new booking: ', req.body)
    userService.updateReservedDate(req.body)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            //  console.error('passed here', err);
            res.status(err.code).send(err);
        });
});


router.post('/delistWorkspace', async (req, res) => {

    const user_id = req.query.user_id;
    const workspace_id = req.query.workspace_id;

    userService.delistWorkspace(user_id, workspace_id)
        .then(workpaceDelist => {
            res.status(200).send(workpaceDelist);
        })
        .catch(err => {
            res.status(err.code).send(err);
        });
});

router.post('/delistProperty', async (req, res) => {

    const user_id = req.query.user_id;
    const property_id = req.query.property_id;

    userService.delistProperty(user_id, property_id)
        .then(propertydelist => {
            res.status(200).send(propertydelist);
        })
        .catch(err => {
            res.status(err.code).send(err);
        });
})


//==================================Testing===========================//



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './repository/img'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        const workspaceId = 'a42';
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${workspaceId}${generateID()}.${fileExtension}`; // Set the file name for uploaded files
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });


router.post('/upload', upload.single('workspaceImage'), function (req, res) {
    res.send('File uploaded successfully'); // Return a response to the client indicating that the file was uploaded successfully
});

//========================================================================//

module.exports = router;