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

function initButton(){
	$("#login").click(function(){
		var username = $.trim($("#input_username").val());
		var password = $.trim($("#input_password").val());
		if(username==''){
			$('.msg-err-username').html("请填写用户名").css('display','block');
			return;
		}else if(password==''){
			$('.msg-err-username').html("").css('display','none');
			$('.msg-err-password').html("请填写密码").css('display','block');
			return;
		}else{
			$('.msg-err-username').html("").css('display','none');
			$('.msg-err-password').html("请填写密码").css('display','none');
		};
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
				"password": hex_md5(password)
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
	});
};

$(document).keydown(function (event) {
	if(event.keyCode == 13){
		$("#login").click();
	};
})