/**
 * 登录初始化及相关方法
 */
jQuery.support.cors = true;
(function( jQuery ) {
	if ( window.XDomainRequest ) {
		jQuery.ajaxTransport(function( s ) {
			if ( s.crossDomain && s.async ) {
				if ( s.timeout ) {
					s.xdrTimeout = s.timeout;
					delete s.timeout;
				}
				var xdr;
				return {
					send: function( _, complete ) {
						function callback( status, statusText, responses, responseHeaders ) {
							xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
							xdr = undefined;
							complete( status, statusText, responses, responseHeaders );
						}
						xdr = new window.XDomainRequest();
						xdr.onload = function() {
							callback( 200, "OK", { text: xdr.responseText }, "Content-Type: " + xdr.contentType );
						};
						xdr.onerror = function() {
							callback( 404, "Not Found" );
						};
						xdr.onprogress = function() {};
						if ( s.xdrTimeout ) {
							xdr.ontimeout = function() {
								callback( 0, "timeout" );
							};
							xdr.timeout = s.xdrTimeout;
						}

						xdr.open( s.type, s.url, true );
						xdr.send( ( s.hasContent && s.data ) || null );
					},
					abort: function() {
						if ( xdr ) {
							xdr.onerror = jQuery.noop();
							xdr.abort();
						}
					}
				};
			}
		});
	}
})( jQuery );
$(document).ready(function(){
	layui.use(['layer'], function(){
		var layer = layui.layer;
	});
	$("#input_username").val("");
	$("#input_password").val("");
	initButton();
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
function initButton(){
	//var datas = {};
	//var browserName = myBrowser();
	$("#login").click(function(){
		var username = $.trim($("#input_username").val());
		var userPassword = $.trim($("#input_password").val());
		if(username==''){
			$('.msg-err-username').html("请填写用户名").css('display','block');
			return;
		}else if(userPassword==''){
			$('.msg-err-username').html("").css('display','none');
			$('.msg-err-password').html("请填写密码").css('display','block');
			return;
		}else{
			$('.msg-err-username').html("").css('display','none');
			$('.msg-err-password').html("请填写密码").css('display','none');
		};
		//datas['userId'] = username;
		//datas['password'] = hex_md5(userPassword);
		//if(browserName==="IE"){
		//	jQuery.support.cors = true;
		//	$.ajax({
		//		url: window.BASE_API_URL + "login/login.do",
		//		type: "post",
		//		async:false,
		//		data : JSON.stringify(datas),
		//		crossDomain: true,
		//		contentType:"application/json; charset=utf-8",
		//		success: function (data) {
		//			if (data.status == "F") {
		//				layer.msg(data.msg);
		//				return false;
		//			}
		//			else if (data.status == "T") {
		//				window.location.href = "login.html";
		//			}
		//			else {
		//				setCookie("userType", String(data.data.userType));
		//				setCookie("deptId", String(data.data.deptId));
		//				setCookie("parentDeptId ", String(data.data.parentDeptId));
		//				window.location.href = "index.html";
		//			}
		//		},
		//		error: function (err, a, b) {
		//			console.log(err);
		//		}
		//	});
		//}
		//else{
			$.ajax({
				url: window.BASE_API_URL + "login/login.do",
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				type: "post",
				//ContentType: 'text/plain',
				dataType: "json",
				data: {
					"userId": username,
					"password": hex_md5(userPassword)
				},
				success: function (data) {
					if (data.status == "F") {
						layer.msg(data.msg);
						return false;
					}
					else if (data.status == "T") {
						window.location.href = "login.html";
					}
					else {
						setCookie("userType", String(data.data.userType));
						setCookie("deptId", String(data.data.deptId));
						setCookie("parentDeptId ", String(data.data.parentDeptId));
						window.location.href = "index.html";
					}

				},
				error: function (err, a, b) {
					console.log(err);
				}
			});
		//}
	});
};

$(document).keydown(function (event) {
	if(event.keyCode == 13){
		$("#login").click();
	};
});