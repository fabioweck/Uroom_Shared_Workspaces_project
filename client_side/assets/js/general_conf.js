/*
************************************************
### GENERAL - LOGIN ###
************************************************
*/
export let loggedUser = localStorage.getItem("user_id"); //Assigns key to variable
let userName = localStorage.getItem("user_name");

export const getLoggedUser = () => {
  return loggedUser;
};

export const clearLoggerdUser = () => {
  loggedUser = "";
};

/*
************************************************
### GENERAL - NAV BAR AND FOOTER ###
************************************************
*/

/*==============================================
→ ### CLICKABLE ICON TO HOME PAGE ### */

const iconClick = document.querySelector('#img-logo').addEventListener('click', (error)=>{

  if(location.pathname == "/client_side/index.html")
  {
    window.location.href = "./index.html";
  }
  else{
    window.location.href = "../../index.html";
  }
})

const iconMobileClick = document.querySelector('.menu-logo-mobile').addEventListener('click', (error)=>{

  if(location.pathname == "/client_side/index.html")
  {
    window.location.href = "./index.html";
  }
  else{
    window.location.href = "../../index.html";
  }
})


/*==============================================
→ ### DISPLAY USER NAME ON NAVBAR ### */

let greeting = document.querySelector("#greeting");
try {
  if (!userName) {
    greeting.style.display = "none";
  } else {
    
    let nameCapitalized = userName.charAt(0).toUpperCase() + userName.slice(1);
    let index = nameCapitalized.indexOf(" ");
    let firstName = nameCapitalized.slice(0, index);
    greeting.innerHTML = `Hello ${firstName}!`;
  }
}catch(err){};


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

  let linkLogin;
  let linkBooking;
  let linkAbout;
  let linkContact;
  let imgLogo;

  try {
    if (document.getElementById("index").id == "index") {

      linkLogin = "./assets/pages/login.html";
      linkBooking = "./assets/pages/booking.html";
      linkAbout = "./assets/pages/about.html";
      linkContact = "./assets/pages/contact.html";
      imgLogo = "./assets/img/color-logo.png";
    }
  } catch (err) {}

  try {
    if (document.getElementById("pages").id == "pages") {

      linkLogin = "../pages/login.html";
      linkBooking = "../pages/booking.html";
      linkAbout = "../pages/about.html";
      linkContact = "../pages/contact.html";
      imgLogo = "../img/color-logo.png";
      linkHome = "../../index.html";
    }
  } catch (err) {}

  try {
    if (loggedUser) {
      document.getElementById("link-login").innerHTML = "Logout";
    } else {
      document.getElementById("link-login").innerHTML = "Login";
    }
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
    "&copy; Group 5 - Fabio, Hugo, Leandro, Uyara - 2023";
  document.getElementById("footer-copyright").innerHTML = "All Rights Reserved";
})();

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

/*=============================================
→ ### GET - ALL PROPERTIES AND WORKSPACE DATA FROM SERVER (USER PAGE) ### */
export const serverGetWorkspace = async () => {
  try {
    const response = await fetch(baseUrl + "getWorkspaceByOwner");
    const data = await response.json();
    data.forEach((obj) => delete obj.user_id);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/*=============================================
→ ### GET - PROPERTIES AND WORKSPACE DATA FROM SERVER (OWNER PAGE) ### */
export const serverGetWorkspaceByOwner = async () => {
  try {
    const user_id = getCurrentUser();
    const response = await fetch(
      baseUrl + "getWorkspaceByOwner?user_id=" + user_id
    );
    const data = await response.json();
    data.forEach((obj) => delete obj.user_id);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/*==============================================
  → ### GET - DATES TO CALENDAR ### */
export const serverGetUnavailableDates = async (workspaceId) => {
  try {
    const response = await fetch(
      `${baseUrl}getReservedDate?workspace_id=${workspaceId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/*==============================================
  → ### POST - SELECTED DATES ### */
export const serverPostSelectedDates = async (selectedDates) => {
  try {
    const response = await fetch(baseUrl + "updateReservedDate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedDates),
    });
    const data = await response.json();
    return data.statusCode;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/*==============================================
  → ### POST - NEW PROPERTY ### */
export const serverPostNewProperty = async (postNewProperty) => {
  try {
    const response = await fetch(baseUrl + "newProperty", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postNewProperty),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/*==============================================
  → ### POST - UPDATE PROPERTY ### */
  export const serverPostUpdateProperty = async (postProperty) => {
    try {
      const response = await fetch(baseUrl + "updateProperty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postProperty),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

/*==============================================
  → ### POST - NEW WORKSPACE ### */
export const serverPostNewWorkspace = async (postNewWorkspace) => {
  try {
    const response = await fetch(baseUrl + "newWorkspace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postNewWorkspace),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/*==============================================
  → ### POST - UPDATE WORKSPACE ### */
  export const serverPostUpdateWorkspace = async (postWorkspace) => {
    try {
      const response = await fetch(baseUrl + "updateWorkspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postWorkspace),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };


/*==============================================
  → ### POST - DELIST PROPERTY ### */
export const delistProperty = async (property) => {
  const property_id = property;
  const user_id = getCurrentUser();
  try {
    const response = await fetch(
      `${baseUrl}delistProperty?user_id=${user_id}&property_id=${property_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    location.reload();
    return data;
  } catch (error) {
    console.error(error);
    location.reload();
    return null;
  }
};

/*==============================================
  → ### POST - DELIST WORKSPACE ### */
export const delistWorkspace = async (workspace) => {
  const workspace_id = workspace;
  const user_id = getCurrentUser();
  try {
    const response = await fetch(
      `${baseUrl}delistWorkspace?user_id=${user_id}&workspace_id=${workspace_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    location.reload();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/*==============================================
  → ### SHOW IN QA TEST ### */
  export const showQaTest = 0;