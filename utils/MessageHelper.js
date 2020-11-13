sap.ui.define([
    "sap/m/MessageBox",
    'sap/m/MessageToast',
    'vistex/tms/utils/Constants'
],
    function (MessageBox, MessageToast, Constants) {
        "use strict";

        return {

            checkServerResponseForSuccess: function (oData) {
                if (oData && oData.Message && oData.Message.Code === 0) {
                    return 0;
                } else if (oData && oData.Message && oData.Message.Code) {
                    for (var sProp in Constants.serverErrors) {
                        if (Constants.serverErrors[sProp] == oData.Message.Code) {
                            return oData.Message.Code;
                        }
                    }
                } else {
                    console.error("Unknown server message type");
                    return Constants.serverErrors.UnKnownError;
                }
            },

            showSystemError: function (oError, fnCloseCallback) {

                MessageBox.error(
                    "Status: " + oError.status + (oError.responseText ? ". Message " + oError.responseText : ""),
                    {
                        actions: [MessageBox.Action.CLOSE],
                        onClose: function () {
                            typeof (fnCloseCallback) === "function" && fnCloseCallback();
                        }
                    }
                );
            },

            showToastOutServerResponse: function (oData) {
                if (oData && oData.Message && oData.Message.Text) {
                    MessageToast.show(oData.Message.Text);
                } else {
                    console.error("Can not show Toast");
                }
            },

            showToast: function (sText) {
                MessageToast.show(sText);
            },

            showMessageOutServerResponse: function (oData, fnCloseCallback) {
                if (oData && oData.Message && oData.Message.Code === 0 && oData.Message.Text) {
                    MessageBox.success(
                        oData.Message.Text,
                        {
                            actions: [MessageBox.Action.CLOSE],
                            onClose: function () {
                                typeof (fnCloseCallback) === "function" && fnCloseCallback();
                            }
                        }
                    );
                    return;
                } else if (oData && oData.Message && oData.Message.Code !== 0 && oData.Message.Text) {
                    MessageBox.error(
                        oData.Message.Text,
                        {
                            actions: [MessageBox.Action.CLOSE],
                            onClose: function () {
                                typeof (fnCloseCallback) === "function" && fnCloseCallback();
                            }
                        }
                    );
                    return;
                }

                MessageBox.error(
                    "Unknown error occurred",
                    {
                        actions: [MessageBox.Action.CLOSE],
                        onClose: function () {
                            typeof (fnCloseCallback) === "function" && fnCloseCallback();
                        }
                    }
                );
            },
            showConfirmationDialog: function (oMessage) {
                var oMessage = (oMessage) ? oMessage : "Would you like to proceed ?";
                var oPromise = new Promise(function (fnResolve, fnReject) {
                    MessageBox.show(
                        oMessage, {
                            icon: MessageBox.Icon.INFORMATION,
                            title: "",
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            onClose: function (oAction) { fnResolve(oAction == "YES"); }
                        }
                    );
                });
                return oPromise;
            },

            showSuccessMessage: function (sText, fnOnClose) {

                MessageBox.success(sText, {
                    actions: [MessageBox.Action.OK],
                    onClose: function () {
                        if (fnOnClose && typeof fnOnClose === "function") {
                            fnOnClose();
                        }

                    }
                });

            },

            showErrorMessage: function (sText, fnOnClose) {
                MessageBox.error(sText, {
                    actions: [MessageBox.Action.OK],
                    onClose: function () {
                        if (fnOnClose && typeof fnOnClose === "function") {
                            fnOnClose();
                        }
                    }
                });
            }

        }
    });
