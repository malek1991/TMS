sap.ui.define([
    "jquery.sap.global",
    "sap/m/Input"
], function (jQuery, Input) {
    "use strict";
    /**
     *
     * @constructor
     * @public
     * @name vistex.m.Input
     *
     */
    var Input = Input.extend("vistex.m.Input", {
        metadata: {
            properties: {
                upperCase: {
                    "type": "Boolean",
                }
            }
        },
        init: function () {
            sap.m.Input.prototype.init.apply(this, arguments);
            this.attachLiveChange(this.changeToUpperCase.bind(this));
        },
        changeToUpperCase: function (event) {
            this.setValue(event.getParameter('value').toUpperCase());
        },
        renderer: {}
    });
    return Input;
});