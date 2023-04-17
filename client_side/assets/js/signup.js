const port = 3010;
const baseUrl = `http://localhost:${port}/`;

const submitNewUser = document.querySelector("#sendNewUser").addEventListener('click', (e)=>{

  e.preventDefault();
  document.querySelector('#signup-box').style.display = "none";
  document.querySelector('#success-message').style.display = "flex";
  sendNewUserClient();
  
})

async function sendNewUserClient() {

  event.preventDefault();

    // Retrieve input values from HTML form
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const emailAddress = document.getElementById("emailAddress").value;
    const password = document.getElementById("password").value;
    const checkOwner = document.querySelector('input[name="owner"]');
    let owner;
    
    if (!checkOwner.checked) {
        owner = "false";
    }
    else {
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

    // console.log(newUserData);

    const displayError = document.querySelector("#dv-display");

    // Send POST request to server with new staff data
    await fetch(baseUrl + 'newUser', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
    })
    
    .then(response=>response.json())
    .then((data) => {

      localStorage.setItem("user_id", data.user_id);
      // window.location.href = "booking.html";
      console.log(data);

      })
      .catch((error) => {});
}