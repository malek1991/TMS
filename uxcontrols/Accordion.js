sap.ui.define([
    'sap/m/VBox'
], function (VBox) {
    'use strict';
    return VBox.extend('vistex.control.Accordion', {
        metadata: {
            properties: {
                //Expanded section index
                expandedSectionIndex: {type: "string"}
            },
            defaultAggregation: "sections",
            aggregations: {
                "sections": {type: "vistex.control.SetSection", multiple: true}
            }
        },

        renderer: {}
    });

});
