/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
    "sap/f/library",
    "sap/f/Card",
    "sap/f/CardRenderer"
], function (
    library,
    Card,
    CardRenderer
) {
    "use strict";
    /* global Map */
    var HeaderPosition = library.cards.HeaderPosition;

    var IntegrationCard = Card.extend("vistex.control.ovp.IntegrationCard", /** @lends sap.ui.integration.widgets.Card.prototype */ {
        metadata: {
            properties: {
                colSpan: {type: "int"},

                height: {type: "sap.ui.core.CSSSize", group: "Appearance", defaultValue: "100%"},

                cardHeight: {"type": "int", defaultValue: 2},

                cardWidth: {"type": "int", defaultValue: 2},

                cardX: {"type": "int"},

                cardY: {"type": "int"},

                cardConfiguration: {"type": "object"}
            }
        },
        renderer: CardRenderer
    });

    /**
     *Initializes the Control instance after creation.
     */
    IntegrationCard.prototype.init = function () {
        Card.prototype.init.apply(this, arguments);
        this.addStyleClass("sapOvpBaseCard");
    };

    /**
     *Function is called after the rendering of the control is started.
     */
    IntegrationCard.prototype.onAfterRendering = function () {
        Card.prototype.onAfterRendering.apply(this, arguments);
        if (this.getHeader()['mEventRegistry']['press']) {
            this.getHeader().addStyleClass('sapFCardClickable');
        } else {
            this.getHeader().removeStyleClass('sapFCardClickable');
        }
    }

    /**
     * Returns the created Integration card
     */
    return IntegrationCard;
});