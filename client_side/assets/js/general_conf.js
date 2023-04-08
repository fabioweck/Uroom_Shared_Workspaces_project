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
}

/*==============================================
→ ### NAV LINKS ### */
(() => {
  let linkIndex = "./index.html";
  let linkLogin = "./assets/pages/login.html";
  let linkBooking = "./assets/pages/booking.html";
  let linkAbout = "./assets/pages/about.html";
  let linkContact = "./assets/pages/contact.html";
  let imgLogo = "./assets/img/color-logo.png";
  //const websiteName = "website name";

  try {
    if (document.getElementById("pages").id == "pages") {
      linkIndex = "../../index.html";
      linkLogin = "../pages/login.html";
      linkBooking = "../pages/booking.html";
      linkAbout = "../pages/about.html";
      linkHome = "../../index.html";
      linkContact = "../pages/contact.html";
      imgLogo = "../img/color-logo.png";
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

  //document.getElementById("website-name").innerHTML = websiteName;
})();

/*==============================================
  → ### FOOTER ### */
(() => {
  document.getElementById("footer-name").innerHTML =
    "&copy; Weck Martins Evaristo Camargo. 2023.";
  document.getElementById("footer-copyright").innerHTML = "All Rights Reserved";
})();
