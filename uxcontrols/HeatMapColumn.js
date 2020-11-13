sap.ui.define([
    "sap/ui/core/Control",
], function (Control) {
    "use strict";
    var oControl = Control.extend("vistex.control.HeatMapColumn", {
        metadata: {
            properties: {
                columnid: {type: "string", defaultValue: ""},
                text: {type: "string", defaultValue: ""}
            },
            events: {},
            aggregations: {
                columns: {"type": "vistex.control.HeatMapColumn", "multiple": true, defaultValue: []}
            }
        },

        init: function () {
        }
    });

    return oControl;
});