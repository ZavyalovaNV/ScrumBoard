StateList = function (_connector) {
    this.connector = _connector;    

    // Получить данные по спринту/проекту
    this.getData = function () {
        var params = {
            sprintId: this.connector.sprintId,
            projectId: this.connector.projectId
        }
        var result;

        if (isTesting) {
            result = states_test
        } else {
            var data = connector.executeScript("AK_SBGetStatesData", params);
            result = JSON.parse(data);
        }
        return result;
    };

    // Отрисовать статусы
    this.render = function () {
        var container = document.getElementById("states");
        var containerCols = document.getElementById("item-row");

        var states = this.states;
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            // отрисовать статус
            state.render(container);
            state.renderColumn(containerCols);
        };
    }

    // Создать статусы на основе JSON
    this.createStates = function () {
        this.states = [];
        var newStates = [];

        var statesData = this.statesData;
        for (var i = 0; i < statesData.length; i++) {
            var data = statesData[i];
            // создать новый статус
            var state = new State(data);
            newStates.push(state);
        };

        this.states = newStates;
    }

    // Получить все статусы как JSON
    this.statesData = this.getData();

    // Создать статусы
    this.createStates();
}

State = function (data) {
    // Свойства элемента
    this.update = function (data) {
        for (key in data) {
            this[key] = data[key];
        }
    }

    // Получить элемент DOM по ид
    this.getElement = function () {
        // Найти элемент с таким же ИД
        return document.getElementById("state-" + this.id);
    }

    this.render = function (parent) {
        if (parent === undefined || parent === null) {
            throw 'Не определен контейнер для статуса'
        }

        var className = "state";
        
        // Найти данный элемент, чтобы не перерисовывать каждый раз
        var element = this.getElement();        
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

        // Сформировать переходы как ИД доступных столбцов
        var availableStatesStr = "#" + CLASS_NAME + "-" + this.availableStates.join(",#" + CLASS_NAME + "-");
       
        var element = $(elementId);
        element.sortable({ connectWith: availableStatesStr });
    }

    this.update(data);
}


