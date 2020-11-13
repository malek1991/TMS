sap.ui.define([
    'sap/m/NotificationListItem',
    'sap/m/NotificationListItemRenderer',
    'sap/m/OverflowToolbar',
    'sap/ui/core/IconPool',
], function (NotificationListItem, NotificationListItemRenderer, OverflowToolbar, IconPool) {
    'use strict';
    var oArchivedNotificationListItem = NotificationListItem.extend('vistex.control.ArchivedNotificationListItem', {
        metadata: {
            properties: {
                subTitle: {type: 'string', group: 'Appearance', defaultValue: ''}
            },
            aggregations: {
                _headerSubTitle: {type: 'sap.m.Label', multiple: false, visibility: 'hidden'},
                _agreementAvatar: {type: 'sap.f.Avatar', multiple: false, visibility: 'hidden'},
                _attachmentIcon: {type: 'sap.ui.core.Icon', multiple: false, visibility: 'hidden'},
                buttons: {type: 'sap.ui.core.Control', multiple: true},
                agreements: {type: 'sap.m.Link', multiple: true},
                attachments: {type: 'sap.m.Link', multiple: true},
                _overflowToolbarAgreements: {type: 'sap.m.OverflowToolbar', multiple: false, visibility: 'hidden'},
                _overflowToolbarAttachments: {type: 'sap.m.OverflowToolbar', multiple: false, visibility: 'hidden'},
                _topRightAttachmentIcon: {type: 'sap.ui.core.Icon', multiple: false, visibility: 'hidden'}
            }
        },


        renderer: function (oRm, oControl) {
            NotificationListItemRenderer.render(oRm, oControl);
        },

        init: function () {
            var classNameCloseButton = 'sapMNLB-CloseButton';
            this.setAggregation('_overflowToolbarAgreements', new OverflowToolbar({
                style: 'Clear'
            }));
            this.setAggregation('_overflowToolbarAttachments', new OverflowToolbar({
                style: 'Clear'
            }));
            NotificationListItem.prototype.init.call(this);
            NotificationListItemRenderer.renderHeader = function (oRm, oControl) {
                function buttonsShouldBeRendered(oControl) {
                    return oControl.getHideShowMoreButton() && (!oControl.getShowButtons() || !oControl.getButtons());
                }

                var classNameNoFooter = 'sapMNLI-No-Footer';
                var classNameBaseHeader = 'sapMNLB-Header';
                var classNameHeader = 'sapMNLI-Header';
                var classNameInitialOverwriteTitle = 'sapMNLI-TitleWrapper--initial-overwrite';

                oRm.write('<div');
                oRm.addClass(classNameBaseHeader);
                oRm.addClass(classNameHeader);
                oRm.addClass(classNameInitialOverwriteTitle);

                if (buttonsShouldBeRendered(oControl)) {
                    oRm.addClass(classNameNoFooter);
                }

                oRm.writeClasses();
                oRm.addStyle('max-height', '6.5rem');
                oRm.writeStyles();
                oRm.write('>');

                this.renderTopRightAttachmentIcon(oRm, oControl);
                this.renderTitle(oRm, oControl);
                oRm.write('</div>');
            };

            NotificationListItemRenderer.renderTopRightAttachmentIcon = function (oRm, oControl) {
                if (oControl.getAttachments() && oControl.getAttachments().length) {
                    oRm.renderControl(oControl.getAggregation('_topRightAttachmentIcon'));
                }
            };

            NotificationListItemRenderer.renderTitle = function (oRm, oControl) {
                oRm.renderControl(oControl._getHeaderTitle());

                if (oControl.getSubTitle()) {
                    oRm.renderControl(this.renderSubTitle(oRm, oControl));
                }

                if (oControl.getAgreements() && oControl.getAgreements().length) {
                    oRm.renderControl(this.renderAgreementLink(oRm, oControl));
                }

                if (oControl.getAttachments() && oControl.getAttachments().length) {
                    oRm.renderControl(this.renderAttachedLinks(oRm, oControl));
                }
            };

            NotificationListItemRenderer.renderSubTitle = function (oRm, oControl) {
                oRm.write('<div');
                oRm.addStyle('width', '100%');
                oRm.writeStyles();
                oRm.write('>');

                oRm.renderControl(oControl._getHeaderSubTitle());

                oRm.write('</div>');
            };

            NotificationListItemRenderer.renderAgreementLink = function (oRm, oControl) {
                oRm.write('<div');
                oRm.addStyle('width', '100%');
                oRm.addStyle('display', 'flex');
                oRm.addStyle('align-items', 'center');
                oRm.writeStyles();
                oRm.write('>');

                oRm.renderControl(oControl._getAgreementAvatar());
                oRm.renderControl(oControl.getAggregation('_overflowToolbarAgreements'));

                oRm.write('</div>');
            };

            NotificationListItemRenderer.renderAttachedLinks = function (oRm, oControl) {
                oRm.write('<div');
                oRm.addStyle('width', '100%');
                oRm.addStyle('display', 'flex');
                oRm.addStyle('align-items', 'center');
                oRm.writeStyles();
                oRm.write('>');

                oRm.renderControl(oControl._getAttachmentIcon());
                oRm.renderControl(oControl.getAggregation('_overflowToolbarAttachments'));

                oRm.write('</div>');
            };

            if (this.getAggregation('_closeButton')) {
                this.getAggregation('_closeButton').setVisible(false);
            }

            var _topRightAttachmentIcon = new sap.ui.core.Icon(this.getId() + '-topRightAttachmentIcon', {
                src: IconPool.getIconURI('attachment')
            }).addStyleClass(classNameCloseButton);

            this.setAggregation('_topRightAttachmentIcon', _topRightAttachmentIcon, true);
        },

        setSubTitle: function (subTitle) {
            var result = this.setProperty('subTitle', subTitle);

            this._getHeaderSubTitle().setText(subTitle);

            return result;
        },

        _getHeaderSubTitle: function () {
            var subTitle = this.getAggregation('_headerSubTitle');

            if (!subTitle) {
                subTitle = new sap.m.Label({
                    id: this.getId() + '-subTitle',
                    text: this.getSubTitle(),
                    displayOnly: true
                });

                this.setAggregation('_headerSubTitle', subTitle, true);
            }

            return subTitle;
        },

        _getAgreementAvatar: function () {
            var subTitle = this.getAggregation('_agreementAvatar');

            if (!subTitle) {
                subTitle = new sap.f.Avatar({
                    id: this.getId() + '-agreementAvatar',
                    src: IconPool.getIconURI('document-text'),
                    displaySize: 'Custom',
                    displayShape: 'Square',
                    customDisplaySize: '1.25rem',
                    customFontSize: '.725rem'
                }).addStyleClass('sapUiTinyMarginEnd');

                this.setAggregation('_agreementAvatar', subTitle, true);
            }

            return subTitle;
        },

        _getAttachmentIcon: function () {
            var subTitle = this.getAggregation('_attachmentIcon');

            if (!subTitle) {
                subTitle = new sap.ui.core.Icon({
                    id: this.getId() + '-attachmentIcon',
                    src: IconPool.getIconURI('attachment'),
                }).addStyleClass('sapUiTinyMarginEnd halfsapUiTinyMarginEnd');

                this.setAggregation('_attachmentIcon', subTitle, true);
            }

            return subTitle;
        },

        clone: function () {
            var clonedObject = NotificationListItem.prototype.clone.apply(this, arguments);

            // '_overflowToolbar' aggregation is hidden and it is not cloned by default
            var overflowToolbar = this.getAggregation('_overflowToolbarAttachments');
            clonedObject.setAggregation('_overflowToolbarAttachments', overflowToolbar.clone(), true);

            var agreementOverflowToolbar = this.getAggregation('_overflowToolbarAgreements');
            clonedObject.setAggregation('_overflowToolbarAgreements', agreementOverflowToolbar.clone(), true);

            return clonedObject;
        }
    });

    oArchivedNotificationListItem.getMetadata().forwardAggregation(
        'buttons',
        {
            getter: function () {
                return this.getAggregation('_overflowToolbar');
            },
            aggregation: 'content',
            forwardBinding: true
        }
    );

    oArchivedNotificationListItem.getMetadata().forwardAggregation(
        'agreements',
        {
            getter: function () {
                return this.getAggregation('_overflowToolbarAgreements');
            },
            aggregation: 'content',
            forwardBinding: true
        }
    );

    oArchivedNotificationListItem.getMetadata().forwardAggregation(
        'attachments',
        {
            getter: function () {
                return this.getAggregation('_overflowToolbarAttachments');
            },
            aggregation: 'content',
            forwardBinding: true
        }
    );


    return oArchivedNotificationListItem;
});