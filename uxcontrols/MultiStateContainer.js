sap.ui.define([
    "sap/m/VBox"
], function (VBox) {

    return VBox.extend("vistex.control.MultiStateContainer", {
        metadata: {
            properties: {
                state:{
                    type: "int",
                    defaultValue: 0
                }
            }
        },

        setProperty: function (sPropertyName, iNewState, bSuppressInvalidate) {
           switch (sPropertyName) {
               case "state":
                   var iCurrentState = this.getState();
                   if(iCurrentState !== iNewState){
                       VBox.prototype.setProperty.call(this, "state", iNewState, true);
                       this._setItemsVisibility();
                   }
                   break;
               default:
                   VBox.prototype.setProperty.apply(this, arguments);
                   break;
           }
        },

        onBeforeRendering: function () {
            VBox.prototype.onBeforeRendering.apply(this, arguments);
            this._setItemsVisibility();
        },

        _setItemsVisibility: function () {
            this.getItems().forEach(function(item) {
                item.setVisible(false);
            });

            if(this.getItems().hasOwnProperty(this.getState())){
                this.getItems()[this.getState()].setVisible(true);
            }
        },

        renderer: {}

    });
});