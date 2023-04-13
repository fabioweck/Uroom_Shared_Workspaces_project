/*
************************************************
### OWNER SPACE ###
************************************************
*/
/*=============================================
→ ### IMPORTS ### */
import { baseUrl } from "./general_conf.js";

/*=============================================
→ ### GLOBAL VARIABLES ### */
var propertiesWorkspaceData = []; // Receive data from the server

/*=============================================
→ ### FETCH PROPERTIES AND WORKSPACE DATA FROM SERVER ### */
async function findWorkspaceByOwner() {
  // const user_id = localStorage.getItem('user_id');

  // const filtered = await fetch(baseUrl + 'findWorkspaceByOwner?user_id=' + user_id)
  const filtered = await fetch(
    "http://localhost:3010/getWorkspaceByOwner?user_id=18059eac-c6b1-4bda-b462-521d0323c5c5"
  )
    .then((response) => response.json())
    .then((data) => {
      data.forEach((obj) => delete obj.user_id);
      propertiesWorkspaceData = data;
    })
    .catch((error) => console.error(error));
}

/*=============================================
→ ### SEARCH BAR WORKSPACE ### */

const filterWorkspaceProperty = (searchBarInputValue, isJustProperties) => {
  let dropdownSearchBar;

  if (isJustProperties) {
    dropdownSearchBar = document.getElementById("dropdown-search-bar-property");
  } else {
    dropdownSearchBar = document.getElementById(
      "dropdown-search-bar-workspace"
    );
  }

  const dropdownSearchBarValue =
    dropdownSearchBar.options[dropdownSearchBar.selectedIndex].value;

  console.log("dropdownSearchBarValue", dropdownSearchBarValue);
  let filteredData;
  switch (dropdownSearchBarValue) {
    case "":
      displayPropertiesWorkspaceData(propertiesWorkspaceData);
      break;

    case "lease_term":
      filteredData = propertiesWorkspaceData.filter(({ lease_term }) =>
        lease_term.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "price":
      const priceValue = parseInt(searchBarInputValue);
      if (priceValue !== "" && !isNaN(priceValue)) {
        filteredData = propertiesWorkspaceData.filter(({ price }) =>
          price.includes(priceValue)
        );
      } else {
        filteredData = propertiesWorkspaceData;
      }
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "seats":
      const seatsValue = parseInt(searchBarInputValue);
      if (seatsValue !== "" && !isNaN(seatsValue)) {
        filteredData = propertiesWorkspaceData.filter(({ seats }) =>
          seats.includes(seatsValue)
        );
      } else {
        filteredData = propertiesWorkspaceData;
      }
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "smoking":
      filteredData = propertiesWorkspaceData.filter(({ smoking }) =>
        smoking.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "sqft":
      const sqftValue = parseInt(searchBarInputValue);
      if (sqftValue !== "" && !isNaN(sqftValue)) {
        filteredData = propertiesWorkspaceData.filter(({ sqft }) =>
          sqft.includes(sqftValue)
        );
      } else {
        filteredData = propertiesWorkspaceData;
      }
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "workspace_type":
      filteredData = propertiesWorkspaceData.filter(({ workspace_type }) =>
        workspace_type.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "address":
      filteredData = propertiesWorkspaceData.filter(({ address }) =>
        address.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "neighborhood":
      filteredData = propertiesWorkspaceData.filter(({ neighborhood }) =>
        neighborhood.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "ParkingLot":
      filteredData = propertiesWorkspaceData.filter(({ ParkingLot }) =>
        ParkingLot.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "PublicTransportation":
      filteredData = propertiesWorkspaceData.filter(
        ({ PublicTransportation }) =>
          PublicTransportation.toLowerCase().includes(
            searchBarInputValue.toLowerCase()
          )
      );
      displayPropertiesWorkspaceData(filteredData);
      break;
  }
};

const dropdownSearchBarWorkspace = document.getElementById(
  "dropdown-search-bar-workspace"
);
dropdownSearchBarWorkspace.addEventListener("change", (event) => {
  const searchBarInputValue = (document.getElementById(
    "search-bar-workspace"
  ).value = "");

  filterWorkspaceProperty(searchBarInputValue, false);
});

const searchBarInputWorkspace = document.getElementById("search-bar-workspace");
searchBarInputWorkspace.addEventListener("input", (event) => {
  const searchBarInputValue = event.target.value;

  filterWorkspaceProperty(searchBarInputValue, false);
});

const dropdownSearchBarProperty = document.getElementById(
  "dropdown-search-bar-property"
);
dropdownSearchBarProperty.addEventListener("change", (event) => {
  const searchBarInputValue = (document.getElementById(
    "search-bar-property"
  ).value = "");

  filterWorkspaceProperty(searchBarInputValue, true);
});

const searchBarInputProperty = document.getElementById("search-bar-property");
searchBarInputProperty.addEventListener("input", (event) => {
  const searchBarInputValue = event.target.value;

  filterWorkspaceProperty(searchBarInputValue, true);
});

/*=============================================
→ ### DISPLAY PROPERTIES AND WORKSPACE DATA ### */
const displayPropertiesWorkspaceData = (propertiesWorkspaceData) => {
  {
    // → === HTML Properties ===
    // Use Set to keep track of unique workspace_id values
    const uniqueWorkspaceIds = new Set();

    // Use filter() method to filter the inputArray and keep only unique workspace_id values
    const filteredPropertiesWorkspaceData = propertiesWorkspaceData.filter(
      (obj) => {
        if (!uniqueWorkspaceIds.has(obj.property_id)) {
          uniqueWorkspaceIds.add(obj.property_id);
          return true;
        }
        return false;
      }
    );

    // Convert the filteredArray back to an array
    const resultPropertiesWorkspaceData = Array.from(
      filteredPropertiesWorkspaceData
    );

    const propertiesContainer = document.getElementById("properties-container");
    propertiesContainer.innerHTML = "";

    resultPropertiesWorkspaceData.forEach((propertyWorkspaceData) => {
      const {
        address,
        neighborhood,
        ParkingLot,
        PublicTransportation,
        property_id,
      } = propertyWorkspaceData;

      var propertyDivision = document.createElement("div");
      propertyDivision.className = "property-division";

      var propertyDescriptionContainer = document.createElement("div");
      propertyDescriptionContainer.className = "property-description-container";

      var propertyDescriptionWrap = document.createElement("div");
      propertyDescriptionWrap.className = "property-description-wrap";

      var addressParagraph = document.createElement("p");
      addressParagraph.innerHTML = `<strong>Address: </strong>${address} + ${neighborhood}`;

      var parkingLotParagraph = document.createElement("p");
      parkingLotParagraph.innerHTML = `<strong>Parking Lot:</strong> ${ParkingLot}`;

      var publicTransportationParagraph = document.createElement("p");
      publicTransportationParagraph.innerHTML = `<strong>Public Transportation:</strong> ${PublicTransportation}`;

      var statusPropertyParagraph = document.createElement("p");
      statusPropertyParagraph.innerHTML =
        "<strong>Status Property:</strong> True";

      var idPropertyParagraph = document.createElement("p");
      idPropertyParagraph.innerHTML = `<strong>ID Property:</strong> ${property_id}`;

      propertyDescriptionWrap.appendChild(addressParagraph);
      propertyDescriptionWrap.appendChild(parkingLotParagraph);
      propertyDescriptionWrap.appendChild(publicTransportationParagraph);
      propertyDescriptionWrap.appendChild(statusPropertyParagraph);
      propertyDescriptionWrap.appendChild(idPropertyParagraph);

      propertyDescriptionContainer.appendChild(propertyDescriptionWrap);

      var buttonPropertyContainer = document.createElement("div");
      buttonPropertyContainer.className = "button-property-container";

      var updateButton = document.createElement("button");
      updateButton.className = "btn";
      updateButton.id = "btn-update-property";
      updateButton.textContent = "Update";

      var activeInactiveButton = document.createElement("button");
      activeInactiveButton.className = "btn";
      activeInactiveButton.id = "btn-active-inactive-property";
      activeInactiveButton.textContent = "Active / Inactive";

      buttonPropertyContainer.appendChild(updateButton);
      buttonPropertyContainer.appendChild(activeInactiveButton);

      propertyDivision.appendChild(propertyDescriptionContainer);
      propertyDivision.appendChild(buttonPropertyContainer);

      propertiesContainer.appendChild(propertyDivision);
    });
  }

  // → === HTML Workspaces ===
  const roomsContainer = document.getElementById("rooms-container");
  roomsContainer.innerHTML = "";

  propertiesWorkspaceData.forEach((propertyData) => {
    const {
      lease_term,
      price,
      seats,
      smoking,
      sqft,
      status,
      workspace_type,
      workspace_id,
      address,
      neighborhood,
      ParkingLot,
      PublicTransportation,
      property_id,
    } = propertyData;

    const roomDivision = document.createElement("div");
    roomDivision.className = "room-division";

    const roomDescription = document.createElement("div");
    roomDescription.className = "room-description";

    const image = document.createElement("img");
    image.src = "../img/room01.jpg";
    image.alt = "Image Room";

    const divWorkspace = document.createElement("div");
    divWorkspace.className = "workplace-description";

    const divWorkspaceWrap = document.createElement("div");
    divWorkspaceWrap.className = "wrap-description";

    const ulWorkspace = document.createElement("ul");
    ulWorkspace.innerHTML = `
        <li><strong>Lease term: </strong>${lease_term}</li>
        <li><strong>Price: </strong>${price}</li>
        <li><strong>Seats: </strong>${seats}</li>
        <li><strong>Smoking: </strong>${smoking}</li>
        <li><strong>Sqft: </strong>${sqft}</li>
        <li><strong>Workspace Type: </strong>${workspace_type}</li>
        <li><strong>WorkspaceStatus: </strong>${status}</li>
        <li><strong>Workspace ID: </strong>${workspace_id}</li>
      `;

    roomDescription.appendChild(image);
    roomDescription.appendChild(divWorkspace);
    divWorkspaceWrap.appendChild(ulWorkspace);
    divWorkspace.appendChild(divWorkspaceWrap);

    const divProperty = document.createElement("div");
    divProperty.className = "property-description-container";

    const ulProperty = document.createElement("ul");
    ulProperty.innerHTML = `
        <li><strong>Address: </strong>${address} ${neighborhood}</li>
        <li><strong>Parking lot: </strong>${ParkingLot}</li>
        <li><strong>Public transportation: </strong>${PublicTransportation}</li>
        <li><strong>Property Status: </strong>?? Pendente ??</li>
        <li><strong>Property ID: </strong>${property_id}</li>
      `;

    divProperty.appendChild(ulProperty);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const btnUpdateWorkspace = document.createElement("button");
    btnUpdateWorkspace.className = "btn";
    btnUpdateWorkspace.id = `btn-update-workspace`;
    btnUpdateWorkspace.textContent = "Update";
    btnUpdateWorkspace.value = `${workspace_id}`;

    const btnActiveInactiveWorkspace = document.createElement("button");
    btnActiveInactiveWorkspace.className = "btn";
    btnActiveInactiveWorkspace.id = `btn-active-inactive-workspace`;
    btnActiveInactiveWorkspace.textContent = "Active / Inactive";
    btnActiveInactiveWorkspace.value = `${workspace_id}`;

    buttonContainer.appendChild(btnUpdateWorkspace);
    buttonContainer.appendChild(btnActiveInactiveWorkspace);

    roomDivision.appendChild(roomDescription);
    roomDivision.appendChild(divProperty);
    roomDivision.appendChild(buttonContainer);

    roomsContainer.appendChild(roomDivision);
  });
};

/*=============================================
→ ### ADD PROPERTY MODAL ### */
// Get the modal element
const modalAddProperty = document.getElementById("modal-add-property");

// Get the submit button element
const submitBtnProperty = modalAddProperty.querySelector(
  "#button-property-submit"
);

// Get the close button element
const closeBtnProperty = modalAddProperty.querySelector(
  "#button-property-close"
);

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
→ ### ADD WORKSPACE MODAL ### */
// Get the modal element
const modalAddWorkspace = document.getElementById("modal-add-workspace");

// Get the submit button element
const submitBtnWorkspace = modalAddWorkspace.querySelector(
  "#button-workspace-submit"
);

// Get the close button element
const closeBtnWorkspace = modalAddWorkspace.querySelector(
  "#button-workspace-close"
);

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
const propertiesDropdown = document.querySelector(
  "#dropdown-search-bar-property"
);
const propertiesSearchBar = document.querySelector("#search-bar-property");

// Show my properties
const showMyProperties = () => {
  propertiesContainer.style.display = "flex";
  roomsContainer.style.display = "none";
};

// Show search bar for workspace and properties
const showSearchWorkspaceProperties = () => {
  propertiesDropdown.style.display = "inline";
  propertiesSearchBar.style.display = "inline";
  roomsDropdown.style.display = "none";
  roomsSearchBar.style.display = "none";
};

// Attach event listeners to show my properties
document.addEventListener("click", (event) => {
  if (event.target.matches("#btn-my-properties")) {
    showMyProperties();
    showSearchWorkspaceProperties();
    document.getElementById("btn-my-properties").disabled = true;
    document.getElementById("btn-my-rooms").disabled = false;
  }
});

/*=============================================
→ ### MY WORKSPACE ### */
// Get the workspace (rooms) element
const roomsContainer = document.querySelector(".rooms-container");
const roomsDropdown = document.querySelector("#dropdown-search-bar-workspace");
const roomsSearchBar = document.querySelector("#search-bar-workspace");

// Show my workspace
const showMyRooms = () => {
  propertiesContainer.style.display = "none";
  roomsContainer.style.display = "flex";
};

// Show search bar for workspace
const showSearchWorkspace = () => {
  propertiesDropdown.style.display = "none";
  propertiesSearchBar.style.display = "none";
  roomsDropdown.style.display = "inline";
  roomsSearchBar.style.display = "inline";
};

// Attach event listeners to show my rooms
document.addEventListener("click", (event) => {
  if (event.target.matches("#btn-my-rooms")) {
    showMyRooms();
    showSearchWorkspace();
    document.getElementById("btn-my-properties").disabled = false;
    document.getElementById("btn-my-rooms").disabled = true;
  }
});

/*=============================================
→ ### ON LOAD THE PAGE ### */
window.onload = async () => {
  await findWorkspaceByOwner();
  displayPropertiesWorkspaceData(propertiesWorkspaceData);
  document.getElementById("btn-my-rooms").disabled = true;
  console.log("propertiesWorkspaceData", propertiesWorkspaceData);
};
