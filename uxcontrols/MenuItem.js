sap.ui.define([
    "jquery.sap.global",
    "sap/ui/unified/MenuItem"
], function (jQuery, UnifiedMenuItem) {
    "use strict";

    /**
     * Creates the MenuItem Control
     *
     * Card Item MenuItem Control
     *
     *
     * @class MenuItem
     * @param {object} mProperties
     *
     * @author DRAKSHIT
     * @version 2.0
     *
     * @constructor
     * @public
     * @name vistex.control.MenuItem
     *
     */

    var MenuItem = UnifiedMenuItem.extend("vistex.control.MenuItem", {

        metadata:{
            properties:{
                path:{type:"string", defaultValue:""}
            },
            aggregations: {
                submenu1: {type: "sap.ui.unified.Menu", multiple: true}
            }
        },


        onBeforeRendering : function () {
            MenuItem.prototype.apply(this, arguments);
        }
    });

    return MenuItem;
});