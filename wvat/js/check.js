//----------------------------------------------------------------------
//限制只能输入数字
//----------------------------------------------------------------------
$.fn.onlyNum = function () {
	$(this).keypress(function (event) {
		var eventObj = event || e;
		var keyCode = eventObj.keyCode || eventObj.which;
		if ((keyCode >= 48 && keyCode <= 57) || keyCode==46 || keyCode==8 || keyCode==108)
			return true;
		else
			return false;
	}).focus(function () {
		//禁用输入法
		this.style.imeMode = 'disabled';
	}).bind("paste", function () {
		//获取剪切板的内容
		var clipboard = window.clipboardData.getData("Text");
		if (/^\d+$/.test(clipboard))
			return true;
		else
			return false;
	});
};
//----------------------------------------------------------------------
//限制只能输入字母
//----------------------------------------------------------------------
$.fn.onlyAlpha = function () {
	$(this).keypress(function (event) {
		var eventObj = event || e;
		var keyCode = eventObj.keyCode || eventObj.which;
		if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || keyCode==46 || keyCode==8 || keyCode==108)
			return true;
     	else
     		return false;
 	}).focus(function () {
 		this.style.imeMode = 'disabled';
	}).bind("paste", function () {
		var clipboard = window.clipboardData.getData("Text");
		if (/^[a-zA-Z]+$/.test(clipboard))
			return true;
    	else
    		return false;
	});
};
//----------------------------------------------------------------------
//限制只能输入数字和字母
//----------------------------------------------------------------------
$.fn.onlyNumAlpha = function () {
	$(this).keypress(function (event) {
		var eventObj = event || e;
		var keyCode = eventObj.keyCode || eventObj.which;
		if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || keyCode==46 || keyCode==8 || keyCode==108)
			return true;
		else
			return false;
	}).focus(function () {
		this.style.imeMode = 'disabled';
	}).bind("paste", function () {
		var clipboard = window.clipboardData.getData("Text");
		if (/^(\d|[a-zA-Z])+$/.test(clipboard))
			return true;
		else
			return false;
	});
};