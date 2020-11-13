sap.ui.define([
    'sap/ui/richtexteditor/RichTextEditor',
    "sap/base/Log"
], function (RichTextEditor, Log) {
    'use strict';
    var oRichTextEditor = RichTextEditor.extend('vistex.control.RichTextEditor', {
        metadata: {
            aggregations: {},
            properties: {
                showStyles: {type: "boolean", defaultValue: true},
                showInsertTable: {type: "boolean", defaultValue: false}
            },
            events: {}
        },

        init: function () {
            sap.ui.richtexteditor.RichTextEditor.prototype.init.apply(this, arguments);
        },

        fireReady: function (oEvent) {
            sap.ui.richtexteditor.RichTextEditor.prototype.fireReady.apply(this, arguments);
            if (this.getShowStyles()) {
                this.addButtonGroup("styleselect");
            }
            if (this.getShowInsertTable()) {
                this.addButtonGroup("table");
            }
        },

        // Overriding this function so as to allow any instance of button to be added inside the Custom Toolbar
        addCustomButton: function () {
            var sMethodPrefix = "add";
            var bChainable = /^(add|insert|destroy)/.test(sMethodPrefix);

            var vResult = null,
                oItem = arguments[0],
                oToolbarWrapper = this.getAggregation("_toolbarWrapper");

            // As we can't limit the aggregation type to sap.m.Button, the check should be performed manually
            if (typeof oItem === "object" && !(oItem instanceof sap.m.Button)) {
                Log.error("Only instance of sap.m.Button is allowed as aggregation.");
                return bChainable ? this : undefined;
            }

            if (oToolbarWrapper && oToolbarWrapper.modifyToolbarContent) {
                vResult = oToolbarWrapper.modifyToolbarContent.bind(oToolbarWrapper, sMethodPrefix).apply(oToolbarWrapper, arguments);
            } else {
                vResult = this["addAggregation"].bind(this, "customButtons").apply(this, arguments);
            }

            return bChainable ? this : vResult;
        },

        renderer: {}
    });

    return oRichTextEditor;
});