sap.ui.define([
    "sap/m/FeedListItem",
    "sap/m/FeedListItemRenderer",
    "sap/m/Button"
], function (oControl, FeedListItemRenderer, Button) {
    "use strict";

    var oListItem = oControl.extend("vistex.control.LogListItem", {

        metadata: {
            properties: {
                detailsButtonText: {type: "string", defaultValue: "Details"},
                showDetailsButton: {type: "boolean", defaultValue: true},
                itemType: {type: "string", defaultValue: "change"}
            },
            aggregations: {
                additionalContent: {"type": "sap.ui.core.Control", multiple: false},
                detailsButton: {type: "sap.m.Button", multiple: false, visibility: "hidden"}
            },
            events: {
                detailPress: {}
            }
        },

        init: function () {
            oControl.prototype.init.apply(this, arguments);

            var oButton = new Button({
                text: this.getDetailsButtonText(),
                press: this._onDetaisPressed.bind(this),
                type: sap.m.ButtonType.Transparent
            }).addStyleClass("vistex-logItem-detailsBtn");

            this.setAggregation("detailsButton", oButton);
            this.addStyleClass("vistex-logItem")
        },

        setShowDetailsButton: function (bShow) {
            this.getAggregation("detailsButton").setVisible(bShow);
            this.setProperty("showDetailsButton", bShow);
        },

        _onDetaisPressed: function (oEvent) {
            this.fireDetailPress();

            var aDependents = this.getDependents();
            if (aDependents.length == 0) return;

            if (!(aDependents[0] instanceof sap.m.Dialog)) return;

            var oDialog = aDependents[0];

            var oContext = this.getBindingContext("widgetModel");
            oDialog.setBindingContext(oContext, "widgetModel");


            var oCloseBtn = oDialog.getEndButton();
            if (!oCloseBtn) return;

            oCloseBtn.attachPress(function () {
                oDialog.close();
            })
            oDialog.open();
        }
    });

    var oCustomFeedListItemRenderer = FeedListItemRenderer.extend("vistex.control.LogListItemRenderer");


    oCustomFeedListItemRenderer.renderLIContentWrapper = function (rm, oLI) {
        rm.write('<div class="sapMLIBContent"');
        rm.writeAttribute("id", oLI.getId() + "-content");
        rm.write(">");
        rm.write('<div class="vistex-logItem-flexContent">');
        this.renderLIContent(rm, oLI.addStyleClass("vistex-logItem"));
        if (oLI.getItemType() == "change") {
            rm.renderControl(oLI.getAggregation("detailsButton"));
        }
        rm.write('</div>');
        if (oLI.getItemType() == "attachment") {
            rm.renderControl(oLI.getAdditionalContent().addStyleClass("sapMFeedListItemHasFigure"));
        }
        rm.write('</div>');
    };

    // oCustomFeedListItemRenderer

    return oListItem;
});
