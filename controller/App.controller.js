sap.ui.define([
    "vistex/tms/controller/BaseController",
    "sap/m/MessageBox",
    'vistex/tms/utils/Formatter'
], function (BaseController, MessageBox, Formatter) {
    "use strict";

    return BaseController.extend("vistex.tms.controller.App", {

        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);
            this.getRouter().attachTitleChanged(this.onTitleChanged.bind(this));
        },
        onTitleChanged: function (oEvent) {

        },

        handleMenu: function (oEvent) {
            var sKey = oEvent.getParameter('item').getKey(),
                oCurrentPackage = this.getModel("globalModel").getProperty("/currentPackage");

            switch (sKey) {
                case "Logout":
                    this.logout();
                    break;
                case "groups":
                    this.getRouter().navTo(sKey,
                        {
                            "packageId": oCurrentPackage.Id
                        },
                        true);
                    break;

                case "theme": sap.ui.getCore().applyTheme(oEvent.getParameter("item").getText());
                    break;
                default:
                    this.getRouter().navTo(sKey);
                    break;

            }

        },

        logout: function () {
            window.location.replace(window.location.origin + "/AzureAd/Account/SignOut");
        },

        onNavHome: function () {
            this.getRouter().navTo('home',
                {
                    "packageId": ""
                },
                true);
        },

        getCurrentPackageId: function (oPackage) {
            if (oPackage) return oPackage.Id;
            return undefined;
        },

        onNotificationButtonPress: function (oEvent) {
            if (!this._oNotificationPopover) {
                this._oNotificationPopover = sap.ui.xmlfragment("vistex.tms.fragments.notifications.UserNotification", this);
                this.getView().addDependent(this._oNotificationPopover);
            }

            this._oNotificationPopover.openBy(oEvent.getSource());
        },

        onNotificationClose: function (oEvent) {
            this._oNotificationPopover.close();
        },

        onTogglePage: function () {
            var Master = sap.ui.getCore().byId('__component0---SplitView--SplitApp-Master'),
                isVisible = Master.getVisible();
            if (isVisible) {
                Master.setVisible(false);
            } else {
                Master.setVisible(true);
            }
        }

    });
});
