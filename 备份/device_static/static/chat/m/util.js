/**
 * 封装ajax请求参数
 * @param url
 * @param data
 * @param callback
 */
function request(url, data, callback) {
    $.ajax({
        'url': url,
        'type': "POST",
        'data': data,
        'timeout': 30000,
        'error': function (e) {
            console.log('**********error!');
            callback(e);
        },
        'success': function (e) {
            if (e.error_code == 200) {
                window.location.href = '/im/login.html';
                return false;
            }
            callback(e);
        }
    });
}

function loading(title, content) {
    $('#loadingBox #loadingTitle').html(title);
    $('#loadingBox #loadingText').html(content);
    $('#loadingBox').show();
}

function hideLoading() {
    $('#loadingBox').hide();
}

function alert1(title, content, btnText, callback) {
    hideAlert1();
    $('#alertBox #alertTitle').html(title);
    $('#alertBox #alertText').html(content);
    $('#alertBox #alertEvent').html(btnText);
    $(document).off('click', '#alertEvent');
    $(document).on('click', '#alertEvent', function () {
        callback();
    });
    $('#alertBox').show();
}

function hideAlert1() {
    $('#alertBox').hide();
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


