sap.ui.define([
    "sap/f/Avatar"
], function (Avatar) {
    "use strict";
    return Avatar.extend("vistex.control.MoreAvatar", {

        init: function () {
            Avatar.prototype.init.apply(this, arguments);
        },

        _areInitialsValid: function () {
            return true;
        },

        renderer: {}
    });

    return Avatar;
});