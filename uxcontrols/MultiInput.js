sap.ui.define([
    'sap/m/MultiInput'
], function (MultiInput) {
    'use strict';
    return MultiInput.extend('vistex.m.MultiInput', {
        metadata: {
            properties: {
                'key': 'string',
                'descriptionKey': 'string',
                'showTableSuggestion': {
                    'type': 'Boolean',
                    'defaultValue': false
                },
                'userChange': {
                    'type': 'boolean',
                    'defaultValue': false,
                    'visibility': 'hidden'
                }
            }
        },

        renderer: {}
    });

});
