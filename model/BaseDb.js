sap.ui.define([
    "sap/ui/base/ManagedObject",
    "vistex/tms/model/DbManager"
], function (ManagedObject, DbManager) {
    "use strict";

    var BaseDb = ManagedObject.extend("vistex.tms.model.BaseDb", {
        metadata: {
            properties: {},
            events: {}
        }
    });

    BaseDb.callServer = function (method, apiUrl, payload, async) {
        return DbManager.callServer(method, apiUrl, payload, async);
    };

    return BaseDb;
});
