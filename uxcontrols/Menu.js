sap.ui.define([
	"jquery.sap.global",
	"sap/ui/unified/Menu",
	"sap/ui/unified/MenuItemBase",
    'sap/ui/Device'
], function(jQuery, UnifiedMenu, MenuItemBase, Device) {
	"use strict";

	/**
	 * Creates the Menu Control
	 * 
	 * Card Item Menu Control
	 *  
	 * 
	 * @class Menu
	 * @param {object} mProperties
	 *
	 * @author DRAKSHIT
	 * @version 2.0
	 * 
	 * @constructor
	 * @public
	 * @name vistex.control.Menu
	 * 
	 */

	var Menu = UnifiedMenu.extend("vistex.control.Menu", {

        onBeforeRendering:function(){
            var aItems = this.getItems();

            aItems.forEach(function (oItem) {
                if(oItem.getSubmenu1().length > 0){
                    oItem.setSubmenu(oItem.getSubmenu1()[0]);
                }
            });

            UnifiedMenu.prototype.onBeforeRendering.apply(this, arguments);
        },

        selectItem : function(oItem, bWithKeyboard, bCtrlKey){
			if (!oItem || !(oItem instanceof MenuItemBase && this.checkEnabled(oItem))) {
				return;
			}

			var oSubMenu = oItem.getSubmenu();

			if (!oSubMenu) {
				// This is a normal item -> Close all menus and fire event.
				this.getRootMenu().close();
			} else {
				if (!Device.system.desktop && this.oOpenedSubMenu === oSubMenu) {
					this.closeSubmenu();
				} else {
					// Item with sub menu was triggered -> Open sub menu and fire event.
					this.openSubmenu(oItem, bWithKeyboard);
				}
				return;
			}

			oItem.fireSelect({item: oItem, ctrlKey: bCtrlKey});
			this.getRootMenu().fireItemSelect({item: oItem});
      	},


    bindAggregation:function(sName, oBindingInfo){
			if(sName == "items"){
				var oTemplate = oBindingInfo.template;
				if(!oTemplate) return;

				if(oBindingInfo.model){
                    sModelName = oBindingInfo.model;
                    sPath =  oBindingInfo.path;
				}else {
                    var aPathArr = oBindingInfo.path.split(">/");
                    if (aPathArr.length == 1) {
                        aPathArr = oBindingInfo.path.split(">");
                    }

                    var sModelName = aPathArr[0],
                        sPath = aPathArr[1];
                    }

                    var aPath = sPath.split("/");
					if(aPath.length > 0){
						var sItemsPath = aPath[aPath.length - 1];
					}else
						sItemsPath = sPath;

					oTemplate.bindAggregation("submenu1", {
					path: sModelName + ">subMenu1",
                    factory:function (sId, oContext) {
						return new Menu({
							items:{
								path: sModelName + ">" + sItemsPath,
								template: oTemplate
							}
						})
                    }
				});
			}

            UnifiedMenu.prototype.bindAggregation.apply(this, arguments);
		},

		renderer:{}
    });


	return Menu;
});