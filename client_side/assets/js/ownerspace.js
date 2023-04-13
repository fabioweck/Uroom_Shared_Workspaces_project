/*
************************************************
### OWNERSPACE ###
************************************************
*/
/*=============================================
/*=============================================
→ ### REGISTER MODAL ### */
// Get the modal element
var modalAddSpace = document.getElementById("modal-add-space");

// Get the close button element
var closeBtn = modalAddSpace.querySelector("#button-close");

// Show the modal when a button is clicked
var showModal = () => {
  modalAddSpace.style.display = "flex";
};

// Hide the modal when the close button is clicked or outside the modal
var hideModal = (event) => {
  if (event.target == closeBtn) {
    modalAddSpace.style.display = "none";
    // Reset form fields to their initial values
    document.querySelector("#add-workspace-description").value = "";
  }
};

// Attach event listeners to show and hide the modal
document.addEventListener("click", (event) => {
  if (event.target.matches("#btn-add-space")) {
    showModal();
  }
});

modalAddSpace.addEventListener("click", hideModal);
closeBtn.addEventListener("click", hideModal);


/*=============================================
→ ### MY PROPERTIES ### */
// Get the properties element
const propertiesContainer = document.querySelector(".properties-container");

// Get the workspace (rooms) element
const roomsContainer = document.querySelector(".rooms-container");

// Show my properties
var showMyProperties = () => {
  propertiesContainer.style.display = "flex";
  roomsContainer.style.display = "none";
};

// Show my properties
var showMyRooms = () => {
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