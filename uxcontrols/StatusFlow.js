sap.ui.define([
	"jquery.sap.global",
    "sap/suite/ui/commons/ProcessFlow",
    "sap/suite/ui/commons/ProcessFlowRenderer"
], function(jQuery, ProcessFlow, ProcessFlowRenderer) {
	"use strict";

	/**
	 * Creates the StatusFlow Control
	 * 
	 * Card Item StatusFlow Control
	 *  
	 * 
	 * @class StatusFlow
	 * @param {object} mProperties
	 *
	 * @author DRAKSHIT
	 * @version 2.0
	 * 
	 * @constructor
	 * @public
	 * @name vistex.control.StatusFlow
	 * 
	 */

	var StatusFlow = ProcessFlow.extend("vistex.control.StatusFlow", {
		metadata: {
            aggregations: {
                toolbar: { type: 'sap.m.HBox', multiple: false },
            },
            events: {
                press: {
                    parameters: {
                        sourceControl: { type: 'object' }
                    }
                }
            }
		},

		renderer: function(ioRm, ioControl) {
			ioRm.write('<div ');
            ioRm.writeControlData(ioControl);
            ioRm.addClass("vistex-status-flow");
            ioRm.writeClasses();
            ioRm.write('>');

            ioRm.write('<div ');
            ioRm.writeControlData(ioControl);
            ioRm.addClass("vistex-status-flow-toolbar");
            ioRm.writeClasses();
            ioRm.write('>');
            ioRm.renderControl(ioControl.getToolbar());
            ioRm.write('</div>');

            ProcessFlowRenderer.render.apply(this, arguments);
            ioRm.write('</div>');
		},


        init: function() {
            ProcessFlow.prototype.init.apply(this, arguments);
            this.attachNodePress(this.onNodePress.bind(this));
            this.createToolbar();
        },

        onNodePress: function (ioEvent) {
            var sourceControl = ioEvent.getParameters();
            this.firePress(sourceControl);
        },

        createToolbar: function() {
			this.setToolbar(new sap.m.HBox({
				items: [
					new sap.m.Button({
						icon: 'sap-icon://zoom-out',
						type: 'Transparent',
						press: this.zoomOut.bind(this)
					}),
					new sap.m.Button({
						icon: 'sap-icon://zoom-in',
						type: 'Transparent',
						press: this.zoomIn.bind(this)
					})
				]
			}));
        }
    });

	return StatusFlow;
});