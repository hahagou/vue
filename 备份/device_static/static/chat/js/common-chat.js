
/////////////////////////////////////////以下是亚君的///////////////////////////////////////
//弹框
(function ($) {
    $.fn.popup = function (options) {
        return this.each(function () {
            var $this = $(this);
            switch (options){
                case 'show':
                    $this.fadeIn(200);
                    break
                case 'hide':
                    $this.fadeOut(200);
                    break
            }

            var h = $this.find(".popup-main").height();
            $this.find(".popup-main").css("margin-top","-"+h/2+"px");

            $this.find(".popup-close").click(function(){
                $this.fadeOut(200);
            })
        });
    };
})(jQuery)

$(function(){
    //语音长度
    $(".voice-box").each(function(){
        var duration = $(this).attr("data-duration");
        $(this).css("width",duration*2.5<42?42:duration*2.5+"px");
        $(this).find(".min").text(duration+"\'\'");
    });

    //popover修复点击两次问题
    $(document).on("click",".popover-footer .btn",function () {
        var id = $(this).parents(".popover").attr("id");
        $("[aria-describedby="+ id +"]").trigger("click");
    });
});

function logError(name, msg,user) {
    try {
        var img = new Image();
        img.src = "Log.aspx?name=" + encodeURIComponent(name) + "&msg=" + encodeURIComponent(msg) + "&user=" + encodeURIComponent(user);//只要为image对象设置src属性值，即可完成请求，图片预加载也使用了image的这个特性
    }
    catch (e){
    }
}