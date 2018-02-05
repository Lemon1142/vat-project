var rowDta_yh = null, all_role = {},sysRoleList = {},tempVal= {},cbtnArr = window.top.buttonAuth;
var colMap = {
	colNames:['登录账号','用户名称','操作','组织机构','开票点','用户属性','账号有效期','锁定标志','创建时间'],
	colModel:[
		//{name:'id',index:'id', width:'',align:'center',sortable:false,hidden:true},
		{name:'userId',index:'userId', width:'18%',align:'left',sortable:false,hidden:false},
		{name:'userName',index:'userName', width:'20%',align:'left',sortable:false,hidden:false},
		{
			name: '操作', index: 'cb', width: '18%', align: 'center',sortable:false, formatter: function (value, gird, rows, state) {
			var lock = rows.lockStatus;
			var userHtml = '';
			userHtml += "<span data-method='yhgl_check' class='user_icon btn-ev fa fa-file-text "+ ($.inArray('102050',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' )+"' btncode='102050' style='font-size: 14px !important;' title='查看'></span>"
			userHtml += "<span data-method='yhgl_modify' class='user_icon btn-ev fa fa-pencil-square-o "+ ($.inArray('102030',cbtnArr) == -1 ? 'lock_hide' : 'lock_show')+"' btncode='102030' style='font-size: 14px !important;' title='编辑'></span>"
			userHtml += "<span data-method='yh_delete' class='btn-ev  fa fa-trash user_icon "+ ($.inArray('102040',cbtnArr) == -1 ? 'lock_hide' : 'lock_show')+"' btncode='102040' style='font-size: 14px !important;' title='删除'></span>"
			userHtml += "<span data-method='yh_unlock' btncode='102060' class=' user_icon btn-ev fa fa-lock fa-lg " + ( ($.inArray('102060',cbtnArr) != -1) && (lock == '0')? 'lock_hide' : 'lock_show' ) +"' style='font-size: 16px !important;' title='锁定'></span>"
			userHtml += "<span data-method='yh_locking' btncode='102070' class='user_icon btn-ev "+( ($.inArray('102070',cbtnArr) != -1) && (lock == '1') ? 'lock_hide' : 'lock_show' ) +"' style='font-size: 16px !important;' title='解锁'><i class='fa fa-unlock' style='width: 11px'></i></span>"

			return userHtml;
		}
		},
		{name:'deptName',index:'deptName', width:'15%',align:'left',sortable:false},
		{name:'billingPointName',index:'billingPointName', width:'12%',align:'left',sortable:false},
		{name:'userType',index:'userType', width:'12%',align:'left',sortable:false,formatter: function(cellvalue, options, rowObject){
			if(cellvalue == 0){
				return "超级管理用户"
			}
			else if(cellvalue == 1){
				return "企业管理用户"
			}
			else{
				return "企业普通用户"
			}
		}},
		{name:'validDate',index:'validDate', width:'16%',align:'center',sortable:false,formatter: function (value,gird,rows,state){
			if(value == null){
				return '';
			}else{
				return new Date(value).Format("yyyy-MM-dd");
			}
		}},
		{name:'lockStatus',index:'lockStatus', width:'12%',align:'center',sortable:false,formatter: function(cellvalue, options, rowObject){
			if(cellvalue == 0){
				return "未锁定"
			}
			else if(cellvalue == 1){
				return "已锁定"
			}
		}},
		{name:'createTime',index:'createTime', width:'20%',align:'center',sortable:true,sortorder :"desc" ,formatter: function (value,gird,rows,state){
			return new Date(value).Format("yyyy-MM-dd hh:mm:ss")
		}},
    ]};

$(document).ready(function(){
	initGrid();//初始化界面
	collapseLink();//修改折叠事件的绑定
	initButton();//初始化按钮
	$.ajax({
		url : window.BASE_API_URL +"sysRole/initSysRoleList.do",
		type : 'post',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		dataType : 'json',
		//async: false,
		//data:{"userId" : rowData.userId},
		success : function(data){
			all_role = data.data;
			callAllRole();
			callRole();
			if(data.status == 'T'){
				window.top.location.href= '../../login.html';
			}
		}
	});

});

/**
 * @Describe 初始化按钮事件
 */
function initButton(){
	layui.use('layer',function(){
		var layer = layui.layer;
		var active = {
			yhgl_query: function(){
				yhglQuery(layer);
			},
			yhgl_add: function(){
				yhglUserPage(layer,"新增用户信息","add");			
			},
			yhgl_modify: function(){
				yhglUserPage(layer,"修改用户信息","modify");
			},
			yhgl_delete: function(){
				yhglDelete(layer,'batch');
			},
			yh_delete: function(){
				yhglDelete(layer,'');
			},
			reset_password: function(){
				resetPasswordPage(layer);
				//return false;
			},
			yhgl_check: function(){
				yhglUserPage(layer,"查看用户信息","view");
			},
			yhgl_locking: function(){
				yhglLocking(layer,'batch');
			},
			yh_locking: function(){
				yhglLocking(layer,'');
			},
			yhgl_unlock: function(){
				yhglUnlock(layer,'batch');
			},
			yh_unlock: function(){
				yhglUnlock(layer,'');
			}
		};
		$('.yhgl-cont').on('click','.btn-ev',function () {
			var othis = $(this), method = othis.data('method');
			active[method] ? active[method].call(this, othis) : '';
		});

		$('#LAY_demo .layui-btn').on('click', function(){
		    var clickBtn = $(this),
		    	dataMethod = clickBtn.data('method');
			if($(this).hasClass('layui-btn-disabled')){
				return;
			}
		    active[dataMethod] ? active[dataMethod].call(this, clickBtn) : '';
		});
	});
	
	selectChange();
}

/**
 * 已选角色-全部角色切换按钮事件
 */
function selectChange(){
	 //移到右边
    $('#btn_add_role').click(function(){ //获取选中的选项，删除并追加给对方

		$('#all_roles option:selected').appendTo('#select_roles');
		return false;
    });
    //移到左边
    $('#btn_remove_role').click(function(){

		$('#select_roles option:selected').appendTo('#all_roles');
		return false;
    });
    
    //全部移到右边
    $('#btn_add_all_role').click(function(){
        //获取全部的选项,删除并追加给对方
        $('#all_roles option').appendTo('#select_roles');
		return false;
    });
    //全部移到左边
    $('#btn_remove_all_role').click(function(){
        $('#select_roles option').appendTo('#all_roles');
		return false;
    });
    //双击选项，移到右边
    $('#all_roles').dblclick(function(){
        $("option:selected",this).appendTo('#select_roles');
		return false;
    });
    //双击选项，移到左边
    $('#select_roles').dblclick(function(){
       $("option:selected",this).appendTo('#all_roles');
		return false;
    });
}
/**
 * @Describe 初始化列表展示
 */
function initGrid(){
		$("#yhgl_gridtable").jqGrid({
			ajaxGridOptions: {
				url: window.BASE_API_URL + "sysUser/querySysUserPage.do",
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
				"deptIdStr": $.trim($(".search_user .organId").val()),//组织机构
				"userId": $.trim($("#txt_yhid").val()), //登录账号
				"lockStatus": $.trim($("#select_sdbj option:selected").val()),//锁定标记
				//"order" : request.getParameter("sord"),//排序
			}
			,
			datatype: "json", //数据来源，本地数据
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
			sortorder: "desc",
			viewrecords: true,//是否在浏览导航栏显示记录总数
			rowNum: 10,//每页显示记录数
			rowList: [10, 20, 30, 50, 100],
			multiselect: true,
			beforeRequest: function () {
				load();
			},
			beforeSelectRow: function (rowid, e) {
				var $myGrid = $(this),
					i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),
					cm = $myGrid.jqGrid('getGridParam', 'colModel');
				rowDta_yh = $("#yhgl_gridtable").jqGrid("getRowData", rowid);
				//return (cm[i].name === 'cb');
				if (cm[i].index === 'cb') {
					return false;
				} else {
					return true;
				}
			}
			,
			loadComplete: function (data) {
				if (data.status == "T") {
					window.top.location.href = '../../login.html';
				}
				var grid = $("#yhgl_gridtable");
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
				id: "userId",//设置返回参数中，表格ID的名字为blackId
				root: "data.rows",
				page: "data.pageIndex",
				total: function (obj) {
					if (obj.data == null) {
						return false;
					}
					return Math.ceil(obj.data.total / obj.data.pageSize);
				}
				,
				records: "data.total",
				repeatitems: false
			}
			,
			pager: '#yhgl_pager'
		}).trigger('reloadGrid');

		setTimeout(function () {
			updatePagerIcons($("#yhgl_gridtable"));//加载底部栏图标
		}, 0);
		resizeJqGrid("yhgl_gridtable")
}
/**
 * @Describe 用户信息查询
 */
function yhglQuery(layer){
	//var layer = layui.layer;
	$("#yhgl_gridtable").setGridParam({
		beforeRequest : function(){
			layer.load(3);
		},
		//url : window.BASE_API_URL + "sysUser/querySysUserPage.do",
		datatype : 'json',
		postData : getQueryMap(),
		gridComplete : function(){
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
	//rnMap["order"] = request.getParameter("sord"); //排序
	rnMap["deptIdStr"] = $.trim($(".search_user .organId").val());//组织机构
	rnMap["userId"] = $.trim($("#txt_yhid").val()); //登录账号
	rnMap["lockStatus"] = $.trim($("#select_sdbj option:selected").val());//锁定标记
	return rnMap;
}
/**
 * @Describe 用户信息界面
 */
function yhglUserPage(layer,title,btn){
	if(btn == "add"){
		$("#yhgl_username").removeAttr("disabled");
		addmodInit("新增用户");//界面元素操作
		initAddPage();		
	}else if(btn == "modify"){
		$("#yhgl_login").attr("disabled",true);
		addmodInit("编辑用户");//界面元素操作
		initModifyCheckPage("modify");
	}else if(btn == "view"){
		$(".user_password").hide();
		addmodInit("查看用户");//界面元素操作
		initModifyCheckPage("view");
	}else{
		//initAddJgPage();
	}
	if(btn == 'view'){
		var userPage = layer.open({
			type: 1,
			title: "<big>" + title + "</big>",
			area: ['760px','630px'],
			shade: [0.3, '#393D49'],
			shadeClose: false,
			maxmin: true,
			resize: true,//是否允许拉伸
			content: btn != "addJg" ? $('#yhgl_userPage') : $('#yhgl_addJg'),
			//btn: ['<big>关闭</big>'] ,
			btn: ['关闭'] ,
			yes: function(){
				if(btn != "view"){
					userOperate(layer,userPage,btn);
				}else{
					layer.close(userPage);
					emptyPage();//初始化用户信息界面
				}
			},
			btn2: function(){//取消按钮
				emptyPage();//初始化用户信息界面
				layer.closeAll();

			},
			cancel: function(){ //右上角关闭按钮
				 emptyPage();//初始化用户信息界面

			},
			//closeBtn: 2,关闭按钮样式
			//btnAlign: 'l',// 'c' 'r' 按钮排序方式
			zIndex: layer.zIndex, //控制层叠顺序
			success: function(layero,index){//弹层成功回调方法
				// window.GAG.ios.common.resizeJqGrid("yhgl_gridtable");
				layer.setTop(layero); //置顶当前窗口
			}
		});
		return false;
	}
	var userPage = layer.open({
		type: 1,
		title: "<big>" + title + "</big>",
		area: ['760px','530px'],
		shade: [0.3, '#393D49'],
		shadeClose: false,
        maxmin: true,
        resize: true,//是否允许拉伸
        content: btn != "addJg" ? $('#yhgl_userPage') : $('#yhgl_addJg'),
        //btn: ['<big>保存</big>', '<big>取消</big>'] ,
        btn: ['保存', '取消'] ,
        yes: function(){
        	if(btn != "view"){       		
            	userOperate(layer,userPage,btn); 
        	}else{      		  
        		layer.close(userPage);
            	emptyPage();//初始化用户信息界面
        	}
        },
        btn2: function(){//取消按钮
        	emptyPage();//初始化用户信息界面
        },
        cancel: function(){ //右上角关闭按钮      
        	emptyPage();//初始化用户信息界面
        },
	    //closeBtn: 2,关闭按钮样式
        //btnAlign: 'l',// 'c' 'r' 按钮排序方式
        zIndex: layer.zIndex, //控制层叠顺序
        success: function(layero,index){//弹层成功回调方法
        	resizeJqGrid("yhgl_gridtable");
        	layer.setTop(layero); //置顶当前窗口
        }
	});
}

/**
 * @Describe 清空页面内容
 */
function emptyPage(){
	$("#yhgl_login").val("");//登录账号
	$(".add_user .organName").val("");
	$(".add_user .organId").val("");//组织机构
	$("#yhgl_realname").val("");//用户名称
	$("#yh_email").val(""); //邮箱
	$("#yh_password").val("123456");//初始密码
	$("#yh_phone").val(""); //电话
	$("#yh_zhyxq").val("");//账号有效期ß
	$("#select_roles").val("");//已选角色
	$("#yh_dialogDescription").val("");//账号描述
	$("#yh_sd").val("未锁定");//锁定标志
	$("#yh_sd").attr("readonly","true");//锁定标志
	$("#yc_sdyc").val("0");//锁定标志
	$("#all_roles").html("");
	$("#select_roles").html("");
	$("#yhgl_kpd").html("");
	$("#yh_sex").removeAttr("disabled"); //性别
	$("#yh_sex").val('0');
	$("#yh_sex").find("option[value='0']").attr("selected",true); //性别

	$("#mdeptName").val('1');
	$("#mdeptName").find("option[value='1']").attr("selected",true); //性别

	$(".yhgl_kpd #yhgl_kpd").html("<option value='' selected>"+"--请选择--</option>");
    $(".yhgl_kpd #yhgl_kpd").val('');
	$(".yhgl_kpd #yhgl_kpd").find("option[value='']").attr("selected",true);

	$("#yh_sx").val("2");
	$("#yh_sx").find("option[value='2']").attr("selected",true);
	$(".hide_jgqx").removeClass('lock_hide');
	user_flag = false;
	window.userTaxNo = '';

}
/**
 * @Describe 新增-修改界面元素操作
 */
var user_flag = false;
//var user_taxNo = window.top.taxNo;
function addmodInit(str) {
	var user_type = cookie.get("userType");
	if (str == "新增用户" || str == "编辑用户") {
		//var taxVal = $('.add_user #organId').val();
		if (str == "编辑用户") {
			$(".user_password").hide();
			//if ($("#yh_password").attr("type") == "password") {
			//	$("#yh_password").attr("type", "text")
			//}
			$("#yhgl_login").attr("disabled", "disabled"); //登陆账号
		}
		else {
			$(".user_password").show();
			$("#yhgl_login").removeAttr("disabled"); //登陆账号
			$('.user_mdeptName').off("change");
			$(".user_mdeptName").change(function () {
				var user_val = $(this).children("option:selected").val();
				if (user_val == "2") {
					$(".yhgl_kpd").show();
					$(".yhgl_kpdName").show();
					user_flag = true;
					backSellerTaxNo(window.userTaxNo,'user_flag','');

				} else {

					$(".yhgl_kpd").hide();
					$(".yhgl_kpdName").hide();
					user_flag = false;
					backSellerTaxNo('');
				}
			});
		}

		$(".add_user #organName").removeAttr("disabled"); //组织机构
		$("#mdeptName").removeAttr("disabled"); //数据权限
		$("#yhgl_realname").removeAttr("disabled"); //用户名称
		$("#yh_email").removeAttr("disabled");
		$("#yh_phone").removeAttr("disabled");
		$("#yh_sd").removeAttr("disabled");
		$("#yhgl_kpd").removeAttr("disabled");
		$("#yh_zhyxq").removeAttr("disabled");
		$("#yh_sx").removeAttr("disabled");
		$("#yh_dialogDescription").removeAttr("disabled");
		$("#all_roles").removeAttr("disabled");
		$("#select_roles").removeAttr("disabled");

		$(".yhgl_kpd").css("display", "none");
		$(".yhgl_kpdName").css("display", "none");


		if (user_type != "0") {
			$("#yh_sx option[value = '1']").hide();
			$("#yh_sx option[value = '0']").hide();
		} else {
			$("#yh_sx option[value = '1']").show();
			$("#yh_sx option[value = '0']").show();
		}
		;

		$("#yh_sx").change(function () {
			var sx_val = $(this).children("option:selected").val();
			if (sx_val == "0") {
				//$(".yhgl_kpd").show();
				//$(".yhgl_kpdName").show();
				//$(".add_user #organName").attr("disabled", "disabled");
				$(".hide_jgqx").addClass('lock_hide');
				$(".add_user #organName").val("");
				$(".add_user #organId").val("");
                $('#mdeptName').val('');
                $('#mdeptName option[value = " "]').attr("selected",'selected');

			} else {
				//$(".add_user #organName").removeAttr("disabled");
				$(".hide_jgqx").removeClass('lock_hide');
				$(".hide_jgqx").show();
			}
		});

	}
	else if (str == "查看用户") {
		$('#checkForm').find('input,textarea,select').attr('disabled',true);
		$(".user_password").hide();
	}
}


// 回调销方税号
function backSellerTaxNo(sellerTaxNo,flag,deptId){
	if(sellerTaxNo == '' ){
		//alert('yyyyyyy===',sellerTaxNo);
		$("#yhgl_kpd").html("<option value='' selected>"+"--请选择--</option>");
	}else{
        //console.log('flag',user_flag); // 请勿删除
        if(user_flag) {
		//if(flag) {
			//alert(user_flag);
			if(deptId == undefined || deptId == ''){
				$("#yhgl_kpd").html("<option value='' selected>"+"--请选择--</option>");
				$.ajax({
					url: window.BASE_API_URL + "billingPointInfo/queryTaxBillingPointInfoList.do",
					type: 'post',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					dataType: 'json',
					data: {
						'sellerTaxNo': sellerTaxNo
					},
					success: function (data) {
						$.each(data.data, function (i, item) {
							$("#yhgl_kpd").append("<option value=" + item.billingNo + ">" + item.billingPointName + "</option> ");
						});

					}
				});
			}else if(deptId == 'id'){
				//alert(deptId);
				$.ajax({
					url: window.BASE_API_URL + "billingPointInfo/queryTaxBillingPointInfoList.do",
					type: 'post',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					dataType: 'json',
					data: {
						'deptId': sellerTaxNo
					},
					success: function (data) {
						user_callKpd = data.data;
						callKpd();
					}
				});
			}

		}else if(!flag){
			$("#yhgl_kpd").html("<option value='' selected>"+"--请选择--</option>");
		}
	}

}

function callAllRole(){
	$.each(all_role, function (i, item) {
		$("#all_roles").append("<option value=" + item.id + ">" + item.roleName + "</option> ");
	});
}

function callRole() {
	if (sysRoleList.length != 0) {
		$.each(all_role, function (i, item) {
			var flag = false;
			var selId = item.id;
			var selName = item.roleName;
			$.each(sysRoleList, function (K, val) {
				if (selId == val.id) {
					flag = true;
					return;
				}

			});

			if(!flag){
				$("#all_roles").append("<option value=" + selId + ">" + selName + "</option> ");
			}
		});
	}

	else {

		$.each(all_role, function (i, item) {
			$("#all_roles").append("<option value=" + item.id + ">" + item.roleName + "</option> ");
		});


	}
}

/**
 * @Describe 新增界面信息初始化
 */
function initAddPage() {
	emptyPage();
	callAllRole();
}

function callKpd (){
	$.each(user_callKpd, function (i, item) {
		$("#yhgl_kpd").append("<option value=" + item.billingNo + ">" + item.billingPointName + "</option> ");
	});
	$(".yhgl_kpd #yhgl_kpd").val(tempVal);
	$(".yhgl_kpd #yhgl_kpd option[value='"+tempVal+"']").attr("selected","selected");
}

/**
 * @Describe 修改-查看界面信息初始化
 */
function initModifyCheckPage(modifycheck){
	emptyPage();

	$.ajax({
		url : window.BASE_API_URL +"sysUser/querySysUserDetil.do",
		type : 'post',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		dataType : 'json',
		data:{"userId" : rowDta_yh.userId},
		success : function(data){
			var data = data.data;
			tempVal=data.billingNo;
			//if(data.sysRoleList){
			sysRoleList = data.sysRoleList;
			//}

			$("#yhgl_login").val(data.userId);
			$("#yhgl_realname").val(data.userName);

			$("#mdeptName").val(data.userAuthType); //数据权限

			if(data.userAuthType == "1"){
				$("#mdeptName option[value='1']").attr("selected","selected");
			}else if(data.userAuthType == "0"){
				$("#mdeptName option[value='0']").attr("selected","selected");
			}else if(data.userAuthType == "2"){
				$("#mdeptName option[value='2']").attr("selected","selected");
			}
			$("#yh_sex").val(data.gender); //性别
			if(data.gender == "1"){
				$("#yh_sex option[value='1']").attr("selected","selected").siblings().removeAttr("selected");
			}else if(data.gender == "0"){
				$("#yh_sex option[value='0']").attr("selected","selected").siblings().removeAttr("selected");
			}

            if(data.validDate == null){
				$("#yh_zhyxq").val('');
			}else {
				$("#yh_zhyxq").val( formatDate(data.validDate) );
			}

			$("#yh_password").val(data.password);

			$("#yh_sx").val(data.userType); //用户属性
			if(data.userType == "1"){
				$("#yh_sx option[value='1']").attr("selected","selected").siblings().removeAttr("selected");
				$(".add_user #organName").removeAttr("disabled");

				$(".hide_jgqx").removeClass('lock_hide');
				$(".hide_jgqx").show();

			}else if(data.userType == "0"){
				$("#yh_sx option[value='0']").attr("selected","selected").siblings().removeAttr("selected");
				//$(".add_user #organName").attr("disabled","disabled");
				$(".hide_jgqx").addClass('lock_hide');
				//$(".add_user #organName").val("");
				//$(".add_user #organId").val("");
				$('#mdeptName').val('');
				$('#mdeptName option[value = " "]').attr("selected",'selected');

			}else if(data.userType == "2"){
				$("#yh_sx option[value='2']").attr("selected","selected").siblings().removeAttr("selected");
				$(".add_user #organName").removeAttr("disabled");

				$(".hide_jgqx").removeClass('lock_hide');
				$(".hide_jgqx").show();
			}


			$("#yh_dialogDescription").val(data.description);
			$("#yh_email").val(data.email);//邮箱
			$("#yh_phone").val(data.mobile);
			$.each(data.sysRoleList, function(i,item){
				$("#select_roles").append("<option value="+item.id+">"+item.roleName+"</option> ");
			});

			$(".add_user .organName").val(data.deptName);
			$(".add_user .organId").val(data.deptId);

            // 开票点
			if (data.userAuthType == "2") {
				$(".yhgl_kpd").show();
				$(".yhgl_kpdName").show();

				user_flag = true;
				backSellerTaxNo(data.deptId,'user_flag','id');

			} else {
				$(".yhgl_kpd").hide();
				$(".yhgl_kpdName").hide();
				//$("#yhgl_kpd").html('');
				backSellerTaxNo('');

			}

			$('.user_mdeptName').off("change");
			$(".user_mdeptName").change(function () {
				var user_val = $(this).children("option:selected").val();
				if (user_val == "2") {
					$(".yhgl_kpd").show();
					$(".yhgl_kpdName").show();
					user_flag = true;
					backSellerTaxNo(data.deptId,'user_flag','id');
				} else {
					$(".yhgl_kpd").hide();
					$(".yhgl_kpdName").hide();
					//user_flag = false;
					backSellerTaxNo('');
					//$("#yhgl_kpd").append("<option value=''>"+"</option> ");

				}
			});

			$("#yhgl_kpd").val(tempVal);
			$("#yhgl_kpd option[value='"+tempVal+"']").prop("selected",true);

			if(data.lockStatus == 0){
				$("#yh_sd").val("未锁定");
				$("#yh_sd").attr("readOnly","true");
				$("#yc_sdyc").val("0");
			}else{
				$("#yh_sd").val("已锁定");
				$("#yh_sd").attr("readOnly","true");
				$("#yc_sdyc").val("1");
			}

			if(modifycheck == "view"){
				$('.add_user input#organName').attr("disabled","disabled");
				$('#yh_sex').attr("disabled","disabled");
			}

			callRole();
		}
	})
}
/**
 * @Describe 配置机构信息界面
 */
function initAddJgPage(layer){
	var selectRows = $("#yhgl_gridtable").jqGrid("getGridParam", "selarrrow"),
		rowData = $("#yhgl_gridtable").jqGrid("getRowData",selectRows);
 	if($.trim(rowData.yhid) == "admin"){
 		layuiAlert("系统管理员账号不允许修改!");
	}else{
		$.ajax({
			url : "../../qxgl/user/chaZzjgs.action",
			data : {'yhid': rowData.yhid},
			type : 'post',
			dataType : "json",
			success : function(data){
				var zTree = $.fn.zTree.getZTreeObj('BmTree14');
				for(var i in data){
					var node = zTree.getNodeByParam("id", i);
					node.checked = true;
					zTree.updateNode(node);
				}
			},
			error: function(){
				layuiAlert("操作失败请联系管理员!");
			}
		}); 			
	}
}
/**
 * @Describe 统一处理用户操作
 */
function userOperate(layer,layerId,btn){
	if(btn == "add"){
		userAdd(layer,layerId);//新增
	}else if(btn == "modify"){
		userModify(layer,layerId);//修改		
	}else{
		//userAddJg(layer,layerId);//配置机构
	}
}

/**
 * @Describe 新增用户信息
 */
function userAdd(layer,layerId){
	var zzjg = $.trim($(".add_user .organId").val());//组织机构
	var sjqx = $.trim($(".user_mdeptName").val());//数据权限
	var sex = $.trim( $("#yh_sex").val() );//性别
	var yh_email = $.trim($("#yh_email").val());//email
	var yh_phone = $.trim($("#yh_phone").val());//phone

	var dlzh = $.trim($("#yhgl_login").val());//登录账号
	var yhmc = $.trim($("#yhgl_realname").val());//用户名称
	if(yh_sd = "未锁定"){
		$("#yc_sdyc").val(0);
	}else{
		$("#yc_sdyc").val(1);
	}
	var real_sd = $.trim($("#yc_sdyc").val());

	var yh_zhyxq = $.trim($("#yh_zhyxq").val());//账号有效期
	var yh_password = hex_md5( $.trim($("#yh_password").val()) );//用户密码
	var yh_sx = $.trim($("#yh_sx option:selected").val());//用户属性
	var yh_dialogDescription = $.trim($("#yh_dialogDescription").val());//描述

	//if($(".yhgl_kpd").is(':hidden') ){
	//	alert("111");
	//	var yhgl_kpd = $.trim($(".yhgl_kpd option").val(""));//开票点
	//}else{
		var yhgl_kpd = $.trim($(".yhgl_kpd option:selected").val());//开票点
	//}

	var length = strlen(yhmc);
	if($.trim(dlzh) == ""){
		layuiAlert("登录账号为必填项，请您录入信息！");
		return false;
	}
	if($.trim(yhmc) == ""){
		layuiAlert("用户名称为必填项，请您录入信息！");
		return false;
	}
	if(getELength(dlzh)>30 || getELength(dlzh) < 5){
		layuiAlert("登录账号字符数为5-30个字符，请重新输入！");
		return false;
	}	
	if(Number(length)>Number(10)){
		layuiAlert("用户名称不能超过10个字符，请重新输入！");
		return false;
	}
	var jsidlist = "";
	$('#select_roles'+' option').each(function(){
		jsidlist += $(this).attr("value")+",";
	});

	jsidlist = jsidlist.substring(0,jsidlist.length-1);
	var roleIdArr;
	roleIdArr = jsidlist.split(",");

	var map = {};
	map["userId"]=dlzh;
	map["userName"]=yhmc;
	map["deptId"]=zzjg;
	map["userAuthType"]=sjqx;//数据权限
	map["lockStatus"]=real_sd;
	map["gender"]=sex;
	map["email"]=yh_email;
	map["mobile"]=yh_phone;
	map["billingNo"]=yhgl_kpd;
	map["billingServerNo"]=yhgl_kpd;
	map["validDate"]=yh_zhyxq;
	map["password"]=yh_password;//密码
	map["userType"]=yh_sx;//属性
	map["description"]=yh_dialogDescription;//描述
	map["roleIdArr"]=roleIdArr;
	var msgId;
	$.ajax({
		url :  window.BASE_API_URL + "sysUser/addSysUser.do",
		data : map,
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		type : 'post',
		dataType : 'json',
		//beforeSend: function(){
		//	msgId = layerMsg("新增用户信息中......");
		//},
		beforeRequest : function(){
			layer.load(3);
		},
		success : function(data){
			if(data.status=="T"){
				window.top.location.href = "../../login.html";
				return;
			}
			else if(data.status=="F"){
				layuiAlert(data.msg,{btn: ['关闭']});
				$(this).removeAttr("disabled");
			}
			else if(data.status=="S"){
				layer.closeAll();
				layuiAlert(data.msg);
				yhglQuery(layer);

			}
		},
		complete: function(){
			// layer.closeAll();
			// $(".layui-layer-page").css("display", "none");
			// $(".layui-layer-shade").css("display", "none");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			layuiAlert("操作失败请重试！");
		}
	});	
}
/**
 * @Describe 修改用户信息
 */
function userModify(layer,layerId){
	var selectRows = $("#yhgl_gridtable").jqGrid("getGridParam", "selarrrow"),
		rowData = $("#yhgl_gridtable").jqGrid("getRowData",selectRows);
	var zzjg = $.trim($(".add_user .organId").val()); //组织机构
	var sjqx = $.trim($("#mdeptName").val());//数据权限
	var dlzh = $.trim($("#yhgl_login").val());//登录账号
	var yhmc = $.trim($("#yhgl_realname").val());//用户名称
	var sex = $.trim($("#yh_sex option:selected").val());//用户性别
	var yh_email = $.trim($("#yh_email").val());//邮箱
	var yh_phone = $.trim($("#yh_phone").val());//手机号
	var yh_dialogDescription = $.trim($("#yh_dialogDescription").val());//描述
	var yh_sd = $("#yh_sd").val();//锁定标志
	if(yh_sd = "未锁定"){
		$("#yc_sdyc").val(0);
	}else{
		$("#yc_sdyc").val(1);
	}
	var real_sd = $.trim($("#yc_sdyc").val());

	var yh_zhyxq = $.trim($("#yh_zhyxq").val());//账号有效期
	var yh_password = $.trim($("#yh_password").val());//用户密码
	var yh_sx = $.trim($("#yh_sx option:selected").val());//用户属性
	var yhgl_kpd = $.trim($("#yhgl_kpd option:selected").val());//开票点


	var length = strlen(yhmc);
	if(getELength(dlzh)>30 || getELength(dlzh)<5){
		layuiAlert("登录账号字符数为5-30个字符，请重新输入！");
		return false;
	}	
	if(Number(length)>Number(10)){
		layuiAlert("用户名称不能超过10个字符，请重新输入！");
		return false;
	}
	if($.trim(dlzh)==""){
		layuiAlert("登录账号为必填项，请您录入该信息！");
		return false;
	}
	if($.trim(yhmc)==""){
		layuiAlert("用户名称为必填项，请您录入该信息！");
		return false;
	}
	var jsidlist = "";
	$('#select_roles option').each(function() {
		jsidlist += $(this).attr("value")+",";
	});
	jsidlist = jsidlist.substring(0,jsidlist.length-1);
	var roleIdArr;
	roleIdArr = jsidlist.split(",");

	var map = {},msgId;
	map["userId"]=dlzh;
	map["userName"]=yhmc;
	map["deptId"]=zzjg;
	map["userAuthType"]=sjqx;//数据权限
	map["lockStatus"]=real_sd;
	map["gender"]=sex;
	map["email"]=yh_email;
	map["mobile"]=yh_phone;
	map["billingNo"]=yhgl_kpd;
	map["billingServerNo"]=yhgl_kpd;
	map["validDate"]=yh_zhyxq;
	map["password"]=yh_password;//密码
	map["desciption"]=yh_dialogDescription;//描述
	map["userType"]=yh_sx;//属性
	map["roleIdArr"]=roleIdArr;

	$.ajax({
		url : window.BASE_API_URL + "sysUser/editSysUser.do",
		data : map,
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		type : 'post',
		dataType : 'json',
		beforeSend: function(){
			// msgId = layerMsg("修改用户信息中......");
		},
		beforeRequest : function(){
			layer.load(3);
		},
		success : function(data){
			if(data.status=="T"){
				window.top.location.href = "../../login.html";
				return;
			}
			else if(data.status=="F"){
				layuiAlert(data.msg,{btn: ['关闭']});
				$(this).removeAttr("disabled");
			}
			else if(data.status=="S"){
				layer.closeAll();
				layuiAlert(data.msg);
				yhglQuery(layer);
			}
		},
		complete: function(){
			// layer.closeAll();

		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			layuiAlert("操作失败!");
		}
	});
}
/**
 * @Describe 配置机构信息
 */
//function userAddJg(layer,layerId){
//	var menuTree = $.fn.zTree.getZTreeObj("BmTree14");
//	var checkNode = menuTree.getCheckedNodes(true);
//	var id = $("#yhgl_gridtable").jqGrid("getGridParam", "selrow");
//	var rowData = $("#yhgl_gridtable").jqGrid("getRowData", id);
//	var yhid = rowData.yhid;
//	var treeData = [];
//	for(var i=0;i<checkNode.length;i++){
//		treeData.push(checkNode[i].id);
//	}
//	treeData = treeData.toString();
//	$.ajax({
//		type:'POST',
//		url:'../../qxgl/user/addZzjg.action',
//		dataType : 'json',
//		data:{
//			'yhid':yhid,
//			'treeData':treeData
//		},
//		success : function(data) {
//			if(data.returnCode == 0){
//				ajaxSuccessAlert(data.returnMsg);
//			}else if(data.returnCode == 1){
//				layuiAlert(data.returnMsg);
//			}else{
//				layuiAlert(data.returnMsg);
//			}
//			return;
//		},
//		error : function(XMLHttpRequest, textStatus, errorThrown) {
//  			//window.top.AjaxErrorManage(XMLHttpRequest,textStatus,errorThrown);
//  			layuiAlert("配置机构信息失败！");
//  		}
//	});
//}
/**
 * @Describe 删除用户信息
 */
function yhglDelete(layer,type){
	if(type == 'batch') {
		var selectRows = $("#yhgl_gridtable").jqGrid("getGridParam", "selarrrow");
		var rowData = $("#yhgl_gridtable").jqGrid("getGridParam", "selarrrow");
		if (selectRows.length < 1) {
			layuiAlert('请选中一行，再进行删除！', {btn: ['关闭']});
			return false;
		}
		else {
			layer.confirm('<big>您确定要删除这 '+ rowData.length +' 条用户信息吗？</big>', {icon: 3, title:'<span style="color:#2679b5;"><big>提示信息</big></span>'},
				function(index){
					$.ajax({
						type:'POST',
						xhrFields: {
							withCredentials: true
						},
						crossDomain: true,
						url: window.BASE_API_URL + "sysUser/deleteSysUser.do",
						data: {
							userIdArr : rowData
						},
						dataType : 'json',
						async: false,
						globle: false,
						beforeSend: function(){
							//msgId = layerMsg("删除外网地址信息中......");
						},
						beforeRequest : function(){
							layer.load(3);
						},
						success: function(data){
							if(data.status == "S"){
								$("#yhgl_gridtable").trigger("reloadGrid");
								ajaxSuccessAlert("删除成功，共删除 "+rowData.length+"条用户信息 !");
								yhglQuery(layer);
							}else if(data.status == "F"){
								ajaxSuccessAlert(data.msg);
							}else if(data.status == "T"){
								window.top.location.href = '../../login.html';
							}
						},
						complete: function(){
							layer.close();
						},
						error: function(XMLHttpRequest, textStatus, errorThrown){
							//layuiAlert("操作失败!");
							ajaxSuccessAlert("操作失败!");
						}
					});
				});
		}

	}
	else{
	var arr = [];
	arr.push(rowDta_yh.userId);
	layer.confirm('<big>您确定要删除这 '+'1 条用户信息吗？</big>', {icon: 3, title:'<span style="color:#2679b5;"><big>提示信息</big></span>'},
		function(index){
			$.ajax({
				type:'POST',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				url: window.BASE_API_URL + "sysUser/deleteSysUser.do",
				data: {
					userIdArr : arr
				},
				dataType : 'json',
				async: false,
				globle: false,
				beforeSend: function(){
					//msgId = layerMsg("删除外网地址信息中......");
				},
				beforeRequest : function(){
					layer.load(3);
				},
				success: function(data){
					if(data.status == "S"){
						$("#yhgl_gridtable").trigger("reloadGrid");
						//ajaxSuccessAlert("删除成功，共删除 "+rowData.length+" 条用户信息 !");
						ajaxSuccessAlert("删除成功，共删除 "+ "1条用户信息 !");
						yhglQuery(layer);
					}else if(data.status == "F"){
						ajaxSuccessAlert(data.msg);
					}else if(data.status == "T"){
						window.top.location.href = '../../login.html';
					}
				},
				complete: function(){
					layer.close();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					//layuiAlert("操作失败!");
					ajaxSuccessAlert("操作失败!");
				}
			});
		});

	}
}
/**
 * @Describe 重置密码信息界面
 */
function resetPasswordPage(layer){

	var selectRows = $("#yhgl_gridtable").jqGrid("getGridParam", "selarrrow");
	var rowData = $("#yhgl_gridtable").jqGrid("getGridParam", "selarrrow");
	if (selectRows.length < 1) {
		layuiAlert('请选中一行，再进行重置！', {btn: ['关闭']});
		return false;
	}
	else {
		layer.confirm('<big>您确定要重置这 '+ rowData.length +' 条用户信息吗？</big>', {icon: 3, title:'<span style="color:#2679b5;"><big>提示信息</big></span>'},
			function(index){
				$.ajax({
					type:'POST',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					url: window.BASE_API_URL + "sysUser/resetPassword.do",
					data: {
						userIdArr : rowData
					},
					dataType : 'json',
					async: false,
					globle: false,
					beforeSend: function(){
						//msgId = layerMsg("删除外网地址信息中......");
					},
					beforeRequest : function(){
						layer.load(3);
					},
					success: function(data){
						if(data.status == "S"){
							$("#yhgl_gridtable").trigger("reloadGrid");
							ajaxSuccessAlert("重置密码成功，共重置 "+rowData.length+"条用户信息 !");
							yhglQuery(layer);
						}else if(data.status == "F"){
							ajaxSuccessAlert(data.msg);
						}
						//else if(data.status == "T"){
						//	window.top.location.href = '../../login.html';
						//}
					},
					complete: function(){
						layer.close();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown){
						//layuiAlert("操作失败!");
						ajaxSuccessAlert("操作失败!");
					}
				});
			});
	}

}

//锁定用户
function yhglLocking (layer,type){
	if(type == 'batch') {
		var selectRows = $("#yhgl_gridtable").jqGrid("getGridParam", "selarrrow");
		if (selectRows.length == 0) {
			layuiAlert('请选中一行，再进行锁定！', {btn: ['关闭']});
			return false;
		}
		;

		layer.confirm('<big>您确定要锁定这 ' + selectRows.length + ' 条用户信息吗？</big>', {
				icon: 3,
				title: '<span style="color:#2679b5;"><big>提示信息</big></span>'
			},
			function (index) {
				$.ajax({
					type: 'POST',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					url: window.BASE_API_URL + "sysUser/lockSysUser.do",
					data: {
						userIdArr: selectRows
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
						if (data.status == "S") {
							$("#yhgl_gridtable").trigger("reloadGrid");
							ajaxSuccessAlert("锁定成功，共锁定 " + selectRows.length + " 条用户信息 !");
							yhglQuery(layer);
						} else if (data.status == "F") {
							ajaxSuccessAlert(data.msg);
						} else if (data.status == "T") {
							window.top.location.href = '../../login.html';
						}
					},
					complete: function () {
						layer.close();
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//layuiAlert("操作失败!");
						ajaxSuccessAlert("操作失败!");
					}
				});
			});
	}else {
		var arr_lock = [];
		arr_lock.push(rowDta_yh.userId);
		layer.confirm('<big>您确定要锁定这1条用户信息吗？</big>', {
				icon: 3,
				title: '<span style="color:#2679b5;"><big>提示信息</big></span>'
			},
			function (index) {
				$.ajax({
					type: 'POST',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					url: window.BASE_API_URL + "sysUser/lockSysUser.do",
					data: {
						userIdArr: arr_lock
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
						if (data.status == "S") {
							$("#yhgl_gridtable").trigger("reloadGrid");
							ajaxSuccessAlert("锁定成功，共锁定 1 条用户信息 !");
							yhglQuery(layer);
						} else if (data.status == "F") {
							ajaxSuccessAlert(data.msg);
						} else if (data.status == "T") {
							window.top.location.href = '../../login.html';
						}
					},
					complete: function () {
						layer.close();
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//layuiAlert("操作失败!");
						ajaxSuccessAlert("操作失败!");
					}
				});
			});
	}
};

//解锁用户
function yhglUnlock (layer,type){

	if(type == 'batch'){
		var selectRows = $("#yhgl_gridtable").jqGrid("getGridParam", "selarrrow");
		if (selectRows.length == 0) {
			layuiAlert('请选中一行，再进行解锁！', {btn: ['关闭']});
			return false;
		}
		else{
			layer.confirm('<big>您确定要解锁这 '+ selectRows.length +' 条用户信息吗？</big>', {icon: 3, title:'<span style="color:#2679b5;"><big>提示信息</big></span>'},
			function(index){
				$.ajax({
					type:'POST',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					url: window.BASE_API_URL + "sysUser/unLockSysUser.do",
					data: {
						userIdArr : selectRows
					},
					dataType : 'json',
					async: false,
					globle: false,
					beforeSend: function(){
						//msgId = layerMsg("删除外网地址信息中......");
					},
					beforeRequest : function(){
						layer.load(3);
					},
					success: function(data){
						if(data.status == "S"){
							$("#yhgl_gridtable").trigger("reloadGrid");
							ajaxSuccessAlert("解锁成功，共解锁 "+selectRows.length+" 条用户信息 !");
							//ajaxSuccessAlert("解锁成功，共解锁 "+"1 条用户信息 !");
							yhglQuery(layer);
						}else if(data.status == "F"){
							ajaxSuccessAlert(data.msg);
						}else if(data.status == "T"){
							window.top.location.href = '../../login.html';
						}
					},
					complete: function(){
						layer.close();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown){
						//layuiAlert("操作失败!");
						ajaxSuccessAlert("操作失败!");
					}
				});
			})
		}
	}
	else{
		var arr_unlock = [];
		arr_unlock.push(rowDta_yh.userId);
		//layer.confirm('<big>您确定要解锁这 '+ selectRows.length +' 条用户信息吗？</big>', {icon: 3, title:'<span style="color:#2679b5;"><big>提示信息</big></span>'},
		layer.confirm('<big>您确定要解锁这 '+'1 条用户信息吗？</big>', {icon: 3, title:'<span style="color:#2679b5;"><big>提示信息</big></span>'},
			function(index){
				$.ajax({
					type:'POST',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					url: window.BASE_API_URL + "sysUser/unLockSysUser.do",
					data: {
						userIdArr : arr_unlock
					},
					dataType : 'json',
					async: false,
					globle: false,
					beforeSend: function(){
						//msgId = layerMsg("删除外网地址信息中......");
					},
					beforeRequest : function(){
						layer.load(3);
					},
					success: function(data){
						if(data.status == "S"){
							$("#yhgl_gridtable").trigger("reloadGrid");
							//ajaxSuccessAlert("解锁成功，共解锁 "+selectRows.length+" 条用户信息 !");
							ajaxSuccessAlert("解锁成功，共解锁 "+"1 条用户信息 !");
							yhglQuery(layer);
						}else if(data.status == "F"){
							ajaxSuccessAlert(data.msg);
						}else if(data.status == "T"){
							window.top.location.href = '../../login.html';
						}
					},
					complete: function(){
						layer.close();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown){
						//layuiAlert("操作失败!");
						ajaxSuccessAlert("操作失败!");
					}
				});
			});
	}

};


/**
 * 返回字符串的实际长度, 一个汉字算2个长度 
 */
function strlen(str){ 
	return str.replace(/[^\x00-\xff]/g, "**").length; 
} 
/**
 * 获取是否需要切换多个机构标识
 */
function jgcheck(){
	$.ajax({
		url:"../../login/jgCheck.action",
		type:"post",
		async:false,
		dataType:'json',
		success:function(data){
			isjg = data.jg;
			if(isjg == "0"){
				$("#add_Jg").remove();
			}
		}
	});
}

/**
 * @Describe ajax请求beforeSend（遮罩层）
 */
function layerMsg(msg){
	var msgId = layer.msg('<big>' +msg+ '</big>', {
		icon: 16,
		shade: 0.5,
   		title: '<span style="color:#2679b5;"><big>提示信息</big></span>',
		time: 1000000,
		zIndex: layer.zIndex
	});
	return msgId;
}

