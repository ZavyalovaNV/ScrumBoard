var isTesting = true;

// ������� ��� �������� ����������� � DIRECTUM
var connector = new Connector();
// �������� �������
var stateList = new StateList(connector);
stateList.render();

var itemList = new ItemList(false, connector, false, stateList);
itemList.setItems();
itemList.render();

// �������� �� ��������, �������� ������������� ������� ���
function getIdByElementId(elementId) {
    var arr = elementId.split("-");
    return arr[arr.length - 1];
}

// ������� ��� ������ � ������
function parseDate(valueStr) {
    var value = '';
    if (valueStr != "") {
        // ����������� ���������� ������ �� ������, ���� ������ ����� ������ � ������ ����
        var date = Date.parse(valueStr);
        // ���� �� �������, ����������� ����� �����
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

    // ����� ������ �������� �� ������ ������ �������� ��� ��������
    var newItemsList = ui.item[0].parentElement;
    var newItemStateId = getIdByElementId(newItemsList.id);

    item.changeState(newItemStateId);
}

function startChangeState(event, ui) {
    console.dir(ui);
    prevItemsList = ui.item[0].parentElement;
}

// ����� �������� � �������
function findElementInArray(array, element) {
    var result = false;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == element)
            return true;
    }
    return result
}

//********************* ����������� ������� ����� ************************
function stopChangeSize(event, ui) {
    var divState = 'state';
    var divItemColumn = 'items-column';
    var divItemList = 'items-list';

    var width = ui.size.width;
    var elementID = ui.element.attr("id");

    // �������� �� ������� - ��������� ���� � �� ��������
    var elemArray = elementID.split("-");
    var id = elemArray[elemArray.length - 1];

    // �������� �� ��������� ����������
    var idItemColumn = '#' + divItemColumn + '-' + id;
    var idItemList = '#' + divItemList + '-' + id;
    var idState = '#' + divState + '-' + id;

    var ind = elementID.toLowerCase().indexOf(divState.toLowerCase());
    var element;
    // �������� ��������������� ������ ��������
    if (ind >= 0) {
        // �������
        element = $(idItemColumn);
        element.width(width);
    } else {
        // ������ �������
        element = $(idState);
        element.width(width);
    }
    // ��������� ���������
    element = $(idItemList);
    element.width(width);
}

window.onscroll = function () {
    var scrolled = window.pageXOffset || document.documentElement.scrollLeft;
    var states = document.querySelector('.states');
    states.style.left = -scrolled + 'px';
}


$(init);
function init() {
    $(".select-priority").select2({
        placeholder: "��������...",
        data: priorities_test
    });
    $(".select-employee").select2({
        placeholder: "��������...",
        data: itemList.employeeList.data
    });
    $(".select-sprint").select2({
        placeholder: "��������..."
    });
    $(".select-issue-type").select2({
        placeholder: "��������...",
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
        dayNames: ["�����������", "�����������", "�������", "�����", "�������", "�������", "�������"],
        dayNamesMin: ["��", "��", "��", "��", "��", "��", "��"],
        firstDay: 1,
        monthNames: ["������", "�������", "����", "������", "���", "����", "����", "������", "��������", "�������", "������", "�������"],
        monthNamesShort: ["���", "���", "���", "���", "���", "���", "���", "���", "���", "���", "���", "���"],
        autosize: true
    });
};
