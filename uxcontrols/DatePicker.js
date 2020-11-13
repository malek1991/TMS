sap.ui.define([
    "sap/m/DatePicker"
], function (DatePicker) {
    "use strict";
    var oDatePicker = DatePicker.extend("vistex.control.DatePicker", {

        fireChange: function (oEvent) {
            if (oEvent['valid']) {
                this.setValueState(sap.ui.core.ValueState.None);
                DatePicker.prototype.fireChange.apply(this, arguments);
            } else {
                this.setValueState(sap.ui.core.ValueState.Error);
            }
        },

        renderer: function (oRm, oControl) {
            sap.m.DatePickerRenderer.render.apply(this, arguments);
        }
    });

    return oDatePicker;
});