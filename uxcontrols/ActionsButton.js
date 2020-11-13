sap.ui.define([
    'sap/m/Button',
    'sap/m/MessageToast'
], function (Button, MessageToast) {
    'use strict';
    return Button.extend('vistex.control.ActionsButton', {
        metadata: {
            aggregations: {
                actionSheet: { 'type': 'sap.m.ActionSheet' }
            }
        },
        _onButtonPress: function (oEvent) {
            var actionSheet = this.getActionSheet();
            if (actionSheet && actionSheet[0]) {
                actionSheet[0].openBy(oEvent.getSource());
            }
        },
        onBeforeRendering: function () {
            Button.prototype.onBeforeRendering.apply(this, arguments);
            this.detachEvent('press', this._onButtonPress);
        },
        onAfterRendering: function () {
            Button.prototype.onAfterRendering.apply(this, arguments);
            this.attachEvent('press', null, this._onButtonPress);
        },
        renderer: {}
    });

});
