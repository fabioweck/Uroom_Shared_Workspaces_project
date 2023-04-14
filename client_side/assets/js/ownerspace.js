/*
************************************************
### OWNER SPACE ###
************************************************
*/
/*=============================================
→ ### IMPORTS ### */
import { baseUrl } from "./general_conf.js";
import { getCurrentUser } from "./general_conf.js";
import { serverPostNewProperty } from "./general_conf.js";

/*=============================================
→ ### GLOBAL VARIABLES ### */
var buttonIdValue; // Store the id from the button
var propertiesWorkspaceData = []; // Receive data from the server

/*=============================================
→ ### FETCH PROPERTIES AND WORKSPACE DATA FROM SERVER ### */
const findWorkspaceByOwner = async () => {
  const user_id = localStorage.getItem("user_id");

  const filtered = await fetch(
    baseUrl + "getWorkspaceByOwner?user_id=" + user_id
  )
    .then((response) => response.json())
    .then((data) => {
      data.forEach((obj) => delete obj.user_id);
      propertiesWorkspaceData = data;
    })
    .catch((error) => console.error(error));
};

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
      addressParagraph.innerHTML = `<strong>Address: </strong>${address} ${neighborhood}`;

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
      updateButton.value = `${property_id}`;

      var activeInactiveButton = document.createElement("button");
      activeInactiveButton.className = "btn";
      activeInactiveButton.id = "btn-active-inactive-property";
      activeInactiveButton.textContent = "Active / Inactive";
      activeInactiveButton.value = `${property_id}`;

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
        <li><strong>Address: </strong>${address}, ${neighborhood}</li>
        <li><strong>Parking lot: </strong>${ParkingLot}</li>
        <li><strong>Public transportation: </strong>${PublicTransportation}</li>
        <li><strong>Property Status: </strong>?? Pendente ??</li>
        <li><strong>Property ID: </strong>${property_id}</li>
      `;

    divProperty.appendChild(ulProperty);

    const buttonContainerProperty = document.createElement("div");
    buttonContainerProperty.className = "button-container";

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

    buttonContainerProperty.appendChild(btnUpdateWorkspace);
    buttonContainerProperty.appendChild(btnActiveInactiveWorkspace);

    roomDivision.appendChild(roomDescription);
    roomDivision.appendChild(divProperty);
    roomDivision.appendChild(buttonContainerProperty);

    roomsContainer.appendChild(roomDivision);
  });
};

/*=============================================
→ ### CREATE THE PROPERTY MODAL ### */
// Get the modal element
const modalAddProperty = document.getElementById("modal-add-property");

// Create modal-content-property element
const modalContentProperty = document.createElement("div");
modalContentProperty.className = "modal-content-property";

// Create modal-property-title element
const modalPropertyTitle = document.createElement("h2");
modalPropertyTitle.id = "modal-property-title";
modalPropertyTitle.textContent = "Add Property";

// Create modal-property-subtitle element
const modalPropertySubtitle = document.createElement("h3");
modalPropertySubtitle.id = "modal-property-subtitle";
modalPropertySubtitle.textContent = "Property ID: xxxxxxxxxx";

// Create add-property-form element
const addPropertyForm = document.createElement("div");
addPropertyForm.id = "add-property-form";
addPropertyForm.className = "add-property-form";

// Create input element for Property Address
const inputPropertyAddress = document.createElement("input");
inputPropertyAddress.placeholder = "Address";
inputPropertyAddress.className = "input";
inputPropertyAddress.type = "text";
inputPropertyAddress.id = "add-property-address";
inputPropertyAddress.name = "Property Address";

// Create input element for Property Neighbourhood
const inputPropertyNeighbourhood = document.createElement("input");
inputPropertyNeighbourhood.placeholder = "Neighbourhood";
inputPropertyNeighbourhood.className = "input";
inputPropertyNeighbourhood.type = "text";
inputPropertyNeighbourhood.id = "add-property-neighbourhood";
inputPropertyNeighbourhood.name = "Property Neighbourhood";

// Create add-property-radio-container element for parking lot
const addPropertyRadioContainerParking = document.createElement("div");
addPropertyRadioContainerParking.className = "add-property-radio-container";

// Create paragraph element for parking lot
const paragraphParking = document.createElement("p");
paragraphParking.textContent = "Is there a parking lot?";

// Create radio-option-container element for parking lot
const radioOptionContainerParking = document.createElement("div");
radioOptionContainerParking.className = "radio-option-container";

// Create input element for Yes option of parking lot
const inputParkingYes = document.createElement("input");
inputParkingYes.type = "radio";
inputParkingYes.name = "Parking lot";
inputParkingYes.id = "parking-yes";
inputParkingYes.value = "yes";

// Create label element for Yes option of parking lot
const labelParkingYes = document.createElement("label");
labelParkingYes.htmlFor = "parking-yes";
labelParkingYes.textContent = "Yes";

// Create input element for No option of parking lot
const inputParkingNo = document.createElement("input");
inputParkingNo.type = "radio";
inputParkingNo.name = "Parking lot";
inputParkingNo.id = "parking-no";
inputParkingNo.value = "no";

// Create label element for No option of parking lot
const labelParkingNo = document.createElement("label");
labelParkingNo.htmlFor = "parking-no";
labelParkingNo.textContent = "No";

// Append radio button elements to radio-option-container for parking lot
radioOptionContainerParking.appendChild(inputParkingYes);
radioOptionContainerParking.appendChild(labelParkingYes);
radioOptionContainerParking.appendChild(inputParkingNo);
radioOptionContainerParking.appendChild(labelParkingNo);

// Append paragraph element and radio-option-container to add-property-radio-container for parking lot
addPropertyRadioContainerParking.appendChild(paragraphParking);
addPropertyRadioContainerParking.appendChild(radioOptionContainerParking);

// Create add-property-radio-container element for public transportation
const addPropertyRadioContainerTransportation = document.createElement("div");
addPropertyRadioContainerTransportation.className =
  "add-property-radio-container";

// Create paragraph element for public transportation
const paragraphTransportation = document.createElement("p");
paragraphTransportation.textContent = "Is public transportation available?";

// Create radio-option-container element for public transportation
const radioOptionContainerTransportation = document.createElement("div");
radioOptionContainerTransportation.className = "radio-option-container";

// Create input element for Yes option of public transportation
const inputTransportationYes = document.createElement("input");
inputTransportationYes.type = "radio";
inputTransportationYes.name = "Public Transportation";
inputTransportationYes.id = "public-transportation-yes";
inputTransportationYes.value = "yes";

// Create label element for Yes option of public transportation
const labelTransportationYes = document.createElement("label");
labelTransportationYes.htmlFor = "yes";
labelTransportationYes.textContent = "Yes";

// Create input element for No option of public transportation
const inputTransportationNo = document.createElement("input");
inputTransportationNo.type = "radio";
inputTransportationNo.name = "Public Transportation";
inputTransportationNo.id = "public-transportation-no";
inputTransportationNo.value = "no";

// Create label element for No option of public transportation
const labelTransportationNo = document.createElement("label");
labelTransportationNo.htmlFor = "no";
labelTransportationNo.textContent = "No";

// Append radio button elements to radio-option-container for public transportation
radioOptionContainerTransportation.appendChild(inputTransportationYes);
radioOptionContainerTransportation.appendChild(labelTransportationYes);
radioOptionContainerTransportation.appendChild(inputTransportationNo);
radioOptionContainerTransportation.appendChild(labelTransportationNo);

// Append paragraph element and radio-option-container to add-property-radio-container for public transportation
addPropertyRadioContainerTransportation.appendChild(paragraphTransportation);
addPropertyRadioContainerTransportation.appendChild(
  radioOptionContainerTransportation
);

// Create button-container element
const buttonContainer = document.createElement("div");
buttonContainer.className = "button-container";

// Create Submit button
const buttonSubmit = document.createElement("button");
buttonSubmit.className = "btn";
buttonSubmit.id = "button-property-submit";
buttonSubmit.textContent = "Submit";

// Create Close button
const buttonClose = document.createElement("button");
buttonClose.className = "btn";
buttonClose.id = "button-property-close";
buttonClose.textContent = "Close";

// Append buttons to button-container
buttonContainer.appendChild(buttonSubmit);
buttonContainer.appendChild(buttonClose);

// Append all elements to add-property-form
addPropertyForm.appendChild(inputPropertyAddress);
addPropertyForm.appendChild(inputPropertyNeighbourhood);
addPropertyForm.appendChild(addPropertyRadioContainerParking);
addPropertyForm.appendChild(addPropertyRadioContainerTransportation);
addPropertyForm.appendChild(buttonContainer);

// Append all elements to modal-content-property
modalContentProperty.appendChild(modalPropertyTitle);
modalContentProperty.appendChild(modalPropertySubtitle);
modalContentProperty.appendChild(addPropertyForm);

// Append modal-content-property to modal-add-property
modalAddProperty.appendChild(modalContentProperty);

/*=============================================
→ ### ADD PROPERTY MODAL ### */
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
  modalPropertySubtitle.innerHTML = "";
};

// Hide the modal when the close button is clicked or outside the modal
const hideModalProperty = (event) => {
  if (event.target == closeBtnProperty || event.target == submitBtnProperty) {
    modalAddProperty.style.display = "none";

    // Reset the input fields
    document.getElementById("add-property-address").value = "";
    document.getElementById("add-property-neighbourhood").value = "";
    document
      .querySelectorAll("[name='Parking lot']")
      .forEach((option) => (option.checked = false));
    document
      .querySelectorAll("[name='Public Transportation']")
      .forEach((option) => (option.checked = false));
  }
};

// Attach event listeners to show and hide the modal
document.addEventListener("click", (event) => {
  if (event.target.matches("#btn-add-property")) {
    showModalProperty();
  }
});

closeBtnProperty.addEventListener("click", hideModalProperty);

/*=============================================
→ ### CREATE THE WORKSPACE MODAL ### */
const modalAddWorkspace = document.getElementById("modal-add-workspace");

const modalContentWorkspace = document.createElement("div");
modalContentWorkspace.className = "modal-content-workspace";

const modalWorkspaceTitle = document.createElement("h2");
modalWorkspaceTitle.id = "modal-workspace-title";
modalWorkspaceTitle.textContent = "Add Workspace";

const modalWorkspaceSubtitle = document.createElement("h3");
modalWorkspaceSubtitle.id = "modal-workspace-subtitle";
modalWorkspaceSubtitle.textContent = "Workspace ID: xxxxxx";

const addWorkspaceForm = document.createElement("div");
addWorkspaceForm.id = "add-workspace-form";
addWorkspaceForm.className = "add-workspace-form";

const addPriceInput = document.createElement("input");
addPriceInput.placeholder = "Price";
addPriceInput.className = "input";
addPriceInput.type = "number";
addPriceInput.min = "1";
addPriceInput.max = "99999";
addPriceInput.id = "add-price";

const addSeatsInput = document.createElement("input");
addSeatsInput.placeholder = "Seats";
addSeatsInput.className = "input";
addSeatsInput.type = "number";
addSeatsInput.min = "1";
addSeatsInput.max = "99";
addSeatsInput.id = "add-seats";

const addSqftInput = document.createElement("input");
addSqftInput.placeholder = "Square Feet";
addSqftInput.className = "input";
addSqftInput.type = "number";
addSqftInput.min = "1";
addSqftInput.max = "9999";
addSqftInput.id = "add-sqft";

const addWorkspaceRadioContainer1 = document.createElement("div");
addWorkspaceRadioContainer1.className = "add-workspace-radio-container";

const leasingTermLabel = document.createElement("p");
leasingTermLabel.textContent = "Which is the leasing term?";

const leasingTermRadioContainer = document.createElement("div");
leasingTermRadioContainer.className = "radio-option-container";

const daylyRadio = document.createElement("input");
daylyRadio.type = "radio";
daylyRadio.name = "Leasing Term";
daylyRadio.id = "dayly";
daylyRadio.value = "dayly";

const daylyRadioLabel = document.createElement("label");
daylyRadioLabel.htmlFor = "dayly";
daylyRadioLabel.textContent = "Dayly";

const weeklyRadio = document.createElement("input");
weeklyRadio.type = "radio";
weeklyRadio.name = "Leasing Term";
weeklyRadio.id = "weekly";
weeklyRadio.value = "weekly";

const weeklyRadioLabel = document.createElement("label");
weeklyRadioLabel.htmlFor = "weekly";
weeklyRadioLabel.textContent = "Weekly";

const monthlyRadio = document.createElement("input");
monthlyRadio.type = "radio";
monthlyRadio.name = "Leasing Term";
monthlyRadio.id = "monthly";
monthlyRadio.value = "monthly";

const monthlyRadioLabel = document.createElement("label");
monthlyRadioLabel.htmlFor = "monthly";
monthlyRadioLabel.textContent = "Monthly";

leasingTermRadioContainer.appendChild(daylyRadio);
leasingTermRadioContainer.appendChild(daylyRadioLabel);
leasingTermRadioContainer.appendChild(weeklyRadio);
leasingTermRadioContainer.appendChild(weeklyRadioLabel);
leasingTermRadioContainer.appendChild(monthlyRadio);
leasingTermRadioContainer.appendChild(monthlyRadioLabel);

addWorkspaceRadioContainer1.appendChild(leasingTermLabel);
addWorkspaceRadioContainer1.appendChild(leasingTermRadioContainer);

const addWorkspaceRadioContainer2 = document.createElement("div");
addWorkspaceRadioContainer2.className = "add-workspace-radio-container";

const smokingLabel = document.createElement("p");
smokingLabel.textContent = "Is it allowed smoking?";

const smokingRadioContainer = document.createElement("div");
smokingRadioContainer.className = "radio-option-container";

const yesRadioSmoking = document.createElement("input");
yesRadioSmoking.type = "radio";
yesRadioSmoking.name = "Smoking";
yesRadioSmoking.id = "smoking-yes";
yesRadioSmoking.value = "yes";

const yesRadioLabelSmoking = document.createElement("label");
yesRadioLabelSmoking.htmlFor = "smoking-yes";
yesRadioLabelSmoking.textContent = "Yes";

const noRadioSmoking = document.createElement("input");
noRadioSmoking.type = "radio";
noRadioSmoking.name = "Smoking";
noRadioSmoking.id = "smoking-no";
noRadioSmoking.value = "no";

const noRadioLabelSmoking = document.createElement("label");
noRadioLabelSmoking.htmlFor = "smoking-no";
noRadioLabelSmoking.textContent = "No";

smokingRadioContainer.appendChild(yesRadioSmoking);
smokingRadioContainer.appendChild(yesRadioLabelSmoking);
smokingRadioContainer.appendChild(noRadioSmoking);
smokingRadioContainer.appendChild(noRadioLabelSmoking);

addWorkspaceRadioContainer2.appendChild(smokingLabel);
addWorkspaceRadioContainer2.appendChild(smokingRadioContainer);

const addWorkspaceRadioContainer3 = document.createElement("div");
addWorkspaceRadioContainer3.className = "add-workspace-radio-container";

const workspaceTypeLabel = document.createElement("p");
workspaceTypeLabel.textContent = "What is the workspace type?";

const workspaceTypeRadioContainer = document.createElement("div");
workspaceTypeRadioContainer.className = "radio-option-container";

const yesRadioworkspaceType = document.createElement("input");
yesRadioworkspaceType.type = "radio";
yesRadioworkspaceType.name = "Workspace Type";
yesRadioworkspaceType.id = "desk";
yesRadioworkspaceType.value = "desk";

const yesRadioLabelworkspaceType = document.createElement("label");
yesRadioLabelworkspaceType.htmlFor = "yes";
yesRadioLabelworkspaceType.textContent = "Desk";

const noRadioworkspaceType = document.createElement("input");
noRadioworkspaceType.type = "radio";
noRadioworkspaceType.name = "Workspace Type";
noRadioworkspaceType.id = "office";
noRadioworkspaceType.value = "office";

const noRadioLabelworkspaceType = document.createElement("label");
noRadioLabelworkspaceType.htmlFor = "no";
noRadioLabelworkspaceType.textContent = "Office";

workspaceTypeRadioContainer.appendChild(yesRadioworkspaceType);
workspaceTypeRadioContainer.appendChild(yesRadioLabelworkspaceType);
workspaceTypeRadioContainer.appendChild(noRadioworkspaceType);
workspaceTypeRadioContainer.appendChild(noRadioLabelworkspaceType);

addWorkspaceRadioContainer3.appendChild(workspaceTypeLabel);
addWorkspaceRadioContainer3.appendChild(workspaceTypeRadioContainer);

const buttonContainerWorkspace = document.createElement("div");
buttonContainerWorkspace.className = "button-container";

const addWorkspaceButtonSubmit = document.createElement("button");
addWorkspaceButtonSubmit.textContent = "Submit";
addWorkspaceButtonSubmit.className = "btn";
addWorkspaceButtonSubmit.id = "button-workspace-submit";
buttonContainerWorkspace.appendChild(addWorkspaceButtonSubmit);

const addWorkspaceButtonClose = document.createElement("button");
addWorkspaceButtonClose.textContent = "Close";
addWorkspaceButtonClose.className = "btn";
addWorkspaceButtonClose.id = "button-workspace-close";
buttonContainerWorkspace.appendChild(addWorkspaceButtonClose);

addWorkspaceForm.appendChild(addPriceInput);
addWorkspaceForm.appendChild(addSeatsInput);
addWorkspaceForm.appendChild(addSqftInput);
addWorkspaceForm.appendChild(addWorkspaceRadioContainer1);
addWorkspaceForm.appendChild(addWorkspaceRadioContainer2);
addWorkspaceForm.appendChild(addWorkspaceRadioContainer3);
addWorkspaceForm.appendChild(buttonContainerWorkspace);

modalContentWorkspace.appendChild(modalWorkspaceTitle);
modalContentWorkspace.appendChild(modalWorkspaceSubtitle);
modalContentWorkspace.appendChild(addWorkspaceForm);

modalAddWorkspace.appendChild(modalContentWorkspace);

/*=============================================
→ ### ADD WORKSPACE MODAL ### */
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
  modalWorkspaceSubtitle.innerHTML = "";
};

// Hide the modal when the close button is clicked or outside the modal
const hideModalWorkspace = (event) => {
  if (event.target == closeBtnWorkspace || event.target == submitBtnWorkspace) {
    modalAddWorkspace.style.display = "none";

    // Reset the input fields
    document.getElementById("add-price").value = "";
    document.getElementById("add-seats").value = "";
    document.getElementById("add-sqft").value = "";
    document
      .querySelectorAll("[name='Leasing Term']")
      .forEach((option) => (option.checked = false));
    document
      .querySelectorAll("[name=Smoking]")
      .forEach((option) => (option.checked = false));
    document
      .querySelectorAll("[name='Workspace Type']")
      .forEach((option) => (option.checked = false));
  }
};

// Attach event listeners to show and hide the modal
document.addEventListener("click", (event) => {
  if (event.target.matches("#btn-add-workspace")) {
    showModalWorkspace();
  }
});

closeBtnWorkspace.addEventListener("click", hideModalWorkspace);

/*=============================================
→ ### UPDATE PROPERTY MODAL ### */
const updatePropertyModal = () => {
  const indexProperty = findId("property_id");

  const { address, neighborhood, ParkingLot, PublicTransportation } =
    propertiesWorkspaceData[indexProperty];

  modalPropertySubtitle.innerHTML = `Property ID: ${buttonIdValue}`;
  inputPropertyAddress.value = address;
  inputPropertyNeighbourhood.value = neighborhood;

  const parkingLotRadios = document.getElementsByName("Parking lot");
  parkingLotRadios.forEach((radio) => {
    if (radio.value === ParkingLot) {
      radio.checked = true;
    }
  });

  const publicTransportationRadios = document.getElementsByName(
    "Public Transportation"
  );
  publicTransportationRadios.forEach((radio) => {
    if (radio.value === PublicTransportation) {
      radio.checked = true;
    }
  });
};

document.addEventListener("click", (event) => {
  if (event.target.matches(`#btn-update-property`)) {
    buttonIdValue = event.target.value;
    showModalProperty();
    updatePropertyModal();
  }
});

/*=============================================
→ ### DELETE PROPERTY MODAL ### */

/*=============================================
→ ### UPDATE WORKSPACE MODAL ### */
const updateWorkspaceModal = () => {
  const indexWorkspace = findId("workspace_id");

  const { lease_term, price, seats, smoking, sqft, workspace_type } =
    propertiesWorkspaceData[indexWorkspace];

  modalWorkspaceSubtitle.innerHTML = `Workspace ID: ${buttonIdValue}`;
  addPriceInput.value = price;
  addSeatsInput.value = seats;
  addSqftInput.value = sqft;

  const leaseTermRadios = document.getElementsByName("Leasing Term");
  leaseTermRadios.forEach((radio) => {
    if (radio.value === lease_term) {
      radio.checked = true;
    }
  });

  const smokingRadios = document.getElementsByName("Smoking");
  smokingRadios.forEach((radio) => {
    if (radio.value === smoking) {
      radio.checked = true;
    }
  });

  const workspaceTypeRadios = document.getElementsByName("Workspace Type");
  workspaceTypeRadios.forEach((radio) => {
    if (radio.value === workspace_type) {
      radio.checked = true;
    }
  });
};

document.addEventListener("click", (event) => {
  if (event.target.matches(`#btn-update-workspace`)) {
    buttonIdValue = event.target.value;
    showModalWorkspace();
    updateWorkspaceModal();
  }
});

/*=============================================
→ ### DELETE WORKSPACE MODAL ### */

/*=============================================
→ ### FIND ID ### */
// function to find the index of the id in the array
const findId = (caseId) => {
  let index = -1;

  switch (caseId) {
    case "property_id":
      propertiesWorkspaceData.forEach((obj, i) => {
        if (obj.property_id === parseInt(buttonIdValue)) {
          index = i;
        }
      });
      return index;
      break;

    case "workspace_id":
      propertiesWorkspaceData.forEach((obj, i) => {
        if (obj.workspace_id === parseInt(buttonIdValue)) {
          index = i;
        }
      });
      return index;
      break;
  }

  // if (index !== -1) {
  //   console.log(`Id ${buttonIdValue} found at index ${index}`);
  // } else {
  //   console.log(`Id ${buttonIdValue} not found in the array`);
  // }
};

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
→ ### SEND NEW PROPERTY ### */
const sendNewProperty = (event) => {
  // Prevent form submission
  event.preventDefault();

  // Get form input values
  const address = document.getElementById("add-property-address").value.trim();
  const neighbourhood = document
    .getElementById("add-property-neighbourhood")
    .value.trim();
  const parkingLot = document.querySelector(
    'input[name="Parking lot"]:checked'
  );
  const publicTransportation = document.querySelector(
    'input[name="Public Transportation"]:checked'
  );

  // Validate form inputs
  if (
    address === "" ||
    neighbourhood === "" ||
    !parkingLot ||
    !publicTransportation
  ) {
    alert("Please fill in all the fields.");
    return;
  }

  // const postNewProperty = {
  //   property_id: "",
  //   address: `${address}`,
  //   neighborhood: `${neighbourhood}`,
  //   ParkingLot: `${parkingLot.value}`,
  //   PublicTransportation: `${publicTransportation.value}`,
  //   status: "true",
  //   user_id: getCurrentUser(),
  // };

  const property_id = 1234;
  const parkingLotValue = parkingLot.value;
  const publicTransportationValue = publicTransportation.value;
  const status = true;
  const currentUser = getCurrentUser();

  const postNewProperty = {
    property_id,
    address,
    neighbourhood,
    parkingLotValue,
    publicTransportationValue,
    status,
    currentUser,
  };

  serverPostNewProperty(myObject);

  hideModalProperty(event);
};

submitBtnProperty.addEventListener("click", sendNewProperty);

/*=============================================
→ ### SEND NEW WORKSPACE ### */
const sendNewWorkspace = (event) => {
  // Prevent form submission
  event.preventDefault();

  // Get form input values
  const price = document.getElementById("add-price").value;
  const seats = document.getElementById("add-seats").value;
  const sqft = document.getElementById("add-sqft").value;
  const leasingTerm = document.querySelector(
    'input[name="Leasing Term"]:checked'
  );
  const smoking = document.querySelector('input[name="Smoking"]:checked');
  const workspaceType = document.querySelector(
    'input[name="Workspace Type"]:checked'
  );

  // Validate form inputs
  if (
    leasingTerm === "" ||
    price === "" ||
    seats === "" ||
    sqft === "" ||
    !leasingTerm ||
    !smoking ||
    !workspaceType
  ) {
    alert("Please fill in all the fields.");
    return;
  }

  const postNewWorkspace = {
    workspace_type: `${workspaceType.value}`,
    seats: `${seats}`,
    smoking: `${smoking.value}`,
    price: `${price}`,
    sqft: `${sqft}`,
    lease_term: `${leasingTerm.value}`,
  };

  console.log(`Post Simulation - New workspace`);
  console.log("postNewWorkspace", postNewWorkspace);

  hideModalWorkspace(event);
};

submitBtnWorkspace.addEventListener("click", sendNewWorkspace);

/*=============================================
→ ### ON LOAD THE PAGE ### */
window.onload = async () => {
  await findWorkspaceByOwner();
  displayPropertiesWorkspaceData(propertiesWorkspaceData);
  document.getElementById("btn-my-rooms").disabled = true;
  console.log("propertiesWorkspaceData", propertiesWorkspaceData);
};
