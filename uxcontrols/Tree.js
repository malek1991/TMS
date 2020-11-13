sap.ui.define([
    "sap/m/Tree",
    "sap/m/TreeRenderer"
], function (Tree, TreeRenderer) {
    "use strict";
    var oTree = Tree.extend("vistex.control.Tree", {
        metadata: {
            properties: {
                title: {type: "string"},

                showSearchField: {type: "boolean", defaultValue: true},
                searchFieldWidth: {type: "sap.ui.core.CSSSize", defaultValue: "50%"},
                searchFilterKey: {type: "object", defaultValue: []},

                showItemSelectionMenu: {type: 'boolean', defaultValue: true},
                showAllText: {type: 'string', defaultValue: 'Show All'},
                showSelectedText: {type: 'string', defaultValue: 'Show Selected'},

                showItemLevelCount: {type: 'boolean', defaultValue: false}
            }
        },

        init: function () {
            this.pathForSelected = "";
            this.bIsShowSelectedItems = false;
        },

        fireSelectionChange: function (oEvent) {
            if (oEvent['listItem'] && oEvent['listItem'].getParentNode()) {
                oEvent['listItem'].getParentNode().rerender();
            }
            Tree.prototype.fireSelectionChange.apply(this, arguments);
        },

        renderer: function (oRm, oControl) {
            if (oControl.getTitle() || oControl.getShowSearchField()
                || oControl.getShowItemSelectionMenu()) {
                oControl._addDefaultItemsToToolbar();
            }
            TreeRenderer.render.apply(this, arguments);
        },

        _addDefaultItemsToToolbar: function () {
            if (!this.getHeaderToolbar()) {
                var oHeaderToolbar = new sap.m.Toolbar({
                    id: this.getId() + "--SeachFilterBar"
                });
                this.setHeaderToolbar(oHeaderToolbar);
            }
            this.initializePathForSelected();
            this.initializePathForSearchKeyFilter();

            // Add Title
            if (this.getTitle()) {
                this._addTitle();
            }

            // Add SearchField
            if (this.getShowSearchField()) {
                this._addSearchField();
            }

            // Add Item SelectionMenu
            if (this.getShowItemSelectionMenu()) {
                this._addItemSelectionMenu();
            }
        },

        _addTitle: function () {
            if (!sap.ui.getCore().byId(this.getId() + "--title")) {
                var oTitle = new sap.m.Title({
                    id: this.getId() + "--title",
                    text: this.getTitle()
                });

                this.getHeaderToolbar().insertContent(oTitle, 0);
            }
        },

        _addSearchField: function () {
            if (!sap.ui.getCore().byId(this.getId() + "--DefaultSearchField")) {
                this.defaultSearchField = new sap.m.SearchField({
                    id: this.getId() + "--DefaultSearchField",
                    width: this.getSearchFieldWidth(),
                    liveChange: this.onSearch.bind(this)
                });

                // Check if any ToolSpacer is there
                var bFlag = true;
                for (var i = 0; i < this.getHeaderToolbar().getContent().length; i++) {
                    if (this.getHeaderToolbar().getContent()[i] instanceof sap.m.ToolbarSpacer) {
                        bFlag = false;
                        break;
                    }
                }
                if (bFlag) {
                    this.getHeaderToolbar().addContent(new sap.m.ToolbarSpacer());
                }

                this.getHeaderToolbar().addContent(this.defaultSearchField);
            }
        },

        _addItemSelectionMenu: function () {
            if (!sap.ui.getCore().byId(this.getId() + "--ItemSelectionMenu")) {
                var oItemSelectionMenu = new sap.m.Button({
                    id: this.getId() + "--ItemSelectionMenu",
                    icon: "sap-icon://overflow",
                    visible: (this.getMode() === 'MultiSelect' && this.getShowItemSelectionMenu()),
                    press: this.onPressOverflow.bind(this)
                });

                // Check if any ToolSpacer is there
                var bFlag = true;
                for (var i = 0; i < this.getHeaderToolbar().getContent().length; i++) {
                    if (this.getHeaderToolbar().getContent()[i] instanceof sap.m.ToolbarSpacer) {
                        bFlag = false;
                        break;
                    }
                }
                if (bFlag) {
                    this.getHeaderToolbar().addContent(new sap.m.ToolbarSpacer());
                }

                this.getHeaderToolbar().addContent(oItemSelectionMenu);
            }
        },

        onItemSelectedOverflowMenu: function (oEvent) {
            var sSelectedKey = oEvent.getParameter('item').getKey();
            // First remove the value from the Search Bar
            this.defaultSearchField.setValue();
            this.getBinding("items").filter([]);

            if (sSelectedKey === 'Selected') {
                this.bIsShowSelectedItems = true;
                if (this.pathForSelected) {
                    this.getBinding("items").filter(new sap.ui.model.Filter(this.pathForSelected, "EQ", true));
                    this.expandToLevel(1000);   //Expand in case of Show Selected
                }
            } else {
                this.bIsShowSelectedItems = false;
                this.getBinding("items").filter([]);
            }

            // Make other MenuItems disabled
            var aMenuItems = this.overflowMenu.getItems();
            for (var i = 0; i < aMenuItems.length; i++) {
                if (aMenuItems[i].getKey() === sSelectedKey) {
                    aMenuItems[i].setEnabled(false);
                } else {
                    aMenuItems[i].setEnabled(true);
                }
            }
        },

        onPressOverflow: function (oEvent) {
            if (!this.overflowMenu) {
                this.overflowMenu = new sap.m.Menu({
                    items: [new sap.m.MenuItem({
                        key: "All",
                        text: this.getShowAllText(),
                        enabled: false
                    }), new sap.m.MenuItem({
                        key: "Selected",
                        text: this.getShowSelectedText(),
                    })],
                    itemSelected: this.onItemSelectedOverflowMenu.bind(this)
                });
            }
            this.overflowMenu.openBy(oEvent.getSource());
        },

        //On Live change in Search Field
        onSearch: function (oEvent) {
            if (this.getSearchFilterKey().length) {
                var aFilters = [];

                //First Filter on Search Field
                for (var i = 0; i < this.getSearchFilterKey().length; i++) {
                    aFilters.push(new sap.ui.model.Filter(this.getSearchFilterKey()[i], "Contains", oEvent.getSource().getValue()));
                }
                var oSearchFilter = new sap.ui.model.Filter(aFilters, false);

                if (this.pathForSelected) {
                    //Second Filter on Show Selected Checkbox
                    if (this.bIsShowSelectedItems) {
                        var oShowSelectedFilter = new sap.ui.model.Filter(this.pathForSelected, "EQ", true);

                        this.getBinding("items").filter(new sap.ui.model.Filter([oSearchFilter, oShowSelectedFilter], true));
                        this.expandToLevel(1000);   //Expand in case of Show Selected
                    } else {
                        this.getBinding("items").filter(oSearchFilter);
                    }
                } else {
                    this.getBinding("items").filter(oSearchFilter);
                }
            }
        },

        //Get the path for Selected Property
        initializePathForSelected: function () {
            if (!this.pathForSelected &&
                this.getBindingInfo('items').template.getBindingInfo('selected') &&
                this.getBindingInfo('items').template.getBindingInfo('selected').parts &&
                this.getBindingInfo('items').template.getBindingInfo('selected').parts[0]) {
                this.pathForSelected = this.getBindingInfo('items').template.getBindingInfo('selected').parts[0].path;
            }
        },

        //Get the path for Selected Property
        initializePathForSearchKeyFilter: function () {
            if (!this.getSearchFilterKey().length &&
                this.getBindingInfo('items').template.getBindingInfo('title') &&
                this.getBindingInfo('items').template.getBindingInfo('title').parts &&
                this.getBindingInfo('items').template.getBindingInfo('title').parts[0]) {
                this.setSearchFilterKey([this.getBindingInfo('items').template.getBindingInfo('title').parts[0].path]);
            }
        }
    });

    return oTree;
});