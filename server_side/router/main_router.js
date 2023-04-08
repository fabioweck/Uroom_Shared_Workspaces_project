//To initialize router
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
const path = require("path");
const fs = require("fs");
const userService = require("../services/userService");
const view = require("../services/view");
const cors = require("cors");
router.use(cors());



router.use(express.static("./public")); //  to use script in html, need to use static inside router file instead server file.
router.use(express.static("./repository"));

//Get the index.html page
router.get("/", function (req, res) {
  const filePath = path.join(__dirname, "../public/index.html");
  res.sendFile(filePath);
});

// Handle POST requests to /signup --- Register new STAFF
router.post("/newUser", (req, res) => {
  try {
    const user = userService.addUser(req.body);
    res.status(200).send({ user: user });
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

// to login
router.post("/login", (req, res) => {
  const { emailAddress, password } = req.body;

  const filePath = path.join(__dirname, "../repository/users.json");
  console.log("passed ghere");
  const data = fs.readFileSync(filePath);
  const users = JSON.parse(data);
  const user = users.find((u) => u.emailAddress === emailAddress);
  console.log(user);
  if (!user) {
    // User not found
    res.status(401).send({ message: "Email not found" });
  } else if (user.password !== password) {
    // Passwords don't match
    res.status(401).send({ message: "Invalid password" });
  } else {
    // User authenticated

    res.status(200).send({ user_id: user.user_id });
  }
});

router.post("/profile", (req, res) => {
  const { user_id } = req.body;

  const filePath = path.join(__dirname, "../repository/users.json");
  console.log("passed profile");
  const data = fs.readFileSync(filePath);
  const users = JSON.parse(data);
  const user = users.find((u) => u.user_id === user_id);
  delete user.password;
  res.status(200).send({ user });
  // if (!user) {
  //     // User not found
  //     res.status(401).send({ message: 'Email not found' });
  // } else if (user.password !== password) {
  //     // Passwords don't match
  //     res.status(401).send({ message: 'Invalid password' });
  // } else {
  //     // User authenticated
  //     res.status(200).send({ user_id: user.user_id });
  // }
});

// Handle POST requests to /signup --- Register new STAFF
router.post("/newProperty", (req, res) => {
  try {
    const property = userService.addProperty(req.body);
    res.status(200).send({ property: property });
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

router.post("/newWorkspace", (req, res) => {
  try {
    const workspace = userService.addWorkspace(req.body);
    res.status(200).send({ workspace: workspace });
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

router.get("/findPropertyByOwner", async (req, res) => {
  const user_id = req.query.user_id;

  try {
    const property = await loadPropertyJson();

    const filterPropertyByOwner = property.filter(
      (propertyOnly) => propertyOnly.user_id === user_id
    );

    res.send(filterPropertyByOwner);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/findWorkspaceByOwner", async (req, res) => {
  const user_id = req.query.user_id;

  try {
    const workspace = await loadWorkspaceJson();

    const filterWorkspaceByOwner = workspace.filter(
      (workspaceOnly) => workspaceOnly.user_id === user_id
    );

    res.send(filterWorkspaceByOwner);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/findWorkspace", async (req, res) => {
  const user_id = req.query.user_id;

  try {
    const workspace = await loadWorkspaceJson();

    const filterWorkspaceByOwner = workspace.filter(
      (workspaceOnly) => workspaceOnly.user_id === user_id
    );

    res.send(workspace);
  } catch (error) {
    console.error(error);

    res.status(500).send("Internal server error");
  }
});

router.post("/viewAsTable", async (req, res) => {
  const { dataEntry, columns } = req.body;
  const table = view.parseAsTable(dataEntry, columns);
  res.send(table);
});
function loadPropertyJson() {
  const filePath = path.join(__dirname, "../repository/properties.json");
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const property = JSON.parse(data);
      resolve(property);
    });
  });
}

function loadWorkspaceJson() {
  const filePath = path.join(__dirname, "../repository/workspaces.json");
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const workspace = JSON.parse(data);
      resolve(workspace);
    });
  });
}

module.exports = router;
