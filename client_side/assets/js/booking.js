/*
************************************************
### BOOKING ###
************************************************
*/
/*=============================================
→ ### IMPORTS ### */
import { baseUrl } from "./general_conf.js";

/*=============================================
→ ### GLOBAL VARIABLES ### */
var buttonBookIdValue; // Store the id from the book button
var availableDates; // Store the availableDates from the server
var selectedDays = []; // Array to store selected days on calendar
var selectedDates = []; // Array to store selected dates on calendar

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
    year: currentYear,
    month: currentMonth + 1,
    days: selectedDays,
  };

  selectedDates.push(newSelectedDate); // Add the new object to selectedDates array
};

/*=============================================
→ ### CALENDAR MODAL ### */
// Get the modal element
var modalCalendar = document.getElementById("modal-calendar");

// Get the submit button element
var submitBtn = modalCalendar.querySelector("#submit-selected-dates");

// Get the close button element
var cancelBtn = modalCalendar.querySelector("#button-cancel");

// Show the modal when a button is clicked
var showModal = () => {
  modalCalendar.style.display = "flex";

  selectedDates = [
    {
      year: presentYear,
      month: presentMonth + 1,
      days: [],
    },
  ];

  calendarModal();
};

// Hide the modal when the close button is clicked or outside the modal
var hideModal = (event) => {
  if (event.target == cancelBtn || event.target == submitBtn) {
    modalCalendar.style.display = "none";

    //reset the selected days on calendar
    const selectedTds = document.querySelectorAll(".selected");
    selectedTds.forEach((td) => {
      td.classList.remove("selected");
      td.classList.add("available");
    });

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
  }
});

cancelBtn.addEventListener("click", hideModal);

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
        filteredData = propertiesData.filter(({ price }) =>
          price.includes(priceValue)
        );
      } else {
        filteredData = propertiesData;
      }
      displayPropertiesData(filteredData);
      break;

    case "seats":
      const seatsValue = parseInt(searchBarInputValue);
      if (seatsValue !== "" && !isNaN(seatsValue)) {
        filteredData = propertiesData.filter(({ seats }) =>
          seats.includes(seatsValue)
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
        filteredData = propertiesData.filter(({ sqft }) =>
          sqft.includes(sqftValue)
        );
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
};

const dropdownSearchBar = document.getElementById("dropdown-search-bar");
dropdownSearchBar.addEventListener("change", (event) => {
  const searchBarInputValue = (document.getElementById(
    "search-bar-input"
  ).value = "");

  filterProperty(searchBarInputValue);
});

const searchBarInput = document.getElementById("search-bar-input");
searchBarInput.addEventListener("input", (event) => {
  const searchBarInputValue = event.target.value;

  filterProperty(searchBarInputValue);
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
    const {
      lease_term,
      price,
      seats,
      smoking,
      sqft,
      status,
      workspace_type,
      workspace_id,
    } = propertyData;

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
        <li>id: ${workspace_id}</li>
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
    button.id = `btn-book`;
    button.textContent = "Book";
    button.value = `${workspace_id}`;

    buttonContainer.appendChild(button);

    roomDivision.appendChild(roomDescription);
    roomDivision.appendChild(buttonContainer);

    roomsContainer.appendChild(roomDivision);
  });
};

/*=============================================
→ ### CREATE THE CALENDAR ### */
const calendarModal = () => {
  availableDates = getAvailableDates();
  updateCalendar();
};

const getAvailableDates = () => {
  const dates = [
    {
      year: 2023,
      month: 4,
      days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 18, 19, 20, 21, 22, 23, 24],
    },
    { year: 2023, month: 5, days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { year: 2023, month: 6, days: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
    { year: 2023, month: 7, days: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
    { year: 2023, month: 8, days: [29, 30, 31] },
    { year: 2023, month: 9, days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  ];

  availableDates = dates;

  //availableDates = [4, 5, 6, 11, 12, 13]; // Example of available dates
  console.log(`Get Simulation - Available dates, property id ${buttonBookIdValue}`);
  console.log(`availableDates`, availableDates);
  return availableDates;
};

const calendarContainer = document.getElementById("calendar-container");
const currentDate = new Date();
let presentYear = currentDate.getFullYear();
let presentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear(); //Navigation
let currentMonth = currentDate.getMonth(); //Navigation
let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

// Initialize the selectedDates with the present month and year
selectedDates = [
  {
    year: presentYear,
    month: presentMonth + 1,
    days: selectedDays,
  },
];

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

// Function to update the calendar with the current month's dates
const updateCalendar = () => {
  daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  calendarSubTitle.innerHTML = `Workspace id: ${buttonBookIdValue}`;
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
        const foundDate = availableDates.find(
          (date) =>
            date.year === currentYear &&
            date.month === currentMonth + 1 &&
            date.days.includes(i)
        );
        if (foundDate) {
          td.className = "available";
          // console.log('availableDates',availableDates);
          // console.log('foundDate',foundDate);
        } else {
          td.className = "unavailable";
        }
        // console.log('foundDate',foundDate);
        // console.log('availableDates',availableDates);
        //
        // console.log('selectedDates',selectedDates);
        const foundDateSelected = selectedDates.find(
          (date) =>
            date.year === currentYear &&
            date.month === currentMonth + 1 &&
            date.days.includes(i)
        );
        // console.log('foundDateSelected',foundDateSelected);
        if (foundDateSelected) {
          td.className = "selected";
        }
        //
        td.addEventListener("click", () => {
          if (!td.classList.contains("unavailable")) {
            if (td.classList.contains("selected")) {
              td.classList.remove("selected");
              td.classList.add("available");
              const index = selectedDays.indexOf(td.textContent);
              if (index !== -1) {
                selectedDays.splice(index, 1); // Remove from array if unselected
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
                ]; //open both array in one
                updateSelectedDates.days = [
                  ...new Set(updateSelectedDates.days),
                ]; //remove duplicate values
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

  //Reset the selected days
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
const sendSelectedDates = () => {
  // Filter out objects with empty 'days' array
  const filteredDatesResult = selectedDates.filter(
    (date) => date.days.length > 0
  );
  console.log(`Post Simulation - Dates sent to server, property id ${buttonBookIdValue}`);
  console.log(filteredDatesResult);
};

submitBtn.addEventListener("click", sendSelectedDates);
submitBtn.addEventListener("click", hideModal);

/*=============================================
→ ### ON LOAD THE PAGE ### */
window.onload = async () => {
  findWorkspace();
};
