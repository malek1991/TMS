sap.ui.define([
        'vistex/tms/utils/Constants',
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/routing/History",
        "sap/m/Button",
        "sap/m/ButtonType",
        "sap/m/Dialog",
    ],

    function (Constants, JSONModel, History, Button, ButtonType, Dialog) {
        "use strict";
        return {

            // onInit: function () {
            //     BaseController.prototype.onInit.apply(this, arguments);
            //     this.setModel(new JSONModel(), "mainModel");
            //     // this.getRouter().getRoute("autoGenerate").attachPatternMatched(this._onRouteMatched, this);
            //
            //     var bus = this.getOwnerComponent().getEventBus();
            //     bus.subscribe("autoGenerateChannel", "onGenerateValidJson", this._setTreeWidgetData, this);
            //
            //     // this.setMainModel();
            //     // this.setModel(new JSONModel({}), "propertyModel");
            //     // this.setModel(new JSONModel({}), "metadataModel");
            //
            //     // var oRouter, oTarget;
            //     // oRouter = this.getRouter();
            //     // oTarget = oRouter.getTarget("autoGenerate");
            //     // oTarget.attachDisplay(function (oEvent) {
            //     //     this._setTreeWidgetData(oEvent.getParameter("data")['codeInEditor']);
            //     // }, this);
            //
            // },
            //
            // _onRouteMatched: function (oEvent) {
            // },

            _setTreeWidgetData: function (data, view) {
                this.View = view;
                var object = [];
                var placeHolder = [];
                this.View.setModel(new JSONModel(), "mainModel");
                this.View.setModel(new JSONModel({}), "propertyModel");
                this.View.setModel(new JSONModel({}), "metadataModel");
                this.oCode = JSON.parse(data);
                this.widgetsAsTechObj = this.View.getModel("globalModel").getProperty('/currentPackage/Widgets/asTechObject');
                this._parsePlaceholders(this.oCode, object, placeHolder);
                this.View.getModel("mainModel").setProperty('/Widgets', object);
                this.placeHolders = placeHolder;
            },

            _parsePlaceholders: function (oCode, treeData, placeHolder) {
                var oPlaceholders, oEvents, oMetadata, oName;
                Object.keys(oCode).forEach(function (key) {
                    var obj = {};
                    var objP = {};
                    if (key === 'Type') {
                        if (oCode[key].startsWith('WD-')) {
                            oPlaceholders = JSON.parse(this.widgetsAsTechObj[oCode[key]]['PlaceHolder']);
                            oMetadata = JSON.parse(this.widgetsAsTechObj[oCode[key]]['Metadata']);
                            oEvents = JSON.parse(this.widgetsAsTechObj[oCode[key]]['Events']);
                            oName = this.widgetsAsTechObj[oCode[key]]['Name'];
                            obj['Metadata'] = oMetadata;
                            obj['PlaceHolder'] = oPlaceholders;
                            obj['Events'] = oEvents;
                            obj['Name'] = oName;
                            treeData.push(obj);
                            //**
                            objP = jQuery.extend(true, {}, oPlaceholders);
                            objP['Metadata'] = this._setHiddenTypeProperty(obj['Metadata']);
                            objP['Events'] = obj['Events'];
                            placeHolder.push(objP);
                            //**
                        } else {
                            obj['Name'] = oCode[key];
                            obj['Metadata'] = this._buildMetadataForNonWidget(oCode);
                            obj['Events'] = this._buildEventsForNonWidget(oCode[key]);
                            obj['PlaceHolder'] = oCode;
                            obj['isNotWidget'] = true;
                            treeData.push(obj);
                            objP = jQuery.extend(true, {}, oCode);
                            objP['Metadata'] = obj['Metadata'];
                            objP['Events'] = obj['Events'];
                            placeHolder.push(objP);
                        }
                    } else if (Array.isArray(oCode[key])) {
                        var sKey = key;
                        if (sKey.startsWith('PL')) {
                            sKey = this._findKey(placeHolder[placeHolder.length - 1], key);
                        }
                        if (oCode[key].length > 0) {
                            placeHolder[placeHolder.length - 1][sKey] = [];
                            treeData[treeData.length - 1]['nodes'] = [];
                            oCode[key].forEach(function (oControl) {
                                this._parsePlaceholders(oControl, treeData[treeData.length - 1]['nodes'], placeHolder[placeHolder.length - 1][sKey]);
                            }.bind(this));
                        } else {
                            placeHolder[placeHolder.length - 1][sKey] = [];
                        }
                    }
                }.bind(this));
            },

            _setHiddenTypeProperty: function (oMetadata) {
                if (oMetadata.length > 0) {
                    oMetadata.forEach(function (object) {
                        if (object['Collection'] === '0') {
                            object['Collection'] = false;
                        } else if (object['Collection'] === '1') {
                            object['Collection'] = true;
                        }

                        if (object['Hidden'] === '0') {
                            object['Hidden'] = false;
                        } else if (object['Hidden'] === '1') {
                            object['Hidden'] = false;
                        }
                    });
                }
                return oMetadata;
            },

            _buildMetadataForNonWidget: function (oCode) {
                var array = [];
                Object.keys(oCode).forEach(function (key) {
                    if (key !== "Type") {
                        array.push({Label: key});
                    }
                });
                return array;
            },

            /**
             * Checking the list of the standard Events for the UI5 Object
             * @param oCode
             * @returns {[]}
             * @private
             */
            _buildEventsForNonWidget: function (oCode) {
                var array = [];
                if (oCode.startsWith('sap.')) {
                    var object = eval("new " + oCode + "()");
                    var events = object.getMetadata().getEvents();
                    var aEvents = Object.keys(events);
                    if (aEvents && aEvents.length > 0) {
                        aEvents.forEach(function (key) {
                            if (events[key]['visibility'] === "public" && !events[key]['deprecated']) {
                                array.push({
                                    Label: events[key]['name'],
                                    Name: events[key]['name']
                                })
                            }
                        });
                    }
                }
                return array;
            },


            /**
             *
             * Methods for the 'Generate Dialog' to prepare the new :
             * * Metadata
             * * Placeholders
             * * Events
             *  for the composite widget
             *
             */
            _prepareDialogData: function () {
                this.flatData = [];
                var treeData = this.View.getModel("mainModel").getProperty('/Widgets');
                this._transformTreeDataToFlatData(treeData, this.flatData);
                this._buildNewPlaceholders();
            },

            _transformTreeDataToFlatData: function (treeData, result) {
                treeData.forEach(function (key) {
                    result.push(key);
                    if (key['nodes']) {
                        this._transformTreeDataToFlatData(key['nodes'], result);
                    }
                }.bind(this));
            },

            _getSelectedMetadata: function (flatData) {
                var aMetadata = [];
                flatData.forEach(function (key) {
                    if (key['Metadata']) {
                        key['Metadata'].forEach(function (key) {
                            if (key['selectedFlag'] && key['Label'] !== 'Id') {
                                aMetadata.push(key);
                            }
                        })
                    }
                });
                return aMetadata;
            },


            /**
             *
             * Calling the function: _keepSelectedPlaceholders
             * binding the return to the main model
             * @private
             */
            _buildNewPlaceholders: function () {
                // var object = [];
                // this._parseCompositePlaceholders(this.oCode, object);
                this.iCounter = 2;
                this.iCounterII = 1;
                this.flagID = true;
                this.finalMetadata = [];
                var finalPlaceholders = jQuery.extend(true, {}, this.placeHolders);
                this.finalEvents = [];
                this.treeWidgets = [];
                var object = jQuery.extend(true, {}, this.View.getModel("mainModel").getProperty('/Widgets'));

                // this._transformTreeDataToFlatData(this.getModel("mainModel").getProperty('/Widgets'), this.treeWidgets);
                this._keepSelectedPlaceholders(finalPlaceholders[0]);
                this.View.getModel("dialogModel").setProperty('/metadata', JSON.stringify(this.finalMetadata));
                this.View.getModel("dialogModel").setProperty('/placeholders', JSON.stringify(finalPlaceholders[0]));
                this.View.getModel("dialogModel").setProperty('/events', JSON.stringify(this.finalEvents));
            },

            /**
             * This function is responsible of creating the final array of metadata and events with the
             * corresponding new Ids
             * And creating new placeholder object for the composite control
             * @param oCode
             * @private
             */
            _keepSelectedPlaceholders: function (oCode) {

                var currentPl, currentMetadata, newMetadata, newEvent;

                if (oCode['Metadata']) {
                    this.oMetadata = oCode['Metadata'];
                    this.Events = oCode['Events'];
                    delete oCode['Metadata'];
                    delete oCode['Events'];
                }

                if (!oCode['id']) oCode['id'] = '&PL1&';

                var eventsFlag = true;
                var t = Object.keys(oCode);
                if (t.indexOf('id') > 0) {
                    t.splice(t.indexOf('id'), 1);
                    t.unshift('id');
                }
                t.forEach(function (key) {
                    if (Array.isArray(oCode[key]) && oCode[key].length > 0) {
                        if (this._checkSelectedAggregationFromNonWidget(oCode, key)) {
                            oCode[key].forEach(function (oObject) {
                                this.flagID = false;
                                this._keepSelectedPlaceholders(oObject);
                            }.bind(this));
                        }
                    } else {
                        switch (typeof oCode[key]) {
                            case "string":
                                if (key !== 'Type' && key !== 'id') {
                                    if (oCode[key].charAt(0) === '&') {
                                        currentPl = oCode[key].substring(1, oCode[key].length - 1);
                                        currentMetadata = this.oMetadata.find(function (element) {
                                            if (element['Id'] === currentPl) {
                                                return element;
                                            }
                                        });
                                    } else if (oCode[key].charAt(0) === '{') {
                                        currentMetadata = this.oMetadata.find(function (element) {
                                                if (element['Label'] === key) {
                                                    return element;
                                                }
                                            }
                                        );
                                        if (!currentMetadata) {
                                            this._checkPlaceholdersFormExpressionProperty(oCode, key, this.oMetadata);
                                            return;
                                        }
                                    } else { //Properties of a UI5 control `not a widget`
                                        currentMetadata = this.oMetadata.find(function (element) {
                                            if (element['Label'] === key) {
                                                return element;
                                            }
                                        });
                                    }
                                    if (currentMetadata && currentMetadata['selectedFlag']) {
                                        oCode[key] = '&PL' + this.iCounter + '&';
                                        newMetadata = jQuery.extend(true, {}, currentMetadata);
                                        newMetadata['Id'] = 'PL' + this.iCounter;
                                        delete newMetadata['selectedFlag'];
                                        delete newMetadata['required'];
                                        this.finalMetadata.push(this._metadataFormatter(newMetadata));
                                        this.iCounter++;
                                    } else {
                                        delete oCode[key];
                                    }
                                } else if (key === 'id') { // Handling the IDs
                                    currentPl = oCode[key].substring(1, oCode[key].length - 1);
                                    currentMetadata = jQuery.extend(true, {}, Constants.PL0);
                                    currentMetadata['Category'] = "id";
                                    currentMetadata = this._setHiddenTypeProperty(currentMetadata);
                                    var eventIsSelected = false;
                                    if (this.Events) {
                                        this.Events.forEach(function (event) {
                                            if (event['selectedFlag']) {
                                                eventIsSelected = true;
                                            }
                                        });
                                    }
                                    newMetadata = jQuery.extend(true, {}, currentMetadata);
                                    if (this.flagID) {
                                        oCode[key] = '&PL1&';
                                        newMetadata['Id'] = 'PL1';
                                        this.finalMetadata.push(newMetadata);
                                    } else if (eventIsSelected) {
                                        newMetadata['Id'] = 'PL1.c' + this.iCounterII;
                                        oCode[key] = '&PL1.c' + this.iCounterII + '&';
                                        this.finalMetadata.push(newMetadata);
                                        this.iCounterII++;
                                    } else {
                                        delete oCode[key];
                                    }
                                    // Handling The Events
                                    if (this.Events && eventsFlag && this.Events.length > 0) {
                                        this.Events.forEach(function (event) {
                                            if (event['selectedFlag']) {
                                                newEvent = jQuery.extend(true, {}, event);
                                                if (this.flagID) {
                                                    newEvent['Id'] = 'PL1';
                                                } else {
                                                    var int = this.iCounterII - 1;
                                                    newEvent['Id'] = '&PL1.c' + int + '&';
                                                }
                                                delete newEvent['selectedFlag'];
                                                this.finalEvents.push(newEvent);
                                            }
                                        }.bind(this));
                                        eventsFlag = false;
                                    }
                                }
                                break;
                            case "object":
                                this.flagID = false;
                                this._keepSelectedPlaceholders(oCode[key]);
                                break
                        }
                    }
                }.bind(this));
            },

            /**
             * Format the metadata in case not all the properties are selected
             */
            _metadataFormatter: function (newMetadata) {
                var PLZero = jQuery.extend(true, {}, Constants.PL0);
                var object = $.extend({}, PLZero, newMetadata);
                if (object['Collection'] === true || object['Collection'] === '1') {
                    object['Collection'] = "1";
                } else {
                    object['Collection'] = "0";
                }
                if (object['Hidden'] === true || object['Hidden'] === true === '1') {
                    object['Hidden'] = "1";
                } else {
                    object['Hidden'] = "0";
                }
                return object;
            },

            /**
             * This function check the Use case a Sap control has been added&
             * the aggregation was selected as an exposed placeholder for the composite widget
             * Ignore the content and replace it by a new placeholder
             * @param oCode
             * @param key
             * @returns {boolean}
             * @private
             */
            _checkSelectedAggregationFromNonWidget: function (oCode, key) {
                var currentMetadata, newMetadata, result = true;
                currentMetadata = this.oMetadata.find(function (element) {
                    if (element['Label'] === key) {
                        return element;
                    }
                })
                ;
                if (currentMetadata && currentMetadata['selectedFlag']) {
                    oCode[key] = '&PL' + this.iCounter + '&';
                    newMetadata = jQuery.extend(true, {}, currentMetadata);
                    newMetadata['Id'] = 'PL' + this.iCounter;
                    delete newMetadata['selectedFlag'];
                    delete newMetadata['required'];
                    this.finalMetadata.push(this._metadataFormatter(newMetadata));
                    this.iCounter++;
                    result = false
                }
                return result;
            },

            /**
             * Check such placeholders:
             * e.g: "value": "{ path:'&PL5&', type:'sap.ui.model.type.Float',formatOptions: { decimals: '&PL6&'}  }",
             * e.g: "maxSuggestionWidth": "{= '&PL24&' === 'Default' ? 'auto' : '&PL24&' ==='Medium' ? '25rem': '&PL24&' === 'Large' ? '30rem' : 'auto'}",
             * @param oCode
             * @param sKey
             * @param array
             * @private
             */
            _checkPlaceholdersFormExpressionProperty: function (oCode, sKey, array) {
                // var string = oCode[key];
                var oGetPlRegExp = new RegExp("&(PL[0-9]+)&", 'g'),
                    aPlaceholderId = oCode[sKey].match(oGetPlRegExp),
                    currentPl,
                    newObject,
                    currentObject;
                if (aPlaceholderId && aPlaceholderId.every(function (val, i, arr) {
                    if (val === arr[0]) {
                        return val;
                    }
                })) {
                    currentPl = aPlaceholderId[0].substring(1, aPlaceholderId[0].length - 1);
                    currentObject = array.find(function (element) {
                        if (element['Id'] === currentPl) {
                            return element;
                        }
                    });
                    if (currentObject && currentObject['selectedFlag']) {
                        oCode[sKey] = oCode[sKey].replace(new RegExp("&(PL[0-9]+)&", "gm"), '&PL' + this.iCounter + '&');
                        newObject = jQuery.extend(true, {}, currentObject);
                        newObject['Id'] = 'PL' + this.iCounter;
                        delete newObject['selectedFlag'];
                        delete newObject['required'];
                        this.finalMetadata.push(newObject);
                        this.iCounter++;
                    } else {
                        delete oCode[sKey];
                    }
                } else {
                    var flag = false;
                    if (aPlaceholderId) {
                        aPlaceholderId.forEach(function (key) {
                            currentPl = key.substring(1, key.length - 1);
                            currentObject = array.find(function (element) {
                                if (element['Id'] === currentPl) {
                                    return element;
                                }

                            });
                            if (currentObject && currentObject['selectedFlag']) {
                                oCode[sKey] = oCode[sKey].replace(key, '&PL' + this.iCounter + '&');
                                newObject = jQuery.extend(true, {}, currentObject);
                                newObject['Id'] = 'PL' + this.iCounter;
                                delete newObject['selectedFlag'];
                                delete newObject['required'];
                                this.finalMetadata.push(newObject);
                                this.iCounter++;
                                flag = true;
                            } else {
                                oCode[sKey] = oCode[sKey].replace(key, currentObject['Default']);
                            }
                        }.bind(this));
                    }
                    if (!flag) {
                        delete oCode[sKey];
                    }
                }
            },

            /**
             * returns the key property from an object that the value includes sKey
             * @param object
             * @param sKey
             * @private
             */
            _findKey: function (object, sKey) {
                var result = '';
                Object.keys(object).forEach(function (key) {
                    if (object[key].toString().includes(sKey)) {
                        result = key;
                    }
                });
                return result;
            },


            /**
             *
             * Handlers of UI5 Events
             *
             */

            onTreeItemSelectionChange: function (oEvent) {
                var oObject = oEvent.getParameter("listItem").getBindingContext("mainModel").getObject();
                this.View.getModel("mainModel").setProperty('/propertyModel', oObject['Metadata']);
                this.View.getModel("mainModel").setProperty('/eventModel', oObject['Events']);
                this.View.getModel("mainModel").refresh();
            },

            onSelectProperty: function (oEvent) {
                var oForm = this.View.byId("metadataForm");
                var sPath = oEvent.getParameter("listItem").getBindingContext("mainModel").getPath();
                this._formatterSwitch(sPath);
                this.View.getModel("mainModel").setProperty(sPath + "/selectedFlag", oEvent.getParameters()['selected']);
                oForm.bindElement({path: sPath, model: "mainModel"});
                this._checkMandatoryMetadata(sPath);

            },

            onSelectEvent: function (oEvent) {
                var oForm = this.View.byId("eventsForm");
                var sPath = oEvent.getParameter("listItem").getBindingContext("mainModel").getPath();
                this.View.getModel("mainModel").setProperty(sPath + "/selectedFlag", oEvent.getParameters()['selected']);
                oForm.bindElement({path: sPath, model: "mainModel"});
            },

            /**
             * In case of non widgets is selected, set the Metadata as mandatory
             * @param sPath
             */
            _checkMandatoryMetadata: function (sPath) {
                var sPathTree = this.View.byId('idGroupsTree').getSelectedItem().getBindingContext("mainModel").getPath();
                var object = this.View.getModel("mainModel").getProperty(sPathTree);
                if (object['isNotWidget']) {
                    this.View.getModel("mainModel").setProperty(sPath + "/required", true);
                } else {
                    this.View.getModel("mainModel").setProperty(sPath + "/required", false);
                }
            },

            onNavButtonPress: function (oEvent) {
                var sPreviousHash = History.getInstance().getPreviousHash();
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getRouter().navTo("home", {}, true);
                    window.location.reload();
                }
            },

            onGeneratePress: function (oEvent) {
                if (!this.pressDialog) {
                    this.View.setModel(new JSONModel(), "dialogModel");
                    this.pressDialog = new Dialog({
                        title: 'Composite Widget Details',
                        content: sap.ui.xmlfragment("vistex.tms.view.detail.ux.fragments.AutoGenerateDialog", this),
                        contentWidth: "90%",
                        contentHeight: "90%",
                        endButton: new Button({
                            type: ButtonType.Emphasized,
                            text: 'Close',
                            press: function () {
                                this.pressDialog.close();
                            }.bind(this)
                        })
                    });

                    //to get access to the global model
                    this.View.addDependent(this.pressDialog);
                }
                this._checkMandatory();
            },

            _checkMandatory: function () {
                var categoryComboBox = this.View.byId('categoryComboBox');
                var typeComboBox = this.View.byId('typeComboBox');

                if (categoryComboBox.getRequired() === true && categoryComboBox.getValue() === '') {
                    categoryComboBox.setValueState(sap.ui.core.ValueState.Error);
                } else {
                    categoryComboBox.setValueState(sap.ui.core.ValueState.None);
                    if (typeComboBox.getRequired() === true && typeComboBox.getValue() === '') {
                        typeComboBox.setValueState(sap.ui.core.ValueState.Error);
                    } else {
                        typeComboBox.setValueState(sap.ui.core.ValueState.None);

                        this._prepareDialogData();
                        this.pressDialog.open();
                    }
                }
            },

            onExpandAll: function () {
                this.View.byId("idGroupsTree").expandToLevel(2);
            },

            onCollapseAll: function () {
                this.View.byId("idGroupsTree").collapseAll();
            },

            onWidgetsSearch: function (oEvent) {
                var lsSearchText = oEvent.getSource().getValue();
                if (lsSearchText) {
                    this.View.byId('idGroupsTree').getBinding('items').filter(new sap.ui.model.Filter('Name', 'Contains', lsSearchText));
                    this.View.byId('idGroupsTree').expandToLevel(2);
                } else {
                    this.View.byId('idGroupsTree').getBinding('items').filter([]);
                    this.View.byId('idGroupsTree').collapseAll();
                }

            },

            _formatterSwitch: function (sPath) {
                var object = this.View.getModel("mainModel").getObject(sPath);

                if (object['Collection'] === '0') {
                    this.View.getModel("mainModel").setProperty(sPath + "/Collection", false);
                } else if (object['Collection'] === '1') {
                    this.View.getModel("mainModel").setProperty(sPath + "/Collection", false);
                }

                if (object['Hidden'] === '0') {
                    this.View.getModel("mainModel").setProperty(sPath + "/Hidden", false);
                } else if (object['Hidden'] === '1') {
                    this.View.getModel("mainModel").setProperty(sPath + "/Hidden", false);
                }
            }
        }

    });

