var rowDta_role = null,cbtnArr = window.top.buttonAuth;
var colMap = {
    //colNames : ['roleid','jszt','bmid','角色名称','角色id','角色状态','操作','组织机构','角色描述', '创建人', '创建时间'],
    colNames: ['id', '', '角色名称', '组织机构', '角色属性', '角色状态', '角色描述', '操作', '创建时间'],
    colModel: [
        {name: 'id', index: 'id', width: "10%", hidden: true},
        {name: 'deptId', index: 'deptId', width: "10%", hidden: true},
        {name: 'roleName', index: 'roleName', width: "13%", align: 'left', sortable: false},
        {name: 'deptName', index: 'deptName', width: "18%", align: 'left', sortable: false},
        {
            name: 'roleType',
            index: 'roleType',
            width: "13%",
            align: 'center',
            sortable: false,
            formatter: function (cellvalue, options, rowObject) {
                if (cellvalue == 1) {
                    return "机构角色"
                } else {
                    return "系统角色"
                }
            }
        },

        {
            name: 'status',
            index: 'status',
            width: "15%",
            align: 'center',
            sortable: false,
            formatter: function (cellvalue, options, rowObject) {
                if (cellvalue == 1) {
                    return "启用"
                } else {
                    return "禁用"
                }

            }
        },
        {name: 'description', index: 'description', width: "30%", align: 'center', sortable: false},
        {
            name: '操作', index: 'cb', width: '20%', align: 'center',sortable: false, formatter: function (value, gird, rows, state) {
            return "<a href='#' btncode='103050' class='btn_look jgoption "+ ($.inArray('103050',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' )+"' title='查看' style='' onclick='' >" +
                "<i data-method='btn_look' class='btn-ev fa fa-file-text pointer' style='font-size: 14px !important;'></i>" +
                "</a>" +
                "<a href='#' btncode='103030' class='btn_edit jgoption "+ ($.inArray('103030',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' )+"' title='编辑' style='padding-left: 5px;'>" +
                "<i data-method='btn_edit' class='btn-ev  fa fa-pencil-square-o' style='font-size: 14px !important;'></i> " +
                "</a>" +
                "<a href='#' btncode='103040' class='btn_deleteBatch jgoption "+ ($.inArray('103040',cbtnArr) == -1 ? 'lock_hide' : 'lock_show' )+"' title='删除' style=''>" +
                "<i data-method='btn_deleteBatch' class='btn-ev  fa fa-trash' style='font-size: 15px !important;'></i>" +
                "</a>"
        }
        },
        {
            name: 'createTime',
            index: 'createTime',
            width: "22%",
            align: 'center',
            sortable: true,
            sortorder: 'desc',
            formatter: function (value, gird, rows, state) {
                return new Date(value).Format("yyyy-MM-dd hh:mm:ss")
            }
        }
    ]
};
$(document).ready(function () {
    initGrid();//初始化界面
    initButton();//初始化按钮
    collapseLink();//修改折叠事件的绑定
    initAisinoCheck("xz_wwdz_form");//初始化这个form的校验
});
//获取查询参数，只提交有用数据
function getQueryMap() {
    var rtnMap = {};
    rtnMap["pageIndex"] = 1;
    rtnMap["pageSize"] = 10;
    rtnMap["deptIdStr"] = $.trim($("#organId").val());
    rtnMap["roleName"] = $.trim($("#jsmc").val());
    rtnMap["roleType"] = $.trim($("#js_wzlx option:selected").val());
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
                queryAllRoleByPage();
            },
            //新增
            btn_add: function () {
                openAddDialog();
                //创建树之前销毁树
                $.jstree.destroy('#dialogMenuTree');
                var addWwdz = layer.open({
                    type: 1,
                    title: "<big>角色管理-新增</big>",
                    //area: ['800px', 'auto'],
                    area: ['800px', '600px'],
                    shade: [0.6, '#393D49'],
                    shadeClose: false,
                    maxmin: true,
                    resize: false,//是否允许拉伸
                    content: $('#xz_wwdz'),
                    btn: ['保存', '取消'],//只是为了演示
                    yes: function () {
                        if ($.trim($("#dialogRoleName").val()) == "") {
                            layer.msg('角色名称不能为空！', {zIndex: layer.zIndex});
                            $("#dialogRoleName").focus();
                            return false;
                        }
                        else if (getELength($.trim($("#dialogRoleName").val())) < 1 || getELength($.trim($("#dialogRoleName").val())) > 50) {
                            layer.msg('请输入长度为1~50位角色名称！', {zIndex: layer.zIndex});
                            $("#dialogRoleName").focus();
                            return false;
                        }
                        ;
                        //if($.trim($("#bmmc").val())==""){
                        //	layer.msg('组织机构不能为空！', {zIndex: layer.zIndex});
                        //	$("#bmmc").focus();
                        //	return false;
                        //}

                        if (getELength($.trim($("#dialogDescription").val())) > 500) {
                            layer.msg('角色描述不能大于500个字符，请重新录入！', {zIndex: layer.zIndex});
                            $("#dialogDescription").focus();
                            return false;
                        }
                        var Arr = [];
                        var nodeObj = $('#dialogMenuTree').jstree().get_checked(true);
                        $.each(nodeObj, function (i, value) {
                            Arr.push(value.id);
                            //$.each(value.parents,function (k,v) {
                            //    if( Arr.indexOf(v) == -1 ){
                            //        Arr.push(v);
                            //    }
                            //
                            //})
                            //if( Arr.indexOf(value.id) == -1 ){
                            //    Arr.push(value.id);
                            //}
                        })
                        //nodeObj.splice( $.inArray("#",nodeObj),1 )

                        //console.log('Arr == ',Arr);
                        $.ajax({
                            url: window.BASE_API_URL + "sysRole/addSysRole.do ",
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            data: {
                                "roleName": $.trim($("#dialogRoleName").val()),//角色名称
                                //"deptId" : $.trim($("#bmmc_id").val()),//组织机构
                                "deptId": $.trim($("#bmmc_id").val()),//组织机构
                                "description": $.trim($("#dialogDescription").val()),//描述
                                "status": $.trim($("#jszt input:checked").val()),//状态
                                "roleType": $.trim($("#jssx option:selected").val()),
                                "authIdArr": Arr
                            },
                            type: 'post',
                            dataType: 'json', beforeSend: function () {
                                $("#bgFilter").css("display", "block");
                                $("#loadingProgress").css("display", "block");
                            },
                            beforeRequest : function(){
                                layer.load(3);
                            },
                            success: function (data) {
                                if (data.status == "S") {
                                    layer.closeAll();
                                    layer.msg('添加角色成功!', {zIndex: layer.zIndex});
                                    queryAllRoleByPage();
                                } else if (data.status == "F") {
                                    layuiAlert(data.msg, {btn: ['关闭']});
                                    $(this).removeAttr("disabled");
                                } else if (data.status == "T") {
                                    window.top.location.href = "../../login.html";
                                }
                            },
                            complete: function () {
                                $("#bgFilter").css("display", "none");
                                $("#loadingProgress").css("display", "none");
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                $(this).removeAttr("disabled");
                                $(this).attr("disabled", false);
                                layer.msg('操作失败请联系管理员!', {zIndex: layer.zIndex});
                            }
                        });
                        //wwdzAdd(layer,addWwdz);
                    },
                    btn2: function () {
                        //layer.closeAll();
                        $("input[name='res']").click();
                        //$("#xz_wwdz_form").reset();
                        emptyRole();
                    },
                    zIndex: 1000, //控制层叠顺序
                    success: function (layero) {
                        layer.setTop(layero); //置顶当前窗口
                    }
                });
            },
            //编辑
            btn_edit: function () {
                //创建树之前销毁树
                $.jstree.destroy('#dialogMenuTree');
                    openModifyDialog();
                    //$("#js-title").hide();
                    var editWwdz = layer.open({
                        type: 1,
                        title: "<big>角色管理-编辑</big>",
                        //area: ['800px', 'auto'],
                        area: ['800px', '600px'],
                        shade: [0.6, '#393D49'],
                        shadeClose: false,
                        maxmin: true,
                        resize: true,//是否允许拉伸
                        content: $('#xz_wwdz'),
                        btn: ['保存', '取消'],//只是为了演示
                        yes: function () {
                            if ($.trim($("#dialogRoleName").val()) == "") {
                                layer.msg('角色名称不能为空！', {zIndex: layer.zIndex});
                                $("#dialogRoleName").focus();
                                return false;
                            }
                            else if (getELength($.trim($("#dialogRoleName").val())) < 1 || getELength($.trim($("#dialogRoleName").val())) > 50) {
                                layer.msg('请输入长度为1~50位角色名称！', {zIndex: layer.zIndex});
                                $("#dialogRoleName").focus();
                                return false;
                            }

                            //if ($.trim($("#bmmc").val()) == "") {
                            //	layer.msg('组织机构不能为空！', {zIndex: layer.zIndex});
                            //	$("#bmmc").focus();
                            //	return false;
                            //}

                            if (getELength($.trim($("#dialogDescription").val())) > 500) {
                                layer.msg('角色描述不能大于500个字符，请重新录入！', {zIndex: layer.zIndex});
                                $("#dialogDescription").focus();
                                return false;
                            }
                            var Arr = [];
                            var nodeObj = $('#dialogMenuTree').jstree().get_checked(true);
                            $.each(nodeObj, function (i, value) {
                                Arr.push(value.id);
                                //$.each(value.parents,function (k,v) {
                                //    if( Arr.indexOf(v) == -1 ){
                                //        Arr.push(v);
                                //    }
                                //
                                //})
                                //if( Arr.indexOf(value.id) == -1 ){
                                //    Arr.push(value.id);
                                //}
                            })
                            //Arr.splice( $.inArray("#",Arr),1 )
                            //console.log("idid",Arr);

                            //if (Arr.length == 0) {
                            //    layer.msg("请选择角色权限！")
                            //    return false;
                            //}
                            $.ajax({
                                url: window.BASE_API_URL + "sysRole/editSysRole.do",
                                xhrFields: {
                                    withCredentials: true
                                },
                                crossDomain: true,
                                data: {
                                    "id": rowDta_role.id,
                                    "roleName": $.trim($("#dialogRoleName").val()),//角色名称
                                    //"deptId" : $.trim($("#bmmc_id").val()),//组织机构
                                    "deptId": $.trim($("#bmmc_id").val()),//组织机构
                                    "description": $.trim($("#dialogDescription").val()),//描述
                                    "status": $.trim($("#jszt input:checked").val()),//状态
                                    "roleType": $.trim($("#jssx option:selected").val()),
                                    "authIdArr": Arr
                                },
                                type: 'post',
                                dataType: 'json',
                                beforeSend: function () {
                                    $("#bgFilter").css("display", "block");
                                    $("#loadingProgress").css("display", "block");
                                },
                                beforeRequest : function(){
                                    layer.load(3);
                                },
                                success: function (data) {
                                    if (data.status == "S") {
                                        layer.closeAll();
                                        $("#wwdz_gridtable").trigger("reloadGrid");
                                        layer.msg('修改角色成功!', {zIndex: layer.zIndex});
                                        queryAllRoleByPage();
                                    } else if (data.status == "F") {
                                        layuiAlert(data.msg, {btn: ['关闭']});
                                    } else if (data.status == "T") {
                                        window.top.location.href = "../../login.html";
                                    }
                                },
                                complete: function () {
                                    $("#bgFilter").css("display", "none");
                                    $("#loadingProgress").css("display", "none");
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    layer.msg('操作失败请联系管理员!', {zIndex: layer.zIndex});
                                }
                            });
                            //wwdzAdd(layer,editWwdz);
                        },
                        btn2: function () {
                            layer.closeAll();
                            $("input[name='res']").click();
                            //$("#xz_wwdz_form").reset();
                        },
                        zIndex: 1000, //控制层叠顺序
                        success: function (layero) {
                            layer.setTop(layero); //置顶当前窗口
                        }
                    });
                //}

            },
            //查看
            btn_look: function () {
                //创建树之前销毁树
                $.jstree.destroy('#dialogMenuTree');
                    openLookDialog(layer);
            },
            //删除
            btn_delete: function () {
                deleteDialog('batch');
            },
            btn_deleteBatch: function () {
                deleteDialog();

            }
        };
        $('.role-cont').on('click', '.btn-ev', function () {
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
    });
}
/**
 * 查询
 */
function queryAllRoleByPage() {
    var layer = layui.layer;
    $("#wwdz_gridtable").setGridParam({
        page: 1,
        beforeRequest : function(){
            layer.load(3);
        },
        //url: window.BASE_API_URL + "sysRole/querySysRolePage.do",
        datatype: "json",
        postData: getQueryMap(),
        gridComplete : function(){
            layer.closeAll("loading");
        }
    }).trigger("reloadGrid")
}
//默认查询显示列表
function initGrid() {
        window.defaultGridConfig = {
            ajaxGridOptions: {
                url: window.BASE_API_URL + "sysRole/querySysRolePage.do",
                type: "post",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true
            },
            prmNames: {
                "page": "pageIndex",
                "rows": "pageSize",
                "sord": ""
            },
            postData: {
                "deptIdStr": $.trim($(".search_role #organId").val()),//组织机构
                //"deptIdStr": cookie.get("deptId"),//组织机构
                "userId": $.trim($("#txt_yhid").val()), //登录账号
                "lockStatus": $.trim($("#select_sdbj option:selected").val()),//锁定标记
            },
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
                rowDta_role = $("#wwdz_gridtable").jqGrid("getRowData", rowid);
                //return (cm[i].name === 'cb');
                if (cm[i].index === 'cb') {
                    return false;
                } else {
                    return true;
                }
            },
            loadComplete: function (data) {
                if (data.status == "T") {
                    window.top.location.href = '../../login.html';
                }
                var grid = $("#wwdz_gridtable");
                var ids = grid.getDataIDs();
                for (var i = 0; i < ids.length; i++) {
                    grid.setRowData(ids[i], false, {height: 35});
                }
            },
            gridComplete: function () {
                load("loading");
            },
            jsonReader: {
                id: "id",//设置返回参数中，表格ID的名字为blackId
                page: "data.pageIndex",
                root: "data.rows",
                total: function (obj) {
                    if (obj.data == null) {
                        return false;
                    }
                    return Math.ceil(obj.data.total / obj.data.pageSize);
                },
                records: "data.total",
                repeatitems: false
            },
            pager: '#wwdz_pager'
        };
        $("#wwdz_gridtable").jqGrid(defaultGridConfig).trigger('reloadGrid');
        setTimeout(function () {
            updatePagerIcons($("#wwdz_gridtable"));//加载底部栏图标
        }, 0);
        resizeJqGrid("wwdz_gridtable");
}
/**
 * 运行中提示
 */
function wwdzAdd(layer, layerId) {
    layer.msg('运行中', {
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
}
function emptyRole() {
    $("#dialogRoleName").val(""); //角色名称
    $("#dialogDescription").val("");
    $("#bmmc").val("");
    $("#bmmc_id").val("");
    $("#jssx").val('1');
    $("#jssx").find("option[value='1']").attr("selected",true);
    $("#role_jg").show();
    $('#dialogRoleName').removeAttr('disabled');
    $('#jssx').removeAttr('disabled');
    $('.add_role #bmmc').removeAttr('disabled');
    $('#dialogDescription').removeAttr('disabled');
    $('#dialogMenuTree').removeAttr('disabled');
}

//打开新增弹框
function openAddDialog() {
    emptyRole();
    $("#jssx option[value='1']").attr("selected", "selected").siblings().removeAttr("selected");
    $('input, textarea').placeholder();
    $("#jszt").find("input[type = checkbox]").bind("click", function () {
        $('#jszt').find('input[type = checkbox]').not(this).attr("checked", false);
    });

    $.ajax({
        url: window.BASE_API_URL + "index/initMenu.do",
        type: 'post',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: 'json',
        beforeSend: function () {
            $("#bgFilter").css("display", "block");
            $("#loadingProgress").css("display", "block");
        },
        success: function (data) {
            if (data.status == 'T') {
                window.top.location.href = '../../login.html';
                return;
            }
            var resultAdd = [];
            var item = data.data;
            if (item.length > 0) {
                var length = item.length;
                for (var i = 0; i < length; i++) {
                    resultAdd.push({
                        'id': item[i].id,
                        'name': item[i].authName,
                        'parent': item[i].parentId == '0' ? '#' : item[i].parentId,
                        'text': item[i].authName,
                        'state': {'selected': false},
                    });

                }
            }

            $('#dialogMenuTree').jstree({
                'core': {
                    'data': resultAdd
                },

                "plugins": [
                    "checkbox"
                ],
                });

        },
        complete: function () {
            $("#bgFilter").css("display", "none");
            $("#loadingProgress").css("display", "none");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('操作失败请联系管理员!', {zIndex: layer.zIndex});
        }
    });
    $('#jssx').off("change");
    $("#jssx").change(function () {
        var role_val = $(this).children("option:selected").val();
        if (role_val == "0") {
            $("#role_jg").hide();
            $(".add_role #bmmc").val("");
            $(".add_role #bmmc_id").val("");
        } else {
            $("#role_jg").show();
        }
    });
}

//打开查看弹框
function openLookDialog(layer) {
    emptyRole();
    $('#dialogRoleName').attr('disabled','disabled');
    $('#jssx').attr('disabled','disabled');
    $('.add_role #bmmc').attr('disabled','disabled');
    $('#dialogDescription').attr('disabled','disabled');
    $('#dialogMenuTree').attr('disabled','disabled');
    //console.log("rrrrr",rowDta_role);
    //var id = $("#wwdz_gridtable").jqGrid("getGridParam", "selrow");
    //var rowData = $("#wwdz_gridtable").jqGrid("getRowData", id);
    var ckjsxx = layer.open({
        type: 1,
        title: "<big>查看信息</big>",
        //area: ['800px', 'auto'],
        area: ['800px', '600px'],
        shade: [0.3, '#393D49'],
        shadeClose: false,
        maxmin: true,
        resize: true,//是否允许拉伸
        content: $('#xz_wwdz'),//显示一个块里面的内容
        //btn: ['<big>关闭</big>'],
        btn: ['关闭'] ,
        cancel: function () { //右上角关闭按钮
            $("#xz_ipdzmc").val("");
            $("#xz_ipdz").val("");
            $("#xz_wzqy").val("");
            $("#xz_ms").val("");
            $("#xz_dlfwyh").val("");
            $("#xz_dlfwmm").val("");
            $("#xz_ludk").val("");
            $("#xz_version").val("");
            $("#dialogRoleName").val("");
            $("#dialogDescription").val("");
        },
        //closeBtn: 2,关闭按钮样式
        //btnAlign: 'l',// 'c' 'r' 按钮排序方式
        zIndex: layer.zIndex, //控制层叠顺序
        success: function (layero, index) {//弹层成功回调方法
            layer.setTop(layero); //置顶当前窗口

        }
    });

    $.ajax({
        url: window.BASE_API_URL + "sysRole/querySysRoleDetail.do",
        //data: getRoleid(),
        data: {id : rowDta_role.id},
        type: 'post',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        beforeRequest : function(){
            layer.load(3);
        },
        globle: false,
        error: function () {
            layer.msg('数据处理错误', {zIndex: layer.zIndex});
            return false;
        },
        beforeSend: function () {
            $("#bgFilter").css("display", "block");
            $("#loadingProgress").css("display", "block");
        },
        success: function (data) {

            if(data.status == "T"){
                window.top.location.href = '../../login.html';
                return;
            }
            var sysAuthorityList = data.data.sysAuthorityList;
            $.ajax({
                url: window.BASE_API_URL + "index/initMenu.do",
                type: 'post',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                dataType: 'json',
                success: function (data) {
                    if (data.status == 'T') {
                        window.top.location.href = '../../login.html';
                        return;
                    }
                    var treeData = data.data;
                    var result = [];
                    if (treeData) {
                        var treeDataLength = treeData.length;
                        for (var i = 0; i < treeDataLength; i++) {
                            treeData[i].flag = false;
                            if (sysAuthorityList) {
                                var sysAuthorityListLength = sysAuthorityList.length;
                                for (var j = 0; j < sysAuthorityListLength; j++) {
                                    if (sysAuthorityList[j].id == treeData[i].id) {
                                        treeData[i] = sysAuthorityList[j];
                                        treeData[i].flag = true;
                                    }

                                }
                            }
                            result.push({
                                'id': treeData[i].id,
                                'name': treeData[i].authName,
                                'parent': treeData[i].parentId == 0 ? '#' : treeData[i].parentId,
                                'text': treeData[i].authName,
                                'state': {'selected': treeData[i].flag}
                            });

                        }
                    }
                    $('#dialogMenuTree').jstree({
                        'core': {
                            'data': result
                        },
                        "plugins": [
                            "checkbox"
                        ],

                    });
                }
            });
            updateRole();
        },
        complete: function () {
            $("#bgFilter").css("display", "none");
            $("#loadingProgress").css("display", "none");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('操作失败请联系管理员!', {zIndex: layer.zIndex});
        }
    });

}

/**
 * 删除
 * @return
 */
function deleteDialog(type) {
    if(type == 'batch'){
        var selectRows = $("#wwdz_gridtable").jqGrid("getGridParam", "selarrrow");
        if(selectRows.length == 0){
            layuiAlert('请选中一行，再进行删除！', {btn: ['关闭']});
            return;
        }
        else{
            layer.confirm('确定要删除这 ' + selectRows.length + ' 条数据吗？', {icon: 3, title: '删除角色信息提示'},
            function ok(data) {
                    $(this).attr("disabled", true);
                    $.ajax({
                        type: 'POST',
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        url: window.BASE_API_URL + "sysRole/deleteSysRole.do",
                        data: {
                            idArr: selectRows
                        },
                        dataType: 'json',
                        async: false,
                        globle: false,
                        beforeRequest : function(){
                            layer.load(3);
                        },
                        error: function () {
                            $(this).removeAttr("disabled");
                            layer.msg('数据处理错误！', {zIndex: layer.zIndex});
                            return false;
                        },
                        beforeSend: function () {
                            $("#bgFilter").css("display", "block");
                            $("#loadingProgress").css("display", "block");
                        },
                        success: function (data) {
                            if (data.status == "S") {
                                //layer.msg('删除成功,共删除' + selectRows.length + '条角色!', {zIndex: layer.zIndex});
                                layer.msg('删除成功,共删除' +  '1条角色!', {zIndex: layer.zIndex});
                                $(this).removeAttr("disabled");
                                queryAllRoleByPage();
                            } else if(data.status == "F") {
                                layer.msg(data.msg);
                                $(this).removeAttr("disabled");
                            }else if(data.status == "T"){
                                window.top.location.href = '../../login.html';
                            }
                        },
                        complete: function () {
                            $("#bgFilter").css("display", "none");
                            $("#loadingProgress").css("display", "none");
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            layer.msg('操作失败请联系管理员!', {zIndex: layer.zIndex});
                            $(this).removeAttr("disabled");
                        }
                    });
                });
        }
    }else{
        var arr_role = [];
        console.log("sss",rowDta_role);
        arr_role.push(rowDta_role.id);
        layer.confirm('确定要删除这 ' +  ' 1条数据吗？', {icon: 3, title: '删除角色信息提示'},
            function ok(data) {
                $(this).attr("disabled", true);
                $.ajax({
                    type: 'POST',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    url: window.BASE_API_URL + "sysRole/deleteSysRole.do",
                    data: {
                        idArr: arr_role
                    },
                    dataType: 'json',
                    async: false,
                    globle: false,
                    error: function () {
                        $(this).removeAttr("disabled");
                        layer.msg('数据处理错误！', {zIndex: layer.zIndex});
                        return false;
                    },
                    beforeSend: function () {
                        $("#bgFilter").css("display", "block");
                        $("#loadingProgress").css("display", "block");
                    },
                    beforeRequest : function(){
                        layer.load(3);
                    },
                    success: function (data) {
                        if (data.status == "S") {
                            //layer.msg('删除成功,共删除' + selectRows.length + '条角色!', {zIndex: layer.zIndex});
                            layer.msg('删除成功,共删除' +  '1条角色!', {zIndex: layer.zIndex});
                            $(this).removeAttr("disabled");
                            queryAllRoleByPage();
                        } else if(data.status == "F"){
                            layer.msg(data.msg);
                            $(this).removeAttr("disabled");
                        }else if(data.status == "T"){
                            window.top.location.href = '../../login.html';
                        }
                    },
                    complete: function () {
                        $("#bgFilter").css("display", "none");
                        $("#loadingProgress").css("display", "none");
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.msg('操作失败请联系管理员!', {zIndex: layer.zIndex});
                        $(this).removeAttr("disabled");
                    }
                });
            });
    }
}

//打开修改弹框
function openModifyDialog() {
    emptyRole();
    $('input, textarea').placeholder();
     //角色状态
    $("#jszt").find("input[type = checkbox]").bind("click", function () {
        $('#jszt').find('input[type=checkbox]').not(this).attr("checked", false);
    });

    $.ajax({
        url: window.BASE_API_URL + "sysRole/querySysRoleDetail.do",
        //data: getRoleid(),
        data: {id : rowDta_role.id},
        type: 'post',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        beforeRequest : function(){
            layer.load(3);
        },
        //async: false,
        globle: false,
        error: function () {
            layer.msg('数据处理错误', {zIndex: layer.zIndex});
            return false;
        },
        beforeSend: function () {
            $("#bgFilter").css("display", "block");
            $("#loadingProgress").css("display", "block");
        },
        success: function (data) {
            if (data.status == 'T') {
                window.top.location.href = '../../login.html';
                return;
            }
            var sysAuthorityList = data.data.sysAuthorityList;
            $.ajax({
                url: window.BASE_API_URL + "index/initMenu.do",
                type: 'post',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                dataType: 'json',
                success: function (data) {
                    if (data.status == 'T') {
                        window.top.location.href = '../../login.html';
                        return;
                    }
                    var treeData = data.data;
                    var result = [];
                    if (treeData) {
                        var treeDataLength = treeData.length;
                        for (var i = 0; i < treeDataLength; i++) {
                            treeData[i].flag = false;
                            if (sysAuthorityList) {
                                var sysAuthorityListLength = sysAuthorityList.length;
                                for (var j = 0; j < sysAuthorityListLength; j++) {
                                    if (sysAuthorityList[j].id == treeData[i].id) {
                                        treeData[i] = sysAuthorityList[j];
                                        treeData[i].flag = true;
                                    }

                                }
                            }
                            result.push({
                                'id': treeData[i].id,
                                'name': treeData[i].authName,
                                'parent': treeData[i].parentId == 0 ? '#' : treeData[i].parentId,
                                'text': treeData[i].authName,
                                'state': {'selected': treeData[i].flag}
                            });

                        }
                    }

                        $('#dialogMenuTree').jstree({
                            'core': {
                                'data': result
                            },
                            "plugins": [
                                "checkbox"
                            ],

                        });

                }
            });
            updateRole();

        },
        complete: function () {
            $("#bgFilter").css("display", "none");
            $("#loadingProgress").css("display", "none");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('操作失败请联系管理员!', {zIndex: layer.zIndex});
        }
    });

}
//修改角色信息
function updateRole() {
    //var id = $("#wwdz_gridtable").jqGrid("getGridParam", "selrow");
    //var rowData = $("#wwdz_gridtable").jqGrid("getRowData", id);
    var rowData = rowDta_role;
    $("#dialogRoleName").val(rowData.roleName);
    $("#bmmc").val(rowData.deptName);
    $("#bmmc_id").val(rowData.deptId);
    $("#dialogDescription").val(rowData.description);

    if (rowData.status == "启用") {
        $("#jszt input:checkbox[value=1]").prop("checked", "true").parent().siblings().children().removeAttr("checked");
    } else if (rowData.status == "禁用") {
        $("#jszt input:checkbox[value=0]").prop("checked", "true").parent().siblings().children().removeAttr("checked");
    }
    // $("#jssx option[value='"+ rowData.roleType+"']").attr("selected",true);
    if (rowData.roleType == "机构角色") {
        $("#jssx option[value='1']").attr("selected", "selected").siblings().removeAttr("selected");
        $("#role_jg").show()
    } else if (rowData.roleType == "系统角色") {
        $("#jssx option[value='0']").attr("selected", "selected").siblings().removeAttr("selected");
        $("#role_jg").hide()
    };
    $('#jssx').off("change");
    $("#jssx").change(function () {
        var role_val = $(this).children("option:selected").val();
        if (role_val == "0") {
            $("#role_jg").hide();
            $(".add_role #bmmc").val("");
            $(".add_role #bmmc_id").val("");
        } else {
            $("#role_jg").show();
        }
    });

}
//获取角色id
function getRoleid() {
    var map = {};
    var id = $("#wwdz_gridtable").jqGrid("getGridParam", "selrow");
    var rowData = $("#wwdz_gridtable").jqGrid("getRowData", id);
    map["id"] = rowData.id;
    return map;
}
