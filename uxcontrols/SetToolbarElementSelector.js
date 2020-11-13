sap.ui.define([
    "sap/m/HBox"
], function (HBox) {
    "use strict";

    var oSetToolbarElementSelector = HBox.extend("vistex.control.SetToolbarElementSelector", {

        metadata: {
            aggregations: {
                inclusionSelector: {'type': 'sap.m.Select', multiple: false},
                elementSearchField: {'type': 'sap.m.MultiInput', multiple: false}
            }
        },

        init: function () {
            this.flag = true;
        },

        getItems: function () {
            return this.getSelectors();
        },

        getSelectors: function () {
            this.overrideLiveChange();

            var items = [];
            if (this.getInclusionSelector()) {
                items.push(this.getInclusionSelector());
            }
            if (this.getElementSearchField()) {
                items.push(this.getElementSearchField());
            }

            return items;
        },

        overrideLiveChange: function () {
            if (this.getElementSearchField() && this.flag) {
                this.flag = false;
                var _self = this;
                var liveChange = this.getElementSearchField().fireLiveChange;
                this.getElementSearchField().fireLiveChange = function (oEvent) {
                    if (_self.getInclusionSelector()) {
                        oEvent["inclusionSelectorKey"] = _self.getInclusionSelector().getSelectedKey();
                    }

                    liveChange.apply(this, [oEvent]);
                }
            }
        },

        renderer: {}
    });

    return oSetToolbarElementSelector;
});
