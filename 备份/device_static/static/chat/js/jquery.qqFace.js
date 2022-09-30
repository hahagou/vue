// QQ表情插件
(function ($) {
    $.fn.qqFace = function (option) {
        var settings = $.extend({
                id: "face-"+ new Date().valueOf(),
                assign: 'textbox',
                appendbox: '.bottom-bar',
                path: '/static/chat/images'
            },
            option);

        return this.each(function(){
            var tab_id_1 = "tab-"+new Date().valueOf(),
                tab_id_2 = "tab-"+new Date().valueOf()+1;
            var assign = $('#' + settings.assign);
            var id = settings.id;

            function insertHtmlAtCaret(html) {
                var sel, range;
                if (window.getSelection) {
                    // IE9 and non-IE
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();

                        var el = document.createElement("div");
                        el.innerHTML = html;
                        var frag = document.createDocumentFragment(), node, lastNode;
                        while ((node = el.firstChild)) {
                            lastNode = frag.appendChild(node);
                        }
                        range.insertNode(frag);

                        // Preserve the selection
                        if (lastNode) {
                            range = range.cloneRange();
                            range.setStartAfter(lastNode);
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }
                } else if (document.selection && document.selection.type != "Control") {
                    // IE < 9
                    document.selection.createRange().pasteHTML(html);
                }
            }

            var str='',
                QQFaceList= ["微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭", "尴尬", "发怒", "调皮", "呲牙", "惊讶", "难过", "酷", "冷汗", "抓狂", "吐", "偷笑", "愉快", "白眼", "傲慢", "饥饿", "困", "惊恐", "流汗", "憨笑", "悠闲", "奋斗", "咒骂", "疑问", "嘘", "晕", "疯了", "衰", "骷髅", "敲打", "再见", "擦汗", "抠鼻", "鼓掌", "糗大了", "坏笑", "左哼哼", "右哼哼", "哈欠", "鄙视", "委屈", "快哭了", "阴险", "亲亲", "吓", "可怜", "菜刀", "西瓜", "啤酒", "篮球", "乒乓", "咖啡", "饭", "猪头", "玫瑰", "凋谢", "嘴唇", "爱心", "心碎", "蛋糕", "闪电", "炸弹", "刀", "足球", "瓢虫", "便便", "月亮", "太阳", "礼物", "拥抱", "强", "弱", "握手", "胜利", "抱拳", "勾引", "拳头", "差劲", "爱你", "NO", "OK", "爱情", "飞吻", "跳跳", "发抖", "怄火", "转圈", "磕头", "回头", "跳绳", "投降", "激动", "乱舞", "献吻", "左太极", "右太极", "嘿哈", "捂脸", "奸笑", "机智", "皱眉", "耶", "红包", "鸡"];
                //EmojiList= ["笑脸", "生病", "破涕为笑", "吐舌", "脸红", "恐惧", "失望", "无语", "鬼魂", "合十", "强壮", "庆祝", "礼物", "开心", "大笑", "热情", "眨眼", "色", "接吻", "亲吻", "露齿笑", "满意", "戏弄", "得意", "汗", "低落", "呸", "焦虑", "担心", "震惊", "悔恨", "眼泪", "哭", "晕", "心烦", "生气", "睡觉", "恶魔", "外星人", "心", "心碎", "丘比特", "闪烁", "星星", "叹号", "问号", "睡着", "水滴", "音乐", "火", "便便", "弱", "拳头", "胜利", "上", "下", "右", "左", "第一", "吻", "热恋", "男孩", "女孩", "女士", "男士", "天使", "骷髅", "红唇", "太阳", "下雨", "多云", "雪人", "月亮", "闪电", "海浪", "猫", "小狗", "老鼠", "仓鼠", "兔子", "狗", "青蛙", "老虎", "考拉", "熊", "猪", "牛", "野猪", "猴子", "马", "蛇", "鸽子", "鸡", "企鹅", "毛虫", "章鱼", "鱼", "鲸鱼", "海豚", "玫瑰", "花", "棕榈树", "仙人掌", "礼盒", "南瓜灯", "圣诞老人", "圣诞树", "礼物", "铃", "气球", "CD", "相机", "录像机", "电脑", "电视", "电话", "解锁", "锁", "钥匙", "成交", "灯泡", "邮箱", "浴缸", "钱", "炸弹", "手枪", "药丸", "橄榄球", "篮球", "足球", "棒球", "高尔夫", "奖杯", "入侵者", "唱歌", "吉他", "比基尼", "皇冠", "雨伞", "手提包", "口红", "戒指", "钻石", "咖啡", "啤酒", "干杯", "鸡尾酒", "汉堡", "薯条", "意面", "寿司", "面条", "煎蛋", "冰激凌", "蛋糕", "苹果", "飞机", "火箭", "自行车", "高铁", "警告", "旗", "男人", "女人", "O", "X", "版权", "注册商标", "商标"];

            if ($('#' + id).length <= 0) {
                str+='<div class="expression" id="'+ id +'">';
                str+='<div class="scroll-wrapper hide-scrollbar">';
                str+='<table class="face-tb">';
                str+='</tr>';
                for (var i = 0; i < QQFaceList.length; i++) {
                    str += '<td><a href="javascript:void(0)" title="'+QQFaceList[i]+'"><img src="'+ settings.path +'/qqface/'+QQFaceList[i]+'.png"  class=\"imgFace\" data-name="' + QQFaceList[i] + '"/></a></td>';
                    if ((i + 1) % 12 == 0){
                        str += '</tr><tr>'
                    };
                }
                str+='</tr>';
                str+='</table>';
                str+='</div>';

            }
            $(option.appendbox).append(str);
            $(this).click(function (e) {
                assign.focus();
                $('#' + id).toggle();
                e.stopPropagation();
            });

           /* $(document).on("blur",'#'+option.assign,function (e) {
                assign.focus();
            });*/

            $("#"+id+" table a").click(function (e) {
                assign.focus();
                $('#' + id).hide();
                insertHtmlAtCaret($(this).html());
                e.stopPropagation();

            });

            function isIE(){
                if(!!window.ActiveXObject || "ActiveXObject" in window){
                    return true;
                } else{
                    return false;
                }
            }
            if(isIE()){
                function CheckHTML(Str){
                    var S = Str;
                    S = S.replace(/<p(.*?>)/gi,"")
                    S = S.replace(/<\/p>/gi,"")
                    return S
                }

                $(document).on("mouseleave",'#'+option.assign,function (e) {
                    assign.html(CheckHTML(assign.html()));
                });
            }

            $(document).click(function(){
                $('#' + id).hide();
            });
        })
    }

})(jQuery);

