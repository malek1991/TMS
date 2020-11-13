sap.ui.define([
        "vistex/tms/utils/Constants",
    ],
    function (Constants) {
        "use strict";
        return {

            getRoleTextById: function (sRoleId, aRoles) {
                var sRoleText = "";
                if (Array.isArray(aRoles)) {
                    for (var i = 0; i < aRoles.length; i++) {
                        if (aRoles[i].key == sRoleId) {
                            return aRoles[i].value;
                        }
                    }
                }
                return sRoleText;
            },

            toTree: function (arr) {
                var tree = [],
                    mappedArr = {},
                    arrElem,
                    mappedElem;
                // First map the nodes of the array to an object -> create a hash table.
                for (var i = 0, len = arr.length; i < len; i++) {
                    arrElem = arr[i];
                    mappedArr[arrElem.Id] = arrElem;
                    //mappedArr[arrElem.Id]['nodes'] = [];
                }
                for (var Id in mappedArr) {
                    if (mappedArr.hasOwnProperty(Id)) {
                        mappedElem = mappedArr[Id];
                        // If the element is not at the root level, add it to its parent array of children.
                        if (mappedElem.ParentId) {
                            if (!mappedArr[mappedElem['ParentId']]['nodes']) {
                                mappedArr[mappedElem['ParentId']].nodes = [];
                            }
                            mappedArr[mappedElem['ParentId']]['nodes'].push(mappedElem);
                        }
                        // If the element is at the root level, add it to first level elements array.
                        else {
                            tree.push(mappedElem);
                        }
                    }
                }
                return tree;
            },
            formWidgets: function (pGroups, pWidgets) {
                var dataM;
                var oGroups  =  $.extend(true, [], pGroups);
                var oWidgets =  $.extend(true, {}, pWidgets);
                if (oWidgets.Data.length > 0) {
                    for (var i = 0; i < oGroups.Data.length; i++) {
                        for (var j = 0; j < oWidgets.Data.length; j++) {
                            if (!oGroups.Data[i].nodes)
                                oGroups.Data[i].nodes = [];
                            if (oWidgets.Data[j].GroupId == oGroups.Data[i].Id) {
                                oWidgets.Data[j].Title = oWidgets.Data[j].Name;
                                oGroups.Data[i].nodes.push(oWidgets.Data[j])
                            }
                        }
                    }
                    dataM = this.toTree(oGroups.Data);
                } else {
                    dataM = [];
                }
                return dataM;
            },

            stringifyCode: function (oData) {
                if (oData && oData.length != 0)
                    return JSON.stringify(JSON.parse(oData), null, 2);
            },

            getStatusFromStatusCode: function (sStatusCode) {
                for (var key in Constants.widgetStatuses) {
                    if (Constants.widgetStatuses[key] === sStatusCode) {
                        return key;
                    }
                }
            },
            getStatus: function (oStatus) {
                var oChangedStatus;
                if (oStatus == 0 || oStatus) {
                    $.each(Constants.widgetStatuses, function(key,value){
                        if(value == oStatus)
                            oChangedStatus = key;
                    })
                } else {
                    oChangedStatus = oStatus;
                }
                return oChangedStatus;
            },
            getState: function (oStatus) {
                var oState;
                if (oStatus == 0 || oStatus) {
                    switch (oStatus) {
                        case Constants.widgetStatuses.Approved:
                            oState = 'Success';
                            break;
                        case Constants.widgetStatuses.ReadyForApproval:
                            oState = 'None';
                            break;
                        case Constants.widgetStatuses.Rejected:
                            oState = 'Error';
                            break;
                        case Constants.widgetStatuses.Draft:
                            oState = 'Warning';
                            break;
                        case Constants.widgetStatuses.Archived:
                            oState = 'None';
                            break;
                    }
                } else {
                    oState = oStatus;
                }
                return oState;
            },
            getIcon: function (oStatus) {
                var oIcon;
                if (oStatus == 0 || oStatus) {
                    oStatus = oStatus.toString();
                    switch (oStatus) {
                        case '0':
                            oIcon = 'sap-icon://approvals';
                            break;
                        case '1':
                            oIcon = 'sap-icon://hr-approval';
                            break;
                        case '2':
                            oIcon = 'sap-icon://employee-rejections';
                            break;
                        case '3':
                            oIcon = 'sap-icon://save';
                            break;
                        case '4':
                            oIcon = 'sap-icon://delete';
                            break;
                    }
                } else {
                    oIcon = oStatus;
                }
                return oIcon;
            }
        };
    });
