const { response } = require("express");

// router server config port
const port = 3010;
const baseUrl = `http://localhost:${port}/`;

function generateID() {
    return Math.floor(Math.random() * 900000) + 100000;
}


async function sendNewUserClient() {

    // Retrieve input values from HTML form
    const fullName = document.getElementById("FullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const emailAddress = document.getElementById("emailAddress").value;
    const password = document.getElementById("password").value;
    const owner = parseInt(document.querySelector('input[name="owner"]:checked').value) ? true : false;

    // Convert input values to JSON format
    const newUserData = {
        fullName,
        phoneNumber,
        emailAddress,
        password,
        owner,
    };

    console.log(newUserData);
    console.log(typeof newUserData.owner); // Output: boolean


    // Send POST request to server with new staff data
    await fetch(baseUrl + 'newUser', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
    })

        .then(response => response.json())
        .then(data => {
            console.log(data);
        }
        )
        .catch((error) => console.error(error));
}

async function userLogin() {

    // Retrieve input values from HTML form
    const emailAddress = document.getElementById("emailAddressLogin").value;
    const password = document.getElementById("passwordLogin").value;

    // Convert input values to JSON format
    const newUserData = {
        emailAddress,
        password,
    };

    // Send POST request to server with new staff data
    await fetch(baseUrl + 'login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something wrong try again');
        })
        .then((data) => {

            storeUserId(data.user_id);
            storeOwner(data.owner);

            clearAllInputs();
            window.location.href = "booking.html";
        })
        .catch((error) => {
            console.error(error);
        });
};

async function sendNewProperty() {

    // Retrieve input values from HTML form
    const address = document.getElementById("address").value;
    const neighborhood = document.getElementById("neighborhood").value;
    const ParkingLot = document.getElementById("parkingLot").value;
    const PublicTransportation = document.getElementById("publicTransportation").value;
    const status = document.querySelector('input[name="status"]:checked').value;
    const property_id = generateID();
    const user_id = getCurrentUser();

    // Convert input values to JSON format
    const newPropertyData = {
        property_id,
        address,
        neighborhood,
        ParkingLot,
        PublicTransportation,
        status,
        user_id
    };

    // Send POST request to server with new staff data
    await fetch(baseUrl + 'newProperty', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newPropertyData),
    })

        .then(response => response.json())
        .then(data => {
            console.log(data);
            clearAllInputs()
        }
        )
        .catch((error) => console.error(error));

}


async function sendNewWorkspace() {

    // Retrieve input values from HTML form
    const workspace_type = document.getElementById("workspace_type").value;
    const seats = parseInt(document.getElementById("seats").value);
    const smoking = document.getElementById("smoking").value;
    const price = parseFloat(document.getElementById("price").value);
    const sqft = parseFloat(document.getElementById("sqft").value);
    const lease_term = document.getElementById("lease_term").value;
    const property_id = parseInt(document.getElementById("property_id").value);
    const status = parseInt(document.querySelector('input[name="status"]:checked').value) ? true : false;
    const workspace_id = parseInt(generateID());
    const user_id = getCurrentUser();

    // Convert input values to JSON format
    const newWorkspaceData = {
        workspace_id,
        workspace_type,
        seats,
        smoking,
        price,
        sqft,
        lease_term,
        property_id,
        user_id,
        status
    };

    // Send POST request to server with new staff data
    await fetch(baseUrl + 'newWorkspace', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkspaceData),
    })
        .then(response => response.json())
        .then(data => {
            clearAllInputs()
            console.log(data);
        })
        .catch((error) => console.error(error));
}

async function findPropertyByOwner() {

    const user_id = getCurrentUser();

    await fetch(baseUrl + 'findPropertyByOwner?user_id=' + user_id)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(error));
};

async function findWorkspaceByOwner() {

    const user_id = getCurrentUser();

    await fetch(baseUrl + 'findWorkspaceByOwner?user_id=' + user_id)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(error));
};

async function getWorkspaceByOwner() {

    const user_id = getCurrentUser();

    await fetch(baseUrl + 'getWorkspaceByOwner?user_id=' + user_id)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(error));
};

async function delistWorkspace(workspace) {
    const workspace_id = workspace;
    const user_id = getCurrentUser();

    await fetch(`${baseUrl}delistWorkspace?user_id=${user_id}&workspace_id=${workspace_id}`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(error));
};

async function delistProperty(property) {
    const property_id = property;
    const user_id = getCurrentUser();

    await fetch(`${baseUrl}delistProperty?user_id=${user_id}&property_id=${property_id}`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(error));
}

async function getReservedDate(workspace) {

    const workspace_id = workspace;
    await fetch(`${baseUrl}getReservedDate?workspace_id=${workspace_id}`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(error));
}


async function updateReservedDate(workspace, bookingDate) {

    const workspace_id = workspace;

    await fetch(`${baseUrl}updateReservedDate?workspace_id=${workspace_id}`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.error(error));
}






//====================Standard Functions======================//

// Keep current userId on browser's memory
function storeUserId(req, res) {
    localStorage.setItem('user_id', req.user_id);
    res.status(200).send('Storage sucessful on the browser')
}

// Keep current owner on browser's memory
function storeOwner(req, res) {
    localStorage.setItem('owner', req.owner);
    res.status(200).send('Storage sucessful on the browser')
}

//Get user_id from browser's memory
function getCurrentUser() {
    return localStorage.getItem('user_id');
}

//Get owner from browser's memory
function getCurrentOwner() {
    return localStorage.getItem('owner');
}

// Delete current userId from browser's memory
function logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('owner');
}

// clean up all user input data after a action
function clearAllInputs() {
    const inputFields = document.querySelectorAll('input');
    inputFields.forEach(input => {
        input.value = '';
    });
}


//-----------------------------------
//window.onload = async function () { };

module.exports = { generateID }
