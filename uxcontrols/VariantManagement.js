sap.ui.define([
    'sap/ui/comp/variants/VariantManagement'
], function (VariantManagement) {
    'use strict';
    var oVariantManagement = VariantManagement.extend('vistex.control.VariantManagement', {
        metadata: {
            events: {},
            properties: {
                subscribedModels: {
                    type: 'object',
                    defaultValue: {}
                },
                defaultVariantAuthor: {
                    type: 'string',
                    defaultValue: 'System'
                },
                variantType: 'string',
                gridVariantModel: 'string',
                dependentControlId: 'string',
                standardItemText: {
                    type: 'string',
                    defaultValue: 'Standard'
                },
                watchModel: {
                    type: 'string',
                    defaultValue: null
                },
                watchProperty: {
                    type: 'string',
                    defaultValue: null
                }
            }
        },

        renderer: function () {
            sap.ui.comp.variants.VariantManagementRenderer.render.apply(this, arguments);
        },

        setDefaultVariantAuthor: function (sValue) {
            if (sValue === '') {
                sValue = this.getMetadata().getProperty('defaultVariantAuthor').defaultValue;
            }
            this.setProperty('defaultVariantAuthor', sValue);
        },

        _createStandardVariantListItem: function () {
            var oVariantListItem = sap.ui.comp.variants.VariantManagement
                .prototype._createStandardVariantListItem.apply(this, arguments);
            if (this.getStandardVariantKey() === this.STANDARDVARIANTKEY) {
                oVariantListItem.setAuthor(this.getDefaultVariantAuthor());
            }
            return oVariantListItem;
        }

    });
    return oVariantManagement;

});
