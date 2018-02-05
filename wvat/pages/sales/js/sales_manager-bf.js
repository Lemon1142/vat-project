/**
 * Created by zzz on 2017/10/26.
 */
var rowDat_bill;
var colMap ={
    colNames : ['invoiceId','invoiceAbleStatus','isCombinedInvoice','billText','','销售单据编号','帐单类型','操作','标签','小票流水号','机构名称','商户名称','应收金额','销售时间','终端设备号','开票时间'],
    colModel : [
        {name:'invoiceId',index:'invoiceId', width:"0%",hidden:true},
        {name:'invoiceAbleStatus',index:'invoiceAbleStatus', width:"0%",hidden:true},
        {name:'isCombinedInvoice',index:'isCombinedInvoice', width:"0%",hidden:true},
        {name:'billText',index:'billText', width:"0%",hidden:true},
        {name:'billImage',index:'billImage', width:"0%",hidden:true,sortable:false},
        //{name:'invoiceId',index:'invoiceId', width:"0%",hidden:true,sortable:false},
        {name:'id',index:'id', width:"14%",align:'left',sortable:false},
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
        {name: '操作',index:'operation',width: '10%', align: 'left', sortable:false, formatter: function (value,gird,rows,state) {
            var billImage = rows.billImage;
            var billText = rows.billText;
            var invoiceAbleStatus = rows.invoiceAbleStatus;
            var htmlS = '';
            htmlS += '<span data-method="bill_look" class="operation_icon btn-ev fa fa-list-alt" title="查看账单详情"></span>';
            htmlS += (billImage && billText) ? '<span data-method="bill_url" class="operation_icon btn-ev fa fa-file-image-o pointer"  title="账单图片"></span>' : '';
            htmlS += (invoiceAbleStatus == '1') ? '<span data-method="invoice_bill" class="operation_icon btn-ev fa fa-file-text" title="查看发票"></span>' : "";
            //htmlS += '<span data-method="" class="operation_icon btn-ev fa fa-print" title="打印"></span>';
            return  htmlS;}
        },
        {name: '标签',width: '7%', align: 'left', sortable:false, formatter: function (value,gird,rows,state) {
            var isCombinedInvoice=rows.isCombinedInvoice;
            if(isCombinedInvoice=='N'){
                isCombinedInvoice = '';
            }else if(isCombinedInvoice=='Y'){
                isCombinedInvoice = '合';
            }else{
                isCombinedInvoice = '';
            }
            var typeHtml = "";
            typeHtml += '<span class="inv-flagType ' + (rows.invoiceAbleStatus == '1' ? 'inv-flagTypeB' : 'inv-flagTypeA') + '" style="margin:0 4px">票</span>';
            typeHtml += '<span class="inv-flagType '+ (isCombinedInvoice ? 'inv-flagTypeB' : '' )+'" style="margin:0 4px">'+isCombinedInvoice+'</span>';
            return  typeHtml;
        }
        },
        {name:'billSerialNumber',index:'billSerialNumber', width:"14%",align:'left',sortable:false},
        {name:'deptName',index:'deptName', width:"10%",align:'center',sortable:false},
        {name:'shopEntityName',index:'shopEntityName', width:"12%",align:'center',sortable:false},
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
        {name:'invoicePrintDate',index:'invoicePrintDate', width:"14%",align:'center',sortable:false,formatter: function (value, gird, rows, state) {
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
    searchInit();
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
function initGrid(layer){
    window.defaultGridConfig = {
        ajaxGridOptions: {
            url: window.BASE_API_URL + "billInfo/queryBillInfoPage.do",
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
        //beforeRequest: function () {
        //    load();
        //},
        beforeSelectRow: function (rowid, e) {
            var $myGrid = $(this),
                i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),
                cm = $myGrid.jqGrid('getGridParam', 'colModel');
            rowDat_bill = $("#bill_gridtable").jqGrid("getRowData", rowid);
            window.top.isCombinedInvoice = rowDat_bill.isCombinedInvoice;
            window.top.invoiceAbleStatus = rowDat_bill.invoiceAbleStatus;
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
            //账单图片
            bill_url: function(){
                openUrl(layer);
            },
            // 发票详情
            invoice_bill : function(){
                queryInvoiceInfo(layer);
            }
            //导出
            //bill_expData: function () {
            //    getExplorer();
            //}
        };

        $('.bill-cont').on('click','.btn-ev',function () {
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });
        //$('.bill-cont').on('click','.bill-url',function () {
        //    var othis = $(this), method = othis.data('method');
        //    active[method] ? active[method].call(this, othis) : '';
        //});
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
                    done: function(value, date){
                        $("#bill_saletime").attr("title",value);
                        //$(this).attr("title",value);
                        //if(value){
                        //    $("#bill_style").attr("disabled","disabled");
                        //    $("#bill_style").val("");
                        //    $("#bill_style").find("option[value='']").attr("selected",true);
                        //    $("#bill_equipment").attr("disabled","disabled");
                        //    $("#bill_equipment").val("");
                        //}else{
                        //    $("#bill_style").removeAttr("disabled");
                        //    $("#bill_style").val("");
                        //    $("#bill_style").find("option[value='']").attr("selected",true);
                        //    $("#bill_equipment").removeAttr("disabled");
                        //}
                    }
                });
            }else{
                laydate.render({
                    elem: this,
                    type: 'datetime',
                    range: "~",
                    done: function(value, date){
                        $('#invoiceTime').attr("title",value);
                    }
                });
            }
        });
    });
};
//获取查询参数，提交有用数据
function getQueryMap(){
    var rtnMap = {};
    rtnMap["pageIndex"] = 1;
    rtnMap["pageSize"] = 10;
    rtnMap["deptIdStr"] = $.trim( $(".search_bill .organId").val() ); // 所属机构
    rtnMap["invoiceStatus"] = $.trim( $("#bill_stasus option:selected").val() ); //开票状态
    rtnMap["billType"] = $.trim( $("#bill_style option:selected").val() ); //账单类型
    rtnMap["terminalNumber"] = $.trim( $("#bill_equipment").val() ); //终端设备
    rtnMap["saleTimeStr"] = $('#bill_saletime').val(); // 销售时间
    rtnMap["invoicePrintDateStr"] = $('#invoiceTime').val(); // 开始时间
    return rtnMap;
}
// 查询
function queryAllSalesByPage(layer){
    var deptIdStr = $.trim( $(".search_bill .organId").val() ); // 所属机构
    if(!deptIdStr){
        layuiAlert('所属机构不能为空！', {btn: ['关闭']});
        return;
    };
    var bill_val = $.trim( $("#bill_stasus option:selected").val() ) // 账单类型
    if(bill_val == "1"){
        //resetInitGrid();
        $('#bill_gridtable').setColProp('saleTime',{name:'saleTime',index:'saleTime',sortname:"saleTime",sortable:false}); // 动态修改列的配置项
        $('#bill_gridtable').setColProp('invoicePrintDate',{name:'invoicePrintDate',index:'invoicePrintDate', sortname:"invoicePrintDate",sortable:true});
        $("#bill_gridtable").setGridParam(
            {
                beforeRequest : function(){
                    layer.load(3);
                },
                page : 1,
                url : window.BASE_API_URL + "queryOutputInvoice/queryInvoiceList.do",
                type: "post",
                datatype : "json",
                postData : getQueryMap(),
                //defaultGridConfig: {
                //    sortname:"invoicePrintDate",
                sortorder: "desc",
                //},
                gridComplete : function(){
                    layer.closeAll("loading");
                }
            }
        ).trigger("reloadGrid");
    }else{
        //initGrid();
        $('#bill_gridtable').setColProp('saleTime',{name:'saleTime',index:'saleTime',sortname:"saleTime",sortable:true}); // 动态修改列的配置项
        $('#bill_gridtable').setColProp('invoicePrintDate',{name:'invoicePrintDate',index:'invoicePrintDate', sortname:"invoicePrintDate",sortable:false});
        $("#bill_gridtable").setGridParam({
            beforeRequest : function(){
                layer.load(3);
            },
            page : 1,
            url : window.BASE_API_URL + "queryOutputInvoice/queryInvoiceList.do",
            type: "post",
            datatype : "json",
            //sortname:"saleTime",
            sortorder: "desc",
            postData : getQueryMap(),
            gridComplete : function(){
                layer.closeAll("loading");
            }
        }).trigger("reloadGrid");
    }

}
// 初始化查看页面
//function emptyBill(){
//    $("#checkForm_bill input[type='text']").each(function(){
//        $(this).val("");
//    });
//    $("#settlement_mode tr:not(:first)").html("");
//    $("#goodsMessage tr:not(:first)").html("");
//    $('#shopEntityName').text("");
//    $('#invoiceSortImg').css({'display': 'none'});
//    $("#invoiceSortImg").removeClass("inv-flagTypeInfoB");
//    $("#invoiceSortImg").text("");
//    $("#listFlagImg").addClass("inv-flagTypeInfoA");
//    $("#listFlagImg").removeClass("inv-flagTypeInfoB");
//    $("#bill_saletime").val("");
//    $("#bill_equipment").val("");
//    $("#invoiceTime").val("");
//    $("#bill_style").val("");
//    $("#bill_style").find("option[value='']").attr("selected",true);
//}
// 查看账单明细
function querySaleInfo(layer){
    //emptyBill();
    var billMessage = parent.layer.open({
        //type: 1,
        type: 2,
        title: "<big>查看帐单详情</big>",
        area: ['800px','610px'],
        shade: [0.3, '#393D49'],
        shadeClose: false,
        maxmin: true,
        resize: true,//是否允许拉伸
        //content: $('#view_details'),//显示一个块里面的内容
        content: "common.html",//显示一个块里面的内容
        //btn: ['<big>关闭</big>'] ,
        //closeBtn: 2,关闭按钮样式
        //btnAlign: 'l',// 'c' 'r' 按钮排序方式
        zIndex: layer.zIndex,
        success: function(layero,index){
            layer.setTop(layero);
        }
    });
    $.ajax({
        url : window.BASE_API_URL + "billInfo/queryBillInfoDetail.do",
        data : {billId: rowDat_bill.id},
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
        beforeSend: function() {
            //$("#bgFilter").css("display", "block");
            //$("#loadingProgress").css("display", "block");
        },
        success: function(data) {
            if(data.status == 'S'){
                var datas = data.data;
                if(datas!=undefined&&datas!=null&&datas!=''){
                    setTimeout(function (){
                        window.top.setBillInfo(datas);
                    },1000)
                }
            }else if (data.status == 'T') {
                window.top.location.href = '../../../login.html';
                return;
            }else{
                layuiAlert(data.msg);
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

// 发票详情
function queryInvoiceInfo(layer){
    //emptyBill();
    var invoiceMessage = parent.layer.open({
        //type: 1,
        type: 2,
        title: "<big>查看帐单详情</big>",
        area: ['1000px','610px'],
        shade: [0.3, '#393D49'],
        shadeClose: false,
        maxmin: true,
        resize: true,//是否允许拉伸
        //content: $('#view_details'),//显示一个块里面的内容
        content: "invoiceCommon.html",//显示一个块里面的内容
        //btn: ['<big>关闭</big>'] ,
        //closeBtn: 2,关闭按钮样式
        //btnAlign: 'l',// 'c' 'r' 按钮排序方式
        zIndex: layer.zIndex,
        success: function(layero,index){
            layer.setTop(layero);
        }
    });

    $.ajax({
        url : window.BASE_API_URL + "queryOutputInvoice/queryInvoiceDetail.do",
        data : {invoiceId: rowDat_bill.invoiceId},
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
        beforeSend: function() {
            //$("#bgFilter").css("display", "block");
            //$("#loadingProgress").css("display", "block");
        },
        success: function(data) {
            if(data.status == 'S'){
                var datas = data.data;
                if(datas!=undefined&&datas!=null&&datas!=''){
                    setTimeout(function (){
                        window.top.initSetInvoiceInfo();
                        window.top.setInvoiceInfo(datas);
                    },1000)
                }
            }else if (data.status == 'T') {
                window.top.location.href = '../../../login.html';
                return;
            }else{
                layuiAlert(data.msg);
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

//// 查看详情赋值
//function setBillInfo(data){
//    $("#bill_number").val(data.id); // 单据编号
//    var billType = data.billType;
//    if (billType == 1) {
//        $("#bill_type").val('结账单'); // 订单类型
//    }
//    else if (billType == 2) {
//        $("#bill_type").val('预结单'); // 订单类型
//    }
//    else if (billType == 3) {
//        $("#bill_type").val('日结单'); // 订单类型
//    } else if (billType == 7) {
//        $("#bill_type").val('点菜单'); // 订单类型
//    } else if (!billType) {
//        $("#bill_type").val(''); // 订单类型
//    }
//    $("#serial_number").val(data.billSerialNumber); //流水号
//    $("#order_number").val(data.billNo); //订单编号
//    $("#terminal_equipment").val(data.terminalNumber); //终端设备
//    if(data.saleTime == null || data.saleTime == undefined || data.saleTime == ""){
//        $("#selling_number").val('');
//    }else {
//        $("#selling_number").val( timeStamp2String(data.saleTime)); //销售时间
//    };
//    if(data.printDate == null || data.printDate == undefined || data.printDate == ""){
//        $("#printing_time").val('');
//    }else {
//        $("#printing_time").val( timeStamp2String(data.printDate) ); //打印时间
//    };
//    $("#receivableAmount").val( data.receivableAmount != undefined && data.receivableAmount != null && data.receivableAmount != '' ? Number(data.receivableAmount).toFixed(2):'' ); // 应收金额
//    $("#totalFee").val( data.totalFee != undefined && data.totalFee != null && data.totalFee != '' ? Number(data.totalFee).toFixed(2) : ''); // 总金额
//    $("#paidAmount").val( data.paidAmount != undefined && data.paidAmount != null && data.paidAmount != '' ? Number(data.paidAmount).toFixed(2) : ''); // 实收金额
//    $("#discountAmount").val( data.discountAmount != undefined && data.discountAmount != null && data.discountAmount != '' ? Number(data.discountAmount).toFixed(2) : ''); // 折扣金额
//    $("#changeAmount").val(data.changeAmount != undefined && data.changeAmount != null && data.changeAmount != '' ? Number(data.changeAmount).toFixed(2) : ''); // 找零金额
//    $("#couponAmount").val(data.couponAmount != undefined && data.couponAmount != null && data.couponAmount != '' ? Number(data.couponAmount).toFixed(2) : ''); // 优惠金额
//    $("#consumeNum").val(data.consumeNum); // 消费人数
//    $("#deskNo").val(data.deskNo); //桌号
//    $("#roomNo").val(data.roomNo); //房间号
//    if(data.inTime == null || data.inTime == undefined || data.inTime == ""){
//        $("#inTime").val('');
//    }else {
//        $("#inTime").val( timeStamp2String(data.inTime) ); //入住时间
//    };
//    if(data.outTime == null || data.outTime == undefined || data.outTime == ""){
//        $("#outTime").val('');
//    }else {
//        $("#outTime").val( timeStamp2String(data.outTime) ); //离店时间
//    };
//    $("#checkinName").val(data.checkinName); //入住人姓名
//    $("#checkstand").val(data.checkstand); //收银台
//    $("#cashier").val(data.cashier); //收银员
//    $("#saler").val(data.saler); //售货员
//    if(data.settlementWay && data.settlementWay.length>0){
//        var billHtml = '';
//        //var settlementWay=$.parseJSON(data.settlementWay);
//        var settlementWay=data.settlementWay;
//        for(var i=0;i<settlementWay.length; i++){
//            billHtml += '<tr><td>' +settlementWay[i].p + '</td><td>' + (settlementWay[i].a != undefined && settlementWay[i].a != null && settlementWay[i].a != ''? Number(settlementWay[i].a).toFixed(2) : '' )+ '</td></tr>'
//        }
//    };
//    $('#settlement_mode').append(billHtml); // 结算方式
//
//    if(data.goodsDetails && data.goodsDetails.length>0){
//        var goodsHtml = '';
//        //var goodsDetails=$.parseJSON(data.goodsDetails);
//        var goodsDetails=data.goodsDetails;
//        for(var i=0;i<goodsDetails.length; i++){
//            goodsHtml += '<tr><td>' +goodsDetails[i].name + '</td><td>' +goodsDetails[i].itemserial +'</td><td>' + (goodsDetails[i].price != undefined && goodsDetails[i].price != null && goodsDetails[i].price != ''? Number(goodsDetails[i].price).toFixed(2) : '') +'</td><td>' +goodsDetails[i].totalnum +'</td><td>' +(goodsDetails[i].totalprice != undefined && goodsDetails[i].totalprice != null && goodsDetails[i].totalprice != '' ? Number(goodsDetails[i].totalprice).toFixed(2) : '' )+'</td></tr>'
//        }
//    };
//    $('#goodsMessage').append(goodsHtml); // 商品详情
//    $('#shopEntityName').text(data.shopEntityName);
//    var isCombinedInvoice = rowDat_bill.isCombinedInvoice;
//    if(isCombinedInvoice == 'Y'){
//        $('#invoiceSortImg').css({'display': 'inline-block'});
//        $("#invoiceSortImg").addClass("inv-flagTypeInfoB");
//        $("#invoiceSortImg").text("合"); //是否合并
//    }else{
//        $('#invoiceSortImg').css({'display': 'none'});
//        $("#invoiceSortImg").removeClass("inv-flagTypeInfoB");
//        $("#invoiceSortImg").text("");
//    };
//    var invoiceAbleStatus = rowDat_bill.invoiceAbleStatus;
//    if(invoiceAbleStatus == '1'){
//        $("#listFlagImg").addClass("inv-flagTypeInfoB");
//    }else{
//        $("#listFlagImg").addClass("inv-flagTypeInfoA"); // 是否开票
//    };
//}

// 查看图片
function openUrl(layer){
    var ckjsxx = layer.open({
        type: 1,
        title: "<big>账单图片</big>",
        area: ['800px','560px'],
        shade: [0.3, '#393D49'],
        shadeClose: false,
        maxmin: true,
        resize: true,//是否允许拉伸
        content: $('#bill_url'),//显示一个块里面的内容
        //btn: ['<big>关闭</big>'] ,
        success: function(layero,index){//弹层成功回调方法
            layer.setTop(layero); //置顶当前窗口
        }
    });
    var url = rowDat_bill.billImage;
    var billText = (rowDat_bill.billText);
    var billTextHtml = billText.replace(/\n/gm, "<br>").replace(/\\n/gm, "<br>");

    if (url.indexOf("/defaultImg.png") >= 0) {
        //alert(1);
        $('#pdfPath1').hide();
        $('#modal-body').show();
        $('#modal-body').html(billTextHtml);
    } else {
        //alert(2);
        $('#pdfPath1').show();
        $('#pdfPath1').find("img").attr("src", url);
        $('#modal-body').hide();
    }


}