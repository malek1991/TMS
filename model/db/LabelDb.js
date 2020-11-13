sap.ui.define([
    "vistex/tms/model/BaseDb"
], function (BaseDb) {
    "use strict";

    var LabelDb = BaseDb.extend("vistex.tms.model.db.LabelDb", {});
    var LoadPromise;

    LabelDb.getLabels = function (useCache) {
        if (!LoadPromise || !useCache) {
            LoadPromise = new Promise(function (fnResolve) {
                BaseDb.callServer("GET", "/db/Labels").then(function (oData) {
                    fnResolve(oData);
                })
            })
        }
        return LoadPromise;
    };

    LabelDb.createLabel = function (oLabel) {
        return BaseDb.callServer("POST", "/db/Labels", oLabel);
    };

    LabelDb.updateLabel = function (sId, oLabel) {
        return BaseDb.callServer("PUT", "/db/Labels/" + sId, oLabel);
    };

    LabelDb.deleteLabel = function (sId) {
        return BaseDb.callServer("DELETE", "/db/Labels/" + sId);
    };
    return LabelDb;
});
