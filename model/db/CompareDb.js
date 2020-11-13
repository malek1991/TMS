sap.ui.define([
    "vistex/tms/model/BaseDb"
], function (BaseDb) {
    "use strict";

    var CompareDb = BaseDb.extend("vistex.tms.model.db.CompareDb", {});

    CompareDb.getWidgetDetails = function (sId) {
        return BaseDb.callServer("GET",  "/db/Widgets/" + sId);
    };

    return CompareDb;
});
