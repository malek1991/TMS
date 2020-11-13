sap.ui.define([
    "vistex/tms/model/BaseDb"
], function (BaseDb) {
    "use strict";

    var UsersDb = BaseDb.extend("vistex.tms.model.db.UsersDb", {});

    UsersDb.getUsers = function () {
        return BaseDb.callServer("GET",  "/db/Users");
    };

    UsersDb.createUser = function (oUser) {
        return BaseDb.callServer("POST",  "/db/Users", oUser);
    };

    UsersDb.updateUser = function (sId, oUser) {
        return BaseDb.callServer("PUT",  "/db/Users/" + sId, oUser);
    };

    UsersDb.deleteUser = function (sId) {
        return BaseDb.callServer("DELETE",  "/db/Users/" + sId);
    };
    return UsersDb;
});
