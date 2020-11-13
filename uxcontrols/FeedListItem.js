sap.ui.define([
                "sap/m/FeedListItem",
                "sap/m/FeedListItemAction",
                "sap/m/Dialog",
                "sap/m/TextArea",
                "sap/m/Button"
], function(Control, FeedListItemAction, Dialog, TextArea, Button) {
    "use strict";
    var oControl = Control.extend("vistex.control.FeedListItem", {
        metadata: {
            properties: {
                editText: {type: "string", defaultValue: "Edit"},
                editIcon: {type: "sap.ui.core.URI", defaultValue: "sap-icon://edit"},
                deleteText: {type: "string", defaultValue: "Delete"},
                deleteIcon: {type: "sap.ui.core.URI", defaultValue: "sap-icon://delete"},
                editDialogTitle: {"type": "string", defaultValue: "Edit Item"},
                editDialogSaveButtonText: {"type": "string", defaultValue: "Save"},
                editDialogCancelButtonText: { "type": "string", defaultValue: "Cancel"},
                updatable: {'type': 'boolean', defaultValue: true},
                deletable: {'type': 'boolean', defaultValue: true}
            },
            aggregations: {},
            events: {
                delete:{
                    properties:{
                        item:{type: "sap.m.FeedListItem"}
                    }
                },
                update:{
                    properties:{
                        item:{type: "sap.m.FeedListItem"}
                    }
                }
            }
        },

        init: function() {
            Control.prototype.init.apply(this, arguments);
        },

        onBeforeRendering:function(){
            if(this.getActions().length == 0){
                this._addActions();
            }

            Control.prototype.onBeforeRendering.apply(this, arguments);
        },

        _addActions:function(){
            if (this.getUpdatable()) {
                this.addAction(new FeedListItemAction({
                    'key': 'edit',
                    'text': this.getEditText(),
                    'icon': this.getEditIcon(),
                    'press': this._onEditPress.bind(this)
                }));
            }

            if (this.getDeletable()) {
                this.addAction(new FeedListItemAction({
                    'key': 'delete',
                    'text': this.getDeleteText(),
                    'icon': this.getDeleteIcon(),
                    'press': this._onDeletePress.bind(this)
                }));
            }
        },

        _onEditPress:function(oEvent){
            var oDialog = this._createEditDialog();
            oDialog.open();
        },

        _onDeletePress:function(oEvent){
            this.fireDelete({"item": this});
        },

        _createEditDialog:function(){

            var oTextArea =  new TextArea({
                height: '300px',
                width: '330px',
                value: this.getText()
            });

            var dialog = new Dialog({
                title: this.getEditDialogTitle(),
                type: 'Message',
                content: [
                    oTextArea
                ],
                beginButton: new Button({
                    text: this.getEditDialogSaveButtonText(),
                    press: function () {
                        this.setText(oTextArea.getValue());
                        dialog.close();
                        this.fireUpdate({"item": this});
                    }.bind(this)
                }),
                endButton: new Button({
                    text: this.getEditDialogCancelButtonText(),
                    press: function () {
                        dialog.close();
                    }
                }),
                afterClose: function() {
                    dialog.destroy();
                }
            });

            return dialog;
        },

        renderer:{}
    });
    return oControl;
});