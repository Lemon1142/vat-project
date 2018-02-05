/**
 * Created by zzz on 2017/10/26.
 */
var rowDat_bill,rowDat_invoice,bill_id='';
var colMap = {
    colNames : ['isShowList','invoiceSort','invoiceIds','invoiceAbleStatus','isCombinedInvoice','billText','','销售单据编号','帐单类型','操作','标签','小票流水号','机构名称','商户名称','应收金额','销售时间','终端设备号','开票时间'],
    colModel : [
        {name:'isShowList',index:'isShowList', width:"0%",hidden:true},
        {name:'invoiceSort',index:'invoiceSort', width:"0%",hidden:true},
        {name:'invoiceIds',index:'invoiceIds', width:"0%",hidden:true},
        {name:'invoiceStatus',index:'invoiceStatus', width:"0%",hidden:true},
        {name:'isCombinedInvoice',index:'isCombinedInvoice', width:"0%",hidden:true},
        {name:'billText',index:'billText', width:"0%",hidden:true},
        {name:'billImage',index:'billImage', width:"0%",hidden:true,sortable:false},
        {name:'billId',index:'billId', width:"14%",align:'left',sortable:false},
        {name:'billType',index:'billType', width:"10%",align:'center',sortable:false,formatter: function(cellvalue, options, rowObject){
            if(cellvalue == undefined || cellvalue == null || cellvalue == ''){
                return ""
            }else{
                if (cellvalue == 1) {
                    return "结账单"
                }
                else if (cellvalue == 2) {
                    return "预结单"
                }
                else if(cellvalue == 3){
                    return "日结单"
                }else if(cellvalue == 7){
                    return "点菜单"
                }else{
                    return "其他"
                }
            }
        }},
        {name: '操作',index:'operation',width: '12%', align: 'left', sortable:false, formatter: function (value,gird,rows,state) {
            var billImage = rows.billImage;
            var invoiceAbleStatus = rows.invoiceStatus; // 是否已开发票
            var isShowList = rows.isShowList; // 是否拆分
            var htmlS = '';
            htmlS += '<span data-method="bill_look" class="operation_icon btn-ev fa fa-file-text" title="查看账单详情"></span>';
            htmlS += (billImage) ? '<span data-method="bill_url" class="operation_icon btn-ev fa fa-file-image-o pointer"  title="账单图片"></span>' : '';
            htmlS += (invoiceAbleStatus == '1') ? '<span data-method="'+(isShowList == 'Y' ? 'list_bill' : 'invoice_bill') +'" class="operation_icon btn-ev fa fa-list-alt" title="查看发票详情"></span>' : "";
            htmlS += '<span data-method="bill_qrcode" class="operation_icon btn-ev fa fa-qrcode" title="查看二维码"></span>';
            return  htmlS;}
        },
        {name: '标签',width: '7%', align: 'left', sortable:false, formatter: function (value,gird,rows,state) {
            var isCombinedInvoice=rows.isCombinedInvoice;
            if(isCombinedInvoice=='N'){
                isCombinedInvoice = '';
            }else if(isCombinedInvoice=='Y'){
                isCombinedInvoice = '合';
            }else if(isCombinedInvoice =='C'){
                isCombinedInvoice = '拆';
            }
            var typeHtml = "";
            typeHtml += '<span class="inv-flagType ' + (rows.invoiceStatus == '1' ? 'inv-flagTypeB' : 'inv-flagTypeA') + '" style="margin:0 4px" title="票">票</span>';
            typeHtml += '<span class="inv-flagType '+ (isCombinedInvoice ? 'inv-flagTypeB' : '' )+'" style="margin:0 4px" title="'+isCombinedInvoice+'">'+isCombinedInvoice+'</span>';
            return  typeHtml;
        }
        },
        {name:'billSerialNumber',index:'billSerialNumber', width:"14%",align:'left',sortable:false},
        {name:'deptName',index:'deptName', width:"10%",align:'left',sortable:false},
        {name:'shopEntityName',index:'shopEntityName', width:"10%",align:'left',sortable:false},
        {name:'receivableAmount',index:'receivableAmount', width:"8%",align:'right',sortable:false,formatter:function(cellvalue, options, rowObject){
            if(cellvalue == undefined || cellvalue == null || cellvalue == ''){
                return "";
            }else{
                return Number(cellvalue).toFixed(2);
            }
        }},
        {name:'saleTime',index:'saleTime', width:"14%",align:'center',sortable:true,formatter: function (value, gird, rows, state) {
            if(value == undefined || value == null || value == ''){
                return '';
            }else{
                return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
            }
        }},
        {name:'terminalNumber',index:'terminalNumber', width:"10%",align:'center',sortable:false},
        {name:'invoicePrintDate',index:'invoicePrintDate', width:"14%",align:'center',sortable:true,formatter: function (value, gird, rows, state) {
            if(value == undefined || value == null || value == ''){
                return '';
            }else{
                return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
            }
        }},
    ],
};

// 初始化
$(document).ready(function(){
    initGrid();//初始化界面
    collapseLink();//修改折叠事件的绑定
    initButton();//初始化按钮
});
// 查询条件初始化
function searchInit(){
    // 开票状态
    $("#bill_stasus").change(function () {
        var bill_val = $(this).children("option:selected").val();
        if (bill_val == "1") {
            $("#bill_style").attr("disabled","disabled");
            $("#bill_style").val("");
            $("#bill_style").find("option[value='']").attr("selected",true);
            $("#bill_equipment").attr("disabled","disabled");
            $(" #bill_equipment").val("");
            $("#bill_saletime").attr("disabled","disabled");
            $("#bill_saletime").val("");
            $('.isInvoice').show();
            //layuiAlert("开票状态为已开票状态时，销售时间列无法进行排序功能");
        } else {
            $("#bill_style").removeAttr("disabled");
            $("#bill_style").val("");
            $("#bill_style").find("option[value='']").attr("selected",true);
            $("#bill_equipment").removeAttr("disabled");
            $("#bill_saletime").removeAttr("disabled");
            $('.isInvoice').hide();
        }
    });
}
/**
 * @Describe 初始化列表展示
 */
function initGrid(){
    window.defaultGridConfig = {
        ajaxGridOptions: {
            //url: window.BASE_API_URL + "billInfo/queryBillInfoPage.do",
            type: "post",
            xhrFields: {
                withCredentials: true
            }
            ,
            crossDomain: true
        }
        ,
        prmNames: {
            "page": "pageIndex",
            "rows": "pageSize",
            "sord": ""
        }
        ,
        postData: {
            //"deptIdStr" : $.trim( $(".search_bill .organId").val() ),// 所属机构
            //"invoiceStatus" : $.trim( $("#bill_stasus option:selected").val() ),//开票状态
            //"billType" : $.trim( $("#bill_style option:selected").val() ), //账单类型
            //"terminalNumber" : $.trim( $("#bill_equipment").val() ), //终端设备
            //"saleTimeStr" : $('#bill_saletime').val(),// 销售时间
        }
        ,
        datatype: "local", //数据来源，本地数据
        mtype: "POST",//提交方式
        autowidth: false,//自动宽,
        width: $(window).width() * 0.98,
        height: $(window).height() * 0.806,
        colNames: colMap["colNames"],
        colModel: colMap["colModel"],
        rownumbers: true,//添加左侧行号
        cellEdit: false,//表格可编辑
        altRows: true,//隔行变色
        altclass: 'GridClass',//隔行变色样式
        caption: "",
        loadui: "disable",
        loadonce: false,//排序
        sortname:"saleTime",
        sortorder: "desc",
        viewrecords: true,//是否在浏览导航栏显示记录总数
        rowNum: 10,//每页显示记录数
        rowList: [10, 20, 30, 50, 100],
        multiselect: true,
        beforeSelectRow: function (rowid, e) {
            var $myGrid = $(this),
                i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),
                cm = $myGrid.jqGrid('getGridParam', 'colModel');
            rowDat_bill = $("#bill_gridtable").jqGrid("getRowData", rowid);
            window.top.isCombinedInvoice = rowDat_bill.isCombinedInvoice;
            window.top.invoiceAbleStatus = rowDat_bill.invoiceStatus;
            bill_id = rowDat_bill.billId;
            //return (cm[i].name === 'cb');
            if (cm[i].index === 'operation') {
                return false;
            } else {
                return true;
            }
        }
        ,
        loadComplete: function (data) {
            if (data.status == "T") {
                window.top.location.href = '../../login.html';
                return;
            }else if(data.status=="F"){
                layer.msg(data.msg);
                return;
            }
            var grid = $("#bill_gridtable");
            var ids = grid.getDataIDs();
            for (var i = 0; i < ids.length; i++) {
                grid.setRowData(ids[i], false, {height: 35});
            }
        }
        ,
        gridComplete: function () {
            load('loading');
        }
        ,
        jsonReader: {
            id: "id",//设置返回参数中，表格ID的名字为blackId
            root: "data.rows",
            page: "data.pageIndex",
            total: function (obj) {
                if(obj!=undefined&&obj!=null){
                    if(obj.status=="F"){
                        layer.msg(obj.msg);
                        return;
                    }else if(obj.status=="T"){
                        window.top.location.href = '../../../login.html';
                    }
                    if (obj.data == null) {
                        return false;
                    }
                    return Math.ceil(obj.data.total / obj.data.pageSize);
                }
            }
            ,
            records: "data.total",
            repeatitems: false
        }
        ,
        pager: '#bill_pager'
    };
    $("#bill_gridtable").jqGrid(defaultGridConfig).trigger('reloadGrid');
    setTimeout(function () {
        updatePagerIcons($("#bill_gridtable"));//加载底部栏图标
    }, 0);
    resizeJqGrid("bill_gridtable");
};

function listGrid(){
    var colMapList = {
        colNames : ['invoiceId','invoiceSort','pdfPath1','发票号码','发票代码','操作','标签','合计金额','合计税额','价税合计','开票日期','销售单据编号'],
        colModel : [
            {name:'invoiceId',index:'invoiceId', width:"0%",hidden:true},
            {name:'invoiceSort',index:'invoiceSort', width:"0%",hidden:true},
            {name:'pdfPath1',index:'pdfPath1', width:"2%",hidden:true},
            {name:'invoiceNo',index:'invoiceNo', width:"4%",align:'center',sortable:false},
            {name:'invoiceCode',index:'invoiceCode', width:"5%",align:'center',sortable:false},
            {name: '操作',index:'operation',width: '3%', align: 'left', sortable:false, formatter: function (value,gird,rows,state) {
                //var invoiceAbleStatus = rows.invoiceStatus; // 是否已开发票
                var invoiceSort = rows.invoiceSort; // 电子发票
                var pdfPath1 = rows.pdfPath1;
                var htmlS = '';
                htmlS += '<span data-method="list_invoice" class="operation_icon btn-ev fa fa-file-text" title="查看发票"></span>';
                htmlS += (invoiceSort=='000002'&&pdfPath1!=undefined&&pdfPath1!=null&&pdfPath1!='') ? '<span data-method="list_url" class="operation_icon btn-ev fa fa-link pointer"  title="连接"></span>' : '';
                return  htmlS;}
            },
            {name: '标签',width: '4%', align: 'center', sortable:false, formatter: function (value,gird,rows,state) {
                var invoiceSort=rows.invoiceSort;
                if(invoiceSort=='000000'){
                    invoiceSort='普';
                }else if(invoiceSort=='000001'){
                    invoiceSort='专';
                }else if(invoiceSort=='000002'){
                    invoiceSort='电';
                }else if(invoiceSort=='000003'){
                    invoiceSort='卷';
                }else if(invoiceSort=='000004'){
                    invoiceSort='机';
                }else{
                    invoiceSort='普';
                }
                var typeHtml = "";
                typeHtml += '<span class="inv-flagType inv-flagTypeB">'+invoiceSort+'</span>';
                typeHtml += '<span class="inv-flagType ' + (rows.invoiceSort =='000004' ? 'listHide': (rows.listFlag == '1' ? 'inv-flagTypeB' : 'inv-flagTypeA')) + '" style="margin-left: 5px">清</span>';
                typeHtml += '<span class="inv-flagType ' + (rows.printFlag == '1' ? 'inv-flagTypeB' : 'inv-flagTypeA') + '" style="margin-left: 5px">印</span>';
                return  typeHtml;
            }
            },
            {name:'preTaxAmount',index:'preTaxAmount', width:"3%",align:'right',sortable:false,formatter:function(cellvalue, options, rowObject){
                if(cellvalue == undefined || cellvalue == null || cellvalue == ''){
                    return "";
                }else{
                    return Number(cellvalue).toFixed(2);
                }
            }},
            {name:'taxAmount',index:'taxAmount', width:"3%",align:'right',sortable:false,formatter:function(cellvalue, options, rowObject){
                if(cellvalue == undefined || cellvalue == null || cellvalue == ''){
                    return "";
                }else{
                    return Number(cellvalue).toFixed(2);
                }
            }},
            {name:'invoiceAmount',index:'invoiceAmount', width:"3%",align:'right',sortable:false,formatter:function(cellvalue, options, rowObject){
                if(cellvalue == undefined || cellvalue == null || cellvalue == ''){
                    return "";
                }else{
                    return Number(cellvalue).toFixed(2);
                }
            }},
            {name:'invoicePrintDate',index:'invoicePrintDate', width:"5%",align:'center',sortable:true},
            {name: 'bill_id',index: 'bill_id', width:"6%",align:'left',sortable:false,formatter:function(cellvalue, options, rowObject){
                 return bill_id;
            }},
        ],
    };
    $('#list_gridtable').jqGrid('clearGridData');
    $("#list_gridtable").jqGrid ({
        ajaxGridOptions: {
            url: window.BASE_API_URL + "billInvoiceInfo/queryInvoiceDetailList.do",
            type: "post",
            xhrFields: {
                withCredentials: true
            }
            ,
            crossDomain: true
        }
        ,
        datatype: "json", //数据来源，本地数据
        mtype: "POST",//提交方式
        postData : {
            "invoiceIds": rowDat_bill.invoiceIds
        },
        autowidth: false,//自动宽,
        //width: $(window).width() -290,
        width: 880,
        height: $(window).height() -400,
        colNames: colMapList["colNames"],
        colModel: colMapList["colModel"],
        rownumbers: true,//添加左侧行号
        cellEdit: false,//表格可编辑
        altRows: true,//隔行变色
        altclass: 'GridClass',//隔行变色样式
        caption: "",
        loadui: "disable",
        loadonce: false,//排序
        //sortname:"saleTime",
        sortorder: "desc",
        viewrecords: true,//是否在浏览导航栏显示记录总数
        rowNum: 10,//每页显示记录数
        //rowList: [10, 20, 30, 50, 100],
        multiselect: false,
        beforeSelectRow: function (rowid, e) {
            var $myGrid = $(this),
                i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),
                cm = $myGrid.jqGrid('getGridParam', 'colModel');
            rowDat_invoice = $("#list_gridtable").jqGrid("getRowData", rowid);
            if (cm[i].index === 'operation') {
                return false;
            } else {
                return true;
            }
        }
        ,
        loadComplete: function (data) {
            if (data.status == "T") {
                window.top.location.href = '../../login.html';
                return;
            }else if(data.status=="F"){
                layuiAlert(data.msg);
                return;
            }
            var grid = $("#bill_gridtable");
            var ids = grid.getDataIDs();
            for (var i = 0; i < ids.length; i++) {
                grid.setRowData(ids[i], false, {height: 35});
            }
        }
        ,
        gridComplete: function () {
            load('loading');
        }
        ,
        jsonReader: {
            id: "id",//设置返回参数中，表格ID的名字为blackId
            root: "data",
            repeatitems: false
        }
        , //pager: '#bill_pager'
    }).setGridParam({postData:{invoiceIds:rowDat_bill.invoiceIds}}).trigger('reloadGrid');
};
//获取查询参数，提交有用数据
function getQueryMap(){
    var rtnMap = {};
    rtnMap["pageIndex"] = 1;
    rtnMap["pageSize"] = 10;
    rtnMap["sord"] = $("#criteria #bill_gridtable").jqGrid('getGridParam','sortorder');
    rtnMap["deptIdStr"] = $.trim( $(".search_bill .organId").val() ); // 所属机构
    rtnMap["invoiceStatus"] = $.trim( $("#criteria #bill_stasus option:selected").val() ); //开票状态
    rtnMap["isCombinedInvoice"] = $.trim( $("#criteria #split_identifier option:selected").val() ); //拆分标识
    rtnMap["billType"] = $.trim( $("#criteria #bill_style option:selected").val() ); //账单类型
    rtnMap["billSerialNumber"] = $.trim( $("#criteria #serialNumbe").val() ); //小票流水号
    rtnMap["terminalNumber"] = $.trim( $("#criteria #bill_equipment").val() ); //终端设备
    rtnMap["saleTimeStr"] = $('#criteria #bill_saletime').val(); // 销售时间
    rtnMap["invoicePrintDateStr"] = $('#criteria #invoiceTime').val(); // 开始时间
    return rtnMap;
}
//初始化按钮
function initButton(){
    layui.use('layer', function(){
        var $ = layui.jquery,
            layer = layui.layer;
        var active = {
            //查询
            bill_query: function(){
                queryAllSalesByPage(layer);
            },
            //查看账单详情
            bill_look: function(){
                querySaleInfo(layer);
            },
            // 拆分发票单
            list_bill : function () {
                queryListInfo(layer);
                listGrid();
                var psSaleWidths=$("#billList").width();
                $("#list_gridtable").jqGrid('setGridWidth', psSaleWidths-18);
            },
            //账单图片
            bill_url: function(){
                openUrl(layer);
            },
            //发票详情
            invoice_bill : function(){
                queryInvoiceInfo(layer);
            },
            bill_qrcode: function () {
                querySyntheticCode();
            },
            //列表链接
            list_url: function(){
                openInvoiceUrl(layer);
            },
            //列表发票详情
            list_invoice : function(){
                invoiceListInfo();
            },
            // 导出
            bill_expData: function () {
                var deptId = $.trim( $(".search_bill .organId").val() ); // 所属机构
                if(deptId == "" || deptId == undefined || deptId == null){
                    layuiAlert("所属机构不能为空！");
                    return false;
                };
                var beforeUrl = window.BASE_API_URL + "billInvoiceInfo/exportBillInvoiceInfoListBefore.do",
                    listUrl = window.BASE_API_URL + 'billInvoiceInfo/exportBillInvoiceInfoList.do';
                getExplorer(getQueryMap(),beforeUrl,listUrl);
            }
        };

        $('.bill-cont').on('click','.btn-ev',function () {
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });
        $('#LAY_demo .layui-btn').on('click', function(){
            var othis = $(this), method = othis.data('method');
            if($(this).hasClass('layui-btn-disabled')){
                return;
            }
            active[method] ? active[method].call(this, othis) : '';
        });
    });
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        lay('.bill_saletime').each(function(){
            if($(this).hasClass('saleFlag')){
                laydate.render({
                    elem: this,
                    type: 'datetime',
                    range: "~",
                    format:"yyyy-MM-dd HH:mm:ss",
                    done: function(value, date){
                        $("#bill_saletime").attr("title",value);
                    }
                });
            }else{
                laydate.render({
                    elem: this,
                    type: 'datetime',
                    range: "~",
                    format:"yyyy-MM-dd HH:mm:ss",
                    done: function(value, date){
                        $('#invoiceTime').attr("title",value);
                    }
                });
            }
        });
    });
};

// 查询
function queryAllSalesByPage(layer){
    var deptIdStr = $.trim( $(".search_bill .organId").val() ); // 所属机构
    if(!deptIdStr){
        layuiAlert('所属机构不能为空！', {btn: ['关闭']});
        return;
    };

    $("#bill_gridtable").setGridParam({
        beforeRequest: function () {
            layer.load(3);
        },
        page: 1,
        url: window.BASE_API_URL + "billInvoiceInfo/queryBillInvoiceInfoPage.do",
        type: "post",
        datatype: "json",
        postData: getQueryMap(),
        gridComplete: function () {
            layer.closeAll("loading");
        },
    }).trigger("reloadGrid");
}

// 查看账单明细
function querySaleInfo(layer){
    var billMessage = parent.layer.open({
        //type: 1,
        type: 2,
        title: "<big>查看帐单详情</big>",
        area: ['800px','610px'],
        shade: [0.3, '#393D49'],
        shadeClose: false,
        maxmin: true,
        resize: false,//是否允许拉伸
        //content: $('#view_details'),//显示一个块里面的内容
        content: "common/common.html",//显示一个块里面的内容
        zIndex: layer.zIndex,
        success: function(layero,index){
            layer.setTop(layero);
        }
    });
    $.ajax({
        url : window.BASE_API_URL + "billInvoiceInfo/queryBillInfoDetail.do",
        data : {billId: rowDat_bill.billId},
        type : 'post',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        //async: false,
        globle:false,
        error: function(){
            layer.msg('数据处理错误', {zIndex: layer.zIndex});
            return false;
        },
        beforeSend: function () {
            parent.layer.load(2,{zIndex: layer.zIndex});
        },
        complete: function() {
            //var salesBill = parent.layer.load(2,{zIndex: layer.zIndex});
            //parent.layer.close(salesBill);
        },
        success: function(data) {
            //parent.layer.load(2,{zIndex: layer.zIndex});
            if(data.status == 'S'){
                var datas = data.data;
                if(datas!=undefined&&datas!=null&&datas!=''){
                    setTimeout(function (){
                        window.top.setBillInfo(datas);
                        var salesBill = parent.layer.load(2,{zIndex: layer.zIndex});
                        parent.layer.close(salesBill);
                    },800)
                }else{
                    var salesBill = parent.layer.load(2,{zIndex: layer.zIndex});
                    parent.layer.close(salesBill);
                }
            }else if (data.status == 'T') {
                window.top.location.href = '../../../login.html';
                return;
            }else{
                var salesBill = parent.layer.load(2,{zIndex: layer.zIndex});
                parent.layer.close(salesBill);
                window.top.layer.alert(data.msg,{zIndex: layer.zIndex});
                return;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('操作失败!', {zIndex: layer.zIndex});
        }
    });
};

// 发票详情
function queryInvoiceInfo(layer){
    if(rowDat_bill.invoiceSort == "000003"){
        var rollInvoiceInfo = parent.layer.open({
            type: 2,
            title: "<big>发票明细</big>",
            area: ['1000px','610px'],
            shade: [0.3, '#393D49'],
            shadeClose: false,
            maxmin: true,
            resize: false,//是否允许拉伸
            content: "common/rollInvoice.html",
            //content: "common/invoiceCommon.html",
            //btn: ['<big>关闭</big>'] ,
            //closeBtn: 2,关闭按钮样式
            //btnAlign: 'l',// 'c' 'r' 按钮排序方式
            zIndex: layer.zIndex, //控制层叠顺序
            success: function(layero,index){//弹层成功回调方法
                layer.setTop(layero); //置顶当前窗口
            }
        });
    }else if(rowDat_bill.invoiceSort == "000004"){
        var vehicleInvoiceInfo = parent.layer.open({
            type: 2,
            title: "<big>发票明细</big>",
            area: ['1000px','610px'],
            shade: [0.3, '#393D49'],
            shadeClose: false,
            maxmin: true,
            resize: false,//是否允许拉伸
            content: "common/vehicleInvoice.html",
            //btn: ['<big>关闭</big>'] ,
            //closeBtn: 2,关闭按钮样式
            //btnAlign: 'l',// 'c' 'r' 按钮排序方式
            zIndex: layer.zIndex, //控制层叠顺序
            success: function(layero,index){//弹层成功回调方法
                layer.setTop(layero); //置顶当前窗口
            }
        });
    }else{
        var invoiceMessage = parent.layer.open({
            type: 2,
            title: "<big>查看发票详情</big>",
            area: ['1000px','610px'],
            shade: [0.3, '#393D49'],
            shadeClose: false,
            maxmin: true,
            resize: false,//是否允许拉伸
            content: "common/invoiceCommon.html",//显示一个块里面的内容
            //btn: ['<big>关闭</big>'] ,
            //closeBtn: 2,关闭按钮样式
            //btnAlign: 'l',// 'c' 'r' 按钮排序方式
            zIndex: layer.zIndex,
            success: function(layero,index){
                layer.setTop(layero);
            }
        });
    }
    $.ajax({
        url : window.BASE_API_URL + "billInvoiceInfo/queryInvoiceDetailList.do",
        data : {invoiceIds: rowDat_bill.invoiceIds},
        type : 'post',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        //async: false,
        globle:false,
        error: function(){
            layer.msg('数据处理错误', {zIndex: layer.zIndex});
            return false;
        },
        beforeSend: function () {
            parent.layer.load(2,{zIndex: layer.zIndex});
        },
        complete: function() {
            //var salesInvoice = parent.layer.load(2,{zIndex: layer.zIndex});
            //parent.layer.close(salesInvoice);
        },
        success: function(data) {
            //parent.layer.load(2,{zIndex: layer.zIndex});
            if(data.status == 'S'){
                var data = data.data;
                if(data!=undefined&&data!=null&&data!=''){
                    var datas = data[0];
                    if(datas!=undefined&&datas!=null&&datas!=''){
                        if(rowDat_bill.invoiceSort != ""){
                            if(datas.invoiceSort == "000004"){
                                setTimeout(function (){
                                    window.top.vehicleInvoiceInfo(datas,'bill');
                                    var salesInvoice = parent.layer.load(2,{zIndex: layer.zIndex});
                                    parent.layer.close(salesInvoice);
                                },800)
                                return false;
                            }else if(datas.invoiceSort == "000003"){
                                setTimeout(function (){
                                    window.top.rollInvoiceInfo(datas,'bill');
                                    var salesInvoice = parent.layer.load(2,{zIndex: layer.zIndex});
                                    parent.layer.close(salesInvoice);
                                },800)
                                return false;
                            }else{
                                setTimeout(function (){
                                    window.top.initSetInvoiceInfo();
                                    window.top.setInvoiceInfo(datas,'bill');
                                    var salesInvoice = parent.layer.load(2,{zIndex: layer.zIndex});
                                    parent.layer.close(salesInvoice);
                                },800);
                            }
                        }else{
                            setTimeout(function (){
                                window.top.initSetInvoiceInfo();
                                window.top.setInvoiceInfo(datas,'bill');
                                var salesInvoice = parent.layer.load(2,{zIndex: layer.zIndex});
                                parent.layer.close(salesInvoice);
                            },800);
                        }

                    }
                }else{
                    var salesInvoice = parent.layer.load(2,{zIndex: layer.zIndex});
                    parent.layer.close(salesInvoice);
                }
            }else if (data.status == 'T') {
                window.top.location.href = '../../../login.html';
                return;
            }else{
                var salesInvoice = parent.layer.load(2,{zIndex: layer.zIndex});
                parent.layer.close(salesInvoice);
                window.top.layer.alert(data.msg,{zIndex: layer.zIndex});
                return;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('操作失败!', {zIndex: layer.zIndex});
        }
    });
};

// 查看图片
function openUrl(layer){
    var ckjsxx = layer.open({
        type: 1,
        title: "<big>账单图片</big>",
        area: ['800px','560px'],
        shade: [0.3, '#393D49'],
        shadeClose: false,
        maxmin: true,
        resize: false,//是否允许拉伸
        content: $('#bill_url'),//显示一个块里面的内容
        //btn: ['<big>关闭</big>'] ,
        success: function(layero,index){//弹层成功回调方法
            layer.setTop(layero); //置顶当前窗口
        }
    });
    var url = rowDat_bill.billImage || "";
    $('#pdfPath1').find("img").attr("src", url);
};

// 拆分列表
function queryListInfo(){
    var listMessage = layer.open({
        type: 1,
        title: "<big>拆分发票列表</big>",
        area: ['900px','600px'],
        shade: [0.3, '#393D49'],
        shadeClose: false,
        maxmin: true,
        resize: false,//是否允许拉伸
        content: $('#billList'),//显示一个块里面的内容
        //btn: ['<big>关闭</big>'] ,
        //closeBtn: 1, //关闭按钮样式
        //btnAlign: 'l',// 'c' 'r' 按钮排序方式
        zIndex: layer.zIndex,
        success: function(layero,index){
            layer.setTop(layero);
        },
        full: function(layero){
            listGrid();
            var psSaleWidths=$("#billList").width();
            $("#list_gridtable").setGridWidth(psSaleWidths-18);
        },
        restore: function (layero) {
            listGrid();
            var psSaleWidths=$("#billList").width();
            $("#list_gridtable").jqGrid('setGridWidth', psSaleWidths-18);
        },
    });
}

// 列表发票详情
function invoiceListInfo(){
    if(rowDat_invoice.invoiceSort == "000003"){
        var rollInvoiceInfo = parent.layer.open({
            type: 2,
            title: "<big>发票明细</big>",
            area: ['1000px','610px'],
            shade: [0.3, '#393D49'],
            shadeClose: false,
            maxmin: true,
            resize: false,//是否允许拉伸
            content: "common/rollInvoice.html",
            //content: "common/invoiceCommon.html",
            //btn: ['<big>关闭</big>'] ,
            //closeBtn: 2,关闭按钮样式
            //btnAlign: 'l',// 'c' 'r' 按钮排序方式
            zIndex: layer.zIndex, //控制层叠顺序
            success: function(layero,index){//弹层成功回调方法
                layer.setTop(layero); //置顶当前窗口
            }
        });
    }else if(rowDat_invoice.invoiceSort == "000004"){
        var vehicleInvoiceInfo = parent.layer.open({
            type: 2,
            title: "<big>发票明细</big>",
            area: ['1000px','610px'],
            shade: [0.3, '#393D49'],
            shadeClose: false,
            maxmin: true,
            resize: false,//是否允许拉伸
            content: "common/vehicleInvoice.html",
            //btn: ['<big>关闭</big>'] ,
            //closeBtn: 2,关闭按钮样式
            //btnAlign: 'l',// 'c' 'r' 按钮排序方式
            zIndex: layer.zIndex, //控制层叠顺序
            success: function(layero,index){//弹层成功回调方法
                layer.setTop(layero); //置顶当前窗口
            }
        });
    }else{
        var ckjsxx = parent.layer.open({
            type: 2,
            title: "<big>发票明细</big>",
            area: ['1000px','610px'],
            shade: [0.3, '#393D49'],
            shadeClose: false,
            maxmin: true,
            resize: false,//是否允许拉伸
            content: "common/invoiceCommon.html",//显示一个块里面的内容
            zIndex: layer.zIndex, //控制层叠顺序
            success: function(layero,index){//弹层成功回调方法
                layer.setTop(layero); //置顶当前窗口
            }
        });
    };
    $.ajax({
        url : window.BASE_API_URL + "billInvoiceInfo/queryInvoiceDetail.do",
        data : {invoiceId: rowDat_invoice.invoiceId},
        type : 'post',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        globle:false,
        error: function(){
            layer.msg('数据处理错误', {zIndex: layer.zIndex});
            return false;
        },
        beforeSend: function () {
            parent.layer.load(2,{zIndex: layer.zIndex});
        },
        complete: function() {
            //var salesInvoiceList = parent.layer.load(2,{zIndex: layer.zIndex});
            //parent.layer.close(salesInvoiceList);
        },
        success: function(data) {
            //parent.layer.load(2,{zIndex: layer.zIndex});
            if(data.status == 'S'){
                var datas = data.data;
                if(datas!=undefined&&datas!=null&&datas!=''){
                    if(datas.invoiceSort == "000004"){
                        setTimeout(function (){
                            window.top.vehicleInvoiceInfo(datas,'bill');
                            var salesInvoiceList = parent.layer.load(2,{zIndex: layer.zIndex});
                            parent.layer.close(salesInvoiceList);
                        },800)
                        return false;
                    }else if(datas.invoiceSort == "000003"){
                        setTimeout(function (){
                            window.top.rollInvoiceInfo(datas,'bill');
                            var salesInvoiceList = parent.layer.load(2,{zIndex: layer.zIndex});
                            parent.layer.close(salesInvoiceList);
                        },800)
                        return false;
                    }else{
                        setTimeout(function (){
                            window.top.initSetInvoiceInfo();
                            window.top.setInvoiceInfo(datas,'bill');
                            var salesInvoiceList = parent.layer.load(2,{zIndex: layer.zIndex});
                            parent.layer.close(salesInvoiceList);
                        },800);
                    }
                }else{
                    var salesInvoiceList = parent.layer.load(2,{zIndex: layer.zIndex});
                    parent.layer.close(salesInvoiceList);
                }
            }else if (data.status == 'T') {
                window.top.location.href = '../../../login.html';
                return;
            }else{
                var salesInvoiceList = parent.layer.load(2,{zIndex: layer.zIndex});
                parent.layer.close(salesInvoiceList);
                window.top.layer.alert(data.msg,{zIndex: layer.zIndex});
                return;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('操作失败!', {zIndex: layer.zIndex});
        }
    });
}
/**
 * 打开URL
 */
function openInvoiceUrl(layer){
    var ckjsxx = layer.open({
        type: 1,
        title: "<big>发票PDF</big>",
        area: ['1000px','610px'],
        shade: [0.3, '#393D49'],
        shadeClose: false,
        maxmin: true,
        resize: false,//是否允许拉伸
        content: $('#fp_url'),//显示一个块里面的内容
        zIndex: layer.zIndex,
        success: function(layero,index){//弹层成功回调方法
            layer.setTop(layero); //置顶当前窗口
        }
    });
    var url=rowDat_invoice.pdfPath1 || "";
    $('#pdfPath').find("img").attr("src", url);

}
// 二维码
function querySyntheticCode(){
    $('#billCode').html("");
    var syntheticCode = layer.open({
        type: 1,
        title: "<big>查看二维码</big>",
        area: ['300px','300px'],
        shade: [0.3, '#393D49'],
        shadeClose: false,
        maxmin: true,
        resize: false,//是否允许拉伸
        content: $('#billCode'),
        //zIndex: layer.zIndex,
        success: function(layero,index){
            layer.setTop(layero);
        }
    });
    $.ajax({
        url : window.BASE_API_URL + "billInvoiceInfo/obtainQrCodeByBillId.do",
        data : {billId: rowDat_bill.billId},
        type : 'post',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        globle:false,
        error: function(){
            layer.msg('数据处理错误', {zIndex: layer.zIndex});
            return false;
        },
        beforeSend: function() {
            //$("#bgFilter").css("display", "block");
            //$("#loadingProgress").css("display", "block");
        },
        success: function(data) {
            if(data.status == 'S'){
                if(data.data){
                    var qrcode = new QRCode(document.getElementById("billCode"), {
                        width: 200,//设置宽高
                        height: 200,
                    });
                    qrcode.makeCode(data.data);
                }else{
                    $("#billCode").html("暂无二维码");
                }
            }else if (data.status == 'T') {
                window.top.location.href = '../../../login.html';
                return;
            }else{
                layer.alert(data.msg,{zIndex: layer.zIndex});
                return;
            }
        },
        complete: function() {
            $("#bgFilter").css("display", "none");
            $("#loadingProgress").css("display", "none");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('操作失败!', {zIndex: layer.zIndex});
        }
    });
};
