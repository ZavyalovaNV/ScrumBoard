var helperOpacity = 0.85;
var startElement = null;
var divState = 'state';
var divTaskCol = 'col-task';



function addNewTask() {
    alert('addNewTask');
}

function refreshTaskList() {
    alert('refreshTaskList');
}

function setFilterTaskList() {
    alert('setFilterTaskList');
}

function openTask() {
    alert('openTask');
}

function stopChangeSize(event, ui) {
    elementID = ui.element.attr('id');
    
    // Если элемент - статус, получить столбец и наоборот
    originalStr = divTaskCol;
    replaceStr = divState;
    ind = elementID.toLowerCase().indexOf(divState.toLowerCase());
    if (ind >= 0) {
        replaceStr = divTaskCol;
        originalStr = divState;
    }

    linkedID = elementID.replace(originalStr, replaceStr);
    elem = $("#" + linkedID);
    width = ui.size.width;
    elem.width(width);
}

function stopChangeState(event, ui) {
    //alert('stopChangeState');
}

function startChangeState(event, ui) {
    startElement = $(this);
    //alert('startChangeState');

    /*parentID = ui.item[0].parentElement.id;
    alert(parentID);

    var availableStates;
    availableStates = getAvailableStates(parentID);
    
    for (var i = 0; i < availableStates.length; i++) {
        elemID = availableStates[i];
        elem = document.getElementById(elemID);        
        elem.style.borderColor = '#d9f4ff';
        elem.style.backgroundColor = '#d9f4ff';
    }*/
}

function showFilterMenu() {
    elemID = "filter-submenu";
    elem = document.getElementById(elemID);
    display = elem.style.display;
    if (display == 'none') {
        display = 'block'
    } else {
        display = 'none'
    }
    elem.style.display = display;
}

function hideElemens(className, display) {
    elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
        elem = elements[i];
        elem.style.display = display;
    };
}

function setCompactMode() {
    display = 'none';
    hideElemens("task-executor", display);
    hideElemens("task-status", display);
    hideElemens("task-ind", display);
}

function setFullMode() {
    display = 'block';
    hideElemens("task-executor", display);
    hideElemens("task-status", display);
    hideElemens("task-ind", display);
}