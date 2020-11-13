sap.ui.define([
    "vistex/tms/model/BaseDb"
], function (BaseDb) {
    "use strict";

    var GroupsDb = BaseDb.extend("vistex.tms.model.db.GroupsDb", {});

    GroupsDb.getGroups = function () {
        return BaseDb.callServer( "GET", "/db/WidgetGroups");
    };

    GroupsDb.createGroup = function (oGroup) {
        return BaseDb.callServer( "POST", "/db/WidgetGroups", oGroup);
    };

    GroupsDb.updateGroup = function (iId, oGroup) {
        return BaseDb.callServer("PUT",  "/db/WidgetGroups/" + iId, oGroup);
    };

    GroupsDb.deleteGroup = function (iId) {
        return BaseDb.callServer("DELETE",  "/db/WidgetGroups/" + iId);
    };
    return GroupsDb;
});
