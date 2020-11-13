sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/TextArea",
    "sap/m/Text",
    "sap/m/Select"
], function (Control, Button, Dialog, TextArea, Text, Select) {
    "use strict";
    var oControl = Control.extend("vistex.control.DialogButton", {
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

                selectText: {type: "string", defaultValue: ""},

                commentReq: {type: "boolean", defaultValue: "true"}
            },
            aggregations: {
                _button: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},
                _dialog: {type: "sap.m.Dialog", multiple: false, visibility: "hidden"},

                selectItems: {type: "sap.ui.core.Item", multiple: true}
            },
            associations: {
                _textArea: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},
                _descriptionText: {type: "sap.m.Text", multiple: false, visibility: "hidden"},

                _dialogSubmitBtn: {type: "sap.m.Button", multiple: false, visibility: "hidden"},
                _dialogCancelBtn: {type: "sap.m.Button", multiple: false, visibility: "hidden"},

                _selectText: {type: "sap.m.Text", multiple: false, visibility: "hidden"},
                _select: {type: "sap.m.Select", multiple: false, visibility: "hidden"}
            },
            events: {
                dialogOpen: {},
                dialogSubmit: {},
                dialogCancel: {}
            }
        },

        init: function () {
            this._initButton();
            this._initTextArea();
            this._initDescriptionText();
            this._initDialogSubmitBtn();
            this._initDialogCancelBtn();
            this._initSelectText();
            this._initSelect();
            this._initDialog();
        },

        _onButtonPress: function () {
            var oDialog = this._getDialog();
            this.fireDialogOpen();
            oDialog.open();

            var sText = this._getTextArea().getValue();
            this._checkReq(sText);
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

        _onTextAreaLiveChange: function (oEvent) {
            var sText = oEvent.getParameter('value');
            this._checkReq(sText);
        },

        _checkReq: function (iText) {
            switch (this.getProperty("commentReq")) {
                case true:
                    this._getDialogSubmitBtn().setEnabled(iText.length > 0);
                    break;
                default:
                    if (this.getProperty("commentReq") === false) {
                        this._getDialogSubmitBtn().setEnabled(true);
                    }
                    break;
            }
        },

        _initSelect: function () {
            var oSelect = this._createSelect();
            this.setAssociation("_select", oSelect);
        },

        _createSelect: function () {
            return new Select().addStyleClass("sapUiTinyMarginTop");
        },

        _getSelectControl: function () {
            return sap.ui.getCore().byId(this.getAssociation("_select"));
        },

        bindAggregation: function (sName, oBindingInfo) {
            switch (sName) {
                case "selectItems":
                    this._getSelectControl().bindAggregation("items", oBindingInfo);
                    break;
                default:
                    Control.prototype.bindAggregation.apply(this, arguments);
                    break;
            }
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
                case "selectText":
                    this._getSelectTextControl().setText(vValue);
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

        _initTextArea: function () {
            var oTextArea = this._createTextArea();
            oTextArea.attachEvent("change", this._onTextAreaChanged.bind(this));
            oTextArea.attachEvent("liveChange", this._onTextAreaLiveChange.bind(this));
            this.setAssociation("_textArea", oTextArea);
        },

        _createTextArea: function () {
            return new TextArea({width: "100%"}).addStyleClass("sapUiTinyMarginTopBottom");
        },

        _initSelectText: function () {
            var oSelectText = this._createDescriptonText();
            this.setAssociation("_selectText", oSelectText);
        },

        _getSelectTextControl: function () {
            return sap.ui.getCore().byId(this.getAssociation("_selectText"));
        },

        _initDialog: function () {
            var oDialog = this._createDialog(),
                oTextArea = this._getTextArea(),
                oDescriptionText = this._getDscriptionText(),
                oSelectText = this._getSelectTextControl(),
                oSelect = this._getSelectControl();

            oDialog.addContent(oDescriptionText);
            oDialog.addContent(oTextArea);
            oDialog.addContent(oSelectText);
            oDialog.addContent(oSelect);
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