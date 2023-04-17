const port = 3010;
const baseUrl = `http://localhost:${port}/`;

const submitNewUser = document.querySelector("#sendNewUser").addEventListener('click', sendNewUserClient);

async function sendNewUserClient() {

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

    console.log(newUserData);

    // Send POST request to server with new staff data
    await fetch(baseUrl + 'newUser', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
    })

    .then((response) => {
        if (response.status == 401) {
          response.json().then((data) => {
            $("#dv-display").slideDown("slow").css({
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
            console.log(data);
        }
        )
        .catch((error) => console.error(error));

}