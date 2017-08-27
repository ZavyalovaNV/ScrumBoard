//var TEMPLATE_STATES = document.querySelector('#template_states').innerHTML;
//var TEMPLATE_COLUMN = document.querySelector('#template_column').innerHTML;
//var TEMPLATE_ITEM = document.querySelector('#template_item').innerHTML;

// Признак отображения компактного режима
var modeCompact = false;
// Признак возможности редактировать
var readOnly = true;

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


var itemList = new ItemList(modeCompact);
itemList.renderStates();
itemList.createItems();
itemList.renderItems();

// Функции для работы с датами
function parseDate(valueStr) {
    var value = '';
    if (valueStr != "") {
        // Попробовать распарсить строку на случай, если данные сразу пришли в готово виде
        var date = Date.parse(valueStr);
        // Если не удалось, попробовать через точки
        if (isNaN(date)) {
            var split = valueStr.split(".");
            value = new Date(split[2], split[1] - 1, split[0]);
        }
    }
    return value;
}

function dateToStr(date) {
    var options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };

    return date.toLocaleString("ru", options);
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

function startChangeState(event, ui) {
    console.dir(ui);
    if (readOnly) {

    }
    prevItemsList = ui.item[0].parentElement;
}

//// Данные по текущей записи
//var sprintID = testSprintID;
//var projectID = testProjectID;
//var refCode = testRefCode;

//var prevItemsList;
//var items;
//var application;


//readOnly = false;

//// По умолчанию фильтры равны исходным данным
//filterProjectID = projectID;
//filterSprintID = sprintID;

////*********** Получить данные JSON и заполнить ими страницу ***********
//// Статусы
//getStatesData();
//// Спринты + Элементы
//items = getData(projectID, sprintID, true);
//// Реквизиты признаки
//getPickRequisitesData();

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

//// Вычленить ИД объекта из ИД элемента
//function getIdFromElementId(elementId) {
//    var elemArray = elementId.split("-");
//    var id = elemArray[elemArray.length - 1];

//    return id
//}

//// Выполнить скрипт
//function executeScript(scriptName, projectID, sprintID, itemId, access) {
//    var getTextData = application.ScriptFactory.GetObjectByName(scriptName);
//    getTextData.Params.Add('ProjectID', projectID);
//    getTextData.Params.Add('SprintID', sprintID);
//    getTextData.Params.Add('ItemID', itemId);
//    getTextData.Params.Add('ReadOnly', readOnly);

//    try {
//        return getTextData.Execute()
//    }
//    catch (err) {
//        alert(err);
//    }
//}

////*************** Получение и обработка данных ************************
//// Статусы
//function getStatesData() {
//    try {
//        var textData = executeScript('AK_SBGetStatesData', 0, 0, 0, readOnly);
//        var states = JSON.parse(textData);
//    }
//    catch (err) {
//        //alert(err);
//        states = states_test
//    };

//    if (states !== undefined) {
//        createStatesCellsAndColumns(states);
//        return states
//    }
//}

//// Реквизиты признаки: Приоритеты, Типы элемента
//function getPickRequisitesData() {
//    try {
//        var textData = executeScript('AK_SBGetPickRequisitesData', 0, 0, 0, readOnly);
//        var textDataArr = textData.split(DELIMITER);
//        // Приоритеты
//        var priorities = JSON.parse(textDataArr[0]);
//        createSelectOption(priorities, ".select-priority", 'select-priority-option', '', false);
//        // Типы ошибок
//        var issueTypes = JSON.parse(textDataArr[1]);
//        createSelectOption(issueTypes, ".select-issue-type", 'select-issue-type-option', '', true);
//    }
//    catch (err) {
//        alert(err);
//    };
//}

//// Элементы (данные получаются на основе проекта и спринта)
//function getItemsData(projectID, sprintID, refreshEployeeList) {
//    try {
//        var textData = executeScript('AK_SBGetItemsData', projectID, sprintID, 0, readOnly);
//        var items = JSON.parse(textData);
//        createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
//        if (refreshEployeeList) {
//            createEmployeeList(items);
//        }
//        return items
//    }
//    catch (err) {
//        alert(err);
//    };
//}

//// Спринты (данные получаются на основе проекта с ограничением по спринту)
//function getSprintesData(projectID, sprintID) {
//    try {
//        var textData = executeScript('AK_SBGetSprintesData', projectID, sprintID, 0, readOnly);
//        var sprintes = JSON.parse(textData);
//        createSelectOption(sprintes, ".select-sprint", 'select-sprint-option', filterSprintID, true);
//        return sprintes
//    }
//    catch (err) {
//        alert(err);
//    };
//}

//// Элементы (данные получаются на основе проекта и спринта) и спринты
//function getData(projectID, sprintID, refreshEployeeList) {
//    getSprintesData(projectID, sprintID);
//    return items = getItemsData(projectID, sprintID, refreshEployeeList)
//}

////*************** Создание объектов ************************************

//// Установить режим отображения страницы
//function setPageViewMode(mode) {
//    var elements = document.querySelectorAll('.item');
//    var element;
//    for (var i = 0; i < elements.length; i++) {
//        element = elements[i];
//        element.disabled = 'disabled'
//    }
//}

//// Создание ячейки статуса
//function createStateElement(data) {
//    var className = "state";

//    var element = document.createElement('div');
//    // Задать ИД
//    element.id = className + "-" + data.id;
//    // Задать классы
//    element.classList.add(className);
//    element.classList.add("ui-resizable");
//    // Сформировать строку внутри объекта
//    var text = TEMPLATE_STATES.replace("<idName>", data.name);
//    element.innerHTML = text;

//    return element;
//}

//// Задать допустимые переходы
//function createStatesTransmissions(states) {
//    states.forEach(function (state) {
//        var divId = "#items-list-";

//        var element = $(divId + state.id);
//        var availableStates = state.availableStates;
//        var availableStatesStr = "";

//        availableStates.forEach(function (availableStateId) {
//            if (availableStatesStr == "") {
//                availableStatesStr = divId + availableStateId
//            } else {
//                availableStatesStr = availableStatesStr + "," + divId + availableStateId
//            }
//        })
//        element.sortable({ connectWith: availableStatesStr });
//    });
//}

//// Задать доступные фильтры для стандадартных данных ИД - Наименование
//function createSelectOption(options, containerId, optionClass, selectedValue, addAll) {
//    var container = document.querySelector(containerId);
//    var multiple = container.getAttribute('multiple');
//    container.innerHTML = "";

//    var selected = false;
//    var optionList = new Map();

//    // Для немножественного выбора добавить пункт "Все"
//    addAll = addAll && multiple != 'multiple';

//    if (addAll) {
//        var optionId = -1;
//        var optionName = 'Все';
//        optionList.set(optionId, optionName);

//        var allOption = document.createElement("option");
//        allOption.classList.add(optionClass);

//        allOption.value = optionId;
//        allOption.innerHTML = optionName;

//        container.appendChild(allOption);
//    }

//    options.forEach(function (option) {
//        var optionId = option.id;

//        if (optionId != '') {
//            if (!optionList.has(optionId)) {
//                var optionName = option.name;
//                optionList.set(optionId, optionName);

//                var option = document.createElement("option");
//                option.classList.add(optionClass);
//                option.value = optionId;
//                option.innerHTML = optionName;

//                // Установить признак выбора
//                if (selectedValue == optionId) {
//                    option.setAttribute("selected", "selected");
//                    selected = true;
//                }

//                container.appendChild(option);
//            }
//        }
//    })

//    if (!selected) {
//        if (addAll) {
//            allOption.setAttribute("selected", "selected");
//        } else {
//            container.value = ''
//        }
//    }
//}

//function setColumnElementData(data, element, readOnly) {
//    var itemList = element.querySelector('.items-list');
//    itemList.id = "items-list-" + data.id;

//    if (!readOnly) {
//        itemList.classList.add('ui-sortable');
//    }

//    return element;
//}

//// Создание столбца
//function createColumnElement(data, readOnly) {
//    var className = 'items-column';

//    var element = document.createElement('div');
//    // Задать ИД
//    element.id = className + "-" + data.id;
//    // Задать классы
//    element.classList.add(className);
//    element.classList.add("ui-resizable");
//    // Задать события
//    element.addEventListener('dblclick', addNewItem)
//    element.addEventListener('dblclick', addNewItem)
//    // Сформировать строку внутри объекта
//    element.innerHTML = TEMPLATE_COLUMN;

//    element = setColumnElementData(data, element, readOnly);

//    return element;
//}

//// Установить режим отображения элемента
//function setItemViewMode(modeCompact, element) {
//    var elementData = element.querySelector('.item-data');
//    var elementInd = element.querySelector('.item-ind');
//    var elementCompactExecutor = element.querySelector('.item-executor-compact');
//    if (modeCompact) {
//        elementData.classList.add('hidden');
//        elementInd.classList.add('hidden');
//        elementCompactExecutor.classList.remove('hidden');
//    } else {
//        elementData.classList.remove('hidden');
//        elementInd.classList.remove('hidden');
//        elementCompactExecutor.classList.add('hidden');
//    }
//}

//// Заполнение данных элемента
//function setItemData(data, element) {
//    // Установить заголовок элемента
//    var textElement = element.querySelector(".item-text");
//    textElement.innerHTML = data.text;
//    // Установить исполнителя
//    // В полном режиме
//    var executorElement = element.querySelector(".item-executor-img");
//    executorElement.setAttribute("src", "css\\img\\avatars\\" + data.executorPhoto);
//    executorElement.setAttribute("title", data.executorName);
//    // В компактном режиме
//    var executorCompactElement = element.querySelector('.item-executor-img-compact');
//    executorCompactElement.setAttribute("src", "css\\img\\user.svg");
//    executorCompactElement.setAttribute("title", data.executorName);
//    var executorCompactElementName = element.querySelector('.item-executor-compact span');
//    executorCompactElementName.innerHTML = data.executorName;
//    // Установить приоритет
//    var priorityElement = element.querySelector(".item-priority");
//    priorityElement.innerHTML = data.priority;
//    // Установить плановую дату
//    var planDateElement = element.querySelector(".item-plan-date");
//    planDateElement.innerHTML = data.planDate;
//    // Установить плановые трудозатраты
//    var planHoursElement = element.querySelector(".item-plan-hours");
//    if (data.planHours != '' && data.planHours != undefined) {
//        planHoursElement.innerHTML = '<img src="css/img/clock.svg" width="12px" height="12px"/>' + data.planHours + ' ч.';
//    } else {
//        planHoursElement.innerHTML = '';
//    }
//    // Установить номер
//    var numberElement = element.querySelector(".item-number");
//    numberElement.innerHTML = data.number;

//    // Настройки классов
//    // Установить тип элемента
//    element.classList.remove('defect');
//    element.classList.remove('wish');
//    if (data.issueTypeId == '1') {
//        element.classList.add('defect');
//    };
//    if (data.issueTypeId == '2') {
//        element.classList.add('wish');
//    };

//    // Компактный режим. Определить видимые области
//    setItemViewMode(modeCompact, element);

//    return element;
//}

//// Создание элемента
//function createItemElement(data) {
//    var className = "item";

//    var element = document.createElement('div');
//    // Задать ИД
//    element.id = className + "-" + data.id;
//    // Задать классы
//    element.classList.add(className);
//    element.innerHTML = TEMPLATE_ITEM;
//    // Задать обработчики события
//    element.addEventListener('click', openItem)

//    element = setItemData(data, element);

//    return element;
//}

//// Обновление элемента
//function updateItemElement(data, elementId) {
//    var element = document.getElementById(elementId);
//    element = setItemData(data, element)
//    return element
//}

//// Создать блоки и столбцы по каждому статусу
//function createStatesCellsAndColumns(states) {
//    var containerStates = document.querySelector(".states");
//    var containerColumns = document.querySelector(".items-row");
//    states.forEach(function (state) {
//        // Ячейка статуса
//        var stateElement = createStateElement(state);
//        containerStates.appendChild(stateElement);
//        // Столбец статуса
//        var columnElement = createColumnElement(state, readOnly);
//        containerColumns.appendChild(columnElement);
//    }
//    );
//    // Создать доступные переходы по статусам
//    createStatesTransmissions(states);
//}

//// Создать элементы
//function createItems(items, filterProject, filterSprint, filterEmployee, filterPriority, filterPlanDateFrom, filterPlanDateTo, filterIssueType) {
//    // Очистить все контейнеры по статусам
//    var elements = document.querySelectorAll('.items-list');
//    var element;
//    for (var i = 0; i < elements.length; i++) {
//        element = elements[i];
//        element.innerHTML = ""
//    }

//    //alert(filterProject + ', ' + filterSprint + ', ' + filterEmployee + ', ' + filterPriority + ', ' + filterPlanDateFrom + ', ' + filterPlanDateTo)
//    // Список уже очищенных контейнеров для элементов, чтобы повторно не очищать
//    var cleanedContainers = new Map;

//    // Фильтровать по работникам, выбрано хоть какое-то значение
//    var toFilterByEmployee = (filterEmployee.length > 0);
//    // Фильтровать по приоритетам, выбрано хоть какое-то значение
//    var toFilterByPriority = (filterPriority.length > 0);
//    // Фильтровать по проекту, если задан проект
//    var toFilterByProject = (filterProject > 0)
//    // Фильтровать по спринту, если выбран спринт или Нераспределенные. 
//    // У элементов без спринта, его ид = 0, поэтому фильтр по нераспределенным - это фильтр по 0
//    // -1 = Все записи
//    var toFilterBySprint = (filterSprint > -1);
//    // Фильтровать по типу элемента
//    var toFilterByIssueType = (filterIssueType > -1);
//    // Фильтровать по план дате с, если указано
//    var toFilterByPlanDateFrom = filterPlanDateFrom != '';
//    // Фильтровать по план дате по, если указано
//    var toFilterByPlanDateTo = filterPlanDateTo != '';

//    items.forEach(function (item) {
//        // 1 часть условия: проверка должна быть + проверка прошла
//        // или
//        // 2 часть условия: проверки не должно быть

//        // Фильтр по проекту
//        var add = (toFilterByProject && (item.project == filterProject)) || (!toFilterByProject);
//        if (add) {
//            // Фильтр по спринту
//            add = (toFilterBySprint && (item.sprint == filterSprint)) || (!toFilterBySprint);
//            if (add) {
//                // Фильтра по работникам
//                add = (toFilterByEmployee && findElementInArray(filterEmployee, item.executorId)) || (!toFilterByEmployee);
//                if (add) {
//                    // Фильтр по приоритетам
//                    add = (toFilterByPriority && findElementInArray(filterPriority, item.priorityId)) || (!toFilterByPriority);
//                    if (add) {
//                        add = (toFilterByIssueType && (item.issueTypeId == filterIssueType)) || (!toFilterByIssueType);
//                        // Фильтр по план. дате
//                        if (add) {
//                            add = (toFilterByPlanDateFrom && (item.planDate >= filterPlanDateFrom)) || (!toFilterByPlanDateFrom);
//                            if (add) {
//                                add = (toFilterByPlanDateTo && (item.planDate <= filterPlanDateTo)) || (!toFilterByPlanDateTo)
//                            }
//                        }
//                    }
//                }
//            }
//        }

//        if (add) {
//            var containerId = "#items-list-" + item.stateId;
//            var container = document.querySelector(containerId);

//            var itemElement = createItemElement(item);
//            container.appendChild(itemElement);
//        }
//    }
//    );
//}

//// Задать доступных работников
//function createEmployeeList(items) {
//    var container = document.querySelector(".select-employee");
//    container.innerHTML = "";

//    var employeeList = new Map();

//    items.forEach(function (item) {
//        var employeeId = item.executorId;

//        if ((employeeId != 0) && (employeeId != '')) {
//            if (!employeeList.has(employeeId)) {
//                var employeeName = item.executorName;
//                employeeList.set(employeeId, employeeName);

//                var element = document.createElement("option");
//                element.classList.add('select-employee-option');
//                element.value = employeeId;
//                element.innerHTML = employeeName;
//                container.appendChild(element)
//            }
//        }
//    })
//}

////******************** Фильтры *****************************************
//// Заполнить фильтр по работникам
//function setFilterItemListByEmployee() {
//    filterEmployeeList = $(".select-employee").val();
//    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
//}

//// Заполнить фильтр по приоритетам
//function setFilterItemListByPriority() {
//    filterPriorityList = $(".select-priority").val();
//    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
//}

//// Заполнить фильтр по дате
//function setFilterItemListByDateFrom() {
//    var container = document.querySelector("#plan-date-from");
//    filterPlanDateFrom = container.value;
//    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
//}

//// Заполнить фильтр по дате
//function setFilterItemListByDateTo() {
//    var container = document.querySelector("#plan-date-to");
//    filterPlanDateTo = container.value;
//    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
//}

//// Фильтр по спринту
//function setFilterItemListBySprint() {
//    filterSprintID = $(".select-sprint").val();
//    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
//}

//// Фильтр по приоритету
//function setFilterItemListByIssueType() {
//    filterIssueTypeID = $(".select-issue-type").val();
//    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
//}

//********************* Обработчики событий формы ************************
function stopChangeSize(event, ui) {
    var divState = 'state';
    var divItemColumn = 'items-column';
    var divItemList = 'items-list';

    var width = ui.size.width;
    var elementID = ui.element.attr("id");

    // Получить ИД статуса - последний блок в ИД элемента
    var elemArray = elementID.split("-");
    var id = elemArray[elemArray.length - 1];
    
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

//// Сменить отображение элеметов
//function changeItemMode(mode) {
//    modeCompact = mode;

//    var elements = document.querySelectorAll('.item');
//    var element;
//    for (var i = 0; i < elements.length; i++) {
//        element = elements[i];
//        setItemViewMode(mode, element);
//    }
//}


////******************* Обработчики событий действий с элементами *******
//// Добавить новый элемент (по отфильтрованным данным)
//function addNewItem() {
//    var result = executeScript('AK_SBCreateItem', filterProjectID, filterSprintID, 0, readOnly);
//    if (result) {
//        items = getData(projectID, sprintID, true);
//    }
//};

//// Удалить элемент
//function deleteItem() {
//    var item = event.currentTarget.parentElement;

//    var itemId = getIdFromElementId(item.id);
//    var result = executeScript('AK_SBDeleteItem', projectID, sprintID, itemId, readOnly);
//    if (result) {
//        items = getItemsData(projectID, sprintID, true);
//    }
//    // Остановить всплытие
//    event.stopPropagation()
//};

//// Открыть элемент
//function openItem() {
//    var itemId = getIdFromElementId(this.id);

//    var result = executeScript('AK_SBOpenItem', projectID, sprintID, itemId, readOnly);
//    if (result) {
//        items = getData(projectID, sprintID, true);
//    }
//};

//// Обновить список элементов
//function refreshItemList() {
//    items = getData(projectID, sprintID, true);
//}

//// Обновить один элемент
//function refreshItem(elementId) {
//    var itemId = getIdFromElementId(elementId);
//    try {
//        var textData = executeScript('AK_SBRefreshItem', projectID, sprintID, itemId, readOnly);
//        var item = JSON.parse(textData);
//        element = updateItemElement(item[0], elementId)
//    }
//    catch (err) {
//        alert(err);
//    };
//}

//// Изменить исполнителя
//function changeExecutor() {
//    var itemClassName = 'item';

//    // Определить самый верхний элемент, чтобы получить ИД записи
//    var element = event.currentTarget;
//    var classList = element.classList;
//    var toContunue = classList.contains(itemClassName);

//    while (!toContunue) {
//        element = element.parentElement;
//        classList = element.classList;
//        toContunue = classList.contains(itemClassName);
//    }

//    var elementId = element.id;
//    var itemId = getIdFromElementId(elementId);

//    try {
//        var result = executeScript('AK_SBChangeExecutorItem', projectID, sprintID, itemId, readOnly);
//    }
//    catch (err) {
//        var result = false;
//        alert(err);
//    }

//    if (result) {
//        refreshItem(elementId)
//    }

//    // Остановить всплытие
//    event.stopPropagation()
//}

//window.onscroll = function () {
//    var scrolled = window.pageXOffset || document.documentElement.scrollLeft;
//    var states = document.querySelector('.states');
//    states.style.left = -scrolled + 'px';
//}



$(init);
function init() {
    $(".select-priority").select2({
        placeholder: "Выберите...",
        data: priorities_test
    });
    $(".select-employee").select2({
        placeholder: "Выберите...",
        data: itemList.employeeList.data
    });
    $(".select-sprint").select2({
        placeholder: "Выберите..."
    });
    $(".select-issue-type").select2({
        placeholder: "Выберите...",
        allowClear: true,
        data: issueTypes_test
    });
    $(".select-sort").select2({
        allowClear: true,
        data: sort_test
    });

    elemID = "filter-submenuID";
    elem = document.getElementById(elemID);
    if (elem != undefined) {
        elem.style.display = "none";
    }

    $(".ui-sortable").sortable(
        {
            delay: 10,
            opacity: 0.85,
            stop: stopChangeState,
            forcePlaceholderSize: true,
            start: startChangeState,
            placeholder: "item-placeholder",
            forcePlaceholderSize: true
        });

    $(".ui-resizable").resizable(
        {
            autoHide: true,
            handles: "e",
            resize: stopChangeSize
        }
    );

    $(".datepicker").datepicker({
        gotoCurrent: true,
        dateFormat: "dd.mm.yy",
        dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        firstDay: 1,
        monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        autosize: true
    });
};