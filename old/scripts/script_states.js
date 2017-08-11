var helperOpacity = 0.85;
var startElement = null;
var divState = 'state';
var divTaskCol = 'resizable';

function getAvailableStates(currentState) {
    matrixStates = {};
    matrixStates.sortable1 = 'sortable2';
    matrixStates.sortable2 = 'sortable3';
    matrixStates.sortable3 = 'sortable2,sortable4';
    matrixStates.sortable4 = 'sortable3,sortable5';
    matrixStates.sortable5 = 'sortable2';

    result = matrixStates[currentState];

    return result.split(',');
}

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
    //console.log('stopChangeState, ' + linkedID + '.width = ' + width)
    //alert('stopChangeSize');
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