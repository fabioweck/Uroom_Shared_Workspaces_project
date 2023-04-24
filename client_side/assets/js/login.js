/*
************************************************
### LOGIN ###
************************************************
*/
/*=============================================
→ ### IMPORTS ### */
import { baseUrl, getLoggedUser, clearLoggerdUser } from "./general_conf.js";

/*=============================================
→ ### LOAD CHECKER ### */
let login;

//Fields hidden/displayed after login/logout
const loginFields = document.querySelector("#login-box");
const logoutBox = document.querySelector("#logout-box");

//Check if key exists and display logout box/hide login box
const checkLogged = window.addEventListener("load", () => {
  const navbarLogin = document.querySelector("#link-login");

  if (getLoggedUser()) {
    loginFields.style.display = "none";
    navbarLogin.innerHTML = "Logout";
    logoutBox.style.display = "flex";
  } else {
    clearAllInputs();
    return;
  }
});

try {
  login = document
    .querySelector("#submit")
    .addEventListener("click", userLogin);
} catch (err) {}

/*=============================================
→ ### LOGIN - LOGOUT FUNCTIONS ### */

//Function to fetch user and store key ID in local storage

async function userLogin() {
  // Retrieve input values from HTML form
  const emailAddress = document.getElementById("emailAddressLogin").value;
  const password = document.getElementById("passwordLogin").value;

  // Convert input values to JSON format
  const newUserData = {
    emailAddress,
    password,
  };

  const displayError = document.querySelector("#dv-display");

  // Send POST request to server with new staff data
  await fetch(baseUrl + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUserData),
  })
    .then((response) => {
      if (response.status == 401) {
        response.json().then((data) => {
          $("#dv-display").slideDown("slow").css({ //Displays hidden div with a message when gets 401 status
            display: "flex"
          });
          displayError.innerHTML = data.message;
          return;
        });
      } else if (response.status == 200) {
        return response.json();
      }
    })
    .then((data) => {
      displayError.style.display = "none";
      localStorage.setItem("user_name", data.fullName); //collects user data to be used after login
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("owner", data.owner);
      window.location.href = "booking.html";
    })
    .catch((error) => {
      console.error(error);
    });
}

//Calls user logout function
try {
  const logout = document
    .querySelector("#logout")
    .addEventListener("click", userLogout); 
} catch (err) {}

//Logout the user and clears user data from local storage
function userLogout() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("owner");
  clearLoggerdUser();
  window.location.href = "login.html";
}

// Keep current owner on browser's memory
function storeOwner(req, res) {
  localStorage.setItem("owner", req.owner);
  res.status(200).send("Storage sucessful on the browser");
}

//Get user_id from browser's memory
function getCurrentUser() {
  return localStorage.getItem("user_id");
}

//Get owner from browser's memory
function getCurrentOwner() {
  return localStorage.getItem("owner");
}


// clean up all user input data after a action
function clearAllInputs() {
  const inputFields = document.querySelectorAll("input");
  inputFields.forEach((input) => {
    input.value = "";
  });
}
