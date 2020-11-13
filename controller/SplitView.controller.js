sap.ui.define([
        "vistex/tms/controller/BaseController",
],

    function (BaseController) {
        "use strict";
        return BaseController.extend("vistex.tms.controller.SplitView", {

            onInit: function () {
                BaseController.prototype.onInit.apply(this, arguments);
            }

        });
    });
