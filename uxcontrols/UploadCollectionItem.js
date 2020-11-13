sap.ui.define([
    "sap/m/UploadCollectionItem"
], function (Control) {
    "use strict";

    return Control.extend("vistex.m.UploadCollectionItem", {
        metadata: {
            properties: {
                highlight : {type : "string", group : "Appearance", defaultValue : "None"}
            },
            events: {
                editPress: {}
            }
        }
    });
});