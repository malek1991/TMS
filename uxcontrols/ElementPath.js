sap.ui.define([
    "sap/ui/core/Control"

], function (Control) {
    "use strict";

    /**
     * Creates the Avatar Set
     *
     *
     * @class Element Path Custom Control
     * @param {object} mProperties
     *
     * @author MSLIMANI
     * @version 1.0
     *
     * @constructor
     * @public
     * @name vistex.control.ElementPath
     *
     */

    return Control.extend("vistex.control.ElementPath", {
        metadata: {
            properties: {},
            aggregations: {
                nodes: {type: "sap.m.Text", multiple: true, bindable: true},
                _HEllipsis: {type: "sap.m.Text", multiple: false}
            },
            events: {}
        },

        init: function () {
            // Create Horizontal Ellipsis
            var oHEllipsis = new sap.m.Text({text: "..."}).addStyleClass('vistexHideAvatar');
            this.setAggregation("_HEllipsis", oHEllipsis);
        },

        onBeforeRendering: function () {
            this.detachEvent('onResize', this._onElementPathResize);
        },

        onAfterRendering: function () {
            this.attachEvent('onResize', this._onElementPathResize);
            this._onElementPathResize();
        },

        renderer: function (oRm, oControl) {
            oRm.write("<div ");
            oRm.addStyle("display", "-webkit-inline-box");
            oRm.writeStyles();
            oRm.writeControlData(oControl);
            oRm.write('>');
            $(oControl.getAggregation('nodes')).each(function (index) {
                oRm.write("<div  ");
                oRm.write(" style=\"font-family:'Arial';font-weight:400;color:#666666;\"");
                oRm.addStyle("display", "-webkit-inline-box");
                oRm.write('>');
                if (index === 1) {
                    oRm.renderControl(oControl.getAggregation("_HEllipsis"));
                }
                oRm.renderControl(this);
                oRm.write('\\');
                oRm.write("</div>");
            });
            oRm.write("</div>");
        },

        _onElementPathResize: function () {
            var aNodes = this.getAggregation('nodes');
            if (aNodes) {
                var iLength = aNodes.length,
                    iContainerWidth = this.$().parent().width(),
                    iParentWidth = aNodes[iLength - 1].$().parent().width(),
                    iFirstWidth = aNodes[0].$().parent().width(),
                    iSom = iParentWidth + iFirstWidth + 50,
                    i = iLength - 2;

                this.getAggregation('_HEllipsis').addStyleClass('vistexHideAvatar');

                while (iSom < iContainerWidth && i > 0) {
                    iSom += aNodes[i].$().parent().width();
                    i -= 1;
                }

                if (i === iLength - 2) {
                    for (var k = 0; k < iLength - 1; k++) {
                        if (k === 1) {
                            aNodes[k].$().css("display", "none");
                        } else {
                            aNodes[k].$().parent().css("display", "none");
                        }
                    }
                }

                if (i > 0) {
                    while (i >= 1) {
                        if (i === 1) {
                            aNodes[i].$().css("display", "none");
                        } else {
                            aNodes[i].$().parent().css("display", "none");
                        }
                        i -= 1;
                    }
                    this.getAggregation('_HEllipsis').removeStyleClass('vistexHideAvatar');
                }
            }
        },


    });
});