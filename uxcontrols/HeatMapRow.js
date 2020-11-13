sap.ui.define([
    "sap/ui/core/Control",
], function (Control) {
    "use strict";
    var oControl = Control.extend("vistex.control.HeatMapRow", {
        metadata: {
            properties: {
                rowid: {type: "string", defaultValue: ""},
                text: {type: "string", defaultValue: ""},
                expanded: {type: "boolean", defaultValue: false}
            },
            events: {},
            aggregations: {
                rows: {"type": "vistex.control.HeatMapRow", "multiple": true, defaultValue: []},
                cells: {"type": "vistex.control.HeatMapCell", "multiple": true, defaultValue: []}
            }
        },

        init: function () {
        }
    });

    return oControl;
});