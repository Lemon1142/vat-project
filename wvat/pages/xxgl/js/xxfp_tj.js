//列表名称
var gridListName = "xxfp_jgtj_gridtable";
//列表分页名称
var gridListPaperName = "xxfp_jgtj_pager";
//var gridListName = {0:"xxfp_jgtj_gridtable",1:"xxfp_kpdtj_gridtable"};
//列表分页名称
//var gridListPaperName = "xxfp_jgtj_pager";
//请求URL
var gridDataIntf_jg = window.BASE_API_URL + "statisticsOutputInvoice/statisticsByDeptId.do";
var gridDataIntf_kpd = window.BASE_API_URL + "statisticsOutputInvoice/statisticsByBillingNo.do";
var gridDataIntf = gridDataIntf_jg;
//var gridDataIntf = window.BASE_API_URL + "statisticsOutputInvoice/statisticsByDeptId.do";
//var gridDataIntf = {0:gridDataIntf_jg,1:gridDataIntf_kpd};
var tabFlag = false;

var colMap = {
	colNames:['ID','机构编码','开票机号','开票点名称','机构名称','数量','金额','税额','数量','金额','税额','数量','金额','税额','数量','金额','税额'], 
    colModel:[
        {name:'id',index:'id', width:'',align:'left',sortable:false,hidden:true},
        {name:'deptId',index:'deptId', width:'',align:'left',sortable:false,hidden:true},
        {name:'billingNo',index:'billingNo', width:'8%',align:'left',sortable:false,hidden:true},
        {name:'billingPointName',index:'billingPointName', width:'8%',align:'left',sortable:true,hidden:true},
        {name:'deptName',index:'deptName', width:'8%',align:'left',sortable:false},
        {name:'zyfpInvoiceCount',index:'zyfpInvoiceCount', width:'6%',align:'right',sortable:false},
        {name:'zyfpInvoiceAmount',index:'zyfpInvoiceAmount', width:'8%',align:'right',sortable:false},
        {name:'zyfpTaxAmount',index:'zyfpTaxAmount', width:'8%',align:'right',sortable:false},
        {name:'ptfpInvoiceCount',index:'ptfpInvoiceCount', width:'6%',align:'right',sortable:false},
        {name:'ptfpInvoiceAmount',index:'ptfpInvoiceAmount', width:'8%',align:'right',sortable:false},
        {name:'ptfpTaxAmount',index:'ptfpTaxAmount', width:'8%',align:'right',sortable:false},
        {name:'dzfpInvoiceCount',index:'dzfpInvoiceCount', width:'6%',align:'right',sortable:false},
        {name:'dzfpInvoiceAmount',index:'dzfpInvoiceAmount', width:'8%',align:'right',sortable:false},
        {name:'dzfpTaxAmount',index:'dzfpTaxAmount', width:'8%',align:'right',sortable:false},
        {name:'jpInvoiceCount',index:'jpInvoiceCount', width:'6%',align:'right',sortable:false},
        {name:'jpInvoiceAmount',index:'jpInvoiceAmount', width:'8%',align:'right',sortable:false},
        {name:'jpTaxAmount',index:'jpTaxAmount', width:'8%',align:'right',sortable:false}
    ]};

/**
 * @Describe 初始化界面元素
 */
$(document).ready(function(){
	initGrid(); //初始化界面
	initButton();//初始化按钮
	//resizeJqGrid(gridListName);
	collapseLink();//修改折叠事件的绑定
});

/**
 * @Describe 初始化按钮事件
 */
function initButton(){
	layui.use('layer',function(){
		var layer = layui.layer;		
		var active = {
			xxfp_btn_tjData : function(){//统计事件
				xxfptjQuery();
			},
			// 导出
			btn_expData: function () {
				if(!isChecked("checked")){
					return false;
				};
				if(gridListName == "xxfp_jgtj_gridtable"){
					var beforeUrl = window.BASE_API_URL + "statisticsOutputInvoice/exportStatisticsDeptIdBefore.do",
						listUrl = window.BASE_API_URL + 'statisticsOutputInvoice/exportStatisticsDeptId.do';
					getExplorer(getQueryMap(),beforeUrl,listUrl);
				}else if(gridListName == "xxfp_kpdtj_gridtable"){
					var beforeUrl = window.BASE_API_URL + "statisticsOutputInvoice/exportStatisticsBillingNoBefore.do",
						listUrl = window.BASE_API_URL + 'statisticsOutputInvoice/exportStatisticsBillingNo.do';
					getExplorer(getQueryMap(),beforeUrl,listUrl);
				}
			}
		};
		
		$('#LAY_demo .layui-btn').on('click', function(){
		    var clickBtn = $(this), dataMethod = clickBtn.data('method');
			if($(this).hasClass('layui-btn-disabled')){
				return;
			}
		    active[dataMethod] ? active[dataMethod].call(this, clickBtn) : '';
		});
	});

	//layui  Tab的切换功能，切换事件监听等，需要依赖element模块
	layui.use('element', function(){
		var $ = layui.jquery;
		var element = layui.element;

		element.on('tab(filterTabDiv)', function(data){
			var tabIndex = data.index;
			if(tabIndex == 0){
				gridListName = "xxfp_jgtj_gridtable";
				gridDataIntf = gridDataIntf_jg;
				//gridDataIntf = window.BASE_API_URL + "statisticsOutputInvoice/statisticsByDeptId.do";
				gridListPaperName = "xxfp_jgtj_pager";

			}
			if(tabIndex == 1){
				gridListName = "xxfp_kpdtj_gridtable";
				gridListPaperName = "xxfp_kpdtj_pager";
				gridDataIntf = gridDataIntf_kpd;
				//gridDataIntf = window.BASE_API_URL + "statisticsOutputInvoice/statisticsByBillingNo.do";
				if(!tabFlag){
					colMap.colModel[3].hidden = false;
					initGrid();
					tabFlag = true;
				}
			}
		});
	});
}

/**
 * @Describe 初始化列表展示
 */
function initGrid(){
	window.defaultGridConfig = {
		ajaxGridOptions: {
			url: gridDataIntf,
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true
		},
		prmNames:{
			"page":"pageIndex",
			"rows":"pageSize"
		},
		//postData:getQueryMap(),
        datatype:"local", //数据格式,local表示只做表格的初始化，不加载数据
        mtype:"POST",//提交方式
        //autowidth:false,//自动宽
        autowidth:true,//自动宽
       	width : $(window).width()*0.96,
		height: $(window).height()-320,
        colNames: colMap["colNames"],
        colModel: colMap["colModel"],
        rownumbers:true,//添加左侧行号
        cellEdit:false,//表格可编辑
	    altRows:true,//隔行变色
		altclass:'GridClass',//隔行变色样式
        caption:"",
		deepempty:true,
        viewrecords: true,//是否在浏览导航栏显示记录总数
        rowNum:20,//每页显示记录数
	   	rowList:[20,30,50,100],
	   	loadui:"disable",
        footerrow:true,//合计行
        gridComplete:completeMethod,
        loadComplete:function() {
          	var grid = $("#" + gridListName);
          	var ids = grid.getDataIDs();
          	for (var i = 0; i < ids.length; i++) {
          	grid.setRowData ( ids[i], false, {height: 35} );
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
				//return Math.ceil(obj.data.total/obj.data.pageSize);
			},
			records:"data.total",
            repeatitems : false
        },
        pager:'#' + gridListPaperName
	};
	
	$("#" + gridListName).jqGrid(defaultGridConfig).trigger('reloadGrid');

	setTimeout(function(){
		updatePagerIcons($("#" + gridListName));//加载底部栏图标
	}, 0);
    $('#' + gridListName).setGroupHeaders({
        useColSpanStyle: true,
        groupHeaders: [
            { "numberOfColumns": 3, "titleText": "专用发票", "startColumnName": "zyfpInvoiceCount" },
            { "numberOfColumns": 3, "titleText": "普通发票", "startColumnName": "ptfpInvoiceCount" },
            { "numberOfColumns": 3, "titleText": "普通发票(电子)", "startColumnName": "dzfpInvoiceCount" },
            { "numberOfColumns": 3, "titleText": "普通发票(卷票)", "startColumnName": "jpInvoiceCount" }]
    });

	//resizeTabGrid(gridListName);
	//resizeJqGrid(gridListName);
}

//设置合计行
function completeMethod(){
	$('#' + gridListName).footerData('set', {
			'deptName': "合计",
			'zyfpInvoiceCount': ColSetTotal('zyfpInvoiceCount', 'sl'),
			'zyfpInvoiceAmount': ColSetTotal('zyfpInvoiceAmount', 'je'),
			'zyfpTaxAmount': ColSetTotal('zyfpTaxAmount', 'je'),
			'ptfpInvoiceCount': ColSetTotal('ptfpInvoiceCount', 'sl'),
			'ptfpInvoiceAmount': ColSetTotal('ptfpInvoiceAmount', 'je'),
			'ptfpTaxAmount': ColSetTotal('ptfpTaxAmount', 'je'),
			'dzfpInvoiceCount': ColSetTotal('dzfpInvoiceCount', 'sl'),
			'dzfpInvoiceAmount': ColSetTotal('dzfpInvoiceAmount', 'je'),
			'dzfpTaxAmount': ColSetTotal('dzfpTaxAmount', 'je'),
			'jpInvoiceCount': ColSetTotal('jpInvoiceCount', 'sl'),
			'jpInvoiceAmount': ColSetTotal('jpInvoiceAmount', 'je'),
			'jpTaxAmount': ColSetTotal('jpTaxAmount', 'je') 
		}
	);
}

function ColSetTotal(colName, coltype){
	var sum_col = $('#' + gridListName).getCol(colName, false, 'sum');
	if(coltype == "je")
		sum_col = sum_col.toFixed(2);
	
	return sum_col;
}
function isChecked (typeElement){
	var tjyfq_jg = $.trim($("#xxfp_jgtj_col_tjyfq").val());
	var tjyfz_jg = $.trim($("#xxfp_jgtj_col_tjyfz").val());
	var tjyfq_kpd = $.trim($("#xxfp_kpdtj_col_tjyfq").val());
	var tjyfz_kpd = $.trim($("#xxfp_kpdtj_col_tjyfz").val());
	if(typeElement == "checked"){
		if(gridListName == "xxfp_jgtj_gridtable"){
			if(tjyfq_jg == "" || tjyfz_jg == ""){
				layer.msg("请选择要统计发票的起止月份!", { btn: ['关闭']});
				return false;
			}else {
				var yearMonthStart = tjyfq_jg.replace("-", "");
				var yearMonthEnd = tjyfz_jg.replace("-", "");
				if(yearMonthEnd < yearMonthStart){
					layer.msg("统计发票的结束月份要大于开始月份!", {btn: ['关闭']});
					return false;
				}
			};
		}else if(gridListName == "xxfp_kpdtj_gridtable"){
			if(tjyfq_kpd == "" || tjyfz_kpd == ""){
				layer.msg("请选择要统计发票的起止月份!", { btn: ['关闭']});
				return false;
			}else{
				var yearMonthStart = tjyfq_kpd.replace("-", "");
				var yearMonthEnd = tjyfz_kpd.replace("-", "");
				if (yearMonthEnd < yearMonthStart) {
					layer.msg("统计发票的结束月份要大于开始月份!", {btn: ['关闭']});
					return false;
				};
			}
		};
		return true;
	}
}

/**
 * @Describe 发票统计查询
 */
function xxfptjQuery(){
	var layer = layui.layer;
	if(!isChecked("checked")){
		return false;
	};
	//$("#" + gridListName).setGridParam({
	$("#" + gridListName).setGridParam({
		beforeRequest : function(){
			layer.load(3);
		},
		page : 1,
		type: "post",
		url : gridDataIntf,
		//url : window.BASE_API_URL + "statisticsOutputInvoice/statisticsByDeptId.do",
		datatype : 'json',
		postData : getQueryMap(),
		gridComplete : function(){
			completeMethod();
			layer.closeAll("loading");						
		}
	}).trigger('reloadGrid');
}

/**
 * 获取主界面查询条件
 */
function getQueryMap(){
	var rnMap = {};
	rnMap["pageIndex"] = 1;
	rnMap["pageSize"] = 10;
	var deptID_jg = $.trim($("#jgtj_deptId").val());
	var tjyfq_jg = $.trim($("#xxfp_jgtj_col_tjyfq").val());
	var tjyfz_jg = $.trim($("#xxfp_jgtj_col_tjyfz").val());
	var deptID_kpd = $.trim($("#kpdtj_deptId").val());
	var tjyfq_kpd = $.trim($("#xxfp_kpdtj_col_tjyfq").val());
	var tjyfz_kpd = $.trim($("#xxfp_kpdtj_col_tjyfz").val());
	var kpdNo_kpd = $.trim($("#xxfp_kpdtj_col_billingNo").val());

	if(kpdNo_kpd!=''){
		deptID_kpd = kpdNo_kpd.split("_")[1];
		kpdNo_kpd = kpdNo_kpd.split("_")[0];
	}
	if (gridListName == "xxfp_jgtj_gridtable") {
		rnMap["deptId"] = deptID_jg;
		var yearMonthStart = tjyfq_jg.replace("-", "");
		var yearMonthEnd = tjyfz_jg.replace("-", "");
		rnMap["yearMonthStart"] = yearMonthStart;
		rnMap["yearMonthEnd"] = yearMonthEnd;
	}
	else if (gridListName == "xxfp_kpdtj_gridtable") {
		rnMap["deptId"] = deptID_kpd;
		rnMap["billingNo"] = kpdNo_kpd;
		var yearMonthStart = tjyfq_kpd.replace("-", "");
		var yearMonthEnd = tjyfz_kpd.replace("-", "");
		rnMap["yearMonthStart"] = yearMonthStart;
		rnMap["yearMonthEnd"] = yearMonthEnd;
	}
	return rnMap;
}

//机构变更回调函数
function callbackMethod(xxId){
	$("#xxfp_kpdtj_col_billingNo").html('');
	$("#xxfp_kpdtj_col_billingNo").html("<option value='' selected>"+"--全部--</option>")
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
				if (data.status == "S" && data.data.length > 0){
					var billins = data.data;
					$.each(billins, function (i, item) {
						$("#xxfp_kpdtj_col_billingNo").append("<option value=" + item.billingNo +"_"+item.deptId+ ">" + item.billingPointName + "</option> ");
					});
				}else if (data.status=="T") {
					window.top.location.href = "../../login.html";
				}else if (data.status=="F"){
					layer.msg(data.msg);
				}
			}
		});
	}
	else{
		$("#xxfp_kpdtj_col_billingNo").html('');
		$("#xxfp_kpdtj_col_billingNo").html("<option value='' selected>"+"--全部--</option>")
	}
}
