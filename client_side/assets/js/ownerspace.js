/*
************************************************
### OWNER SPACE ###
************************************************
*/
/*=============================================
→ ### IMPORTS ### */
import {
  getCurrentUser,
  serverPostNewProperty,
  serverPostNewWorkspace,
  serverPostUpdateProperty,
  serverPostUpdateWorkspace,
  serverGetWorkspaceByOwner,
  delistProperty,
  delistWorkspace,
  showQaTest,
} from "./general_conf.js";

/*=============================================
→ ### GLOBAL VARIABLES ### */
var buttonValue; // Store the value from the button
var buttonNameValue; // Store the name from the button
var propertiesWorkspaceData = []; // Receive data from the server
var isUpdateWorkspace = false; // Flag to modal add new or update the workspace
var isUpdateProperty = false; // Flag to modal add new or update the property

/*=============================================
→ ### SEARCH BAR WORKSPACE ### */

const filterWorkspaceProperty = (searchBarInputValue, isJustProperties) => {
  let dropdownSearchBar;
  let searchBar;

  if (isJustProperties) {
    dropdownSearchBar = document.getElementById("dropdown-search-bar-property");
    searchBar = document.getElementById("search-bar-property");
  } else {
    dropdownSearchBar = document.getElementById(
      "dropdown-search-bar-workspace"
    );
    searchBar = document.getElementById("search-bar-workspace");
  }

  const dropdownSearchBarValue =
    dropdownSearchBar.options[dropdownSearchBar.selectedIndex].value;
  let filteredData;
  switch (dropdownSearchBarValue) {
    case "":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search");
      displayPropertiesWorkspaceData(propertiesWorkspaceData);
      break;

    case "lease_term":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search: Daily, Weekly or Monthly");
      filteredData = propertiesWorkspaceData.filter(
        ({ lease_term }) =>
          lease_term &&
          lease_term.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "price":
      searchBar.setAttribute("type", "number");
      searchBar.setAttribute("placeholder", "Search (Only numbers)");
      const priceValue = parseInt(searchBarInputValue);
      if (priceValue !== "" && !isNaN(priceValue)) {
        filteredData = propertiesWorkspaceData.filter(({ price }) =>
          String(price).includes(String(priceValue))
        );
      } else {
        filteredData = propertiesWorkspaceData;
      }
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "seats":
      searchBar.setAttribute("type", "number");
      searchBar.setAttribute("placeholder", "Search (Only numbers)");
      const seatsValue = parseInt(searchBarInputValue);
      if (seatsValue !== "" && !isNaN(seatsValue)) {
        filteredData = propertiesWorkspaceData.filter(({ seats }) =>
          String(seats).includes(String(seatsValue))
        );
      } else {
        filteredData = propertiesWorkspaceData;
      }
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "smoking":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search: Yes or No");
      filteredData = propertiesWorkspaceData.filter(
        ({ smoking }) =>
          smoking &&
          smoking.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "sqft":
      searchBar.setAttribute("type", "number");
      searchBar.setAttribute("placeholder", "Search (Only numbers)");
      const sqftValue = parseInt(searchBarInputValue);
      if (sqftValue !== "" && !isNaN(sqftValue)) {
        filteredData = propertiesWorkspaceData.filter(({ sqft }) =>
          String(sqft).includes(String(sqftValue))
        );
      } else {
        filteredData = propertiesWorkspaceData;
      }
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "workspace_type":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search: Desk, Office, Meeting");
      filteredData = propertiesWorkspaceData.filter(
        ({ workspace_type }) =>
          workspace_type &&
          workspace_type
            .toLowerCase()
            .includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "address":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search");
      filteredData = propertiesWorkspaceData.filter(({ address }) =>
        address.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "neighborhood":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search");
      filteredData = propertiesWorkspaceData.filter(({ neighborhood }) =>
        neighborhood.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "ParkingLot":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search: Yes or No");
      filteredData = propertiesWorkspaceData.filter(({ ParkingLot }) =>
        ParkingLot.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesWorkspaceData(filteredData);
      break;

    case "PublicTransportation":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search: Yes or No");
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
let isFirstCallProperties = true;
let isFirstCallWorkspaces = true;
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

    resultPropertiesWorkspaceData.forEach((propertyWorkspaceData, index) => {
      const {
        address,
        neighborhood,
        ParkingLot,
        PublicTransportation,
        property_status,
        property_id,
      } = propertyWorkspaceData;

      const propertyDivision = document.createElement("div");
      propertyDivision.className = "property-division";
      propertyDivision.style.display = "none";

      const propertyDescriptionContainer = document.createElement("div");
      propertyDescriptionContainer.className = "property-description-container";

      const propertyDescriptionWrap = document.createElement("div");
      propertyDescriptionWrap.className = "property-description-wrap";

      const addressParagraph = document.createElement("p");
      addressParagraph.innerHTML = `<strong>Address: </strong>${address}, ${neighborhood}`;

      const iconContext1 =
        ParkingLot == "yes"
          ? `<i class="fa-solid fa-circle-check fa-lg" style="color: #1f5132;"></i>`
          : `<i class="fa-solid fa-circle-xmark fa-lg" style="color: #511f1f;"></i>`;
      const parkingLotParagraph = document.createElement("p");
      parkingLotParagraph.innerHTML = `<strong>Parking Lot:</strong> ${iconContext1}`;

      const iconContext2 =
        PublicTransportation == "yes"
          ? `<i class="fa-solid fa-circle-check fa-lg" style="color: #1f5132;"></i>`
          : `<i class="fa-solid fa-circle-xmark fa-lg" style="color: #511f1f;"></i>`;
      const publicTransportationParagraph = document.createElement("p");
      publicTransportationParagraph.innerHTML = `<strong>Public Transportation:</strong> ${iconContext2}`;

      const iconStatusPropertyParagraph = property_status
        ? `<i class="fa-solid fa-square-check fa-2xl" style="color: #1f5132;"></i>`
        : `<i class="fa-solid fa-rectangle-xmark fa-2xl" style="color: #511f1f;"></i>`;
      const statusPropertyParagraph = document.createElement("p");
      statusPropertyParagraph.innerHTML = `<strong>Status Property:</strong> ${iconStatusPropertyParagraph}`;

      const idPropertyParagraph = document.createElement("p");
      idPropertyParagraph.innerHTML = `<strong>ID Property:</strong> ${property_id}`;

      propertyDescriptionWrap.appendChild(addressParagraph);
      propertyDescriptionWrap.appendChild(parkingLotParagraph);
      propertyDescriptionWrap.appendChild(publicTransportationParagraph);
      propertyDescriptionWrap.appendChild(statusPropertyParagraph);
      if (showQaTest) {
        propertyDescriptionWrap.appendChild(idPropertyParagraph);
      }

      propertyDescriptionContainer.appendChild(propertyDescriptionWrap);
      propertyDescriptionContainer.appendChild(statusPropertyParagraph);

      const buttonPropertyContainer = document.createElement("div");
      buttonPropertyContainer.className = "button-property-container";

      const updateButton = document.createElement("button");
      updateButton.className = "btn";
      updateButton.id = "btn-update-property";
      updateButton.textContent = "Update";
      updateButton.value = `${property_id}`;

      const statusActiveInactiveButton = !property_status
        ? "Activate"
        : "Deactivate";
      const activeInactiveButton = document.createElement("button");
      activeInactiveButton.className = "btn";
      activeInactiveButton.id = "btn-active-inactive-property";
      activeInactiveButton.name = statusActiveInactiveButton;
      activeInactiveButton.textContent = statusActiveInactiveButton;
      activeInactiveButton.value = `${property_id}`;

      buttonPropertyContainer.appendChild(updateButton);
      buttonPropertyContainer.appendChild(activeInactiveButton);

      propertyDivision.appendChild(propertyDescriptionContainer);
      propertyDivision.appendChild(buttonPropertyContainer);

      propertiesContainer.appendChild(propertyDivision);

      if (isFirstCallProperties) {
        setTimeout(() => {
          propertyDivision.style.animationDelay = `${index * 0.25}s`;
          propertyDivision.style.opacity = "1";
          propertyDivision.style.transform = "translateX(1000%)";
          propertyDivision.style.display = "block";
        }, index * 1);
      } else {
        propertyDivision.style.display = "block";
        propertyDivision.style.animationDuration = "0s";
      }
    });
    isFirstCallProperties = false;
  }

  // → === HTML Workspaces ===
  const roomsContainer = document.getElementById("rooms-container");
  roomsContainer.innerHTML = "";

  propertiesWorkspaceData.forEach((propertyData, index) => {
    const {
      lease_term,
      price,
      seats,
      smoking,
      sqft,
      workspace_status,
      workspace_type,
      workspace_id,
      address,
      neighborhood,
      ParkingLot,
      PublicTransportation,
      property_status,
      property_id,
    } = propertyData;

    if (workspace_status == undefined || workspace_status == null) {
      if (showQaTest) {
        console.log("index-skip", index);
      }
      return;
    }

    // Create the outer div element with class "property-card"
    const propertyCard = document.createElement("div");
    propertyCard.className = "property-card";
    propertyCard.style.display = "none";

    // Create the div element with class "wrap-img"
    const wrapImg = document.createElement("div");
    wrapImg.className = "wrap-img";

    let imagePath;
    if (workspace_type != null) {
      switch (workspace_type.toLowerCase()) {
        case "desk":
          imagePath = "../img/room-desk.jpg";
          break;
        case "office":
          imagePath = "../img/room-office.jpg";
          break;
        case "meeting":
          imagePath = "../img/room-meeting.jpg";
          break;
        default:
          imagePath = "../img/room-desk.jpg";
          break;
      }
    } else {
      imagePath = "../img/room-desk.jpg";
    }

    // Create the img element with src, alt, and class attributes
    const propertyImage = document.createElement("img");
    propertyImage.src = imagePath;
    propertyImage.alt = "Property Image";
    propertyImage.className = "property-image";

    // Append the propertyImage element to the wrapImg element
    wrapImg.appendChild(propertyImage);

    // Create the div element with class "address-neighborhood"
    const addressNeighborhood = document.createElement("div");
    addressNeighborhood.className = "address-neighborhood";

    // Set the text content for the address neighborhood element
    addressNeighborhood.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${address}, ${neighborhood}`;

    // Create the outer div element with class "property-info-container"
    const propertyInfoContainer = document.createElement("div");
    propertyInfoContainer.className = "property-info-container";

    // Create the first property info div element with class "property-info"
    const propertyInfo1 = document.createElement("div");
    propertyInfo1.className = "property-info";

    // Create the span element with class "subtitle-highlight" for the first property info
    const subtitleHighlight1 = document.createElement("span");
    subtitleHighlight1.className = "subtitle-highlight";
    subtitleHighlight1.textContent = "Parking:";

    // Create the span element with class "icon-highlight" for the first property info
    const iconContext1 =
      ParkingLot == "yes"
        ? `<i class="fa-solid fa-circle-check fa-lg" style="color: #1f5132;"></i>`
        : `<i class="fa-solid fa-circle-xmark fa-lg" style="color: #511f1f;"></i>`;
    const iconHighlight1 = document.createElement("span");
    iconHighlight1.className = "icon-highlight";
    iconHighlight1.innerHTML = `${iconContext1}`;

    // Append the subtitleHighlight1 and iconHighlight1 elements to the propertyInfo1 element
    propertyInfo1.appendChild(subtitleHighlight1);
    propertyInfo1.appendChild(iconHighlight1);

    // Create the second property info div element with class "property-info"
    const propertyInfo2 = document.createElement("div");
    propertyInfo2.className = "property-info";

    // Create the span element with class "subtitle-highlight" for the second property info
    const subtitleHighlight2 = document.createElement("span");
    subtitleHighlight2.className = "subtitle-highlight";
    subtitleHighlight2.textContent = "Pub Transp:";

    // Create the span element with class "icon-highlight" for the second property info
    const iconContext2 =
      PublicTransportation == "yes"
        ? `<i class="fa-solid fa-circle-check fa-lg" style="color: #1f5132;"></i>`
        : `<i class="fa-solid fa-circle-xmark fa-lg" style="color: #511f1f;"></i>`;
    const iconHighlight2 = document.createElement("span");
    iconHighlight2.className = "icon-highlight";
    iconHighlight2.innerHTML = `${iconContext2}`;

    // Append the subtitleHighlight2 and iconHighlight2 elements to the propertyInfo2 element
    propertyInfo2.appendChild(subtitleHighlight2);
    propertyInfo2.appendChild(iconHighlight2);

    // Append the propertyInfo1 and propertyInfo2 elements to the propertyInfoContainer element
    propertyInfoContainer.appendChild(propertyInfo1);
    propertyInfoContainer.appendChild(propertyInfo2);

    // Create div element with class "wrap-workspace"
    const wrapWorkspaceDiv = document.createElement("div");
    wrapWorkspaceDiv.className = "wrap-workspace";

    // Create div element with class "workspace-info-container"
    const workspaceInfoContainerDiv = document.createElement("div");
    workspaceInfoContainerDiv.className = "workspace-info-container";

    // Create div element with class "workspace-division"
    const workspaceDivisionDiv = document.createElement("div");
    workspaceDivisionDiv.className = "workspace-division";

    // Create div element with class "workspace-info" for Lease Term
    const leaseTermWorkspaceInfoDiv = document.createElement("div");
    leaseTermWorkspaceInfoDiv.className = "workspace-info";

    // Create span element with class "subtitle-highlight" for Lease Term label
    const leaseTermLabelSpan = document.createElement("span");
    leaseTermLabelSpan.className = "subtitle-highlight";
    leaseTermLabelSpan.textContent = "Term:";

    // Create span element with class "highlight" for Lease Term value
    const leaseTermValueSpan = document.createElement("span");
    leaseTermValueSpan.className = "highlight";
    leaseTermValueSpan.textContent = `${lease_term}`;

    // Append Lease Term label and value spans to Lease Term workspace-info div
    leaseTermWorkspaceInfoDiv.appendChild(leaseTermLabelSpan);
    leaseTermWorkspaceInfoDiv.appendChild(leaseTermValueSpan);

    // Create div element with class "workspace-info" for Price
    const priceWorkspaceInfoDiv = document.createElement("div");
    priceWorkspaceInfoDiv.className = "workspace-info";

    // Create span element with class "subtitle-highlight" for Price label
    const priceLabelSpan = document.createElement("span");
    priceLabelSpan.className = "subtitle-highlight";
    priceLabelSpan.textContent = "Price:";

    // Create span element with class "highlight" for Price value
    const priceValueSpan = document.createElement("span");
    priceValueSpan.className = "highlight";
    priceValueSpan.textContent = `${price}`;

    // Append Price label and value spans to Price workspace-info div
    priceWorkspaceInfoDiv.appendChild(priceLabelSpan);
    priceWorkspaceInfoDiv.appendChild(priceValueSpan);

    // Append Lease Term and Price workspace-info divs to workspace-division div
    workspaceDivisionDiv.appendChild(leaseTermWorkspaceInfoDiv);
    workspaceDivisionDiv.appendChild(priceWorkspaceInfoDiv);

    // Create div element with class "workspace-division"
    const workspaceDivisionDiv2 = document.createElement("div");
    workspaceDivisionDiv2.className = "workspace-division";

    // Create div element with class "workspace-info" for Seats
    const seatsWorkspaceInfoDiv = document.createElement("div");
    seatsWorkspaceInfoDiv.className = "workspace-info";

    // Create span element with class "subtitle-highlight" for Seats label
    const seatsLabelSpan = document.createElement("span");
    seatsLabelSpan.className = "subtitle-highlight";
    seatsLabelSpan.textContent = "Seats:";

    // Create span element with class "highlight" for Seats value
    const seatsValueSpan = document.createElement("span");
    seatsValueSpan.className = "highlight";
    seatsValueSpan.textContent = `${seats}`;

    // Append Seats label and value spans to Seats workspace-info div
    seatsWorkspaceInfoDiv.appendChild(seatsLabelSpan);
    seatsWorkspaceInfoDiv.appendChild(seatsValueSpan);

    // Create div element with class "workspace-info" for Smoking
    const smokingWorkspaceInfoDiv = document.createElement("div");
    smokingWorkspaceInfoDiv.className = "workspace-info";

    // Create span element with class "subtitle-highlight" for Smoking label
    const smokingLabelSpan = document.createElement("span");
    smokingLabelSpan.className = "subtitle-highlight";
    smokingLabelSpan.textContent = "Smoking:";

    // Create span element with class "highlight" for Smoking value
    const iconContext3 =
      smoking == "yes"
        ? `<i class="fa-solid fa-circle-check fa-lg" style="color: #1f5132;"></i>`
        : `<i class="fa-solid fa-circle-xmark fa-lg" style="color: #511f1f;"></i>`;
    const smokingValueSpan = document.createElement("span");
    smokingValueSpan.className = "highlight";
    smokingValueSpan.innerHTML = `${iconContext3}`;

    // Append Smoking label and value spans to Smoking workspace-info div
    smokingWorkspaceInfoDiv.appendChild(smokingLabelSpan);
    smokingWorkspaceInfoDiv.appendChild(smokingValueSpan);

    // Create div element with class "workspace-info" for Sqft
    const sqftWorkspaceInfoDiv = document.createElement("div");
    sqftWorkspaceInfoDiv.className = "workspace-info";

    // Create span element with class "subtitle-highlight" for Sqft label
    const sqftLabelSpan = document.createElement("span");
    sqftLabelSpan.className = "subtitle-highlight";
    sqftLabelSpan.textContent = "Sqft:";

    // Create span element with class "highlight" for Sqft value
    const sqftValueSpan = document.createElement("span");
    sqftValueSpan.className = "highlight";
    sqftValueSpan.textContent = `${sqft}`;

    // Append Sqft label and value spans to Sqft workspace-info div
    sqftWorkspaceInfoDiv.appendChild(sqftLabelSpan);
    sqftWorkspaceInfoDiv.appendChild(sqftValueSpan);

    // Append Seats, Smoking, and Sqft workspace-info divs to workspace-division div
    workspaceDivisionDiv2.appendChild(seatsWorkspaceInfoDiv);
    workspaceDivisionDiv2.appendChild(smokingWorkspaceInfoDiv);
    workspaceDivisionDiv2.appendChild(sqftWorkspaceInfoDiv);

    // Create a new div element
    const workspaceDivisionDiv3 = document.createElement("div");
    workspaceDivisionDiv3.className = "workspace-division";

    // Create a new div element
    const workspaceInfo = document.createElement("div");
    workspaceInfo.className = "workspace-info";

    // Create a new span element for subtitle-highlight
    const subtitleHighlight = document.createElement("span");
    subtitleHighlight.className = "subtitle-highlight";
    subtitleHighlight.textContent = "Type:";

    // Create a new span element for highlight
    const highlight = document.createElement("span");
    highlight.className = "highlight";
    highlight.textContent = `${workspace_type}`;

    // Append subtitle-highlight span element to workspace-info div element
    workspaceInfo.appendChild(subtitleHighlight);

    // Append highlight span element to workspace-info div element
    workspaceInfo.appendChild(highlight);

    // Append workspace-info div element to workspace-division div element
    // workspaceDivisionDiv3.appendChild(workspaceInfo);
    workspaceDivisionDiv.appendChild(workspaceInfo);

    // Create a div element
    const workspaceDivisionDiv4 = document.createElement("div");

    // Add "workspace-info" class to the div element
    workspaceDivisionDiv4.classList.add("workspace-status");

    // Create a span element for the subtitle
    const subtitleElement1 = document.createElement("span");
    subtitleElement1.classList.add("subtitle-highlight");
    subtitleElement1.textContent = "Workspace Status:";

    const statushighlightElementWorkspace = workspace_status
      ? `<i class="fa-solid fa-square-check fa-xl" style="color: #1f5132;"></i>`
      : `<i class="fa-solid fa-rectangle-xmark fa-xl" style="color: #511f1f;"></i>`;
    // Create a span element for the highlight
    const highlightElement = document.createElement("span");
    highlightElement.classList.add("highlight");
    highlightElement.innerHTML = `${statushighlightElementWorkspace}`;

    // Append the subtitle and highlight elements to the div element
    workspaceDivisionDiv4.appendChild(subtitleElement1);
    workspaceDivisionDiv4.appendChild(highlightElement);

    // Create a div element
    const workspaceDivisionDiv5 = document.createElement("div");

    // Add "workspace-info" class to the div element
    workspaceDivisionDiv5.classList.add("workspace-info");

    // Create a span element for the subtitle
    const subtitleElement2 = document.createElement("span");
    subtitleElement2.classList.add("subtitle-highlight");
    subtitleElement2.textContent = "Workspace ID:";

    // Create a span element for the highlight
    const highlightElement2 = document.createElement("span");
    highlightElement2.classList.add("highlight");
    highlightElement2.textContent = `${workspace_id}`;

    // Append the subtitle and highlight elements to the div element
    workspaceDivisionDiv5.appendChild(subtitleElement2);
    workspaceDivisionDiv5.appendChild(highlightElement2);

    // Create a div element
    const workspaceDivisionDiv6 = document.createElement("div");

    // Add "workspace-info" class to the div element
    workspaceDivisionDiv6.classList.add("workspace-info");

    // Create a span element for the subtitle
    const subtitleElement3 = document.createElement("span");
    subtitleElement3.classList.add("subtitle-highlight");
    subtitleElement3.textContent = "Property Status:";

    // Create a span element for the highlight
    const highlightElement3 = document.createElement("span");
    highlightElement3.classList.add("highlight");
    highlightElement3.textContent = `${property_status}`;

    // Append the subtitle and highlight elements to the div element
    workspaceDivisionDiv6.appendChild(subtitleElement3);
    workspaceDivisionDiv6.appendChild(highlightElement3);

    // Create a div element
    const workspaceDivisionDiv7 = document.createElement("div");

    // Add "workspace-info" class to the div element
    workspaceDivisionDiv7.classList.add("workspace-info");

    // Create a span element for the subtitle
    const subtitleElement4 = document.createElement("span");
    subtitleElement4.classList.add("subtitle-highlight");
    subtitleElement4.textContent = "Property ID:";

    // Create a span element for the highlight
    const highlightElement4 = document.createElement("span");
    highlightElement4.classList.add("highlight");
    highlightElement4.textContent = `${property_id}`;

    // Append the subtitle and highlight elements to the div element
    workspaceDivisionDiv7.appendChild(subtitleElement4);
    workspaceDivisionDiv7.appendChild(highlightElement4);

    // Append workspace-division div to workspace-info-container div
    workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv);
    workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv2);
    workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv3);
    workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv4);
    if (showQaTest) {
      workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv5);
      workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv6);
      workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv7);
    }

    // Append workspace-info-container div to wrap-workspace div
    wrapWorkspaceDiv.appendChild(workspaceInfoContainerDiv);

    const buttonContainerProperty = document.createElement("div");
    buttonContainerProperty.className = "button-container";

    const btnUpdateWorkspace = document.createElement("button");
    btnUpdateWorkspace.className = "btn";
    btnUpdateWorkspace.id = `btn-update-workspace`;
    btnUpdateWorkspace.textContent = "Update";
    btnUpdateWorkspace.value = `${workspace_id}`;
    btnUpdateWorkspace.name = `${property_id}`;

    const statusBtnActiveInactiveWorkspace = !workspace_status
      ? "Activate"
      : "Deactivate";
    const btnActiveInactiveWorkspace = document.createElement("button");
    btnActiveInactiveWorkspace.className = "btn";
    btnActiveInactiveWorkspace.id = `btn-active-inactive-workspace`;
    btnActiveInactiveWorkspace.textContent = statusBtnActiveInactiveWorkspace;
    btnActiveInactiveWorkspace.name = statusBtnActiveInactiveWorkspace;
    btnActiveInactiveWorkspace.value = `${workspace_id}`;

    // Append button to btn-container
    buttonContainerProperty.appendChild(btnUpdateWorkspace);
    buttonContainerProperty.appendChild(btnActiveInactiveWorkspace);

    // Append the elements
    propertyCard.appendChild(wrapImg);
    propertyCard.appendChild(addressNeighborhood);
    propertyCard.appendChild(propertyInfoContainer);
    propertyCard.appendChild(wrapWorkspaceDiv);
    propertyCard.appendChild(buttonContainerProperty);

    roomsContainer.appendChild(propertyCard);

    if (isFirstCallWorkspaces) {
      setTimeout(() => {
        propertyCard.style.animationDelay = `${index * 0.25}s`;
        propertyCard.style.opacity = "1";
        propertyCard.style.transform = "translateX(1000%)";
        propertyCard.style.display = "block";
      }, index * 1);
    } else {
      propertyCard.style.display = "block";
      propertyCard.style.animationDuration = "0s";
    }
  });
  isFirstCallWorkspaces = false;
};

/*=============================================
→ ### DELIST PROPERTY ### */
document.addEventListener("click", (event) => {
  if (event.target.matches(`#btn-active-inactive-property`)) {
    buttonValue = event.target.value;
    delistProperty(buttonValue);
  }
});

/*=============================================
→ ### DELIST WORKSPACE ### */
document.addEventListener("click", (event) => {
  if (event.target.matches(`#btn-active-inactive-workspace`)) {
    buttonValue = event.target.value;
    delistWorkspace(buttonValue);
  }
});

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
paragraphTransportation.textContent = "Is there public transportation?";

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
labelTransportationYes.htmlFor = "public-transportation-yes";
labelTransportationYes.textContent = "Yes";

// Create input element for No option of public transportation
const inputTransportationNo = document.createElement("input");
inputTransportationNo.type = "radio";
inputTransportationNo.name = "Public Transportation";
inputTransportationNo.id = "public-transportation-no";
inputTransportationNo.value = "no";

// Create label element for No option of public transportation
const labelTransportationNo = document.createElement("label");
labelTransportationNo.htmlFor = "public-transportation-no";
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
if (showQaTest) {
  modalContentProperty.appendChild(modalPropertySubtitle);
}
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
  if (
    event.target == closeBtnProperty ||
    event.target == submitBtnProperty ||
    event.key === "Escape"
  ) {
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

const dailyRadio = document.createElement("input");
dailyRadio.type = "radio";
dailyRadio.name = "Leasing Term";
dailyRadio.id = "daily";
dailyRadio.value = "Daily";

const dailyRadioLabel = document.createElement("label");
dailyRadioLabel.htmlFor = "daily";
dailyRadioLabel.textContent = "Daily";

const weeklyRadio = document.createElement("input");
weeklyRadio.type = "radio";
weeklyRadio.name = "Leasing Term";
weeklyRadio.id = "weekly";
weeklyRadio.value = "Weekly";

const weeklyRadioLabel = document.createElement("label");
weeklyRadioLabel.htmlFor = "weekly";
weeklyRadioLabel.textContent = "Weekly";

const monthlyRadio = document.createElement("input");
monthlyRadio.type = "radio";
monthlyRadio.name = "Leasing Term";
monthlyRadio.id = "monthly";
monthlyRadio.value = "Monthly";

const monthlyRadioLabel = document.createElement("label");
monthlyRadioLabel.htmlFor = "monthly";
monthlyRadioLabel.textContent = "Monthly";

leasingTermRadioContainer.appendChild(dailyRadio);
leasingTermRadioContainer.appendChild(dailyRadioLabel);
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

const deskRadioworkspaceType = document.createElement("input");
deskRadioworkspaceType.type = "radio";
deskRadioworkspaceType.name = "Workspace Type";
deskRadioworkspaceType.id = "desk";
deskRadioworkspaceType.value = "Desk";

const deskRadioLabelworkspaceType = document.createElement("label");
deskRadioLabelworkspaceType.htmlFor = "desk";
deskRadioLabelworkspaceType.textContent = "Desk";

const officeRadioworkspaceType = document.createElement("input");
officeRadioworkspaceType.type = "radio";
officeRadioworkspaceType.name = "Workspace Type";
officeRadioworkspaceType.id = "office";
officeRadioworkspaceType.value = "Office";

const officeRadioLabelworkspaceType = document.createElement("label");
officeRadioLabelworkspaceType.htmlFor = "office";
officeRadioLabelworkspaceType.textContent = "Office";

const meetingRadioworkspaceType = document.createElement("input");
meetingRadioworkspaceType.type = "radio";
meetingRadioworkspaceType.name = "Workspace Type";
meetingRadioworkspaceType.id = "meeting";
meetingRadioworkspaceType.value = "Meeting";

const meetingRadioLabelworkspaceType = document.createElement("label");
meetingRadioLabelworkspaceType.htmlFor = "meeting";
meetingRadioLabelworkspaceType.textContent = "Meeting Room";

workspaceTypeRadioContainer.appendChild(deskRadioworkspaceType);
workspaceTypeRadioContainer.appendChild(deskRadioLabelworkspaceType);
workspaceTypeRadioContainer.appendChild(officeRadioworkspaceType);
workspaceTypeRadioContainer.appendChild(officeRadioLabelworkspaceType);
workspaceTypeRadioContainer.appendChild(meetingRadioworkspaceType);
workspaceTypeRadioContainer.appendChild(meetingRadioLabelworkspaceType);

addWorkspaceRadioContainer3.appendChild(workspaceTypeLabel);
addWorkspaceRadioContainer3.appendChild(workspaceTypeRadioContainer);

const addWorkspaceSelectContainer = document.createElement("div");
addWorkspaceSelectContainer.className = "add-workspace-dropdown-container";

const workspaceSelectLabel = document.createElement("p");
workspaceSelectLabel.textContent =
  "Which property will the workspace be added to?";

// Create the select element
const select = document.createElement("select");
select.id = "dropdown-add-workspace";

var filteredProperties;
const loadDropdownWorkspace = () => {
  filteredProperties = propertiesWorkspaceData.reduce((acc, property) => {
    // Check if the property_id already exists in the accumulator array
    if (!acc.some((p) => p.property_id === property.property_id)) {
      // If it doesn't, add the property to the accumulator array
      acc.push(property);
    }
    return acc;
  }, []);

  filteredProperties.forEach((property) => {
    // Create the option element
    const option = document.createElement("option");
    option.value = property.property_id;
    option.text = `${property.address} ${property.neighborhood}`;

    // Append the option elements to the select element
    select.appendChild(option);
  });
};

// Add the select element to the document
addWorkspaceSelectContainer.appendChild(workspaceSelectLabel);
addWorkspaceSelectContainer.appendChild(select);

// Create add-property-radio-container element for public transportation
const addPropertyRadioContainerStatus = document.createElement("div");
addPropertyRadioContainerStatus.className = "add-property-radio-container";
addPropertyRadioContainerStatus.id =
  "add-property-radio-container-property-status";

// Create paragraph element for public transportation
const paragraphStatus = document.createElement("p");
paragraphStatus.textContent = "Workspace status:";

// Create radio-option-container element for public transportation
const radioOptionContainerStatus = document.createElement("div");
radioOptionContainerStatus.className = "radio-option-container";

// Create input element for Yes option of public transportation
const inputStatusYes = document.createElement("input");
inputStatusYes.type = "radio";
inputStatusYes.name = "workspace_status";
inputStatusYes.id = "public-status-yes";
inputStatusYes.value = true;

// Create label element for Yes option of public Property
const labelStatusYes = document.createElement("label");
labelStatusYes.htmlFor = "public-status-yes";
labelStatusYes.textContent = "Actived";

// Create input element for No option of public Property
const inputStatusNo = document.createElement("input");
inputStatusNo.type = "radio";
inputStatusNo.name = "workspace_status";
inputStatusNo.id = "public-status-no";
inputStatusNo.value = false;

// Create label element for No option of public Property
const labelStatusNo = document.createElement("label");
labelStatusNo.htmlFor = "public-status-no";
labelStatusNo.textContent = "Deactivated";

// Append radio button elements to radio-option-container for Status
radioOptionContainerStatus.appendChild(inputStatusYes);
radioOptionContainerStatus.appendChild(labelStatusYes);
radioOptionContainerStatus.appendChild(inputStatusNo);
radioOptionContainerStatus.appendChild(labelStatusNo);

// Append paragraph element and radio-option-container to add-property-radio-container for public Property
addPropertyRadioContainerStatus.appendChild(paragraphStatus);
addPropertyRadioContainerStatus.appendChild(radioOptionContainerStatus);

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
addWorkspaceForm.appendChild(addWorkspaceSelectContainer);
addWorkspaceForm.appendChild(addPropertyRadioContainerStatus);
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
  if (
    event.target == closeBtnWorkspace ||
    event.target == submitBtnWorkspace ||
    event.key === "Escape"
  ) {
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
    document
      .querySelectorAll("[name='workspace_status']")
      .forEach((option) => (option.checked = false));
  }
};

// Attach event listeners to show and hide the modal
document.addEventListener("click", (event) => {
  if (event.target.matches("#btn-add-workspace")) {
    const dropdownProperties = document.getElementById(
      "dropdown-add-workspace"
    );
    dropdownProperties.selectedIndex = 0;
    const addPropertyRadioContainerPropertyStatus = document.getElementById(
      "add-property-radio-container-property-status"
    );
    addPropertyRadioContainerPropertyStatus.style.display = "block";
    showModalWorkspace();
  }
});

closeBtnWorkspace.addEventListener("click", hideModalWorkspace);

// Define a function to handle the keydown event
const handleKeyDownEscape = (event) => {
  // Check if the Escape key was pressed
  hideModalWorkspace(event);
  hideModalProperty(event);
};

// Add the event listener to the document object
document.addEventListener("keydown", handleKeyDownEscape);

/*=============================================
→ ### UPDATE PROPERTY MODAL ### */
const updatePropertyModal = () => {
  const indexProperty = findId("property_id");

  const { address, neighborhood, ParkingLot, PublicTransportation } =
    propertiesWorkspaceData[indexProperty];

  modalPropertySubtitle.innerHTML = `Property ID: ${buttonValue}`;
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
    buttonValue = event.target.value;
    isUpdateProperty = true;
    showModalProperty();
    updatePropertyModal();
  }
});

/*=============================================
→ ### UPDATE WORKSPACE MODAL ### */
const updateWorkspaceModal = () => {
  const indexWorkspace = findId("workspace_id");

  const {
    lease_term,
    price,
    seats,
    smoking,
    sqft,
    workspace_type,
    workspace_status,
  } = propertiesWorkspaceData[indexWorkspace];

  if (showQaTest) {
    modalWorkspaceSubtitle.innerHTML = `Workspace ID: ${buttonValue}`;
  }
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

  if (showQaTest) {
    console.log(
      "propertiesWorkspaceData[indexWorkspace]",
      propertiesWorkspaceData
    );
    console.log("buttonValue", buttonValue);
    console.log("filteredProperties", filteredProperties);
  }

  const dropdownProperties = document.getElementById("dropdown-add-workspace");
  dropdownProperties.selectedIndex = filteredProperties.findIndex(
    (property) => {
      return property.property_id == buttonNameValue;
    }
  );

  const startStatusRadios = document.getElementsByName("workspace_status");
  startStatusRadios.forEach((radio) => {
    if (Boolean(radio.value) === workspace_status) {
      radio.checked = true;
    }
  });
};

document.addEventListener("click", (event) => {
  if (event.target.matches(`#btn-update-workspace`)) {
    buttonValue = event.target.value;
    buttonNameValue = event.target.name;
    isUpdateWorkspace = true;
    const addPropertyRadioContainerPropertyStatus = document.getElementById(
      "add-property-radio-container-property-status"
    );
    addPropertyRadioContainerPropertyStatus.style.display = "none";
    showModalWorkspace();
    updateWorkspaceModal();
  }
});

/*=============================================
→ ### FIND ID ### */
// function to find the index of the id in the array
const findId = (caseId) => {
  let index = -1;

  switch (caseId) {
    case "property_id":
      propertiesWorkspaceData.forEach((obj, i) => {
        if (obj.property_id === buttonValue) {
          index = i;
        }
      });
      return index;
      break;

    case "workspace_id":
      propertiesWorkspaceData.forEach((obj, i) => {
        if (obj.workspace_id === buttonValue) {
          index = i;
        }
      });
      return index;
      break;
  }

  if (showQaTest) {
    if (index !== -1) {
      console.log(`Id ${buttonValue} found at index ${index}`);
    } else {
      console.log(`Id ${buttonValue} not found in the array`);
    }
  }
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
    isFirstCallProperties = true;
    displayPropertiesWorkspaceData(propertiesWorkspaceData);
    document.getElementById("search-bar-property").value = "";
    document.getElementById("dropdown-search-bar-property").value = "address";
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
    isFirstCallWorkspaces = true;
    displayPropertiesWorkspaceData(propertiesWorkspaceData);
    document.getElementById("search-bar-workspace").value = "";
    document.getElementById("dropdown-search-bar-workspace").value = "address";
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

  if (isUpdateProperty) {
    const postNewProperty = {
      property_id: `${buttonValue}`,
      address: `${address}`,
      neighborhood: `${neighbourhood}`,
      ParkingLot: `${parkingLot.value}`,
      PublicTransportation: `${publicTransportation.value}`,
      user_id: getCurrentUser(),
    };

    serverPostUpdateProperty(postNewProperty);

    isUpdateProperty = false;
  } else {
    const postNewProperty = {
      address: `${address}`,
      neighborhood: `${neighbourhood}`,
      ParkingLot: `${parkingLot.value}`,
      PublicTransportation: `${publicTransportation.value}`,
      user_id: getCurrentUser(),
    };

    serverPostNewProperty(postNewProperty);
  }

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
  const dropdownProperties = document.getElementById("dropdown-add-workspace");
  const dropdownPropertiesValue =
    dropdownProperties.options[dropdownProperties.selectedIndex].value;

  const workspaceStatus = document.querySelector(
    'input[name="workspace_status"]:checked'
  );

  // Validate form inputs
  if (
    leasingTerm === "" ||
    price === "" ||
    seats === "" ||
    sqft === "" ||
    !leasingTerm ||
    !smoking ||
    !workspaceType ||
    !workspaceStatus
  ) {
    alert("Please fill in all the fields.");
    return;
  }
  if (showQaTest) {
    console.log("isUpdateWorkspace", isUpdateWorkspace);
  }

  if (isUpdateWorkspace) {
    const postWorkspace = {
      workspace_id: `${buttonValue}`,
      workspace_type: `${workspaceType.value}`,
      seats: `${seats}`,
      smoking: `${smoking.value}`,
      price: `${price}`,
      sqft: `${sqft}`,
      lease_term: `${leasingTerm.value}`,
      property_id: `${dropdownPropertiesValue}`,
      user_id: getCurrentUser(),
      workspace_status: Boolean(workspaceStatus),
    };
    serverPostUpdateWorkspace(postWorkspace);

    isUpdateWorkspace = false;
  } else {
    const postWorkspace = {
      workspace_type: `${workspaceType.value}`,
      seats: `${seats}`,
      smoking: `${smoking.value}`,
      price: `${price}`,
      sqft: `${sqft}`,
      lease_term: `${leasingTerm.value}`,
      property_id: `${dropdownPropertiesValue}`,
      user_id: getCurrentUser(),
      workspace_status: true,
    };

    serverPostNewWorkspace(postWorkspace);
  }

  hideModalWorkspace(event);
};

submitBtnWorkspace.addEventListener("click", sendNewWorkspace);

/*=============================================
→ ### ON LOAD THE PAGE ### */
window.onload = async () => {
  propertiesWorkspaceData = await serverGetWorkspaceByOwner();
  displayPropertiesWorkspaceData(propertiesWorkspaceData);
  loadDropdownWorkspace();
  document.getElementById("btn-my-rooms").disabled = true;
  if (showQaTest) {
    console.log("propertiesWorkspaceData", propertiesWorkspaceData);
  }
};
