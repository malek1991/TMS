sap.ui.define([
    "sap/uxap/BlockBase"
], function (Control) {
    "use strict";

    var Block = Control.extend("vistex.uxap.Block", {

        metadata: {
            aggregations: {
                vistexContent: {type: 'sap.ui.core.Control', multiple: true}
            }
        },

        init: function () {
            sap.uxap.BlockBase.prototype.init.apply(this, arguments);

            var internalView = sap.ui.base.ManagedObject.create({
                "Type": "sap.ui.core.mvc.JSONView", viewContent: [], controllerName: ""
            });

            this.addAggregation("_views", internalView);
            this.setAssociation("selectedView", internalView);

            var oBlock = this;
            internalView.getContent = function () {
                return oBlock.getAggregation("vistexContent");
            }
        },

        setMode: function () {

        }
    });

    return Block;
});