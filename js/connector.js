Connector = function (refCode, recordID) {
    this.refCode = refCode;
    this.recordID = recordID;

    this.paramList = [];
    this.application = null;
    this.component = null;

    this.getApplication = function () {
        var form = window.external.Form;
        if (form === undefined) {
            
        } else {
            this.component = form.View.Component
            this.application = component.application
        }
    }

    this.getComponent = function () {
        var component = null;

        var form = window.external.Form;

        // Если запуск вне Web Control - например, в ИЕ, получить Директум через ActiveXObject
        if (form === undefined) {
            try {
                var application = new ActiveXObject("SBLogon.LoginPoint").GetApplication("ServerName=m-sv-p-sql01;DBName=DIRECTUM_DEV;IsOSAuth=true")
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
            this.application = component.application;
        }

        return component
    }

    this.executeScript = function (scriptName, params) {
        var result = false;
        // Получить сценарий
        var application = this.application;
        if (application != null) {
            var script = application.ScriptFactory.GetObjectByName(scriptName);
            // Заполнить параметры сценария
            var paramScriptList = script.Params;
            for (paramName in params) {
                console.log(paramName);
                console.log(params[paramName]);

                paramScriptList.Add(paramName, params[paramName])
            }
            // Выполнить сценарий        
            try {
                result = script.Execute();
            }
            catch (err) {
                alert(err);
            }
        } else {
            alert("Не удалось определить приложение!")
        }
        return result
    }

    this.getComponent();
}