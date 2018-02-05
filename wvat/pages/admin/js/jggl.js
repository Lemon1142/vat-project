//全局变量
var jgjcsz = 4;//机构级次设置，增加机构，最低可增加的级次，默认为0（不限）
var bmjc_0 = 0;//机构级次的初始值，在修改机构时用到
var str="新增机构",rowDta_jg = null,cbtnArr = window.top.buttonAuth;
var colMap ={
	colNames : ['ID','','','','','机构编码','机构名称','操作','纳税人识别号','所属纳税人识别号','上级机构编码','上级机构名称','开票标志','有效标志','创建时间'],
	colModel: [
		{name:'id',index:'id', width:'',sortable:false,hidden:true},
		{name:'deptTel',index:'deptTel',align:'center', width:'',sortable:false,hidden:true},
		{name:'deptManager',index:'deptManager',align:'center', width:'',sortable:false,hidden:true},
		//{name:'deptManager',index:'deptManager',align:'center', width:'',sortable:false,hidden:true},
		{name:'parentId',index:'parentId', width:'',sortable:false,hidden:true},
		{name:'description',index:'description',align:'center', width:'',sortable:false,hidden:true},
		{name:'deptCode',index:'deptCode', width:'10%',align:'left',sortable:false},
		{name:'deptName',index:'deptName', width:'10%',align:'left',sortable:false},
		{
			name: '操作',index: 'cb',width: '10%', align: 'center', sortable:false,formatter: function (value,gird,rows,state) {
			return  "<a href='#' btncode='101050' class='btn_look jgoption "+ ($.inArray('101050',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' )+"' style='' title='查看'>" +
				"<i data-method='btn_check'   class='btn-ev  fa fa-file-text pointer' style='font-size: 14px !important;'></i>" +
				"</a>" +
				"<a href='#' btncode='101030' class='jgoption "+ ($.inArray('101030',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' )+"' style='padding-left: 5px;' title='编辑'>" +
				"<i data-method='btn_edit' class='btn-ev fa fa-pencil-square-o' style='font-size: 14px !important;display: inline-block;width: 12px;height: 14px'></i> " +
				"</a>" +
				"<a href='#' btncode='101040' class='jgoption "+ ($.inArray('101040',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' )+"' style='' title='注销'>" +
				"<i data-method='btn_del' class='btn-ev fa fa-ban' style='font-size: 14px !important;'></i>" +
				"</a>"
		}
		},
		{name:'taxNo',index:'taxNo', width:'10%',align:'left',sortable:false},
		{name:'parentTaxNo',index:'parentTaxNo', width:'10%',align:'left',sortable:false},
		{name:'parentDeptCode',index:'parentDeptCode', width:'10%',align:'left',sortable:false},
		{name:'parentDeptName',index:'parentDeptName', width:'10%',align:'left',sortable:false},
		{
			name:'invoiceFlag',index:'invoiceFlag', width:'10%',align:'center',sortable:false,formatter: function (value,gird,rows,state) {
			if (value == '0') {
				return '<span>不开票</span>';
			}
			return  "<span>开票</span>";
		}},
		{
			name:'status',index:'status', width:'8%',align:'center',sortable:false,formatter: function (value,gird,rows,state) {
			if (value == '0') {
				return "<span>无效</span>";
			}
			return  "<span>有效</span>";
		}},
		{
			name:'createTime',index:'createTime', width:'12%',align:'center',sortable:true,sortorder:'desc',formatter: function (value,gird,rows,state) {
			return new Date(value).Format("yyyy-MM-dd hh:mm:ss")
		}}


	]
};
$(document).ready(function(){
	initGrid();
	initButton();
	collapseLink();//修改折叠事件的绑定
	//initAisinoCheck("checkForm");//初始化这个form的校验
});
//初始化按钮
function initButton(){
	layui.use('layer',function(){
		var $ = layui.jquery,
			layer = layui.layer;
		var active = {
			//查询
			btn_query: function(){
				queryAllJggl();
			},
			//新增
			btn_add: function(){
				openJgglDialog(str,"");
				var that = this;
				var addWwdz = layer.open({
					type: 1,
					title: "<big>新增机构</big>",
					area: ['800px','500px'],
					shade: [0.6, '#393D49'],
					shadeClose: false,
					maxmin: true,
					resize: true,//是否允许拉伸
					content: $('#modal-dialog-1'),
					btn: ['保存', '取消'] ,//只是为了演示
					yes:function(){
						if(saveJggl(str,"")){
							//wwdzAdd(layer,addWwdz);
						}
					},
					btn2: function(){
						layer.closeAll();
						$("input[name='res']").click();
						clearAisinoError('checkForm');
						//$("#checkForm").reset();
					},
					zIndex: 1000, //控制层叠顺序
					success: function(layero){
						layer.setTop(layero); //置顶当前窗口
					}
				});
			},
			//修改
			btn_edit: function () {
				var str = "修改机构";
				openJgglDialog(str, rowDta_jg);
				var editWwdz = layer.open({
					type: 1,
					title: "<big>修改机构</big>",
					area: ['800px', '500px'],
					shade: [0.6, '#393D49'],
					shadeClose: false,
					maxmin: true,
					resize: true,//是否允许拉伸
					content: $('#modal-dialog-1'),
					btn: ['保存', '取消'],//只是为了演示
					yes: function () {
						//if(saveJggl(str,rowData)){//保存
						if (saveJggl(str, rowDta_jg)) {//保存
							//wwdzAdd(layer,editWwdz);
						}
					},
					btn2: function () {
						layer.closeAll();
						$("input[name='res']").click();
						clearAisinoError('checkForm');
						//$("#checkForm").reset();
					},
					zIndex: 1000, //控制层叠顺序
					success: function (layero) {
						layer.setTop(layero); //置顶当前窗口
					}
				});
			},
			//查看
			btn_check: function () {
				var str = "查看机构";
				openJgglDialog(str, rowDta_jg);
				var editWwdz = layer.open({
					type: 1,
					title: "<big>查看机构</big>",
					area: ['800px', '500px'],
					shade: [0.6, '#393D49'],
					shadeClose: false,
					maxmin: true,
					resize: true,//是否允许拉伸
					content: $('#modal-dialog-1'),
					btn: ['关闭'],//只是为了演示
					zIndex: 1000, //控制层叠顺序
					success: function (layero) {
						layer.setTop(layero); //置顶当前窗口
					}
				});
			},
			//注销
			btn_del: function(){
				deleteDialog();
			},
			// 导出
			btn_expData: function () {
				var beforeUrl = window.BASE_API_URL + "sysDept/exportSysDeptListBefore.do",
					listUrl = window.BASE_API_URL + 'sysDept/exportSysDeptList.do';
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
}
function emptyJg(){
	$('#checkForm').find('input,textarea,select').removeAttr('disabled');
	$("#mparentTaxNo").attr('disabled','disabled');
	$("#mparentDeptCode").attr('disabled','disabled');
	$("#mtaxNo").attr('disabled','disabled');
	$("#mdeptCode").removeAttr('disabled');//机构编码
	$("#mdeptCode").val('');//机构编码
	$("#mdeptName").val('');//机构名称
	$("#mparentName").val('');//上级机构名称
	$("#mparentId").val('');//上级机构id
	$("#mparentDeptCode").val('');//上级机构编码
	//$("#jgglDialog #mparentName").removeAttr("disabled");
	$(".required_mechanism").show();
	$("#mdeptTel").val('');//机构电话
	$("#mdeptManager").val('');//机构负责人
	$("#mtaxNo").val('');//纳税人识别号
	$("#mparentTaxNo").val('');//所属纳税人识别号
	$("#minvoiceFlag").val("1");
	$("#minvoiceFlag").find("option[value='1']").attr("selected",true);//开票标志
	$("#mstatus").val("1"); //有效标志
	$("#mstatus").find("option[value='1']").attr("selected",true);//有效标志
	$("#mstatus").attr("disabled",true);
	$("#mdeptType").val("00"); //机构属性
	$("#mdeptType").find("option[value='00']").attr("selected",true);//机构属性
	$("#misParentDept").attr("disabled","disabled");
	$("#misParentDept").val("N");
	$("#misParentDept").find("option[value='N']").attr("selected",true);//是否集团总机构
	$("#misParentDept_name").attr("readonly","true");
	$("#mdesciption").val('');//描述
	$('#sjjg_control #mparentName').removeAttr('disabled');
};
//供应商税号选择弹框
function openJgglDialog(str,rowData){
	emptyJg();
	var user_type = cookie.get("userType");
	if(user_type != "0"){
		$("#misParentDept").attr("disabled","disabled");
	}else{
		$("#misParentDept").removeAttr("disabled");
	};
	$("#misParentDept").change(function () {
		var misParentDept_val = $(this).children("option:selected").val();
		if (misParentDept_val == "Y") {
			$(".required_mechanism").hide();
			$("#jgglDialog #mparentName").attr("disabled","disabled");
			$("#jgglDialog #mparentName").val("");
			$("#jgglDialog #mparentId").val('');//上级机构id
			$("#jgglDialog #mparentDeptCode").val('');//上级机构编码
			$("#jgglDialog #mtaxNo").val('');//纳税人识别号
			$("#jgglDialog #mparentTaxNo").val('');//所属纳税人识别号
		} else {
			$(".required_mechanism").show();
			$("#jgglDialog #mparentName").removeAttr("disabled");
		}
	});
	$("#mstatus").change(function () {
		var mstatus_val = $(this).children("option:selected").val();
		if(mstatus_val == 1){
			$("#jgglDialog #mstatus").attr("disabled","disabled");
		}else{
			$("#jgglDialog #mstatus").removeAttr("disabled");
		}
	})
	if(str=="修改机构" || str == '查看机构'){
		$("#mdeptCode").attr('disabled','disabled');//机构编码
		$("#misParentDept").attr('disabled','disabled');//机构编码
		$.ajax({
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			url : window.BASE_API_URL + "sysDept/querySysDeptDetail.do",
			type: 'post',
			dataType: 'json',
			data: {
				id: rowData.id
			},
			success: function (data){
				//var data = data.data;
				$("#mdeptCode").val(data.data.deptCode);//机构编码
				$("#mdeptName").val(data.data.deptName);//机构名称
				$("#mparentName").val(data.data.parentDeptName);//上级机构名称
				$("#mparentId").val(data.data.parentId);//上级机构id
				$("#mparentDeptCode").val(data.data.parentDeptCode);//上级机构编码
				$("#mdeptTel").val(data.data.deptTel);//机构电话
				$("#mdeptManager").val(data.data.deptManager);//机构负责人
				$("#mtaxNo").val(data.data.taxNo);//纳税人识别号
				$("#mparentTaxNo").val(data.data.parentTaxNo);//所属纳税人识别号

				$("#minvoiceFlag").val(data.data.invoiceFlag);
				if (data.data.invoiceFlag == '0') {
					$("#minvoiceFlag").find("option[value='0']").attr("selected",true).siblings('option').removeAttr('selected');//开票标志
				}
				$("#mstatus").val(data.data.status); //有效标志
				if (data.data.status == '0') {
					//$("#mstatus").find("option[value='0']").attr("selected",true).siblings().removeAttr('selected');
					$("#mstatus").find("option[value='0']").attr("selected","selected").siblings().removeAttr('selected');
					$("#jgglDialog #mstatus").removeAttr("disabled");
				}else if(data.data.status == '1'){
					$("#mstatus").find("option[value='1']").attr("selected","selected").siblings().removeAttr('selected');
					$("#mstatus").attr("disabled",true);
				}

				$("#mdeptType").val(data.data.deptType);
				if (data.data.deptType == '01') {
					$("#mdeptType").find("option[value='01']").attr("selected",true).siblings('option').removeAttr('selected');
				} else if (data.data.deptType == '02') {
					$("#mdeptType").find("option[value='02']").attr("selected",true).siblings('option').removeAttr('selected');
				}
				$("#mdesciption").val(data.data.description);//描述

				$("#misParentDept").val(data.data.isParentDept);//是否集团总机构
				if(data.data.isParentDept == "Y"){
					$("#misParentDept").find("option[value='Y']").attr("selected",true).siblings('option').removeAttr('selected');
					$("#jgglDialog #mparentName").attr("disabled","disabled");
					$(".required_mechanism").hide();
				}else{
					$("#misParentDept").find("option[value='N']").attr("selected",true).siblings('option').removeAttr('selected');
					$("#jgglDialog #mparentName").removeAttr("disabled");
					$(".required_mechanism").show();
				};
				if(data.status == "T"){
					window.top.location.href = '../../login.html';
					return;
				};
				if(str == '查看机构'){
					$('#checkForm').find('input,textarea,select').attr('disabled',true);
					$('#sjjg_control #mparentName').attr('disabled','disabled');
				};
			}

		});
	}
};
//默认查询显示列表
function initGrid(){
	window.defaultGridConfig = {
		ajaxGridOptions: {
			url:window.BASE_API_URL + "sysDept/querySysDeptPage.do",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true
		},
		prmNames:{
			"page":"pageIndex",
			"rows":"pageSize",
			"sord": ""
		},
		postData:{
			"deptId":$.trim($("#organId").val()),//组织机构
			"userId":$.trim($("#txt_yhid").val()), //登录账号
			"lockStatus": $.trim($("#select_sdbj option:selected").val()),//锁定标记
		},
		datatype:"json", //数据来源，本地数据
		mtype:"POST",//提交方式
		autowidth:false,//自动宽,
		width : $(window).width()*0.98,
		//height: $(window).height()- 320,
		height: $(window).height()* 0.806,
		colNames: colMap["colNames"],
		colModel: colMap["colModel"],
		rownumbers:true,//添加左侧行号
		cellEdit:false,//表格可编辑
		altRows:true,//隔行变色
		altclass:'GridClass',//隔行变色样式
		caption:"",
		loadui:"disable",
		loadonce: false,//排序
		sortorder: "desc",
		viewrecords: true,//是否在浏览导航栏显示记录总数
		rowNum:10,//每页显示记录数
		rowList:[10,20,30,50,100],
		multiselect: true,
		beforeRequest : function(){
			load();
		},
		beforeSelectRow: function(rowid, e) {
			var $myGrid = $(this),
				i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),
				cm = $myGrid.jqGrid('getGridParam', 'colModel');
			rowDta_jg = $("#jgglTable").jqGrid("getRowData", rowid);
			if(cm[i].index === 'cb'){
				return false;
			}else{
				return true;
			}
		},
		loadComplete: function(data){
			var grid = $("#jgglTable");
			var ids = grid.getDataIDs();
			for (var i = 0; i < ids.length; i++) {
				grid.setRowData ( ids[i], false, {height: 35} );
			}
			if(data.status == "T"){
				window.top.location.href = '../../login.html';
				return;
			}
		},
		gridComplete: function () {
			load("loading");
		},
		jsonReader:{
			id: "id",//设置返回参数中，表格ID的名字为blackId
			root: "data.rows",
			page:"data.pageIndex",
			total: function (obj) {
				if(obj.data == null){
					return false;
				}
				return Math.ceil(obj.data.total/obj.data.pageSize);
			},
			records:'data.total',
			repeatitems : true
		},
		pager:'#jgglPager'
	};

	$("#jgglTable").jqGrid(defaultGridConfig).trigger('reloadGrid');
	setTimeout(function(){
		updatePagerIcons($("#jgglTable"));//加载底部栏图标
	}, 0);
	resizeJqGrid("jgglTable")
}

/**
 * 查询
 * @return
 */
function queryAllJggl(){
	var layer = layui.layer;
	$("#jgglTable").setGridParam({
		beforeRequest : function(){
			layer.load(3);
		},
		datatype : "json",
		mtype:"POST",// 提交方式
		postData :getQueryMap(),
		gridComplete : function(){
			layer.closeAll("loading");
		},
	}).trigger("reloadGrid");
}
//获取查询参数，只提交有用数据
function getQueryMap() {
	var rtnMap = {};
	rtnMap["pageIndex"] = 1;
	rtnMap["pageSize"] = 10;
	rtnMap["sord"] = $("#jgglTable").jqGrid('getGridParam','sortorder');
	rtnMap["deptName"] = $.trim($("#organName").val());
	rtnMap["taxNo"] = $.trim($("#taxNo").val());
	rtnMap["deptCode"] = $.trim($("#deptCode").val());
	rtnMap["status"] = $.trim($("#status").val());
	return rtnMap;
}
/*
 * 保存数据
 */
function saveJggl(str,rowData){
	var checkResult = checkAisinoForm("checkForm");
	if(checkResult==false)
		return false;//校验不通过，根据各个框的错误信息进行修改
	//取值
	var mdeptCode = $("#mdeptCode").val();//机构编码
	var mdeptName = $("#mdeptName").val();//机构名称
	var mparentName = $("#mparentName").val();//上级机构名称
	var mparentId = $("#mparentId").val();//上级机构名称
	var mparentDeptCode = $("#mparentDeptCode").val();//上级机构编码
	var mdeptTel = $("#mdeptTel").val();//机构电话
	var mdeptManager = $("#mdeptManager").val();//机构负责人
	var mtaxNo = $("#mtaxNo").val();//纳税人识别号
	var mparentTaxNo = $("#mparentTaxNo").val();//所属纳税人识别号
	var minvoiceFlag = $("#minvoiceFlag").val();//开票标志
	var mstatus = $("#mstatus").val();//有效标志
	var mdeptType = $("#mdeptType").val();//机构属性
	var misParentDept = $("#misParentDept").val();//是否集团总机构
	var mdesciption = $("#mdesciption").val();//描述

	var rtnMap = {};
	rtnMap["deptCode"] = mdeptCode;
	rtnMap["deptName"] = mdeptName;
	rtnMap["parentName"] = mparentName;
	rtnMap["parentId"] = mparentId;
	rtnMap["parentDeptCode"] = mparentDeptCode;
	rtnMap["deptTel"] = mdeptTel;
	rtnMap["deptManager"] = mdeptManager;
	rtnMap["taxNo"] = mtaxNo;
	rtnMap["parentTaxNo"] = mparentTaxNo;
	rtnMap["invoiceFlag"] = minvoiceFlag;
	rtnMap["status"] = mstatus;
	rtnMap["deptType"] = mdeptType;
	rtnMap["isParentDept"] = misParentDept;
	rtnMap["description"] = mdesciption;

	if( str == "新增机构"){
		$.ajax({
			url:window.BASE_API_URL + "sysDept/addSysDept.do",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			data: rtnMap,
			beforeRequest : function(){
				layer.load(3);
			},
			success : function(data) {
				if (data.status == 'T') {
					window.top.location.href = '../../login.html';
					return;
				}
				if (data.status == 'F') {
					layuiAlert(data.msg,{btn: ['关闭']});
					return false;
				}
				layer.closeAll();
				layuiAlert(data.msg,{btn: ['关闭']});
				queryAllJggl();
			}
		});
		return true;
	}
	else{
		rtnMap["id"]= rowData.id;
		$.ajax({
			url : window.BASE_API_URL + "sysDept/editSysDept.do",
			type : 'post',
			dataType : 'json',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			data:rtnMap,
			beforeRequest : function(){
				layer.load(3);
			},
			success : function(data) {
				if (data.status == 'T') {
					window.top.location.href = '../../login.html';
					return;
				}

				if (data.status == 'F') {
					layuiAlert(data.msg,{btn: ['关闭']});
					return false;
				}
				layer.closeAll();
				layuiAlert(data.msg);
				queryAllJggl();
			}
		});
		return true;
	}

}

//注销
function deleteDialog() {
	layer.confirm('<big>您确定要注销这1条机构信息吗？</big>', {icon: 3, title: '<span style="color:#2679b5;"><big>提示信息</big></span>'},
		function (index) {
			$.ajax({
				type: 'POST',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				url: window.BASE_API_URL + "sysDept/cancelSysDept.do",
				data: {
					id: rowDta_jg.id
				},
				dataType: 'json',
				async: false,
				globle: false,
				beforeSend: function () {
					//msgId = layerMsg("删除外网地址信息中......");
				},
				beforeRequest: function () {
					layer.load(3);
				},
				success: function (data) {
					if (data.status == "T") {
						window.top.location.href = '../../login.html';
					}
					layer.msg(data.msg, {zIndex: layer.zIndex});
					queryAllJggl();
				}
			});
		}
	);
};

/**
 * 运行中提示
 */
function wwdzAdd(layer,layerId){
	layer.msg('运行中', {
		icon: 16,
		shade: 0.6,
		zIndex: layer.zIndex+100
	});
	//此处演示关闭
	setTimeout(function(){
		layer.close(layerId);
		//document.getElementById("wwdz_xz_form").reset();
		layer.closeAll('loading');
	}, 1000);
}
