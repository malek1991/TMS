sap.ui.require([
    "sap/m/Button"
], function (Button) {
    "use strict";
    return Button.extend("vistex.control.SelectButton", {
        metadata: {
            properties: {
                compactMode: {type: "boolean", defaultValue: false},
                showSecondaryValues: {type: "boolean", defaultValue: true},
                selectedKey: {type: "string"},
                emptySelectedKeyText: {type: "string", defaultValue: "Choose"},
            },
            defaultAggregation: "items",
            aggregations: {
                "items": {type: "sap.ui.core.ListItem", multiple: true},
                "_popover": {type: "sap.m.Popover", multiple: false, hidden: true}
            },
            events: {
                selectionChange: {}
            }
        },

        init: function () {
            this._oList = new sap.m.SelectList({
                showSecondaryValues: this.getShowSecondaryValues(),
                selectedKey: this.getSelectedKey(),
                selectionChange: this._selectionChange.bind(this)
            });

            this._oPopover = new sap.m.Popover({
                showHeader: false,
                placement: sap.m.PlacementType.VerticalPreferedBottom,
                content: this._oList
            });
            this.setAggregation("_popover", this._oPopover);

            this.getMetadata().forwardAggregation(
                "items",
                {
                    getter: function () {
                        return this._oList;
                    },
                    aggregation: "items",
                    forwardBinding: true
                }
            );
        },

        firePress: function () {
            this.getAggregation("_popover").openBy(this);
        },

        _selectionChange: function (oEvent) {
            this.setSelectedKey(oEvent.getSource().getSelectedKey());
            this._oPopover.close();
            this.fireSelectionChange();
        },

        setSelectedKey: function (sValue) {
            this.setProperty("selectedKey", sValue);
            this._oList.setSelectedKey(sValue);
        },

        setShowSecondaryValues: function (bValue) {
            this.setProperty("showSecondaryValues", bValue);
            this._oList.setShowSecondaryValues(bValue);
        },

        updateButtonText: function () {
            var sText = "";

            if (this.getSelectedKey()) {
                if (this.getCompactMode()) {
                    sText = this.getSelectedKey();
                } else if (this._oList && this._oList.getSelectedItem() && this._oList.getSelectedItem().getText()) {
                    sText = this._oList.getSelectedItem().getText();
                }
            } else {
                if (this.getCompactMode()) {
                    sText = "--";
                } else {
                    sText = this.getEmptySelectedKeyText();
                }
            }

            this.setText(sText);
        },

        onAfterRendering: function () {
            sap.m.Button.prototype.onAfterRendering.apply(this, arguments);
            this.updateButtonText();
        },

        renderer: {}
    });
});
