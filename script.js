const menuIcon = document.getElementById("menuIcon");

const sideMenu = document.getElementById("sideMenu");

const moon = document.getElementById("moon");

/* OPEN MENU */

menuIcon.onclick = function (event) {

    event.stopPropagation();

    if (sideMenu.style.left === "0px") {

        sideMenu.style.left = "-250px";

    }

    else {

        sideMenu.style.left = "0px";

    }

};

/* CLOSE MENU WHEN CLICKING OUTSIDE */

document.onclick = function (event) {

    if (!sideMenu.contains(event.target) &&
        event.target !== menuIcon) {

        sideMenu.style.left = "-250px";

    }

};

/* LIGHT / DARK MODE */

moon.onclick = function () {

    document.body.classList.toggle("light-mode");

};
