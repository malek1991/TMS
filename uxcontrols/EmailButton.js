sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/TextArea",
    "sap/m/Text",
    "sap/m/MultiInput",
    "sap/m/Token"
], function (Control, Button, Dialog, TextArea, Text, MultiInput, Token) {
    "use strict";
    var oControl = Control.extend("vistex.control.EmailButton", {
        metadata: {
            properties: {
                buttonEnabled: {type: "boolean", defaultValue: "true"},
                buttonIcon: {type: "sap.ui.core.URI"},
                buttonText: {type: "string", defaultValue: ""},
                buttonType: {type: "sap.m.ButtonType", defaultValue: "Default"},

                dialogTitle: {type: "string", defaultValue: ""},
                dialogDescription: {type: "string", defaultValue: ""},
                dialogComment: {type: "string", defaultValue: ""},

                dialogSubmitButtonText: {type: "string", defaultValue: ""},
                dialogCancelButtonText: {type: "string", defaultValue: ""},
                dialogContentWidth: {type: "sap.ui.core.CSSSize", defaultValue: "700px"},

                recipientText: {type: "string", defaultValue: ""}

            },
            aggregations: {
                _button: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},
                _dialog: {type: "sap.m.Dialog", multiple: false, visibility: "hidden"},

                tokens: {type: "sap.m.Token", multiple: true}

            },
            associations: {
                _textArea: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},
                _descriptionText: {type: "sap.m.Text", multiple: false, visibility: "hidden"},

                _dialogSubmitBtn: {type: "sap.m.Button", multiple: false, visibility: "hidden"},
                _dialogCancelBtn: {type: "sap.m.Button", multiple: false, visibility: "hidden"},

                _recipientText: {type: "sap.m.Text", multiple: false, visibility: "hidden"},
                _multiInput: {type: "sap.m.MultiInput", multiple: false, visibility: "hidden"}
            },
            events: {
                dialogOpen: {},
                dialogSubmit: {},
                dialogCancel: {}
            }
        },
        init: function () {
            this._initButton();
            this._initRecipientText();
            this._initMultiInput();
            this._initTextArea();
            this._initDescriptionText();
            this._initDialogSubmitBtn();
            this._initDialogCancelBtn();
            this._initDialog();
        },

        _onButtonPress: function () {
            var oDialog = this._getDialog();
            this.fireDialogOpen();
            this._getDialogSubmitBtn().setEnabled(this._getMultiInputControl().getTokens().length > 0);
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

        _onTextAreaChanged: function (oEvent) {
            this.setProperty("dialogComment", oEvent.getParameter("newValue"), true);
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
                case "dialogTitle":
                    this._getDialog().setTitle(vValue);
                    break;
                case "dialogDescription":
                    this._getDscriptionText().setText(vValue);
                    break;
                case "dialogComment":
                    this._getTextArea().setValue(vValue);
                    break;
                case "dialogSubmitButtonText":
                    this._getDialogSubmitBtn().setText(vValue);
                    break;
                case "dialogCancelButtonText":
                    this._getDialogCancelBtn().setText(vValue);
                    break;
                case "dialogContentWidth":
                    this.setDialogContentWidth(vValue);
                    break;
                case "recipientText":
                    this._getRecipientTextControl().setText(vValue);
                    break;
            }

            return Control.prototype.setProperty.apply(this, arguments);
        },

        bindAggregation: function (sName, oBindingInfo) {
            switch (sName) {
                case "tokens":
                    this._getMultiInputControl().bindAggregation("tokens", oBindingInfo);
                    break;
                default:
                    Control.prototype.bindAggregation.apply(this, arguments);
                    break;
            }
        },

        _initButton: function () {
            var oBtn = this._createButton();
            oBtn.attachEvent("press", this._onButtonPress.bind(this));
            this.setAggregation("_button", oBtn);
        },

        _createButton: function () {
            return new Button();
        },

        _initRecipientText: function () {
            var oRecipientText = this._createDescriptonText();
            this.setAssociation("_recipientText", oRecipientText);
        },

        _getRecipientTextControl: function () {
            return sap.ui.getCore().byId(this.getAssociation("_recipientText"));
        },

        _initMultiInput: function () {
            var oMultiInput = this._createMultiInput();
            oMultiInput.addValidator(function (args) {
                var text = args.text;
                var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                if (!text.match(mailregex)) {
                    //alert("Invalid Email");
                    this._getMultiInputControl().setValueState("Error");
                } else {
                    this._getMultiInputControl().setValueState("None");
                    return new Token({key: text, text: text});
                }
            }.bind(this));
            oMultiInput.attachEvent("tokenUpdate", this._onMultiInputChange.bind(this));
            this.setAssociation("_multiInput", oMultiInput);
        },

        _onMultiInputChange: function (oEvent) {
            var oTokens = oEvent.getSource().getTokens();
            switch (oEvent.getParameter("type")) {
                case "added":
                    this._getDialogSubmitBtn().setEnabled(true);
                    break;
                case "removed":
                    this._getDialogSubmitBtn().setEnabled(oTokens.length - oEvent.getParameter("removedTokens").length > 0);
                    break;
            }
        },

        _createMultiInput: function () {
            return new MultiInput({width: "100%", "showValueHelp": false, "enableMultiLineMode": false});
        },

        _getMultiInputControl: function () {
            return sap.ui.getCore().byId(this.getAssociation("_multiInput"));
        },

        _initTextArea: function () {
            var oTextArea = this._createTextArea();
            oTextArea.attachEvent("change", this._onTextAreaChanged.bind(this));
            this.setAssociation("_textArea", oTextArea);
        },

        _createTextArea: function () {
            return new TextArea({width: "100%"});
        },

        _initDialog: function () {
            var oDialog = this._createDialog(),
                oRecipientText = this._getRecipientTextControl(),
                oMultiInput = this._getMultiInputControl(),
                oTextArea = this._getTextArea(),
                oDescriptionText = this._getDscriptionText();

            oDialog.setContentWidth(this.getDialogContentWidth());
            oDialog.addContent(oRecipientText);
            oDialog.addContent(oMultiInput);
            oDialog.addContent(oDescriptionText);
            oDialog.addContent(oTextArea);
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

        _initDescriptionText: function () {
            var oText = this._createDescriptonText();
            this.setAssociation("_descriptionText", oText);
        },

        _createDescriptonText: function () {
            return new Text({"maxLines": 5, width: "100%"});
        },

        _getButtonControl: function () {
            return this.getAggregation("_button");
        },

        _getTextArea: function () {
            return sap.ui.getCore().byId(this.getAssociation("_textArea"));
        },

        _getDscriptionText: function () {
            return sap.ui.getCore().byId(this.getAssociation("_descriptionText"));
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