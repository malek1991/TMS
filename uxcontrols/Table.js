sap.ui.define([
    "jquery.sap.global",
    "sap/m/Table",
    "sap/ui/model/Filter",
    'sap/m/GroupHeaderListItem',
    'sap/ui/model/Sorter'
], function (jQuery, Table, Filter, GroupHeaderListItem, Sorter) {
    "use strict";

    /**
     * Creates the Vistex Responsive Table
     *
     * Card Item Vistex Responsive Table
     *
     *
     * @author DRAKSHIT
     * @version 2.0
     *
     * @constructor
     * @public
     * @name vistex.control.Table
     *
     */

    return Table.extend("vistex.m.Table", {
        metadata: {
            properties: {
                groupOn: 'string',
                sortBy: 'string',
                groupDescending: {type: 'boolean', defaultValue: false},
                sortDescending: {type: 'boolean', defaultValue: false},
                variantId: 'string',
                firstLoad: {type: 'boolean', defaultValue: true},
                isAggrApplied: {type: 'boolean'},
                searchable: {type: 'boolean', defaultValue: false},
                enableServerSide: {type: 'boolean', defaultValue: false},
                serverSideTotalRowCount: {type: 'int'},
                serverSidePageSize: {type: 'int'},
                hideHeaderToolbar: {type: 'boolean', defaultValue: false}
            },
            events: {
                deleteRow: {}
            }
        },

        init: function () {
            this.attachUpdateFinished(this._fireBindingChange);
            sap.m.Table.prototype.init.apply(this, arguments);
            sap.ui.core.ResizeHandler.register(this, this.onTableResize.bind(this));
            this.addEventDelegate({
                onBeforeRendering: function () {
                    // if (this.getGroupBy()) {
                    //     this.group(this.getGroupBy(), this.getGroupDescending());
                    // }
                    // if (this.getSortBy()) {
                    //     this.sort(this.getSortBy(), this.getSortDescending());
                    // }

                    // this.prepareMobileButtons();

                    if (this.getBindingInfo('items')) {
                        this.getBindingInfo('items').groupHeaderFactory = function (group) {
                            return new GroupHeaderListItem({
                                title: group.text
                            });
                        };
                        if (this.getGroupOn()) {
                            this.getBinding('items').sort(new Sorter('groupOn', this.getGroupDescending(), function (oContext) {
                                return {
                                    key: oContext.getProperty(this.getGroupOn()),
                                    text: oContext.getProperty(this.getGroupOn())
                                };
                            }.bind(this)));
                        }
                    }

                    if (this.getSortBy()) {
                        this.sort(this.getSortBy(), this.getSortDescending());
                    }
                }
            }, this);
        },

        updateItems: function (sReason) {
            sap.m.Table.prototype.updateItems.apply(this, arguments);
            this.invalidate();
        },

        onTableResize: function (event) {
            if (!!this.getHeaderToolbar()
                && this.getHeaderToolbar().getMetadata().getName() === 'sap.m.OverflowToolbar') {
                this.prepareToolbarButtonsText();
            }
        },

        prepareToolbarButtonsText: function () {
            var oToolbar = this.getHeaderToolbar(),
                oToolbarButtons = oToolbar.getContent(),
                oPopoverButtons = oToolbar._aButtonsToMoveToPopover,
                remainingButtons = this.filterByDifference(oToolbarButtons, oPopoverButtons, 'sId');

            for (var i = 0; i < oPopoverButtons.length; i++) {
                var currentButton = oPopoverButtons[i];
                if (!!currentButton
                    && currentButton instanceof sap.m.Button
                    && currentButton.getText() === '') {
                    var oTooltip = currentButton.getTooltip(),
                        iconName = (oTooltip === '' || !oTooltip) ?
                            sap.ui.core.IconPool.getIconInfo(currentButton.getIcon()).name : oTooltip;
                    currentButton.setText(iconName.charAt(0).toUpperCase() + iconName.slice(1));
                    currentButton.data('textModified', true);
                }
            }

            for (var i = 0; i < remainingButtons.length; i++) {
                if (remainingButtons[i].data().hasOwnProperty('textModified')
                    && !!remainingButtons[i].data()['textModified']
                    && remainingButtons[i] instanceof sap.m.Button) {
                    remainingButtons[i].setText('');
                    remainingButtons[i].data('textModified', false);
                }
            }
        },

        filterByDifference: function (array1, array2, compareField) {
            var onlyInA = this.differenceInFirstArray(array1, array2, compareField);
            var onlyInb = this.differenceInFirstArray(array2, array1, compareField);
            return onlyInA.concat(onlyInb);
        },

        differenceInFirstArray: function (array1, array2, compareField) {
            return array1.filter(function (current) {
                return array2.filter(function (current_b) {
                    return current_b[compareField] === current[compareField];
                }).length == 0;
            });
        },

        renderer: {},

        sort: function (columnId, sortDescending) {
            var sortersList = [new sap.ui.model.Sorter(columnId, sortDescending)];
            if (this.getBinding('items').isGrouped()) {
                sortersList.unshift(this.getBinding('items').aSorters[0]);
            }
            this.getBinding('items').sort(sortersList);
        },

        group: function (columnId, groupDescending) {
            var _this = this;
            var getGroupLabelPath = function (columnId) {
                    var column = _this.getColumns().find(function (column) {
                            return column.getId() === columnId;
                        }),
                        groupLabelPath = column.getCustomData().find(function (data) {
                            return data.getKey() === 'groupLabelPath';
                        });
                    return groupLabelPath ? groupLabelPath.getValue() : '';
                },
                groupValueProcessor = function (oContext) {
                    var key = oContext.getProperty(columnId),
                        labelPath = getGroupLabelPath(columnId) || columnId,
                        text = oContext.getProperty(labelPath);
                    return {
                        key: key,
                        text: text
                    };
                };
            var sorter = new sap.ui.model.Sorter(columnId, groupDescending, groupValueProcessor);
            this.setProperty('groupBy', columnId, true);
            this.getBinding('items').sort(sorter);
        },

        removeGrouping: function () {
            this.setProperty('groupBy', '', true);
            this.getBinding('items').sort([]);
        },

        manageColumnLayout: function (layoutData) {
            var columns = this.getColumns(true);
            columns.forEach(function (column) {
                var isVisible = layoutData.some(function (item) {
                    return column.getId() === item['columnKey'];
                });
                column.setVisible(isVisible);
                column.setOrder(layoutData.map(function (layoutColumn) {
                    return layoutColumn['columnKey'];
                })
                    .indexOf(column.getId()));
            });
            this.invalidate();
        },

        manageFiltering: function (conditions) {
            var _this = this;
            var filters = conditions.map(function (condition) {
                var value1 = condition.value1,
                    value2 = condition.value2;
                var filterProperty = _this._getCustomDataByKey(sap.ui.getCore().byId(condition['keyField']), 'filterProperty');
                if (value1 instanceof Date) {
                    var dateInstance = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: 'dd.MM.yyyy'
                    });
                    value1 = dateInstance.format(value1, true);
                    if (value2) {
                        value2 = dateInstance.format(value2, true);
                    }
                    return new Filter({
                        path: filterProperty[0].getValue(),
                        comparator: _this._dateComparator,
                        value1: value1,
                        value2: value2,
                        operator: condition['operation']
                    });
                }
                return new Filter(filterProperty[0].getValue(), condition['operation'], value1, value2);
            });
            this.getBinding('items').filter(filters);
        },

        _fireBindingChange: function () {
            var rows = this.getBinding('items');
            if (rows) {
                var eventBus = sap.ui.getCore().getEventBus();
                // eventBus.publish(Container_1.Container.get('routerService').getHash(), 'bindingUpdated', {
                // 	count: rows.getLength()
                // });
            }
        },

        _getCustomDataByKey: function (column, key) {
            return column.getCustomData().filter(function (data) {
                return data.getKey() === key;
            });
        },

        _dateComparator: function (a, b) {
            var _a = a.split('.'),
                aDay = _a[0],
                aMonth = _a[1],
                aYear = _a[2];
            var _b = b.split('.'),
                bDay = _b[0],
                bMonth = _b[1],
                bYear = _b[2];
            var aDate = new Date(+aYear, +aMonth - 1, +aDay);
            var bDate = new Date(+bYear, +bMonth - 1, +bDay);
            if (bDate == null) {
                return -1;
            }
            if (aDate == null) {
                return 1;
            }
            if (aDate < bDate) {
                return -1;
            }
            if (aDate > bDate) {
                return 1;
            }
            return 0;
        }
    });
});
