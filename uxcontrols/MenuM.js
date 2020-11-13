sap.ui.define([
    "jquery.sap.global",
    "sap/m/Menu"
], function (jQuery, oControl) {
    "use strict"

    var Menu = oControl.extend("vistex.control.MenuM", {

        metadata:{
        },

        init:function(){
            oControl.prototype.init.apply(this, arguments);
        },

        isTreeBinding: function(sName) {
            if ( sName === "items") {
                return true;
            }
            return false;
        },

        render : function(oRenderManager, oItem, oMenu, oInfo){
            oControl.prototype.render.apply(this, arguments);
        }
    });

    return Menu;
});