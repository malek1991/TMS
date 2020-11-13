sap.ui.define([
    "sap/viz/ui5/controls/VizFrame",
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format'
], function (VizFrame, ChartFormatter, Format) {
    "use strict";

    var formatPattern = ChartFormatter.DefaultPattern;

    var oDonutVariant = VizFrame.extend("vistex.control.vizframe.DonutVariant", {

        //Donut feeds preparation goes here

        metadata: {
            properties: {
                /**
                 * text that determines ChartTitle
                 */
                chartTitle: {type: "string"},

                /**
                 * Title TextAlignment for the chart
                 */
                chartTitleAlign: {type: "string"},

                /**
                 * boolean that identifies a tooltip
                 */
                showTooltip: {type: "boolean", defaultValue: true},

                showValueLabel: {type: "boolean", defaultValue: true},

                valueLabelFormat: {type: "string", defaultValue: "percentage"}      // "percentage" or "value"
            }
        },

        /**
         *Initializes the Control instance after creation.
         */
        init: function () {
            Format.numericFormatter(ChartFormatter.getInstance());

            this.chartProperties = {
                legend: {
                    isScrollable: false
                },
                title: {
                    text: "",
                    visible: false,
                    alignment: ""
                },
                interaction: {
                    selectability: {
                        plotLassoSelection: false
                    }
                },
                plotArea: {
                    dataLabel: {
                        visible: true
                    }
                }
            };

            this._oTooltip = {};

            VizFrame.prototype.init.apply(this, arguments);
        },

        /**
         * Sets the tooltip for the chart
         * @param bShowTooltip {boolean}
         */
        setShowTooltip: function (bShowTooltip) {
            if (bShowTooltip) {
                this._oTooltip = new sap.viz.ui5.controls.VizTooltip({});
                this._oTooltip.connect(this.getVizUid());
            } else {
                this._oTooltip.destroy();
            }
            this.setProperty("showTooltip", bShowTooltip)
        },

        /**
         *Function is called before the rendering of the control is started.
         */
        onBeforeRendering: function () {
            this.removeAllFeedsBeforeAdd();
            this.addDimensionFeed();
            this.addMeasuresFeed();
        },

        /**
         * Function that removes the existing feeds from the chart
         */
        removeAllFeedsBeforeAdd: function () {
            this.removeAllFeeds();
        },

        /**
         * Sets the Title of the chart
         * @param sText {String}
         */
        setChartTitle: function (sText) {
            this.chartProperties.title.text = sText;
            this.chartProperties.title.visible = !!this.chartProperties.title.text;
            this.setVizProperties(this.chartProperties);
        },

        /**
         * Sets the Title Alignment for the Chart.
         * @param sAlign {String}
         */
        setChartTitleAlign: function (sAlign) {
            this.chartProperties.title.alignment = sAlign;
            this.setVizProperties(this.chartProperties);
        },

        /**
         * Function that adds feedsItems to feeds with type 'Dimesion'.
         */
        addDimensionFeed: function () {
            var oDataSet = this.getDataset(),
                aDimensions = oDataSet.getDimensions(),
                i,
                aValues = [];

            for (i = 0; i < aDimensions.length; i++) {
                aValues.push(aDimensions[i].getName().toString());
            }

            this.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "color",
                type: "Dimension",
                values: aValues
            }));
        },

        /**
         * Function that adds feedsItems to feeds with type 'Measure'.
         */
        addMeasuresFeed: function () {
            var oDataSet = this.getDataset(),
                aMeasures = oDataSet.getMeasures(),
                i,
                aValues = [];

            for (i = 0; i < aMeasures.length; i++) {
                aValues.push(aMeasures[i].getName().toString());
            }

            this.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "size",
                type: "Measure",
                values: aValues
            }));
        },

        setShowValueLabel: function (bValue) {
            this.setProperty("showValueLabel", bValue);
            this.chartProperties.plotArea['dataLabel']['visible'] = bValue;
            this.setVizProperties(this.chartProperties);

            return this;
        },

        setValueLabelFormat: function (sValue) {
            this.setProperty("valueLabelFormat", sValue);

            if (sValue === "value") {
                this.chartProperties.plotArea['dataLabel']['type'] = "value"
                this.chartProperties.plotArea['dataLabel']['formatString'] = formatPattern.SHORTFLOAT_MFD2;
            } else {
                this.chartProperties.plotArea['dataLabel']['type'] = "percentage";
                this.chartProperties.plotArea['dataLabel']['formatString'] = null;
            }
            this.setVizProperties(this.chartProperties);

            return this;
        },

        renderer: {}
    });

    return oDonutVariant;
});
