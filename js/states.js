State = function (data) {
    // �������� ��������
    this.update = function (data) {
        for (key in data) {
            this[key] = data[key];
        }
    }


    this.render = function (parent) {
        if (parent === undefined || parent === null) {
            throw '�� ��������� ��������� ��� �������'
        }

        var className = "state";
        var elementId = className + "-" + this.id;

        // ����� ������ �������, ����� �� �������������� ������ ���
        var element;
        element = document.getElementById(elementId);
        if (element === undefined || element === null) {
            element = document.createElement('div');
            // ������ ��
            element.id = elementId;
        }

        // ������ ������
        var classList = [className, "ui-resizable"]
        var elementClassList = element.classList;
        for (var i = 0; i < classList.length; i++) {
            className_ = classList[i];
            if (!elementClassList.contains(className_)) {
                elementClassList.add(className_);
            }
        }
        
        // ������������ ������ ������ �������
        element.innerHTML = '<span class="state-name">' + this.name + '</span>';
        parent.appendChild(element);
    }

    this.renderColumn = function (parent) {
        if (parent === undefined || parent === null) {
            throw '�� ��������� ��������� ��� �������'
        }

        var className = 'items-column';
        var elementId = className + "-" + this.id;

        var element;
        element = document.getElementById(elementId);
        if (element === undefined || element === null) {
            element = document.createElement('div');
            // ������ ��
            element.id = elementId;
        }

        // ������ ������
        var classList = [className, "ui-resizable"]
        var elementClassList = element.classList;
        for (var i = 0; i < classList.length; i++) {
            className_ = classList[i];
            if (!elementClassList.contains(className_)) {
                elementClassList.add(className_);
            }
        }

        // ������ �������
        element.addEventListener('dblclick', function () { alert(1) });
        // ������������ ������ ������ �������
        element.innerHTML = '<div class="items-list" id="items-list-' + this.id + '"></div>';
        parent.appendChild(element);
    }


    this.update(data);
}


