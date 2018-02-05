var rowDat_ssfl;
//初始化
$(document).ready(function(){
	initGrid();//初始化界面
	initButton();//初始化按钮
	collapseLink();//修改折叠事件的绑定
});
var colMap = {
	colNames: ['id', 'deptId', '编码', '合并编码', '名称', '税率', '增值税特殊管理', '是否汇总项', '是否隐藏', '编码表版本号'],
	colModel: [
		{name: 'id', index: 'id', width: '0%', align: 'center', hidden: true},
		{name: 'deptId', index: 'deptId', width: '0%', align: 'center', hidden: true},
		{name: 'code', index: 'code', width: '10%', align: 'left', sortable: false},
		{name: 'mergeCode', index: 'mergeCode', width: '15%', align: 'left', sortable: false},
		{name: 'name', index: 'name', width: '20%', align: 'left', sortable: false},
		{
			name: 'taxRate',
			index: 'taxRate',
			width: '10%',
			align: 'center',
			sortable: false,
			formatter: function (value, gird, rows, state) {
				if (value != null) {
					return value * 100 + '%';
				} else {
					return "";
				}
			}
		},
		{name: 'specialManage', index: 'specialManage', width: '10%', align: 'left', sortable: false},
		{
			name: 'isSumItem',
			index: 'isSumItem',
			width: '8%',
			align: 'center',
			sortable: false,
			formatter: function (value, gird, rows, state) {
				if (value == 'Y') {
					return "是";
				} else {
					return "否";
				}
			}
		},
		{
			name: 'isHide',
			index: 'isHide',
			width: '8%',
			align: 'center',
			sortable: false,
			formatter: function (value, gird, rows, state) {
				if (value == 'Y') {
					return "是";
				} else {
					return "否";
				}
			}
		},
		{name: 'versionNum', index: 'versionNum', width: '8%', align: 'center', sortable: false}
	]
};

//获取查询参数，只提交有用数据
function getQueryMap() {
	var rtnMap = {};
	rtnMap["pageIndex"] = 1;
	rtnMap["pageSize"] = 10;
    rtnMap["mergeCode"] = $.trim($("#mergeCode").val());
    rtnMap["name"] = $.trim($("#name").val());
    rtnMap["taxRate"] = $.trim($("#taxRate option:selected").val());
    rtnMap["isSumItem"] = $.trim($("#isSumItem option:selected").val());
    return rtnMap;
}
//初始化按钮
function initButton() {
    layui.use('layer', function () {
        var $ = layui.jquery,
            layer = layui.layer;
        var active = {
            //查询
            btn_query: function () {
            	queryAllSellerInfoByPage();
            },
			bill_upload: function () {
				categoryCodeUpload(layer);
			}

        };
        $('#LAY_demo .layui-btn').on('click', function () {
            var othis = $(this), method = othis.data('method');
            console.log(method);
            active[method] ? active[method].call(this, othis) : '';
        });
    });
}

/**
 * 查询列表
 */
function queryAllSellerInfoByPage(){
	$("#ssfl_gridtable").setGridParam({
		beforeRequest : function(){ layer.load(3);},
		page : 1,
		url : window.BASE_API_URL + "categoryCodeInfo/queryTaxCategoryCodeInfoPage.do",
		type: "post",
		datatype : "json",
		postData : getQueryMap(),
		gridComplete : function(){
//			completeMethod();
			layer.closeAll("loading");						
		}
	}).trigger("reloadGrid")
}

//默认查询显示列表
function initGrid(){
	window.defaultGridConfig = {
		ajaxGridOptions: {
			url: window.BASE_API_URL + "categoryCodeInfo/queryTaxCategoryCodeInfoPage.do",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true
		},
		prmNames:{
			"page":"pageIndex",
			"rows":"pageSize",
		},
		postData:{
			"mergeCode":$.trim($("#mergeCode").val()),//组织机构
			"name":$.trim($("#name").val()), //登录账号
			"taxRate":$.trim($("#taxRate").val()), //登录账号
			"isSumItem": $.trim($("#isSumItem option:selected").val())//锁定标记
		},
        datatype:"json", //数据来源，本地数据
        mtype:"POST",//提交方式
        autowidth:false,//自动宽,
       	width : $(window).width()*0.98,
		height: $(window).height()*0.806,
        colNames: colMap["colNames"],
        colModel: colMap["colModel"],
        rownumbers:true,//添加左侧行号
        cellEdit:false,//表格可编辑
	    altRows:true,//隔行变色
		altclass:'GridClass',//隔行变色样式
		loadonce: false,//排序
        caption:"",
        loadui:"disable",
        viewrecords: true,//是否在浏览导航栏显示记录总数
        rowNum:10,//每页显示记录数
	   	rowList:[10,20,30,50,100],
        multiselect: false,
		beforeRequest: function () {
			//loadBill();
			load();
		},
        loadComplete: function(data){
			if(data.status == "T"){
				window.top.location.href = '../../login.html';
			}
			var grid = $("#ssfl_gridtable");
			var ids = grid.getDataIDs();
			for (var i = 0; i < ids.length; i++) {
				grid.setRowData ( ids[i], false, {height: 35} );
			}
		},
		gridComplete: function () {
			load('loading');
		},
        jsonReader:{
            id: "id",//设置返回参数中，表格ID的名字为blackId
			page:"data.pageIndex",
			root: "data.rows",
			total: function (obj) {
				if(obj.status == "T"){
					window.top.location.href = '../../login.html';
				}
				return Math.ceil(obj.data.total/obj.data.pageSize);
			},
			records:"data.total",
            repeatitems : false
        },
        pager:'#ssfl_pager'
	 }; 
	
	$("#ssfl_gridtable").jqGrid(defaultGridConfig).trigger('reloadGrid');
	setTimeout(function(){
		updatePagerIcons($("#ssfl_gridtable"));//加载底部栏图标
	}, 0);
	resizeJqGrid("ssfl_gridtable");
}

/**
 * 运行中提示
 */
function wwdzAdd(layer, layerId) {
    layer.cjsj('运行中', {
        icon: 16,
        shade: 0.6,
        zIndex: layer.zIndex + 100
    });
    //此处演示关闭
    setTimeout(function () {
        layer.close(layerId);
        //document.getElementById("wwdz_xz_form").reset();
        layer.closeAll('loading');
    }, 1000);
};

function categoryCodeUpload(layer){
	var categoryMessage = layer.open({
		type: 1,
		title: "<big>导入模板</big>",
		area: ['600px','310px'],
		shade: [0.3, '#393D49'],
		shadeClose: false,
		maxmin: true,
		resize: true,//是否允许拉伸
		content: $('#categoryCode_upload'),//显示一个块里面的内容
		//btn: ['<big>关闭</big>'] ,
		//closeBtn: 2,关闭按钮样式
		//btnAlign: 'l',// 'c' 'r' 按钮排序方式
		zIndex: layer.zIndex,
		success: function(layero,index){
			layer.setTop(layero);
		}
	});
};