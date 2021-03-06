/**
 * 公用js文件
 */
/**
 * ACE jQgrid 加载底部栏图标s
 */
//jQuery.support.cors = true;
$(document).ready(function (){
    ishasKpd();
    //if(window.top.buttonAuth){
    //    isBtnAuth();
    //}
    setTimeout(function () {
        isBtnAuth();
    },0)
});

function updatePagerIcons(table) {
    var replacement = {
        'ui-icon-seek-first': 'ace-icon fa fa-angle-double-left bigger-140',
        'ui-icon-seek-prev': 'ace-icon fa fa-angle-left bigger-140',
        'ui-icon-seek-next': 'ace-icon fa fa-angle-right bigger-140',
        'ui-icon-seek-end': 'ace-icon fa fa-angle-double-right bigger-140'
    };
    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
    });
}
/**
 * 关闭当前显示的页面，跳回第一页签
 */
function closeCurrentPage() {
    window.parent.$("#menuTabs span.active").click();
}

//判断浏览器是否全屏
function f_IsFullScreen() {
    return (document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width);
};

//判断是否为空
function isEmpty(parameter){
    if(parameter==null||parameter==undefined||parameter==="")
    {
        return true;
    }
    return false;
}

/**
 * 窗口缩放事件绑定,调整jqgrid自适应窗口大小
 */
function resizeJqGrid(gridTableId) {
       window.onresize = function doResize() {
        var ps = pageSize();
        if (f_IsFullScreen()){
            $("#" + gridTableId).jqGrid('setGridWidth', ps.winWidths-20).jqGrid('setGridHeight', ps.winHeights-180);
            return false;
        }
        $("#" + gridTableId).jqGrid('setGridWidth', ps.winWidths - 40).jqGrid('setGridHeight', ps.winHeights - 180);
    }
}

function pageSize() {
    var winWidth, winHeight;
    if (window.innerHeight) {// all except IE
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {// IE 6 Strict Mode
        winWidth = document.documentElement.clientWidth;
        winHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other
        winWidth = document.body.clientWidth;
        winHeight = document.body.clientHeight;
    }//for small pages with total size less then the viewport
    return {winWidths: winWidth, winHeights: winHeight};
}
/**
 * @Describe 修改折叠事件的绑定
 */
function collapseLink() {
    $('.collapse-link').off("click");
    $('.collapse-link').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.form-horizontal');

        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(300, function () {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(300, function () {
                $BOX_PANEL.css({"padding-bottom": "0px", "margin-bottom": "0px"});
            });
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });
}

//获取机构树
var userTaxNo = '', commonFlag = true;
var user_temp = "";
var user_tempId = "";
function getOrgTree(treeClass, parClass, user, isCallback) {
    //$.jstree.destroy('.' + treeClass);
    $('.' + treeClass).show();
    if ($('.' + parClass).attr("data-method") == "search") {
            $('.' + treeClass).jstree({
                'core': {
                    'data': window.top.result
                },
                //'multiple': false,
                "plugins": ["checkbox"],
                //"checkbox": {
                //    "keep_selected_style": true,//是否默认选中
                //    "three_state": true,//父子级别级联选择
                //    "tie_selection": false
                //}
            });
            var arr = [];
            $('.' + treeClass).off("changed.jstree");
            $('.' + treeClass).on('changed.jstree', function (e, data) {
                user_temp = '';
                user_tempId = '';
                var selNode = $('.' + treeClass).jstree().get_checked(true);
                var userName = $('.' + parClass + '> .organName').val();
                arr = userName.split(',');
                if(selNode.length != 0){
                    $.each(selNode, function (i,val) {
                        user_temp = user_temp + ','+ val.text;
                        if (user_temp.substr(0, 1) == ',') {
                            user_temp = user_temp.substr(1);
                        }
                        user_tempId = user_tempId + ',' + val.id;
                        if (user_tempId.substr(0, 1) == ',') {
                            user_tempId = user_tempId.substr(1);
                        }
                    })
                }else{
                    user_temp = '';
                    user_tempId = '';
                }

                $('.' + parClass + '> .organName').val(user_temp);
                $('.' + parClass + '> .organId').val(user_tempId);
                if(isCallback=='xxgl'){
                    callbackMethod(user_tempId);
                }
            });
    }
    else {
        $('.' + treeClass).jstree({
            'core': {
                'data': window.top.result
            }
        });

        $('.' + treeClass).off("changed.jstree");
        $('.' + treeClass).on('changed.jstree', function (e, data) {
            $('.' + parClass + '> .organName').val(data.node.text);
            $('.' + parClass + '> .organId').val(data.node.id);
            $('.' + treeClass).hide();
            if (user == "") {
                if(isCallback=='true'){
                    callbackMethod(data.node.id);
                }
            } else {
                for (var i = 0; i < window.top.length; i++) {
                    //window.top.taxNo = list[i].taxNo;
                    userTaxNo = window.top.list[i].taxNo;
                    if (window.top.list[i].deptName == data.node.text) {
                        if ($("#" + user + " " + ".mparentDeptCode")) {
                            $("#" + user + " " + ".mparentDeptCode").val(window.top.list[i].deptCode);
                        }
                        else if($("#" + user + " " + ".mtaxNo")){
                            $("#" + user + " " + ".mtaxNo").val("");
                        }
                        $("#" + user + " " + ".mparentTaxNo").val(window.top.list[i].taxNo);
                        if(isCallback=='true'){
                            callbackMethod(data.node.id);
                        }
                        else if(isCallback == 'taxNo'){
                            backSellerTaxNo(window.top.list[i].taxNo,!commonFlag);
                        }
                        return
                    }
                }
            }

        });
    }
    $('.' + parClass + '> .organName').attr("title",user_temp);//修改title值
}

//隐藏机构树
function hideTree(treeClass) {
    setTimeout(function () {
        $('.' + treeClass).hide();
    }, 200)
}

//清空上级机构
function clearOrg(parClass,parTree,flag) {
    var organName = $('.' + parClass + '> .organName').val();//上级机构名称
    if (organName == "") {
        $('.' + parClass + '> .organId').val('');
        $('#' + parTree + ' .mparentTaxNo').val('');
        $('#' + parTree + ' .mparentDeptCode').val('');
        $('#' + parTree + ' .mtaxNo').val('');
        $('#' + parTree + ' #sellerName').val('');
        userTaxNo = '';
        if(flag == 'yhFlag'){
            backSellerTaxNo('',!commonFlag);
        }
    }
}

// 机构title
function doSet(parClass){
    $('.' + parClass + '> .organName').attr("title",user_temp);//修改title值
}
function layuiAlert(alertMsg) {
    layer.alert('<big>' + alertMsg + '</big>', {
        icon: 0,
        title: '<span style="color:#2679b5;"><big>提示信息</big></span>',
        skin: 'layer-ext-moon', //该皮肤由layer.seaning.com友情扩展。
        zIndex: layer.zIndex,
    });
}

function ajaxSuccessAlert(alertMsg, layerId) {
    layer.close(layerId);
    layer.alert('<big>' + alertMsg + '</big>', {
        icon: 6,
        title: '<span style="color:#2679b5;"><big>提示信息</big></span>',
        skin: 'layer-ext-moon', //该皮肤由layer.seaning.com友情扩展。
        zIndex: layer.zIndex
    });
}

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

////将时间戳转化标准格式 yyyy-MM-dd
//function formatDate(time)   {
//    var date= new Date(time);
//    var   year=date.getYear()+1900;
//    var   month=date.getMonth()+1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
//    var   date=date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
//    return   year+"-"+month+"-"+date;
//};
// yyyy-MM-dd HH:mm:ss
function timeStamp2String(time){
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
}

// 判断当前用户是否有开票点信息
function ishasKpd(){
    var userMessage = window.top.GlobalYh;
    if( userMessage.userAuthType == '2' ){
        $('div[data-method = search] .organId').val(userMessage.deptId);
        $('div[data-method = search] .organName').val(userMessage.deptName);
        $('div[data-method = search] .organName').attr("disabled","disabled");
        $('#xxfpcxtj_billingNo').hide();
    }else{
        $('div[data-method = search] .organName').removeAttr("disabled");
        $('div[data-method = search] .organId').val('');
        $('#xxfpcxtj_billingNo').show();
    }

}

// 判断按钮权限
var btnArr = [];
function isBtnAuth() {
    setTimeout(function () {
        var btnCodes = window.top.buttonAuth;
        $("#LAY_demo button").each(function (index, item) {
            var btnTemp = ($(this).attr('btncode'));
            btnArr.push(btnTemp);
        });
        $.each(btnArr, function (k, val) {
            //if (btnCodes.indexOf(val) == -1) {
            if ($.inArray(val,btnCodes) == -1) {
                $("#LAY_demo button[btncode = " + val + "]").addClass('layui-btn-disabled');
                $("#LAY_demo button[btncode = " + val + "]").hide();
            } else {
                $("#LAY_demo button[btncode = " + val + "]").removeClass('layui-btn-disabled');
                //$('#LAY_demo').show();
                $('#LAY_demo').css('display', 'list-item');
            }
        });
    },0);
}

// 表格遮罩层
function load(load){
    layui.use(['layer'], function(){
        var layer = layui.layer;
        if(load == undefined){
            layer.load(3);
            return;
        }else if(load == "loading"){
            layer.closeAll("loading");
            return false;
        }
    });
}

// 日期插件
var startTime = '';
layui.use('laydate', function(){
    var laydate = layui.laydate;
    var nowdate = (new Date()).Format("yyyy-MM");
    //同时绑定多个
    lay('.laydateCon-item').each(function(){
        if($(this).hasClass('start_time')){
            laydate.render({
                elem: this,
                theme: 'molv',
                type: 'month',
                format:"yyyy-MM",
                value: nowdate,
                //max: nowdate,
            })
        }else{
            laydate.render({
                elem: this,
                theme: 'molv',
                type: 'month',
                format:"yyyy-MM",
                value: nowdate,
                //min: nowdate
                //format: 'yyyyMM'
            });
        }

    });
});

// 调用后台生成的excel
function postForm( params,listUrl) {
    var temp = document.createElement("form");
    //var parArr = params;
    //temp.action = window.BASE_API_URL + 'queryOutputInvoice/exportInvoiceList.do';
    temp.action = listUrl;
    temp.method = "post";
    temp.style.display = "none";
    Object.keys(params).forEach(function(key){
        var opt = document.createElement("input");
        opt.name = key;
        opt.value = params[key];
        temp.appendChild(opt);
        //temp.append(opt);
    });
    document.body.appendChild(temp);
    //document.body.append(temp);
    temp.submit();
    return temp;
};
// 导出Excel
function getExplorer(params,beforeUrl,listUrl){
    if(beforeUrl){
        $.ajax({
            url:beforeUrl,
            type: "post",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: params,
            success : function(data) {
                if (data.status == 'T') {
                    window.top.location.href = '../../login.html';
                    return false;
                }
                if (data.status == 'F') {
                    layuiAlert(data.msg,{btn: ['关闭']});
                    return false;
                }
                //layer.closeAll();
                postForm(params,listUrl);
            }
        });
    }else{
        postForm(params,listUrl);
    }

};
//判断当前浏览器是否支持placeholder属性
$(function () {
    var input = document.createElement('input');
    if("placeholder" in input){

    }else{
        $('input, textarea').placeholder();
    }
});
function myBrowser(){//判断使用的浏览器
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1
    if (userAgent.indexOf("Opera") > -1) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    };//判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
        return "Chrome";
    };//判断是否Chrome浏览器
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    };//判断是否Safari浏览器
    if(/[rv\:|MSIE]/.test(userAgent) || userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)){
        return "IE";
    }; //判断是否IE浏览器 兼容判断内核为gecko的IE11
};

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

