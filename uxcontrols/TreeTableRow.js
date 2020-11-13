sap.ui.define([
    "sap/ui/core/Control",
], function (Control) {
    "use strict";
    var oControl = Control.extend("vistex.control.TreeTableRow", {
        metadata: {
            properties: {
                rowId: {type: "string", defaultValue: ""},
                availibility: {type: "int", defaultValue: 0},
                color: {type: "string", defaultValue: "#FFF"},
                availibilityText: {type: "string", defaultValue: ""}
            },
            aggregations: {
                cells: {type: "vistex.control.TreeTableCell", multiple: true},
                rows: {type: "vistex.control.TreeTableRow", multiple: true}
            },
            events: {}
        },

        init: function () {
        },

        onBeforeRendering: function () {
        }
    });

    return oControl;
});