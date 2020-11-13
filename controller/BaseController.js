sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/model/json/JSONModel",
        'vistex/tms/utils/Constants',
    ],
    function (Controller, History, JSONModel, Constants) {
        "use strict";

        return Controller.extend("vistex.tms.controller.BaseController", {
            onInit: function () {
                this.setModel(new JSONModel({
                    busy: false
                }), "viewModel");
            },

            isAdmin: function (oUserInfo) {
                if (!oUserInfo) {
                    oUserInfo = this.getModel("globalModel").getProperty("/userInfo/User");
                }
                return oUserInfo && oUserInfo.Role === Constants.userRoles.admin;
            },

            isDeveloper: function (oUserInfo) {
                if (!oUserInfo) {
                    oUserInfo = this.getModel("globalModel").getProperty("/userInfo/User");
                }
                return oUserInfo && oUserInfo.Role === Constants.userRoles.developer;
            },

            isAdminOrDeveloper: function (oUserInfo) {
                if (!oUserInfo) {
                    oUserInfo = this.getModel("globalModel").getProperty("/userInfo/User");
                }
                return oUserInfo && oUserInfo.Role === Constants.userRoles.developer ||
                    oUserInfo && oUserInfo.Role === Constants.userRoles.admin;
            },

            setViewBusy: function (bValue) {
                var oViewModel = this.getModel("viewModel");
                oViewModel.setProperty("/busy", bValue);
            },

            getComponent: function () {
                return this.getOwnerComponent();
            },

            getRouter: function () {
                return this.getOwnerComponent().getRouter();
            },

            getModel: function (sName) {
                return this.getView().getModel(sName);
            },

            getGlobalModel: function () {
                return this.getOwnerComponent().getModel("globalModel");
            },

            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },

            getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },

            getText: function (key, args) {
                var resourceBundle = this.getResourceBundle();
                return resourceBundle.getText(key, args);
            },

            getObj: function (sName) {
                return this.getView().byId(sName);
            },

            createViewModel: function (oModel) {
                var oData = {
                    Busy: false,
                    Delay: 0,
                    Ext: {}
                };

                oData.Ext = oModel;

                return new JSONModel(oData);
            },

            onNavBack: function () {
                var sPreviousHash = History.getInstance().getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getRouter().navTo("home", {}, true);
                    window.location.reload();
                }
            },

            processBackendMessages: function (oData) {
                if (oData && oData.Message && oData.Message.Code === 0) {
                    alert(oData.Message.Text);
                }
            },

            setHeaderTitle: function (oTitle) {

            },

            openUrl: function (oUrl) {
                if (oUrl)
                    window.open(oUrl);
            },

            triggerMail: function (oName) {
                sap.m.URLHelper.triggerEmail(oName, "");
            },
            getCurrentGroup: function (gId) {
                var oGroups = this.getModel("globalModel").getProperty("/groups");
                var oGroupDetails;

                for (var i = 0; i < oGroups.length; i++)
                    if (oGroups[i].Id == gId)
                        oGroupDetails = oGroups[i];

                if (oGroupDetails)
                    return oGroupDetails;
            },
            getGroups: function () {
                var oGroups = this.getModel("globalModel").getProperty("/groups");
                return (oGroups && oGroups.length > 0) ? oGroups : [];
            },
            jsonModelFilter: function (iaFields, ioControl, lsAggregationName, And, isSearchText) {
                var loBinding = ioControl.getBinding(lsAggregationName);
                var laFilters = [];
                if (isSearchText) {
                    isSearchText = isSearchText.trim();
                    if (isSearchText) {
                        isSearchText = isSearchText.trim();
                        for (var i = 0; i < iaFields.length; i++) {
                            laFilters.push(new sap.ui.model.Filter(iaFields[i].FieldName, iaFields[i].FilterOperator, isSearchText));
                        }
                        loBinding.filter(new sap.ui.model.Filter(laFilters, And));
                    } else {
                        laFilters = [];
                        loBinding.filter(laFilters);
                    }
                } else {
                    laFilters = [];
                    loBinding.filter(laFilters);
                }
            }

        });
    });
