Connector = function (refCode_, recordID_) {
    this.refCode = refCode_;
    this.recordID = recordID_;

    this.getComponent = function () {
        var form = window.external.Form;
        if (form === undefined) {
            try {
                var obj = CreateObject("SBLogon.LoginPoint");
                application = new ActiveXObject("SBLogon.LoginPoint").GetApplication("ServerName=m-sv-p-sql01;DBName=DIRECTUM_DEV;IsOSAuth=true")
                if (application === undefined) {
                    throw 'Не удалось подключиться к DIRECTUM. Обратитесь к администратору.'
                }
                return application.ReferencesFactory.ReferenceFactory(this.refCode).GetObjectByID(this.recordID);
            }
            catch (err) {
            }
        }
    }

    this.executeScript = function (scriptName, params) {
        component
    }
}