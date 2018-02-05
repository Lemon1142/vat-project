//初始化
$(document).ready(function(){
	initGrid();//初始化界面
	initButton();//初始化按钮
	collapseLink();//修改折叠事件的绑定
//	initAisinoCheck("check_form");//初始化这个form的校验
});
var rowDta_kpd = null,
	cbtnArr = window.top.buttonAuth;
var colMap ={
	colNames : ['id','mac','销方税号','销方名称','操作','开票机号','开票点','开关状态','开票点编码','机器编号', '创建时间'],
	colModel : [
		{name:'id',index:'id', width:"5%", align:'center',hidden:true},
		{name:'mac',index:'mac', width:"2%", align:'center',hidden:true},
		{name:'sellerTaxNo',index:'sellerTaxNo', width:"16%", align:'left', sortable:false},
		{name:'sellerName',index:'sellerTaxNo', width:"14%",align:'left', sortable:false},
		{name: '操作', index:"operation", width:'10%', align:'left', sortable:false, formatter:function (value,gird,rows,state)
		{
			var mac = rows.mac;
			return "<span data-method='btn_look' class='operation_icon btn-ev fa fa-file-text " + ($.inArray('201050',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' ) + "' title='查看'></span>" +
				"<span data-method='btn_edit' class='operation_icon btn-ev fa fa-pencil-square-o " + ($.inArray('201030',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' )+"' title='编辑'></span>" +
				"<span data-method='btn_delete1' class=' operation_icon btn-ev fa fa-trash " + ($.inArray('201040',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' ) + "' title='删除'></span>" +
				"<span data-method='btn_upload' class=' operation_icon btn-ev fa fa-upload " + ( ( ($.inArray('201070',cbtnArr) != -1) && (!isEmpty(mac)) ) ? 'lock_show' : 'lock_hide' ) + "' title='推送'></span>"
			//"<span data-method='btn_upload' class=' operation_icon btn-ev fa fa-upload " + ( ( (cbtnArr.indexOf('201070') != -1) && (!isEmpty(mac)) ) ? '111' : '444' ) + "' title='推送'></span>"
		}
		},
		{name:'billingNo', index:'billingNo', width:"8%",align:'center', sortable:false},
		{name:'billingPointName', index:'billingPointName', width:"15%", align:'left', sortable:false},
		{name:'lockStatus', index:'lockStatus', width:'10%', align:'center', formatter:function (value,gird,rows,state)
		{
			if (value == "Y") {
				return "开启";
			}else{
				return "关闭";
			}
		}
		},
		{name:'billingPointNum', index:'billingPointNum', width:"10%", align:'left', sortable:false},
		{name:'machineNo', index:'machineNo', width:"10%", align:'center', sortable:false},
		{name:'createTime', index:'createTime', width:"14%", align:'center', sortable:true, sortorder:'desc', formatter:function (value,gird,rows,state)
		{return new Date(value).Format("yyyy-MM-dd hh:mm:ss")}
			//{return new Date(value).Format("yyyy-MM-dd")}
		}
	]
};
//初始化按钮
function initButton() {
	layui.use('layer', function () {
		var $ = layui.jquery,
			layer = layui.layer;
		var active = {
			//查询列表
			btn_query: function () {
				queryBillingPointInfoByPage();
			},
			//新增信息
//			$("#add").button().click(function() {
//				//如果部门没有加载完毕，则不能进行新增
//				if(window.top["GlobalBmList"][0].isInit == true){
//					alert("由于机构较多，正在初始化机构数据，请稍后重试！");
//					return;
//				}
//				open("新增机构","");
//			});
			btn_add: function () {
				emptyBillingPointInfo();
				var addKpdxx = layer.open({
					type: 1,
					title: "<big>开票点管理-新增</big>",
					area: ['800px','380px'],
					shade: [0.3, '#393D49'],
					shadeClose: false,
					maxmin: true,
					resize: true,//是否允许拉伸
					content: $('#xz_kpdgl'),//显示一个块里面的内容
					btn: ['保存', '取消'],//只是为了演示
					yes: function () {
						disableButton(true);
						if (saveBillingPonitInfo("A")) {
//        		          	runPrompt(layer, addKpdxx);
						}
					},
					btn2: function () {
						layer.closeAll();
						$("input[name='res']").click();
						clearAisinoError("checkForm");
					},
					cancel: function(){ //右上角关闭按钮
						emptyBillingPointInfo();
						clearAisinoError("checkForm");
					},
//        			closeBtn: 2,关闭按钮样式
//        			btnAlign: 'l',// 'c' 'r' 按钮排序方式
					zIndex: layer.zIndex, //控制层叠顺序
					success: function(layero,index){//弹层成功回调方法
						layer.setTop(layero); //置顶当前窗口
					}
				});

				initKpdglDialog("A");
			},
			btn_edit: function () {
				emptyBillingPointInfo();
				var editKpdxx = layer.open({
					type: 1,
					title: "<big>开票点管理-修改</big>",
					area: ['800px','380px'],
					shade: [0.3, '#393D49'],
					shadeClose: false,
					maxmin: true,
					resize: true,//是否允许拉伸
					content: $('#xz_kpdgl'),//显示一个块里面的内容
					btn: ['保存', '取消'],//只是为了演示
					yes: function () {
						disableButton(true);
						if (saveBillingPonitInfo("U")) {
							//runPrompt(layer, editKpdxx);
						}
					},
					btn2: function () {
						layer.closeAll();
						$("input[name='res']").click();
						clearAisinoError('checkForm');
					},
					cancel: function(){ //右上角关闭按钮
						emptyBillingPointInfo();
						clearAisinoError('checkForm');
					},
//            			closeBtn: 2,关闭按钮样式
//            			btnAlign: 'l',// 'c' 'r' 按钮排序方式
					zIndex: layer.zIndex, //控制层叠顺序
					success: function(layero,index){//弹层成功回调方法
						layer.setTop(layero); //置顶当前窗口
					}
				});
				initKpdglDialog("U");
			},
			//查看详情
			btn_look: function(){
				emptyBillingPointInfo();
				var detailKpdxx = layer.open({
					type: 1,
					title: "<big>开票点管理-查看</big>",
					area: ['800px','380px'],
					shade: [0.3, '#393D49'],
					shadeClose: false,
					maxmin: true,
					resize: true,//是否允许拉伸
					content: $('#xz_kpdgl'),//显示一个块里面的内容
					btn: ['关闭'] ,
					cancel: function(){ //右上角关闭按钮
						emptyBillingPointInfo();
					},
//            			closeBtn: 2,关闭按钮样式
//            			btnAlign: 'l',// 'c' 'r' 按钮排序方式
					zIndex: layer.zIndex, //控制层叠顺序
					success: function(layero,index){//弹层成功回调方法
						layer.setTop(layero); //置顶当前窗口
					}
				});
				initKpdglDialog("D");
			},
			//删除信息
			btn_delete: function(){
				var selectRows = $("#kpdgl_gridtable").jqGrid("getGridParam", "selarrrow");
				if(selectRows.length==0){
					//layer.msg('请选中一行，再进行删除！', {zIndex: layer.zIndex},{ btn: ['关闭']});
					layer.msg('请至少选中一行，再进行删除！', { btn: ['关闭']});
					return;
				}
				else{
					deleteBillingPointInfo("batch");
				}
			},
			btn_delete1: function(){
				deleteBillingPointInfo("single");
			},
			// 导出
			btn_expData: function () {
				var beforeUrl = window.BASE_API_URL + "billingPointInfo/exportTaxBillingPointInfoBefore.do",
					listUrl = window.BASE_API_URL + 'billingPointInfo/exportTaxBillingPointInfo.do';
				getExplorer(getQueryMap(),beforeUrl,listUrl);
			},
			// 推送
			btn_upload : function(){
				uploadSeller();
			}
		};
		$('.tab-cont').on('click','.btn-ev',function () {
			var othis = $(this), method = othis.data('method');
			active[method] ? active[method].call(this, othis) : '';
		});
		$('#LAY_demo .layui-btn').on('click', function () {
			var othis = $(this), method = othis.data('method');
			if($(this).hasClass('layui-btn-disabled')){
				return;
			}
			active[method] ? active[method].call(this, othis) : '';
		});
		layui.use('laydate', function(){
			var laydate = layui.laydate;
			lay('.bill_saletime').each(function(){
				laydate.render({
					elem: this,
					type: 'datetime',
					range: "~",
					done: function(value, date){
						$("#invoiceTime").attr("title",value);
					}
				});
			});
		});
	});
	//注意：选项卡 依赖 element 模块，否则无法进行功能性操作
	layui.use('element', function(){
		var element = layui.element;
		element.on('tab(test)', function(data){
			uploadInit();
		})
	});
}

//默认查询显示列表
function initGrid(){
	window.defaultGridConfig = {
		ajaxGridOptions: {
			url: window.BASE_API_URL + "billingPointInfo/queryTaxBillingPointInfoPage.do",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true
		},
		prmNames:{
			"page":"pageIndex",
			"rows":"pageSize",
			//"order":"sord"
		},
		postData:{
			"sellerTaxNo":$.trim($("#searchForm #sellerTaxNo").val()),//组织机构
			"sellerName":$.trim($("#searchForm #sellerName").val()), //登录账号
			"billingPointName":$.trim($("#searchForm #billingPointName").val()), //登录账号
			"lockStatus": $.trim($("#searchForm #lockStatus option:selected").val())//锁定标记
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
		sortorder : 'desc',
		loadui:"disable",
		viewrecords: true,//是否在浏览导航栏显示记录总数
		rowNum:10,//每页显示记录数
		rowList:[10,20,30,50,100],
		multiselect: true,
		beforeRequest: function () {
			//loadBill();
			load();
		},
		beforeSelectRow: function(rowid, e) {
			var $myGrid = $(this),
				i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),
				cm = $myGrid.jqGrid('getGridParam', 'colModel');
			rowDta_kpd = $("#kpdgl_gridtable").jqGrid("getRowData", rowid);
			if(cm[i].index === 'operation'){
				return false;
			}else{
				return true;
			}
		},
		loadComplete: function(data){
			if(data.status == "T"){
				window.top.location.href = '../../login.html';
			}
			var grid = $("#kpdgl_gridtable");
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
		pager:'#kpdgl_pager'
	};

	$("#kpdgl_gridtable").jqGrid(defaultGridConfig).trigger('reloadGrid');
	setTimeout(function(){
		updatePagerIcons($("#kpdgl_gridtable"));//加载底部栏图标
	}, 0);
	resizeJqGrid("kpdgl_gridtable");
}
//查询列表
function queryBillingPointInfoByPage(){
	$("#kpdgl_gridtable").setGridParam({
		beforeRequest : function(){ layer.load(3);},
		page : 1,
		url : window.BASE_API_URL + "billingPointInfo/queryTaxBillingPointInfoPage.do",
		type: "post",
		datatype : "json",
		postData : getQueryMap(),
		gridComplete : function(){
//			completeMethod();
			layer.closeAll("loading");
		}
	}).trigger("reloadGrid")
}
//保存数据
function saveBillingPonitInfo(type) {
//    var checkResult = checkAisinoForm("checkForm");
//    //校验不通过，根据各个框的错误信息进行修改
//    if (checkResult == false)
//    {
//    	return false;
//    }

	var msg = "新增";
	var rtnMap = {};
	rtnMap["deptId"] = $.trim($("#xz_kpdgl #deptId").val());//机构id
	rtnMap["sellerTaxNo"] = $.trim($("#xz_kpdgl #sellerTaxNo").val());//机构id
	rtnMap["billingNo"] = $.trim($("#xz_kpdgl #billingNo").val());//销方名称
	rtnMap["billingPointNum"] = $.trim($("#xz_kpdgl #billingPointNum").val());//开票点编号
	rtnMap["billingPointName"] = $.trim($("#xz_kpdgl #billingPointName").val());//开票点
	rtnMap["machineNo"] = $.trim($("#xz_kpdgl #machineNo").val());//所属行业
	rtnMap["lockStatus"] = $.trim($("#xz_kpdgl #lockStatus option:selected").val());//开关状态
	rtnMap["mac"] = $.trim($("#xz_kpdgl #macEquipment option:selected").val());//mac地址

	if(!checkFormValue()){
		disableButton(false);
		return;
	}
	var url = window.BASE_API_URL + "billingPointInfo/addTaxBillingPointInfo.do";
	if (type == "U") {
		msg = "修改";
		rtnMap["id"] = rowDta_kpd.id;
		url = window.BASE_API_URL + "billingPointInfo/editTaxBillingPointInfo.do";
	};
	$.ajax({
		url : url,
		data : rtnMap,
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
			$("#bgFilter").css("display", "block");
			$("#loadingProgress").css("display", "block");
		},
		success: function(data) {
			if(data.status=="S"){
				layer.closeAll();
				layer.msg(msg + '开票点信息成功!', {zIndex: layer.zIndex});
				queryBillingPointInfoByPage();
			}else if (data.status=="T") {
				window.top.location.href = "../../login.html";
			}else if (data.status=="F") {
				disableButton(false);
				layuiAlert(data.msg,{btn: ['关闭']});
			}
		},
		complete: function() {
			$("#bgFilter").css("display", "none");
			$("#loadingProgress").css("display", "none");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.msg('操作失败请联系管理员!', {zIndex: layer.zIndex});
			disableButton(false);
		}
	});
	return true;
}
//删除
function deleteBillingPointInfo(type){
	var idArr = [] ;
	if(type == "batch"){
		idArr = $("#kpdgl_gridtable").jqGrid("getGridParam", "selarrrow");
	}else{
		idArr.push(rowDta_kpd.id);
	}
	layer.confirm("确定要删除这"+idArr.length+"条数据吗?", {icon: 3, title:'删除开票点信息提示'},
		function(index) {
			$(this).attr("disabled", true);
			$.ajax({
				type:'POST',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				url: window.BASE_API_URL + "billingPointInfo/deleteTaxBillingPointInfo.do",
				data: {id: idArr},
				dataType:'json',
				async: false,
				globle: false,
				error: function(){
					$(this).removeAttr("disabled");
					layer.msg('数据处理错误！', {zIndex: layer.zIndex});
					return false;
				},
				beforeSend: function(){
					$("#bgFilter").css("display", "block");
					$("#loadingProgress").css("display", "block");
				},
				success: function(data){
					if (data.status == "S"){
						layer.msg('删除开票点信息成功!', {zIndex: layer.zIndex});
						$(this).removeAttr("disabled");
						queryBillingPointInfoByPage();
					}else if (data.status=="T") {
						window.top.location.href = "../../login.html";
					}else{
						layer.msg(data.msg);
						$(this).removeAttr("disabled");
					}
				},

				complete: function() {
					$("#bgFilter").css("display", "none");
					$("#loadingProgress").css("display", "none");
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg('操作失败请联系管理员!', {zIndex: layer.zIndex});
					$(this).removeAttr("disabled");
				}
			});
		});
}
//导出销方信息
function exportBillingPointInfoByPage(){

}
//初始化
function initKpdglDialog(type) {
	emptyBillingPointInfo();
	if(type == "U" || type == "D"){
		$.ajax({
			url : window.BASE_API_URL + "billingPointInfo/queryTaxBillingPointInfoDetail.do",
			data : getBillingPointInfoId(),
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
				$("#bgFilter").css("display", "block");
				$("#loadingProgress").css("display", "block");
			},
			success: function(data) {
				if (data.status == "S"){
					var rowData = data.data;
					$("#xz_kpdgl #deptId").val(rowData.deptId);//机构id
					$("#xz_kpdgl #deptName").val(rowData.deptName);//机构名称
					$("#xz_kpdgl #id").val(rowData.id);//开票点ID
					$("#xz_kpdgl #sellerTaxNo").val(rowData.sellerTaxNo);//销方税号
					if(!isEmpty(rowData.sellerTaxNo)){
						$("#xz_kpdgl #macEquipment").html("<option value='' selected>"+"--请选择--</option>");
						$.ajax({
							url: window.BASE_API_URL + "billingPointInfo/queryMacList.do",
							type: 'post',
							xhrFields: {
								withCredentials: true
							},
							crossDomain: true,
							dataType: 'json',
							data: {
								'sellerTaxNo': rowData.sellerTaxNo
							},
							success: function (data) {
								if(data.status == 'T'){
									window.top.location.href = '../../../login.html';
									return;
								}else if(data.status == 'S'){
									if(!isEmpty(data.data)){
										$.each(data.data, function (i, item) {
											$("#macEquipment").append("<option value=" + item + ">" + item + "</option> ");
										});
										$("#macEquipment").val(rowData.mac);
										$("#macEquipment option[value='"+rowData.mac+"']").prop("selected","selected");
									}
								}else{
									layer.msg(data.msg,{zIndex: layer.zIndex});
									return;
								}
							}
						});
					};
					$("#xz_kpdgl #sellerName").val(rowData.sellerName);//销方名称
					$("#xz_kpdgl #billingNo").val(rowData.billingNo);//开票机号
					$("#xz_kpdgl #machineNo").val(rowData.machineNo);//机器编号
					$("#xz_kpdgl #billingPointNum").val(rowData.billingPointNum);//开票点编号
					$("#xz_kpdgl #billingPointName").val(rowData.billingPointName);//开票点名称
					$("#xz_kpdgl #lockStatus").val(rowData.lockStatus);
					$("#xz_kpdgl #lockStatus").find("option[value='"+rowData.lockStatus+"']").attr("selected",true); //有效标志
					if(rowData.mac){
						$("#macEquipment").val(rowData.mac);
						$("#macEquipment").find("option[value='"+rowData.mac+"']").attr("selected",true); //mac地址
					}else{
						$("#macEquipment").val('');
						$("#macEquipment").find("option[value='']").attr("selected",true); //mac地址
					}


				}else if (data.status=="T") {
					window.top.location.href = "../../login.html";
				}else{
					layer.msg(data.msg);
				}
			},
			complete: function() {
				$("#bgFilter").css("display", "none");
				$("#loadingProgress").css("display", "none");
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg('操作失败请联系管理员!', {zIndex: layer.zIndex});
			}
		});
	}else{
		emptyBillingPointInfo();
	}
	setIsDisable(type);

}

//获取查询参数，只提交有用数据
function getQueryMap() {
	var rtnMap = {};
	rtnMap["pageIndex"] = 1;
	rtnMap["pageSize"] = 10;
	rtnMap["sord"] = $("#kpdgl_gridtable").jqGrid('getGridParam','sortorder');
	rtnMap["sellerTaxNo"] = $.trim($("#searchForm #sellerTaxNo").val());
	rtnMap["billingPointName"] = $.trim($("#searchForm #billingPointName").val());
	rtnMap["lockStatus"] = $.trim($("#searchForm #lockStatus option:selected").val());
	return rtnMap;
}

//获取销方ID
function getBillingPointInfoId() {
	var map = {};
	map["id"]=rowDta_kpd.id;
	return map;
}

//清空表单数据
function emptyBillingPointInfo(){
	$("#xz_kpdgl #deptId").val("");//机构id
	$("#xz_kpdgl #deptName").val("");//机构名称
	$("#xz_kpdgl #deptName").removeAttr("disabled");//机构名称
	$("#xz_kpdgl #billingNo").removeAttr("disabled");//开票机号
	$("#xz_kpdgl #id").val("");//开票点ID
	$("#xz_kpdgl #sellerTaxNo").val("");//销方名称
	$("#xz_kpdgl #sellerName").val("");//销方名称
	$("#xz_kpdgl #billingNo").val("");//开票点编号
	$("#xz_kpdgl #billingPointName").val("");//开票点
	$("#xz_kpdgl #billingPointNum").val("");//开票点编号
	$("#xz_kpdgl #machineNo").val("");//机器编号
	$("#xz_kpdgl #lockStatus").val("Y");
	$("#xz_kpdgl #lockStatus").find("option[value='Y']").attr("selected",true); //有效标志
	$("#xz_kpdgl #macEquipment").html("<option value='' selected>"+"--请选择--</option>"); // Mac地址
//	$("#xz_kpdgl #lockStatus input:radio[value=1]").prop("checked","true").parent().siblings().children().removeAttr("checked");
}
//禁编辑
function setIsDisable(type){
	$("#checkForm *").attr("readonly", false);
	$("#xz_kpdgl #sellerTaxNo").attr("disabled", true);
	$("#xz_kpdgl #sellerName").attr("disabled", true);
	$("#xz_kpdgl #lockStatus").attr("disabled", true);

	if(type=="U"){
		$("#xz_kpdgl #deptId").attr("disabled", true);
		$("#xz_kpdgl #deptName").attr("disabled", true);
		$("#xz_kpdgl #sellerName").attr("disabled", true);
		$("#xz_kpdgl #billingNo").attr("disabled", true);
//		$("#xz_kpdgl #billingNo").attr("disabled", true);
	}
	if(type=="D"){
		$("#checkForm *").attr("readonly", "readonly");
	}
}
function checkFormValue(){
	var deptId = $("#xz_kpdgl #deptId");//机构id
	var deptName = $("#xz_kpdgl #deptName");//机构id
	var sellerTaxNo = $("#xz_kpdgl #sellerTaxNo");//销方税号
	var billingNo = $("#xz_kpdgl #billingNo");//开票机号
	var billingPointNum = $("#xz_kpdgl #billingPointNum");//开票点编号
	var billingPointName = $("#xz_kpdgl #billingPointName");//开票点
	var machineNo= $("#xz_kpdgl #machineNo");//机器编号
	var lockStatus = $("#xz_kpdgl #lockStatus option:selected");//开关状态

	var deptIdVal = $.trim(deptId.val());
	var deptNameVal = $.trim(deptName.val());
	var sellerTaxNoVal = $.trim(sellerTaxNo.val());
	var billingNoVal = $.trim(billingNo.val());
	var billingPointNumVal = $.trim(billingPointNum.val());
	var billingPointNameVal = $.trim(billingPointName.val());
	var machineNoVal = $.trim(machineNo.val());
	var lockStatusVal = $.trim(lockStatus.val());

	if(isEmpty(deptIdVal)){
		alert('jgg');
		layer.msg('请选择所属机构！', {zIndex: layer.zIndex});
		deptId.focus();
		return false;
	}
	if(isEmpty(sellerTaxNoVal)){
		layer.msg('销方税号不能为空，请先编辑销方信息！', {zIndex: layer.zIndex});
		return false;
	}
	if(isEmpty(billingNoVal)){
		layer.msg('请输入1-2位开票机号，仅支持数字！', {zIndex: layer.zIndex});
		billingNo.focus();
		return false;
	}
	if(isEmpty(billingPointNameVal)){
		layer.msg('请输入1-200位开票点！', {zIndex: layer.zIndex});
		billingPointName.focus();
		return false;
	}
	if(isEmpty(billingPointNumVal)){
		layer.msg('请输入开票点编号，仅支持数字！', {zIndex: layer.zIndex});
		billingPointNum.focus();
		return false;
	}
	return true;
}
//机构变更回调函数
function callbackMethod(deptId){
	$("#xz_kpdgl #sellerName").val("");
	var rtnMap = {};
	rtnMap["deptId"] = deptId;//机构id
	$.ajax({
		url : window.BASE_API_URL +"sellerInfo/querySellerInfoByDeptId.do",
		data : rtnMap,
		type : 'post',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		dataType : 'json',
		//data: This.getQueryMap(),
		success : function(data) {
			if (data.status == "S"){
				var data = data.data.sellerInfo;
				if(isEmpty(data.sellerTaxNo)){
					layer.msg('该机构销方信息为空，请先编辑销方信息！', {zIndex: layer.zIndex});
					$("#macEquipment").html("<option value='' selected>"+"--请选择--</option>");
					return;
				}else{
					$.ajax({
						url: window.BASE_API_URL + "billingPointInfo/queryMacList.do",
						type: 'post',
						xhrFields: {
							withCredentials: true
						},
						crossDomain: true,
						dataType: 'json',
						data: {
							'sellerTaxNo': data.sellerTaxNo
						},
						success: function (data) {
							if(data.status == 'T'){
								window.top.location.href = '../../../login.html';
								return;
							}else if(data.status == 'S'){
								if(!isEmpty(data.data)){
									$.each(data.data, function (i, item) {
										$("#macEquipment").append("<option value=" + item + ">" + item + "</option> ");
									});
								}
							}else{
								layer.msg(data.msg,{zIndex: layer.zIndex});
								return;
							}
						}
					});
					$("#xz_kpdgl #sellerName").val(data.sellerName);
					$("#xz_kpdgl #sellerTaxNo").val(data.sellerTaxNo);
				}
			}else if (data.status=="T") {
				window.top.location.href = "../../login.html";
			}else{
				layer.msg(data.msg);
			}
		}
	});
}
function disableButton(flag){
	if(flag){
		$(".layui-layer-btn0").css('display','none');
		$(".layui-layer-btn0").after('<span><a class="layui-layer-btn0">保存</a></span>');
	}else{
		$(".layui-layer-btn").find("span").remove();
		$(".layui-layer-btn0").css('display','inline-block');
	}
}
// 推送初始化
function uploadInit(){
	$("#xz_sellerUpload #invoiceTime").val("");//开票日期
	$("#xz_sellerUpload .pushInvoiceCode").val("");//发票编码
	$("#xz_sellerUpload #pushInvoiceNumber").val("");//发票号码
	//$("#xz_sellerUpload #push_invoiceCode").val("");//发票号码
	$("#xz_sellerUpload #invoiceNumberStrart").val("");//发票号码起
	$("#xz_sellerUpload #invoiceNumberEnd").val("");//发票号码止
}
// 销方推送
function uploadSeller(){
	uploadInit();
	var uploadSeller = layer.open({
		type: 1,
		title: "<big>终端发票信息同步</big>",
		area: ['800px','460px'],
		shade: [0.3, '#393D49'],
		shadeClose: false,
		maxmin: true,
		resize: true,//是否允许拉伸
		content: $('#xz_sellerUpload'),//显示一个块里面的内容
		btn: ['获取', '取消'] ,
		//closeBtn: 2,关闭按钮样式
		//btnAlign: 'l',// 'c' 'r' 按钮排序方式
		zIndex: layer.zIndex,
		yes: function(){
			saveBillgl()//保存
		},
		success: function(layero,index){
			layer.setTop(layero);
		}
	});
};
var invoicePrintUrl = window.BASE_API_URL + "billingPointInfo/pushInvoiceFrameInfo.do";
function saveBillgl(){
	var billMap = {},num;
	var time = $.trim( $("#xz_sellerUpload #invoiceTime").val()),
		code = $.trim( $("#xz_sellerUpload #pushInvoiceCode").val() ),
		number = $.trim(  $("#xz_sellerUpload #pushInvoiceNumber").val() ),
		codePage = $.trim( $("#xz_sellerUpload #push_invoiceCode").val() ),
		start = $.trim( $("#xz_sellerUpload #invoiceNumberStrart").val()),
		end = $.trim( $("#xz_sellerUpload #invoiceNumberEnd").val()),
		reg = /^\+?[0-9][0-9]*$/;
	billMap["mac"] = rowDta_kpd.mac; // mac地址
	$("#xz_sellerUpload .layui-tab-title li").each(function () {
		if( $(this).hasClass("layui-this") ){
			num = $(this).attr('lay-id');
			if(num == '1'){
				console.log(code);
				if(code === ""){
					layer.msg('请输入有效的发票代码！', {zIndex: layer.zIndex});
					return false;
				}else if(!reg.test(code)){
					layer.msg('输入的发票代码应为数字！', {zIndex: layer.zIndex});
					return false;
				}else if(code.length > 12){
					layer.msg('输入的发票代码长度应该小于等于12位！', {zIndex: layer.zIndex});
					return false;
				};
				if(number === "" ){
					layer.msg('请输入有效的发票号码！', {zIndex: layer.zIndex});
					return false;
				} else if( !reg.test(number) ){
					layer.msg('输入的发票号码应为数字！', {zIndex: layer.zIndex});
					return false;
				}else if(number.length != 8){
					layer.msg('输入的发票号码长度应为8位！', {zIndex: layer.zIndex});
					return false;
				};
				billMap["invoiceCode"] = code ; // 发票代码
				billMap["invoiceNo"] = number ; // 发票号码
			}
			else if(num == '2'){
				if(codePage === ""){
					layer.msg('请输入有效的发票代码！', {zIndex: layer.zIndex});
					return false;
				}else if(!reg.test(codePage)){
					layer.msg('输入的发票代码应为数字！', {zIndex: layer.zIndex});
					return false;
				}else if(codePage.length > 12){
					layer.msg('输入的发票代码长度应该小于等于12位！', {zIndex: layer.zIndex});
					return false;
				};
				if(start === "" ){
					layer.msg('请输入有效的发票号码起！', {zIndex: layer.zIndex});
					return false;
				} else if( !reg.test(start) ){
					layer.msg('输入的发票号码起应为数字！', {zIndex: layer.zIndex});
					return false;
				}else if(start.length != 8){
					layer.msg('输入的发票号码长度应为8位！', {zIndex: layer.zIndex});
					return false;
				};
				if(end === "" ){
					layer.msg('请输入有效的发票号码止！', {zIndex: layer.zIndex});
					return false;
				} else if( !reg.test(end) ){
					layer.msg('输入的发票号码止应为数字！', {zIndex: layer.zIndex});
					return false;
				}else if(end.length != 8){
					layer.msg('输入的发票号码长度应为8位！', {zIndex: layer.zIndex});
					return false;
				};
				console.log(Number(start));
				console.log(Number(end));
				if(Number(start) - Number(end) > 0){
					layer.msg('输入的起始发票号码应小于截止发票号码！', {zIndex: layer.zIndex});
					return false;
				}
				billMap["invoiceCode"] = codePage ; // 发票代码
				billMap["invoiceNoStart"] = start ; // 发票号码起
				billMap["invoiceNoEnd"] = end ; // 发票号码止
			}
			else{
				if (time == "") {
					layer.msg('请输入有效的开票日期！', {zIndex: layer.zIndex});
					return false;
				};
				billMap["invoicePrintDateStr"] = time ; // 开票日期
			};
			billMap["getType"] = num; // 推送类型
			billMap["sellerTaxNo"] = rowDta_kpd.sellerTaxNo; // 推送类型
			$.ajax({
				url: invoicePrintUrl,
				data: billMap,
				type: 'post',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				dataType: 'json',
				success: function (data) {
					if(data.status=="S"){
						layer.closeAll();
						ajaxSuccessAlert('获取发票指令推送成功，请在销项发票查询列表查看!');
					}else if (data.status=="T") {
						window.top.location.href = "../../login.html";
					}else if (data.status=="F") {
						disableButton(false);
						layuiAlert(data.msg,{btn: ['关闭']});
					}
				}
			})
		}
	})
}
