sap.ui.define([
    "sap/ui/core/Control"

], function (Control) {
    "use strict";

    /**
     * Creates the VChart
     *
     *
     * @class theGrid Custom Control
     * @param {object} mProperties
     *
     * @author DRAKSHIT
     * @version 1.0
     *
     * @constructor
     * @public
     * @name vistex.control.theGrid
     *
     */

    return Control.extend("vistex.control.theGrid", {
        metadata: {
            properties: {
                adapterData: {
                    type: 'object',
                    defaultValue: {}
                }
            }
        },

        onDataChange: function () {
            // let adapterData = this.getBinding('adapterData');
            // if (adapterData) {
            //     adapterData.attachChange(this.renderTheGrid.bind(this));
            //     this.renderTheGrid();
            // } else {
            //     this.attachEventOnce('modelContextChange', this.onDataChange);
            // }
        },

        removeGrouping: function () {
            this.getApi().options.group.set([]);
            this.groupedColumns = [];
        },

        getGroupedColumns: function () {
            return this.groupedColumns;
        },

        getColumns: function () {
            return this.getAdapterData().columns;
        },

        getRowsData: function () {
            return this.getAdapterData().rows;
        },

        manageColumnLayout: function () {
            // let api = this.getApi(),
            //     columns = api.elements.column.getAll();
            // columns.forEach((column: object) => {
            //     let visibility = layoutData.some((item: object) => column['id'] === item['columnKey']);
            //     visibility ?
            //         api.elements.column.show(column['id']) :
            //         api.elements.column.hide(column['id']);
            // });

            // for (let i = 1; i < layoutData.length; i++) {
            //     let column = layoutData[i];
            //     if (column) {
            //         let columnBefore = layoutData[i - 1];
            //         api.elements.column.move(column['columnKey'], 'after', columnBefore['columnKey']);
            //     }
            // }
        },

        manageFiltering: function () {
            // let filters = conditions.map((condition: object) => ({
            //     columnId: condition['keyField'],
            //     value: condition['value1'],
            //     operator: GtmsGridFilters[condition['operation']]
            // }));
            // this.getApi().options.filter.set({filters: filters, operator: 'AND'});
        },

        // sortMultiple: function (conditions: Array<ISortAndGroupConditionData>): void {
        //     conditions.forEach((condition: ISortAndGroupConditionData) => {
        //         this.getApi().options.sort.set(
        //             condition.keyField,
        //             condition.operation === sap.m.P13nConditionOperation.Descending ? 'desc' : 'asc'
        //         );
        //     });
        // },

        getApi: function () {
            return this.grid.grid.api;
        },

        getWrapper: function() {
            return this.wrapper;
        },

        renderer: function (ioRm, ioControl) {
            var loHTML = new sap.ui.core.HTML();
            ioRm.write("<div ");
            ioRm.addStyle("width", "100%");
            ioRm.writeStyles();
            ioRm.writeControlData(ioControl);
            ioRm.write('>');
            ioRm.renderControl(loHTML);

            if (!ioControl.wrapper) {
                ioControl.wrapper = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
            }
            if (ioControl.getAdapterData()) {
            //     var loDataSource = new vcharts.RowDataSource(ioControl.getAdapterData().meta, ioControl.getAdapterData().data);
            //     var loChart = new vcharts.Chart(ioControl.getAdapterData().config, loDataSource, ioControl.wrapper);
            //     this.grid = new GTMS.Grid(ioControl.wrapper);
            // //     this.getWrapper().setDOMContent(this.grid.get());
            //     loHTML.setDOMContent(ioControl.wrapper.htmlElement);
            }
            ioRm.write("</div>");
        }
    });
});