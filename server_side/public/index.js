
// router server config port
const port = 3010;
const baseUrl = `http://localhost:${port}/`;


function generateID() {
    return Math.floor(Math.random() * 900000) + 100000;
}



//function to convert new staff in json file
async function sendNewUserClient() {

    // Retrieve input values from HTML form
    const fullName = document.getElementById("FullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const emailAddress = document.getElementById("emailAddress").value;
    const password = document.getElementById("password").value;
    const owner = document.querySelector('input[name="owner"]:checked').value;

    const requiredFields = { fullName, phoneNumber, emailAddress, password, owner }
    let error = false;
    let errorMessage = '';

    //check if all required fields were filled
    for (const key in requiredFields) {
        if (!requiredFields[key] || requiredFields[key].trim() === '') {
            errorMessage = errorMessage + `<b>${key}</b> is a required field and cannot be empty or undefined<br>`;
            error = true;
        }
    }

    const displayDiv = document.getElementById('dv-display');

    if (error) {
        displayDiv.innerHTML = errorMessage;
        displayDiv.classList.remove(...displayDiv.classList); // remove all classes
        displayDiv.classList.add('error'); // add "error" class
    } else {

        // Convert input values to JSON format
        const newUserData = {
            fullName,
            phoneNumber,
            emailAddress,
            password,
            owner,
        };

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
                displayDiv.innerHTML = `New user <b>${data.user.fullName}</b> added successfully!`;
                displayDiv.classList.remove(...displayDiv.classList); // remove all classes
                displayDiv.classList.add('success'); // add "sucess" class
                clearAllInputs()
                document.getElementById('emailAddressLogin').value = newUserData.emailAddress;
                document.getElementById('passwordLogin').value = newUserData.password;

            }
            )
            .catch((error) => console.error(error));
    }
}

// clean up all user input data after a action
function clearAllInputs() {
    const inputFields = document.querySelectorAll('input');
    inputFields.forEach(input => {
        input.value = '';
    });
}

async function userLogin() {

    // Retrieve input values from HTML form
    const emailAddress = document.getElementById("emailAddressLogin").value;
    const password = document.getElementById("passwordLogin").value;
    console.log(password, emailAddress);
    const requiredFields = { emailAddress, password }
    let error = false;
    let errorMessage = '';

    //check if all required fields were filled
    for (const key in requiredFields) {
        if (!requiredFields[key] || requiredFields[key].trim() === '') {
            errorMessage = errorMessage + `<b>${key}</b> is a required field and cannot be empty or undefined<br>`;
            error = true;
        }
    }

    const displayDiv = document.getElementById('dv-display');

    if (error) {
        displayDiv.innerHTML = errorMessage;
        displayDiv.classList.remove(...displayDiv.classList); // remove all classes
        displayDiv.classList.add('error'); // add "error" class
    } else {

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
                console.log(data.user_id);

                localStorage.setItem('user_id', data.user_id);

                clearAllInputs();
                window.location.href = "logon.html";
            })
            .catch((error) => {
                console.error(error);
                displayDiv.innerHTML = `Error: ${error.message}`;
                displayDiv.classList.remove(...displayDiv.classList);
                displayDiv.classList.add('error');
            });
    };
}

function logout() {
    localStorage.removeItem('user_id');
    window.location.href = "index.html";
}

async function profileData() {
    const user_id = localStorage.getItem('user_id');
    const user = { user_id };
    await fetch(baseUrl + 'profile', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}




async function sendNewProperty() {

    // Retrieve input values from HTML form
    const address = document.getElementById("address").value;
    const neighborhood = document.getElementById("neighborhood").value;
    const ParkingLot = document.getElementById("parkingLot").value;
    const PublicTransportation = document.getElementById("publicTransportation").value;
    const status = document.querySelector('input[name="status"]:checked').value;
    const property_id = generateID();
    const user_id = localStorage.getItem('user_id');
    const requiredFields = { address, neighborhood, ParkingLot, PublicTransportation, status }
    let error = false;
    let errorMessage = '';

    //check if all required fields were filled
    for (const key in requiredFields) {
        if (!requiredFields[key] || requiredFields[key].trim() === '') {
            errorMessage = errorMessage + `<b>${key}</b> is a required field and cannot be empty or undefined<br>`;
            error = true;
        }
    }

    const displayDiv = document.getElementById('dv-display');

    if (error) {
        displayDiv.innerHTML = errorMessage;
        displayDiv.classList.remove(...displayDiv.classList); // remove all classes
        displayDiv.classList.add('error'); // add "error" class
    } else {

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
                displayDiv.innerHTML = `New Property <b>${data.property.property_id}</b> added successfully!`;
                displayDiv.classList.remove(...displayDiv.classList); // remove all classes
                displayDiv.classList.add('success'); // add "sucess" class
                clearAllInputs()
            }
            )
            .catch((error) => console.error(error));
    }
}



async function findPropertyByOwner() {

    const columns = ['Property ID', 'Address', 'Neighborhood', 'ParkingLot', 'Public Transport Closer', 'Status'];

    const placeToDisplay = 'property_list'

    const user_id = localStorage.getItem('user_id');

    const filtered = fetch(baseUrl + 'findPropertyByOwner?user_id=' + user_id)
        .then(response => response.json())
        .then(data => {
            data.forEach(obj => delete obj.user_id);
            console.log(data);
            // parsedView(data, columns, placeToDisplay)
            return data;

        })
        .catch(error => console.error(error));
};


async function findWorkspaceByOwner() {

    const columns = ['Workspace ID', 'Model', 'Seats', 'Smoke Frendly', 'Price', 'Size(sqft)', 'Lease Term', 'Property ID', 'Status'];

    const placeToDisplay = 'workspace_list';

    const user_id = localStorage.getItem('user_id');

    const filtered = fetch(baseUrl + 'findWorkspaceByOwner?user_id=' + "18059eac-c6b1-4bda-b462-521d0323c5c5"/*user_id*/)
        .then(response => response.json())
        .then(data => {
            data.forEach(obj => delete obj.user_id);
            console.log(data);
            parsedView(data, columns, placeToDisplay)

            return data;

        })
        .catch(error => console.error(error));
};

async function findWorkspace() {

    const columns = ['Workspace ID', 'Model', 'Seats', 'Smoke Frendly', 'Price', 'Size(sqft)', 'Lease Term', 'Property ID', 'Status'];

    const placeToDisplay = 'workspace_list';

    const user_id = localStorage.getItem('user_id');

    const filtered = fetch(baseUrl + 'findWorkspace')
        .then(response => response.json())
        .then(data => {
            data.forEach(obj => delete obj.user_id);
            console.log(data);
            parsedView(data, columns, placeToDisplay)

            return data;

        })
        .catch(error => console.error(error));
};









async function sendNewWorkspace() {

    // Retrieve input values from HTML form
    const workspace_type = document.getElementById("workspace_type").value;
    const seats = document.getElementById("seats").value;
    const smoking = document.getElementById("smoking").value;
    const price = document.getElementById("price").value;
    const sqft = document.getElementById("sqft").value;
    const lease_term = document.getElementById("lease_term").value;
    const property_id = document.getElementById("property_id").value;
    const status = document.querySelector('input[name="status"]:checked').value;
    const workspace_id = generateID();
    const user_id = localStorage.getItem('user_id');
    const requiredFields = { workspace_type, seats, smoking, price, sqft, lease_term, property_id, status }
    let error = false;
    let errorMessage = '';

    //check if all required fields were filled
    for (const key in requiredFields) {
        if (!requiredFields[key] || requiredFields[key].trim() === '') {
            errorMessage = errorMessage + `<b>${key}</b> is a required field and cannot be empty or undefined<br>`;
            error = true;
        }
    }

    const displayDiv = document.getElementById('dv-display');

    if (error) {
        displayDiv.innerHTML = errorMessage;
        displayDiv.classList.remove(...displayDiv.classList); // remove all classes
        displayDiv.classList.add('error'); // add "error" class
    } else {

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
                displayDiv.innerHTML = `New Workspace <b>${data.workspace.workspace_id}</b> added successfully!`;
                displayDiv.classList.remove(...displayDiv.classList); // remove all classes
                displayDiv.classList.add('success'); // add "sucess" class
                clearAllInputs()
            }
            )
            .catch((error) => console.error(error));
    }
}

async function parsedView(dataEntry, columns, placeToDisplay) {


    fetch(baseUrl + 'viewAsTable', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ dataEntry, columns }),
    })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            return document.getElementById(placeToDisplay).innerHTML = data;
        })
        .catch(error => console.error(error));
}








//-----------------------------------
window.onload = async function () {
    await profileData();
    findPropertyByOwner();
    findWorkspaceByOwner();
}