// Признак
Pick = function (data) {
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
            element.classList.add('select-pick-option');
            element.value = this.id;
            element.innerHTML = this.name;
            container.appendChild(element);
        }
    }
}

// Список признаков
PickList = function (_connector, _scriptName, _pickName, _multiSelect) {
    this.pickList = [];
    this.scriptName = _scriptName;
    this.pickName = _pickName;
    this.connector = _connector;
    this.multiSelect = _multiSelect;

    this.add = function (pick) {
        this.pickList.push(pick);
        this.data.push({ id: pick.id, text: pick.text });
        pick.render();
    }

    // Получить данные по признакам по текущему проекту
    this.getData = function () {
        var params = {
            projectId: this.connector.projectId,
            ReqNames: this.pickName
        }
        
        var data = connector.executeScript(this.scriptName, params);
        var result = JSON.parse(data);
        
        // Если нет мультивыбора, добавить "Все" в начало массива
        if (!this.multiSelect) {
            result.unshift({ "id": "-1", "text": "Все" });            
        }

        return result;
    }

    // Создать признаки
    this.createPicks = function () {
        this.pickList = [];
        var newPickList = [];

        var pickListData = this.pickListData;
        for (var i = 0; i < pickListData.length; i++) {
            var data = pickListData[i];
            
            // создать новый статус
            var pick = new Pick(data);
            newPickList.push(pick);
        };

        return newPickList;
    }

    this.render = function (selector) {
        //var container = document.getElementById(selector);
        var pickList = this.pickListData;
        /*
        for (var i = 0; i < pickList.length; i++) {
            var pick = pickList[i];
            pick.render(container);
        }*/
        $(selector).select2({
            data: pickList
        });
    }


    this.pickListData = this.getData();
    this.pickList = this.createPicks();
}