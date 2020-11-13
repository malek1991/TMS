sap.ui.define([
    "sap/m/UploadCollection"
], function (Control) {
    "use strict";

    return Control.extend("vistex.m.UploadCollection", {
        metadata: {
            properties: {
                menuItems: {type: 'object', defaultValue: []},
                endpoints: 'object',
                sortItems: 'string',
                groupItems: 'string',
                uploadKey: 'string'
            },
            aggregations: {
                leftToolbarItems: {type: 'sap.ui.core.Control', multiple: true, defaultValue: []},
                rightToolbarItems: {type: 'sap.ui.core.Control', multiple: true, defaultValue: []}
            },
            events: {
                uploadedFile: {},
                uploadWithDialog: {}
            }
        },

        init: function () {
            sap.m.UploadCollection.prototype.init.apply(this, arguments);
            this.attachUploadComplete(this.onUploadComplete);
            this.attachTypeMissmatch(this.onTypeMissmatch);
            this.attachChange(this.onBeforeUpload.bind(this));
        },

        getEndpointsObject: function () {
            return this.getEndpoints();
        },

        onTypeMissmatch: function (event) {
            var fileName = event.getParameters().getParameter('fileName');
            var message = 'Selected file (${fileName}) has invalid type. Please select file with proper type.';
            // DialogMessage.show(
            //     {type: ConfirmationType.Error, message},
            //     () => this.close()
            // );
        },

        onBeforeUpload: function (oEvent) {
            var files = oEvent.getParameter('files');
            // if (files && files.length) {
            //     CommunicationService.postFiles < ICore > (this.getUploadUrl(), files)
            //         .then(this.onUploadComplete.bind(this));
            // }
        },

        onUploadComplete: function (response) {
            // ActionsResponseService.handleResponse({}, response);
            this.fireEvent('uploadedFile', {
                contextInfo: {
                    key: this.getUploadKey()
                }
            });
            this.fireEvent('uploadWithDialog', {
                contextInfo: {
                    key: this.getUploadKey()
                }
            });
            this.bindItems(this.getBindingInfo('items'));
        },

        onBrowse: function (selectedMenuItem) {

            this.fireEvent('uploadWithDialog', {
                contextInfo: {
                    key: selectedMenuItem['key']
                }
            });
        },
        /*if (selectedMenuItem['mimeType']) {
            this.setMimeType(selectedMenuItem['mimeType']);
            this._oFileUploader.setMimeType(selectedMenuItem['mimeType']);
        }
        this.setUploadKey(selectedMenuItem['key']);
        if (selectedMenuItem['forURL'] === true) {
            this._forURLUpload(selectedMenuItem['mimeType']);
        } else {
            this.openFileDialog();
        }*/

        _forURLUpload: function (aMimeType) {
            var oModel = new sap.ui.model.json.JSONModel({}, false);
            oModel.setData(aMimeType);
            if (!this.pressDialog) {
                this.pressDialog = new sap.m.Dialog({
                    title: 'Attach document URL',
                    contentWidth: '35rem',
                    content:
                        new sap.ui.layout.form.Form({
                            layout: new sap.ui.layout.form.ResponsiveGridLayout({
                                labelSpanXL: 12,
                                labelSpanM: 12,
                                labelSpanL: 12,
                                labelSpanS: 12,
                                adjustLabelSpan: false,
                                singleContainerFullSize: false
                            }),
                            formContainers: new sap.ui.layout.form.FormContainer({
                                formElements: [
                                    new sap.ui.layout.form.FormElement({
                                        label: 'Mime Type',
                                        fields: new sap.m.Select({
                                            items: {
                                                path: '/',
                                                templateShareable: false,
                                                template: new sap.ui.core.ListItem({
                                                    key: '{}',
                                                    text: '{}'
                                                })
                                            }
                                        })
                                    }),
                                    new sap.ui.layout.form.FormElement({
                                        label: 'File Name',
                                        fields: new sap.m.Input({})
                                    }),
                                    new sap.ui.layout.form.FormElement({
                                        label: 'URL',
                                        fields: new sap.m.Input({})
                                    })
                                ]
                            })
                        }),
                    beginButton: new sap.m.Button({
                        text: 'OK',
                        press: function (oEvent) {
                            this._attachURLDocument();
                        }.bind(this)
                    }),
                    endButton:
                        new sap.m.Button({
                            text: 'Close',
                            press: function () {
                                this.pressDialog.close();
                            }.bind(this)
                        })
                });
            }
            this.pressDialog.setModel(oModel);
            this.pressDialog.open();
        },

        _attachURLDocument: function () {
            var oFormContainers = this.pressDialog.getContent()[0].getFormContainers()[0];
            this.fireEvent('uploadedFile', {
                contextInfo: {
                    key: this.getUploadKey(),
                    mimeType: oFormContainers.getFormElements()[0].getFields()[0].getSelectedKey(),
                    url: oFormContainers.getFormElements()[1].getFields()[0].getValue(),
                    fileName: oFormContainers.getFormElements()[2].getFields()[0].getValue()
                }
            });
            if (this.pressDialog) {
                this.pressDialog.close();
            }
        },

        exit: function () {
            if (this.pressDialog) {
                this.pressDialog.destroy();
            }
        },

        onBeforeRendering: function () {
            var menuItems = this.getProperty('menuItems');
            if (menuItems.length) {
                // const apiUrl = `${window['gtms-ushell-config'].apiUrl}/api`,
                //     endpoints = this.getEndpointsObject(),
                //     url = `${apiUrl}${CommunicationConfig.serviceEndPoint.objectService}/${endpoints.uploadAction}`;
                //
                // this.setUploadUrl(url);
                this.setToolbar(new sap.m.OverflowToolbar({
                    content: this.getLeftToolbarItems().concat([
                        new sap.m.ToolbarSpacer(),
                        this.getRightToolbarItems(),
                        this.createUploadButton(menuItems),
                        new sap.m.UploadCollectionToolbarPlaceholder()
                    ])
                }));
            }
            sap.m.UploadCollection.prototype.onBeforeRendering.apply(this, arguments);
            this._oFileUploader.addStyleClass('hidden');
        },

        _mapItemToListItem: function (item) {
            var oListItem = sap.m.UploadCollection.prototype._mapItemToListItem.apply(this, arguments);

            if (item instanceof vistex.m.UploadCollectionItem) {
                oListItem.setHighlight(item.getHighlight());
            }

            return oListItem;
        },

        onAfterRendering: function () {
            this._oFileUploader.addStyleClass('hidden');
            sap.m.UploadCollection.prototype.onAfterRendering.apply(this, arguments);
        },

        createUploadButton: function (menuItems) {
            var itemlength = menuItems.length,
                uploadButton,
                text, mimeType, key, forURL;

            if (itemlength > 1) {
                var menuList = menuItems.map(function (item) {
                    var text = item.text,
                        mimeType = item.mimeType,
                        key = item.key,
                        forURL = item.forURL;

                    return new sap.m.MenuItem({
                        text: item.text,
                        icon: 'sap-icon://upload'
                        // press: this.onBrowse.bind(this, {text, mimeType, key, forURL})
                    });
                });

                uploadButton = new sap.m.MenuButton({
                    icon: 'sap-icon://add',
                    enabled: this.getUploadEnabled(),
                    visible: !this.getUploadButtonInvisible(),
                    menu: new sap.m.Menu({
                        items: menuList
                    })
                });
            } else {
                var item = menuItems[0];
                if (item) {
                    text = item.text;
                    mimeType = item.mimeType;
                    key = item.key;
                    forURL = item.forURL;
                }
                uploadButton = new sap.m.Button({
                    icon: 'sap-icon://add',
                    enabled: this.getUploadEnabled(),
                    visible: !this.getUploadButtonInvisible()
                    // press: this.onBrowse.bind(this, {text, mimeType, key, forURL})
                });
            }

            return uploadButton;
        },

        sortSingle: function (columnId, sDecending) {
            var sorter = new sap.ui.model.Sorter(
                columnId,
                sDecending
            );
            this.getBinding('items').sort(sorter);
        },

        group: function (columnId, gDecending) {
            // var groupItems = this.getBindingObjects('groupItems');
            // var groupValueProcessor = function(oContext) {
            //     var key = oContext.getProperty(columnId),
            //         text = groupItems.find((groupItem) => groupItem['key'] === columnId).text;
            //     return {key, text};
            // };
            // var sorter = new sap.ui.model.Sorter(
            //     columnId,
            //     gDecending,
            //     groupValueProcessor
            // );
            // this.getBinding('items').sort([sorter]);
        },

        getBindingObjects: function (propertyName) {
            var bindings = UploadCollection.parseBindingPath(this.getProperty(propertyName));
            return this.getModel(bindings.model).getProperty(bindings.path);
        },

        _handleEdit: function (event, oItem) {
            oItem['fireEditPress']();
        },

        // tslint:disable-next-line:max-line-length
        _getButtons: function (item, status, itemId) {
            var aButtons = sap.m.UploadCollection.prototype['_getButtons']['apply'](this, arguments);
            // tslint:disable-next-line:max-line-length
            if (item.getVisibleEdit()) {
                // tslint:disable-next-line:max-line-length
                var oEditButton = item['_getEditButton'] ? item['_getEditButton']() : item['_getControl']('sap.m.Button', {
                    // tslint:disable-next-line:prefer-template
                    id: itemId + '-editButton',
                    icon: 'sap-icon://edit',
                    type: sap.m.ButtonType.Default,
                    tooltip: this.getModel('i18n').getResourceBundle().getText('AddAttributes'),
                    press: [item, this._handleEdit, this]
                }, 'EditButton').addStyleClass('sapMUCEditBtn');
                oEditButton.setEnabled(item.getEnableEdit());
                oEditButton.setVisible(item.getVisibleEdit());
                aButtons.push(oEditButton);
            }
            return aButtons;
        },

        renderer: {}
    });
});