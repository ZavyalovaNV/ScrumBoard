var TEMPLATE_ITEM = document.querySelector('#template_item').innerHTML;

Item = function (data) {
    // �������� ��������
    this.update = function (data) {
        for (key in data) {
            this[key] = data[key];
        }
    }

    // ��������� ��������
    this.render = function () {
        var className = "item";
        var element;
        // ����� ������� � ����� �� ��
        var elementId = className + "-" + this.id;

        element = document.getElementById(elementId);
        if (element === undefined || element === null) {
            element = document.createElement('div');
            // ������ ��
            element.id = elementId;
            element.innerHTML = document.querySelector('#template_item').innerHTML;
        }

        // ������������ ������ �������� � �� ��������
        var compareValues = {
            '.item-text': this.text,
            '.item-priority': this.priority,
            '.item-plan-date': this.planDate,
            '.item-plan-hours': this.planHours,
            '.item-executor-compact span': this.executorName,
            ".item-number": this.number
        };
        // �������������� ��� ��������
        var compareImages = {
            ".item-executor-img": ["css\\img\\avatars\\" + this.executorPhoto, this.executorName],
            ".item-executor-img-compact": ["css\\img\\user.svg", this.executorName]
        };

        var innerElement;
        for (key in compareValues) {
            innerElement = element.querySelector(key);
            if (innerElement !== null) {
                innerElement.innerHTML = compareValues[key];
            }
        }
        for (key in compareImages) {
            innerElement = element.querySelector(key);
            if (innerElement !== null) {
                var arr = compareValues[key];
                innerElement.setAttribute("src", arr[0]);
                innerElement.setAttribute("title", arr[1]);
            }
        }

        // ���������� ��� ��������
        element.classList.remove('defect');
        element.classList.remove('wish');
        if (this.issueTypeId == '1') {
            element.classList.add('defect');
        };
        if (this.issueTypeId == '2') {
            element.classList.add('wish');
        };


        var parent = document.getElementById()

        //if (data.planHours != '' && data.planHours != undefined) {
        //    planHoursElement.innerHTML = '<img src="css/img/clock.svg" width="12px" height="12px"/>' + data.planHours + ' �.';
        //} else {
        //    planHoursElement.innerHTML = '';
        //}

        
        // ���������� �����. ���������� ������� �������
        //setItemViewMode(modeCompact, element);

        //return element;
    }

    // ����� ���������� ��������
    this.refresh = function () {
        try {
            var textData = executeScript('AK_SBRefreshItem', this.projectID, this.sprintID, this.id, readOnly);
            var data = JSON.parse(textData);
            this.update(data);
        }
        catch (err) {
            alert(err);
        };
    }

    // ����� �������� ��������
    this.open = function () {
        var result = executeScript('AK_SBOpenItem', this.projectID, this.sprintID, this.id, readOnly);
        if (result) {
            // �������� ���� ������ ��������, �.�. ����� ������� �����/�������
            items = getData(this.projectID, this.sprintID, true);
        }
    }

    // ����� �������� ��������
    this.delete = function () {
        var result = executeScript('AK_SBDeleteItem', this.projectID, this.sprintID, this.id, readOnly);
        // ������� ������ � HTML
        var element = document.getElementById("item-" + this.id);
        if (element === undefined) {
            element.parentNode.removeChild(element);
        }
    }

    // ����� ���������� ��������
    this.add = function () {
        var data = executeScript('AK_SBCreateItem', filterProjectID, filterSprintID, 0, readOnly);
        if (result) {
            // �������� ���� ������ ��������, �.�. ����� ������� �����/�������
            items = getData(this.projectID, this.sprintID, true);
        }
    }

    // ����� ����� ������� ��������
    

    // ����� ����� ����������� ��������
    this.changeExecutor = function () {
        try {
            var result = executeScript('AK_SBChangeExecutorItem', this.projectID, this.sprintID, this.id, readOnly);
            if (result) {
                this.refresh();
            }
        }
        catch (err) {
            alert(err);
        }
    }

    this.update(data);
}