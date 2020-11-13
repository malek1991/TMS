sap.ui.define([
    'sap/ui/core/Control',
    'sap/m/Table',
    'sap/m/Column',
    'sap/m/List',
    'sap/m/ObjectListItem',
    'sap/m/ObjectAttribute',
    'sap/m/ColumnListItem',
    'sap/m/ObjectIdentifier',
    'sap/m/HBox',
    'vistex/tms/uxcontrols/DialogSetEdit',
    'sap/m/Panel'
], function (Control, Table, Column, List,
             ObjectListItem, ObjectAttribute, ColumnListItem,
             ObjectIdentifier, HBox, DialogSetEdit, Panel) {
    'use strict';
    var oControl = Panel.extend('vistex.control.VMSet', {
        metadata: {
            properties: {
                category: 'string',
                setHeaderText: 'string',
                editMode: 'boolean',
                includeCategories: 'Array',
                excludeCategories: 'Array'

            },
            aggregations: {
                _setsContent: [{type: 'sap.ui.core.Control', multiple: true}]
            },
            associations: {},
            events: {}
        },
        includeStr: 'string',
        excludeStr: 'string',
        totalStr: 'string',
        includeArray: [],
        excludeArray: [],
        includeCategories: [],
        excludeCategories: [],
        typeOfCategory: {
            SummarizedCategoryTable: 'SummarizedCategoryTable',
            CategoryTable: 'CategoryTable',
            SummaryText: 'SummaryText'
        },
        delimiter: {
            and: ' and ',
            comma: ' ,',
            exclude: ' (Excluding &str)',
            restrict: '* Restricted validity'
        },
        renderer: {},
        onBeforeRendering: function () {
            if (this.tableData) {
                this.tableData.destroy();
            }
            //  this.oModel = this.getModel('widgetModel').getData();
            this.includeCategories = this.getIncludeCategories();
            this.excludeCategories = this.getExcludeCategories();
            this.editMode = this.getEditMode();
            this.title = this.getSetHeaderText();
            var modelData = {
                editMode : this.editMode,
                includeItems:this.includeCategories,
                excludeItems:this.excludeCategories,
                set:this.title
            }
            this.addStyleClass('sapUiTinyMarginBeginEnd');
            this.setHeaderToolbar(new sap.m.Toolbar({
                style: 'Clear',
                content: [
                    new sap.m.ToolbarSpacer({width: '1rem'}),
                    new sap.m.Title({text: this.title}),
                    new sap.m.ToolbarSpacer(),
                    this.addButton.attachPress(DialogSetEdit.onEditPress.bind(DialogSetEdit, this, modelData)),
                    new sap.m.ToolbarSpacer({width: '2rem'})
                ]
            }));
            if (this.getCategory() === this.typeOfCategory.SummarizedCategoryTable) {   //Summarized Category Table
                this.tableData = new Table({
                    columns: [new Column({}), new Column({})],
                    mode: this.editMode ? "Delete" : "None"
                });
                this._prepareSummarizedCategoryData();
            } else if (this.getCategory() === this.typeOfCategory.CategoryTable) {     //Category Table
                this.tableData = new Table({
                    mode: this.editMode ? "MultiSelect" : "None",
                    columns: [new Column({
                        'mergeDuplicates': true
                    }), new Column({})]
                });

                this._prepareCategoryData();
            } else if (this.getCategory() === this.typeOfCategory.SummaryText) {
                this._prepareSummaryTextData();                 //summary Table
            }
            this.addContent(this.tableData);
        },
        addButton: new sap.m.Button({
            icon: 'sap-icon://add'
        }),

        _prepareObjectListItem: function (currentItem) {

            var innerItems = currentItem.Items;
            var objectListItem = new ObjectListItem({
                title: currentItem.Category
            });
            this.prepareString();//prepare string
            objectListItem.addAttribute(new ObjectAttribute({
                text: this.totalStr
            }));

            if (this.includeStr.indexOf('*') !== -1) {
                var c = new ObjectAttribute({
                    text: this.delimiter.restrict
                }).addStyleClass('restrictHeight');
                objectListItem.addAttribute(c);
            }

            this.tableData.addItem(objectListItem);

        },
        _prepareSummaryTextData: function () {
            this.tableData = new List({});
            var includeCategoriesLength = this.includeCategories.length,
                excludeCategoriesLength = this.excludeCategories.length;
            for (var includeItem = 0; includeItem < includeCategoriesLength; includeItem++) {

                this.getIncludeAndexcludeArrays(this.includeCategories[includeItem], this.excludeCategories);  //callinclude exclude array      this.inc,this.exc  {} segregate
                this._prepareObjectListItem(this.includeCategories[includeItem]);
            }

            for (var excludeItem = 0; excludeItem < excludeCategoriesLength; excludeItem++) {
                if (!this.excludeCategories[excludeItem].Added) {

                    this.getIncludeAndexcludeArrays({}, this.excludeCategories[excludeItem]);  //callinclude exclude array      this.inc,this.exc  {} segregate
                    this._prepareObjectListItem(this.excludeCategories[excludeItem]);
                }
            }
        },

        getIncludeAndexcludeArrays: function (categoryData, excludeCategories) {
            this.excludeArray = [];
            this.includeArray = [];
            if (!categoryData.Category) {    // indicated ,sending only excludes  ,categoryData will be empty Object{}
                var innerItems = excludeCategories.Items;
                for (var innerItem = 0; innerItem < innerItems.length; innerItem++) {
                    this.excludeArray.push(innerItems[innerItem].Name);
                }
            } else {                      //both includes and excludes

                var innerItems = categoryData.Items;
                for (var innerItem = 0; innerItem < innerItems.length; innerItem++) {
                    this.includeArray.push(innerItems[innerItem].Name);
                }

                var foundIndex = this.excludeCategories.findIndex(function (first, index, list) {
                    return (first.Category === categoryData.Category)
                });
                if (foundIndex != -1) {   //element exitst in exclude and add it to exclude array
                    var foundCategory = this.excludeCategories[foundIndex];
                    var categoryItemslength = foundCategory.Items.length;
                    this.excludeCategories[foundIndex].Added = true;
                    for (var categoryItem = 0; categoryItem < categoryItemslength; categoryItem++) {
                        this.excludeArray.push(foundCategory.Items[categoryItem].Name);

                    }
                }

            }


        },


        _prepareCategoryData: function () {
            var excludeCategoriesLength = this.excludeCategories.length,
                includeCategoriesLength = this.includeCategories.length;
            for (var includeItem = 0; includeItem < includeCategoriesLength; includeItem++) {
                var currentCategory = this.includeCategories[includeItem],
                    innerItems = this.includeCategories[includeItem].Items,
                    innerItemsLength = innerItems.length;
                for (var innerItem = 0; innerItem < innerItemsLength; innerItem++) {
                    var columnListItem = new ColumnListItem({});  // since we need to add every time
                    columnListItem.addCell(new ObjectIdentifier({
                        text: this.includeCategories[includeItem].Category
                    }));      //first cell
                    columnListItem.addCell(new HBox({
                        'items': [
                            new ObjectIdentifier({
                                text: innerItems[innerItem].Name
                            }).addStyleClass('displayInitial')
                        ]
                    }));              //second cell
                    this.tableData.addItem(columnListItem);
                }
                var foundIndex = this.excludeCategories.findIndex(function (first, index, list) {
                    return first.Category === currentCategory.Category
                });

                if (foundIndex != -1) {    //element exists in exclude also, add it to column list
                    var foundCategory = this.excludeCategories[foundIndex];
                    foundCategory.Added = true;    // noo need to add agin when in exclude
                    var categoryItemsLength = foundCategory.Items.length;
                    for (var categoryItem = 0; categoryItem < categoryItemsLength; categoryItem++) {
                        var columnListItem = new ColumnListItem({});  // since we need to add every time
                        columnListItem.addCell(new ObjectIdentifier({
                            text: foundCategory.Category
                        }));      //first cell
                        columnListItem.addCell(new HBox({
                            'items': [
                                new sap.ui.core.Icon({
                                    src: 'sap-icon://sys-minus',
                                    'width': '2rem',
                                    color: 'red'
                                }),
                                new ObjectIdentifier({
                                    text: foundCategory.Items[categoryItem].Name
                                }).addStyleClass('displayInitial')
                            ]
                        }));
                        this.tableData.addItem(columnListItem);

                    }


                }


            }


            for (var excludeItem = 0; excludeItem < excludeCategoriesLength; excludeItem++) {
                if (!this.excludeCategories[excludeItem].Added) {
                    var innerItems = this.excludeCategories[excludeItem].Items,
                        innerItemsLength = innerItems.length;
                    for (var innerItem = 0; innerItem < innerItemsLength; innerItem++) {
                        var columnListItem = new ColumnListItem({});  // since we need to add every time
                        columnListItem.addCell(new ObjectIdentifier({
                            text: this.excludeCategories[excludeItem].Category
                        }));      //first cell
                        columnListItem.addCell(new HBox({
                            'items': [new sap.ui.core.Icon({
                                src: 'sap-icon://sys-minus',
                                'width': '2rem',
                                color: 'red'
                            }),
                                new ObjectIdentifier({
                                    text: innerItems[innerItem].Name
                                }).addStyleClass('displayInitial')
                            ]
                        }));              //second cell
                        this.tableData.addItem(columnListItem);
                    }
                }
            }
        },
        getItemsText: function (includeOrexcludeArrayay) {
            var temptxt;
            temptxt = includeOrexcludeArrayay.join(', ');
            if (includeOrexcludeArrayay.length > 1)
                temptxt = temptxt.slice(0, temptxt.lastIndexOf(',')) + this.delimiter.and + temptxt.substring(temptxt.lastIndexOf(',') + 1);
            return temptxt;
        },
        prepareString: function () {
            this.includeStr = '';
            this.excludeStr = '';
            this.totalStr = '';
            this.includeStr = this.getItemsText(this.includeArray);    // second cell
            this.excludeStr = this.getItemsText(this.excludeArray);   // second cell
            if (this.excludeStr) {
                this.totalStr = this.includeStr + this.delimiter.exclude.replace('&str', this.excludeStr);
            } else {
                this.totalStr = this.includeStr;
            }
        },

        _prepareColumnListItems: function (IncludeExcludeItems) {
            var columnListItem = new ColumnListItem({});
            columnListItem.addCell(new ObjectIdentifier({
                text: IncludeExcludeItems.Category              // First Cell
            }));
            this.prepareString();                               //prepare string
            columnListItem.addCell(new ObjectIdentifier({
                text: this.totalStr                             // Second Cell
            }));
            this.tableData.addItem(columnListItem);
        },
        _prepareSummarizedCategoryData: function () {
            var includeCategoriesLength = this.includeCategories.length,
                excludeCategoriesLength = this.excludeCategories.length;
            for (var includeItem = 0; includeItem < includeCategoriesLength; includeItem++) {
                this.getIncludeAndexcludeArrays(this.includeCategories[includeItem], this.excludeCategories);
                this._prepareColumnListItems(this.includeCategories[includeItem]);
            }
            for (var excludeItem = 0; excludeItem < excludeCategoriesLength; excludeItem++) {
                if (!this.excludeCategories[excludeItem].Added) {
                    this.getIncludeAndexcludeArrays({}, this.excludeCategories[excludeItem]);
                    this._prepareColumnListItems(this.excludeCategories[excludeItem]);
                }
            }
        }
    });

    return oControl;
});
