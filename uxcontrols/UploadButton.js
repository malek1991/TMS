sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/TextArea",
    "sap/m/Text",
    "sap/m/Select",
    "sap/ui/unified/FileUploader"
], function (Control, Button, Dialog, TextArea, Text, Select, FileUploader) {
    "use strict";
    var oControl = Control.extend("vistex.control.UploadButton", {
        metadata: {
            properties: {
                buttonEnabled: {type: "boolean", defaultValue: "true"},
                buttonIcon: {type: "sap.ui.core.URI"},
                buttonText: {type: "string", defaultValue: ""},
                buttonType: {type: "sap.m.ButtonType", defaultValue: "Default"},

                dialogTitle: {type: "string", defaultValue: ""},
                uploaderLabel: {type: "string", defaultValue : ""},

                dialogSubmitButtonText: {type: "string", defaultValue: ""},
                dialogCancelButtonText: {type: "string", defaultValue: ""},

                uploadActionName: { type: 'string' },
                immidiateUpload: { type: 'boolean', defaultValue: false }

            },
            aggregations: {
                _button: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},
                _dialog: {type: "sap.m.Dialog", multiple: false, visibility: "hidden"},
            },
            associations: {

                _uploaderLabel: {type: "sap.m.Text", multiple: false, visibility: "hidden"},
                _fileUploader: {type: "sap.ui.unified.FileUploader", multiple: false, visibility: "hidden"},

                _dialogSubmitBtn: {type: "sap.m.Button", multiple: false, visibility: "hidden"},
                _dialogCancelBtn: {type: "sap.m.Button", multiple: false, visibility: "hidden"}

            },
            events: {
                dialogOpen: {},
                dialogSubmit: {},
                dialogCancel: {},
                uploadSubmit: {}
            }
        },

        init: function () {
            this._initButton();

            this._initDialogSubmitBtn();
            this._initDialogCancelBtn();

            this._initUploaderLabel();
            this._initFileUploader();

            this._initDialog();
        },

        _onButtonPress: function () {
            var oDialog = this._getDialog();
            this.fireDialogOpen();
            oDialog.open();
        },

        _onSubmitPress: function () {
            this._getDialog().close();
            this.fireDialogSubmit();
        },

        _onCancelPress: function () {
            this._getDialog().close();
            this.fireDialogCancel();
        },


        setProperty: function (sPropertyName, vValue, bSuppressInvalidate) {
            switch (sPropertyName) {
                case "buttonEnabled":
                    this._getButtonControl().setEnabled(vValue);
                    break;
                case "buttonIcon":
                    this._getButtonControl().setIcon(vValue);
                    break;
                case "buttonText":
                    this._getButtonControl().setText(vValue);
                    break;
                case "buttonType":
                    this._getButtonControl().setType(vValue);
                    break;
                case "uploaderLabel":
                    this._getUploaderLabel().setText(vValue);
                    break;
                case "dialogTitle":
                    this._getDialog().setTitle(vValue);
                    break;
                case "dialogSubmitButtonText":
                    this._getDialogSubmitBtn().setText(vValue);
                    break;
                case "dialogCancelButtonText":
                    this._getDialogCancelBtn().setText(vValue);
                    break;
                case "uploadActionName":
                    this._getFileUploader().setProperty("uploadActionName", vValue);
                    break;
                case "immidiateUpload":
                    this._getFileUploader().setProperty("immidiateUpload", vValue);
                    break;
            }

            return Control.prototype.setProperty.apply(this, arguments);
        },

        _initButton: function () {
            var oBtn = this._createButton();
            oBtn.attachEvent("press", this._onButtonPress.bind(this));
            this.setAggregation("_button", oBtn);
        },

        _createButton: function () {
            return new Button();
        },

        _initFileUploader: function(){
            var oFileUploader = this._createFileUploader();
            oFileUploader.attachEvent("submit", function () {
                this.fireUploadSubmit();
            }.bind(this));
            this.setAssociation("_fileUploader", oFileUploader);
        },

        _createFileUploader: function(){
            return new FileUploader();
        },


        _initUploaderLabel: function(){
            var oUploaderLabel = this._createUploaderLabel().addStyleClass("sapUiTinyMarginEnd");
            this.setAssociation("_uploaderLabel", oUploaderLabel);
        },

        _createUploaderLabel: function(){
            return new Text();
        },

        _getFileUploader: function(){
            return  sap.ui.getCore().byId(this.getAssociation("_fileUploader"));
        },

        _getUploaderLabel: function(){
            return  sap.ui.getCore().byId(this.getAssociation("_uploaderLabel"));
        },

        _initDialog: function () {
            var oDialog = this._createDialog(),
                oFileUploaderLabel = this._getUploaderLabel(),
                oFileUploader = this._getFileUploader();

            oDialog.addContent(oFileUploaderLabel);
            oDialog.addContent(oFileUploader);

            oDialog.setBeginButton(this._getDialogSubmitBtn());
            oDialog.setEndButton(this._getDialogCancelBtn());

            this.setAggregation("_dialog", oDialog);
        },

        _createDialog: function () {
            return new Dialog().addStyleClass("sapUiContentPadding");
        },

        _initDialogSubmitBtn: function () {
            var oBtn = this._createButton();
            oBtn.attachEvent("press", this._onSubmitPress.bind(this));
            this.setAssociation("_dialogSubmitBtn", oBtn);
        },

        _initDialogCancelBtn: function () {
            var oBtn = this._createButton();
            oBtn.attachEvent("press", this._onCancelPress.bind(this));
            this.setAssociation("_dialogCancelBtn", oBtn);
        },

        _getButtonControl: function () {
            return this.getAggregation("_button");
        },

        _getDialog: function () {
            return this.getAggregation("_dialog");
        },

        _getDialogSubmitBtn: function () {
            return sap.ui.getCore().byId(this.getAssociation("_dialogSubmitBtn"));
        },

        _getDialogCancelBtn: function () {
            return sap.ui.getCore().byId(this.getAssociation("_dialogCancelBtn"));
        },

        renderer: {
            render: function (oRm, oControl) {
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.write(">");
                var oBtn = oControl.getAggregation("_button");
                oRm.renderControl(oBtn);
                oRm.write("</div>");
            }
        }
    });

    return oControl;
});