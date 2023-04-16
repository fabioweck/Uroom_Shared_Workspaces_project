/*
************************************************
### GENERAL - NAV BAR AND FOOTER ###
************************************************
*/
/*==============================================
→ ### VIEW ICON MOBILE MENU ### */
const viewMobileMenu = () => {
  let mobileLinks = document.getElementById("menu-links-flex");

  let size = window.matchMedia("(max-width: 768px)");
  displayMobileMenu(size);
  size.addEventListener("change", displayMobileMenu);

  function displayMobileMenu(size) {
    if (size.matches) {
      mobileLinks.style.display === "flex"
        ? (mobileLinks.style.display = "none")
        : (mobileLinks.style.display = "flex");
    } else {
      mobileLinks.style.display = "flex";
    }
  }
};

const btnMobileMenu = document.getElementById("mobile-menu-icon");
btnMobileMenu.addEventListener("click", viewMobileMenu);

/*==============================================
→ ### NAV LINKS ### */
(() => {
  let linkIndex;
  let linkLogin;
  let linkBooking;
  let linkAbout;
  let linkContact;
  let imgLogo;

  try {
    if (document.getElementById("index").id == "index") {
      linkIndex = "./index.html";
      linkLogin = "./assets/pages/login.html";
      linkBooking = "./assets/pages/booking.html";
      linkAbout = "./assets/pages/about.html";
      linkContact = "./assets/pages/contact.html";
      imgLogo = "./assets/img/color-logo.png";
    }
  } catch (err) {}

  try {
    if (document.getElementById("pages").id == "pages") {
      linkIndex = "../../index.html";
      linkLogin = "../pages/login.html";
      linkBooking = "../pages/booking.html";
      linkAbout = "../pages/about.html";
      linkContact = "../pages/contact.html";
      imgLogo = "../img/color-logo.png";
      linkHome = "../../index.html";
    }
  } catch (err) {}

  document.getElementById("link-home").innerHTML = "Home";
  document.getElementById("link-home").href = linkIndex;

  try {
    document.getElementById("link-login").innerHTML = "Login";
    document.getElementById("link-login").href = linkLogin;
  } catch (err) {}

  document.getElementById("link-booking").innerHTML = "Booking";
  document.getElementById("link-booking").href = linkBooking;

  document.getElementById("link-about").innerHTML = "About";
  document.getElementById("link-about").href = linkAbout;

  document.getElementById("link-contact").innerHTML = "Contact";
  document.getElementById("link-contact").href = linkContact;

  document.getElementById("img-logo").src = imgLogo;
})();

/*==============================================
  → ### FOOTER ### */
(() => {
  document.getElementById("footer-name").innerHTML =
    "&copy; Weck Martins Evaristo Camargo. 2023.";
  document.getElementById("footer-copyright").innerHTML = "All Rights Reserved";
})();

/*
************************************************
### GENERAL - LOGIN ###
************************************************
*/
export let loggedUser = localStorage.getItem("user_id"); //Assigns key to variable

export const getLoggedUser = () => {
  return loggedUser;
};

export const clearLoggerdUser = () => {
  loggedUser = "";
};

/*=============================================
→ ### LOAD CHECKER ### */

const checkLogged = window.addEventListener("load", () => {
  const navbarLogin = document.querySelector("#link-login");
  if (loggedUser) {
    navbarLogin.innerHTML = "Logout";
  } else {
    return;
  }
});

/*
************************************************
### GENERAL - EFFECT ###
************************************************
*/
/*=============================================
→ ### HOME AND ABOUT PAGE - PICTURE EFFECT ### */
try {
  const codingImageEffect = $("#room-picture").fadeTo("slow", 1);
} catch (err) {}

try {
  const roomImageEffect = $("#coding-picture").fadeTo("slow", 1);
} catch (err) {}

/*
************************************************
### GENERAL - SERVER ###
************************************************
*/
/*==============================================
  → ### BASE SERVER ROUTE ### */
const port = 3010;
export const baseUrl = `http://localhost:${port}/`;

/*==============================================
  → ### GET USER ID FROM BROWSER MEMORY ### */
export const getCurrentUser = () => {
  return localStorage.getItem("user_id");
};

/*==============================================
  → ### GET - DATES TO CALENDAR ### */
export const serverGetAvailableDates = async (workspaceId) => {
  return fetch(`${baseUrl}getReservedDate?workspace_id=${workspaceId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Available dates", data);
      return data;
    })
    .catch((error) => console.error(error));
};

/*==============================================
  → ### POST - SELECTED DATES ### */
export const serverPostSelectedDates = async (selectedDates) => {
  console.log("selectedDates Sent", selectedDates);
  console.log('JSON.stringify(selectedDates)',JSON.stringify(selectedDates))
  await fetch(baseUrl + "updateReservedDate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectedDates),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("serverPostSelectedDates data", data);
    })
    .catch((error) => console.error(error));
};

/*==============================================
  → ### POST - NEW PROPERTY ### */
export const serverPostNewProperty = async (postNewProperty) => {
  await fetch(baseUrl + "newProperty", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postNewProperty),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error(error));
};
