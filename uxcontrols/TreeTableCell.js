sap.ui.define([
    "sap/ui/core/Control",
], function(Control) {
    "use strict";
    var oControl = Control.extend("vistex.control.TreeTableCell", {
        metadata: {
            properties: {
                valId:{type:"string", defaultValue:""},
                text:{type:"string", defaultValue:""},
                childsNumber:{type:"int", defaultValue: 0},
                expanded:{type:"boolean", defaultValue: false},
                columnId:{type:"string", defaultValue:""}
            },
            aggregations: {},
            events: {}
        },

        init: function () {
        },

        onBeforeRendering: function () {}
    });

    return oControl;
});