sap.ui.define([
    "vistex/tms/model/BaseDb"
], function (BaseDb) {
    "use strict";

    var IntegrationDb = BaseDb.extend("vistex.tms.model.db.IntegrationDb", {});

    IntegrationDb.importWidgetGroups = function () {
        return BaseDb.callServer("GET", "/int/Import/Groups");
    };

    IntegrationDb.importWidgets = function () {
        return BaseDb.callServer("GET", "/int/Import/Widgets");
    };


    IntegrationDb.getWidgetDetailsByApprovedVersion = function (packageId) {
        return BaseDb.callServer("GET", "/int/BatchJobs/GetApprovedWidgetDetails/" + packageId);
    };

    IntegrationDb.createNewVersionOfWidgetDetail = function (oData) {
        return BaseDb.callServer("POST", "/int/BatchJobs/CreateNewVersionOfWidgetDetail/", oData);
    };


    return IntegrationDb;
});
