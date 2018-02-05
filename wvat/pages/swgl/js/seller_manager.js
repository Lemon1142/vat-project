//初始化
var industrys = null;
var rowDta_xf = null,cbtnArr = window.top.buttonAuth;
$(document).ready(function(){
	initIndustryInfo("searchForm");
	initGrid();//初始化界面
	initButton();//初始化按钮
//	initDialog();
	initAisinoCheck("checkForm");//初始化这个form的校验
	collapseLink();//修改折叠事件的绑定
});
var colMap ={
    colNames : ['id','销方税号','销方名称','所属机构Id','所属机构名称','操作','企业法人','企业经营地址','企业注册地址','联系电话','开户银行', '银行账号', '所属行业','有效标志','创建时间'],
    colModel : [
        {name:'id', index:'id', width:"", align:'center', sortable:false, hidden:true},
        {name:'sellerTaxNo', index:'sellerTaxNo', width:"13%", align:'left', sortable:false},
        {name:'sellerName', index:'sellerName', width:"13%", align:'left', sortable:false},
        {name:'deptId', index:'deptId', width:"", align:'center', sortable:false, hidden:true},
        {name:'deptName', index:'deptName', width:"10%", align:'left', sortable:false},
	    {name:'操作', index:"operation", width:'8%', align:'center', sortable:false, formatter:function (value,gird,rows,state)
        	{
	    		return "<span data-method='btn_look' class='operation_icon btn-ev fa fa-file-text " + ($.inArray('202050',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' ) + " ' title='查看'></span>" +
				   	   "<span data-method='btn_edit' class='operation_icon btn-ev fa fa-pencil-square-o " + ($.inArray('202030',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' ) + " ' title='编辑'></span>" +
				       "<span data-method='btn_delete' class='operation_icon btn-ev fa fa-trash " + ($.inArray('202040',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' ) + " ' title='删除'></span>"
	        }
	    },
        {name:'legalPerson', index:'legalPerson', width:"8%", align:'left', sortable:false},
        {name:'businessAddress', index:'businessAddress', width:"14%", align:'left', sortable:false},
        {name:'sellerRegisteredAddress', index:'sellerRegisteredAddress', width:"13%", align:'left', sortable:false},
        {name:'telephone', index:'telephone', width:"10%", align:'left', sortable:false},
        {name:'sellerBank', index:'sellerBank', width:"12%", align:'center', sortable:false},
        {name:'sellerBankAccount', index:'sellerBankAccount', width:"13%", align:'left', sortable:false},
        {name:'industry', index:'industry', width:"12%", align:'center', sortable:false, formatter: function (value,gird,rows,state)
        	{
        		var codeName="";
	        	$.each(industrys, function(i,item){
					if(item.code == value){
	    				codeName = item.codeName;
	    				return;
					}
				});
	        	return codeName;
        	}
        },
		{name:'status', index:'status', width:'8%', align:'center', sortable:false, formatter: function (value,gird,rows,state) 
        	{
				if (value == '0') {
					return "无效";
				}else{
					return "有效";
				}
			}
        },
        {name:'createTime', index:'createTime', width:"15%", align:'center', sortable:true, sortorder:'desc', formatter: function (value,gird,rows,state)
        	{return new Date(value).Format("yyyy-MM-dd hh:mm:ss")}
        }
    ]
};

//初始化按钮
function initButton() {
    layui.use('layer', function () {
		var layer = layui.layer;
        var active = {
            //查询列表
            btn_query: function () {
            	queryAllSellerInfoByPage();
            },
            //新增信息
            btn_add: function () {
				emptySellerInfo();
				var addXfxx = layer.open({
        			type: 1,
        			title: "<big>销方管理-新增</big>",
        			area: ['800px','420px'],
        			shade: [0.3, '#393D49'],
        			shadeClose: false,
        			maxmin: true,
        			resize: true,//是否允许拉伸
        			content: $('#xz_xfgl'),//显示一个块里面的内容
        			btn: ['保存', '取消'],//只是为了演示
        			beforeRequest : function(){ layer.load(3);},
        		    yes: function () {
        				disableButton(true);
        		    	if (saveSellerInfo("A")) {
//        		          	runPrompt(layer, addXfxx);
        		        }
        		    },
        		    btn2: function () {
        		    	layer.closeAll();
        		    	$("input[name='res']").click();
						clearAisinoError('checkForm');
        		    },
        			cancel: function(){ //右上角关闭按钮
        				clearAisinoError('checkForm');
        			},
//        			closeBtn: 2,关闭按钮样式
//        			btnAlign: 'l',// 'c' 'r' 按钮排序方式
        			zIndex: layer.zIndex, //控制层叠顺序
        			success: function(layero,index){//弹层成功回调方法
        				layer.setTop(layero); //置顶当前窗口
        			}
        		});
        		
            	initXfglDialog("A");
            },
            //编辑信息
            btn_edit: function () {
				emptySellerInfo();
            	var editXfxx = layer.open({
        			type: 1,
        			title: "<big>销方管理-修改</big>",
        			area: ['800px','420px'],
        			shade: [0.3, '#393D49'],
        			shadeClose: false,
        			maxmin: true,
        			resize: true,//是否允许拉伸
        			content: $('#xz_xfgl'),//显示一个块里面的内容
        			btn: ['保存', '取消'],//只是为了演示
        		    yes: function () {
        				disableButton(true);
        		    	if (saveSellerInfo("U")) {
//        		          	runPrompt(layer, editXfxx);
        		        }
        		    },
        		    btn2: function () {
        		        layer.closeAll();
        		        $("input[name='res']").click();
  						clearAisinoError('checkForm');
        		    },
        			cancel: function(){ //右上角关闭按钮
						clearAisinoError('checkForm');
        			},
//            			closeBtn: 2,关闭按钮样式
//            			btnAlign: 'l',// 'c' 'r' 按钮排序方式
        			zIndex: layer.zIndex, //控制层叠顺序
        			success: function(layero,index){//弹层成功回调方法
        				layer.setTop(layero); //置顶当前窗口
        			}
        		});
            	initXfglDialog("U");
            },
			//查看详情
			btn_look: function(){
				emptySellerInfo();
            	var detailXfxx = layer.open({
        			type: 1,
        			title: "<big>销方管理-查看</big>",
        			area: ['800px','420px'],
        			shade: [0.3, '#393D49'],
        			shadeClose: false,
        			maxmin: true,
        			resize: true,//是否允许拉伸
        			content: $('#xz_xfgl'),//显示一个块里面的内容
        			btn: ['<big>关闭</big>'] ,
        			cancel: function(){ //右上角关闭按钮
        			},
//            			closeBtn: 2,关闭按钮样式
//            			btnAlign: 'l',// 'c' 'r' 按钮排序方式
        			zIndex: layer.zIndex, //控制层叠顺序
        			success: function(layero,index){//弹层成功回调方法
        				layer.setTop(layero); //置顶当前窗口
        			}
        		});
            	initXfglDialog("D");
			},
			//删除信息
			btn_delete: function(){
				deleteSellerInfo(layer);
			},
			// 导出
			btn_expData: function () {
				var beforeUrl = window.BASE_API_URL + "sellerInfo/exportTaxSellerInfoBefore.do",
					listUrl = window.BASE_API_URL + 'sellerInfo/exportTaxSellerInfo.do';
				getExplorer(getQueryMap(),beforeUrl,listUrl);
			}
        };
    	$('.tab-cont').on('click','.btn-ev',function () {
			var othis = $(this), method = othis.data('method');
			active[method] ? active[method].call(this, othis) : '';
		});
        $('#LAY_demo .layui-btn').on('click', function () {
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });
    });
}

//默认查询显示列表
function initGrid(){
	//window.defaultGridConfig = {
	$("#xfgl_gridtable").jqGrid ({
		ajaxGridOptions: {
			url: window.BASE_API_URL + "sellerInfo/queryTaxSellerInfoPage.do",
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
//		    "sellerName" : $.trim($("#searchForm #search_sellerName").val()),
//		    "sellerTaxNo" : $.trim($("#searchForm #search_sellerTaxNo").val()),
//		    "industry" : $.trim($("#searchForm #search_industry option:selected").val()),
//		    "status" : $.trim($("#searchForm #search_status option:selected").val()),
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
		sortorder: 'desc',
        caption:"",
        loadui:"disable",
        viewrecords: true,//是否在浏览导航栏显示记录总数
        rowNum:10,//每页显示记录数
	   	rowList:[10,20,30,50,100],
	   	loadui:"disable",
        multiselect: false,
		beforeRequest: function () {
			load();
		},
        beforeSelectRow: function(rowid, e) {
			var $myGrid = $(this),
				i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),
				cm = $myGrid.jqGrid('getGridParam', 'colModel');
			rowDta_xf = $("#xfgl_gridtable").jqGrid("getRowData", rowid);
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
			var grid = $("#xfgl_gridtable");
			var ids = grid.getDataIDs();
			for (var i = 0; i < ids.length; i++) {
				grid.setRowData ( ids[i], false, {height: 35} );
			}
		},
		gridComplete: function () {
			//Load();
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
        pager:'#xfgl_pager'
	}).trigger('reloadGrid');
	resizeJqGrid("xfgl_gridtable");
	//$("#xfgl_gridtable").jqGrid(defaultGridConfig).trigger('reloadGrid');
	setTimeout(function(){
		updatePagerIcons($("#xfgl_gridtable"));//加载底部栏图标
	}, 0);
}
//查询列表
function queryAllSellerInfoByPage(){
	$("#xfgl_gridtable").setGridParam({
		beforeRequest : function(){ layer.load(3);},
		page : 1,
		//url : window.BASE_API_URL + "sellerInfo/queryTaxSellerInfoPage.do",
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
function saveSellerInfo(type) {
//  var checkResult = checkAisinoForm("checkForm");
//  //校验不通过，根据各个框的错误信息进行修改
//  if (checkResult == false)
//  {
//  	return false;
//  }   
	//取值
	var msg = "新增";
	var rtnMap = {};
//	rtnMap["deptId"] = $.trim($("#xz_xfgl .search_user .organId").val());//机构id
	rtnMap["deptId"] = $.trim($("#xz_xfgl #deptId").val());//机构id
    rtnMap["industry"] = $.trim($("#xz_xfgl #industry option:selected").val());//所属行业
    rtnMap["sellerName"] = $.trim($("#xz_xfgl #sellerName").val());//销方名称
    rtnMap["sellerTaxNo"] = $.trim($("#xz_xfgl #sellerTaxNo").val());//销方税号
    rtnMap["legalPerson"] = $.trim($("#xz_xfgl #legalPerson").val());//企业法人
    rtnMap["businessAddress"] = $.trim($("#xz_xfgl #businessAddress").val());//企业经营地址
    rtnMap["sellerRegisteredAddress"] = $.trim($("#xz_xfgl #sellerRegisteredAddress").val());//企业注册地址
    rtnMap["telephone"] = $.trim($("#xz_xfgl #telephone").val());//联系电话
    rtnMap["sellerBank"] = $.trim($("#xz_xfgl #sellerBank").val());//销方银行
    rtnMap["sellerBankAccount"] = $.trim($("#xz_xfgl #sellerBankAccount").val());//销方银行账号
    rtnMap["status"] = $.trim($("#xz_xfgl #status option:selected").val());    
	if(!checkFormValue()){
		disableButton(false);
		return;
	}

    var url = window.BASE_API_URL + "sellerInfo/addTaxSellerInfo.do";
    if (type == "U") {
    	msg = "修改";
    	rtnMap["id"] = rowDta_xf.id;
    	url = window.BASE_API_URL + "sellerInfo/editTaxSellerInfo.do";
    }
//    var bmjc = bmjc_0;//上级机构级次比机构树中最高的级次还高时，当前机构的级次仍为初值
//    var fplx_jg = $.trim($("#bm_id").val());
//    //获取部门数组
//    var bcjsj = window.top["GlobalBmList"];
//    for (var i in bcjsj) {
//        if (bcjsj[i].id == fplx_jg) {
//            bmjc = bcjsj[i].bmjc * 1 + 1;
//            break;
//        }
//    }
//    if (Number(bmjc) > jgjcsz) {
//        layer.msg('机构级次超限，请更换上级机构！', {zIndex: layer.zIndex + 1});//层级要比第二层弹框高
//        return false;
//    }

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
				layer.msg(msg + '销方信息成功!', {zIndex: layer.zIndex});
				queryAllSellerInfoByPage();
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
function deleteSellerInfo(layer){
	layer.confirm('<big>您确定要删除这条销信息吗？</big>', {icon: 3, title:'<span style="color:#2679b5;"><big>提示信息</big></span>'},
	function(index){
		$.ajax({
			type:'POST',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			url: window.BASE_API_URL + "sellerInfo/deleteTaxSellerInfo.do",
			data: getSellerInfoId(),
			dataType : 'json',
			async: false,
			globle: false,
			beforeSend: function(){
				//msgId = layerMsg("删除外网地址信息中......");
			},
			success: function(data){
				if (data.status == "S"){
					layer.msg('删除销方信息成功!', {zIndex: layer.zIndex});
					$(this).removeAttr("disabled");
					queryAllSellerInfoByPage();
				}else if (data.status=="T") {
					window.top.location.href = "../../login.html";
				}else{
					layuiAlert(data.msg,{btn: ['关闭']});
					$(this).removeAttr("disabled");
				}
			},
			complete: function(){
				layer.close();
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
//				layer.msg('操作失败请联系管理员!', {zIndex: layer.zIndex});
//				$(this).removeAttr("disabled");
				ajaxSuccessAlert("操作失败!");
			}
		});
	});

}

//初始化
function initXfglDialog(type) {
	// 限制使用了onlyNum类样式的控件只能输入数字
	$(".onlyNum").onlyNum();
	//限制使用了onlyAlpha类样式的控件只能输入字母
	$(".onlyAlpha").onlyAlpha();
  	// 限制使用了onlyNumAlpha类样式的控件只能输入数字和字母
	$(".onlyNumAlpha").onlyNumAlpha();
	initIndustryInfo("xz_xfgl");
	if(type == "U" || type == "D"){
		$.ajax({
			url : window.BASE_API_URL + "sellerInfo/queryTaxSellerInfoDetail.do",
			data : getSellerInfoId(),
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
					$("#xz_xfgl #deptId").val(rowData.deptId);//机构id
					$("#xz_xfgl #deptName").val(rowData.deptName);//机构名称
					$("#xz_xfgl #industry").find("option[value='"+rowData.industry+"']").attr("selected",true); //所属行业
					$("#xz_xfgl #id").val(rowData.id);//销方ID
					$("#xz_xfgl #sellerName").val(rowData.sellerName);//销方名称
					$("#xz_xfgl #sellerTaxNo").val(rowData.sellerTaxNo);//销方税号
					$("#xz_xfgl #legalPerson").val(rowData.legalPerson);//企业法人
					$("#xz_xfgl #sellerRegisteredAddress").val(rowData.sellerRegisteredAddress);//企业注册地址
					$("#xz_xfgl #sellerBank").val(rowData.sellerBank);//销方银行
					$("#xz_xfgl #sellerBankAccount").val(rowData.sellerBankAccount);//销方银行账号
					$("#xz_xfgl #businessAddress").val(rowData.businessAddress);//企业经营地址
					$("#xz_xfgl #telephone").val(rowData.telephone);//联系电话
					$("#xz_xfgl #status").val(rowData.status); //有效标志
					$("#xz_xfgl #status").find("option[value='"+rowData.status+"']").attr("selected",true); //有效标志
//		    		$("#xz_xfgl :radio[name='status'][value='" + rowData.status + "']").prop("checked", "checked");
				}else if (data.status=="T") {
					window.top.location.href = "../../login.html";
				}else{
					layuiAlert(data.msg,{btn: ['关闭']});
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
		emptySellerInfo();
	}
	setIsDisable(type);
}
function initIndustryInfo(pId){
	$.ajax({
		url : window.BASE_API_URL +"sellerInfo/getIndustryInfos.do",
		type : 'post',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		dataType : 'json',
		//data: This.getQueryMap(),
		success : function(data) {
			if (data.status == "S"){
				industrys = data.data.industryTypes;
				$("#"+ pId +" #industry").empty();
				$("#"+ pId +" #search_industry").empty();
				if(pId == "searchForm"){
					$("#" + pId + " #search_industry").append("<option value=''>--全部--</option>");
				}
				$.each(data.data.industryTypes, function(i,item){
					if(pId == "searchForm"){
						$("#" + pId + " #search_industry").append("<option value="+item.code+">"+item.codeName+"</option> ");
					}else{
						$("#" + pId + " #industry").append("<option value="+item.code+">"+item.codeName+"</option> ");
					}
				});
			}else if (data.status=="T") {
				window.top.location.href = "../../login.html";
			}else{
				layuiAlert(data.msg,{btn: ['关闭']});
			}
		}
	});
}
//获取查询参数，只提交有用数据
function getQueryMap() {
	var rtnMap = {};
	rtnMap["pageIndex"] = 1;
	rtnMap["pageSize"] = 10;
	rtnMap["sord"] = $("#xfgl_gridtable").jqGrid('getGridParam','sortorder');
    rtnMap["sellerName"] = $.trim($("#searchForm #search_sellerName").val());
    rtnMap["sellerTaxNo"] = $.trim($("#searchForm #search_sellerTaxNo").val());
    rtnMap["industry"] = $.trim($("#searchForm #search_industry option:selected").val());
    rtnMap["status"] = $.trim($("#searchForm #search_status option:selected").val());    
    return rtnMap;
}
//获取销方ID
function getSellerInfoId() {
	var map = {};
	map["id"]=rowDta_xf.id;
	return map;
}
//清空表单数据
function emptySellerInfo(){
//	$('#xz_xfgl #checkForm :input').not(':select').val("").removeAttr('checked');
//	$("#xz_xfgl #status").find("option[value='1']").attr("selected",true); //有效标志
	$("#xz_xfgl #deptId").val("");//机构id
	$("#xz_xfgl #deptName").val("");//机构名称
	$("#xz_xfgl #deptName").removeAttr("disabled");//机构名称
	$("#xz_xfgl #industry").val("");//所属行业
	$("#xz_xfgl #id").val("");//销方ID
	$("#xz_xfgl #sellerName").val("");//销方名称
	$("#xz_xfgl #sellerTaxNo").val("");//销方税号
	$("#xz_xfgl #sellerTaxNo").removeAttr("disabled");//销方税号
	$("#xz_xfgl #legalPerson").val("");//企业法人
	$("#xz_xfgl #sellerRegisteredAddress").val("");//企业注册地址
	$("#xz_xfgl #sellerBank").val("");//销方银行
	$("#xz_xfgl #sellerBankAccount").val("");//销方银行账号
	$("#xz_xfgl #businessAddress").val("");//企业经营地址
	$("#xz_xfgl #telephone").val("");//联系电话
	$("#xz_xfgl #telephone").val("");//联系电话
	$("#xz_xfgl #status").val("1"); //有效标志
	$("#xz_xfgl #status").find("option[value='1']").attr("selected",true); //有效标志
//	$('#yigeform').reset()
}
//禁编辑
function setIsDisable(type){
	//$("#checkForm *").attr("readonly", false);
	$("#checkForm *").attr("readonly", false);
	if(type=="U"){
		$("#xz_xfgl #deptId").attr("disabled", true);
		$("#xz_xfgl #deptName").attr("disabled", true);
		$("#xz_xfgl #sellerTaxNo").attr("disabled", true);
	}
	if(type=="D"){
		$("#checkForm *").attr("readonly", "readonly");
	}
//	$("#checkForm *").attr("readonly", false);
//	if(type=="U"){
//		$("#xz_xfgl #deptId").attr("readonly", true);
//		$("#xz_xfgl #deptName").attr("readonly", true);
//		$("#xz_xfgl #sellerTaxNo").attr("readonly", true);
//	}
//	if(type=="D"){
//	    $("#checkForm *").attr("readonly", true);
//	}

//    $("#t input").attr("disabled", "disabled");
//    $("#t textarea").attr("disabled", "disabled");
//    $("#t select").attr("disabled", "disabled");
//    $("#checkForm *").attr("disabled", "disabled");
}
function checkFormValue(){
	var deptId = $("#xz_xfgl #deptId");//机构id
    var industry = $("#xz_xfgl #industry option:selected");//所属行业
    var sellerName = $("#xz_xfgl #sellerName");//销方名称
    var sellerTaxNo = $("#xz_xfgl #sellerTaxNo");//销方税号
    var legalPerson = $("#xz_xfgl #legalPerson");//企业法人
    var businessAddress = $("#xz_xfgl #businessAddress");//企业经营地址
    var sellerRegisteredAddress = $("#xz_xfgl #sellerRegisteredAddress");//企业注册地址
    var telephone = $("#xz_xfgl #telephone");//联系电话
    var sellerBank = $("#xz_xfgl #sellerBank");//销方银行
    var sellerBankAccount = $("#xz_xfgl #sellerBankAccount");//销方银行账号
    var status = $("#xz_xfgl #status option:selected");    

    if(isEmpty ($.trim(deptId.val()) )){
    	layer.msg('请选择所属机构！', {zIndex: layer.zIndex});
    	return false;
    }
    if(isEmpty($.trim(industry.val()))){
    	layer.msg('请选择所属行业！', {zIndex: layer.zIndex});
    	industry.focus();
    	return false;
    }
    if(isEmpty($.trim(sellerName.val()))){
    	layer.msg('请输入1-200位销方名称！', {zIndex: layer.zIndex});
    	sellerName.focus();
    	return false;
    }else if($.trim(sellerName.val()).length>200){
    	layer.msg('请输入1-200位销方名称！', {zIndex: layer.zIndex});
    	sellerTaxNo.focus();
    	return false;
    }
    if(isEmpty($.trim(sellerTaxNo.val()))){
    	layer.msg('请输入15-21位销方税号，仅支持数字、字母！', {zIndex: layer.zIndex});
    	sellerTaxNo.focus();
    	return false;
    }else if($.trim(sellerTaxNo.val()).length<15 ||$.trim(sellerTaxNo.val()).length>21 ){
    	layer.msg('请输入15-21位销方税号，仅支持数字、字母！', {zIndex: layer.zIndex});
    	sellerTaxNo.focus();
    	return false;
    }
    
    return true;

}

function callbackMethod(deptId){
	var rtnMap = {};
	rtnMap["deptId"] = deptId;//机构id
	$.ajax({
		url : window.BASE_API_URL +"sellerInfo/uniqueSeartch.do",
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
				if(!data.data.result){
			    	layer.msg('该机构已存在销方信息，若需要变更信息内容， 请进行编辑操作！', {zIndex: layer.zIndex});
			    	$("#xz_xfgl #deptName").val("");
			    	$("#xz_xfgl #deptId").val("");
				}
			}else if (data.status=="T") {
				window.top.location.href = "../../login.html";
			}else{
				layuiAlert(data.msg,{btn: ['关闭']});
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
////运行中提示
//function runPrompt(layer, layerId) {
//    layer.cjsj('运行中', {
//        icon: 16,
//        shade: 0.6,
//        zIndex: layer.zIndex + 100
//    });
//    //此处演示关闭
//    setTimeout(function () {
//        layer.close(layerId);
//        //document.getElementById("wwdz_xz_form").reset();
//        layer.closeAll('loading');
//    }, 1000);
//}