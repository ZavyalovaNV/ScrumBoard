// Спринт
Sprint = function (data) {
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
    }
}

// Список спринтов
SprintList = function (_connector) {
    this.sprintList = [];
    this.connector = _connector;

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
        var params = {
            sprintId: this.connector.sprintId,
            projectId: this.connector.projectId
        }
        var result;

        if (isTesting) {
            result = sprints_test
        } else {
            var data = connector.executeScript("AK_SBGetSprintesData", params);
            result = JSON.parse(data);
        }
        return result;
    }

    // Создать спринты
    this.createSprints = function () {
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


    this.sprintListData = this.getData();
    this.sprintList = this.createSprints();
}