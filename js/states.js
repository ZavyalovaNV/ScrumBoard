State = function (data) {



    this.render = function (parrent) {
        var className = "state";
        var elementId = className + "-" + data.id;

        // Найти данный элемент, чтобы не перерисовывать при необходимости
        var element;
        element = document.getElementById(elementId);
        if (element === undefined) {
            element = document.createElement('div');
            // Задать ИД
            element.id = className + "-" + data.id;
        }

        // Задать классы
        var classList = element.classList;

        if (!classList.contains(className)) {
            element.classList.add(className);
        }
        if (!classList.contains("ui-resizable")) {
            element.classList.add("ui-resizable");
        }

        // Сформировать строку внутри объекта
        var text = '<span class="state-name">' + data.name + '</span>'
        element.innerHTML = text;

        parent.appendChild(element);
    }
}
