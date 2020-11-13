sap.ui.define([
    "sap/uxap/ObjectPageSubSection"
], function (Control) {
    "use strict";
    return Control.extend("vistex.uxap.ObjectPageSubSection", {
        metadata: {
            properties: {
                hideTitleOnPage: {type: 'boolean', defaultValue: false},
                stretchToFit: {type: 'boolean', defaultValue: false}
            }
        },

        init: function () {
            sap.uxap.ObjectPageSubSection.prototype.init.apply(this, arguments);
        },

        setStretchToFit: function (vValue, bInvalidate) {
            this.setProperty('stretchToFit', vValue, bInvalidate);
            if (vValue) {
                this.addStyleClass('sapUxAPObjectPageSubSectionFitContainer');
            } else {
                this.removeStyleClass('sapUxAPObjectPageSubSectionFitContainer');
            }

        },

        onAfterRendering: function () {
            sap.uxap.ObjectPageSubSection.prototype.onAfterRendering.apply(this);
            this._hideTitle();
        },

        _hideTitle: function () {
            if (this.getHideTitleOnPage() && this.$()) {
                var titleDiv = this.$().find('.sapUxAPObjectPageSubSectionHeader');
                if (titleDiv.length === 1) {
                    titleDiv[0].style.display = 'none';
                }
            }
        },

        renderer: {},
    });
});
