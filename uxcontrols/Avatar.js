sap.ui.define([
    "sap/m/library",
    "sap/m/Avatar",
    "sap/m/AvatarRenderer"
], function (library, Avatar, AvatarRenderer) {
    "use strict";

    var AvatarColor = library.AvatarColor;

    var VAvatar = Avatar.extend("vistex.control.Avatar", {
        metadata: {
            properties: {
                name: {type: "string", defaultValue: "", bindable: true},
                description: {type: "string", defaultValue: "", bindable: true},
                customBackgroundColor: {type: "string", defaultValue: "#E5E5E5", bindable: true},
                customFontColor: {type: "string", defaultValue: "#333333", bindable: true},
                tooltip: {type: "string", defaultValue: "", bindable: true}
            }
        },

        onAfterRendering: function () {
            if (!this.getBackgroundColor()) {
                this.setBackgroundColor(this.getMetadata().getProperties().backgroundColor.defaultValue)
            }

            // Set the Tooltip hear fixes the problem when instantiation in custom control
            this.setTooltip(this.getTooltip());

            //Apply CustomFontColor Changes Starts
            var sActualDisplayType = this._getActualDisplayType(),
                sImageFallbackType = this._getImageFallbackType(),
                AvatarType = library.AvatarType,
                sAvatarClass = "sapFAvatar";

            if (this.getBackgroundColor() === AvatarColor.Custom) {

                if (!this.getCustomBackgroundColor()) {
                    this.setCustomBackgroundColor(this.getMetadata().getProperties().customBackgroundColor.defaultValue)
                }

                if (!this.getCustomFontColor()) {
                    this.setCustomFontColor(this.getMetadata().getProperties().customFontColor.defaultValue)
                }

                if (sActualDisplayType === AvatarType.Icon || sImageFallbackType === AvatarType.Icon) {
                    this._getIcon().setColor(this.getCustomFontColor());
                } else if (sActualDisplayType === AvatarType.Initials || sImageFallbackType === AvatarType.Initials) {
                    this.$().find('.' + sAvatarClass + 'InitialsHolder').css('color', this.getCustomFontColor());
                }

                this.$().css('background-color', this.getCustomBackgroundColor());
            }

            sap.m.Avatar.prototype.onAfterRendering.apply(this, arguments);
        },

        renderer: function (oRm, oAvatar) {
            if (oAvatar.getBackgroundColor() === '') {
                oAvatar.setBackgroundColor('Accent6');
            }

            AvatarRenderer.render.apply(this, arguments);
        }
    });

    return VAvatar;
});