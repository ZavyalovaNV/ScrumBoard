StateList = function (_connector) {
    // Подключение к Директум
    this.connector = _connector;    
    // Данные с сервера
    this.data = [];
    // Локальные данные
    this.list = [];

    // Получить данные по спринту/проекту
    this.getData = function () {
        var result = [];
        // Получить данные с сервера
        var resultScript = connector.executeScript("AK_SBGetStatesData",
            {
                sprintId: this.connector.sprintId,
                projectId: this.connector.projectId
            });
        // Если сценарий отработал корректно = вернул данные, распарсить их
        if (resultScript) {
            result = JSON.parse(resultScript);
        }
        this.data = result;
        return result;
    };

    // Отрисовать статусы
    this.render = function () {
        var container = document.getElementById("states");
        var containerCols = document.getElementById("item-row");

        var states = this.list;
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            // отрисовать статус
            state.render(container);
            state.renderColumn(containerCols);
        };
    }

    // Создать статусы на основе JSON
    this.create = function () {
        // Очистить текущий список
        this.list = [];
        var newStates = [];

        // По списку данных с сервера создать локальные данные
        var statesData = this.data;
        for (var i = 0; i < statesData.length; i++) {
            var stateData = statesData[i];
            // Создать новый статус
            var state = new State();
            state.refresh(stateData);
            // Добавить в список
            newStates.push(state);
        };

        this.list = newStates;
    }

    this.refresh = function () {
        // Получить все статусы как JSON
        this.getData();

        // Создать статусы
        this.create();

        // Отобразить
        this.render()
    }
}

State = function () {
    // Основной класс
    this.mainClass = "state";

    // Обновить свойства элемента
    this.update = function (data) {
        for (key in data) {
            this[key] = data[key];
        }

        let availableStates = this.availableStates;        
        if (availableStates != '') {
            // Убрать последний символ
            availableStates = availableStates.slice(0, availableStates.length - 1);
            // Преобразовать в массив
            this.availableStates = availableStates.split(',');
        } else {
            this.availableStates = []
        }     
    }

    // Получить элемент DOM по ид
    this.getDOMElement = function () {
        // Найти элемент с таким же ИД
        return document.getElementById(this.mainClass + "-" + this.id);
    }

    this.render = function (parent) {
        if (parent === undefined || parent === null) {
            throw 'Не определен контейнер для статуса'
        }

        var className = this.mainClass;
        
        // Найти данный элемент, чтобы не перерисовывать каждый раз
        var element = this.getDOMElement();        
        if (element === undefined || element === null) {
            element = document.createElement('div');
            // Задать ИД
            element.id = className + "-" + this.id;
            parent.appendChild(element);
        }

        // Задать классы
        var classList = [className, "ui-resizable"]
        var elementClassList = element.classList;
        for (var i = 0; i < classList.length; i++) {
            className_ = classList[i];
            if (!elementClassList.contains(className_)) {
                elementClassList.add(className_);
            }
        }
        
        // Сформировать строку внутри объекта
        element.innerHTML = '<span class="state-name">' + this.name + '</span>';
    }

    this.renderColumn = function (parent) {
        if (parent === undefined || parent === null) {
            throw 'Не определен контейнер для статуса'
        }

        var className = 'items-column';
        var elementId = className + "-" + this.id;

        var element;
        element = document.getElementById(elementId);
        if (element === undefined || element === null) {
            element = document.createElement('div');
            // Задать ИД
            element.id = elementId;
            parent.appendChild(element);
        }

        // Задать классы
        var classList = [className, "ui-resizable"]
        var elementClassList = element.classList;
        for (var i = 0; i < classList.length; i++) {
            className_ = classList[i];
            if (!elementClassList.contains(className_)) {
                elementClassList.add(className_);
            }
        }

        // Задать события
        element.addEventListener('dblclick', function () {
            var stateId;
            
            var elementId = this.id;
            if (elementId != undefined && elementId != null) {
                stateId = getIdByElementId(elementId);
            }

            itemList.addItem(stateId)
        });
        
        // Сформировать строку внутри объекта
        element.innerHTML = '<div class="items-list" id="items-list-' + this.id + '"></div>';
        var elementItemList = element.querySelector(".items-list");
        elementItemList.classList.add('ui-sortable');

        // Задать доступные перемещения
        this.setTransmissions();
    }

    // Задать доступные перемещения
    this.setTransmissions = function () {
        var CLASS_NAME = "items-list";
        var elementId = "#" + CLASS_NAME + "-" + this.id;
        
        var element = $(elementId);
        // Сформировать переходы как ИД доступных столбцов
        element.sortable({ connectWith: "#" + CLASS_NAME + "-" + this.availableStates.join(",#" + CLASS_NAME + "-") });
    }

    this.refresh = function (data) {
        // Получить данные
        this.update(data);
       /* // Отобразить
        this.render(container);
        // Доступные изменения статуса
        this.setTransmissions(); */
    }
}