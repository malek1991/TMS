sap.ui.define([
    "sap/tnt/InfoLabel",
    "sap/tnt/InfoLabelRenderer"
], function (InfoLabel, InfoLabelRenderer) {
    "use strict";
    var oInfoLabel = InfoLabel.extend("vistex.control.InfoLabel", {
        metadata: {
            properties: {
                colorSchemeName: {type: "String", defaultValue: "DarkGreen"}
            }
        },

        init: function () {
            this.colorSchemeMapping = {
                "Gold": 1,
                "Orange": 2,
                "Red": 3,
                "Pink": 4,
                "Blue": 5,
                "Turquoise": 6,
                "DarkGreen": 7,
                "LightGreen": 8,
                "Grey": 9,
                "None": 10
            }
        },

        renderer: function (oRm, oControl) {
            if (oControl.colorSchemeMapping[oControl.getColorSchemeName()]) {
                oControl.setColorScheme(oControl.colorSchemeMapping[oControl.getColorSchemeName()]);
            }
            InfoLabelRenderer.render.apply(this, arguments);
        }

    });

    // Remove this function when library version upgrades to Fiori 3
    oInfoLabel.prototype.setColorScheme = function (iColorScheme) {
        iColorScheme = this.validateProperty("colorScheme", iColorScheme);

        var iColorSchemeCurrent = this.getColorScheme();
        var $Control = this.$();

        if (iColorSchemeCurrent !== iColorScheme) {

            if (iColorScheme > 0 && iColorScheme < 11) {
                this.setProperty("colorScheme", iColorScheme, true);

                if ($Control.length) {
                    $Control.removeClass("backgroundColor" + iColorSchemeCurrent);
                    $Control.addClass("backgroundColor" + iColorScheme);
                }
            } else {
                Log.warning("colorScheme value was not set. It should be between 1 and 10");
            }
        };

        return this;
    };

    return oInfoLabel;
});