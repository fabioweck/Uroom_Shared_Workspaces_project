// const { response } = require("express");

// router server config port

const port = 3010;
const baseUrl = `http://localhost:${port}/`;


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