sap.ui.define([
    "sap/viz/ui5/data/DimensionDefinition",
], function (DimensionDefinition) {
    "use strict";

    var oDimensionDefinition = DimensionDefinition.extend("vistex.control.vizframe.DimensionDefinition", /** @lends sap.viz.ui.data.DimensionDefination.prototype */{
        metadata: {
            properties: {

                /**
                 * Name of the dimension as displayed in the chart
                 */
                uid: {type: "string", defaultValue: null},

            }
        },

        /**
         *Function is called before the rendering of the control is started.
         */
        onBeforeRendering: function () {

        }
    });

    return oDimensionDefinition;
});
