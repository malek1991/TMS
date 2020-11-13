sap.ui.define([
    "sap/viz/ui5/controls/VizFrame",
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format'
], function (VizFrame, ChartFormatter, Format) {
    "use strict";

    var formatPattern = ChartFormatter.DefaultPattern;

    var oWaterfallVariant = VizFrame.extend("vistex.control.vizframe.WaterfallVariant", {

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
                /**
                 * text to display as CategoryAxis(X-Axis)
                 */
                categoryAxisTitle: {type: "string"},

                /**
                 * boolean that determines visibility of CategoryAxisTitle(X-Axis)
                 */
                categoryAxisTitleVisible: {type: "boolean"},

                /**
                 * text to display as valueAxis(Y-Axis)
                 */
                valueAxisTitle: {type: "string"},

                /**
                 * boolean that determines visibility of ValueAxistitle(Y-Axis)
                 */
                valueAxisTitleVisible: {type: "boolean"},

                showValueLabel: {type: "boolean", defaultValue: true}
            }
        },

        /**
         *  Initializes the Control instance after creation.
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
                        formatString: formatPattern.SHORTFLOAT_MFD2,
                        visible: true
                    }
                }
            };

            this._oTooltip = {};

            VizFrame.prototype.init.apply(this, arguments);
            this.chartProperties['categoryAxis'] = {
                title: {}
            };
            this.chartProperties['valueAxis'] = {
                title: {}
            };
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
                i;

            for (i = 0; i < aDimensions.length; i++) {
                var axisUid = aDimensions[i].getUid().toString(),
                    aValue = aDimensions[i].getName().toString();

                if (aValue && axisUid) {
                    this.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                        uid: axisUid,
                        type: "Dimension",
                        values: [aValue]
                    }));
                }
            }
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
                if (aMeasures[i].getName()) {
                    aValues.push(aMeasures[i].getName().toString());
                }
            }

            this.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "valueAxis",
                type: "Measure",
                values: aValues
            }));
        },

        /**
         * Sets the Title for Category axis (X-Axis)
         * @param sText {String}
         */
        setCategoryAxisTitle: function (sText) {
            if (sText) {
                this.chartProperties.categoryAxis['title']['text'] = sText;
                this.setVizProperties(this.chartProperties);
            }
        },

        /**
         * Function that sets 'visiblity' of the title for Category axis (X-Axis)
         * @param bFlag {boolean}
         */
        setCategoryAxisTitleVisible: function (bFlag) {
            this.chartProperties.categoryAxis['title']['visible'] = bFlag;
            this.setVizProperties(this.chartProperties);
        },

        /**
         * Sets the Title for Values axis (y-Axis)
         * @param sText {String}
         */
        setValueAxisTitle: function (sText) {
            if (sText) {
                this.chartProperties.valueAxis['title']['text'] = sText;
                this.setVizProperties(this.chartProperties);
            }
        },

        /**
         * Function that sets 'visiblity' of the title for Values axis (y-Axis)
         * @param bFlag {boolean}
         */
        setValueAxisTitleVisible: function (bFlag) {
            this.chartProperties.valueAxis['title']['visible'] = bFlag;
            this.setVizProperties(this.chartProperties);
        },

        setShowValueLabel: function (bValue) {
            this.setProperty("showValueLabel", bValue);
            this.chartProperties.plotArea['dataLabel']['visible'] = bValue;
            this.setVizProperties(this.chartProperties);

            return this;
        },

        renderer: {}
    });

    return oWaterfallVariant;
});
