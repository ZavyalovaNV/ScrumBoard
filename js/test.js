isTesting = true;
isTesting = true;
console.log(isTesting);

var TESTING_COMPARE = function (_scriptName, params) {
    var result = false;

    switch (_scriptName) {
        case "AK_SBGetPickRequisitesData":
            var reqNames = params.reqNames;
            switch (reqNames) {
                case "AK_PrioritySign": result = JSON.stringify(priorities_test); break;
                case "AK_IT_IssueType": result = JSON.stringify(issueTypes_test); break;
            }

            break; 
        case "AK_SBGetSprintesData":
            result = JSON.stringify([{ "id": "testSprintID", "text": "Спринт" }]);
            break;
        case "AK_SBGetStatesData":
            result = JSON.stringify(states_test);
            break; 
        case "AK_SBGetItemsData":
            result = JSON.stringify(items_test);
            break;
    }
    
    return result
}