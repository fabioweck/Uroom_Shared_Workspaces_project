
const port = 3010;
const baseUrl = `http://localhost:${port}/`;
 
let loggedUser; //
let authUser; //receives

const login = document.querySelector('#submit').addEventListener('click', userLogin);

async function userLogin() {

    // Retrieve input values from HTML form
    const emailAddress = document.getElementById("emailAddressLogin").value;
    const password = document.getElementById("passwordLogin").value;

    // Convert input values to JSON format
    const newUserData = {
        emailAddress,
        password,
    };

    const displayError = document.querySelector('#dv-display');

    // Send POST request to server with new staff data
    await fetch(baseUrl + 'login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"},
        body: JSON.stringify(newUserData),
    })
        .then(response => { 
            
            if(response.status == 401)
            {
                
                response.json().then(data=>{

                    displayError.style.display = "flex";
                    displayError.innerHTML = data.message;
                    return;
                })                        
            }
            else if(response.status == 200)
            {
                return response.json();    
            }
        })
        .then((data) => {   

            displayError.style.display = "none";
            localStorage.setItem('user_id', data.user_id);
            authUser = localStorage.getItem('user_id');
            loggedUser = authUser;
            // storeUserId(data.user_id);
            window.location.href = "booking.html";
        })
        .catch((error) => {     
            console.error(error);
        });
};


//==============================Standard functions========================//

// Keep current userId on browser's memory
function storeUserId(req, res) {
    localStorage.setItem('user_id', req.user_id);
    authUser = localStorage.getItem('user_id');
    loggedUser = authUser;
    //res.status(200).send('Storage sucessful on the browser')
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
    authUser = "";
    loggedUser = authUser;
    window.location.href = "login.html"; 
}

// clean up all user input data after a action
function clearAllInputs() {
    const inputFields = document.querySelectorAll('input');
    inputFields.forEach(input => {
        input.value = '';
    });
}

