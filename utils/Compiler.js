sap.ui.define(["vistex/tms/model/db/WidgetSamplesDb"], function (WidgetSamplesDb) {
    "use strict";

    return {
        setWidgetsAsTechObj: function (aWidgetsAsTechObj) {
            this.widgetsAsTechObj = aWidgetsAsTechObj;
        },

        preparePlaceHolders: function (sTechName) {
            var Metadata = JSON.parse(this.widgetsAsTechObj[sTechName].Metadata);
            var oCode = {};
            for (var i = 0; i < Metadata.length; i++) {
                oCode[Metadata[i].Id] = Metadata[i].Label
            }
            return oCode;
        },

        prepareWidgetInfo: function (sTechName) {
            var oWidget = this.widgetsAsTechObj[sTechName];
            if (!oWidget) {
                console.error("Couldn't find widget for " + sTechName);
            } else {
                var Metadata = JSON.parse(oWidget.Metadata);
                var oCode = [];
                for (var i = 0; i < Metadata.length; i++) {
                    oCode.push({
                        Id: Metadata[i].Id,
                        Label: Metadata[i].Label
                    });
                }
                return oCode;
            }
        },

        prepareSampleCode: function (sTechName) {
            var Metadata = JSON.parse(this.widgetsAsTechObj[sTechName].Metadata);
            var oCode = {
                Type: sTechName
            };
            for (var i = 0; i < Metadata.length; i++) {
                if (Metadata[i].Hidden !== "1") {
                    if (Metadata[i].Category == "widget" && Metadata[i].Collection == "0") {
                        oCode[Metadata[i].Id] = {};
                    } else if (Metadata[i].Category == "widget" && Metadata[i].Collection == "1") {
                        oCode[Metadata[i].Id] = [];
                    } else if (Metadata[i].Category == "multiinarray") {
                        if (Metadata[i].Default) {
                            oCode[Metadata[i].Id] = Metadata[i].Default.split(",");
                        } else {
                            oCode[Metadata[i].Id] = []
                        }

                    } else {
                        var defValue = "";
                        switch (Metadata[i].Type) {
                            case "bool":
                                defValue = (Metadata[i].Default == "true");
                                break;
                            case "number":
                                if (!isNaN(parseInt(Metadata[i].Default))) {
                                    defValue = parseInt(Metadata[i].Default);
                                }
                                break;
                            default:
                                defValue = Metadata[i].Default;
                        }
                        oCode[Metadata[i].Id] = defValue;
                    }
                }
            }
            return JSON.stringify(oCode, null, 4);
        },

        ui5JsonCompiler: function (codeInEditor) {
            var oCode = JSON.parse(codeInEditor);

            oCode = this.parsePlaceholders(oCode);

            return JSON.stringify(oCode);
        },

        mergePlaceholders: function (config, oCode, key) {
            var childPlaceholders = JSON.stringify(config.Placeholder),
                childData = JSON.stringify(oCode[key]);
            config.Placeholder =
                JSON.parse(childPlaceholders.replace('"&' + key + '&"', childData));
        },

        processTemplate: function (oCode, key, getTemplateFromServer) {
            var oPlaceholders, oMetadata, config = {};
            config.Placeholder = oPlaceholders = JSON.parse(this.widgetsAsTechObj[oCode[key]]['PlaceHolder']);
            config.Metadata = oMetadata = JSON.parse(this.widgetsAsTechObj[oCode[key]]['Metadata']);
            config.Properties = [];
            oCode[key] = oPlaceholders['Type'];

            if (getTemplateFromServer) {
                oMetadata.filter(function (item) {
                    return item["Category"] === "id";
                }).map(function (filterItem) {
                    config.Properties.push(
                        {
                            'NAME': filterItem.Id,
                            'VALUE': Math.floor(Math.random() * 10000) + '_' + filterItem.Id
                        }
                    );
                });
                Object.keys(oCode).forEach(function (key) {
                    var oCheckPlcHldrRegExp = new RegExp("PL[0-9]+", 'g');
                    if ((typeof oCode[key] === "string" || typeof oCode[key] === "boolean" || typeof oCode[key] === "number")
                        && oCheckPlcHldrRegExp.test(key)) {
                        config.Properties.push({
                            'NAME': key,
                            'VALUE': (typeof oCode[key] === "boolean" || typeof oCode[key] === "number") ? String(oCode[key]) : oCode[key]
                        });
                    } else if (Array.isArray(oCode[key]) && oCode[key].length) {
                        oCode[key].forEach(function (oControl, index) {
                            oCode[key][index] = this.parsePlaceholders(oControl);
                        }.bind(this));
                        this.mergePlaceholders(config, oCode, key);
                    } else if (oCode[key] != null && typeof oCode[key] === 'object' &&
                        Object.keys(oCode[key]).length) {
                        oCode[key] = this.parsePlaceholders(oCode[key]);
                        this.mergePlaceholders(config, oCode, key);
                    }
                }.bind(this));
                return WidgetSamplesDb.getWidgetTemplateFromServer(config);
            } else {
                return this.getWidgetTemplate(oPlaceholders, oMetadata, oCode);
            }
        },

        parsePlaceholders: function (oCode) {
            Object.keys(oCode).forEach(function (key) {
                if (key === 'Type' && oCode[key].startsWith('WD-')) {
                    var getTemplateFromServer = true;
                    oCode = this.processTemplate(oCode, key, getTemplateFromServer);
                } else if (Array.isArray(oCode[key]) && oCode[key].length) {
                    oCode[key].forEach(function (oControl, index) {
                        oCode[key][index] = this.parsePlaceholders(oControl);
                    }.bind(this));
                } else if (oCode[key] != null && typeof oCode[key] === 'object' && Object.keys(oCode[key]).length) {
                    oCode[key] = this.parsePlaceholders(oCode[key]);
                }
            }.bind(this));
            return oCode;
        },

        getWidgetTemplate: function (oTemplate, oMetadata, oPlValues, sTechName, sContextId) {

            var oCheckPlcHldrRegExp;

            for (var sProp in oTemplate) {
                if (typeof (oTemplate[sProp]) === "object") {
                    if (Array.isArray(oTemplate[sProp])) {
                        oTemplate[sProp].forEach(function (sPropItem) {
                            oCheckPlcHldrRegExp = new RegExp("(&PL[0-9]+&)+", 'g');
                            if (typeof (sPropItem) == "string" && oCheckPlcHldrRegExp.test(sPropItem)) {
                                var sPlaceholderId = (new RegExp("^&(.*)&$")).exec(sPropItem)[1],
                                    oPlsMetadata = oMetadata.find(function (oPlaceholder) {
                                        return oPlaceholder.Id === sPlaceholderId
                                    }.bind(this));

                                if (oPlsMetadata.Category == "widget") {
                                    oTemplate[sProp] = oPlValues[sPlaceholderId];
                                    if (oTemplate[sProp].template) {
                                        oTemplate[sProp].template = this.parsePlaceholders(oTemplate[sProp].template);
                                    } else if (Array.isArray(oTemplate[sProp])) {
                                        var aggr = [];
                                        for (var i = 0; i < oTemplate[sProp].length; i++) {
                                            aggr.push(this.parsePlaceholders(oTemplate[sProp][i]));
                                        }
                                        oTemplate[sProp] = aggr;
                                    }
                                } else if (oPlsMetadata.Category == "multiinarray") {
                                    if (oPlValues && oPlValues[sPlaceholderId]) {
                                        oTemplate[sProp] = oPlValues[sPlaceholderId];
                                    } else if (oPlsMetadata.Default) {
                                        oTemplate[sProp] = oPlsMetadata.Default.split(",");
                                    } else {
                                        oTemplate[sProp] = [];
                                    }
                                }
                            } else {
                                this.getWidgetTemplate(sPropItem, oMetadata, oPlValues, sTechName, sContextId);
                            }
                        }.bind(this));
                    } else {
                        this.getWidgetTemplate(oTemplate[sProp], oMetadata, oPlValues, sTechName, sContextId);
                        if (oTemplate[sProp].template) {
                            oTemplate[sProp].template = this.parsePlaceholders(oTemplate[sProp].template);
                        }
                    }
                } else {
                    if (sProp == "id") {
                        delete oTemplate[sProp];
                        continue;
                    }

                    oCheckPlcHldrRegExp = new RegExp("(&PL[0-9]+&)+", 'g');
                    if (typeof (oTemplate[sProp]) == "string" && oCheckPlcHldrRegExp.test(oTemplate[sProp])) {


                        var oRiginalValue = oTemplate[sProp];
                        var iNumberPlacehoders = oRiginalValue.match(oCheckPlcHldrRegExp).length;

                        for (var i = 0; i < iNumberPlacehoders; i++) {

                            var oGetPlRegExp = new RegExp("&(PL[0-9]+)&"),
                                sPlaceholderId = oGetPlRegExp.exec(oTemplate[sProp])[1],
                                oPlsMetadata = oMetadata.find(function (oPlaceholder) {
                                    return oPlaceholder.Id === sPlaceholderId
                                }.bind(this));
                            // oPlsMetadata = oMetadata[sPlaceholderId];

                            if (oPlsMetadata.Category == "widget") {
                                oTemplate[sProp] = this.parsePlaceholders(oPlValues[sPlaceholderId]);
                                break;
                            }


                            if (oPlValues && oPlValues.hasOwnProperty(sPlaceholderId)) {
                                switch (oPlsMetadata.Type) {
                                    case "bool":
                                        if (iNumberPlacehoders == 1) {
                                            if (oTemplate[sProp].indexOf("{") === -1 && (oPlValues[sPlaceholderId].toString() == "true" || oPlValues[sPlaceholderId].toString() == "false")) {
                                                oTemplate[sProp] = oPlValues[sPlaceholderId] == "true" || oPlValues[sPlaceholderId] == true ? true : false;
                                            } else {
                                                oTemplate[sProp] = oTemplate[sProp].replace("&" + sPlaceholderId + "&", oPlValues[sPlaceholderId]);
                                            }
                                        } else {
                                            oTemplate[sProp] = oTemplate[sProp].replace("&" + sPlaceholderId + "&", oPlValues[sPlaceholderId]);
                                        }
                                        break;
                                    case "number":
                                        if (iNumberPlacehoders == 1 && oTemplate[sProp].indexOf("{") === -1) {
                                            if (!isNaN(parseInt(oPlValues[sPlaceholderId]))) {
                                                oTemplate[sProp] = parseInt(oPlValues[sPlaceholderId]);
                                            } else {
                                                oTemplate[sProp] = parseInt(oPlsMetadata.Default);
                                            }
                                        } else {
                                            oTemplate[sProp] = parseInt(oPlValues[sPlaceholderId]) ? oTemplate[sProp].replace("&" + sPlaceholderId + "&", parseInt(oPlValues[sPlaceholderId])) : oTemplate[sProp].replace("&" + sPlaceholderId + "&", "");
                                        }

                                        break;
                                    default:
                                        oTemplate[sProp] = oTemplate[sProp].replace("&" + sPlaceholderId + "&", oPlValues[sPlaceholderId]);
                                        break;
                                }
                            } else {
                                switch (oPlsMetadata.Type) {
                                    case "string":
                                        if (oPlsMetadata.Category === "dependent") {
                                            delete oTemplate[sProp];
                                            i = iNumberPlacehoders;
                                            break;
                                        }
                                        oTemplate[sProp] = oTemplate[sProp].replace("&" + sPlaceholderId + "&", oPlsMetadata.Default);
                                        break;
                                    case "bool":
                                        oTemplate[sProp] = (oPlsMetadata.Default == "true");
                                        break;
                                    case "number":
                                        if (iNumberPlacehoders == 1) {
                                            if (!isNaN(parseInt(oPlsMetadata.Default))) {
                                                oTemplate[sProp] = parseInt(oPlsMetadata.Default);
                                            } else {
                                                oTemplate[sProp] = parseInt(oPlsMetadata.Default);
                                            }
                                        } else {
                                            oTemplate[sProp] = parseInt(oPlsMetadata.Default) ? oTemplate[sProp].replace("&" + sPlaceholderId + "&", parseInt(oPlsMetadata.Default)) : oTemplate[sProp].replace("&" + sPlaceholderId + "&", "");
                                        }
                                        break;
                                }
                            }
                        }
                    }
                }
            }

            return oTemplate;
        }
    }
});
