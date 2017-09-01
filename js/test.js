var isTesting = true;

// Создать или получить подключение к DIRECTUM
var connector = new Connector();
// Поулчить статусы
var stateList = new StateList(connector);
stateList.render();

var itemList = new ItemList(false, connector, false, stateList);
itemList.setItems();
itemList.render();

// Выделить ИД элемента, которому соответствует элемент ДОМ
function getIdByElementId(elementId) {
    var arr = elementId.split("-");
    return arr[arr.length - 1];
}

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
    var elementID = ui.item.attr("id");
    var itemId = getIdByElementId(elementID);
    var item = itemList.getItemById(itemId);

    // Новый статус получить на основе нового родителя для элемента
    var newItemsList = ui.item[0].parentElement;
    var newItemStateId = getIdByElementId(newItemsList.id);

    item.changeState(newItemStateId);

    /*
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
    }*/
}

function startChangeState(event, ui) {
    console.dir(ui);    
    prevItemsList = ui.item[0].parentElement;
}

// Поиск элемента в массиве
function findElementInArray(array, element) {
    var result = false;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == element)
            return true;
    }
    return result
}

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
        //allowClear: true,
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
