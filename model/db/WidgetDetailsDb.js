sap.ui.define([
    "vistex/tms/model/BaseDb"
], function (BaseDb) {
    "use strict";

    var WidgetDetailsDB = BaseDb.extend("vistex.tms.model.db.WidgetDetailsDB", {});

    WidgetDetailsDB.getWidgetsByPackage = function (sWidgetId) {

        if (!sWidgetId) {
            console.error("Widget ID should be defined to get Widget Details");
        }

        return BaseDb.callServer("GET", "/db/Widgets/" + sWidgetId);
    };

    WidgetDetailsDB.GetFiltered = function (sPackageId, oFilterObj) {

        if (!sPackageId) {
            console.error("Package ID should be defined");
        }

        if (!oFilterObj) {
            console.error("Filter objected should be defined");
        }

        return BaseDb.callServer("POST", "/db/WidgetDetails/GetByFilter/" + sPackageId, oFilterObj);
    };

    WidgetDetailsDB.getApprovedVersion = function (sWidgetId) {

        if (!sWidgetId) {
            console.error("Widget ID should be defined to get Widget Details");
        }

        return BaseDb.callServer("GET", "/db/WidgetDetails/GetApprovedVersion/" + sWidgetId);
    };

    WidgetDetailsDB.AssignTo = function (oAssignInfo) {
        return BaseDb.callServer("POST", "/db/WidgetDetails/AssignTo", oAssignInfo);
    };

    WidgetDetailsDB.sendForApproval = function (oData) {
        return BaseDb.callServer("POST", "/db/WidgetDetails/SendForApproval", oData);
    };
    WidgetDetailsDB.saveAsDraft = function (oData) {
        return BaseDb.callServer("POST", "/db/WidgetDetails/SaveAsDraft", oData);
    };


    WidgetDetailsDB.getById = function (sWidgetId) {

        if (!sWidgetId) {
            console.error("Widget ID should be defined to get Widget Details");
        }

        return BaseDb.callServer("GET", "/db/WidgetDetails/GetById/" + sWidgetId);
    };

    WidgetDetailsDB.getWidgetDetailsByPackage = function (sPackageId) {

        if (!sPackageId) {
            console.error("Widget ID should be defined to get Widget Details");
        }

        return BaseDb.callServer("GET", "/db/WidgetDetails/GetAutoComplete/" + sPackageId);
    };

    return WidgetDetailsDB;
});
