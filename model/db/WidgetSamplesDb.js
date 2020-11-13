sap.ui.define([
    "vistex/tms/model/BaseDb"
], function (BaseDb) {
    "use strict";

    var WidgetSamplesDB = BaseDb.extend("vistex.tms.model.db.WidgetSamplesDB", {});

    WidgetSamplesDB.getWidgetsSamples = function (sWidgetId) {

        if (!sWidgetId) {
            console.error("Widget ID should be defined to get Widget Details");
        }

        return BaseDb.callServer("GET", "/db/WidgetSamples/GetByWidget/" + sWidgetId);
    };

    WidgetSamplesDB.updateWidgetsSamples = function (sWidgetId, oCode) {

        if (!sWidgetId) {
            console.error("Widget ID and Data should be defined to get Widget Details");
        }

        return BaseDb.callServer("PUT", "/db/WidgetSamples/" + sWidgetId, oCode);
    };

    WidgetSamplesDB.getWidgetTemplateFromServer = function (config) {
        var result = null,
            url = "https://sergio.vistex.local/sap/bc/gtms2_wdgexplr?sap-client=025&sap-user=ramarao&sap-password=ramarao";
        $.ajax({
            url: url,
            contentType: "application/json",
            dataType: "json",
            type: "POST",
            data: JSON.stringify(config),
            async: false,
            cache: true,
            success: function (oResponse) {
                result = oResponse['Placeholders'];
            },
            error: function (oResponse) {
                console.log(oResponse);
            }
        });
        return result;
    };

    return WidgetSamplesDB;
});
