State = function (data) {
    // Свойства элемента
    this.update = function (data) {
        for (key in data) {
            this[key] = data[key];
        }
    }


    this.render = function (parent) {
        if (parent === undefined || parent === null) {
            throw 'Не определен контейнер для статуса'
        }

        var className = "state";
        var elementId = className + "-" + this.id;

        // Найти данный элемент, чтобы не перерисовывать каждый раз
        var element;
        element = document.getElementById(elementId);
        if (element === undefined || element === null) {
            element = document.createElement('div');
            // Задать ИД
            element.id = elementId;
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
        parent.appendChild(element);
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
        element.addEventListener('dblclick', function () { alert(1) });
        // Сформировать строку внутри объекта
        element.innerHTML = '<div class="items-list" id="items-list-' + this.id + '"></div>';
        parent.appendChild(element);
    }


    this.update(data);
}


