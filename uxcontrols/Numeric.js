sap.ui.define([
    "jquery.sap.global",
    "sap/m/Input"
], function (jQuery, Control) {
    "use strict";
    return Control.extend("vistex.control.Numeric", {
        metadata: {
            properties: {
                "decimals": "sap.ui.model.type.String",
                "defaultValue": undefined
            }
        },
        setProperty: function (sPropertyName, vValue, bSuppressInvalidate) {
            switch (sPropertyName) {
                case "decimals":

                    if (this.getBinding("value")) {
                        var oFormatOptions,
                            oBinding = this.getBinding("value"),
                            oBindingInfo = this.getBindingInfo("value");
                        // Array of binding info objects for the parts of a composite binding
                        if (oBinding.getValue() instanceof Array) {
                            var parts = [];
                            for (var i = 0; i < oBinding.getBindings().length; i++) {
                                var oBindingItem = oBinding.getBindings()[i];
                                if (oBindingItem.getType() && oBindingItem.getType().sName === "Float") {

                                    oFormatOptions = oBindingItem.getType().oFormatOptions;
                                    oFormatOptions["maxFractionDigits"] = vValue;
                                    parts.push(
                                        {
                                            path: oBindingItem.getPath(),
                                            model: oBindingInfo.parts[i].model,
                                            type: new sap.ui.model.type.Float(oFormatOptions)
                                        }
                                    );

                                } else {
                                    parts.push(
                                        {
                                            path: oBindingItem.getPath(),
                                            model: oBindingInfo.parts[i].model,
                                            type: oBindingItem.getType()

                                        }
                                    );
                                }
                            }
                            this.bindProperty("value", {parts: parts});
                            // Simple Binding Path
                        } else {

                            if (oBinding.getType() && oBinding.getType().sName === "Float") {

                                oFormatOptions = oBinding.getType().oFormatOptions;
                                oFormatOptions["maxFractionDigits"] = vValue;

                                this.bindProperty("value", {
                                    path: oBinding.getPath(),
                                    model: oBindingInfo.parts[0].model,
                                    type: new sap.ui.model.type.Float(oFormatOptions)
                                });

                            }
                        }
                    }

                    break;
                default:
                    break;
            }
            return Control.prototype.setProperty.apply(this, arguments);
        },
        renderer: {}
    });
    return Control;
});