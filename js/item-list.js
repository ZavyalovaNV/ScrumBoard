ItemList = function (_modeCompact) {
    // Фильтр
    this.filter = {
        _type: '',
        _employeeList: [],
        _priorityList: [],
        _dateFrom: '',
        _dateTo: '',
        _sprintId: null,
        _projectId: null
    };

    // Сортировка
    this.sort = {
        field: 'number',
        dest: 'acs'
    }

    // Настройка отображения
    this.modeCompact = _modeCompact;

    // Все элементы, как JSON
    this.itemsData = items_test;

    // Работники
    this.employeeList = new EmployeeList();

    // Список созданных объектов
    this.items = [];

    // Возможные статусы, как JSON
    this.states = states_test;

    // Получить элемент из массива по его ИД
    this.getItemById = function (id) {
        var items = this.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemID = item.id;

            if (id === itemID) {
                return item;
            }
        }
    };

    // Получить элемент из массива JSON по его ИД
    this.getItemDataById = function (id) {
        var itemsData = this.itemsData;
        for (var j = 0; j < itemsData.length; j++) {
            var data = itemsData[j];
            if (data.id === id) {
                return data
            }
        }
    };

    // Создать объекты
    this.createItems = function () {
        var items = this.items;
        var itemsData = this.itemsData;
        var employeeList = this.employeeList;
        var sort = this.sort;
        var item, check, toDelete;

        // Прохождение по текущим данным
        var itemsToDelete = [];
        var newItems = items.filter(
            function (item) {
                // Проверить прохождение элемента по фильтру
                toDelete = !this.checkByFilter(item);

                // Если проверка фильтров пройдена
                if (!toDelete) {
                    // Проверить наличие в JSON данных
                    itemData = this.getItemDataById(item.id);
                    toDelete = (itemData === undefined)
                }

                // Если не прошел элемент по фильтрам или его больше нет в JSON, удалить из списка элементов и DOM
                if (toDelete) {
                    itemsToDelete.push(item)
                }

                return !toDelete
            }, this
        )

        // Удалить объекты из DOM
        for (var i = 0; i < itemsToDelete.length; i++) {
            item = itemsToDelete[i];
            item.delete(false);
        }

        items = newItems;

        // Сформировать список отображаемых элементов на основе фильтра        
        for (var i = 0; i < itemsData.length; i++) {
            // Элемент из JSON
            var itemData = itemsData[i];

            // Добавить исполнителя в список
            var employee = employeeList.getEmployeeById(itemData.executorId);
            if (employee === undefined) {
                employee = new Employee(itemData.executorId, itemData.executorName);
                employeeList.add(employee);
            }

            // Проверить прохождение по фильтру
            check = this.checkByFilter(itemData);

            // Найти его в списке текущих элементов
            item = this.getItemById(itemData.id);

            // Если данный элемент есть в списке, но его не нужно отбражать - удалить из списка и DOM
            if (item !== undefined && !check) {
                item.delete(false);
                items.splice(i, 1);
            }

            // Если данный элемент не был найден в списке и его требуется отбразить - создать и отобразить
            if (item === undefined && check) {
                // создать новый элемент и добавить в список, если его еще не было
                item = new Item(itemData);
                items.push(item);
            }
        }

        // Отсортировать
        items = items.sort(
            function (item1, item2) {
                var sortField = sort['field'];
                var sortDest = sort['dest'];

                var value1 = item1[sortField];
                var value2 = item2[sortField];

                var koef = 1;
                if (sortDest === 'decs') {
                    koef = -1
                }

                var res = 1;
                if (sortField === 'priorityId') {
                    if (value1 > value2) {
                        res = -1
                    }
                } else {
                    if (value1 < value2) {
                        res = -1
                    }
                }

                return res * koef;
            }
        );

        this.items = items;
    }

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
    
    // Очистить область от элементов
    this.clear = function () {
        var elements = document.querySelectorAll('.item');
        for (var i = 0; i < elements.length; i++) {
            element = elements[i];
            console.log(element);

            element.parentNode.removeChild(element);
        }
    }

    // Отрисовать все элементы
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

        // Преобразовать их в JSON
        

        this.itemsData = items_test_new;

        // Создать элементы
        this.createItems();

        // Отрисовать элементы
        this.renderItems();
    }

    // Добавить новый элемент
    this.addNew = function () {
        var item = new Item();
        item.add();
        this.items.push(item);
        item.render();
    }

    // Сменить режим отображения Полный/Компактный
    this.setViewMode = function (viewMode_) {
        this.modeCompact = viewMode_;

        var elements = document.querySelectorAll('.item');
        var element, arr, item;
        for (var i = 0; i < elements.length; i++) {
            element = elements[i];
            arr = element.id.split("-");
            item = this.getItemById(arr[arr.length - 1]);
            if (item !== undefined) {
                item.setViewMode(this.modeCompact);
            }
        }
    }

    // ФИЛЬТРЫ
    // Установить текущее значение фильтра
    this.setFilter = function (selector) {
        var COMPARE = {
            ".select-employee": '_employeeList',
            ".select-priority": '_priorityList',
            ".select-issue-type": '_type',
            "#plan-date-from": '_dateFrom',
            "#plan-date-to": '_dateTo',
            ".select-sprint": '_sprintId'
        };
        var element = $(selector);
        var classList = element[0].classList;
        var filterValue = element.val();
        // Если это дата - распарсить к дате
        if (classList.contains("datepicker")) {
            filterValue = $.datepicker.parseDate("dd.mm.yy", filterValue) 
        } else {            
            if (filterValue === undefined) {
                filterValue = element.value
            }
        }        
        
        var filterName = COMPARE[selector];        
        this.filter[filterName] = filterValue;
    }

    // Применить фильтр к значениям
    this.applyFilter = function () {
        this.refresh();
    }

    this.checkByFilter = function (item) {
        var filter = this.filter;
        var checked = false;

        // Проверка по спринту
        var filterSprintId = filter._sprintId;
        checked = (filterSprintId === item.sprintId) || filterSprintId == '' || filterSprintId == null || filterSprintId == -1 || filterSprintId == undefined;

        if (checked) {
            // Проверка по работнику
            var filterEmployeeList = filter._employeeList;
            checked = (filterEmployeeList.indexOf(item.executorId) > -1) || filterEmployeeList.length == 0 || filterEmployeeList == null || filterEmployeeList == undefined;

            // Проверка по приоритету
            if (checked) {
                var filterPriorityList = filter._priorityList;
                checked = (filterPriorityList.indexOf(item.priorityId) > -1) || filterPriorityList.length == 0 || filterPriorityList == null || filterPriorityList == undefined;

                // Проверка по типу
                if (checked) {
                    var filterType = filter._type;
                    checked = (filterType === item.issueTypeId) || filterType == '' || filterType == null || filterType == -1 || filterType == undefined

                    // Проверка по дате с
                    if (checked) {
                        var filterPlanDateFrom = filter._dateFrom;
                        //console.log(typeof item.planDate);
                        //console.log(typeof filterPlanDateFrom);

                        checked = (item.planDate >= filterPlanDateFrom) || filterPlanDateFrom === '' || filterPlanDateFrom === null// || filterPlanDateFrom == undefined

                        // Проверка по дате по
                        if (checked) {
                            var filterPlanDateTo = filter._dateTo;
                            checked = (item.planDate <= filterPlanDateTo) || filterPlanDateTo === '' || filterPlanDateTo === null || filterPlanDateTo == undefined
                        }
                    }
                }
            }
        }
                
        return checked
    }

    // СОРТИРОВКА
    this.setSort = function (par) {
        var newField = par.value;
        var newDest = 'asc';

        var curSort = this.sort;
        if (curSort['field'] === newField) {
            if (curSort['asc'] === 'asc') {
                newDest = 'desc'
            }
        } 

        this.sort['field'] = newField;
        this.sort['dest'] = newDest;        
    }

    // Отсортировать
    this.applySort = function () {
        var sort = this.sort;
        var items = this.items;

        items = items.sort(
            function (item1, item2) {
                var value1 = item1[sort.field];
                var value2 = item2[sort.field];

                var koef = 1;
                if (sort.dest === 'desc') {
                    koef = -1
                }

                console.log("value1 " + value1);
                console.log("value2 " + value2);

                var res = 1;
                if (sort.field === 'priorityId') {
                    if (value1 > value2) {
                        res = -1
                    }
                } else {
                    if (value1 < value2) {
                        res = -1
                    }
                }

                return res * koef;
            }
        );
        console.log(items);
        this.items = items;

        this.clear();
        this.renderItems();
    }
}



Employee = function (_id, _name) {
    this.id = _id;
    this.name = _name;

    this.render = function () {
        var container = document.querySelector(".select-employee");
        var optionList = container.options;
        
        // Найти работника в списке
        var founded = false;
        for (var i = 0; i < optionList.length; i++) {
            var option = optionList[i];
            founded = option.value === this.id;
            if (founded) { break; }
        }
        if (!founded) {
            // Создать работника в списке
            var element = document.createElement("option");
            element.classList.add('select-employee-option');
            element.value = this.id;
            element.innerHTML = this.name;
            container.appendChild(element);
        }
    }
}

EmployeeList = function (data) {
    this.data = [];
    this.employees = [];

    this.add = function (employee) {
        this.employees.push(employee);
        this.data.push({ id: employee.id, text: employee.name });
        employee.render();
    }

    this.getEmployeeById = function (_id) {
        var data = this.data;
        for (var i = 0; i < data.length; i++) {
            employee = data[i];
            if (employee.id === _id) {
                return employee
            }
        }
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