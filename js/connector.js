Connector = function () {
    this.application = null;
    this.component = null;

    this.projectId = 0;
    this.sprintId = 0;

    // Получить приложение DIRECTUM
    this.getApplication = function () {
        var application;
        var form = window.external.Form;
        if (form === undefined) {
            application = new ActiveXObject("SBLogon.LoginPoint").GetApplication("ServerName=m-sv-p-sql01;DBName=DIRECTUM_DEV;IsOSAuth=true")
        } else {
            application = form.View.Component.application
        }
        return application;
    }

    // Получить справочник
    this.getComponent = function () {
        var component = null;

        var form = window.external.Form;

        // Если запуск вне Web Control - например, в ИЕ, получить Директум через ActiveXObject
        if (form === undefined) {
            try {
                var application = this.getApplication();
                if (application === undefined) {
                    throw 'Не удалось подключиться к DIRECTUM. Обратитесь к администратору.'
                }
                // также записать приложение в свойства
                this.application = application;
                // Получить компоненту через тестовые значения
                component = application.ReferencesFactory.ReferenceFactory(testRefCode).GetObjectByID(testSprintID)
            }
            catch (err) {
                alert(err)
            }
        } else {
            component = form.View.Component;
            this.application = this.getApplication();
        }

        // Получить значения ключевах реквизитов из компоненты
        if (component != undefined) {
            var refCode = component.Name;

            if (refCode == 'AK_IT_Sprints') {
                this.projectId = component.Requisites("Ведущая аналитика").ValueID;
                this.sprintId = component.Requisites("ИД").Value;
            } else {
                if (refCode == 'AK_IT_Projects') {
                    this.projectId = component.Requisites("ИД").Value;
                    this.sprintId = -1;
                }
            }
            this.refCode = refCode;
        } else {
            // Заполнить тестовыми значениями
            this.projectId = testProjectID;
            this.sprintId = testSprintID;
            this.refCode = testRefCode;
        }

        return component;
    }

    // Выполнить сценарий DIR
    this.executeScript = function (scriptName, params) {
        var result = false;

        // Получить приложение
        var application = this.application;
        try {
            if (application === null || application === undefined) {
                throw 'Не удалось определить приложение DIRECTUM. Обратитесь к администратору.'
            }

            // Получить сам сценарий
            var script = application.ScriptFactory.GetObjectByName(scriptName);
            if (script === null || script === undefined) {
                throw 'Не удалось определить сценарий ' + script + ' DIRECTUM. Обратитесь к администратору.'
            }

            // Передать параметры сценария
            var paramScriptList = script.Params;
            for (paramName in params) {
                console.log(paramName + " = " + params[paramName]);
                paramScriptList.Add(paramName, params[paramName])
            }

            // Выполнить сценарий        
            result = script.Execute();
        }
        catch (err) {
            alert(err)
        }
        return result
    }

    this.component = this.getComponent();
}