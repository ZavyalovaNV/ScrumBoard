var TEMPLATE_ITEM = document.querySelector('#template_item').innerHTML;

var data = new Object();
data.id = 1;
data.state = "111";
var data1 = new Object();

for (key in data) {
    data1[key] = data[key];
    /* ... ������ ���-�� � obj[key] ... */
}
console.log(data1);


Item = function (data) {
    // �������� ��������
    this.update = function (data) {
        for (key in data) {
            this[key] = data[key];
        }
    }

    // ��������� ��������
    this.render = function () {
        // ���������� ��������� ��������
        var textElement = element.querySelector(".item-text");
        textElement.innerHTML = data.text;
        // ���������� �����������
        // � ������ ������
        var executorElement = element.querySelector(".item-executor-img");
        executorElement.setAttribute("src", "css\\img\\avatars\\" + data.executorPhoto);
        executorElement.setAttribute("title", data.executorName);
        // � ���������� ������
        var executorCompactElement = element.querySelector('.item-executor-img-compact');
        executorCompactElement.setAttribute("src", "css\\img\\user.svg");
        executorCompactElement.setAttribute("title", data.executorName);
        var executorCompactElementName = element.querySelector('.item-executor-compact span');
        executorCompactElementName.innerHTML = data.executorName;
        // ���������� ���������
        var priorityElement = element.querySelector(".item-priority");
        priorityElement.innerHTML = data.priority;
        // ���������� �������� ����
        var planDateElement = element.querySelector(".item-plan-date");
        planDateElement.innerHTML = data.planDate;
        // ���������� �������� ������������
        var planHoursElement = element.querySelector(".item-plan-hours");
        if (data.planHours != '' && data.planHours != undefined) {
            planHoursElement.innerHTML = '<img src="css/img/clock.svg" width="12px" height="12px"/>' + data.planHours + ' �.';
        } else {
            planHoursElement.innerHTML = '';
        }
        // ���������� �����
        var numberElement = element.querySelector(".item-number");
        numberElement.innerHTML = data.number;

        // ��������� �������
        // ���������� ��� ��������
        element.classList.remove('defect');
        element.classList.remove('wish');
        if (data.issueTypeId == '1') {
            element.classList.add('defect');
        };
        if (data.issueTypeId == '2') {
            element.classList.add('wish');
        };

        // ���������� �����. ���������� ������� �������
        setItemViewMode(modeCompact, element);

        return element;
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

var data = new Object();
data.id = 1;
data.state = "22";

item = new Item(data);
console.dir(item);

data.state = "33";
console.dir(data);
item.update(data);
console.dir(item);