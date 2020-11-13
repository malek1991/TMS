sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Control"
], function(jQuery, Control) {
	"use strict";

	/**
	 * Creates the Card Item Control
	 * 
	 * Card Item Custom Control
	 *  
	 * 
	 * @class Card Item
	 * @param {object} mProperties
	 *
	 * @author DRAKSHIT
	 * @version 2.0
	 * 
	 * @constructor
	 * @public
	 * @name vistex.control.GenericCardItem
	 * 
	 */

	return Control.extend("vistex.control.GenericCardItem", {
		metadata: {
			properties: {
				margin: {
					type: 'boolean',
					defaultValue: false
				}
			},
			aggregations: {
				genericContent: {
					type: 'sap.ui.core.Control',
					multiple: false,
					singularName: 'content'
				}
			}
		},

		renderer: function(ioRm, ioControl) {
			ioRm.write("<div ");
			if (ioControl.getMargin()) {
				ioRm.addClass("vistex-generic-card-item-margin");
				ioRm.writeClasses();
			}

			ioRm.writeControlData(ioControl);

			ioRm.write('>');
			ioRm.renderControl(ioControl.getGenericContent());
			ioRm.write('</div>');
		}
	});
});