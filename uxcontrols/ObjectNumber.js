sap.ui.define([
    "jquery.sap.global",
    "sap/m/ObjectNumber"
], function (jQuery, Control) {
    "use strict";
    var ObjectNumber = Control.extend("vistex.control.ObjectNumber", {
        metadata: {
            properties: {
                "decimals": "sap.ui.model.type.String",
                "defaultValue": undefined,
                "disabled": {
                    "type": "Boolean",
                    "defaultValue": false
                }
            }
        },

        renderer: function (oRm, oON) {
            if (oON.getDecimals()) {
                oON.setNumber(oON.formatNumberBasedOnDecimals(oON.getNumber(), oON.getDecimals()));
            }

            if (oON.getDisabled()) {
                oRm.addStyle('opacity', 0.5);
            }
            sap.m.ObjectNumberRenderer.render.apply(this, arguments);
        },

        formatNumberBasedOnDecimals: function (iNumber, iDecimals) {
            var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
                maxFractionDigits: iDecimals,
                minFractionDigits: iDecimals
            });

            //Here we are considering that the "Number" Property will be a Number and not a string
            return oNumberFormat.format(parseFloat(iNumber));
        }
    });

    return ObjectNumber;
});