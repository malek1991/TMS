sap.ui.define([
    "sap/viz/ui5/controls/VizFrame",
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format'
], function (VizFrame, ChartFormatter, Format) {
    "use strict";

    var formatPattern = ChartFormatter.DefaultPattern;

    var oBubbleVariant = VizFrame.extend("vistex.control.vizframe.BubbleVariant", {

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
                 * text to display as valueAxis(Y-Axis)
                 */
                valueAxisTitle: {type: "string"},

                /**
                 * boolean that determines visibility of ValueAxistitle(Y-Axis)
                 */
                valueAxisTitleVisible: {type: "boolean"},

                /**
                 * text that identifies a system
                 */
                valueAxis2Title: {type: "string"},

                /**
                 * boolean that determines visibility of ValueAxistitle(Y-Axis)
                 */
                valueAxis2TitleVisible: {type: "boolean"},

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

            this.chartProperties['valueAxis'] = {
                title: {}
            };
            this.chartProperties['valueAxis2'] = {
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
                dimensionName = aDimensions[0].getName().toString();

            if (dimensionName) {
                this.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                    uid: "color",
                    type: "Dimension",
                    values: [dimensionName]
                }));
            }
        },

        /**
         * Function that adds feedsItems to feeds with type 'Measure'.
         */
        addMeasuresFeed: function () {
            var oDataSet = this.getDataset();
            var aMeasures = oDataSet.getMeasures();

            for (var i = 0; i < aMeasures.length; i++) {
                var axisUid = aMeasures[i].getUid().toString(),
                    aValue = aMeasures[i].getName().toString();

                if (aValue && axisUid) {
                    this.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                        uid: axisUid,
                        type: "Measure",
                        values: [aValue]
                    }));
                }
            }
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

        /**
         * Sets the Title for Valuesaxis2 (y-Axis)
         * @param sText {String}
         */
        setValueAxis2Title: function (sText) {
            if (sText) {
                this.chartProperties.valueAxis2['title']['text'] = sText;
                this.setVizProperties(this.chartProperties);
            }
        },

        /**
         * Function that sets 'visiblity' of the title for ValuesAxis2 (y-Axis)
         * @param bFlag {boolean}
         */
        setValueAxis2TitleVisible: function (bFlag) {
            this.chartProperties.valueAxis2['title']['visible'] = bFlag;
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

    return oBubbleVariant;
});
