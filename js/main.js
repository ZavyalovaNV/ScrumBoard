//isTesting = false;
//console.log(isTesting);

// Создать или получить подключение к DIRECTUM
var connector = new Connector();

// Получить признаки:
// Приоритеты. Получить информацию и отобразить 
var prioriryList = new PickList("AK_SBGetPickRequisitesData", 'AK_PrioritySign', true);
prioriryList.refresh({ projectId: connector.projectId, sprintId: connector.sprintId }, ".select-priority", 'select-pick-option');

// Типы. Получить информацию и отобразить
var issueTypesList = new PickList("AK_SBGetPickRequisitesData", 'AK_IT_IssueType', false);
issueTypesList.refresh({ projectId: connector.projectId, sprintId: connector.sprintId }, ".select-issue-type", 'select-pick-option');

// Спринты. Получить информацию и отобразить
var sprintList = new SprintList(connector);
sprintList.refresh({ projectId: connector.projectId, sprintId: connector.sprintId }, "#select-sprint", 'select-pick-option');

// Получить статусы
var stateList = new StateList(connector);
stateList.refresh();

// Получить элементы
var itemList = new ItemList(false, connector, stateList);
itemList.refresh();

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

    var result = item.changeState(newItemStateId);
    // Отменить перемещение
    if (!result) {
        $(".ui-sortable").sortable("cancel");
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

// Синхронизировать заголовки
window.onscroll = function () {
    var scrolled = window.pageXOffset || document.documentElement.scrollLeft;
    var states = document.querySelector('.states');
    states.style.left = -scrolled + 'px';
}

// Скрывать меню при клике где-либо
var elementList = [document.getElementById("item-row"), document.getElementById("states")]
for (var i = 0; i < elementList.length; i++) {
    var element = elementList[i];
    element.onclick = function () {
        hideFilterMenu();
    }
}

$(init);
function init() {
    $(".select-priority").select2({
        placeholder: "Выберите..."
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
        allowClear: true
    });
    $(".select-sort").select2({
        data: [
            { "id": "priorityId", "text": "Приоритет" },
            { "id": "number", "text": "Номер" },
            { "id": "regDate", "text": "Дата регистрации" }
        ]
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
