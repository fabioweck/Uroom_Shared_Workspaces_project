/*
************************************************
### OWNERSPACE ###
************************************************
*/
/*=============================================
→ ### IMPORTS ### */
import { baseUrl } from "./general_conf.js";

/*=============================================
→ ### ADD PROPERTY MODAL ### */
// Get the modal element
const modalAddProperty = document.getElementById("modal-add-property");

// Get the submit button element
const submitBtnProperty = modalAddProperty.querySelector("#button-property-submit");

// Get the close button element
const closeBtnProperty = modalAddProperty.querySelector("#button-property-close");

// Show the modal when a button is clicked
const showModalProperty = () => {
  modalAddProperty.style.display = "flex";
};

// Hide the modal when the close button is clicked or outside the modal
const hideModalProperty = (event) => {
  if (event.target == closeBtnProperty) {
    modalAddProperty.style.display = "none";
  }
};

// Attach event listeners to show and hide the modal
document.addEventListener("click", (event) => {
  if (event.target.matches("#btn-add-property")) {
    showModalProperty();
  }
});

modalAddProperty.addEventListener("click", hideModalProperty);
closeBtnProperty.addEventListener("click", hideModalProperty);


/*=============================================
→ ### ADD Workspace MODAL ### */
// Get the modal element
const modalAddWorkspace = document.getElementById("modal-add-workspace");

// Get the submit button element
const submitBtnWorkspace = modalAddWorkspace.querySelector("#button-workspace-submit");

// Get the close button element
const closeBtnWorkspace = modalAddWorkspace.querySelector("#button-workspace-close");

// Show the modal when a button is clicked
const showModalWorkspace = () => {
  modalAddWorkspace.style.display = "flex";
};

// Hide the modal when the close button is clicked or outside the modal
const hideModalWorkspace = (event) => {
  if (event.target == closeBtnWorkspace) {
    modalAddWorkspace.style.display = "none";
  }
};

// Attach event listeners to show and hide the modal
document.addEventListener("click", (event) => {
  if (event.target.matches("#btn-add-workspace")) {
    showModalWorkspace();
  }
});

modalAddWorkspace.addEventListener("click", hideModalWorkspace);
closeBtnWorkspace.addEventListener("click", hideModalWorkspace);


/*=============================================
→ ### MY PROPERTIES ### */
// Get the properties element
const propertiesContainer = document.querySelector(".properties-container");

// Get the workspace (rooms) element
const roomsContainer = document.querySelector(".rooms-container");

// Show my properties
const showMyProperties = () => {
  propertiesContainer.style.display = "flex";
  roomsContainer.style.display = "none";
};

// Show my properties
const showMyRooms = () => {
  propertiesContainer.style.display = "none";
  roomsContainer.style.display = "flex";
};

// Attach event listeners to show my properties
document.addEventListener("click", (event) => {
  if (event.target.matches("#btn-my-properties")) {
    showMyProperties();
  }
});

// Attach event listeners to show my rooms
document.addEventListener("click", (event) => {
  if (event.target.matches("#btn-my-rooms")) {
    showMyRooms();
  }
});