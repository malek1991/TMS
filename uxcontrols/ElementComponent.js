sap.ui.define([
    "sap/m/CustomListItem"

], function (oControl) {
    "use strict";

    /**
     * Creates the Custom List Item: Element Component
     *
     *
     * @class Element Component Custom Control
     * @param {object} mProperties
     *
     * @author MSLIMANI
     * @version 1.0
     *
     * @constructor
     * @public
     * @name vistex.control.ElementComponent
     *
     */

    return oControl.extend("vistex.control.ElementComponent", {
        metadata: {
            properties: {
                nameFormat: {
                    type: 'string',
                    defaultValue: ''
                }
            },
            aggregations: {
                elementPath: {"type": "vistex.control.ElementPath", "multiple": false, bindable: true},
                elementName: {"type": "sap.m.Title", "multiple": false, bindable: true},
            },
            events: {}
        },

        init: function () {
            oControl.prototype.init.apply(this, arguments);
        },

        /**
         * Set ElementPath Aggregation Handler
         * @param oControl
         */
        setElementPath: function (oControl) {
            var sFormat = this.getNameFormat(),
                oContent = this.getAggregation('content');
            if (sFormat === "italic") {
                oControl.addStyleClass("sapUiMediumMarginBegin");
            }
            if (Array.isArray(oContent) && oContent.length > 0) {
                oContent[0].insertItem(oControl, 0);
            } else {
                var VBox = new sap.m.VBox({
                    items: [oControl]
                });
                this.addContent(VBox);
            }
        },

        /**
         * Set ElementName Aggregation Handler
         * @param oControl
         */
        setElementName: function (oControl) {
            oControl = this._setNameStyle(oControl, this.getNameFormat());
            oControl.addStyleClass('sapUiTinyMarginTop');
            var oContent = this.getAggregation('content');
            if (Array.isArray(oContent) && oContent.length > 0) {
                oContent[0].insertItem(oControl, 1);
            } else {
                var VBox = new sap.m.VBox({
                    items: [oControl]
                });
                this.addContent(VBox);
            }
        },

        /**
         * Set the Style for the Name Aggregation
         * @param object
         * @param sFormat
         * @returns {*}
         * @private
         */
        _setNameStyle: function (object, sFormat) {
            switch (sFormat) {
                case 'bold':
                    object.setTitleStyle('H2');
                    return object;
                case 'italic':
                    object.addStyleClass("vistexItalicStyle");
                    return this._createItalicDiv(object);
                case 'default':
                    return object;
            }

        },

        /**
         * Italic Dash...
         * @param oControl
         * @returns {sap.m.HBox}
         * @private
         */
        _createItalicDiv: function (oControl) {
            return new sap.m.HBox({
                items: [
                    new sap.m.Text({
                        text: "–  "
                    }).addStyleClass("vistexndash")
                    , oControl
                ]
            })
        },

        renderer: {}

    });
});