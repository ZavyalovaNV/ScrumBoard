// Спринт
Sprint = function (_id, _text) {
    // Наследуется от признаков
    Pick.call(this);
}


// Список спринтов
SprintList = function (_connector) {
    // Наследуется от признаков
    PickList.call(this);

    // Сценарий для получения данных с сервера
    this.scriptName = "AK_SBGetSprintesData";
    // Имя признака
    this.pickName = "sprint";
    // Мультивыбор - ?
    this.multiSelect = false;
    // Подключение к Директум
    this.connector = _connector;
}


Employee = function (_id, _text) {
    this.id = _id;
    this.text = _text;

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
            var option = document.createElement("option");
            option.classList.add('select-employee-option');
            option.value = this.id;
            container.appendChild(option);
        }
        option.innerHTML = this.text;
    }
}

EmployeeList = function (_itemList) {
    // Сценарий для получения данных с сервера
    this.scriptName = "";
    // Имя признака
    this.pickName = "employee";
    // Мультивыбор - ?
    this.multiSelect = true;
    //
    this.itemList = _itemList;

    this.data = [];
    this.list = [];

    // Получить объект по ИД
    this.getItemById = function (_id) {
        // Найти нужный объект, сравнивая ИД
        var itemList = this.list;
        for (var i = 0; i < itemList.length; i++) {
            var item = itemList[i];
            if (item.id === _id) {
                return item
            }
        }
        return null;
    }

    // Данные формируются на основе элементов
    this.getData = function () {
        var data = [];

        var itemList = this.itemList;
        var items = itemList.list;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var employeeData = { "id": item.executorId, "text": item.executorName };
            data.push(employeeData);
            var employee = new Employee(employeeData.id, employeeData.text);
            this.list.push(employee);
            employee.render()
        }

        this.data = result;
        return result;
    }
    
    this.add = function (employee) {
        this.list.push(employee);
        this.data.push({ id: employee.id, text: employee.text });
        employee.render();
    }

    /*
    this.getEmployeeById = function (_id) {
        var data = this.data;
        for (var i = 0; i < data.length; i++) {
            employee = data[i];
            if (employee.id === _id) {
                return employee
            }
        }
    }*/
}


    /*
    this.id = data.id;
    this.name = data.text;

    this.render = function (container) {
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
            element.classList.add('select-sprint-option');
            element.value = this.id;
            element.innerHTML = this.name;
            container.appendChild(element);
        }
    }*/



/*
    // Добавить новый элемент в список
    this.add = function (sprint) {
        
        this.sprintList.push(sprint);
        this.data.push({ id: sprint.id, text: sprint.name });
        sprint.render();
    }

    this.getSprintById = function (_id) {
        var data = this.data;
        for (var i = 0; i < data.length; i++) {
            var sprint = data[i];
            if (sprint.id === _id) {
                return sprint
            }
        }
    }
    
    // Получить данные по спринтам по текущему проекту
    this.getData = function () {
        var data = connector.executeScript("AK_SBGetSprintesData",
            {
                sprintId: this.connector.sprintId,
                projectId: this.connector.projectId
            });
        var result = JSON.parse(data); 

        return result;
    }*/

    // Создать спринты
    /*this.createSprintList = function () {
        this.sprintList = [];
        var newSprintList = [];

        var sprintListData = this.sprintListData;
        for (var i = 0; i < sprintListData.length; i++) {
            var data = sprintListData[i];
            
            // создать новый статус
            var sprint = new Sprint(data);
            newSprintList.push(sprint);
        };

        return newSprintList;
    }

    this.render = function () {
        var container = document.getElementById("select-sprint");
        var sprintList = this.sprintList;

        for (var i = 0; i < sprintList.length; i++) {
            var sprint = sprintList[i];
            sprint.render(container);
        }
    }


    this.sprintListData = this.getData("AK_SBGetSprintesData", { projectId: connector.projectId, sprintId: connector.sprintId });
    this.sprintList = this.createSprintList();*/
