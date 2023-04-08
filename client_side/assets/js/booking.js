/*
************************************************
### BOOKING ###
************************************************
*/
/*=============================================
→ ### IMPORTS ### */
import { baseUrl } from "./general_conf.js";

/*=============================================
→ ### CALENDAR MODAL ### */
// Get the modal element
var modalCalendar = document.getElementById("modal-calendar");

// Get the close button element
var closeBtn = modalCalendar.querySelector("#button-close");

// Show the modal when a button is clicked
var showModal = () => {
  modalCalendar.style.display = "flex";
};

// Hide the modal when the close button is clicked or outside the modal
var hideModal = (event) => {
  if (event.target == closeBtn) {
    modalCalendar.style.display = "none";
    // Reset form fields to their initial values
    document.querySelector("#calendar-obj").value = "";
  }
};

// Attach event listeners to show and hide the modal
document.addEventListener("click", function (event) {
  if (event.target.matches("#btn-book")) {
    showModal();
  }
});

modalCalendar.addEventListener("click", hideModal);
closeBtn.addEventListener("click", hideModal);

/*=============================================
→ ### SEND TO OWNER SPACE ### */
const openOwnerSpace = () => {
  window.location.href = "ownerspace.html";
};

/*=============================================
→ ### FETCH PROPERTIES DATA FROM SERVER ### */
const findWorkspace = async () => {
  const filtered = fetch(baseUrl + "findWorkspace")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((obj) => delete obj.user_id);
      displayPropertiesData(data);
    })
    .catch((error) => console.error(error));
};

/*=============================================
→ ### DISPLAY PROPERTIES DATA ### */
const displayPropertiesData = (propertiesData) => {
  const roomsContainer = document.getElementById("rooms-container");

  propertiesData.forEach((propertyData) => {
    const { lease_term, price, seats, smoking, sqft, status, workspace_type } =
      propertyData;

    const roomDivision = document.createElement("div");
    roomDivision.className = "room-division";

    const roomDescription = document.createElement("div");
    roomDescription.className = "room-description";

    const image = document.createElement("img");
    image.src = "../img/room01.jpg";
    image.alt = "Image Room";

    const ul = document.createElement("ul");
    ul.innerHTML = `
        <li>Lease term: ${lease_term}</li>
        <li>Price: ${price}</li>
        <li>Seats: ${seats}</li>
        <li>Smoking: ${smoking}</li>
        <li>Sqft: ${sqft}</li>
        <li>Status: ${status}</li>
        <li>Workspace Type: ${workspace_type}</li>
      `;

      // <li>Workspace description: </li>
      // <li>Workspace Type: ${workspace_type}</li>
      // <li>Address: </li>
      // <li>Neighbourhood: </li>
      // <li>Parking lot: </li>
      // <li>Public transportation: </li>
      // <li>Seats: ${seats}</li>
      // <li>Smoking: ${smoking}</li>
      // <li>Price: ${price}</li>
      // <li>Sqft: ${sqft}</li>
      // <li>Leasing term: ${lease_term}</li>

    roomDescription.appendChild(image);
    roomDescription.appendChild(ul);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const button = document.createElement("button");
    button.className = "btn";
    button.id = "btn-book";
    button.textContent = "Book";

    buttonContainer.appendChild(button);

    roomDivision.appendChild(roomDescription);
    roomDivision.appendChild(buttonContainer);

    roomsContainer.appendChild(roomDivision);
  });
};

/*=============================================
→ ### ON LOAD THE PAGE ### */
window.onload = async function () {
  findWorkspace();
};
