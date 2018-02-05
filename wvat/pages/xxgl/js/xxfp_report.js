//列表名称
var gridListName = "xxfp_slvrep_gridtable";
//请求URL
var gridDataIntf_slv = window.BASE_API_URL + "statisticsOutputInvoice/statisticsByTaxRate.do";
var gridDataIntf_zt = window.BASE_API_URL + "statisticsOutputInvoice/statisticsByInvoiceState.do";
var gridDataIntf = gridDataIntf_slv;

var colMap = {
	colNames:['ID','机构编码','发票税率','发票状态','发票数量','金额','税额','价税合计','发票数量','金额','税额','价税合计','发票数量','金额','税额','价税合计','发票数量','金额','税额','价税合计'], 
    colModel:[
        {name:'id',index:'id', width:'',align:'left',sortable:false,hidden:true},
        {name:'deptId',index:'deptId', width:'',align:'left',sortable:false,hidden:true},
        {name:'taxRate',index:'taxRate', width:'8%',align:'center',sortable:false,hidden:false,formatter:function(cellvalue, options, rowObject){
			if(cellvalue == "合计")
				return cellvalue;
			if(cellvalue == "many")
				return "多税率";
        	return cellvalue + "%";
		}},
        {name:'invoiceState',index:'invoiceState', width:'8%',align:'center',sortable:true,hidden:true,formatter:function(cellvalue, options, rowObject){
			if(cellvalue == "合计")
				return cellvalue;
        	if(cellvalue == "01")
				return "待打印";
			if(cellvalue == "02")
				return "已打印";
			if(cellvalue == "03")
				return "(红冲)待打印";
			if(cellvalue == "04")
				return "(红冲)已打印";
			if(cellvalue == "05")
				return "已开具作废";
			if(cellvalue == "06")
				return "空白作废";
			return cellvalue;
		}},
        {name:'zyfpInvoiceCount',index:'zyfpInvoiceCount', width:'6%',align:'right',sortable:false},
        {name:'zyfpInvoiceAmount',index:'zyfpInvoiceAmount', width:'8%',align:'right',sortable:false},
        {name:'zyfpTaxAmount',index:'zyfpTaxAmount', width:'8%',align:'right',sortable:false},
        {name:'zyfpTotalAmount',index:'zyfpTotalAmount', width:'8%',align:'right',sortable:false},
        {name:'ptfpInvoiceCount',index:'ptfpInvoiceCount', width:'6%',align:'right',sortable:false},
        {name:'ptfpInvoiceAmount',index:'ptfpInvoiceAmount', width:'8%',align:'right',sortable:false},
        {name:'ptfpTaxAmount',index:'ptfpTaxAmount', width:'8%',align:'right',sortable:false},
        {name:'ptfpTotalAmount',index:'ptfpTotalAmount', width:'8%',align:'right',sortable:false},
        {name:'dzfpInvoiceCount',index:'dzfpInvoiceCount', width:'6%',align:'right',sortable:false},
        {name:'dzfpInvoiceAmount',index:'dzfpInvoiceAmount', width:'8%',align:'right',sortable:false},
        {name:'dzfpTaxAmount',index:'dzfpTaxAmount', width:'8%',align:'right',sortable:false},
        {name:'dzfpTotalAmount',index:'dzfpTotalAmount', width:'8%',align:'right',sortable:false},
        {name:'jpInvoiceCount',index:'jpInvoiceCount', width:'6%',align:'right',sortable:false},
        {name:'jpInvoiceAmount',index:'jpInvoiceAmount', width:'8%',align:'right',sortable:false},
        {name:'jpTaxAmount',index:'jpTaxAmount', width:'8%',align:'right',sortable:false},
        {name:'jpTotalAmount',index:'jpTotalAmount', width:'8%',align:'right',sortable:false}
    ]};

/**
 * @Describe 初始化界面元素
 */
$(document).ready(function(){
	initGrid();
	initButton();//初始化按钮
	collapseLink();//修改折叠事件的绑定
});

/**
 * @Describe 初始化按钮事件
 */
var tab_flag = false;
function initButton(){
	layui.use('layer',function(){
		var layer = layui.layer;		
		var active = {
			xxfp_btn_tjData : function(){
				xxfptjQuery(layer);
			},
			xxfp_btn_expData : function(){
				xxfptjQuery(layer);
			},
			// 导出
			btn_expData: function () {
				if(!isLoad("check")){
					return false;
				};
				if(gridListName == "xxfp_slvrep_gridtable"){
					var	beforeUrl = window.BASE_API_URL + 'statisticsOutputInvoice/exportStatisticsTaxRateBefore.do';
					var	listUrl = window.BASE_API_URL + 'statisticsOutputInvoice/exportStatisticsTaxRate.do';
					getExplorer(getQueryMap(),beforeUrl,listUrl);
				}else if(gridListName == "xxfp_ztrep_gridtable"){
					var	beforeUrl = window.BASE_API_URL + 'statisticsOutputInvoice/exportStatisticsInvoiceStateBefore.do';
					var	listUrl = window.BASE_API_URL + 'statisticsOutputInvoice/exportStatisticsInvoiceState.do';
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
				gridListName = "xxfp_slvrep_gridtable";
				gridDataIntf = gridDataIntf_slv;
			}
			if(tabIndex == 1){
				gridListName = "xxfp_ztrep_gridtable";
				gridDataIntf = gridDataIntf_zt;
				if(!tab_flag){
					colMap.colModel[2].hidden = true;
					colMap.colModel[3].hidden = false;
					initGrid();
					//resizeJqGrid(gridListName);
					tab_flag = true;
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
		//prmNames:{
		//	"page":"pageIndex",
		//	"rows":"pageSize"
		//},
//		postData:getQueryMap(),
        datatype:"local", //数据格式,local表示只做表格的初始化，不加载数据
        mtype:"POST",//提交方式
        autowidth:false,//自动宽
       	width : $(window).width()*0.96,
		//height: $(window).height()*0.57,
		height: $(window).height()-320,
        colNames: colMap["colNames"],
        colModel: colMap["colModel"],
        rownumbers:true,//添加左侧行号
        cellEdit:false,//表格可编辑
	    altRows:true,//隔行变色
		altclass:'GridClass',//隔行变色样式
        caption:"",
        viewrecords: true,//是否在浏览导航栏显示记录总数
//        rowNum:20,//每页显示记录数
//	   	rowList:[20,30,50,100],
        loadui:"disable",
        footerrow:true,//合计行
        gridComplete: completeMethod,
        userDataOnFooter : true,
        loadComplete:function() {
          	var grid = $("#" + gridListName);
          	var ids = grid.getDataIDs();
          	for (var i = 0; i < ids.length; i++) {
          	grid.setRowData ( ids[i], false, {height: 35} );
          	}
         },
        jsonReader:{
			//root: "data.rows",
			root: function (obj) {
				if(obj.status=="F"){
					layer.msg(obj.msg);
					return;
				}else if(obj.status=="T"){
					window.top.location.href = '../../../login.html';
				}else{
					return obj.data.rows;
				}
			},
			userdata: {"amount":3220,"tax":342,"total":3564,"name":123},
            repeatitems : false
        }
//        pager:'#' + gridListPaperName
	};
	
	$("#" + gridListName).jqGrid(defaultGridConfig).trigger('reloadGrid');
		
//	setTimeout(function(){
//		updatePagerIcons($("#" + gridListName));//加载底部栏图标
//	}, 0);

	$('#' + gridListName).setGroupHeaders({
        useColSpanStyle: true,
        groupHeaders: [
            { "numberOfColumns": 4, "titleText": "专用发票", "startColumnName": "zyfpInvoiceCount" },
            { "numberOfColumns": 4, "titleText": "普通发票", "startColumnName": "ptfpInvoiceCount" },
            { "numberOfColumns": 4, "titleText": "普通发票(电子)", "startColumnName": "dzfpInvoiceCount" },
            { "numberOfColumns": 4, "titleText": "普通发票(卷票)", "startColumnName": "jpInvoiceCount" }]
    });
	//resizeJqGrid(gridListName);
}

//设置合计行
function completeMethod(){
	$('#' + gridListName).footerData('set', {
			'taxRate': "合计",
			'invoiceState': "合计",
			'zyfpInvoiceCount': ColSetTotal('zyfpInvoiceCount', 'sl'),
			'zyfpInvoiceAmount': ColSetTotal('zyfpInvoiceAmount', 'je'),
			'zyfpTaxAmount': ColSetTotal('zyfpTaxAmount', 'je'),
			'zyfpTotalAmount': ColSetTotal('zyfpTotalAmount', 'je'),
			'ptfpInvoiceCount': ColSetTotal('ptfpInvoiceCount', 'sl'),
			'ptfpInvoiceAmount': ColSetTotal('ptfpInvoiceAmount', 'je'),
			'ptfpTaxAmount': ColSetTotal('ptfpTaxAmount', 'je'),
			'ptfpTotalAmount': ColSetTotal('ptfpTotalAmount', 'je'),
			'dzfpInvoiceCount': ColSetTotal('dzfpInvoiceCount', 'sl'),
			'dzfpInvoiceAmount': ColSetTotal('dzfpInvoiceAmount', 'je'),
			'dzfpTaxAmount': ColSetTotal('dzfpTaxAmount', 'je'),
			'dzfpTotalAmount': ColSetTotal('dzfpTotalAmount', 'je'),
			'jpInvoiceCount': ColSetTotal('jpInvoiceCount', 'sl'),
			'jpInvoiceAmount': ColSetTotal('jpInvoiceAmount', 'je'),
			'jpTaxAmount': ColSetTotal('jpTaxAmount', 'je'),
			'jpTotalAmount': ColSetTotal('jpTotalAmount', 'je') 
		}
	);
}

function ColSetTotal(colName, coltype){
	var sum_col = $('#' + gridListName).getCol(colName, false, 'sum');
	if(coltype == "je")
		sum_col = sum_col.toFixed(2);
	
	return sum_col;
}
function isLoad(typeCon){
	var tjyfq_slv = $.trim($("#xxfp_slvrep_col_tjyfq").val());
	var tjyfz_slv = $.trim($("#xxfp_slvrep_col_tjyfz").val());
	var tjyfq_zt = $.trim($("#xxfp_ztrep_col_tjyfq").val());
	var tjyfz_zt = $.trim($("#xxfp_ztrep_col_tjyfz").val());
	if(typeCon == "check"){
		if(gridListName == "xxfp_slvrep_gridtable"){
			if(tjyfq_slv == "" || tjyfz_slv == ""){
				layer.msg("请选择要统计发票的起止月份!", { btn: ['关闭']});
				return false;
			}else{
				var yearMonthStart = tjyfq_slv.replace("-", "");
				var yearMonthEnd = tjyfz_slv.replace("-", "");
				if (yearMonthEnd < yearMonthStart) {
					layer.msg("统计发票的结束月份要大于开始月份!", {btn: ['关闭']});
					return false;
				};
			};

		}
		else if(gridListName == "xxfp_ztrep_gridtable"){
			if(tjyfq_zt == "" || tjyfz_zt == ""){
				layer.msg("请选择要统计发票的起止月份!", { btn: ['关闭']});
				return false;
			}else{
				var yearMonthStart = tjyfq_zt.replace("-", "");
				var yearMonthEnd = tjyfz_zt.replace("-", "");
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
function xxfptjQuery(layer){
	if(!isLoad("check")){
		return false;
	};
	$("#" + gridListName).setGridParam({
		beforeRequest : function(){
			layer.load(3);
		},
		url : gridDataIntf,
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
	//rnMap["pageIndex"] = 1;
	//rnMap["pageSize"] = 10;
	var deptID_slv = $.trim($("#slvrep_deptId").val());
	var tjyfq_slv = $.trim($("#xxfp_slvrep_col_tjyfq").val());
	var tjyfz_slv = $.trim($("#xxfp_slvrep_col_tjyfz").val());
	var deptID_zt = $.trim($("#ztrep_deptId").val());
	var tjyfq_zt = $.trim($("#xxfp_ztrep_col_tjyfq").val());
	var tjyfz_zt = $.trim($("#xxfp_ztrep_col_tjyfz").val());

	if (gridListName == "xxfp_slvrep_gridtable") {
		rnMap["deptId"] = deptID_slv;
		var yearMonthStart = tjyfq_slv.replace("-", "");
		var yearMonthEnd = tjyfz_slv.replace("-", "");
		rnMap["yearMonthStart"] = yearMonthStart;
		rnMap["yearMonthEnd"] = yearMonthEnd;
	}
	;
	if (gridListName == "xxfp_ztrep_gridtable") {
		rnMap["deptId"] = deptID_zt;
		var yearMonthStart = tjyfq_zt.replace("-", "");
		var yearMonthEnd = tjyfz_zt.replace("-", "");
		rnMap["yearMonthStart"] = yearMonthStart;
		rnMap["yearMonthEnd"] = yearMonthEnd;
	}
	;
	return rnMap;
}
