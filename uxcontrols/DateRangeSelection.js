sap.ui.define([
    "sap/m/DateRangeSelection"
], function (DateRangeSelection) {
    "use strict";
    var oDateRangeSelection = DateRangeSelection.extend("vistex.m.DateRangeSelection", {

        metadata: {
            properties: {
                lowValue: {
                    type: 'string',
                    defaultValue: ''
                },
                highValue: {
                    type: 'string',
                    defaultValue: ''
                }
            }
        },
        fireChange: function (oEvent) {
            if (oEvent['valid']) {
                this.setValueState(sap.ui.core.ValueState.None);
                sap.m.DateRangeSelection.prototype.fireChange.apply(this, arguments);
            } else {
                this.setValueState(sap.ui.core.ValueState.Error);
            }
        },
        onBeforeRendering: function () {
            if (this.getProperty('lowValue') && this.getProperty('highValue')) {
                var delimiter = this.getDelimiter();
                this.setValue(this.getProperty('lowValue') + " " + delimiter + " " + this.getProperty('highValue'));
            } else if (this.getProperty('lowValue')) {
                this.setValue("" + this.getProperty('lowValue'));
            } else {
                this.setValue('');
            }
            this.attachEvent('change', function () {
                    var oValue = this.getValue().split(this.getDelimiter()).map(function (date) {
                        return date.trim()
                    }), from, to;
                    from = oValue[0];
                    to = oValue[1];
                    this.setLowValue(from);
                    this.setHighValue(to);
                }
            );
        },
        renderer: {}
    })

    return oDateRangeSelection;
});


