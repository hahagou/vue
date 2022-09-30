/**
 * Created by Administrator on 2016/12/31.
 */

//弹框
(function ($) {
    $.fn.popup = function (options) {
        return this.each(function () {
            var $this = $(this);
            switch (options){
                case 'show':
                    $this.show();
                    break
                case 'hide':
                    $this.hide();
                    break
            }

            var h = $this.find(".popup-main").height();
            $this.find(".popup-main").css("margin-top","-"+h/2+"px");

            $this.find(".popup-close").click(function(){
                $this.hide();
            })
        });

    };

    // 时间格式
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        }
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
})(jQuery);