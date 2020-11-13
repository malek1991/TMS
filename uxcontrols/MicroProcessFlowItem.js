sap.ui.define([
    "sap/suite/ui/commons/MicroProcessFlowItem",
    "sap/m/Popover",
    "sap/ui/core/Icon",
    "sap/m/HBox",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/Toolbar",
    "sap/m/ToolbarSpacer",
    "sap/m/ObjectStatus"
], function (Control, Popover, Icon, HBox, VBox, Text, Button, Toolbar, ToolbarSpacer, ObjectStatus) {
    "use strict";

    var MicroProcessFlowItem = Control.extend("vistex.control.MicroProcessFlowItem", {
        metadata: {
            properties: {
                "showPopupOnPress": {type: "boolean", default: false},
                "step": {type: "string", defaultValue: ""},
                "additionalText": {type: "string", defaultValue: ""},
                "status": {type: "string", defaultValue: ""},
                "showMoreDetails": {type: "boolean", defaultValue: false},
                "moreDetailsBtnText": {type: "string", defaultValue: "More Details"}
            },
            aggregations: {
                metrics: {type: "sap.m.ObjectStatus", multiple: true}
            },
            events: {
                moreDetails: {}
            }
        },

        renderer: {}
    });

    MicroProcessFlowItem.prototype._firePress = function () {

        if (!this.getShowPopupOnPress()) {
            this.firePress({
                item: this.getFocusDomRef()
            });
        } else {
            this.showPopover();
        }
    };

    MicroProcessFlowItem.prototype.showPopover = function () {

        var oPopover = new Popover({
            contentWidth: "300px",
            title: this.getTitle(),
            content: [
                new HBox({
                    items: [
                        (new Icon({
                            src: this.getIcon() || this._getIconByState(),
                            color: "#FFF"
                        })).addStyleClass("sapSuiteUiCommonsMicroProcessFlowItem sapSuiteUiCommonsMicroProcessFlowItem" + this.getState()),
                        new VBox({
                            items: [
                                new Text({text: this.getStep()}),
                                new ObjectStatus({text: this.getStatus(), state: this.getState()}),
                                new Text({text: this.getAdditionalText()}).addStyleClass("sapUiTinyMarginTopBottom"),
                                new VBox({
                                    items: [
                                        this.getMetrics().map(function (oItem) {
                                            return oItem.clone()
                                        }.bind(this))
                                    ]
                                })
                            ]
                        }).addStyleClass("sapUiTinyMarginBegin")
                    ]
                })

            ],
            footer: new Toolbar({
                content: [
                    new ToolbarSpacer(),
                    new Button({
                        text: this.getMoreDetailsBtnText(),
                        press: function () {
                            this.fireMoreDetails()
                        }.bind(this)
                    }),
                    new Button({
                        text: 'Close',
                        press: function () {
                            oPopover.close();
                        }.bind(this)
                    })
                ]
            }),
            afterClose: function () {
                oPopover.destroy();
            }

        }).addStyleClass("sapUiContentPadding");

        this.addDependent(oPopover);

        oPopover.openBy(this);

    };

    return MicroProcessFlowItem;
});