let TEMPLATE_ITEM =
`<div class="item-handle"></div> 
    <a class="item-delete" href= "#" onclick= "deleteItem()" ></a>
        <div class="item-content">
            <div class="item-text"><text></div>   
         
                <div class="item-executor-compact" onclick="changeExecutor()">
                    <img class="item-executor-img-compact" src="" alt="Исполнитель" title="<executorName>" />
                    <span class="item-executor-name"><executorName></span>
        </div>
        
                    <div class="item-data clearfix">
                        <div class="item-executor" onclick="changeExecutor()">
                            <img class="item-executor-img" src="css\img\avatars\<executorPhoto>" alt="Исполнитель" title="<executorName>" />
                        </div>

                        <div class="item-requisites-left">
                            <div class="item-plan-hours">
                                <planHours>
            </div>
                            </div>
                            <div class="item-requisites-right">
                                <div class="item-number"><number></div>
                                    <div class="item-priority"><priority></div>
                                        <div class="item-plan-date"><planDate></div>
                                        </div>
                                    </div>
                                    <div class="item-ind"></div>
                                </div>`;

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
                element.innerHTML = document.querySelector('#template_item').innerHTML;
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

    // Метод открытия элемента
    this.open = function () {
        var result = executeScript('AK_SBOpenItem', this.projectID, this.sprintID, this.id, readOnly);
        if (result) {
            // Обновить весь список объектов, т.к. могли создать новые/удалить
            items = getData(this.projectID, this.sprintID, true);
        }
    }

    // Метод удаления элемента
    this.delete = function (executeScript) {
        // Удалить на сервере
        var result = true;
        if (executeScript) {
            result = executeScript('AK_SBDeleteItem', this.projectID, this.sprintID, this.id, readOnly);
        }
        // Удалить объект в HTML
        if (result) {
            var element = document.getElementById("item-" + this.id);
            if (element !== undefined && element !== null) {
                element.parentNode.removeChild(element);
            }
        }
    }

    // Метод добавления элемента
    this.add = function () {
        var data = executeScript('AK_SBCreateItem', filterProjectID, filterSprintID, 0, readOnly);
        if (result) {
            // Обновить весь список объектов, т.к. могли создать новые/удалить
            items = getData(this.projectID, this.sprintID, true);
        }
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

    this.update(data);
}