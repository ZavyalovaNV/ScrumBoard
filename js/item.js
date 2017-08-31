let TEMPLATE_ITEM = document.getElementById("template_item");

Item = function (data) {
    // Свойства элемента
    this.update = function (data, itemList) {        
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
    }

    // Получить элемент DOM по ид
    this.getElement = function () {
        // Найти элемент с таким же ИД
        return document.getElementById("item-" + this.id);
    }

    // Отрисовка элемента
    this.render = function (modeCompact) {
        // Получить родительский контейнер
        var parent = document.getElementById("items-list-" + this.stateId);
        if (parent !== null) {
            var className = "item";

            // Найти элемент с таким же ИД
            var element = this.getElement();
            if (element === undefined || element === null) {
                element = document.createElement('div');
                // Новый элемент добавляется в контейнер
                parent.appendChild(element);
                // Задать ИД
                element.id = className + "-" + this.id;
                element.innerHTML = TEMPLATE_ITEM;
            }

            // Соответствие частей элемента и их значений
            // Обновить плановую дату
            var planHoursElementInnerHTML = '';
            if (data.planHours != '' && data.planHours != undefined) {
                planHoursElementInnerHTML = '<img src="css/img/clock.svg" width="12px" height="12px"/>' + data.planHours + ' ч.';
            }

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
            // Обновить основные значения
            var innerElement;
            for (key in compareValues) {
                innerElement = element.querySelector(key);
                if (innerElement !== null) {
                    innerElement.innerHTML = compareValues[key];
                }
            }
            // Обновить рисунки
            for (key in compareImages) {
                innerElement = element.querySelector(key);
                if (innerElement !== null) {
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
            elementClassList.add('ui-sortable');

            // Компактный режим. Определить видимые области
            this.setViewMode(modeCompact);

            // Задать обработчики события
            // Открытие элемента
            element.addEventListener('click', this.openElement)
            // Удаление элемента
            deleteElement = element.querySelector('.item-delete');
            element.addEventListener('click', this.deleteElement)
        }
    }

    // Установить режим отображения Полный/Компактный
    this.setViewMode = function (modeCompact) {
        var element = this.getElement();
        if (element !== undefined && element !== null) {
            var elementData = element.querySelector('.item-data');
            var elementInd = element.querySelector('.item-ind');
            var elementCompactExecutor = element.querySelector('.item-executor-compact');
            if (modeCompact) {
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

    // Метод обновления элемента
    this.refresh = function () {
        try {
            var textData = executeScript('AK_SBRefreshItem', this.projectID, this.sprintID, this.id, readOnly);
            var data = JSON.parse(textData);
            this.update(data);
        }
        catch (err) {
            alert(err);
        };
    }

    // Метод открытия элемента DOM (событие клика)
    this.openElement = function () {
        // Выделить ИД итема
        var itemId = getIdByElementId(this.id);
        // Найти итем
        var item = itemList.getItemById(itemId);
        item.open();     
    }
    // Открытие самого элемента
    this.open = function () {
        var params = {
            SprintId: this.sprint,
            ProjectId: this.project,
            ItemID: this.id
        }

        var result = connector.executeScript("AK_SBOpenItem", params)
        if (result) {
            // Обновить весь список объектов, т.к. могли создать новые/удалить    
            itemList.update();
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
            var element = item.getElement(item.id);
            element.parentNode.removeChild(element);            
        }
    }
    // Метод удаления элемента
    this.delete = function () {
        var params = {
            SprintId: this.sprint,
            ProjectId: this.project,
            ItemID: this.id
        }

        var result = connector.executeScript("AK_SBDeleteItem", params)
        if (result) {
            // Обновить весь список объектов, т.к. могли создать новые/удалить    
            itemList.update();
        }
        return result;
    }

    // Метод добавления элемента
    this.add = function (stateId) {
        // Если задан статус, то передать его как значение по умолчанию
        if (stateId != undefined) {

        }
        var data = { "stateId": "873359", "project": "1543890", "sprint": "1556288", "id": "1562158", "link": "", "text": "Новая запись! Свеженькая!", "executorId": "1149425", "executorName": "Завьялова Наталия Владимировна", "executorPhoto": "1149425.jpg", "priority": "Максимальный", "priorityId": "2", "issueType": "Пожелание", "issueTypeId": "2", "planDate": "", "number": "095-020", "planHours": "", "regDate": "20.07.2017" }
        /*var data = executeScript('AK_SBCreateItem', filterProjectID, filterSprintID, 0, readOnly);
        if (result) {
            // Обновить весь список объектов, т.к. могли создать новые/удалить
            items = getData(this.projectID, this.sprintID, true);
        }*/
        return data;
    }

    // Метод смены статуса элемента
    

    // Метод смены исполнителя элемента
    this.changeExecutor = function () {
        try {
            var result = executeScript('AK_SBChangeExecutorItem', this.projectID, this.sprintID, this.id, readOnly);
            if (result) {
                this.refresh();
            }
        }
        catch (err) {
            alert(err);
        }
    }

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

    this.update(data);    
}