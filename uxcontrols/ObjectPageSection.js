sap.ui.define([
    "sap/uxap/ObjectPageSection"
], function (Control) {
    "use strict";
    return Control.extend("vistex.uxap.ObjectPageSection", {
        metadata: {
            properties: {
                onDemandDataLoaded: { type: 'boolean', defaultValue: false }
            },
            events: {
                onDemand: {}
            }
        },

        init: function () {
            sap.uxap.ObjectPageSection.prototype.init.apply(this, arguments);
            this.attachOnDemand(function () {
                this.setOnDemandDataLoaded(true);
            });
        },

        renderer: {},
    });
});
