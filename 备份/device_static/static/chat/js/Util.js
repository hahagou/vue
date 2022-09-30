/********/
/*函数包*/
/********/

/*转义函数*/
var Id = function (strId)
{
    return document.getElementById(strId);
}

/*去除字符串两边的空格*/
String.prototype.Trim = function ()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

/*去除字符串两边的空格*/
String.prototype.Date = function (strFormat)
{
    var strDate = this + "";
    if (!strDate)
    {
        return;
    }
    else
    {
        /*格式处理*/
        var strDateList = strDate.split(" ");
        strDate = strDateList[0] + " " + strDateList[strDateList.length - 1];
    }
    if (!strFormat) format = "yyyy-MM-dd";
    switch (typeof strDate)
    {
        case "string":
            strDate = new Date(strDate.replace(/-/g, "/"));
            break;
        case "number":
            strDate = new Date(strDate);
            break;
    }
    /*判断数据类型*/
    if (!strDate instanceof Date) return;
    var dict = {
        "yyyy": strDate.getFullYear(),
        "M": strDate.getMonth() + 1,
        "d": strDate.getDate(),
        "H": strDate.getHours(),
        "m": strDate.getMinutes(),
        "s": strDate.getSeconds(),
        "MM": ("" + (strDate.getMonth() + 101)).substr(1),
        "dd": ("" + (strDate.getDate() + 100)).substr(1),
        "HH": ("" + (strDate.getHours() + 100)).substr(1),
        "mm": ("" + (strDate.getMinutes() + 100)).substr(1),
        "ss": ("" + (strDate.getSeconds() + 100)).substr(1)
    };
    return strFormat.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function ()
    {
        return dict[arguments[0]];
    });
}

/*去除HTML标记*/
String.prototype.StripHtml = function ()
{
    var reTag = /<(?:.|\s)*?>/g;
    return this.replace(reTag, "");
}

/*重定义精确度函数*/
Number.prototype.toFixed = function (len)
{
    var a = Math.round(this * Math.pow(10, len)) / Math.pow(10, len)
    var b = a + "";
    var c = b.split(".");
    var d = "0000000000";
    if (c.length == 1)
    {
        if (len == 0)
            b = c[0];
        else
            b = c[0] + "." + d.substr(0, len);
    }
    else
    {
        b = c[0] + "." + (c[1] + d).substr(0, len);
    }
    return b;
}

/*自定义去小数末尾0的方法*/
Number.prototype.Save = function (MinLen)
{
    var Num1 = this.toFixed(4).split(".");
    var Num2 = Num1[1]
    var MaxLen = Num2.length;
    var Len = MinLen;
    for (var i = MaxLen; i >= MinLen; i--)
    {
        if (Num2.substr(i - 1, 1) != "0")
        {
            Len = i;
            break;
        }
    }
    return Num1[0] + "." + Num1[1].substr(0, Len);
}

/*获取网页地址栏参数*/
function QueryStringUrl(strString)
{
    var strHref = location.search;
    if (arguments.length > 1) strHref = arguments[1];

    var regUrl = new RegExp("(\\?|\\&)" + strString + "=([^\\&]*)(\\&?)", "i").exec(strHref);
    if (regUrl != null)
    {
        return RegExp.$2;
    }
    else
    {
        return "";
    }
}

/*验证是否含有特殊字符*/
function RegSpecialChar(strString) {
    var regSpecialCharl = RegExp(/[\<\>]+/); //(\!)(\@)(\#)(\$)(\^)(\&)(\*)(\{)(\})(\\)(\')(\?)(\)
    for (var i = 0; i < strString.length; i++) {
        if (regSpecialCharl.test(strString.substr(i, 1))) {
            return false;
        }
    }
    return true;
}

/*验证邮箱*/
function RegEmail(strEmail)
{
    var regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (regEmail.test(strEmail))
    {
        return true;
    }
    else
    {
        return false;
    }
}

/*验证身份证号码*/
function RegIdCardNo(strIdCardNo) {
    var regIdCardNo = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
    if (regIdCardNo.test(strIdCardNo)) {
        return true;
    }
    else {
        return false;
    }
}

/*验证手机号码*/
function RegPhoneNumber(strPhoneNumber) {
    var regPhoneNumber = /^(((13[0-9]{1})|15[0-9]{1}|18[0-9]{1}|14[0-9]{1}|17[0-9]{1}|)+\d{8})+$/;
    if (regPhoneNumber.test(strPhoneNumber)) {
        return true;
    }
    else {
        return false;
    }
}

/*验证是否为钱单位*/
function RegCurrency(strCurrency)
{
    var regsCurrency = /^\d+(\.\d+)?$/;
    if (regsCurrency.test(strCurrency))
    {
        return true;
    }
    else
    {
        return false;
    }
}

/*验证数字*/
function RegNumber(strNumber)
{
    var regNumber = /^\d+$/;
    if (regNumber.test(strNumber))
    {
        return true;
    }
    else
    {
        return false;
    }
}

/*验证数值*/
function RegDouble(strDouble)
{
    var regDouble = /^[-\+]?\d+(\.\d+)?$/;
    if (regDouble.test(strDouble))
    {
        return true;
    }
    else
    {
        return false;
    }
}

/*验证日期*/
function RegDate(strDateTime)
{
    var datDateTime = new Date(strDateTime);
    if (isNaN(datDateTime.getYear()))
    {
        return false;
    }
    else
    {
        return true;
    }
}

/*回车事件*/
function EventEnter(evt, para, option)
{
    evt = evt ? evt : (window.event ? window.event : null);
    if (evt.keyCode == 13)
    {
        switch (para)
        {
            case 0:
                Id(option).focus();
                break;
            case 1:
                eval(option);
                break;
        }
        return false;
    }
}

/*加载JS*/
function InvokeJs(strUrl)
{
    var datTime = new Date();
    var strTime = datTime.getTime();
    var eleUrl = document.createElement("script");
    eleUrl.setAttribute("type", "text/javascript");
    eleUrl.setAttribute("id", "scr" + strTime);
    eleUrl.setAttribute("src", strUrl + "?Time=" + strTime);
    document.body.appendChild(eleUrl);
}

/*日期格式化*/
function DateFormat(datDateTime)
{
    var intYear = datDateTime.getYear();
    var intMonth = datDateTime.getMonth();
    var intDate = datDateTime.getDate() - 1;
    var intHour = datDateTime.getHours();
    var intMinute = datDateTime.getMinutes();
    var strResult = "";
    if (intYear > 0)
    {
        strResult = intYear + "年前";
    }
    if (intMonth > 0 && strResult == "")
    {
        strResult = intMonth + "个月前";
    }
    if (intDate > 0 && strResult == "")
    {
        strResult = intDate + "天前";
    }
    if (intHour > 0 && strResult == "")
    {
        strResult = intHour + "小时前";
    }
    if (intMinute > 0 && strResult == "")
    {
        strResult = intMinute + "分钟前";
    }
    if (intMinute == 0 && strResult == "")
    {
        strResult = "1分钟内";
    }
    return strResult;
}

/**********/
/*记录滚屏*/
/**********/

/*滚动条在Y轴上的滚动距离*/
function ScrollTop()
{
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if (document.body)
    {
        bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement)
    {
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}

/*文档的总高度*/
function ScrollHeight()
{
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body)
    {
        bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement)
    {
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}

/*浏览器视口的高度*/
function WindowHeight()
{
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat")
    {
        windowHeight = document.documentElement.clientHeight;
    } else
    {
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}
/*浏览器视口的宽度*/
function WindowWidth() {
    var w = 0;
    if (document.compatMode == "CSS1Compat") {
        w = document.documentElement.clientWidth;
    } else {
        w = document.body.clientWidth;
    }
    return w;
}
/*********/
/*XmlHttp*/
/*********/

/*异步调用*/
function RequestXml(strUrl, strPostValue, strFuntionName)
{
    var xmlHttp;
    if (window.ActiveXObject)
    {
        xmlHttp = new ActiveXObject("Microsoft.XMLHttp");
    }
    else
    {
        if (window.XMLHttpRequest)
        {
            xmlHttp = new XMLHttpRequest();
        }
    }
    xmlHttp.open("Post", strUrl, true)
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.onreadystatechange = function ()
    {
        ResponseXml(xmlHttp, strFuntionName)
    }
    xmlHttp.send(strPostValue);

}

/*返回结果*/
function ResponseXml(xmlHttp, strFuntionName)
{
    //respons.setHeader("Access-Control-Allow-Origin", "*");
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    {
        eval(strFuntionName);
    }
    else
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 404)
        {
            alert("程序异常，找不到被调用的页面。");
        }
    }
}

/*添加时间*/
function AddTime(strId, intCount)
{
    for (var i = 0; i <= intCount; i++)
    {
        var strOption = i + "";
        if (i < 10)
        {
            strOption = "0" + i;
        }
        var optTime = new Option(strOption, strOption);
        document.getElementById(strId).options.add(optTime);
    }
}

/*隐藏ID*/
function HiddenId(strId)
{
    Id(strId).style.display = "none";
}

/*显示ID*/
function DisplayId(strId)
{
    Id(strId).style.display = "";
}

/*更改昵称图片*/
function CheckText(strNickname)
{
    if (strNickname != "")
    {
        strNickname = strNickname.replace(/\[0(.*?)\]/gi, "<img src=\"http://sqzone.ewemai.com/images/Emoticons/0$1.gif\"/>");
    }
    return strNickname;
}

/*获取字符串的字节数*/
function StringLength(strContent)
{
    var intLen = 0;
    for (var i = 0; i < strContent.length; i++)
    {
        if (strContent.charCodeAt(i) > 127 || strContent.charCodeAt(i) == 94)
        {
            intLen += 2;
        }
        else
        {
            intLen++;
        }
    }
    return intLen;
}

function FormatDate(strDate, strFormat) {
    if (!strDate) return;
    if (!strFormat) format = "yyyy-MM-dd";
    switch (typeof strDate) {
        case "string":
            strDate = new Date(strDate.replace(/-/g, "/"));
            break;
        case "number":
            strDate = new Date(strDate);
            break;
    }
    if (!strDate instanceof Date) return;
    var dict = {
        "yyyy": strDate.getFullYear(),
        "M": strDate.getMonth() + 1,
        "d": strDate.getDate(),
        "H": strDate.getHours(),
        "m": strDate.getMinutes(),
        "s": strDate.getSeconds(),
        "MM": ("" + (strDate.getMonth() + 101)).substr(1),
        "dd": ("" + (strDate.getDate() + 100)).substr(1),
        "HH": ("" + (strDate.getHours() + 100)).substr(1),
        "mm": ("" + (strDate.getMinutes() + 100)).substr(1),
        "ss": ("" + (strDate.getSeconds() + 100)).substr(1)
    };
    return strFormat.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
        return dict[arguments[0]];
    });
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function IsWX() {
    var userAgentInfo = navigator.userAgent;
    if (userAgentInfo.indexOf("MicroMessenger") > 0) return (true);
    else return (false);
}

//微信昵称等特殊字符转换处理
function WeiXinStringFormat(nick) {
    if (nick == undefined) return nick;

    nick = nick.replace(/([\ue001-\ue600])/gi,
                        function (word) {
                            return "[" + word.charCodeAt(0).toString(16) + "]";
                        }
                    );
    nick = nick.replace(/\[(.*?)\]/gi, "<img src='../images/Emoticons/$1.gif'>");
    return nick;
}

function gotoUrl(url) {
    if (IsPC()) {
        var a = $("<a href='" + url + "' target='_blank' >room</a>").get(0);
        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        a.dispatchEvent(e);
    } else
        window.location.href = url;
}


function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return arr[2];
    }
    else
        return null;
}