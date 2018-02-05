/**
 * Created by admin on 2017/8/14.
 */
window.GAG = {};
window.GAG.ios = {};
window.GAG.ios.userData = {};

if (window.location.host.indexOf('gooagoo.com') > 0) {
    window.gooagoodomain = '.gooagoo.com';
} else if (window.location.host.indexOf('test.goago.cn') > 0) {
    window.gooagoodomain = '.test.goago.cn';
} else if (window.location.host.indexOf('pressure.goago.cn') > 0) {
    window.gooagoodomain = '.pressure.goago.cn';
} else {
    window.gooagoodomain = '.dev.goago.cn';
}

//window.BASE_API_URL = 'http://vat.dev.goago.cn/';
window.BASE_API_URL = 'http://vat' + window.gooagoodomain + "/";
//window.BASE_API_URL = "";