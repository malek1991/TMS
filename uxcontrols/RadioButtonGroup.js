sap.ui.define([
    "sap/m/RadioButtonGroup"
], function (oControl) {
    "use strict";
    /**
     * Creates the RadioButtonGroup Control
     *
     * Card Item RadioButtonGroup Control
     *
     *
     * @class RadioButtonGroup
     * @param {object} mProperties
     *
     * @author Malek
     * @version 1.0
     *
     * @constructor
     * @public
     * @name vistex.control.RadioButtonGroup
     *
     */
    var RadioButtonGroup = oControl.extend("vistex.control.RadioButtonGroup", {

        metadata: {
            properties: {
                selectedKey: {
                    type: "string"

                }
            },
            aggregations: {}
        },

        renderer: {},

        onAfterRendering: function () {

            if (oControl.prototype.onAfterRendering) {
                oControl.prototype.onAfterRendering.apply(this, arguments); //run the super class's method first
            }

            this._setDefaultKey();

            var aButtons = this.getButtons();

            aButtons.forEach(function (oButton) {
                oButton.attachSelect({}, this._handleBtnSelect, this);
            }.bind(this));

        },

        onBeforeRendering: function () {
            var aButtons = this.getButtons();
            aButtons.forEach(function (oButton) {
                oButton.detachSelect(this._handleBtnSelect, this);
            }.bind(this));
        },

        _setDefaultKey: function () {

            var aCustomData = {};
            var sSelectedKey;
            var aButtons = this.getButtons();

            if (this.getSelectedKey() !== "") {
                if (aButtons.length !== 0) {

                    aButtons.forEach(function (oButton) {

                        aCustomData = oButton.getCustomData();
                        aCustomData.forEach(function (oCustomData) {

                            if (oCustomData.getKey() === "selectedKey") {
                                if (oCustomData.getValue() === this.getSelectedKey()) {
                                    this.setSelectedButton(oButton);
                                }
                            }

                        }.bind(this));

                    }.bind(this));

                }
            } else {
                aCustomData = this.getSelectedButton().getCustomData();
                aCustomData.forEach(function (oCustomData) {
                    if (oCustomData.getKey() === "selectedKey") {
                        sSelectedKey = oCustomData.getValue();
                        this.setProperty("selectedKey", sSelectedKey, true);
                    }
                }.bind(this));
            }
        },

        _handleBtnSelect: function (oControlEvent) {

            console.log("malek");

            var aCustomData = oControlEvent.getSource().getCustomData();

            aCustomData.forEach(function (oCustomData) {
                if (oCustomData.getKey() === "selectedKey") {
                    var sSelectedKey = oCustomData.getValue();
                    this.setProperty("selectedKey", sSelectedKey, true);
                }
            }.bind(this));
        }

    });

    return RadioButtonGroup;
});

