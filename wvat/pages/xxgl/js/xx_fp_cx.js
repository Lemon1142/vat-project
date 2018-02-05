var rowDat_xxfp='',rowDat_billList,sort = '',isCombinedInvoice_bill='';
var colMap ={
	colNames : ['isCombinedInvoice','invoiceSort','','','发票代码','发票号码','操作','标签','报送状态','销方名称','销方税号','购方名称','购方税号','商品名称','数量','单价','税率','合计金额','合计税额','价税合计','开票日期','销售单号','服务商'],
	colModel : [
		//{name:'id',index:'id', width:"0%",hidden:true,sortable:false},
		{name:'isCombinedInvoice',index:'isCombinedInvoice', width:"0%",hidden:true,sortable:false},
		{name:'invoiceSort',index:'invoiceSort', width:"0%",hidden:true,sortable:false},
		{name:'pdfPath1',index:'pdfPath1', width:"0%",hidden:true,sortable:false},
		{name:'invoiceId',index:'invoiceId', width:"0%",hidden:true,sortable:false},
		{name:'invoiceCode',index:'invoiceCode', width:"100px",sortable:false},
		{name:'invoiceNo',index:'invoiceNo', width:"75px",align:'center',sortable:true},
		{name: '操作',index:'operation',width: '140px', align: 'left', sortable:false, formatter: function (value,gird,rows,state) {
			var invoiceSort=rows.invoiceSort;
			var pdfPath1 = rows.pdfPath1;
			var interfaceStyle = rows.interfaceStyle;
			//var isCombinedInvoice = rows.isCombinedInvoice; // 是否拆分发票
			var htmlS = '';
			htmlS += '<span data-method="btn_look" class="operation_icon btn-ev fa fa-file-text" title="查看"></span>';
			htmlS += (invoiceSort=='000002'&&pdfPath1!=undefined&&pdfPath1!=null&&pdfPath1!='') ? '<span data-method="btn_url" class="operation_icon btn-ev fa fa-link pointer"  title="连接"></span>' : '';
			//htmlS += (billId != undefined && billId != null && billId != "" && isCombinedInvoice != 'Y') ? '<span data-method="bill_look" class="operation_icon btn-ev fa fa-list-alt" title="查看账单详情"></span>' : '';
			htmlS += (interfaceStyle != undefined && interfaceStyle != null && interfaceStyle != "" && interfaceStyle != '0') ? '<span data-method="'+(interfaceStyle == '1' ? 'bill_look' : 'display_list') +'" class="operation_icon btn-ev fa fa-list-alt" title="查看账单详情"></span>' : '';
			return  htmlS;}
		},
		{name: '标签',width: '125px', align: 'left', sortable:false,title:false, formatter: function (value,gird,rows,state) {
			var invoiceSort = rows.invoiceSort;
			if (invoiceSort == '000000') {
				invoiceSort = '普';
			} else if (invoiceSort == '000001') {
				invoiceSort = '专';
			} else if (invoiceSort == '000002') {
				invoiceSort = '电';
			} else if (invoiceSort == '000003') {
				invoiceSort = '卷';
			} else if (invoiceSort == '000004') {
				invoiceSort = '机';
			} else {
				invoiceSort = '普';
			}
			var typeHtml = "";
			typeHtml += '<span class="inv-flagType inv-flagTypeB" title="' + invoiceSort + '票">' + invoiceSort + '</span>';
			typeHtml += '<span class="inv-flagType ' + ( rows.invoiceSort == '000004' ? 'listHide' : (rows.listFlag == '1' ? 'inv-flagTypeB' : 'inv-flagTypeA')) + '" style="margin-left: 5px" title="' + (rows.listFlag == '1' ? '有清单' : '无清单') + '">清</span>';
			typeHtml += '<span class="inv-flagType ' + (rows.printFlag == '1' ? 'inv-flagTypeB' : 'inv-flagTypeA') + '" style="margin-left: 5px" title="' + (rows.printFlag == '1' ? '已打印' : '未打印') + '">印</span>';
			typeHtml += '<span class="inv-flagType ' + (rows.cancelFlag == '1' ? 'inv-flagTypeB' : 'inv-flagTypeA') + '" style="margin-left: 5px" title="' + (rows.cancelFlag == '1' ? '已作废' : '未作废') + '">废</span>';
			typeHtml += '<span class="inv-flagType ' + (rows.invoiceType == '1' ? 'inv-flagTypeB' : 'inv-flagTypeA') + '" style="margin-left: 5px" title="' + (rows.invoiceType == '1' ? '已冲红' : '未冲红') + '">红</span>';
			return typeHtml;
		}
		},
		{name:'submitStatus',index:'submitStatus', width:"70px",align:'center',sortable:false, formatter:function(cellvalue, options, rowObject){
			if(cellvalue == 0){
				return "未报送";
			}else
			if(cellvalue == 1){
				return "已报送";
			}else
			if(cellvalue == 2){
				return "报送失败";
			}else
			if(cellvalue == 3){
				return "报送中";
			}if(cellvalue == 4){
				return "验签失败";
			}else{
				return "";
			};
		}
		},
		{name:'sellerName',index:'sellerName', width:"200px",align:'left',sortable:false},
		{name:'sellerTaxNo',index:'sellerTaxNo', width:"140px",align:'left',sortable:false},
		{name:'custName',index:'sellerName', width:"200px",align:'left',sortable:false},
		{name:'custTaxNo',index:'sellerTaxNo', width:"140px",align:'left',sortable:false},
		{name:'goodsName',index:'goodsName', width:"100px",align:'left',sortable:false},
		{name:'quantity',index:'quantity', width:"50px",align:'right',sortable:false},
		{name:'price',index:'price', width:"80px",align:'right',sortable:false},
		{name:'taxRate',index:'taxRate', width:"50px",align:'right',sortable:false},
		{name:'preTaxAmount',index:'preTaxAmount', width:"80px",align:'right',sortable:false},
		{name:'taxAmount',index:'taxAmount', width:"80px",align:'right',sortable:false},
		{name:'invoiceAmount',index:'invoiceAmount', width:"80px",align:'right',sortable:false},
		{name:'invoicePrintDate',index:'invoicePrintDate', width:"90px",align:'center',sortable:true},
		{name:'billId',index:'billId', width:"150px",align:'center',sortable:false},
		{name:'source',index:'source', width:"60px",align:'center',sortable:false,sortorder :"desc", formatter:function(cellvalue, options, rowObject){
			if(cellvalue == 1){
				return "百望";
			}else if(cellvalue == 2){
				return "航信";
			}else{
				return "其他";
			}
		}}
	]};
$(document).ready(function(){
	initGrid();//初始化界面
	initButton();//初始化按钮
	collapseLink();//修改折叠事件的绑定
});

//获取查询参数，只提交有用数据
function getQueryMap() {
	var rtnMap = {};
	rtnMap["pageIndex"] = 1;
	rtnMap["pageSize"] = 10;
	rtnMap["sord"] = $("#facx_gridtable").jqGrid('getGridParam','sortorder');
	var sellerTaxNo = $.trim($("#sellerTaxNo").val());
	var billingNo = $.trim($("#billingNo").val());
	rtnMap["deptId"] = $.trim($("#organId").val());
	rtnMap["invoiceCode"] = $.trim($("#invoiceCode").val());
	rtnMap["invoiceNoStart"] = $.trim($("#invoiceNoStart").val());
	rtnMap["invoiceNoEnd"] = $.trim($("#invoiceNoEnd").val());
	rtnMap["sellerName"] = $.trim($("#sellerName").val());
	if(billingNo!=''){
		rtnMap["billingNo"] = billingNo.split("_")[0];
		if(sellerTaxNo==''){
			sellerTaxNo = billingNo.split("_")[1];
		}
	}else{
		rtnMap["billingNo"] = billingNo;
	}
	rtnMap["sellerTaxNo"] = sellerTaxNo;
	rtnMap["billId"] = $.trim($("#billId").val());
	rtnMap["custTaxNo"] = $.trim($("#custTaxNo").val());
	rtnMap["custName"] = $.trim($("#custName").val());
	rtnMap["invoicePrintDate"] = $.trim($("#invoicePrintDate").val());
	rtnMap["invoicePrintDateStart"] = $.trim($("#invoicePrintDateStart").val());
	rtnMap["invoicePrintDateEnd"] = $.trim($("#invoicePrintDateEnd").val());
	rtnMap["invoiceSort"] = $.trim($("#invoiceSort option:selected").val());
	rtnMap["taxRate"] = $.trim($("#taxRate option:selected").val());
	rtnMap["printFlag"] = $.trim($("#printFlag option:selected").val());
	rtnMap["cancelFlag"] = $.trim($("#cancelFlag option:selected").val());
	rtnMap["submitStatus"] = $.trim($("#submitStatus option:selected").val());
	rtnMap["listFlag"] = $.trim($("#listFlag option:selected").val());
	rtnMap["source"] = $.trim($("#source option:selected").val());
	rtnMap["invoiceType"] = $.trim($("#invoiceType option:selected").val());
	return rtnMap;
}
//默认查询显示列表
function initGrid(){
	window.defaultGridConfig = {
		ajaxGridOptions: {
			url: window.BASE_API_URL + "queryOutputInvoice/queryInvoiceList.do",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true
		},
		prmNames:{
			"page":"pageIndex",
			"rows":"pageSize",
			//"sord": "sort"
		},
		postData:{
			sort : 'invoicePrintDate desc'
		},
		onSortCol: function (index, colindex, sortorder) {
			//形参就是
			$('#facx_gridtable').setGridParam({postData: {sort: index + ' ' + sortorder}})
			//sort =  ' ' + sortorder;
		},
		datatype:"local", //数据来源，本地数据
		mtype:"POST",//提交方式
		autowidth:true,//自动宽,
		width : $(window).width()*0.98,
		height: $(window).height()*0.6,
		colNames: colMap["colNames"],
		colModel: colMap["colModel"],
		rownumbers:true,//添加左侧行号
		cellEdit:false,//表格可编辑
		altRows:true,//隔行变色
		altclass:'GridClass',//隔行变色样式
		caption:"",
		loadui:"disable",
		//multiSort:true,
		sortname:'invoicePrintDate',
		sortorder: "desc",
		viewrecords: true,//是否在浏览导航栏显示记录总数
		rowNum:10,//每页显示记录数
		rowList:[10,20,30,50,100],
		multiselect: false,
		beforeSelectRow: beforeSelectRow,
		footerrow:true,//合计行
		gridComplete: completeMethod,
		beforeSelectRow: function(rowid, e) {
			var $myGrid = $(this),
				i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),
				cm = $myGrid.jqGrid('getGridParam', 'colModel');
			rowDat_xxfp = $("#facx_gridtable").jqGrid("getRowData", rowid);
			window.top.isCombinedInvoice = rowDat_xxfp.isCombinedInvoice;
			isCombinedInvoice_bill = rowDat_xxfp.isCombinedInvoice;
			if(cm[i].index === 'cb'){
				return false;
			}else{
				return true;
			}
		},
		loadComplete:function() {
			var grid = $("#facx_gridtable");
			var ids = grid.getDataIDs();
			for (var i = 0; i < ids.length; i++) {
				grid.setRowData ( ids[i], false, {height: 35} );
			}
		},
		onPaging: function(pgButton){      //当点击翻页按钮但还为展现数据时触发此事件, 当然这跳转栏输入页  //码改变页时也同样触发此事件
			//first_booklistpage,  prev_booklistpage,  next_booklistpage,  --- first_wwdz_pager last_wwdz_page prev_wwdz_pager next_wwdz_pager user
			if(pgButton=='user'){
//        		var page = $('#facx_gridtable').getGridParam('page'); // current page
				var page = $('#facx_gridtable').getGridParam('rows');
				var page = $("#facx_gridtable").jqGrid('getGridParam', 'page');
			}
		},
		jsonReader:{
			id: "id",//设置返回参数中，表格ID的名字为blackId
			page:"data.pageIndex",
			root: "data.rows",
			total: function (obj) {
				if(obj!=undefined&&obj!=null){
					if(obj.status=="F"){
						layer.msg(obj.msg);
						return;
					}else if(obj.status=="T"){
						window.top.location.href = '../../../login.html';
					}else{
						if(obj.data){
							return Math.ceil(obj.data.total/obj.data.pageSize);
						}
					}
				}
			},
			records:"data.total",
			repeatitems : false
		},
		pager:'#wwdz_pager'
	};
	$("#facx_gridtable").jqGrid(defaultGridConfig).trigger('reloadGrid');
	setTimeout(function(){
		updatePagerIcons($("#facx_gridtable"));//加载底部栏图标
	}, 0);
	resizeJqGrid("facx_gridtable");
}
//拆分账单列表
function billListGrid(){
	var colMapList = {
		colNames : ['billImage','销售单据编号','订单类型','操作','标签','小票流水号','应收金额','销售时间','终端设备号'],
		colModel : [
			//{name:'id',index:'id', width:"0%",hidden:true},
			//{name:'invoiceSort',index:'invoiceSort', width:"0%",hidden:true},
			{name:'billImage',index:'billImage', width:"2%",hidden:true},
			{name:'id',index:'id', width:"16%",align:'center',sortable:false},
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
			{name: '操作', index: 'operation', width: '8%', align: 'left', sortable: false, formatter: function (value, gird, rows, state) {
					var billImage = rows.billImage;
					var htmlS = '';
					htmlS += '<span data-method="list_billInfo" class="operation_icon btn-ev fa fa-file-text" title="查看账单详情"></span>';
					htmlS += (billImage) ? '<span data-method="billList_url" class="operation_icon btn-ev fa fa-file-image-o pointer"  title="账单图片"></span>' : '';
					return htmlS;
				}
			},
			{name: '标签',width: '8%', align: 'left', sortable:false, formatter: function (value,gird,rows,state) {
				var isCombinedInvoice=isCombinedInvoice_bill,invoiceStatus = 1;
				if(isCombinedInvoice=='N'){
					isCombinedInvoice = '';
				}else if(isCombinedInvoice=='Y'){
					isCombinedInvoice = '合';
				}else if(isCombinedInvoice =='C'){
					isCombinedInvoice = '拆';
				}
				var typeHtml = "";
				typeHtml += '<span class="inv-flagType ' + (invoiceStatus == '1' ? 'inv-flagTypeB' : 'inv-flagTypeA') + '" style="margin:0 4px" title="票">票</span>';
				typeHtml += '<span class="inv-flagType '+ (isCombinedInvoice ? 'inv-flagTypeB' : '' )+'" style="margin:0 4px" title="'+isCombinedInvoice+'">'+isCombinedInvoice+'</span>';
				return  typeHtml;
			}
			},
			{name:'billSerialNumber',index:'billSerialNumber', width:"14%",align:'right',sortable:false},
			{name:'receivableAmount',index:'receivableAmount', width:"10%",align:'right',sortable:false,formatter:function(cellvalue, options, rowObject){
				if(cellvalue == undefined || cellvalue == null || cellvalue == ''){
					return "";
				}else{
					return Number(cellvalue).toFixed(2);
				}
			}},
			{name:'saleTime',index:'saleTime', width:"16%",align:'center',sortable:true,formatter: function (value, gird, rows, state) {
				if(value == undefined || value == null || value == ''){
					return '';
				}else{
					return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
				}
			}},
			{name:'terminalNumber',index:'terminalNumber', width:"10%",align:'center',sortable:true},
		],
	};
	window.defaultGridConfig = {
		ajaxGridOptions: {
			xhrFields: {
				withCredentials: true
			}
			,
			crossDomain: true
		},
		url: window.BASE_API_URL + "queryOutputInvoice/queryBillInfoDetailList.do",
		datatype: "json", //数据来源，本地数据
		mtype: "POST",//提交方式
		postData : {
			"billId": rowDat_xxfp.billId
		},
		autowidth: false,//自动宽,
		width: $("#bill_list").width(),
		//width: 880,
		height: $(window).height() -400,
		//height: $("#layui-layer2").height()-200,
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
		beforeRequest : function(){
			load();
		},
		beforeSelectRow: function (rowid, e) {
			var $myGrid = $(this),
				i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),
				cm = $myGrid.jqGrid('getGridParam', 'colModel');
			rowDat_billList = $("#billList_gridtable").jqGrid("getRowData", rowid);
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
	}
	$('#billList_gridtable').jqGrid('clearGridData');
	$("#billList_gridtable").jqGrid(defaultGridConfig).setGridParam({postData:{billId:rowDat_xxfp.billId}}).trigger('reloadGrid');
};
//初始化按钮
function initButton(){
	layui.use('layer', function(){
		var $ = layui.jquery,
			layer = layui.layer;
		var active = {
			//查询
			btn_query: function(){
				queryAllRoleByPage();
			},
			//查看
			btn_look: function(){
				queryInvoiceInfo(layer);
			},
			//链接
			btn_url: function(){
				openUrl(layer);
			},
			//账单列表
			display_list: function () {
				queryBillList();
				billListGrid();
				var psWinWidths=$("#bill_list").width();
				$("#billList_gridtable").jqGrid('setGridWidth', psWinWidths-18);
			},
			//查看账单详情
			bill_look: function(){
				querySalexcInfo(layer);
			},
			// 查看列表账单详情
			list_billInfo: function () {
			    queryBillInfo(layer);
			},
			//账单图片
			billList_url: function(){
				openUrlBillList(layer);
			},
			//导出
			xxfp_btn_expData: function () {
				var beforeUrl = window.BASE_API_URL + "queryOutputInvoice/exportInvoiceListBefore.do",
				listUrl = window.BASE_API_URL + 'queryOutputInvoice/exportInvoiceList.do';
				getExplorer(getQueryMap(),beforeUrl,listUrl);
			}
		};

		$('.tab-cont').on('click','.btn-ev',function () {
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
		lay('.layui-input').each(function(){
			laydate.render({
				elem: '#invoicePrintDate',
				range: "*"
			});
		});
	});
}
// 查看账单明细
function querySalexcInfo(layer){
	var billMessage = parent.layer.open({
		type: 2,
		title: "<big>查看帐单详情</big>",
		area: ['800px','610px'],
		shade: [0.3, '#393D49'],
		shadeClose: false,
		maxmin: true,
		resize: true,//是否允许拉伸
		content: "common/common.html",//显示一个块里面的内容
		zIndex: layer.zIndex,
		success: function(layero,index){
			layer.setTop(layero);
		}
	});
	$.ajax({
		url : window.BASE_API_URL + "billInfo/queryBillInfoDetail.do",
		data : {billId: rowDat_xxfp.billId},
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
			//var index = parent.layer.load(2,{zIndex: layer.zIndex});
			//parent.layer.close(index);
		},
		success: function(data) {
			if(data.status == 'S'){
				var datas = data.data;
				if(datas!=undefined&&datas!=null&&datas!=''){
					setTimeout(function (){
						alert(22);
						window.top.setBillInfo(datas,"bill");
						var index = parent.layer.load(2,{zIndex: layer.zIndex});
						parent.layer.close(index);
					},800)
				}else{
					var index = parent.layer.load(2,{zIndex: layer.zIndex});
					parent.layer.close(index);
				}
			}else if (data.status == 'T') {
				window.top.location.href = '../../../login.html';
				return;
			}else{
				var index = parent.layer.load(2,{zIndex: layer.zIndex});
				parent.layer.close(index);
				layuiAlert(data.msg);
				return;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.msg('操作失败!', {zIndex: layer.zIndex});
		}
	});
};
/**
 * 发票明细查询
 */
//window.top.refreshid = "";//注意定义成全局变量
function queryInvoiceInfo(layer){
	if(rowDat_xxfp.invoiceSort == "000003"){
		var rollInvoiceInfo = parent.layer.open({
			type: 2,
			title: "<big>发票明细</big>",
			area: ['1000px','610px'],
			shade: [0.3, '#393D49'],
			shadeClose: false,
			maxmin: true,
			resize: false,//是否允许拉伸
			content: "common/rollInvoice.html",
			zIndex: layer.zIndex, //控制层叠顺序
			success: function(layero,index){//弹层成功回调方法
				layer.setTop(layero); //置顶当前窗口
			}
		});
	}else if(rowDat_xxfp.invoiceSort == "000004"){
		var vehicleInvoiceInfo = parent.layer.open({
			type: 2,
			title: "<big>发票明细</big>",
			area: ['1000px','610px'],
			shade: [0.3, '#393D49'],
			shadeClose: false,
			maxmin: true,
			resize: false,//是否允许拉伸
			content: "common/vehicleInvoice.html",
			zIndex: layer.zIndex, //控制层叠顺序
			success: function(layero,index){//弹层成功回调方法
				layer.setTop(layero); //置顶当前窗口
			}
		});
	}else{
		var ckjsxx = parent.layer.open({
			//type: 1,
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
		url : window.BASE_API_URL + "queryOutputInvoice/queryInvoiceDetail.do",
		data : {invoiceId: rowDat_xxfp.invoiceId},
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
			//var indexBill = parent.layer.load(2,{zIndex: layer.zIndex});
			//parent.layer.close(indexBill);
		},
		success: function(data) {
			if(data.status == 'S'){
				var datas = data.data;
				if(datas!=undefined&&datas!=null&&datas!=''){
					if(datas.invoiceDetail.invoiceSort == "000004"){
						setTimeout(function (){
							window.top.vehicleInvoiceInfo(datas);
							var indexRoll = parent.layer.load(2,{zIndex: layer.zIndex});
							parent.layer.close(indexRoll);
						},800)
						//return false;
					}else if(datas.invoiceDetail.invoiceSort == "000003"){
						setTimeout(function (){
							window.top.rollInvoiceInfo(datas);
							var indexBill = parent.layer.load(2,{zIndex: layer.zIndex});
							parent.layer.close(indexBill);
						},800)
						//return false;
					}
					else{
						setTimeout(function (){
							window.top.initSetInvoiceInfo();
							window.top.setInvoiceInfo(datas);
							var indexRoll = parent.layer.load(2,{zIndex: layer.zIndex});
							parent.layer.close(indexRoll);
						},800)
					}
				}else{
					var indexRoll = parent.layer.load(2,{zIndex: layer.zIndex});
					parent.layer.close(indexRoll);
				}
			}else if (data.status == 'T') {
				window.top.location.href = '../../../login.html';
				return;
			}else{
				var indexRoll = parent.layer.load(2,{zIndex: layer.zIndex});
				parent.layer.close(indexRoll);
				layuiAlert(data.msg);
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
function openUrl(layer){
	var ckjsxx = layer.open({
		type: 1,
		title: "<big>发票PDF</big>",
		area: ['1000px','610px'],
		shade: [0.3, '#393D49'],
		shadeClose: false,
		maxmin: true,
		resize: false,//是否允许拉伸
		content: $('#fp_url'),//显示一个块里面的内容
		//btn: ['<big>关闭</big>'] ,
		success: function(layero,index){//弹层成功回调方法
			layer.setTop(layero); //置顶当前窗口
		}
	});
	var url=rowDat_xxfp.pdfPath1 || "";
	$('#pdfPath1').find("img").attr("src", url);

}
/**
 * 查询
 */
function queryAllRoleByPage(){
	$("#facx_gridtable").setGridParam({
		beforeRequest : function(){
			layer.load(3);
		},
		page : 1,
		url : window.BASE_API_URL + "queryOutputInvoice/queryInvoiceList.do",
		type: "post",
		prmNames:{
			"pageIndex":"pageIndex",
			"pageSize":"pageSize"
		},
		datatype : "json",
		postData : getQueryMap(),
		gridComplete : function(){
			completeMethod();
			layer.closeAll("loading");
		}
	}).trigger("reloadGrid");
}

// 拆分列表
function queryBillList(){
	var billMessage = layer.open({
		type: 1,
		title: "<big>合并账单列表</big>",
		area: ['900px','600px'],
		shade: [0.3, '#393D49'],
		shadeClose: false,
		maxmin: true,
		resize: false,//是否允许拉伸
		content: $('#bill_list'),//显示一个块里面的内容
		//zIndex: layer.zIndex,
		success: function(layero,index){
			layer.setTop(layero);
		},
		full: function(layero){
			billListGrid();
			var psWinWidths=$("#bill_list").width();
			$("#billList_gridtable").setGridWidth(psWinWidths-18);
		},
		restore: function (layero) {
			billListGrid();
			var psWinWidths=$("#bill_list").width();
			$("#billList_gridtable").jqGrid('setGridWidth', psWinWidths-18);
		}
	});
}

// 拆分账单列表详情
function queryBillInfo(){
	var billListInfo = parent.layer.open({
		type: 2,
		title: "<big>查看帐单详情</big>",
		area: ['800px','610px'],
		shade: [0.3, '#393D49'],
		shadeClose: false,
		maxmin: true,
		resize: false,//是否允许拉伸
		content: "common/common.html",//显示一个块里面的内容
		zIndex: layer.zIndex,
		success: function(layero,index){
			layer.setTop(layero);
		}
	});
	$.ajax({
		url : window.BASE_API_URL + "queryOutputInvoice/queryBillInfoDetail.do",
		data : {billId: rowDat_billList.id},
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
			//var indexBillList = parent.layer.load(2,{zIndex: layer.zIndex});
			//parent.layer.close(indexBillList);
		},
		success: function(data) {
			if(data.status == 'S'){
				var datas = data.data;
				if(datas!=undefined&&datas!=null&&datas!=''){
					setTimeout(function (){
						window.top.setBillInfo(datas,"bill");
						var indexBillList = parent.layer.load(2,{zIndex: layer.zIndex});
						parent.layer.close(indexBillList);
					},800)
				}else{
					var indexBillList = parent.layer.load(2,{zIndex: layer.zIndex});
					parent.layer.close(indexBillList);
				}
			}else if (data.status == 'T') {
				window.top.location.href = '../../../login.html';
				return;
			}else{
				var indexBillList = parent.layer.load(2,{zIndex: layer.zIndex});
				parent.layer.close(indexBillList);
				layuiAlert(data.msg);
				return;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.msg('操作失败!', {zIndex: layer.zIndex});
		}
	});
}

//机构变更回调函数
function callbackMethod(xxId){
	$("#billingNo").html('');
	$("#billingNo").html("<option value='' selected>"+"全部</option>");
	if(xxId != '' ){
		$.ajax({
			url : window.BASE_API_URL +"billingPointInfo/queryTaxBillingPointInfoList.do",
			data : {
				'deptId' : xxId
			},
			type : 'post',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			dataType : 'json',
			success : function(data) {
				//if (data.status == "S" && data.data.length > 0){
				if (data.status == "S"){
					var billins = data.data;
					if(billins != null && billins != undefined && billins != ""){
						$.each(billins, function (i, item) {
							$("#billingNo").append("<option value=" + item.billingNo +"_"+item.sellerTaxNo+ ">" + item.billingPointName + "</option> ");
						});
						return false;
					}
				}else if (data.status=="T") {
					window.top.location.href = "../../../login.html";
				}else if (data.status=="F"){
					layer.msg(data.msg);
					return false;
				}
			}
		});
	}
	else{
		$("#billingNo").html('');
		$("#billingNo").html("<option value='' selected>"+"全部</option>");
	}
}

/** 转换大写 **/
function intToChinese (n) {
	var fraction = ['角'];
	var digit = [
		'零', '壹', '贰', '叁', '肆',
		'伍', '陆', '柒', '捌', '玖'
	];
	var unit = [
		['元', '万', '亿'],
		['', '拾', '佰', '仟']
	];
	var head = n < 0 ? '（负数）' : '';
	n = Math.abs(n);
	var s = '';
	for (var i = 0; i < fraction.length; i++) {
		s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
	}
	s = s || '整';
	n = Math.floor(n);
	for (var i = 0; i < unit[0].length && n > 0; i++) {
		var p = '';
		for (var j = 0; j < unit[1].length && n > 0; j++) {
			p = digit[n % 10] + unit[1][j] + p;
			n = Math.floor(n / 10);
		}
		s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
	}
	return head + s.replace(/(零.)*零元/, '元')
			.replace(/(零.)+/g, '零')
			.replace(/^整$/, '零元整');
}

function beforeSelectRow() {
	$("#jqgridId").jqGrid('resetSelection');
	return (true);
};
// 查看图片
function openUrlBillList(layer){
	var billList = layer.open({
		type: 1,
		title: "<big>账单图片</big>",
		area: ['800px','560px'],
		shade: [0.3, '#393D49'],
		shadeClose: false,
		maxmin: true,
		resize: false,//是否允许拉伸
		content: $('#billList_url'),//显示一个块里面的内容
		zIndex: layer.zIndex,
		success: function(layero,index){//弹层成功回调方法
			layer.setTop(layero); //置顶当前窗口
		}
	});
	var url = rowDat_billList.billImage || "";
	$('#billList_url #pdfPath1_bill').find("img").attr("src", url);
};
//设置合计行
function completeMethod(){
	$('#facx_gridtable').footerData('set', {
			'preTaxAmount': ColSetTotal('preTaxAmount', 'je'),
			'taxAmount': ColSetTotal('taxAmount', 'je'),
			'invoiceAmount': ColSetTotal('invoiceAmount', 'je')
		}
	);
}
function ColSetTotal(colName, coltype){
	var sum_col = $('#facx_gridtable').getCol(colName, false, 'sum');
	if(coltype == "je")
		sum_col = sum_col.toFixed(2);
	return sum_col;
}

