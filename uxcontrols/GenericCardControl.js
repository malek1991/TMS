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
	 * @name vistex.control.GenericCardControl
	 * 
	 */

	return Control.extend("vistex.control.GenericCardControl", {
		metadata: {
			properties: {
				showHeader: {
					type: 'boolean',
					defaultValue: true
				},
				showFooter: {
					type: 'boolean',
					defaultValue: true
				},
				title: 'string',
				subtitle: 'string'
			},
			aggregations: {
				content: {
					type: 'vistex.control.GenericCardItem',
					multiple: true
				}
			}
		},

		renderer: function(ioRm, ioControl) {
			var title = new sap.m.Text({
					text: ioControl.getTitle()
				}),
				subtitle = new sap.m.Text({
					text: ioControl.getSubtitle()
				}),
				header = new sap.m.VBox({
					items: [
						new sap.m.FlexBox({
							items: [title]
						}),
						new sap.m.FlexBox({
							items: [subtitle]
						})
					]
				}),
				content = ioControl.getContent();
			title.addStyleClass('sapOvpCardTitle');
			subtitle.addStyleClass('sapOvpCardSubtitle');
			header.addStyleClass('sapOvpCardHeader');

			ioRm.write("<div ");
            ioRm.addClass("vistex-generic-card");
			ioRm.addClass("sapOvpBaseCard");
			ioRm.writeClasses();
			ioRm.addStyle("width", "20rem");
			ioRm.writeStyles();

			ioRm.writeControlData(ioControl);
			ioRm.write('>');
			if (ioControl.getShowHeader()) {
				ioRm.renderControl(header);
			}

			ioRm.write("<div ");
			ioRm.addClass("vistex-generic-card-content");
			ioRm.writeClasses();

			ioRm.write('>');
			for (var i = 0; i < content.length; i++) {
				ioRm.renderControl(content[i]);
			}

			ioRm.write('</div>');
			ioRm.write('</div>');
		}
	});
});