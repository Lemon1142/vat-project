// 精确计算浮点类型

/**
 * 重写Number的toFixed方法，保留小数点后len长度的小数位数
 */
Number.prototype.toFixed = function(len){
	return accCount(this, 1, len, "1");
};

/**
* 除法运算
 * pointNum ： 小数点位数
 * addFlag : 是否补0
**/
function accCount(arg1, arg2, pointNum, addFlag) {

	var bcsNum = arg1 + "";
	var csNum = arg2 + "";
	var zeroStr = ".";
	var addpointNum = 0;

	//被除数根据精度补零
	if(bcsNum.indexOf(".") > 0){
		addpointNum = pointNum - (bcsNum.length - bcsNum.indexOf(".") - 1);
		zeroStr = "";
	} else {
		addpointNum = pointNum ;
	}
	for (var i = 0; i < addpointNum; i++) {
		zeroStr = zeroStr + "0";
	}

	var BigBcsNum = new BigDecimal(bcsNum + zeroStr);
	var BigCsNum = new BigDecimal(csNum);
	var retNum = BigBcsNum.divide(BigCsNum).setScale(pointNum, BigDecimal.prototype.ROUND_HALF_UP).toString();

	// 传参补0
	if (addFlag == undefined) {
		if(retNum.indexOf(".")>0){
			var retNumP = retNum.substring(retNum.length - 1, retNum.length);
			while(retNumP == "0"){
				retNum = retNum.substring(0, retNum.length - 1);
				retNumP = retNum.substring(retNum.length - 1, retNum.length);
				if(retNumP == "."){
					retNum = retNum.substring(0, retNum.length - 1);
				}
			}
		}
	}
	return  retNum;
}

/**
* 乘法运算
**/
function cfCount(arg1, arg2, pointNum, addFlag) {

	var bcsNum = arg1 + "";
	var csNum = arg2 + "";

	var BigBcsNum = new BigDecimal(bcsNum);
	var BigCsNum = new BigDecimal(csNum);
	var retNum = BigBcsNum.multiply(BigCsNum).setScale(pointNum, BigDecimal.prototype.ROUND_HALF_UP).toString();

	if (addFlag == undefined) {
		if(retNum.indexOf(".")>0){
			var retNumP = retNum.substring(retNum.length - 1, retNum.length);
			while(retNumP == "0"){
				retNum = retNum.substring(0, retNum.length - 1);
				retNumP = retNum.substring(retNum.length - 1, retNum.length);
				if(retNumP == ".")
					retNum = retNum.substring(0, retNum.length - 1);
			}
		}
	}

	return  retNum;
}

/**
* 加法运算
**/
function addCount(arg1, arg2, pointNum, addFlag) {

	var bcsNum = arg1 + "";
	var csNum = arg2 + "";

	var BigBcsNum = new BigDecimal(bcsNum);
	var BigCsNum = new BigDecimal(csNum);
	var retNum = BigBcsNum.add(BigCsNum).setScale(pointNum, BigDecimal.prototype.ROUND_HALF_UP).toString();

	if (addFlag == undefined) {
		if(retNum.indexOf(".")>0){
			var retNumP = retNum.substring(retNum.length - 1, retNum.length);
			while(retNumP == "0"){
				retNum = retNum.substring(0, retNum.length - 1);
				retNumP = retNum.substring(retNum.length - 1, retNum.length);
				if(retNumP == ".")
					retNum = retNum.substring(0, retNum.length - 1);
			}
		}
	}

	return  retNum;
}

/**
* 减法运算
**/
function subCount(arg1, arg2, pointNum, addFlag) {

	var bcsNum = arg1 + "";
	var csNum = arg2 + "";

	var BigBcsNum = new BigDecimal(bcsNum);
	var BigCsNum = new BigDecimal(csNum);
	var retNum = BigBcsNum.subtract(BigCsNum).setScale(pointNum, BigDecimal.prototype.ROUND_HALF_UP).toString();

	if (addFlag == undefined) {
		if(retNum.indexOf(".")>0){
			var retNumP = retNum.substring(retNum.length - 1, retNum.length);
			while(retNumP == "0"){
				retNum = retNum.substring(0, retNum.length - 1);
				retNumP = retNum.substring(retNum.length - 1, retNum.length);
				if(retNumP == ".")
					retNum = retNum.substring(0, retNum.length - 1);
			}
		}
	}

	return  retNum;
}
