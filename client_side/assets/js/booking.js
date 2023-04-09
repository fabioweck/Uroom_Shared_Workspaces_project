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
document.addEventListener("click", (event) => {
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

document
  .getElementById("btn-owner-workspace")
  .addEventListener("click", openOwnerSpace);

/*=============================================
→ ### SEARCH BAR ### */
const form = document.querySelector(".search-bar-container");
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

// const btnSearchBar = document
//   .getElementById("btn-search-bar")
//   .addEventListener("click", () => {
//     const dropdownSearchBar = document.getElementById("dropdown-search-bar");
//     const dropdownSearchBarValue =
//       dropdownSearchBar.options[dropdownSearchBar.selectedIndex].value;
//     const searchBarInput = document.getElementById("search-bar-input").value;

//     console.log("propertiesData", propertiesData);
//     console.log("dropdownSearchBarValue", dropdownSearchBarValue);
//     console.log("searchBarInput", searchBarInput);

//     let filteredData;
//     switch (dropdownSearchBarValue) {
//       case "lease_term":
//         filteredData = propertiesData.filter(({ lease_term }) =>
//         lease_term.toLowerCase().includes(searchBarInput.toLowerCase())
//         );
//         console.log('filteredData',filteredData);
//         displayPropertiesData(filteredData)
//         break;
//     }
//   });


const filterProperty = (searchBarInputValue) => {
  const dropdownSearchBar = document.getElementById("dropdown-search-bar");
  const dropdownSearchBarValue =
    dropdownSearchBar.options[dropdownSearchBar.selectedIndex].value;

  let filteredData;
  switch (dropdownSearchBarValue) {
    case "":
      displayPropertiesData(propertiesData);
      break;

    case "lease_term":
      filteredData = propertiesData.filter(({ lease_term }) =>
        lease_term.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesData(filteredData);
      break;

    case "price":
      const priceValue = parseInt(searchBarInputValue);
      if (priceValue !== "" && !isNaN(priceValue)) {
        filteredData = propertiesData.filter(
          ({ price }) => price.includes(priceValue)
        );
      } else {
        filteredData = propertiesData;
      }
      displayPropertiesData(filteredData);
      break;

    case "seats":
      const seatsValue = parseInt(searchBarInputValue);
      if (seatsValue !== "" && !isNaN(seatsValue)) {
        filteredData = propertiesData.filter(
          ({ seats }) => seats.includes(seatsValue)
        );
      } else {
        filteredData = propertiesData;
      }
      displayPropertiesData(filteredData);
      break;

    case "smoking":
      filteredData = propertiesData.filter(({ smoking }) =>
        smoking.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesData(filteredData);
      break;

    case "sqft":
      const sqftValue = parseInt(searchBarInputValue);
      if (sqftValue !== "" && !isNaN(sqftValue)) {
        filteredData = propertiesData.filter(({ sqft }) => sqft.includes(sqftValue));
      } else {
        filteredData = propertiesData;
      }
      displayPropertiesData(filteredData);
      break;

    case "workspace_type":
      filteredData = propertiesData.filter(({ workspace_type }) =>
        workspace_type.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesData(filteredData);
      break;
  }
}


const dropdownSearchBar = document.getElementById("dropdown-search-bar");
dropdownSearchBar.addEventListener("change", (event) => {
  const searchBarInputValue = document.getElementById("search-bar-input").value = "";
  
  filterProperty(searchBarInputValue)
});

const searchBarInput = document.getElementById("search-bar-input");
searchBarInput.addEventListener("input", (event) => {
  const searchBarInputValue = event.target.value;

  filterProperty(searchBarInputValue)

});

/*=============================================
→ ### FETCH PROPERTIES DATA FROM SERVER ### */
let propertiesData;
const findWorkspace = async () => {
  const filtered = fetch(baseUrl + "findWorkspace")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((obj) => delete obj.user_id);
      displayPropertiesData(data);
      propertiesData = data;
    })
    .catch((error) => console.error(error));
};

/*=============================================
→ ### DISPLAY PROPERTIES DATA ### */
const displayPropertiesData = (propertiesData) => {
  const roomsContainer = document.getElementById("rooms-container");
  roomsContainer.innerHTML = "";

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
window.onload = async () => {
  findWorkspace();
};
