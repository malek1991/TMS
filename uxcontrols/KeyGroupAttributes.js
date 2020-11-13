sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";
    var oKeyGroupAttributes = Control.extend("vistex.control.KeyGroupAttributes", {
        metadata: {
            properties: {
                editMode: {type: "boolean", defaultValue: true}
            },
            aggregations: {
                editModeControl: {"type": "sap.m.ComboBox", multiple: false},
                displayModeControl: {"type": "sap.m.ComboBox", multiple: false},
                dependentItems: {"type": "sap.ui.core.Control", multiple: false}
            }
        },

        renderer: function (oRm, oControl) {
            oRm.write('<div ');
            oRm.writeControlData(oControl);
            oRm.write('>');

            oControl.addControl(oRm);
            oRm.renderControl(oControl.getDependentItems());

            oControl.showDependentItem();

            oRm.write('</div>');
        },

        addControl: function (oRm) {
            if (this.getEditMode()) {
                oRm.renderControl(this.getEditModeControl());
            } else {
                oRm.renderControl(this.getDisplayModeControl());
            }

            this.applyInitialConfig();
            this.applySelectedKeySet();
        },

        applyInitialConfig: function () {
            if (this.getEditMode()) {
                if (this.getEditModeControl()) {
                    this.getEditModeControl().setEditable(true);
                    this.getEditModeControl().attachSelectionChange(this.onSelectionChange.bind(this));
                    this.getEditModeControl().removeStyleClass('combobox-read-only');
                    this.getEditModeControl().removeStyleClass('greyBoldKeyGroupAttributes');
                }
            } else {
                this.getDisplayModeControl().setEditable(false);
                this.getDisplayModeControl().addStyleClass('combobox-read-only');
                this.getDisplayModeControl().addStyleClass('greyBoldKeyGroupAttributes');
            }
        },

        applySelectedKeySet: function () {
            if (this.getEditMode()) {
                var oControl = this.getEditModeControl();
                if (oControl.getSelectedKey()) {
                    oControl.setEditable(false);
                    oControl.addStyleClass('combobox-read-only');
                    oControl.addStyleClass('greyBoldKeyGroupAttributes');
                } else {
                    oControl.setEditable(true);
                    oControl.removeStyleClass('combobox-read-only');
                    oControl.removeStyleClass('greyBoldKeyGroupAttributes');
                }
            }
        },

        onSelectionChange: function () {
            this.applySelectedKeySet();
            this.showDependentItem();
        },

        // Show Dependent Items
        showDependentItem: function () {
            var sKey = this.getKey();
            if (this.getDependentItems()) {
                var aItems = this.getDependentItems().getItems();

                for (var i = 0; i < aItems.length; i++) {
                    if (aItems[i].data('__VisKey') === sKey) {
                        aItems[i].setVisible(true);
                    } else {
                        aItems[i].setVisible(false);
                    }
                }
            }
        },

        getKey: function () {
            var sKey;

            if (this.getEditMode()) {
                sKey = this.getEditModeControl().getSelectedKey();
            } else {
                sKey = this.getDisplayModeControl().getSelectedKey();
            }

            return sKey;
        }
    });

    return oKeyGroupAttributes;
});