sap.ui.define([
    "sap/m/List",
    'sap/m/GroupHeaderListItem'
], function (List, GroupHeaderListItem ) {
    "use strict";

    var oList = List.extend("vistex.control.LogList", {

        bindAggregation:function(sName, oBindingInfo){
            if(sName === "items"){
                oBindingInfo.groupHeaderFactory = this.getGroupHeader;
                oBindingInfo.sorter = new sap.ui.model.Sorter({
                    "path": "Group",
                    "descending": true,
                    "group": true,
                    "comparator": function () {
                        return 0;
                    }
                });
            }
            List.prototype.bindAggregation.apply(this, arguments);
        },

        getGroupHeader: function(oGroup){
            var sHeader = oGroup.key.split("_")[1];

            return new GroupHeaderListItem( {
                title: sHeader || "",
                upperCase: false
            } );
        },

        renderer: {}
    });

    return oList;
});
