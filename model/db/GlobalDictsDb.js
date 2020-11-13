sap.ui.define([
    "vistex/tms/model/BaseDb"
], function (BaseDb) {
    "use strict";

    var GlobalDictsDb = BaseDb.extend("vistex.tms.model.db.GlobalDictsDb", {});

    GlobalDictsDb.getDictionaries = function () {
        return BaseDb.callServer( "GET", "/db/Globals/GetDictionaries");
    };

    GlobalDictsDb.getUserInfo = function () {
        return BaseDb.callServer("GET", "/db/Globals/GetUserInfo");
    }

    return GlobalDictsDb;
});
