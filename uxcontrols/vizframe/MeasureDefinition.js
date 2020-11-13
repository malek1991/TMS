sap.ui.define([
    "sap/viz/ui5/data/MeasureDefinition",
], function (MeasureDefinition) {
    "use strict";

    var oMeasureDefinition = MeasureDefinition.extend("vistex.control.vizframe.MeasureDefinition",/** @lends sap.viz.ui.data.MeasureDefinition.prototype */ {
        metadata: {
            properties: {

                /**
                 * To specify the axis type
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

    return oMeasureDefinition;
});
