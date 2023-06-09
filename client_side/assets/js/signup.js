import { baseUrl, showQaTest } from "./general_conf.js";

const submitNewUser = document
  .querySelector("#sendNewUser")
  .addEventListener("click", sendNewUserClient);

async function sendNewUserClient() {
  // Retrieve input values from HTML form
  const fullName = document.getElementById("fullName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const emailAddress = document.getElementById("emailAddress").value;
  const password = document.getElementById("password").value;
  const checkOwner = document.querySelector('input[name="owner"]');
  let owner;

  //evaluates if the checkbox was selected or not
  if (!checkOwner.checked) {
    owner = "false";
  } else {
    owner = "true";
  }

  // Convert input values to JSON format
  const newUserData = {
    fullName,
    phoneNumber,
    emailAddress,
    password,
    owner,
  };

  if (showQaTest) {
    console.log(newUserData);
  }

  const displayError = document.querySelector("#dv-display");

  // Send POST request to server with new staff data
  await fetch(baseUrl + "newUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUserData),
  })
    .then((response) => {
      if (response.status == 400) {
        response.json().then((data) => {
          $("#dv-display").slideDown("slow").css({ //if receives a error status, displays the message to the user
            display: "flex",
          });
          displayError.innerHTML = data.message;
          return;
        });
      } else if (response.status == 200) {
        return response.json();
      }
    })
    .then((data) => {
      localStorage.setItem("user_id", data.user_id); //stores data from user to be used
      localStorage.setItem("user_name", data.fullName);
      localStorage.setItem("owner", data.owner);
      window.location.href = "booking.html"; //here the user goes to an automatic login and proceeds straight to booking page with workspaces available
      if (showQaTest) {
        console.log(data);
      }
    })
    .catch((error) => {});
}
