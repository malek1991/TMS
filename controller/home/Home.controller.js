sap.ui.define([
        "vistex/tms/controller/BaseController",
        "vistex/tms/model/db/IntegrationDb",
        "sap/ui/model/json/JSONModel",
        "vistex/tms/utils/MessageHelper",
        "vistex/tms/utils/Constants"
    ],

    function (BaseController, IntegrationDb, JSONModel, MessageHelper, Constants) {
        "use strict";
        return BaseController.extend("vistex.tms.controller.Home", {

            onInit: function () {
                BaseController.prototype.onInit.apply(this, arguments);
                this.getRouter().getRoute("home").attachPatternMatched(this._onRouteMatched, this);
                this.setModel(new JSONModel({
                    PercentValue: 0,
                    WidgetName: ""
                }), "batchModel");
            },

            _onRouteMatched: function () {},


        });

    });

