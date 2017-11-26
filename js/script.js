var DELIMITER = '!"№;%:';
var TEMPLATE_STATES = document.querySelector('#template_states').innerHTML;
var TEMPLATE_COLUMN = document.querySelector('#template_column').innerHTML;
var TEMPLATE_ITEM = document.querySelector('#template_item').innerHTML;

// Признак отображения компактного режима
var modeCompact = false;
// Признак возможности редактировать
var readOnly;

// Текущие фильтры
// Работники
var filterEmployeeList = [];
// Приоритеты
var filterPriorityList = [];
// План дата с
var filterPlanDateFrom = '';
// План дата по
var filterPlanDateTo = '';
// Тип элемента
var filterIssueTypeID = -1;
// Спринт
var filterSprintID = -1;
// Проект
var filterProjectID = 0;

// Данные по текущей записи
var sprintID = -1;
var projectID = 0;
var refCode = '';

var prevItemsList;
var items;
var application;

// Подключение к DIRECTUM
try {
    form = window.external.Form;
    if (form === undefined) {
        var obj = CreateObject("SBLogon.LoginPoint");
        application = new ActiveXObject("SBLogon.LoginPoint").GetApplication("ServerName=m-sv-p-sql01;DBName=DIRECTUM_DEV;IsOSAuth=true")
        if (application === undefined) {
            throw 'Не удалось подключиться к DIRECTUM. Обратитесь к администратору.'
        }
        component = application.ReferencesFactory.ReferenceFactory(testRefCode).GetObjectByID(testRecordID);

    } else {
        component = form.View.Component;
    }
    
    refCode = component.Name;
    application = component.Application;
    var componentParamList = component.Params;
    readOnly = componentParamList.FindItem('ReadOnly');

    if (refCode == 'AK_IT_Sprints') {
        projectID = component.Requisites("Ведущая аналитика").ValueID;
        sprintID = component.Requisites("ИД").Value;
    } else {
        if (refCode == 'AK_IT_Projects') {
            projectID = component.Requisites("ИД").Value;
            sprintID = -1;
        }
    }

} catch (err) {
    alert(err);
    readOnly = true;
    throw err;
}

// По умолчанию фильтры равны исходным данным
filterProjectID = projectID;
filterSprintID = sprintID;

//*********** Получить данные JSON и заполнить ими страницу ***********
// Статусы
getStatesData();
// Спринты + Элементы
items = getData(projectID, sprintID, true);
// Реквизиты признаки
getPickRequisitesData();

//************************* Общие функции *****************************
// Поиск элемента в массиве
function findElementInArray(array, element) {
    var result = false;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == element)
            return true;
    }
    return result
}

// Вычленить ИД объекта из ИД элемента
function getIdFromElementId(elementId) {
    var elemArray = elementId.split("-");
    var id = elemArray[elemArray.length - 1];

    return id
}

// Выполнить скрипт
function executeScript(scriptName, projectID, sprintID, itemId, access) {
    var getTextData = application.ScriptFactory.GetObjectByName(scriptName);
    getTextData.Params.Add('ProjectID', projectID);
    getTextData.Params.Add('SprintID', sprintID);
    getTextData.Params.Add('ItemID', itemId);
    getTextData.Params.Add('ReadOnly', readOnly);

    try {
        return getTextData.Execute()
    }
    catch (err) {
        alert(err);
    }
}

//*************** Получение и обработка данных ************************
// Статусы
function getStatesData() {
    try {
        var textData = executeScript('AK_SBGetStatesData', 0, 0, 0, readOnly);
        var states = JSON.parse(textData);
        createStatesCellsAndColumns(states);
        return states
    }
    catch (err) {
        alert(err);
   };
}

// Реквизиты признаки: Приоритеты, Типы элемента
function getPickRequisitesData() {
    try {
        var textData = executeScript('AK_SBGetPickRequisitesData', 0, 0, 0, readOnly);
        var textDataArr = textData.split(DELIMITER);
        // Приоритеты
        var priorities = JSON.parse(textDataArr[0]);
        createSelectOption(priorities, ".select-priority", 'select-priority-option', '', false);
        // Типы ошибок
        var issueTypes = JSON.parse(textDataArr[1]);
        createSelectOption(issueTypes, ".select-issue-type", 'select-issue-type-option', '', true);
    }
    catch (err) {
        alert(err);
    };
}


//*************** Создание объектов ************************************

// Установить режим отображения страницы
function setPageViewMode(mode) {
    alert('setPageViewMode');

    var elements = document.querySelectorAll('.item');
    var element;
    for (var i = 0; i < elements.length; i++) {
        element = elements[i];
        element.disabled = 'disabled'
    }
}



//********************* Обработчики событий формы ************************
function stopChangeSize(event, ui) {
    var divState = 'state';
    var divItemColumn = 'items-column';
    var divItemList = 'items-list';

    var width = ui.size.width;
    var elementID = ui.element.attr("id");

    // Получить ИД статуса - последний блок в ИД элемента
    var id = getIdFromElementId(elementID)

    // Получить ИД связанных документов
    var idItemColumn = '#' + divItemColumn + '-' + id;
    var idItemList = '#' + divItemList + '-' + id;
    var idState = '#' + divState + '-' + id;

    var ind = elementID.toLowerCase().indexOf(divState.toLowerCase());
    var element;
    // Изменить соответствеющие ширину объектов
    if (ind >= 0) {
        // Столбец
        element = $(idItemColumn);
        element.width(width);
    } else {
        // Ячейка статуса
        element = $(idState);
        element.width(width);
    }
    // Контейтер элементов
    element = $(idItemList);
    element.width(width);
}

function stopChangeState(event, ui) {
    // ИД элемента
    var elementID = ui.item.attr("id");
    var itemId = getIdFromElementId(elementID);
    // Определить предыдущий статус
    // ИД предыдущего родителя
    elementID = prevItemsList.id;
    var oldItemStateId = getIdFromElementId(elementID);
    // Определить новый статус
    // ИД предыдущего родителя
    var newItemsList = ui.item[0].parentElement;
    elementID = newItemsList.id;
    var newItemStateId = getIdFromElementId(elementID);

    var getTextData = application.ScriptFactory.GetObjectByName('AK_SBChangeStateItem');
    getTextData.Params.Add('ProjectID', projectID);
    getTextData.Params.Add('SprintID', sprintID);
    getTextData.Params.Add('ItemID', itemId);
    getTextData.Params.Add('OldItemState', oldItemStateId);
    getTextData.Params.Add('NewItemState', newItemStateId);
    getTextData.Params.Add('ReadOnly', readOnly);

    var result;

    try {
        result = getTextData.Execute();
    }
    catch (err) {
        alert(err);
        result = true
    }

    if (result) {
        items = getItemsData(projectID, sprintID, true)
    }
}

window.onscroll = function () {
    var scrolled = window.pageXOffset || document.documentElement.scrollLeft;
    var states = document.querySelector('.states');
    states.style.left = -scrolled + 'px';
}