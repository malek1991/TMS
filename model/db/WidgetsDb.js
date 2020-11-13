sap.ui.define([
    "vistex/tms/model/BaseDb"
], function (BaseDb) {
    "use strict";

    var WidgetsDb = BaseDb.extend("vistex.tms.model.db.WidgetsDb", {});

    WidgetsDb.getWidgetsByPackage = function (sPackageId) {

        if (!sPackageId) {
            console.error("Package ID should be defined to get list of Widges");
        }

        return BaseDb.callServer("GET", "/db/Widgets/GetByPackage/" + sPackageId);
    };

    WidgetsDb.createWidgetByDetails = function (sPackageId, oData) {

        if (!sPackageId || !oData) {
            console.error("Package ID should be defined to get list of Widges");
        }

        return BaseDb.callServer("GET", "/db/Widgets/GetByPackage/" + sPackageId, oData, true);
    };


    WidgetsDb.getEmptyObject = function () {
        return BaseDb.callServer("GET", "/db/Widgets/GetEmptyObject");
    };

    WidgetsDb.save = function (object) {
        return BaseDb.callServer("POST", "/db/Widgets/Save", object, true);
    };

    WidgetsDb.saveAsDraft = function (object) {
        return BaseDb.callServer("POST", "/db/Widgets/SaveAsDraft", object, true);
    };

    WidgetsDb.Approve = function (sWidgetId) {
        return BaseDb.callServer("POST", "/db/Widgets/Approve/" + sWidgetId);
    };

    WidgetsDb.Reject = function (oObj) {
        return BaseDb.callServer("POST", "/db/Widgets/Reject", oObj);
    };

    WidgetsDb.getWidgetById = function (sWidgetId) {
        return BaseDb.callServer("GET", "/db/Widgets/" + sWidgetId);
    };

    WidgetsDb.getDetailWithSample = function (sWidgetId) {
        return BaseDb.callServer("GET", "/db/Widgets/GetDetailWithSample/" + sWidgetId);
    };

    WidgetsDb.changeGroup = function (sWidgetId, sGroupId) {
        if (!sWidgetId) {
            console.error("Widget ID should be defined to change the Group");
        }

        if (!sGroupId) {
            sGroupId = -1;

        }

        return BaseDb.callServer("PUT", "/db/Widgets/ChangeGroup/" + sWidgetId + "/" + sGroupId);
    };

    WidgetsDb.ChangeDesignUrl = function (sWidgetId, url) {
        if (!sWidgetId) {
            console.error("Widget ID should be defined to change the URL");
        }
        return BaseDb.callServer("PUT", "/db/Widgets/ChangeDesignUrl/" + sWidgetId, {DesignUrl: url});
    };

    WidgetsDb.deleteWidget = function (iId) {
        return BaseDb.callServer("DELETE",  "/db/Widgets/" + iId);
};

    WidgetsDb.updateWidgetTechName = function (iId, sNewTechName) {
        return BaseDb.callServer("PUT",  "/db/Widgets/ChangeTechName/" + iId + "/" + sNewTechName);
    };

    WidgetsDb.setDeprecated = function (iId) {
        return BaseDb.callServer("PUT",  "/db/Widgets/Deprecate/" + iId);
    };

    return WidgetsDb;
});
