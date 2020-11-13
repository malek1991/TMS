sap.ui.define([
    "sap/ui/core/Control",
    "./thirdparty/gridstack.all"
], function (Control) {
    "use strict";
    return Control.extend("vistex.control.ovp.OvpResizableLayout", {
        metadata: {
            properties: {
                currentColumn: {type: "string", defaultValue: '', visibility: 'hidden'},
            },
            aggregations: {
                cards: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    singularName: "card"
                }
            },
            events: {
                onResize: {
                    parameters: {
                        value: {type: "object"}
                    }
                }
            }
        },

        _getConfig: function () {
            var width = document.body.clientWidth,
                name = "", columns, width, config, ranges;
            switch (true) {
                case (width < 656):
                    name = 'c1';
                    columns = 1;
                    width = [0, 655];
                    config = '';
                    ranges = 'Less than 656 px';
                    break;
                case (width > 656 && width < 976):
                    name = 'c2';
                    columns = 5;
                    width = [656, 975];
                    config = '';
                    ranges = '656 – 975 px';
                    break;
                case (width > 975 && width < 1360):
                    name = 'c3';
                    columns = 6;
                    width = [975, 1360];
                    config = '';
                    ranges = '976 – 1359 px';
                    break;
                case (width > 1359 && width < 1680):
                    name = 'c4';
                    columns = 10;
                    width = [1359, 1680];
                    config = '';
                    ranges = '1360 – 1679 px';
                    break;
                case (width > 1679 && width < 2000):
                    name = 'c5';
                    columns = 12;
                    width = [1679, 2000];
                    config = '';
                    ranges = '1679 – 2000 px';
                    break;
                case (width > 1999):
                    name = 'c6';
                    columns = 12;
                    width = [0, 1999];
                    config = '';
                    ranges = 'More than 1999 px';
                    break;
            }
            return {
                'name': name,
                'columns': columns,
                'width': width,
                'config': config,
                'ranges': ranges
            };
        },

        resizeGrid: function (grid) {
            var width = document.body.clientWidth,
                currentScreenSize = this._getConfig(),
                name = currentScreenSize.name,
                column = currentScreenSize.columns;

            if (!!column) {
                grid.column(column);
            }

            this.setProperty('currentColumn', column, false);
            this._applyStateConfig(column);
            grid.compact();

            this.fireEvent("onResize", {
                value: {
                    "columnName": name,
                    "width": width,
                    "column": column,
                    "screenSize": currentScreenSize,
                    "range": currentScreenSize.ranges
                }
            });
        },

        _applyStateConfig: function (column) {
            if (!this.getCards()[0]) return;
            var data = this.getCards()[0].getProperty("cardConfiguration");
            if (data && data["c" + column]) {
                var nodes = this.grid.engine.nodes;
                nodes.forEach(function (item, i) {
                    var sId = $(this.grid.engine.nodes[i].el).children().children().attr('id'),
                        oCard = sap.ui.getCore().byId(sId);
                    var oData = oCard.getProperty("cardConfiguration")["c" + column];
                    this.grid.update(nodes[i].el, oData.x, oData.y, oData.width, oData.height);
                });
            }
        },

        updateGridConfig: function () {
            var nodes = this.grid.engine.nodes;
            nodes.forEach(function (item, i) {
                var sId = $(this.grid.engine.nodes[i].el).children().children().attr('id'),
                    oCard = sap.ui.getCore().byId(sId),
                    node = this.grid.engine.nodes[i],
                    column = this.getProperty('currentColumn'),
                    oConfig = oCard.getProperty("cardConfiguration");
                oConfig["c" + column] = {
                    height: node.height,
                    width: node.width,
                    x: node.x,
                    y: node.y
                };
                oCard.setProperty("cardConfiguration", oConfig);
            });
        },

        loadManualData: function (data) {
            var nodes = this.grid.engine.nodes;
            data.forEach(function (item, i) {
                this.grid.update(nodes[i].el, item.x, item.y, item.width, item.height);
            });
            this.grid.batchUpdate();
            this.grid.commit();
        },

        generateSavedManualData: function () {
            var serializedData = [];
            this.grid.engine.nodes.forEach(function (node) {
                serializedData.push({
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height,
                    id: node.id,
                    custom: 'save anything here'
                });
            });
            return serializedData;
        },

        generateSavedData: function () {
            return this.grid.save();
        },

        commitGrid: function () {
            var grid = GridStack.init({
                alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                ),
                resizable: {handles: 'e, se, s, sw, w', autoHide: true},
                disableOneColumnMode: true, // will manually do 1 column
                float: false,
                cellHeight: 200,
                oneColumnModeDomSort: true,
                animate: true,
            });
            this.grid = grid;
            this.resizeGrid(grid)
            window.addEventListener('resize', function () {
                this.resizeGrid(grid)
            }.bind(this));
        },

        onAfterRendering: function () {
            this.commitGrid();
        },
        renderer: function (oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("grid-stack grid-stack-N");
            oRm.writeClasses();
            oRm.write(">");
            var oCards = oControl.getCards();
            if (!!oCards) {
                oCards.forEach(function (card) {

                    var firstChild = card.getContent();

                    if (Array.isArray(firstChild) && firstChild[0] || firstChild instanceof sap.m.ScrollContainer) {
                        firstChild.addStyleClass('ovpScroll');
                    }

                    oRm.write('<div class="grid-stack-item"');
                    oRm.writeAttribute("data-gs-min-width", "2");
                    oRm.writeAttribute("data-gs-min-height", "1");
                    oRm.writeAttribute("data-gs-no-move", "no");
                    oRm.writeAttribute("data-gs-width", card.getProperty('cardWidth'));
                    oRm.writeAttribute("data-gs-height", card.getProperty('cardHeight'));
                    oRm.write(">");
                    oRm.write('<div class="grid-stack-item-content">');
                    oRm.renderControl(card);
                    oRm.close("div");
                    oRm.close("div");

                }.bind(this));
            }
            oRm.write("</div>");
        }
    });
});
