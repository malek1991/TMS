sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/model/json/JSONModel"

], function (Control, JSONModel) {
    "use strict";

    /**
     * Creates the Avatar Set
     *
     *
     * @class AvatarSet Custom Control
     * @param {object} mProperties
     *
     * @author MSLIMANI
     * @version 1.0
     *
     * @constructor
     * @public
     * @name vistex.control.AvatarSet
     *
     */

    return Control.extend('vistex.control.AvatarSet', {
        firstLoad: true,
        metadata: {
            properties: {},
            aggregations: {
                avatars: {"type": "vistex.control.Avatar", "multiple": true, bindable: true},
                _moreButton: {"type": "vistex.control.MoreAvatar", "multiple": false}
            },
            events: {
                onMorePress: {},
            },
        },

        init: function () {
            // Create the Avatar for more button
            var oMoreButton = new vistex.control.MoreAvatar().addStyleClass('sapUiTinyMargin');
            oMoreButton.attachEvent('press', this._onMorePress);
            this.setAggregation("_moreButton", oMoreButton);
            var that = this;
            $(window).resize(function () {
                clearTimeout(window.resizedFinished);
                window.resizedFinished = setTimeout(function () {
                    that.getParent().rerender();
                }, 250);
            });
        },

        onBeforeRendering: function () {
            this.detachEvent('onResize', this._onAvatarSetResize);
        },

        onAfterRendering: function() {
            var avatars,
                sDisplayShape,
                displaySize;
            avatars = this.getAggregation('avatars');
            sDisplayShape = avatars[0].getDisplayShape();
            displaySize = avatars[0].getDisplaySize();
            // Set the Shape and the size of More Button
            this.getAggregation('_moreButton').removeStyleClass('vistexHideAvatar');
            this.getAggregation('_moreButton').setDisplayShape(sDisplayShape);
            this.getAggregation('_moreButton').setDisplaySize(displaySize);
            this.attachEvent('onResize', this._onAvatarSetResize.bind(this));
            this.firstLoad = false;
            this._onAvatarSetResize();
        },

        addAggregation: function (sAggregationName, oObject, bSuppressInvalidate) {
            if (sAggregationName === 'avatars') {
                oObject.addStyleClass('sapUiTinyMargin');
            }
            Control.prototype.addAggregation.apply(this, arguments);
        },

        renderer: function (oRm, oControl) {
            oRm.write("<div ");
            oRm.addStyle("width", "auto");
            oRm.addStyle("display", "flex");
            oRm.writeStyles();
            oRm.writeControlData(oControl);
            oRm.write('>');
            oRm.write("<div>");
            $(oControl.getAggregation('avatars')).each(function () {
                oRm.renderControl(this);
            });
            oRm.write("</div>");
            oRm.write("<div ");
            oRm.write('>');
            oRm.renderControl(oControl.getAggregation('_moreButton'));
            oRm.write("</div>");
            oRm.write("</div>");
        }
        ,

        /**
         * Handler for Resize Event
         * @private
         */
        _onAvatarSetResize: function () {
            var iNbrAvatars = this.getAggregation('avatars').length,
                // iAvatarWidth = document.getElementById(this.getAggregation('_moreButton').getId()).offsetWidth, // Width of the Avatar
                iAvatarWidth = this.getAggregation('_moreButton').$().width(), // Width of the Avatar
                iAvatarSetWidth,
                iNbrVisibleAvatars,
                i;
            this.getAggregation('_moreButton').addStyleClass('vistexHideAvatar'); // Hide More Button
            iAvatarSetWidth = this.$().parent().parent().width(); // Width of the container Div of the Avatar Set
            if (iNbrAvatars > 1) {
                iNbrVisibleAvatars = Math.trunc(iAvatarSetWidth / iAvatarWidth) - 1; // Number of Possible displayed Avatars
                var iMoreText = iNbrAvatars - iNbrVisibleAvatars + 2;
                if (iAvatarWidth === 0 || iNbrVisibleAvatars > iNbrAvatars) {
                    for (i = 0; i < iNbrAvatars; i++) {
                        this.getAggregation('avatars')[i].removeStyleClass('vistexHideAvatar');
                    }
                }
                if (iNbrVisibleAvatars > 0 && iNbrVisibleAvatars <= iNbrAvatars) {
                    this._setAvatarsVisibility(iNbrVisibleAvatars - 1, iMoreText);
                }
                if (iNbrVisibleAvatars === -1 && !this.firstLoad) {
                    this._setAvatarsVisibility(1, iNbrAvatars);
                }
            }
        },

        /**
         * Set the Visibility of the Avatars
         * @param iNbrVisibleAvatars
         * @param iMoreText
         * @private
         */
        _setAvatarsVisibility: function (iNbrVisibleAvatars, iMoreText) {
            var aAvatars = this.getAggregation('avatars'),
                i;
            if (iNbrVisibleAvatars < 1) {
                for (i = 0; i < aAvatars.length; i++) {
                    aAvatars[i].addStyleClass('vistexHideAvatar');
                }
                this.getAggregation('_moreButton').removeStyleClass('vistexHideAvatar');
                this.getAggregation('_moreButton').setInitials('+' + aAvatars.length);
            } else {
                for (i = 0; i < iNbrVisibleAvatars - 1; i++) { // show the first iNbrVisibleAvatars
                    aAvatars[i].removeStyleClass('vistexHideAvatar');
                }
                for (i = iNbrVisibleAvatars - 1; i < aAvatars.length; i++) { // Hide the rest
                    aAvatars[i].addStyleClass('vistexHideAvatar');
                }
                this.getAggregation('_moreButton').removeStyleClass('vistexHideAvatar'); // Show more Buttons Avatar
                this.getAggregation('_moreButton').setInitials('+' + iMoreText); // Set the Initials Property
            }
        },

        /**
         * Press Handler for More Button
         * @param oEvent
         * @private
         */
        _onMorePress: function (oEvent) {
            var oControl = this.getParent();
            // create popover
            if (!this._oPopover) {
                this._oPopover = new sap.m.Popover({
                    title: "Hidden Avatars",
                    content: new sap.m.List({
                        items: {
                            path: "/avatars",
                            templateShareable: false,
                            template:
                                new sap.m.CustomListItem({
                                    content: new sap.m.HBox({
                                        items: [
                                            new sap.f.Avatar({
                                                src: "{src}",
                                                displayShape: "{displayShape}"
                                            }),
                                            new sap.m.ObjectIdentifier({
                                                titleActive: true,
                                                title: "{name}",
                                                text: "{description}"
                                            })
                                        ]
                                    }).addStyleClass('sapUiTinyMargin')
                                })
                        }
                    })
                });
            }
            var oBindingContext = oControl.getBindingInfo('avatars');
            var int = parseInt(oControl.getAggregation('_moreButton').getInitials().substr(1));
            if (oBindingContext) {
                this._oPopover.getContent()[0].setModel(oControl._setMoreModel(int, oControl.getModel(oBindingContext.model)));
            } else {
                this._oPopover.getContent()[0].setModel(oControl._setMoreModelAggregation(int));
            }
            this._oPopover.openBy(oEvent.getSource());

        },

        _setMoreModel: function (int, oModel) {
            var aAvatars = oModel.getProperty('/avatars');
            var oModel1 = new JSONModel();
            oModel1.setProperty('/avatars', aAvatars.slice(aAvatars.length - int));
            return oModel1;
        },

        _setMoreModelAggregation: function (int) {
            var oModel1 = new JSONModel(), array = [];
            var aAvatars = this.getAggregation('avatars');
            this.findElements().forEach(function (ele, i) {
                var obj = {};
                if (ele instanceof vistex.control.Avatar) {
                    if (i > aAvatars.length - int) {
                        obj.name = ele.getName();
                        obj.description = ele.getDescription();
                        obj.displayShape = ele.getDisplayShape();
                        obj.src = ele.getSrc();
                        obj.initials = ele.getInitials();
                        array.push(obj);
                    }
                }
            });
            oModel1.setProperty('/avatars', array);
            return oModel1;
        }

    });
});