function showFilterMenu() {
    var elementID = "filter-submenuID";
    var element = document.getElementById(elementID);
    var display = element.style.display;

    if (display == 'none') {
        display = 'block'
    } else {
        display = 'none'
    }
    element.style.display = display;
}

function hideFilterMenu() {
    var elementID = "filter-submenuID";
    var element = document.getElementById(elementID);
    element.style.display = 'none';
}