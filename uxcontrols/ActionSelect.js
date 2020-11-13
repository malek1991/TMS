sap.ui.define([
    'sap/m/ActionSelect'
], function (ActionSelect) {
    'use strict';
    return ActionSelect.extend('vistex.control.ActionSelect', {

        metadata: {
            aggregations: {
                actionSelectButtons: {'type': 'sap.m.Button'}
            }
        },

        onBeforeRendering: function () {
            ActionSelect.prototype.onBeforeRendering.apply(this, arguments);
            var oButtons = this.getActionSelectButtons();
            var _this = this;
            oButtons.forEach(function (btnObj) {
                _this.addButton(btnObj);
            })
        },

        renderer: {}

    });

});
