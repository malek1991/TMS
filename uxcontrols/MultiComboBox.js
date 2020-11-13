sap.ui.define([
    "sap/m/MultiComboBox"
], function (MultiComboBox) {
    "use strict";
    var oMultiComboBox = MultiComboBox.extend("vistex.control.MultiComboBox", {
        metadata: {
            properties: {
                ondemandLoad: {
                    type: 'boolean', defaultValue: false
                },
                ondemandNoBuffer: {
                    type: 'boolean', defaultValue: false
                }
            }
        },

        renderer: {}
    });

    return oMultiComboBox;
});