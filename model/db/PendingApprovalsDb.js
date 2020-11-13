sap.ui.define([
    "vistex/tms/model/BaseDb"
], function (BaseDb) {
    "use strict";

    var PendingApprovalsDb = BaseDb.extend("vistex.tms.model.db.PendingApprovalsDb", {});

    PendingApprovalsDb.GetReadyForApprovalByPackage = function (sPackageId) {
        return BaseDb.callServer("GET",  "/db/Widgets/GetReadyForApprovalByPackage/" + sPackageId);
    };




    return PendingApprovalsDb;
});
