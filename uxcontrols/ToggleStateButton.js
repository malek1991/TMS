sap.ui.define([
    'sap/m/Button'
], function (Button) {
    'use strict';
    var ButtonControl = Button.extend('vistex.control.ToggleStateButton', {
        metadata: {
            properties: {
                editMode: {'type': 'boolean', defaultValue: false}
            }
        },

        firePress: function (oEvent) {
            this.setEditMode(!this.getEditMode());

            sap.m.Button.prototype.firePress.apply(this, arguments);
        },

        renderer: {}
    });

    return ButtonControl;
});
