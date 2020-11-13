sap.ui.define([
    "sap/m/library",
    'sap/f/GridList',
    'sap/f/GridListRenderer',
    'sap/m/GroupHeaderListItem',
    'sap/ui/model/Sorter'
], function (library, GridList, GridListRenderer, GroupHeaderListItem, Sorter) {
    'use strict';

    // shortcut for sap.m.ListGrowingDirection
    var ListGrowingDirection = library.ListGrowingDirection;

    // shortcut for sap.m.ListKeyboardMode
    var ListKeyboardMode = library.ListKeyboardMode;

    // shortcut for sap.m.ToolbarDesign
    var ToolbarDesign = library.ToolbarDesign;

    return GridList.extend('vistex.control.GridList', {
        metadata: {
            aggregations: {
                addButton: {'type': 'sap.m.ListItemBase', multiple: false}
            },
            properties: {
                groupOn: {
                    'type': 'string'
                },
                showAddButton: {
                    'type': 'boolean',
                    'defaultValue': false
                }
            }
        },

        onBeforeRendering: function () {
            GridList.prototype.onBeforeRendering.apply(this, arguments);
            this.getBindingInfo('items').groupHeaderFactory = function (group) {
                return new GroupHeaderListItem({
                    title: group.text
                });
            };
            if (this.getGroupOn()) {
                this.getBinding('items').sort(new Sorter('group', false, function (oContext) {
                    return {
                        key: oContext.getProperty(this.getGroupOn()),
                        text: oContext.getProperty(this.getGroupOn())
                    };
                }.bind(this)));
            }
        },

        renderer: function (rm, oControl) {
            // GridListRenderer.render.apply(this, arguments);


            // container
            rm.openStart("div", oControl);
            rm.class("sapMList");

            // inset
            if (oControl.getInset()) {
                rm.class("sapMListInsetBG");
            }

            // width
            rm.style("width", oControl.getWidth());

            // background
            if (oControl.getBackgroundDesign) {
                rm.class("sapMListBG" + oControl.getBackgroundDesign());
            }

            // tooltip
            var sTooltip = oControl.getTooltip_AsString();
            if (sTooltip) {
                rm.attr("title", sTooltip);
            }

            // add sticky style classes
            var iStickyValue = oControl.getStickyStyleValue();
            if (iStickyValue) {
                rm.class("sapMSticky");
                rm.class("sapMSticky" + iStickyValue);
            }

            // run hook method
            this.renderContainerAttributes(rm, oControl);

            // container
            rm.openEnd();

            // render message strip
            rm.renderControl(oControl.getAggregation("_messageStrip"));

            // render header
            var sHeaderText = oControl.getHeaderText();
            var oHeaderTBar = oControl.getHeaderToolbar();
            if (oHeaderTBar) {
                oHeaderTBar.setDesign(ToolbarDesign.Transparent, true);
                oHeaderTBar.addStyleClass("sapMListHdr");
                oHeaderTBar.addStyleClass("sapMListHdrTBar");
                oHeaderTBar.addStyleClass("sapMTBHeader-CTX");
                rm.renderControl(oHeaderTBar);
            } else if (sHeaderText) {
                rm.openStart("header", oControl.getId("header"));
                rm.class("sapMListHdr").class("sapMListHdrText").openEnd();
                rm.text(sHeaderText);
                rm.close("header");
            }

            // render info bar
            var oInfoTBar = oControl.getInfoToolbar();
            if (oInfoTBar) {
                oInfoTBar.setDesign(ToolbarDesign.Info, true);
                oInfoTBar.addStyleClass("sapMListInfoTBar");
                rm.openStart("div").class("sapMListInfoTBarContainer").openEnd();
                rm.renderControl(oInfoTBar);
                rm.close("div");
            }

            // determine items rendering
            var aItems = oControl.getItems(),
                bShowNoData = oControl.getShowNoData(),
                bRenderItems = oControl.shouldRenderItems() && aItems.length,
                iTabIndex = oControl.getKeyboardMode() == ListKeyboardMode.Edit ? -1 : 0,
                bUpwardGrowing = oControl.getGrowingDirection() == ListGrowingDirection.Upwards && oControl.getGrowing();

            // render top growing
            if (bUpwardGrowing) {
                this.renderGrowing(rm, oControl);
            }

            // dummy keyboard handling area
            if (bRenderItems || bShowNoData) {
                this.renderDummyArea(rm, oControl, "before", -1);
            }

            // run hook method to start building list
            this.renderListStartAttributes(rm, oControl);

            // list attributes
            rm.class("sapMListUl");
            if (oControl._iItemNeedsHighlight) {
                rm.class("sapMListHighlight");
            }

            if (bRenderItems || bShowNoData) {
                rm.attr("tabindex", iTabIndex);
            }

            // separators
            rm.class("sapMListShowSeparators" + oControl.getShowSeparators());

            // modes
            rm.class("sapMListMode" + oControl.getMode());

            // navigated indicator
            if (oControl._iItemNeedsNavigated) {
                rm.class("sapMListNavigated");
            }

            // list
            rm.openEnd();

            // run hook method to render list head attributes
            this.renderListHeadAttributes(rm, oControl);

            // render child controls
            if (bRenderItems) {
                if (bUpwardGrowing) {
                    aItems.reverse();
                }

                for (var i = 0; i < aItems.length; i++) {
                    rm.renderControl(aItems[i]);
                }
            }

            /**
             * Addition of addButton in the List Starts
             * If the renderer changes in any version of SAPUI5, then just just and Paste this section
             */
            if (oControl.getAddButton() && oControl.getShowAddButton()) {
                rm.renderControl(oControl.getAddButton().addStyleClass("sapUiTinyMargin"));
            }
            // Addition of addButton in the List Ends

            // render no-data if needed
            if (!bRenderItems && bShowNoData) {
                this.renderNoData(rm, oControl);
            }

            // run hook method to finish building list
            this.renderListEndAttributes(rm, oControl);

            // dummy keyboard handling area
            if (bRenderItems || bShowNoData) {
                this.renderDummyArea(rm, oControl, "after", iTabIndex);
            }

            // render bottom growing
            if (!bUpwardGrowing) {
                this.renderGrowing(rm, oControl);
            }

            // footer
            if (oControl.getFooterText()) {
                rm.openStart("footer", oControl.getId("footer")).class("sapMListFtr").openEnd();
                rm.text(oControl.getFooterText());
                rm.close("footer");
            }

            // container
            rm.close("div");

        }
    });

});
