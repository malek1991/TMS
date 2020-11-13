sap.ui.define([
    "jquery.sap.global",
    "sap/m/Label"
], function (jQuery, Control) {
    "use strict";

    var Label = Control.extend("vistex.control.Label", {
        metadata: {
            properties: {
                "disabled": {
                    "type": "Boolean",
                    "defaultValue": false
                }
            }
        },

        renderer: function (rm, oLabel) {
            if (oLabel.getDisabled()) {
                rm.addStyle('opacity', 0.5);
            }
            sap.m.LabelRenderer.render.apply(this, arguments);
        }
    })

    return Label;
});