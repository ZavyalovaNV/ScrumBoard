
ItemList = function () {

}



// �������� ������ �������
function createStateElement(data) {
    var className = "state";

    var element = document.createElement('div');
    // ������ ��
    element.id = className + "-" + data.id;
    // ������ ������
    element.classList.add(className);
    element.classList.add("ui-resizable");
    // ������������ ������ ������ �������
    var text = TEMPLATE_STATES.replace("<idName>", data.name);
    element.innerHTML = text;

    return element;
}

// ������ ���������� ��������
function createStatesTransmissions(states) {
    states.forEach(function (state) {
        var divId = "#items-list-";

        var element = $(divId + state.id);
        var availableStates = state.availableStates;
        var availableStatesStr = "";

        availableStates.forEach(function (availableStateId) {
            if (availableStatesStr == "") {
                availableStatesStr = divId + availableStateId
            } else {
                availableStatesStr = availableStatesStr + "," + divId + availableStateId
            }
        })
        element.sortable({ connectWith: availableStatesStr });
    });
}

// ������ ��������� ������� ��� ������������� ������ �� - ������������
function createSelectOption(options, containerId, optionClass, selectedValue, addAll) {
    var container = document.querySelector(containerId);
    var multiple = container.getAttribute('multiple');
    container.innerHTML = "";

    var selected = false;
    var optionList = new Map();

    // ��� ���������������� ������ �������� ����� "���"
    addAll = addAll && multiple != 'multiple';

    if (addAll) {
        var optionId = -1;
        var optionName = '���';
        optionList.set(optionId, optionName);

        var allOption = document.createElement("option");
        allOption.classList.add(optionClass);

        allOption.value = optionId;
        allOption.innerHTML = optionName;

        container.appendChild(allOption);
    }

    options.forEach(function (option) {
        var optionId = option.id;

        if (optionId != '') {
            if (!optionList.has(optionId)) {
                var optionName = option.name;
                optionList.set(optionId, optionName);

                var option = document.createElement("option");
                option.classList.add(optionClass);
                option.value = optionId;
                option.innerHTML = optionName;

                // ���������� ������� ������
                if (selectedValue == optionId) {
                    option.setAttribute("selected", "selected");
                    selected = true;
                }

                container.appendChild(option);
            }
        }
    })

    if (!selected) {
        if (addAll) {
            allOption.setAttribute("selected", "selected");
        } else {
            container.value = ''
        }
    }
}

function setColumnElementData(data, element, readOnly) {
    var itemList = element.querySelector('.items-list');
    itemList.id = "items-list-" + data.id;

    if (!readOnly) {
        itemList.classList.add('ui-sortable');
    }

    return element;
}

// �������� �������
function createColumnElement(data, readOnly) {
    var className = 'items-column';

    var element = document.createElement('div');
    // ������ ��
    element.id = className + "-" + data.id;
    // ������ ������
    element.classList.add(className);
    element.classList.add("ui-resizable");
    // ������ �������
    element.addEventListener('dblclick', addNewItem)
    element.addEventListener('dblclick', addNewItem)
    // ������������ ������ ������ �������
    element.innerHTML = TEMPLATE_COLUMN;

    element = setColumnElementData(data, element, readOnly);

    return element;
}

// ���������� ����� ����������� ��������
function setItemViewMode(modeCompact, element) {
    var elementData = element.querySelector('.item-data');
    var elementInd = element.querySelector('.item-ind');
    var elementCompactExecutor = element.querySelector('.item-executor-compact');
    if (modeCompact) {
        elementData.classList.add('hidden');
        elementInd.classList.add('hidden');
        elementCompactExecutor.classList.remove('hidden');
    } else {
        elementData.classList.remove('hidden');
        elementInd.classList.remove('hidden');
        elementCompactExecutor.classList.add('hidden');
    }
}

// ���������� ������ ��������
function setItemData(data, element) {
    // ���������� ��������� ��������
    var textElement = element.querySelector(".item-text");
    textElement.innerHTML = data.text;
    // ���������� �����������
    // � ������ ������
    var executorElement = element.querySelector(".item-executor-img");
    executorElement.setAttribute("src", "css\\img\\avatars\\" + data.executorPhoto);
    executorElement.setAttribute("title", data.executorName);
    // � ���������� ������
    var executorCompactElement = element.querySelector('.item-executor-img-compact');
    executorCompactElement.setAttribute("src", "css\\img\\user.svg");
    executorCompactElement.setAttribute("title", data.executorName);
    var executorCompactElementName = element.querySelector('.item-executor-compact span');
    executorCompactElementName.innerHTML = data.executorName;
    // ���������� ���������
    var priorityElement = element.querySelector(".item-priority");
    priorityElement.innerHTML = data.priority;
    // ���������� �������� ����
    var planDateElement = element.querySelector(".item-plan-date");
    planDateElement.innerHTML = data.planDate;
    // ���������� �������� ������������
    var planHoursElement = element.querySelector(".item-plan-hours");
    if (data.planHours != '' && data.planHours != undefined) {
        planHoursElement.innerHTML = '<img src="css/img/clock.svg" width="12px" height="12px"/>' + data.planHours + ' �.';
    } else {
        planHoursElement.innerHTML = '';
    }
    // ���������� �����
    var numberElement = element.querySelector(".item-number");
    numberElement.innerHTML = data.number;

    // ��������� �������
    // ���������� ��� ��������
    element.classList.remove('defect');
    element.classList.remove('wish');
    if (data.issueTypeId == '1') {
        element.classList.add('defect');
    };
    if (data.issueTypeId == '2') {
        element.classList.add('wish');
    };

    // ���������� �����. ���������� ������� �������
    setItemViewMode(modeCompact, element);

    return element;
}

// �������� ��������
function createItemElement(data) {
    var className = "item";

    var element = document.createElement('div');
    // ������ ��
    element.id = className + "-" + data.id;
    // ������ ������
    element.classList.add(className);
    element.innerHTML = TEMPLATE_ITEM;
    // ������ ����������� �������
    element.addEventListener('click', openItem)

    element = setItemData(data, element);

    return element;
}

// ���������� ��������
function updateItemElement(data, elementId) {
    var element = document.getElementById(elementId);
    element = setItemData(data, element)
    return element
}

// ������� ����� � ������� �� ������� �������
function createStatesCellsAndColumns(states) {
    var containerStates = document.querySelector(".states");
    var containerColumns = document.querySelector(".items-row");
    states.forEach(function (state) {
        // ������ �������
        var stateElement = createStateElement(state);
        containerStates.appendChild(stateElement);
        // ������� �������
        var columnElement = createColumnElement(state, readOnly);
        containerColumns.appendChild(columnElement);
    }
    );
    // ������� ��������� �������� �� ��������
    createStatesTransmissions(states);
}

// ������� ��������
function createItems(items, filterProject, filterSprint, filterEmployee, filterPriority, filterPlanDateFrom, filterPlanDateTo, filterIssueType) {
    // �������� ��� ���������� �� ��������
    var elements = document.querySelectorAll('.items-list');
    var element;
    for (var i = 0; i < elements.length; i++) {
        element = elements[i];
        element.innerHTML = ""
    }

    //alert(filterProject + ', ' + filterSprint + ', ' + filterEmployee + ', ' + filterPriority + ', ' + filterPlanDateFrom + ', ' + filterPlanDateTo)
    // ������ ��� ��������� ����������� ��� ���������, ����� �������� �� �������
    var cleanedContainers = new Map;

    // ����������� �� ����������, ������� ���� �����-�� ��������
    var toFilterByEmployee = (filterEmployee.length > 0);
    // ����������� �� �����������, ������� ���� �����-�� ��������
    var toFilterByPriority = (filterPriority.length > 0);
    // ����������� �� �������, ���� ����� ������
    var toFilterByProject = (filterProject > 0)
    // ����������� �� �������, ���� ������ ������ ��� ����������������. 
    // � ��������� ��� �������, ��� �� = 0, ������� ������ �� ���������������� - ��� ������ �� 0
    // -1 = ��� ������
    var toFilterBySprint = (filterSprint > -1);
    // ����������� �� ���� ��������
    var toFilterByIssueType = (filterIssueType > -1);
    // ����������� �� ���� ���� �, ���� �������
    var toFilterByPlanDateFrom = filterPlanDateFrom != '';
    // ����������� �� ���� ���� ��, ���� �������
    var toFilterByPlanDateTo = filterPlanDateTo != '';

    items.forEach(function (item) {
        // 1 ����� �������: �������� ������ ���� + �������� ������
        // ���
        // 2 ����� �������: �������� �� ������ ����

        // ������ �� �������
        var add = (toFilterByProject && (item.project == filterProject)) || (!toFilterByProject);
        if (add) {
            // ������ �� �������
            add = (toFilterBySprint && (item.sprint == filterSprint)) || (!toFilterBySprint);
            if (add) {
                // ������� �� ����������
                add = (toFilterByEmployee && findElementInArray(filterEmployee, item.executorId)) || (!toFilterByEmployee);
                if (add) {
                    // ������ �� �����������
                    add = (toFilterByPriority && findElementInArray(filterPriority, item.priorityId)) || (!toFilterByPriority);
                    if (add) {
                        add = (toFilterByIssueType && (item.issueTypeId == filterIssueType)) || (!toFilterByIssueType);
                        // ������ �� ����. ����
                        if (add) {
                            add = (toFilterByPlanDateFrom && (item.planDate >= filterPlanDateFrom)) || (!toFilterByPlanDateFrom);
                            if (add) {
                                add = (toFilterByPlanDateTo && (item.planDate <= filterPlanDateTo)) || (!toFilterByPlanDateTo)
                            }
                        }
                    }
                }
            }
        }

        if (add) {
            var containerId = "#items-list-" + item.stateId;
            var container = document.querySelector(containerId);

            var itemElement = createItemElement(item);
            container.appendChild(itemElement);
        }
    }
    );
}

// ������ ��������� ����������
function createEmployeeList(items) {
    var container = document.querySelector(".select-employee");
    container.innerHTML = "";

    var employeeList = new Map();

    items.forEach(function (item) {
        var employeeId = item.executorId;

        if ((employeeId != 0) && (employeeId != '')) {
            if (!employeeList.has(employeeId)) {
                var employeeName = item.executorName;
                employeeList.set(employeeId, employeeName);

                var element = document.createElement("option");
                element.classList.add('select-employee-option');
                element.value = employeeId;
                element.innerHTML = employeeName;
                container.appendChild(element)
            }
        }
    })
}

//******************** ������� *****************************************
// ��������� ������ �� ����������
function setFilterItemListByEmployee() {
    filterEmployeeList = $(".select-employee").val();
    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
}

// ��������� ������ �� �����������
function setFilterItemListByPriority() {
    filterPriorityList = $(".select-priority").val();
    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
}

// ��������� ������ �� ����
function setFilterItemListByDateFrom() {
    var container = document.querySelector("#plan-date-from");
    filterPlanDateFrom = container.value;
    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
}

// ��������� ������ �� ����
function setFilterItemListByDateTo() {
    var container = document.querySelector("#plan-date-to");
    filterPlanDateTo = container.value;
    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
}

// ������ �� �������
function setFilterItemListBySprint() {
    filterSprintID = $(".select-sprint").val();
    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
}

// ������ �� ����������
function setFilterItemListByIssueType() {
    filterIssueTypeID = $(".select-issue-type").val();
    createItems(items, filterProjectID, filterSprintID, filterEmployeeList, filterPriorityList, filterPlanDateFrom, filterPlanDateTo, filterIssueTypeID);
}

//********************* ����������� ������� ����� ************************
function stopChangeSize(event, ui) {
    var divState = 'state';
    var divItemColumn = 'items-column';
    var divItemList = 'items-list';

    var width = ui.size.width;
    var elementID = ui.element.attr("id");

    // �������� �� ������� - ��������� ���� � �� ��������
    var id = getIdFromElementId(elementID)

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

function stopChangeState(event, ui) {
    // �� ��������
    var elementID = ui.item.attr("id");
    var itemId = getIdFromElementId(elementID);
    // ���������� ���������� ������
    // �� ����������� ��������
    elementID = prevItemsList.id;
    var oldItemStateId = getIdFromElementId(elementID);
    // ���������� ����� ������
    // �� ����������� ��������
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

    try {
        var result = getTextData.Execute();
    }
    catch (err) {
        alert(err);
        var result = true
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

// ������� ����������� ��������
function changeItemMode(mode) {
    modeCompact = mode;

    var elements = document.querySelectorAll('.item');
    var element;
    for (var i = 0; i < elements.length; i++) {
        element = elements[i];
        setItemViewMode(mode, element);
    }
}

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

//******************* ����������� ������� �������� � ���������� *******
// �������� ����� ������� (�� ��������������� ������)
function addNewItem() {
    var result = executeScript('AK_SBCreateItem', filterProjectID, filterSprintID, 0, readOnly);
    if (result) {
        items = getData(projectID, sprintID, true);
    }
};

// ������� �������
function deleteItem() {
    var item = event.currentTarget.parentElement;

    var itemId = getIdFromElementId(item.id);
    var result = executeScript('AK_SBDeleteItem', projectID, sprintID, itemId, readOnly);
    if (result) {
        items = getItemsData(projectID, sprintID, true);
    }
    // ���������� ��������
    event.stopPropagation()
};

// ������� �������
function openItem() {
    var itemId = getIdFromElementId(this.id);

    var result = executeScript('AK_SBOpenItem', projectID, sprintID, itemId, readOnly);
    if (result) {
        items = getData(projectID, sprintID, true);
    }
};

// �������� ������ ���������
function refreshItemList() {
    items = getData(projectID, sprintID, true);
}

// �������� ���� �������
function refreshItem(elementId) {
    var itemId = getIdFromElementId(elementId);
    try {
        var textData = executeScript('AK_SBRefreshItem', projectID, sprintID, itemId, readOnly);
        var item = JSON.parse(textData);
        element = updateItemElement(item[0], elementId)
    }
    catch (err) {
        alert(err);
    };
}

// �������� �����������
function changeExecutor() {
    var itemClassName = 'item';

    // ���������� ����� ������� �������, ����� �������� �� ������
    var element = event.currentTarget;
    var classList = element.classList;
    var toContunue = classList.contains(itemClassName);

    while (!toContunue) {
        element = element.parentElement;
        classList = element.classList;
        toContunue = classList.contains(itemClassName);
    }

    var elementId = element.id;
    var itemId = getIdFromElementId(elementId);

    try {
        var result = executeScript('AK_SBChangeExecutorItem', projectID, sprintID, itemId, readOnly);
    }
    catch (err) {
        var result = false;
        alert(err);
    }

    if (result) {
        refreshItem(elementId)
    }

    // ���������� ��������
    event.stopPropagation()
}

window.onscroll = function () {
    var scrolled = window.pageXOffset || document.documentElement.scrollLeft;
    var states = document.querySelector('.states');
    states.style.left = -scrolled + 'px';
}