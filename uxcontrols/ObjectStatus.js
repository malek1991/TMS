sap.ui.define([
    "sap/m/ObjectStatus",
    'sap/m/library'
], function (ObjectStatus, library) {
    "use strict";

    var ImageHelper = library.ImageHelper;

    var oObjectStatus = ObjectStatus.extend("vistex.control.ObjectStatus", {
        metadata: {
            properties: {
                iconColor: {type: "string", group: "Appearance", defaultValue: null},
            }
        },

        renderer: function (oRm, oON) {
            sap.m.ObjectStatusRenderer.render.apply(this, arguments);
        }
    });

    oObjectStatus.prototype._getImageControl = function () {
        var sImgId = this.getId() + '-icon',
            bIsIconOnly = !this.getText() && !this.getTitle(),
            mProperties = {
                src: this.getIcon(),
                color: this.getIconColor(),
                densityAware: this.getIconDensityAware(),
                useIconTooltip: false
            };

        if (bIsIconOnly) {
            mProperties.decorative = false;
            mProperties.alt = sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("OBJECT_STATUS_ICON");
        }

        this._oImageControl = ImageHelper.getImageControl(sImgId, this._oImageControl, this, mProperties);

        return this._oImageControl;
    };

    return oObjectStatus;
});