sap.ui.define([
    "sap/m/Button"
], function (Button) {
    "use strict";
    var oControl = Button.extend("vistex.tms.control.NotificationButton", {
        metadata: {
            properties: {
            },
            aggregations: {
            },
            associations: {
            },
            events: {
                press: {

                }
            }
        },

        renderer: {
            render: function(oRm,oControl){
                sap.m.ButtonRenderer.render(oRm,oControl); //use supercass renderer routine

                oRm.write("<div ");
          /*      oRm.addClass("notificatinButtonLabel");
                oRm.addClass("sapMBtnContent");*/
                oControl.addStyleClass('notificatinButtonLabel');
                oRm.writeControlData(oControl); //ui5 trackings data, outputs sId, absolutely mandatory
              //  oRm.writeClasses();
                oRm.write(">");

                oRm.write("</dic>");
            }

        }    });

    oControl.prototype.onclick = function () {
        this.firePress();
    };

    oControl.prototype.onmouseover = function () {
        this.$().css("cursor","pointer");
    };
    return oControl;
});
