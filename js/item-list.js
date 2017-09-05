ItemList = function (_modeCompact, _connector, _stateList) {
    this.data = [];
    this.list = [];
    // Работники
    this.employeeList = new EmployeeList();

    /***********Свойства отображения*********/
    this.connector = _connector;
    // Спринт
    this.sprintId = this.connector.sprintId;
    // Проект
    this.projectId = this.connector.projectId;
    // Настройка режима отображения элементов: компактно или нет
    this.modeCompact = _modeCompact;
    // Толкьо чтение
    this.readOnly = this.connector.readOnly;
    /*  // Статусы 
      this.stateList = _stateList;*/

    // Фильтр
    this.filter = {
        _type: '',
        _employeeList: [],
        _priorityList: [],
        _dateFrom: '',
        _dateTo: '',
        _sprintId: this.sprintId,
        _projectId: this.projectId
    };

    // Сортировка
    this.sort = {
        // Значения по умолчанию
        field: 'number',
        dest: 'asc'
    }
    
    // Получить элемент из массива по его ИД
    this.getItemById = function (id) {
        var items = this.list;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemID = item.id;

            if (id === itemID) {
                return item;
            }
        }
    };

    // Получить элемент из массива JSON по его ИД
    this.getItemDataById = function (id) {
        var itemsData = this.data;
        for (var j = 0; j < itemsData.length; j++) {
            var data = itemsData[j];
            if (data.id === id) {
                return data
            }
        }
    };

    // Получить все данные по спринту/проекту
    this.getData = function () {
        var result = [];
        // Получить данные с сервера
        var resultScript = connector.executeScript("AK_SBGetItemsData",
            {
                sprintId: this.sprintId,
                projectId: this.projectId
            });
        // Если сценарий отработал корректно = вернул данные, распарсить их
        if (resultScript) {
            result = JSON.parse(resultScript);
        }
        this.data = result;
        return result;
    };

    // Очистить текущий список объектов
    this.deleteItems = function () {
        this.list = [];
    }

    // Создать новый список на основе JSON
    this.createItems = function () {
        var items = this.list;
        var itemsData = this.data;

        for (var i = 0; i < itemsData.length; i++) {
            // Элемент из JSON
            var itemData = itemsData[i];
            // создать новый элемент и добавить в список, если его еще не было
            var item = new Item(this);
            item.update(itemData);
            items.push(item);
        }
    }

    // Применить фильтр к значениям
    this.applyFilter = function () {
        var filter = this.filter;

        // Создать заново элементы из JSON
        this.deleteItems();
        this.createItems();

        // Результатом будут только подходящие под фильтр элементы
        var currentItems = this.list;
        var newItems = currentItems.filter(
            function (element, index, array) {
                var checked = element.checkByFilter(filter);
                return checked;
            }
        )
        this.list = newItems;
    }

    // Применить сортировку
    this.applySort = function () {
        var sortField = this.sort.field;
        var sortDest = this.sort.dest;

        // Коэффициент направления сортировки
        // Если сортировка по убыванию, то всё наоборот - результат умножается на -1
        var koefDest = sortDest === 'desc' ? -1 : 1;
        // Дополнительный коэффициент для сортировки, когда большее значение соответсвует меньшему: приоритет 0 выше приоритета 1
        // Для поля Приоритет - чем выше значение, тем ниже приоритет
        var koef = sortField === 'priorityId' ? -1 : 1;

        // Результатом будут отсортированные элементы
        var currentItems = this.list;
        var newItems = currentItems.sort(
            function (item1, item2) {
                // Результат сравнения:
                var result = 0;

                // В field хранится поле, по которому идет сравнение
                var value1 = item1[sortField];
                var value2 = item2[sortField];

                // Сравнение
                // Если текущие значения не отличаются - не сортировать
                if (value1 != value2) {
                    // Результат сравнения:
                    //Если compareFunction(a, b) меньше 0, сортировка поставит a по меньшему индексу, чем b, то есть, a идёт первым.
                    //Если compareFunction(a, b) вернёт 0, сортировка оставит a и b неизменными по отношению друг к другу, но отсортирует их по отношению ко всем другим элементам.Обратите внимание: стандарт ECMAscript не гарантирует данное поведение, и ему следуют не все браузеры (например, версии Mozilla по крайней мере, до 2003 года).
                    //Если compareFunction(a, b) больше 0, сортировка поставит b по меньшему индексу, чем a.
                    result = value1 < value2 ? -1 : 1;
                    result = result * koef * koefDest;
                }

                return result;
            }
        );
        this.list = newItems;
    }

    // Получить объекты из JSON с учетом фильтров и сортировок
    this.refreshItems = function () {
        // Получить данные с сервера
        this.getData();
        // Обновить
        this.update();
    }

    // Очистить область от элементов
    this.clear = function () {
        var elements = document.querySelectorAll('.item');
        for (var i = 0; i < elements.length; i++) {
            element = elements[i];
            element.parentNode.removeChild(element);
        }
    }

    // Отрисовать все элементы
    this.render = function () {
        this.clear();

        var items = this.list;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.render()
        }
    }

    // Обновить элементы 
    this.update = function () {
        // Очистить текущий список
        this.deleteItems();

        // Создать новый список
//       this.createItems();

        // Применить фильтр
        this.applyFilter();

        // Применить сортировку
        this.applySort();
    }

    // Обновить элементы - получить с сервера
    this.refresh = function () {
        // Получить данные с сервера
        this.getData();
        // Обновить
        this.update();
        // Отрисовать элементы
        this.render();
    }

    // Добавить новый элемент
    this.addItem = function () {
        event.stopPropagation();

        if (this.readOnly) {
            var msg = "Нет прав на создание новых объектов";
            alert(msg);
            return false
        }

        var item = new Item(this);
        var result = item.new(this.projectId, this.sprintId);
        if (result) {
            // Новое значение добавить в JSON массив
            this.data.push(result);
            // Обновить весь список
            this.update();
            // Отрисовать
            this.render();
        }
    }

    // Сменить режим отображения Полный/Компактный
    this.setViewMode = function (_modeCompact) {
        this.modeCompact = _modeCompact;

        // Получить все элементы
        var items = itemList.list;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.setViewMode(this.modeCompact);
        }
    }

    // Установить текущее значение фильтра и применить его
    this.setFilter = function (selector) {
        var COMPARE = {
            ".select-employee": '_employeeList',
            ".select-priority": '_priorityList',
            ".select-issue-type": '_type',
            "#plan-date-from": '_dateFrom',
            "#plan-date-to": '_dateTo',
            ".select-sprint": '_sprintId'
        };
        var element = $(selector);
        var classList = element[0].classList;
        var filterValue = element.val();
        // Если это дата - распарсить к дате
        if (classList.contains("datepicker")) {
            filterValue = $.datepicker.parseDate("dd.mm.yy", filterValue)
        } else {
            if (filterValue === undefined) {
                filterValue = element.value
            }
        }

        var filterName = COMPARE[selector];
        this.filter[filterName] = filterValue;

        this.update();
        // Отрисовать
        this.render();
    }

    // Установить текущее значение ПОЛЯ сортировки и применить её
    this.setSortField = function (element) {
        this.sort['field'] = element.value;
        this.update();
        // Отрисовать
        this.render();
    }

    // Установить текущее значение НАПРАВЛЕНИЯ сортировки и применить её
    this.setSortDest = function (element) {
        // Текущее направление сортировки
        var curSortDest = this.sort.dest;
        // Новое направление сортировки противоположно текущему
        var newSortDest = curSortDest == 'asc' ? 'desc' : 'asc';
        // Обновить настройку
        this.sort.dest = newSortDest;

        // Стиль в ависимости от направления - поменять иконку
        var elementClassList = element.classList;
        elementClassList.remove('sort-down');
        elementClassList.remove('sort-up');
        if (newSortDest === 'asc') {
            elementClassList.add('sort-up');
        } else {
            elementClassList.add('sort-down');
        };

        this.update();
        // Отрисовать
        this.render();
    }
}