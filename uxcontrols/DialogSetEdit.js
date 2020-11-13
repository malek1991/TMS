// This class provides Dialog functionality to Sets and Flexible Group.


sap.ui.define([
    "sap/m/Dialog",
    "sap/m/Select",
    "sap/m/SegmentedButtonItem",
    "sap/m/Button",
    "sap/ui/table/Table",
    "sap/m/Panel",
], function(Dialog,Select,SegmentedButtonItem, Button, UITable,Panel) {
    "use strict";

    var DialogSetEdit = {
        addAddDialog:  new Dialog({contentHeight:"80%", contentWidth:"40%"}),
        categoryList: new Select({width:"100%"}),
        incexcludeList: new Select({width: "calc(40%)", items:[
                new sap.ui.core.Item({text: "Include", key:1}),
                new sap.ui.core.Item({text: "Exclude", key:2}),
                new sap.ui.core.Item({text: "Summary", key:2})

            ]}),
        includeButton: new SegmentedButtonItem({text:"Include ({= ${/includeItems}.length })", key:1}),
        excludeButton: new SegmentedButtonItem({text:"Exclude ({= ${/excludeItems}.length })", key:2}),
        summaryButton: new SegmentedButtonItem({text:"Summary", key:3}),
        beginButton: new Button({text:"OK"}),
        endButton: new Button({text:"Cancel"}),
        resetButton: new sap.m.Link({text:"Reset"}),
        summaryText: new sap.m.TextArea({value:"", rows: 25, cols: 100,growing: true}),

        oTable :  new UITable(
            {
                columns:[
                    new sap.ui.table.Column({label: new sap.m.Label({text:"Name"}), template: new sap.m.Text({text:'{Name}'})}),
                    new sap.ui.table.Column({label: new sap.m.Label({text:"Valid From"}), template: new sap.m.Text({text:'{from}'})}),
                    new sap.ui.table.Column({label: new sap.m.Label({text:"Valid To"}), template: new sap.m.Text({text:'{to}'})})
                ]
            }),
        onEditPress: function(view, model){
            this.addAddDialog.removeAllContent();
            this.addAddDialog.setModel(new sap.ui.model.json.JSONModel(model));
            this.addAddDialog.setTitle("Add to {/set}");
            this.categoryList.bindAggregation("items",{
                path:"/includeItems",
                template: new sap.ui.core.Item({text: "{Category}"})
            });
            this.categoryList.attachChange(this.selectCategory.bind(this));
            this.incexcludeList.attachChange(this.typeChange.bind(this));
            this.beginButton.attachPress(this.onDialogOK.bind(this,view));
            this.endButton.attachPress(this.ondialogClose.bind(this,view));
            this.oTable.bindRows("/includeItems/0/Items");
            this.segmentedGroup = new sap.m.SegmentedButton({width:"100%",items:[this.includeButton,this.excludeButton,this.summaryButton ]});
            this.segmentedGroup.attachSelectionChange(this.segmentChange.bind(this,view));
            this.layoutBox = new sap.m.VBox({items:[
                    new sap.m.Toolbar({style:"Clear", content:[
                            this.categoryList
                        ]}),
                    new sap.m.Toolbar({style:"Clear", content:[
                            new sap.m.Button({icon:"sap-icon://sys-add"}),
                            this.incexcludeList,
                            new sap.m.Input({showValueHelp:false, placeholder:'Add Items', fieldWidth: "calc(60%)"}),
                            new sap.m.Button({icon:"sap-icon://drop-down-list"})
                        ]}),
                    this.oTable
                ]});
            this.SummaryBox = new sap.m.VBox({visible:false, items:[
                    new sap.m.Toolbar({style:"Clear", height: "2rem", content:[
                            new sap.m.ToolbarSpacer(),
                            this.resetButton,
                        ]}),
                        this.summaryText,
                        new sap.m.Text({text:"* Restricted validity"})
                ]});
            this.addAddDialog.addContent(
                new Panel({ showHeader:false,
                    content:[
                        new sap.m.VBox({
                            items:[
                                this.segmentedGroup,
                                this.layoutBox,
                                this.SummaryBox
                            ]})
                    ]
                }));
            this.addAddDialog.setBeginButton(this.beginButton);
            this.addAddDialog.setEndButton(this.endButton);
            this.addAddDialog.open();
        },
        selectCategory: function(oEvent){
            this.oTable.bindRows(oEvent.getParameter('selectedItem').getBindingContext().getPath()+"/Items");
        },
        onDialogOK: function(view){
            view.setModel(new sap.ui.model.json.JSONModel(this.addAddDialog.getModel().getData()),'widgetModel');
            this.addAddDialog.close()
        },
        ondialogClose: function(view){
            this.addAddDialog.close()
        },
        segmentChange: function(oEvent){
            var key = this.segmentedGroup.getSelectedKey();
            if(key != 3){
                var setPath = (key == 1)?"/includeItems":"/excludeItems";
                this.categoryList.bindAggregation("items",{
                    path:setPath,
                    template: new sap.ui.core.Item({text: "{Category}"})
                });
                this.oTable.bindRows(setPath+"/0/Items");
                this.layoutBox.setVisible(true);
                this.SummaryBox.setVisible(false);
            }
            else{
                this.layoutBox.setVisible(false);
                this.SummaryBox.setVisible(true);
            }
            this.incexcludeList.setSelectedKey(key);
        },

        typeChange: function(oEvent){
            var key = oEvent.getParameter('selectedItem').getKey();
            if(key != 3) {
                var setPath = (key == 1) ? "/includeItems" : "/excludeItems";
                this.categoryList.bindAggregation("items", {
                    path: setPath,
                    template: new sap.ui.core.Item({text: "{title}"})
                });
                this.oTable.bindRows(setPath + "/0/Items");
                this.layoutBox.setVisible(true);
                this.SummaryBox.setVisible(false);
            }
            else{
                this.layoutBox.setVisible(false);
                this.SummaryBox.setVisible(true);
            }
            this.segmentedGroup.setSelectedKey(key);
        }
    };

    return DialogSetEdit;
});
