sap.ui.define([
    "sap/ui/core/Control"

], function(Control) {
    "use strict";

    /**
     * Creates the VChart
     *
     *
     * @class VChart Custom Control
     * @param {object} mProperties
     *
     * @author DRAKSHIT
     * @version 1.0
     *
     * @constructor
     * @public
     * @name vistex.control.VChart
     *
     */

    return Control.extend("vistex.control.VUICharts", {
        metadata: {
            properties: {
                adapterData: {
                    type: 'object',
                    defaultValue: {}
                }
            }
        },

        renderer: function(ioRm, ioControl) {
            var loHTML = new sap.ui.core.HTML();
            ioRm.write("<div ");
            ioRm.addStyle("width", "100%");
            ioRm.writeStyles();
            ioRm.writeControlData(ioControl);
            ioRm.write('>');
            ioRm.renderControl(loHTML);

            if (!ioControl.wrapper) {
                ioControl.wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            }
            if (ioControl.getAdapterData()) {
                var loDataSource = new vcharts.RowDataSource(ioControl.getAdapterData().meta, ioControl.getAdapterData().data);
                var loChart = new vcharts.Chart(ioControl.getAdapterData().config, loDataSource, ioControl.wrapper);
                loHTML.setDOMContent(loChart.htmlElement);
            }
            ioRm.write("</div>");
        }
    });
});