sap.ui.define([],
    function () {
        "use strict";
        return {
            serverErrors: {
                "Success": 0,
                "NotAutorized": -3,
                "UnKnownError": -99,
                "PreCheckError": -5
            },

            userRoles: {
                "developer": 0,
                "admin": 1
            },

            widgetStatuses: {
                "Approved": 0,
                "ReadyForApproval": 1,
                "Rejected": 2,
                "Draft": 3,
                "Archived": 4
            },
            PL0: {
                Id: "PL1",
                ChildWidgets: [],
                Collection: "0",
                Default: "",
                Hidden: "0",
                Label: "",
                Type: "string",
                Values: []
            }

        }
    });