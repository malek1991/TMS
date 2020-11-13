sap.ui.define([
	"jquery.sap.global",
	"sap/m/Text",
	"sap/ui/core/library",
	"sap/ui/core/Renderer"
], function(jQuery, Text, coreLibrary, Renderer) {
	"use strict";

	/**
	 * Creates the CollapsedText Control
	 * 
	 * Card Item CollapsedText Control
	 *  
	 * 
	 * @class CollapsedText
	 * @param {object} mProperties
	 *
	 * @author DRAKSHIT
	 * @version 2.0
	 * 
	 * @constructor
	 * @public
	 * @name vistex.control.CollapsedText
	 * 
	 */

	var CollapsedText = Text.extend("vistex.control.CollapsedText", {
		metadata: {
			properties: {
				maxCharacters: {
					type: 'int',
					defaultValue: 500
				}
			}
		},

		renderer: function(oRm, oControl) {
			oControl.renderControl(oRm, oControl); //use supercass renderer routine
		},

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.m.Text} oText An object representation of the control that should be rendered.
		 */
		renderControl: function(oRm, oText) {
			// get control values
			var sWidth = oText.getWidth(),
				sText = oText.getText(true),
				sTextDir = oText.getTextDirection(),
				sTooltip = oText.getTooltip_AsString(),
				nMaxLines = oText.getMaxLines(),
				bWrapping = oText.getWrapping(),
				sTextAlign = oText.getTextAlign(),
				bRenderWhitespace = oText.getRenderWhitespace();

			// start writing html
			oRm.write("<span");
			oRm.writeControlData(oText);
			oRm.addClass("sapMText");
			oRm.addClass("sapUiSelectable");

			// set classes for wrapping
			if (!bWrapping || nMaxLines == 1) {
				oRm.addClass("sapMTextNoWrap");
			} else if (bWrapping) {
				// no space text must break
				if (sText && sText.length > 0 && !/\s/.test(sText)) {
					oRm.addClass("sapMTextBreakWord");
				}
			}

			// write style and attributes
			sWidth ? oRm.addStyle("width", sWidth) : oRm.addClass("sapMTextMaxWidth");
			if (sTextDir !== coreLibrary.TextDirection.Inherit) {
				oRm.writeAttribute("dir", sTextDir.toLowerCase());
			}
			sTooltip && oRm.writeAttributeEscaped("title", sTooltip);
			if (sTextAlign) {
				sTextAlign = Renderer.getTextAlign(sTextAlign, sTextDir);
				if (sTextAlign) {
					oRm.addStyle("text-align", sTextAlign);
				}
			}

			if (bRenderWhitespace) {
				var whitespaceClass = bWrapping ? "sapMTextRenderWhitespaceWrap" : "sapMTextRenderWhitespace";
				oRm.addClass(whitespaceClass);
			}

			// finish writing html
			oRm.writeClasses();
			oRm.writeStyles();
			oRm.write(">");

			// handle max lines
			if (oText.hasMaxLines()) {
				oText.renderMaxLines(oRm, oText);
			} else {
				oText.renderText(oRm, oText);
			}

			// finalize
			oRm.write("</span>");
		},

		/**
		 * Renders the max lines inner wrapper
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.m.Text} oText An object representation of the control that should be rendered.
		 */
		renderMaxLines: function(oRm, oText) {
			oRm.write("<span");
			oRm.writeAttribute("id", oText.getId() + "-inner");
			oRm.addClass("sapMTextMaxLine");

			// check native line clamp support
			if (oText.canUseNativeLineClamp()) {
				oRm.addClass("sapMTextLineClamp");
				oRm.addStyle("-webkit-line-clamp", oText.getMaxLines());
			}

			oRm.writeClasses();
			oRm.writeStyles();
			oRm.write(">");
			oText.renderText(oRm, oText);
			oRm.write("</span>");
		},

		/**
		 * Renders the normalized text property.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.m.Text} oText An object representation of the control that should be rendered.
		 */
		renderText: function(oRm, oText) {
			var lsText = oText.getText(true).replace(/\\t/g, "\t");

			if (lsText.length > oText.getMaxCharacters()) {
				oText._writeCollapsedText(oRm, oText);
			} else {
				oRm.writeEscaped(lsText);
			}
		},

		_writeCollapsedText: function(oRm, ioControl) {
			// 'oFeedListItem._bTextExpanded' is true if the text has been expanded and rendering needs to be done again.
			if (ioControl._bTextExpanded) {
				oRm.write(ioControl.getText(true).replace(/\\t/g, "\t"));
				oRm.write('<span class ="sapMFeedListItemTextString">');
				oRm.write("&#32"); // space
				oRm.write('</span>');
			} else {
				oRm.write(ioControl.getCurrentText());
				oRm.write('<span class ="sapMFeedListItemTextString">');
				oRm.write("&#32&#46&#46&#46&#32"); // space + three dots + space
				oRm.write('</span>');
			}
			var oLinkExpandCollapse = ioControl._getLinkExpandCollapse();
			oLinkExpandCollapse.addStyleClass("sapMFeedListItemLinkExpandCollapse");
			oRm.renderControl(oLinkExpandCollapse);
		}
	});

	CollapsedText._sTextShowMore = "more"; //CollapsedTextRenderer._oRb.getText("TEXT_SHOW_MORE");
	CollapsedText._sTextShowLess = "less"; //CollapsedTextRenderer._oRb.getText("TEXT_SHOW_LESS");

	CollapsedText.prototype._getLinkExpandCollapse = function() {
		if (!this._oLinkExpandCollapse) {
			this._bTextExpanded = false;
			this._oLinkExpandCollapse = new sap.m.Link({
				press: [this._toggleTextExpanded, this]
			});
			// Necessary so this gets garbage collected and the text of the link changes at clicking on it
			this._oLinkExpandCollapse.setParent(this, null, true);
		}

		this._oLinkExpandCollapse.setText(this._bTextExpanded ? this._sTextShowLess : CollapsedText._sTextShowMore);
		return this._oLinkExpandCollapse;
	};

	CollapsedText.prototype._toggleTextExpanded = function() {
		this._bTextExpanded = !this._bTextExpanded;
		this.rerender();
	};

	CollapsedText.prototype.getCurrentText = function() {
		var lsText = this.getText(true).replace(/\\t/g, "\t");

		if (this._bTextExpanded) {
			return lsText;
		} else {
			return lsText.slice(0, this.getMaxCharacters());
		}
	};

	return CollapsedText;
});