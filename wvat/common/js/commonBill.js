/**
 * Created by admin on 2018/1/22.
 */
 // 查看详情赋值
//$(document).ready(function() {
// emptyBill();
//setBillInfo();
//})

function emptyBill(){
    $("#checkForm_bill input[type='text']").each(function(){
        $(this).val("");
    });
    $("#settlement_mode tr:not(:first)").html("");
    $("#goodsMessage tr:not(:first)").html("");
    $('#shopEntityName').text("");
    $('#invoiceSortImg').css({'display': 'none'});
    $("#invoiceSortImg").removeClass("inv-flagTypeInfoB");
    $("#invoiceSortImg").text("");
    $("#listFlagImg").addClass("inv-flagTypeInfoA");
    $("#listFlagImg").removeClass("inv-flagTypeInfoB");
    $("#bill_saletime").val("");
    $("#bill_equipment").val("");
    $("#invoiceTime").val("");
    $("#bill_style").val("");
    $("#bill_style").find("option[value='']").attr("selected",true);
}
function setBillInfo(data,flag){
    emptyBill();
    console.log(data);
    $("#bill_number").val(data.id); // 单据编号
    var billType = data.billType;
    if (billType == 1) {
        $("#bill_type").val('结账单'); // 订单类型
    }
    else if (billType == 2) {
        $("#bill_type").val('预结单'); // 订单类型
    }
    else if (billType == 3) {
        $("#bill_type").val('日结单'); // 订单类型
    } else if (billType == 7) {
        $("#bill_type").val('点菜单'); // 订单类型
    } else if (!billType) {
        $("#bill_type").val(''); // 订单类型
    }
    $("#serial_number").val(data.billSerialNumber); //流水号
    $("#order_number").val(data.billNo); //订单编号
    $("#terminal_equipment").val(data.terminalNumber); //终端设备
    if(data.saleTime == null || data.saleTime == undefined || data.saleTime == ""){
        $("#selling_number").val('');
    }else {
        $("#selling_number").val( timeStamp2String(data.saleTime)); //销售时间
    };
    if(data.printDate == null || data.printDate == undefined || data.printDate == ""){
        $("#printing_time").val('');
    }else {
        $("#printing_time").val( timeStamp2String(data.printDate) ); //打印时间
    };
    $("#receivableAmount").val( data.receivableAmount != undefined && data.receivableAmount != null && data.receivableAmount !== '' ? Number(data.receivableAmount).toFixed(2):'' ); // 应收金额
    $("#totalFee").val( data.totalFee != undefined && data.totalFee != null && data.totalFee !== '' ? Number(data.totalFee).toFixed(2) : ''); // 总金额
    $("#paidAmount").val( data.paidAmount != undefined && data.paidAmount != null && data.paidAmount !== '' ? Number(data.paidAmount).toFixed(2) : ''); // 实收金额
    $("#discountAmount").val( data.discountAmount != undefined && data.discountAmount != null && data.discountAmount !== '' ? Number(data.discountAmount).toFixed(2) : ''); // 折扣金额
    $("#changeAmount").val(data.changeAmount != undefined && data.changeAmount != null && data.changeAmount !== '' ? Number(data.changeAmount).toFixed(2) : ''); // 找零金额
    $("#couponAmount").val(data.couponAmount != undefined && data.couponAmount != null && data.couponAmount !== '' ? Number(data.couponAmount).toFixed(2) : ''); // 优惠金额
    $("#consumeNum").val(data.consumeNum); // 消费人数
    $("#deskNo").val(data.deskNo); //桌号
    $("#roomNo").val(data.roomNo); //房间号
    if(data.inTime == null || data.inTime == undefined || data.inTime == ""){
        $("#inTime").val('');
    }else {
        $("#inTime").val( timeStamp2String(data.inTime) ); //入住时间
    };
    if(data.outTime == null || data.outTime == undefined || data.outTime == ""){
        $("#outTime").val('');
    }else {
        $("#outTime").val( timeStamp2String(data.outTime) ); //离店时间
    };
    $("#checkinName").val(data.checkinName); //入住人姓名
    $("#checkstand").val(data.checkstand); //收银台
    $("#cashier").val(data.cashier); //收银员
    $("#saler").val(data.saler); //售货员
    if(data.settlementWay && data.settlementWay.length>0){
        var billHtml = '';
        //var settlementWay=$.parseJSON(data.settlementWay);
        var settlementWay=data.settlementWay;
        for(var i=0;i<settlementWay.length; i++){
            billHtml += '<tr><td>' +settlementWay[i].p + '</td><td>' + (settlementWay[i].a != undefined && settlementWay[i].a != null && settlementWay[i].a !== ''? Number(settlementWay[i].a).toFixed(2) : '' )+ '</td></tr>'
        }
    };
    $('#settlement_mode').append(billHtml); // 结算方式

    if(data.goodsDetails && data.goodsDetails.length>0){
        var goodsHtml = '';
        //var goodsDetails=$.parseJSON(data.goodsDetails);
        var goodsDetails=data.goodsDetails;
        for(var i=0;i<goodsDetails.length; i++){
            goodsHtml += '<tr><td>' +goodsDetails[i].name + '</td><td>' +goodsDetails[i].itemserial +'</td><td>' + (goodsDetails[i].price != undefined && goodsDetails[i].price != null && goodsDetails[i].price !== ''? Number(goodsDetails[i].price).toFixed(2) : '') +'</td><td>' +goodsDetails[i].totalnum +'</td><td>' +(goodsDetails[i].totalprice != undefined && goodsDetails[i].totalprice != null && goodsDetails[i].totalprice !== '' ? Number(goodsDetails[i].totalprice).toFixed(2) : '' )+'</td></tr>'
        }
    };
    $('#goodsMessage').append(goodsHtml); // 商品详情
    $('#shopEntityName').text(data.shopEntityName);
    var isCombinedInvoice = window.top.isCombinedInvoice;
    if(isCombinedInvoice){
        if(isCombinedInvoice == 'Y'){
            $('#invoiceSortImg').css({'display': 'inline-block'});
            $("#invoiceSortImg").addClass("inv-flagTypeInfoB");
            $("#invoiceSortImg").text("合"); //是否合并
        }else if(isCombinedInvoice == 'C'){
            $('#invoiceSortImg').css({'display': 'inline-block'});
            $("#invoiceSortImg").addClass("inv-flagTypeInfoB");
            $("#invoiceSortImg").text("拆"); //是否合并
        }
        else{
            $('#invoiceSortImg').css({'display': 'none'});
            $("#invoiceSortImg").removeClass("inv-flagTypeInfoB");
            $("#invoiceSortImg").text("");
        };
    };

    if(flag == "bill"){
        var invoiceAbleStatus = 1;
    }else{
        var invoiceAbleStatus = window.top.invoiceAbleStatus;
    };
    if(invoiceAbleStatus != undefined && invoiceAbleStatus!= null && invoiceAbleStatus !== ""){
        if(invoiceAbleStatus == '1'){
            $("#listFlagImg").addClass("inv-flagTypeInfoB");
            $("#listFlagImg").text("票");
        }else{
            $("#listFlagImg").addClass("inv-flagTypeInfoA"); // 是否开票
            $("#listFlagImg").text("票");
        };
    }
}