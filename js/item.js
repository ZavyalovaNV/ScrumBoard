// Шаблон внутреннего устройства элемента
TEMPLATE_ITEM = document.getElementById("template_item").innerHTML;

Item = function (_itemList) {
    this.data = {};
    // Основной класс
    this.mainClass = "item";
    // Родитель - список всех элементов
    this.itemList = _itemList;
    // Стиль отображения: компактный/полный
    this.modeCompact = this.itemList.modeCompact;

    // Обновить свойства элемента
    this.update = function (data) {
        for (key in data) {
            // Для плановой даты преобразовать строку в Дату, чтобы дальше работать как с датами
            if (key === 'planDate' || key === 'regDate') {
                var valueStr = data[key];
                var value = parseDate(valueStr);
            } else {
                value = data[key]
            }
            this[key] = value;
        }

        // Обновить работника в список
        var itemList = this.itemList;
        if (itemList != undefined && itemList != null) {
            // Найти работника в списке
            var employeeList = itemList.employeeList;
            var employee = employeeList.getItemById(this.executorId);
            if (employee === undefined || employee === null) {
                employee = new Employee(this.executorId, this.executorName);
                employeeList.add(employee);
            }
        }        
    }

    // Получить элемент DOM по ид
    this.getDOMElement = function () {
        // Найти элемент с таким же ИД
        return document.getElementById("item-" + this.id);
    }

    // Отрисовка элемента
    this.render = function () {
        // Получить родительский контейнер
        var parent = document.getElementById("items-list-" + this.stateId);
        if (parent !== null && parent != undefined) {
            var className = this.mainClass;

            // Найти элемент с таким же ИД
            var element = this.getDOMElement();
            if (element === undefined || element === null) {
                element = document.createElement('div');
                // Новый элемент добавляется в контейнер
                parent.appendChild(element);
                // Задать ИД
                element.id = className + "-" + this.id;
                element.innerHTML = TEMPLATE_ITEM;
            }

            // Подстановка для плановой даты
            var planHoursElementInnerHTML = '';
            if (this.planHours != '' && this.planHours != undefined) {
                planHoursElementInnerHTML = '<img src="css/img/clock.svg" width="12px" height="12px"/>' + this.planHours + ' ч.';
            }

            // Соответствие частей элемента и их значений
            var compareValues = {
                '.item-text': this.text,
                '.item-priority': this.priority,
                '.item-plan-date': dateToStr(this.planDate),
                '.item-executor-compact span': this.executorName,
                ".item-number": this.number,
                ".item-plan-hours": planHoursElementInnerHTML
            };

            // Соответствение для рисунков
            var compareImages = {
                ".item-executor-img": ["css\\img\\avatars\\" + this.executorPhoto, this.executorName],
                ".item-executor-img-compact": ["css\\img\\user.svg", this.executorName]
            };

            var elementExecutor = element.querySelector(".item-executor");
            if (elementExecutor != null) {
                elementExecutor.id = "item-executor-" + this.executorId;
                // На клике происходит смена исполнителя
                elementExecutor.addEventListener('click', this.changeExecutor)
            }

            // Обновить основные значения
            var innerElement;
            for (key in compareValues) {
                // Получить вложенный элемент
                innerElement = element.querySelector(key);
                if (innerElement !== null && innerElement != undefined) {
                    innerElement.innerHTML = compareValues[key];
                }
            }
            // Обновить рисунки
            for (key in compareImages) {
                // Получить вложенный элемент
                innerElement = element.querySelector(key);
                if (innerElement !== null && innerElement != undefined) {
                    var arr = compareImages[key];
                    innerElement.setAttribute("src", arr[0]);
                    innerElement.setAttribute("title", arr[1]);
                }
            }

            // Установить стили элемента
            var elementClassList = element.classList;
            if (!elementClassList.contains('item')) {
                elementClassList.add('item')
            };
            // Стиль в ависимости от типа элемента
            elementClassList.remove('defect');
            elementClassList.remove('wish');
            if (this.issueTypeId == '1') {
                elementClassList.add('defect');
            };
            if (this.issueTypeId == '2') {
                elementClassList.add('wish');
            };

            // Компактный режим. Определить видимые области
            this.setViewMode(this.modeCompact);

            // Задать обработчики события
            // Открытие элемента
            element.addEventListener('click', this.openElement)
            // Удаление элемента
            deleteElement = element.querySelector('.item-delete');
            if (deleteElement !== null && deleteElement != undefined) {
                deleteElement.id = "item-delete-" + this.id;
                deleteElement.addEventListener('click', this.deleteElement)
            }
        }

        // Получить все столбцы
        var columns = document.querySelectorAll(".items-list");
        // Найти максимальную высоту
        var column = columns[0];
        var height = column.offsetHeight;
        var maxHeight = height;

        for (var i = 1; i < columns.length; i++) {
            column = columns[i];
            height = column.offsetHeight;
            maxHeight = height > maxHeight ? height : maxHeight;
        }

        for (var i = 0; i < columns.length; i++) {
            column = columns[i];
            height = column.offsetHeight;
            if (height < maxHeight) {
                column.style.minHeight = maxHeight + "px";
            }
        }         
    }

    // Установить режим отображения Полный/Компактный
    this.setViewMode = function (_modeCompact) {
        this.modeCompact = _modeCompact;

        var element = this.getDOMElement();
        if (element !== undefined && element !== null) {
            var elementData = element.querySelector('.item-data');
            var elementInd = element.querySelector('.item-ind');
            var elementCompactExecutor = element.querySelector('.item-executor-compact');
            if (_modeCompact) {
                // В компактном режиме доступны только ФИО
                elementData.classList.add('hidden');
                elementInd.classList.add('hidden');
                elementCompactExecutor.classList.remove('hidden');
            } else {
                // В полном режиме доступно еще фото
                elementData.classList.remove('hidden');
                elementInd.classList.remove('hidden');
                elementCompactExecutor.classList.add('hidden');
            }
        }
    }

    // Получить данные по элементу с сервера
    this.getData = function (getFromServer) {
        var result = {};
        // Получить данные с сервера
        if (getFromServer) {
            var resultScript = connector.executeScript("AK_SBGetItemsData",
                {
                    sprintId: this.sprint,
                    projectId: this.project,
                    itemId: this.id
                });

            // Если сценарий отработал корректно = вернул данные, распарсить их
            if (resultScript) {
                result = JSON.parse(resultScript);
                result = result[0];
            }
        } else {
            // Получить из JSON массива
            var itemList = this.itemList;
            if (itemList != undefined) {
                result = itemList.getItemDataById(this.id);
            }
        }
        this.data = result;
        return result;
    }

    // Метод открытия элемента DOM (событие клика)
    this.openElement = function () {
        // Выделить ИД итема
        var itemId = getIdByElementId(this.id);
        // Найти итем
        var item = itemList.getItemById(itemId);
        item.open();
        event.stopPropagation();
    }

    // Открытие самого элемента
    this.open = function () {
        var params = {
            SprintId: this.sprint,
            ProjectId: this.project,
            ItemID: this.id,
            ReadOnly: this.itemList.readOnly
        }

        var result = connector.executeScript("AK_SBOpenItem", params)
        if (result) {
            // Обновить весь список объектов, т.к. могли создать новые/удалить    
            itemList.refresh();
        }
    }

    // Метод удаления элемента
    this.deleteElement = function () {
        // Выделить ИД итема
        var itemId = getIdByElementId(this.id);
        // Найти итем
        var item = itemList.getItemById(itemId);
        var result = item.delete();

        // Удалить объект в HTML
        if (result) {
            var element = item.getDOMElement(item.id);
            if (element != null) {
                element.parentNode.removeChild(element);
            }
        }
        event.stopPropagation();
    }

    // Метод удаления элемента
    this.delete = function () {
        var params = {
            sprintId: this.sprint,
            projectId: this.project,
            itemID: this.id
        }

        if (this.itemList.readOnly) {
            var msg = "Нет прав на удаление объектов";
            alert(msg);
            return false
        }

        var result = connector.executeScript("AK_SBDeleteItem", params)
        if (result) {
            // Обновить весь список объектов, т.к. могли создать новые/удалить    
            itemList.refresh();
        }
        return result;
    }

    // Метод смены статуса элемента
    this.changeState = function (newItemStateId) {
        // Предыдущий статус еще в свойствах
        var prevItemStateId = this.stateId;
        var result = false;

        if (this.itemList.readOnly) {
            var msg = "Нет прав на изменение новых объектов";
            alert(msg);
            return false
        }

        if (prevItemStateId != newItemStateId) {
            var params = {
                sprintId: this.sprint,
                projectId: this.project,
                itemID: this.id,
                prevItemStateId: prevItemStateId,
                newItemStateId: newItemStateId
            }

            var data = connector.executeScript("AK_SBChangeStateItem", params)
            if (data != false) {
                result = JSON.parse(data);
                this.update(result[0], this.itemList);
                this.render();
                result = true
            }
            //this.itemList.refresh();
        }

        return result
    }

    // Метод смены исполнителя элемента
    this.changeExecutor = function () {
        event.stopPropagation();

        // Дойти до родителя с классом item
        var parent = this.parentElement;
        var parentClassList = parent.classList;
        var parentIsItem = parentClassList.contains("item");
        while (!parentIsItem) {
            parent = parent.parentElement;
            parentClassList = parent.classList
            parentIsItem = parentClassList.contains("item");
        }

        // Выделить ИД итема
        var itemId = getIdByElementId(parent.id);
        // Найти итем
        var item = itemList.getItemById(itemId);

        if (item.itemList.readOnly) {
            var msg = "Нет прав на изменение объектов";
            alert(msg);
            return result
        }

        var params = {
            sprintId: item.sprint,
            projectId: item.project,
            itemID: item.id
        }

        var result = connector.executeScript("AK_SBChangeExecutorItem", params)
        if (result != false) {
            var data = JSON.parse(result);
            item.update(data[0], item.itemList);
            item.render();
        }

        // Обновить весь список объектов, т.к. могли создать новые/удалить    
        return result;
    }

    // Проверка соответствия текущего элемента фильтру
    this.checkByFilter = function (filter) {
        var checked = false;

        // Проверка по спринту
        var filterSprintId = filter._sprintId;
        checked = (filterSprintId === this.sprintId) || filterSprintId == '' || filterSprintId == null || filterSprintId == -1 || filterSprintId == undefined;

        if (checked) {
            // Проверка по работнику
            var filterEmployeeList = filter._employeeList;
            checked = (filterEmployeeList.indexOf(this.executorId) > -1) || filterEmployeeList.length == 0 || filterEmployeeList == null || filterEmployeeList == undefined;

            // Проверка по приоритету
            if (checked) {
                var filterPriorityList = filter._priorityList;
                checked = (filterPriorityList.indexOf(this.priorityId) > -1) || filterPriorityList.length == 0 || filterPriorityList == null || filterPriorityList == undefined;

                // Проверка по типу
                if (checked) {
                    var filterType = filter._type;
                    checked = (filterType === this.issueTypeId) || filterType == '' || filterType == null || filterType == -1 || filterType == undefined

                    // Проверка по дате с
                    if (checked) {
                        var filterPlanDateFrom = filter._dateFrom;
                        checked = (this.planDate >= filterPlanDateFrom) || filterPlanDateFrom === '' || filterPlanDateFrom === null || filterPlanDateFrom == undefined

                        // Проверка по дате по
                        if (checked) {
                            var filterPlanDateTo = filter._dateTo;
                            checked = (this.planDate <= filterPlanDateTo) || filterPlanDateTo === '' || filterPlanDateTo === null || filterPlanDateTo == undefined
                        }
                    }
                }
            }
        }

        return checked
    }

    // Метод добавления элемента
    this.new = function (stateId, projectId, sprintId) {
        var result = {};
        var params = {
            sprintId: sprintId,
            projectId: projectId
        }

        if (this.itemList.readOnly) {
            var msg = "Нет прав на создание новых объектов";
            alert(msg);
            return result
        }

        // Если задан статус, то передать его как значение по умолчанию
        if (stateId != undefined) {
            params['stateId'] = stateId;
        }

        var resultScript = connector.executeScript("AK_SBCreateItem", params)
        if (resultScript) {
            result = JSON.parse(resultScript);
            result = result[0];
        }

        this.update();

        // Обновить весь список объектов, т.к. могли создать новые/удалить    
        //itemList.update();
        return result;
    }

    // Метод обновления элемента
    this.refresh = function (getFromServer) {
        // Получить данные из JSON массива или напрямую с сервера
        this.getData(getFromServer);
        // Обновить свойства
        this.update();
        // Отобразить
        this.render();
    }
}
