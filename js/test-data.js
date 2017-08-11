/*Тестовые значения*/
var testSprintID = 1556288;
var testProjectID = 1543890;
var testRefCode = 'AK_IT_Sprints';
var isTesting = true;


var states_test = [
{ "id": "873357", "name": "Зарегистровано", "availableStates": [873363, 873359, 873358, 873360] },
{ "id": "873358", "name": "Проектирование", "availableStates": [873359, 873358] },
{ "id": "873359", "name": "Разработка", "availableStates": [873360, 873358] },
{ "id": "873360", "name": "Тестирование", "availableStates": [873363, 873359] },
{ "id": "873363", "name": "Выполнено", "availableStates": [873358, 873359, 873360] }
];

var priorities_test = [
{ "id": "0", "name": "Сверхсрочно" },
{ "id": "1", "name": "Наивысший" },
{ "id": "2", "name": "Высокий" },
{ "id": "3", "name": "Средний" },
{ "id": "4", "name": "Низкий" },
{ "id": "5", "name": "Минимальный" }
];

var issueTypes_test = [
{ "id": "1", "name": "Дефект" },
{ "id": "2", "name": "Пожелание" }
];

var items_test = [
{ "stateId": "873359", "project": "1543890", "sprint": "1556288", "id": "1556296", "link": "", "text": "При изменении масштаба страницы галочка &quot;Запомнить&quot; масштабируется обратнопропорционально", "executorId": "853828", "executorName": "Тишин Александр Викторович", "executorPhoto": "853828.jpg", "priority": "Средний", "priorityId": "3", "issueType": "Дефект", "issueTypeId": "1", "planDate": "28.10.2016", "number": "095-003", "planHours": "20" },
{ "stateId": "873360", "project": "1543890", "sprint": "1556288", "id": "1556298", "link": "", "text": "При изменении масштаба страницы галочка &quot;Запомнить&quot; масштабируется обратнопропорционально", "executorId": "1149425", "executorName": "Завьялова Наталия Владимировна", "executorPhoto": "1149425.jpg", "priority": "Средний", "priorityId": "3", "issueType": "Дефект", "issueTypeId": "1", "planDate": "10.08.2016", "number": "095-004", "planHours": "101" },
{ "stateId": "873360", "project": "1543890", "sprint": "1556288", "id": "1556594", "link": "", "text": "Ну а теперь???", "executorId": "1149425", "executorName": "Завьялова Наталия Владимировна", "executorPhoto": "1149425.jpg", "priority": "Средний", "priorityId": "3", "issueType": "Дефект", "issueTypeId": "1", "planDate": "22.10.2016", "number": "095-007", "planHours": "100" },
{ "stateId": "873360", "project": "1543890", "sprint": "1556288", "id": "1556620", "link": "", "text": "Тестовое добавление", "executorId": "1149425", "executorName": "Завьялова Наталия Владимировна", "executorPhoto": "1149425.jpg", "priority": "Минимальный", "priorityId": "5", "issueType": "Дефект", "issueTypeId": "1", "planDate": "10.10.2016", "number": "095-008", "planHours": "" },
{ "stateId": "873360", "project": "1543890", "sprint": "1556288", "id": "1556592", "link": "", "text": "Еще одна запись", "executorId": "1460421", "executorName": "Дорфман Данил Романович", "executorPhoto": "1460421.jpg", "priority": "Средний", "priorityId": "3", "issueType": "Дефект", "issueTypeId": "1", "planDate": "20.10.2016", "number": "095-006", "planHours": "450" },
{ "stateId": "873360", "project": "1543890", "sprint": "1556288", "id": "1556590", "link": "", "text": "Новая добавленная запись1", "executorId": "1548888", "executorName": "Черепанов Андрей Вадимович", "executorPhoto": "no_image.png", "priority": "Средний", "priorityId": "3", "issueType": "Пожелание", "issueTypeId": "2", "planDate": "01.10.2016", "number": "095-005", "planHours": "" },
{ "stateId": "873359", "project": "1543890", "sprint": "1556288", "id": "1562149", "link": "", "text": "создано по фильтру 2", "executorId": "1149425", "executorName": "Завьялова Наталия Владимировна", "executorPhoto": "1149425.jpg", "priority": "Минимальный", "priorityId": "5", "issueType": "Пожелание", "issueTypeId": "2", "planDate": "", "number": "095-011", "planHours": "" }
];
