/*
************************************************
### BOOKING ###
************************************************
*/
/*=============================================
→ ### IMPORTS ### */
import {
  firstName,
  getLoggedUser,
  getOwnerContact,
  serverGetUnavailableDates,
  serverPostSelectedDates,
  serverGetWorkspace,
  showQaTest,
} from "./general_conf.js";

/*=============================================
→ ### GLOBAL VARIABLES ### */
var buttonBookIdValue; // Store the id from the book button
var UnavailableDates; // Store the UnavailableDates from the server
var selectedDays = []; // Array to store selected days on calendar
var selectedDates = []; // Array to store selected dates on calendar
var propertiesData = []; // Receive data from the server
var displayBooked; //Stores booked workspaces to be displayed
  
/*=============================================
→ ### DISPLAY OWNER SPACE ### */

const owner = localStorage.getItem("owner");
const isLoggedUser = getLoggedUser();

if ((isLoggedUser == null || owner === "false")) {
  document.querySelector(".owner-workspace-container").style.display = "none";
}

/*=============================================
→ ### CALENDAR MODAL ### */
// Get the modal element
const modalCalendar = document.getElementById("modal-calendar");

// Get the submit button element
const submitBtn = modalCalendar.querySelector("#submit-selected-dates");

// Get the close button element
const cancelBtn = modalCalendar.querySelector("#button-cancel");

// Function to create a new object with updated month value
const createNewSelectedDateObject = () => {
  // Check if an object with current year and current month + 1 already exists
  const existDateObj = selectedDates.find(
    (date) => date.year === currentYear && date.month === currentMonth + 1
  );

  // If an existing object is found, return without creating a new object
  if (existDateObj) {
    return;
  }

  // Create a new object with updated month value
  let newSelectedDate = {
    user_id: getLoggedUser(),
    workspace_id: buttonBookIdValue,
    year: currentYear,
    month: currentMonth + 1,
    days: selectedDays,
  };

  selectedDates.push(newSelectedDate); // Add the new object to selectedDates array

};

//Clear Selected dates object
const clearSelectedDatesObject = () => {
  selectedDates = [
    {
      user_id: getLoggedUser(),
      workspace_id: buttonBookIdValue,
      year: currentYear,
      month: currentMonth + 1,
      days: [],
    },
  ];
};

// Clear selected days on calendar (class)
const clearSelectDates = () => {
  const selectedTds = document.querySelectorAll(".selected");
  selectedTds.forEach((td) => {
    td.classList.remove("selected");
    td.classList.add("available");
  });
};

// Show the modal when a button is clicked
const showModal = () => {
  modalCalendar.style.display = "flex";

  prevMonthButton.disabled = true;

  clearSelectedDatesObject();

  calendarModal();
};

// Hide the modal when the close button is clicked or outside the modal
const hideModal = (event) => {
  if (
    event.target == cancelBtn ||
    event.target == submitBtn ||
    event.key === "Escape"
  ) {
    modalCalendar.style.display = "none";

    clearSelectDates();

    currentMonth = presentMonth;
    currentYear = presentYear;

    selectedDates.length = 0;
  }
};

// Attach event listeners to show and hide the modal
document.addEventListener("click", (event) => {
  if (event.target.matches(`#btn-book`)) {
    buttonBookIdValue = event.target.value;
    showModal();
    createNewSelectedDateObject();
  }
});

cancelBtn.addEventListener("click", hideModal);

// Define a function to handle the keydown event
const handleKeyDownEscape = (event) => {
  // Check if the Escape key was pressed
  hideModal(event);
};

// Add the event listener to the document object
document.addEventListener("keydown", handleKeyDownEscape);

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
const filterWorkspaceProperty = (searchBarInputValue) => {
  const dropdownSearchBar = document.getElementById("dropdown-search-bar");
  const searchBar = document.getElementById("search-bar-input");
  const dropdownSearchBarValue =
    dropdownSearchBar.options[dropdownSearchBar.selectedIndex].value;

  let filteredData;
  switch (dropdownSearchBarValue) {
    case "":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search");
      displayPropertiesData(propertiesData);
      break;

    case "workspace_name":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search");
      filteredData = propertiesData.filter(
        ({ workspace_name }) =>
          workspace_name &&
          workspace_name
            .toLowerCase()
            .includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesData(filteredData);
      break;

    case "lease_term":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search: Daily, Weekly or Monthly");
      filteredData = propertiesData.filter(
        ({ lease_term }) =>
          lease_term &&
          lease_term.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesData(filteredData);
      break;

    case "price":
      searchBar.setAttribute("type", "number");
      searchBar.setAttribute("placeholder", "Search (Only numbers)");
      const priceValue = parseInt(searchBarInputValue);
      if (priceValue !== "" && !isNaN(priceValue)) {
        filteredData = propertiesData.filter(({ price }) =>
          String(price).includes(String(priceValue))
        );
      } else {
        filteredData = propertiesData;
      }
      displayPropertiesData(filteredData);
      break;

    case "seats":
      searchBar.setAttribute("type", "number");
      searchBar.setAttribute("placeholder", "Search (Only numbers)");
      const seatsValue = parseInt(searchBarInputValue);
      if (seatsValue !== "" && !isNaN(seatsValue)) {
        filteredData = propertiesData.filter(({ seats }) =>
          String(seats).includes(String(seatsValue))
        );
      } else {
        filteredData = propertiesData;
      }
      displayPropertiesData(filteredData);
      break;

    case "smoking":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search: Yes or No");
      filteredData = propertiesData.filter(
        ({ smoking }) =>
          smoking &&
          smoking.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesData(filteredData);
      break;

    case "sqft":
      searchBar.setAttribute("type", "number");
      searchBar.setAttribute("placeholder", "Search (Only numbers)");
      const sqftValue = parseInt(searchBarInputValue);
      if (sqftValue !== "" && !isNaN(sqftValue)) {
        filteredData = propertiesData.filter(({ sqft }) =>
          String(sqft).includes(String(sqftValue))
        );
      } else {
        filteredData = propertiesData;
      }
      displayPropertiesData(filteredData);
      break;

    case "workspace_type":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search: Desk, Office, Meeting");
      filteredData = propertiesData.filter(
        ({ workspace_type }) =>
          workspace_type &&
          workspace_type
            .toLowerCase()
            .includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesData(filteredData);
      break;

    case "address":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search");
      filteredData = propertiesData.filter(({ address }) =>
        address.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesData(filteredData);
      break;

    case "neighborhood":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search");
      filteredData = propertiesData.filter(({ neighborhood }) =>
        neighborhood.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesData(filteredData);
      break;

    case "ParkingLot":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search: Yes or No");
      filteredData = propertiesData.filter(({ ParkingLot }) =>
        ParkingLot.toLowerCase().includes(searchBarInputValue.toLowerCase())
      );
      displayPropertiesData(filteredData);
      break;

    case "PublicTransportation":
      searchBar.setAttribute("type", "search");
      searchBar.setAttribute("placeholder", "Search: Yes or No");
      filteredData = propertiesData.filter(({ PublicTransportation }) =>
        PublicTransportation.toLowerCase().includes(
          searchBarInputValue.toLowerCase()
        )
      );
      displayPropertiesData(filteredData);
      break;
  }
};

const dropdownSearchBar = document.getElementById("dropdown-search-bar");
dropdownSearchBar.addEventListener("change", (event) => {
  const searchBarInputValue = (document.getElementById(
    "search-bar-input"
  ).value = "");
  filterWorkspaceProperty(searchBarInputValue);
});

const searchBarInput = document.getElementById("search-bar-input");
searchBarInput.addEventListener("input", (event) => {
  const searchBarInputValue = event.target.value;
  filterWorkspaceProperty(searchBarInputValue);
});

/*=============================================
→ ### DISPLAY PROPERTIES DATA ### */
let isFirstCall = true;
const displayPropertiesData = (propertiesData) => {
  const roomsContainer = document.getElementById("rooms-container");
  roomsContainer.innerHTML = "";

  propertiesData.forEach((propertyData, index) => {
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
      workspace_name,
      property_status,
      property_id,
    } = propertyData;

    if (!workspace_status || workspace_status == null) {
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

    // Create the div element with class "name-workspace-container"
    const nameWorkspace = document.createElement("div");
    nameWorkspace.className = "name-workspace-container";
    // Create a span element for the subtitle
    const subtitleElement0 = document.createElement("span");
    subtitleElement0.classList.add("subtitle-highlight");
    subtitleElement0.textContent = "Name:";

    // Create a span element for the highlight
    const highlightElement0 = document.createElement("span");
    highlightElement0.classList.add("highlight");
    highlightElement0.textContent = `${workspace_name}`;

    nameWorkspace.append(subtitleElement0);
    nameWorkspace.append(highlightElement0);

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
    workspaceDivisionDiv4.classList.add("workspace-info");

    // Create a span element for the subtitle
    const subtitleElement1 = document.createElement("span");
    subtitleElement1.classList.add("subtitle-highlight");
    subtitleElement1.textContent = "Workspace Status:";

    // Create a span element for the highlight
    const highlightElement1 = document.createElement("span");
    highlightElement1.classList.add("highlight");
    highlightElement1.textContent = `${workspace_status}`;

    // Append the subtitle and highlight elements to the div element
    workspaceDivisionDiv4.appendChild(subtitleElement1);
    workspaceDivisionDiv4.appendChild(highlightElement1);

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

    // Append workspace-division div to workspace-info-container div
    workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv);
    workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv2);
    workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv3);
    if (showQaTest) {
      workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv4);
      workspaceInfoContainerDiv.appendChild(workspaceDivisionDiv5);
    }

    // Append workspace-info-container div to wrap-workspace div
    wrapWorkspaceDiv.appendChild(workspaceInfoContainerDiv);

    // Create div element for btn-container
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");

    // Create button element
    const button = document.createElement("button");
    button.className = "btn";
    button.id = `btn-book`;
    button.textContent = "Book";
    button.value = `${workspace_id}`;
    if(isLoggedUser == null){
      button.disabled = true;
    }

    // Append button to btn-container
    btnContainer.appendChild(button);

    // Append the elements
    propertyCard.appendChild(wrapImg);
    propertyCard.appendChild(addressNeighborhood);
    propertyCard.appendChild(nameWorkspace);
    propertyCard.appendChild(propertyInfoContainer);
    propertyCard.appendChild(wrapWorkspaceDiv);
    propertyCard.appendChild(btnContainer);

    roomsContainer.appendChild(propertyCard);

    if (isFirstCall) {
      setTimeout(() => {
        propertyCard.style.animationDelay = `${index * 0.25}s`;
        propertyCard.style.opacity = "1";
        propertyCard.style.transform = "translateX(1000%)";
        propertyCard.style.display = "block";
      }, index * 0.01);
    } else {
      propertyCard.style.display = "block";
      propertyCard.style.animationDuration = "0s";
    }
  });
  isFirstCall = false;
};

/*=============================================
→ ### CREATE THE CALENDAR ### */
const calendarModal = async () => {
  UnavailableDates = await serverGetUnavailableDates(buttonBookIdValue);
  if (showQaTest) {
    console.log("Unavailable dates", UnavailableDates);
  }
  updateCalendar();
};

const calendarContainer = document.getElementById("calendar-container");
const currentDate = new Date();
let presentYear = currentDate.getFullYear();
let presentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear(); //Navigation
let currentMonth = currentDate.getMonth(); //Navigation
let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Create calendar title
const calendarTitle = document.createElement("h2");
calendarTitle.id = "calendar-title";
calendarTitle.innerHTML = "Available Dates";

const calendarSubTitle = document.createElement("h3");
calendarSubTitle.id = "calendar-subtitle";

// Append calendar title the DOM
calendarContainer.appendChild(calendarTitle);
calendarContainer.appendChild(calendarSubTitle);

// Create calendar dates buttons container
const calendarDatesButtonsContainer = document.createElement("div");
calendarDatesButtonsContainer.id = "calendar-dates-buttons";

// Create previous month button
const prevMonthButton = document.createElement("button");
prevMonthButton.id = "calendar-prev-month";
prevMonthButton.className = "btn";
prevMonthButton.textContent = "Prev";
prevMonthButton.disabled = true;
calendarDatesButtonsContainer.appendChild(prevMonthButton);

// Create next month button
const nextMonthButton = document.createElement("button");
nextMonthButton.id = "calendar-next-month";
nextMonthButton.className = "btn";
nextMonthButton.textContent = "Next";
calendarDatesButtonsContainer.appendChild(nextMonthButton);

// Append calendar dates buttons container to the DOM
calendarContainer.appendChild(calendarDatesButtonsContainer);

// Create calendar month and year information container
const calendarMonthYearInformationContainer = document.createElement("div");
calendarMonthYearInformationContainer.id = "calendar-month-year-information";

// Create month display element
const monthDisplay = document.createElement("p");
monthDisplay.id = "calendar-month";
calendarMonthYearInformationContainer.appendChild(monthDisplay);

// Create year display element
const yearDisplay = document.createElement("p");
yearDisplay.id = "calendar-year";
calendarMonthYearInformationContainer.appendChild(yearDisplay);

calendarContainer.appendChild(calendarMonthYearInformationContainer);

const calendarMonth = document.getElementById("calendar-month");
const calendarYear = document.getElementById("calendar-year");

// Create a table element to represent the calendar
const calendarTable = document.createElement("table");

const updateCalendar = () => {
  daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let propertyIndex;
  propertiesData.forEach((property, i) => {
    if (property.workspace_id == buttonBookIdValue) {
      propertyIndex = i;
    }
  });
  calendarSubTitle.innerHTML = `${propertiesData[propertyIndex].workspace_name}`;
  localStorage.setItem("workspace_id", `${propertiesData[propertyIndex].workspace_id}`);
  localStorage.setItem("workspace_name", `${propertiesData[propertyIndex].workspace_name}`);
  console.log(displayBooked);
  calendarTable.innerHTML = ""; // Clear existing table

  // Create the header row with the days of the week
  const headerRow = document.createElement("tr");
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let day of daysOfWeek) {
    const th = document.createElement("th");
    th.textContent = day;
    headerRow.appendChild(th);
  }
  calendarTable.appendChild(headerRow);

  // Create the calendar rows with the days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const td = document.createElement("td");
      if (
        i <= daysInMonth &&
        j >= new Date(currentYear, currentMonth, i).getDay()
      ) {
        td.textContent = i;
        const foundDate = UnavailableDates.find(
          (date) =>
            date.year === currentYear &&
            date.month === currentMonth + 1 &&
            date.days.includes(i)
        );
        if (foundDate) {
          td.className = "unavailable";
        } else {
          td.className = "available";
        }

        const foundDateSelected = selectedDates.find(
          (date) =>
            date.year === currentYear &&
            date.month === currentMonth + 1 &&
            date.days.includes(i)
        );
        if (foundDateSelected) {
          td.className = "selected";
        }

        td.addEventListener("click", () => {
          if (!td.classList.contains("unavailable")) {
            if (td.classList.contains("selected")) {
              td.classList.remove("selected");
              td.classList.add("available");
              const index = selectedDays.indexOf(td.textContent);
              if (index !== -1) {
                selectedDays.splice(index, 1);
              }
            } else {
              td.classList.remove("available");
              td.classList.add("selected");
              if (!selectedDays.includes(td.textContent)) {
                selectedDays.push(parseInt(td.textContent));

                const updateSelectedDates = selectedDates.find(
                  (date) => date.month === currentMonth + 1
                );
                updateSelectedDates.days = [
                  ...updateSelectedDates.days,
                  ...selectedDays,
                ]; // Open both arrays into one
                updateSelectedDates.days = [
                  ...new Set(updateSelectedDates.days),
                ]; // Remove duplicate values
                updateSelectedDates.days = updateSelectedDates.days.sort(
                  (a, b) => a - b
                ); // Sort the array in ascending numeric order
              }
            }
          }
        });
        i++;
      }
      tr.appendChild(td);
    }
    i--;
    calendarTable.appendChild(tr);
  }

  // Reset the selected days
  selectedDays = [];

  calendarMonth.innerHTML = monthNames[currentMonth];
  calendarYear.innerHTML = currentYear;
};

calendarContainer.appendChild(calendarTable);

/*=============================================
→ ### CALENDAR NAVIGATION ### */
// Function to go to the previous month
const prevMonth = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  updateCalendar();
};

// Function to go to the next month
const nextMonth = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateCalendar();
};

// Attach event listeners to previous and next buttons
const prevButton = document.getElementById("calendar-prev-month");
prevButton.addEventListener("click", () => {
  if (currentYear <= presentYear && currentMonth - 1 == presentMonth) {
    prevButton.disabled = true;
  }
  prevMonth();
  createNewSelectedDateObject();
});

const nextButton = document.getElementById("calendar-next-month");
nextButton.addEventListener("click", () => {
  if (currentYear >= presentYear && currentMonth >= presentMonth) {
    prevButton.disabled = false;
  }
  nextMonth();
  createNewSelectedDateObject();
});

/*=============================================
→ ### SEND THE CALENDAR SELECTED DATES ### */
const sendSelectedDates = async () => {
  // Filter out objects with empty 'days' array
  const filteredDatesResult = selectedDates.filter(
    (date) => date.days.length > 0
  );

  const serverPostSelectedDatesReturn = await serverPostSelectedDates(
    filteredDatesResult
  );
};

submitBtn.addEventListener("click", sendSelectedDates);
submitBtn.addEventListener("click", hideModal);
submitBtn.addEventListener('click', ()=>{
  localStorage.clickcount = 1;
})

/*=============================================
→ ### ON LOAD THE PAGE ### */

//This function runs when the page is loaded
//It shows the workspaces and displays a message to the user everytime a workspace is booked
//giving the owner name and contact information
window.onload = async () => {
  propertiesData = await serverGetWorkspace();
  displayPropertiesData(propertiesData);
  if (showQaTest) {
    console.log("propertiesData", propertiesData);
  }

  if(Number(localStorage.clickcount) == 1) //if the user has clicked in the submit button on booking page, it displays info message
  {
    let ownerContact = await getOwnerContact();
    $("#booked-notification")
    .slideDown("slow")
    .css({display: "flex"});
    //appends paragraphs inside a ghotst div with message
    $("#dismiss-notification").before(`<p>${firstName}, you have booked ${localStorage.getItem("workspace_name")}!</p>
    <p>Get in contact with landlord:</p>
    <p>${ownerContact.fullName}: ${ownerContact.phoneNumber} - ${ownerContact.emailAddress}</p>`);
    //clears local storage and resets clickcount
    localStorage.removeItem("workspace_name");
    localStorage.removeItem("workspace_id");
    localStorage.clickcount = 0;
  }

};

//Calls the "dismiss" button function to slide up the div
try{
const closeNotification = document.querySelector("#dismiss-notification")
  .addEventListener('click', ()=>{
    $("#booked-notification")
    .slideUp("slow");
})}catch(err){};
