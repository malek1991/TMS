sap.ui.define([
    "jquery.sap.global",
    "sap/ui/table/Table"
], function (jQuery, Table) {
    "use strict";

    /**
     * Creates the Vistex Grid Table
     *
     * Card Vistex Grid Table Custom Control
     *
     *
     * @class Vistex Grid Table
     * @param {object} mProperties
     *
     * @author DRAKSHIT
     * @version 2.0
     *
     * @constructor
     * @public
     * @name vistex.ui.table.Table
     *
     */

    return Table.extend("vistex.ui.table.Table", {

        init: function () {
            sap.ui.table.Table.prototype.init.apply(this, arguments);
            sap.ui.core.ResizeHandler.register(this, this.onTableResize.bind(this));

            this.attachSort(this._onSort);
            this.addEventDelegate({
                'onBeforeRendering': function () {
                    this._updateTableSizes('Resize');
                }
            }, this);
        },

        onTableResize: function () {
            if (!!this.getExtension()[0]
                && this.getExtension()[0].getMetadata().getName() === 'sap.m.OverflowToolbar') {
                this.prepareToolbarButtonsText();
            }
        },

        prepareToolbarButtonsText: function () {
            var oToolbar = this.getExtension()[0],
                oToolbarButtons = oToolbar.getContent(),
                oPopoverButtons = oToolbar._aButtonsToMoveToPopover;

            var remainingButtons = this.filterByDifference(oToolbarButtons, oPopoverButtons, 'sId');

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

        _onSort: function (event) {
            var column = event.getParameter('column'),
                columnId = column.getSortProperty(),
                metadata = column.getTemplate().getBindingInfo('text'),
                isDescending = false;
            event.preventDefault();
            if (event.getParameter('sortOrder') === 'Descending') {
                isDescending = true;
            }
            this._sorter(metadata, isDescending, columnId);
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
        },

        sort: function (columnId, sortDescending) {
            // var view = Container_1.Container.get('viewService').getViewBydId(columnId),
            // 	template = view.getAggregation('template', null),
            // 	metadata = template.getBindingInfo('text');
            // this._sorter(metadata, sortDescending, columnId);
        },

        _sorter: function (bindingInfo, bDescending, sPath) {
            var isDate = function () {
                return bindingInfo &&
                    bindingInfo.type &&
                    bindingInfo.type === 'sap.ui.model.type.Date';
            };
            var sorter;
            if (isDate()) {
                sorter = new sap.ui.model.Sorter(sPath, bDescending, null, this._dateComparator);
            } else {
                sorter = new sap.ui.model.Sorter(sPath, bDescending);
            }
            this.getBinding('rows').sort(sorter);
        },

        group: function (columnId, groupDescending) {
            // var view = Container_1.Container.get('viewService').getViewBydId(columnId),
            // 	template = view.getAggregation('template', null),
            // 	metadata = template.getBindingInfo('text');
            // this.setGroupBy(columnId);
            // this._sorter(metadata, groupDescending, columnId);
        },

        removeGrouping: function () {
            this.setGroupBy(null);
        }
    });
});
