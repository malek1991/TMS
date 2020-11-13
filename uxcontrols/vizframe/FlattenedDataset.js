sap.ui.define([
    "sap/viz/ui5/data/FlattenedDataset",
], function (FlattenedDataset) {
    "use strict";

    var oFlattenedDataset = FlattenedDataset.extend("vistex.control.vizframe.FlattenedDataset", {
        metadata: {
            aggregations: {
                /**
                 * Entity to be rendered as options
                 */

                dimensions: {"type": "vistex.control.vizframe.DimensionDefinition", multiple: true},
                measures: {"type": "vistex.control.vizframe.MeasureDefinition", multiple: true}
            }
        }
    });

    return FlattenedDataset;
});
