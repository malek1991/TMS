sap.ui.define([
    "sap/m/ComboBox"
], function (ComboBox) {
    "use strict";
    var oComboBox = ComboBox.extend("vistex.m.ComboBox", {
        metadata: {
            properties: {
                previousKey: 'string',
                ondemandLoad: {
                    type: 'boolean', defaultValue: false
                },
                ondemandNoBuffer: {
                    type: 'boolean', defaultValue: false
                }

            }
        },

        fireChange: function (oEvent) {
            var sSelectedKey = this.getSelectedKey();
            var sValue = oEvent['value'];

            if (!sSelectedKey && sValue) {
                this.setValueState(sap.ui.core.ValueState.Error);
            } else {
                this.setValueState(sap.ui.core.ValueState.None);
                sap.m.ComboBox.prototype.fireChange.apply(this, arguments);
            }
        },

        renderer: function (oRm, oControl) {
            sap.m.ComboBoxRenderer.render.apply(this, arguments);
        }
    });

    return oComboBox;
});