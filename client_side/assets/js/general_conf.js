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

/*==============================================
  → ### BASE SERVER ROUTE ### */
const port = 3010;
export const baseUrl = `http://localhost:${port}/`;
