    sap.ui.define([
    "jquery.sap.global",
    "sap/m/Panel","vistex/tms/uxcontrols/DialogSetEdit"
    ], function(jQuery, Panel, DialogSetEdit) {
    "use strict";

    var Menu = Panel.extend("vistex.control.SetCategoryList", {
        metadata: {
                properties: {
                    editMode: {type: "boolean", defaultValue: false},
                    setHeaderText: {type: "string", defaultValue: ""}
                }
        },
        onBeforeRendering: function(){
            if(!this.oModel){
                this.oModel = this.getModel('widgetModel').getData();
                this.addStyleClass('sapUiTinyMarginBeginEnd');
                var addButton = this.addButton,
                    editButton = this.editButton,
                    deleteButton= this.deleteButton;

                addButton.attachPress(DialogSetEdit.onEditPress.bind(DialogSetEdit, this, this.oModel));
                editButton.attachPress(DialogSetEdit.onEditPress.bind(DialogSetEdit, this, this.oModel));
                deleteButton.attachPress(DialogSetEdit.onEditPress.bind(DialogSetEdit, this, this.oModel));
                this.setHeaderToolbar(new sap.m.Toolbar({
                    style:'Clear',
                    content:[
                        new sap.m.ToolbarSpacer({width:"1rem"}),
                        this.titleText,
                        new sap.m.ToolbarSpacer(),
                        editButton,
                        deleteButton,
                        addButton,
                        new sap.m.ToolbarSpacer({width:"2rem"})
                    ]
                }))
            }
        },
        init: function(){

        },
        titleText:   new sap.m.Title({text:"Delete"}),
        addButton:  new sap.m.Button({icon:"sap-icon://add"}),
        editButton:  new sap.m.Button({text:"Edit", visible: false}),
        deleteButton:   new sap.m.Button({text:"Delete", visible:false}),

        setProperty: function (sPropertyName, vValue, bSuppressInvalidate) {
            switch (sPropertyName) {
                case "editMode":
                    this.editButton.setVisible(vValue);
                    this.deleteButton.setVisible(vValue);
                    break;
                case "setHeaderText":
                    this.titleText.setText(vValue);
                    break;
            }
        },
        renderer:{}
    });

    return Menu;
});
