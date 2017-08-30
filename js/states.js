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
                var arr = elementId.split("-");
                stateId = arr[arr.length - 1];
            }

            itemList.addNew(stateId)
        });
        // Сформировать строку внутри объекта
        element.innerHTML = '<div class="items-list" id="items-list-' + this.id + '"></div>';
    }


    this.update(data);
}


