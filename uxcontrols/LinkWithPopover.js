sap.ui.define([
    'sap/m/Link'
], function (Link) {
    'use strict';
    return Link.extend('vistex.control.LinkWithPopover', {
        metadata: {
            properties: {
                preventDefault: {type: 'boolean', defaultValue: false},
            },
            aggregations: {
                popover: {type: 'sap.m.Popover', multiple: false}
            }
        },

        onLinkPress: function (oEvent) {
            var popover = this.getPopover();
            if (popover) {
                popover.openBy(oEvent.getSource());
            }
        },

        onBeforeRendering: function () {
            Link.prototype.onBeforeRendering.apply(this, arguments);
            this.detachEvent('press', this.onLinkPress);
        },

        onAfterRendering: function () {
            Link.prototype.onAfterRendering.apply(this, arguments);
            if (!this.getPreventDefault()) {
                this.attachEvent('press', null, this.onLinkPress);
            }
        },

        renderer: {}
    });

});
