sap.ui.define([
    "sap/ui/core/Control",
], function (Control) {
    "use strict";
    var oControl = Control.extend("vistex.control.TreeTableColumn", {
        metadata: {
            properties: {
                "text": {type: "string", defaultValue: ""}
            },
            aggregations: {},
            events: {}
        },

        init: function () {
        },

        onBeforeRendering: function () {
        }
    });

    return oControl;
});