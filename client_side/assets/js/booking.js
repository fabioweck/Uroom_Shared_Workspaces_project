/*
************************************************
### BOOKING ###
************************************************
*/
/*=============================================
→ ### CALENDAR MODAL ### */
// Get the modal element
var modalCalendar = document.getElementById("modal-calendar");

// Get the close button element
var closeBtn = modalCalendar.querySelector("#button-close");

// Show the modal when a button is clicked
var showModal = function () {
    modalCalendar.style.display = "flex";
};

// Hide the modal when the close button is clicked or outside the modal
var hideModal = function (event) {
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
  window.location.href = 'ownerspace.html'; 
}