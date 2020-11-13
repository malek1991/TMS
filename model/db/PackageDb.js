sap.ui.define([
    "vistex/tms/model/BaseDb"
], function (BaseDb) {
    "use strict";

    var PackageDb = BaseDb.extend("vistex.tms.model.db.PackageDb", {});

    PackageDb.getPackages = function () {
        return BaseDb.callServer("GET",  "/db/Packages");
    };

    PackageDb.updatePackage = function (oUpdatedPackage) {
        return BaseDb.callServer("PUT", "/db/Packages/Update", oUpdatedPackage);
    };

    PackageDb.createPackage = function (oNewPackage) {
        return BaseDb.callServer("POST", "/db/Packages/Create", oNewPackage);
    };

    PackageDb.newPackagePreCheck = function () {
        return BaseDb.callServer("GET", "/db/Packages/NewPackagePreCheck");
    };

    PackageDb.getImplementationPackage = function () {
        return BaseDb.callServer("GET", "/db/Packages/ImplementationPackage");
    };

    return PackageDb;
});
