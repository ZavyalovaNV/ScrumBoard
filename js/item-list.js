ItemList = function (modeCompact) {
    // Все элементы, как JSON
    this.itemsData = items_test;

    // Список созданных объектов
    this.items = [];

    // Возможные статусы, как JSON
    this.states = states_test;

    // Отрисовать статусы
    this.renderStates = function () {
        var container = document.getElementById("states");
        var containerCols = document.getElementById("item-row");

        var states = this.states;
        states.forEach(function (data) {
            // создать новый статус
            var state = new State(data);
            // отрисовать статус
            state.render(container);
            state.renderColumn(containerCols);
        });
    }
    
    // Создать объекты
    this.createItems = function () {        
        var founded = false;
        var items = this.items;
        var itemsData = this.itemsData;

        // Найти элементы, которых нет в новых данных и удалить их из списка и DOM
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemID = item.id;

            founded = false;
            for (var j = 0; j < itemsData.length; j++) {
                founded = itemsData[j].id === itemID;
                if (founded) { j = itemsData.length + 2}
            }
            if (!founded) {
                item.delete(false);
                items.splice(i, 1);
            }
        } 

        // Добавить новые элементы
        itemsData.forEach(function (data) {
            // Найти в массиве
            founded = false;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var itemID = item.id;

                founded = (itemID === data.id)
                if (founded) {
                    i = items.length + 1
                }
            } 

            // создать новый элемент и добавить в список, если его еще не было
            if (!founded) {
                var item = new Item(data);
                items.push(item);
            }
        });

        this.items = items;
    };

    // Отрисовать элементы
    this.renderItems = function () {
        var items = this.items;
       
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            item.render(this.modeCompact)
        }
    }

    // Обновить элементы
    this.refresh = function () {
        // Получить данные с сервера
        this.itemsData = items_test_new;

        // Преобразовать их в JSON

        // Создать элементы
        this.createItems();

        // Отрисовать элементы
        this.renderItems();
    }

    this.addNew = function () {
        var item = new Item();
        item.add()
    }
}


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

////********************* Обработчики событий формы ************************
//function stopChangeSize(event, ui) {
//    var divState = 'state';
//    var divItemColumn = 'items-column';
//    var divItemList = 'items-list';

//    var width = ui.size.width;
//    var elementID = ui.element.attr("id");

//    // Получить ИД статуса - последний блок в ИД элемента
//    var id = getIdFromElementId(elementID)

//    // Получить ИД связанных документов
//    var idItemColumn = '#' + divItemColumn + '-' + id;
//    var idItemList = '#' + divItemList + '-' + id;
//    var idState = '#' + divState + '-' + id;

//    var ind = elementID.toLowerCase().indexOf(divState.toLowerCase());
//    var element;
//    // Изменить соответствеющие ширину объектов
//    if (ind >= 0) {
//        // Столбец
//        element = $(idItemColumn);
//        element.width(width);
//    } else {
//        // Ячейка статуса
//        element = $(idState);
//        element.width(width);
//    }
//    // Контейтер элементов
//    element = $(idItemList);
//    element.width(width);
//}

//function stopChangeState(event, ui) {
//    // ИД элемента
//    var elementID = ui.item.attr("id");
//    var itemId = getIdFromElementId(elementID);
//    // Определить предыдущий статус
//    // ИД предыдущего родителя
//    elementID = prevItemsList.id;
//    var oldItemStateId = getIdFromElementId(elementID);
//    // Определить новый статус
//    // ИД предыдущего родителя
//    var newItemsList = ui.item[0].parentElement;
//    elementID = newItemsList.id;
//    var newItemStateId = getIdFromElementId(elementID);

//    var getTextData = application.ScriptFactory.GetObjectByName('AK_SBChangeStateItem');
//    getTextData.Params.Add('ProjectID', projectID);
//    getTextData.Params.Add('SprintID', sprintID);
//    getTextData.Params.Add('ItemID', itemId);
//    getTextData.Params.Add('OldItemState', oldItemStateId);
//    getTextData.Params.Add('NewItemState', newItemStateId);
//    getTextData.Params.Add('ReadOnly', readOnly);

//    try {
//        var result = getTextData.Execute();
//    }
//    catch (err) {
//        alert(err);
//        var result = true
//    }

//    if (result) {
//        items = getItemsData(projectID, sprintID, true)
//    }
//}

//function startChangeState(event, ui) {
//    console.dir(ui);
//    if (readOnly) {

//    }
//    prevItemsList = ui.item[0].parentElement;
//}

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

//function showFilterMenu() {
//    var elementID = "filter-submenuID";
//    var element = document.getElementById(elementID);
//    var display = element.style.display;

//    if (display == 'none') {
//        display = 'block'
//    } else {
//        display = 'none'
//    }
//    element.style.display = display;
//}

//function hideFilterMenu() {
//    var elementID = "filter-submenuID";
//    var element = document.getElementById(elementID);
//    element.style.display = 'none';
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