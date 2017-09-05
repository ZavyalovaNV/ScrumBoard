// Признак
Pick = function (_id, _text) {
    this.id = _id;
    this.text = _text;

    // Отрисовать элемент признака в контейнере container
    this.render = function (container, pickClassName) {
        if (container != undefined && container != null) {
            // Объекты для выбора
            var optionList = container.options;
            if (optionList != undefined && optionList != null) {
                // Найти признак в списке
                var founded = false,
                    option;
                console.dir(optionList);

                for (var i = 0; i < optionList.length; i++) {
                    option = optionList[i];
                    founded = option.value === this.id;
                    if (founded) { break; }
                }
                // Если не был найден - создать
                if (!founded) {
                    // Создать признак в списке
                    option = document.createElement("option");
                    option.classList.add('select-pick-option');
                    option.value = this.id;
                    container.appendChild(option);
                }
                // Обновить текст
                option.innerHTML = this.text;
            }
        }
    }
}

// Список признаков
PickList = function (_scriptName, _pickName, _multiSelect, _pickClassName) {
    this.list = [];
    this.data = [];

    // Имя признака
    this.scriptName = _scriptName;
    // Имя признака
    this.pickName = _pickName;
    // Мультивыбор - ?
    this.multiSelect = _multiSelect;

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

    // Добавление нового признака в спимок
    this.add = function (item, pickClassName) {
        // Проверить, что в текущем списке нет добавляемого элемента
        var item = this.getItemById(item.id);
        if (item != null) {
            // Добавить новый элемент в локальный список
            this.list.push(item);
            // И в список данных
            this.data.push({ id: item.id, text: item.text });
            // Отрисовать
            item.render(pickClassName);
        }
    }

    // Получить данные по признакам по текущему проекту
    this.getData = function (params) {
        var result = false;
        // К основному списку параметров добавить имя признака
        params["reqNames"] = this.pickName;

        // Выполнить скрипт
        var resultScript = connector.executeScript(this.scriptName, params);

        // Если возвращено true или данные, обработать результат
        if (resultScript) {
            result = JSON.parse(resultScript);
            // Если нет мультивыбора, добавить "Все" в начало массива
            if (!this.multiSelect) {
                result.unshift({ "id": "-1", "text": "Все" });
            }
        }

        this.data = result;
        return result;
    }

    // Создать признаки
    this.create = function () {
        // Очистить текущий список признаков
        this.list = [];
        // Список новых данных - результирующий список
        var result = [];
        // Текущий список признаков с сервера
        var listData = this.data;

        for (var i = 0; i < listData.length; i++) {
            var data = listData[i];

            // Создать новый статус
            var item = new Pick(data.id, data.text);
            result.push(item);
        };

        this.list = result;
        return result;
    }

    // Отрисовать признаки (т.к. для отображения признаков используется библиотека JQuery Select2 - используются её методы)   
    this.render = function (selector) {
        var pickList = this.data;
        $(selector).select2({
            data: pickList
        });
    }

    // Обновить список: получить данные + актуализироват локальные данные + отобразить
    this.refresh = function (params, selector, pickClassName) {
        // Получить актуальные данные с сервера
        this.getData(params);
        // Создать локальные объекты
        this.create();
        // Отобразить
        this.render(selector, pickClassName);
    }
}