sap.ui.define([
    "sap/m/StandardTreeItem",
    "sap/m/StandardTreeItemRenderer"
], function (StandardTreeItem, StandardTreeItemRenderer) {
    "use strict";
    var oStandardTreeItem = StandardTreeItem.extend("vistex.control.StandardTreeItem", {
        metadata: {
            properties: {
                showSelectionCounter: {type: "boolean", defaultValue: true}
            }
        },

        init: function () {
            sap.m.StandardTreeItem.prototype.init.call(this);
            // StandardTreeItemRenderer.renderLIContent = function (rm, oLI) {
            //
            //     // render icon control
            //     if (oLI.getIcon()) {
            //         rm.renderControl(oLI._getIconControl());
            //     }
            //
            //     var sTitle = oLI.getTitle();
            //     if (oLI.getShowSelectionCounter && oLI.getShowSelectionCounter()) {
            //         var iCount = oLI._getSelectionCount();
            //         if (iCount) {
            //             sTitle = sTitle + ' (' + oLI._getSelectionCount() + ')';
            //         }
            //     }
            //
            //     rm.writeEscaped(sTitle);
            //
            // };
        },

        _getSelectionCount: function () {
            var aArrayNames = this._getArrayNames();
            var sModelName = this.getParent().getBindingInfo("items").model;
            var iCount = 0;

            for (var i = 0; i < aArrayNames.length; i++) {
                var aNodes = this.getBindingContext(sModelName).getObject()[aArrayNames[i]];

                if (aNodes) {
                    for (var j = 0; j < aNodes.length; j++) {
                        if (aNodes[j][this.getBindingPath('selected')]) {
                            iCount++;
                        }
                    }
                }
            }

            return iCount;
        },

        _getArrayNames: function () {
            var aArrayNames = [];
            if (this.getParent().getBindingInfo("items")
                && this.getParent().getBindingInfo("items").parameters
                && this.getParent().getBindingInfo("items").parameters.arrayNames
                && this.getParent().getBindingInfo("items").parameters.arrayNames.length) {

                aArrayNames = this.getParent().getBindingInfo("items").parameters.arrayNames;
            } else {
                var sModelName = this.getParent().getBindingInfo("items").model;
                var oContextObject = this.getBindingContext(sModelName).getObject();
                for (var key in oContextObject) {
                    if (Array.isArray(oContextObject[key])) {
                        aArrayNames.push(key);
                    }
                }
            }

            return aArrayNames;
        },

        renderer: function (oRm, oControl) {
            StandardTreeItemRenderer.render.apply(this, arguments);
        }

    });

    return oStandardTreeItem;
});