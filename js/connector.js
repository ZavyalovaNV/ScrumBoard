Connector = function (refCode, recordID) {
    this.refCode = refCode;
    this.recordID = recordID;

    this.paramList = [];
    this.application = null;
    this.component = null;

    // Приложение DIRECTUM
    this.getApplication = function () {
        var form = window.external.Form;
        if (form === undefined) {
            var application = new ActiveXObject("SBLogon.LoginPoint").GetApplication("ServerName=m-sv-p-sql01;DBName=DIRECTUM_DEV;IsOSAuth=true")
        } else {
            application = form.View.Component.application
        }

        console.dir(application);
        return application;
    }

    // Справочник
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
                component = application.ReferencesFactory.ReferenceFactory(this.refCode).GetObjectByID(this.recordID)
            }
            catch (err) {
                alert(err)
            }
        } else {
            component = form.View.Component;
            this.application = this.getApplication();
        }

        console.dir(component);
        return component;
    }

    this.executeScript = function (scriptName, params) {
        var result = false;
        // Получить сценарий
        var application = this.application;
        try {
            if (application === null) {
                throw 'Не удалось определить приложение DIRECTUM. Обратитесь к администратору.'
            }

            var script = application.ScriptFactory.GetObjectByName(scriptName);
            if (script === null) {
                throw 'Не удалось определить сценарий ' + script + ' DIRECTUM. Обратитесь к администратору.'
            }
            // Заполнить параметры сценария
            var paramScriptList = script.Params;
            for (paramName in params) {
                console.log(paramName);
                console.log(params[paramName]);

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

    this.getComponent();
}