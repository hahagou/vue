var MessageChat  = {
    readMessage : function (id, wxId) {
        view.req({
            url: 'read',
            type: "get",
            data: {'id': id, 'wx_id': wxId},
            done:function (e) {

            }
        });

        this.titleTip();
    },

    // 加载历史聊天记录
    loadMessage : function (id, wxId, lastId, toBottom) {
        view.req({
            url: 'history',
            type: "get",
            data: {'id': id, 'wx_id': wxId, 'last_id': lastId},
            done: function (e) {
                if (e.code == 1) {
                    if (typeof (e.data.list) != 'undefined') {
                        var list = e.data.list;
                        var beforeST = $('#ulList').height();
                        //console.log(e.data);
                        if (list.length != 0) {
                            //防止快速点击不同信息造成的消息贴错
                            if (wxId == $("#div_name").attr('wxId')) {
                                var messageHtml = wxMessage.drawMessage(e.data.list);
                                $('#ulList').prepend(twemoji.parse(qqface_change(messageHtml)));
                                $('.ulLeft>li[class$="active"]').attr('lastId', e.data.last_id);
                            }
                        }

                        if (toBottom == true) {
                            $('#conversation').scrollTop($('#ulList').height());
                        } else {
                            var st = $('#ulList').height() - beforeST - 100;
                            $('#conversation').scrollTop(st < 1 ? 0 : st);
                        }
                    } else {
                        //todo retry option alert
                    }
                }
            }
        });

        loadChatLogs(id, wxId, "");
        $('#btnSearchHistory').attr("data-accout-id", id);
        $('#btnSearchHistory').attr("data-wx-id", wxId);
        $('#btnSearchHistory').attr("data-page", 1);
        //消息分类
        messageClassify();
        $('#ulLeftGroup li').each(function () {
            var is_shield = false;
            var wxid = $(this).data('wxid');
            var belongid = $(this).attr('belongid');
            jQuery.each(shieldGroup, function (i, val) {
                if (val['wx_account'] == wxid && val['account_id'] == belongid) {
                    //如果屏蔽了该群
                    is_shield = true;
                    return false;
                }
            });
            if (is_shield) {
                $(this).find('.unread_span').removeClass('unread');
                //$(this).find('.unread_span').attr('data-unread',0);
            }
        });
    },

    // 修改客服工作台标签
    titleTip : function () {
        var unreadCount = this.getUnreadCount();

        if (unreadCount === 0) {
            document.title = '客服工作台';
        } else {
            document.title = '您有' + unreadCount + "条未读消息";
        }
    },

    // 获取未读消息数量
    getUnreadCount: function () {
        var sum = 0;
        var sum1 = 0;
        var sum2 = 0;

        $('.ulLeft>li').each(function () {
            //过滤屏蔽的群聊消息
            if ($(this).find(".unread").length > 0) {
                var count = $(this).find(".unread").attr('data-unread') - 0;
                // var count = $(this).find(".unread_span").attr('data-unread') - 0;
                sum += count;
            }
        });

        $('#ulLeft>li').each(function () {
            if ($(this).find(".unread").length > 0) {
                var count1 = $(this).find(".unread").attr('data-unread') - 0;
                sum1 += count1;
            }
        });
        if (sum1 > 0) {
            $('.newInfo:eq(0)>i').show();
        } else {
            $('.newInfo:eq(0)>i').hide();
        }

        $('#ulLeftGroup>li').each(function () {
            if ($(this).find(".unread").length > 0) {
                var count1 = $(this).find(".unread").attr('data-unread') - 0;
                sum2 += count1;
            }
        });
        if (sum2 > 0) {
            $('.newInfo:eq(1)>i').show();
        } else {
            $('.newInfo:eq(1)>i').hide();
        }

        return sum;
    },

    // 新增快捷回复标签
    loadQuickReply: function () {
        view.req({
            url: 'reply/list',
            type: "get",
            data: {'type': 2},
            done: function (e) {
                if(e.code == 1){
                    var html = template('replyListTemplateHtml', {replyLists: e.data});
                    $('#ulPersonalQuickMsg').html(html);
                }
            }
        });
    },

    // 获取语音
    getAudioList: function(){
        view.req({
            url: 'get_audios_list',
            type: "get",
            done: function (e) {
                setTimeout(function () {
                    if (e.code == 1) {
                        var html = template('audiosListTemplateHtml', {audioLists: e.data});
                        $('#ulAudio').html(html);
                    }
                }, 1000);
            },
            error: function () {
                setTimeout(function () {
                    $('#loaderPop').modal('hide');
                    $('#load_text').html('获取语音列表异常，请重试');
                    $('#load_text').addClass('text-danger');
                    $('#loaderPop').modal('show');
                }, 1000);
            }
        });
    },

    // 上传语音
    uploadAudio: function (src, eletar) {
        $('#load_text').html('正在上传...');
        $('#load_text').removeClass('text-danger');
        $('#load_text').addClass('text-success');
        $('#loaderPop').modal('show');
        view.req({
            url: "upload_audios",
            type: "POST",
            data: {"file": src},
            done: function (e) {
                setTimeout(function () {
                    $('#loaderPop').modal('hide');
                    $('#notice_text').html(e.reason);
                    var trlen = $(".addShow tbody tr").length;
                    if (e.code == 1) {
                        var box_id = randomRangeId(6);
                        var trHtml = "<tr class=\"row\" title='点击播放'>";
                        trHtml += "   <td class='col-lg-1' style=\"text-align:center\" width=\"50\">" + (trlen - 0 + 1) + "</td>";
                        trHtml += "   <td data-type=\"audio\" class=\"col-lg-8\">";
                        trHtml += "     <div class=\"audioDiv alert-primary align-items-center audio\" id=\"" + box_id + "\">" +
                            '<i class=\"fa fa-volume-off audioIcon\" aria-hidden=\"true\"></i><span class=\"length\"></span>';
                        trHtml += "<audio src=\"" + e.data.filepath + ".mp3" + "\" controls='controls' style='display:none' data-src=\"" + e.data.filepath + ".silk" + "\" data-voice_time=\"" + e.data.time + "\" ></audio>" +
                            "</div>";
                        trHtml += "   </td>";
                        trHtml += "   <td style=\"text-align: right\" class=\"col-lg-2\">";
                        trHtml += "      <button type=\"button\" class=\"del btn btn-danger btn-sm\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i>&nbsp;删除</button>";
                        trHtml += "   </td>";
                        trHtml += "</tr>";
                        $(".addShow tbody").append(trHtml);
                        getTime(box_id);

                        // $('#voice_time').val(e.data.time);
                    } else {
                        $('#load_text').html(e.reason);
                        $('#load_text').addClass('text-danger');
                        $('#loaderPop').modal('show');
                    }
                }, 1000);
            },
            error:function () {
                setTimeout(function () {
                    $('#loaderPop').modal('hide');
                    $('#load_text').html('上传失败！');
                    $('#load_text').addClass('text-danger');
                    $('#loaderPop').modal('show');
                }, 1000);
            }
        });
    },

    // 初始化消息记录
    getMessage : function () {
        view.req({
            url: 'list',
            type: "get",
            done: function (e) {
                if(e.code == 0 || typeof (e.data.list) == 'undefined' || typeof (e.data.account) == 'undefined'){
                    //todo retry option alert
                    return false;
                } else {
                    G.account = e.data.account;
                    var list = e.data.list;
                    if (list.length != 0) {
                        $('.ulLeft').empty();
                        var contactHtml = wxMessage.drawContact(list);
                        $('.ulLeft').append(contactHtml);
                        $('.ulLeft>li:eq(0)').click();
                        // 判断最新聊天是好友还是群聊
                        $('#leftTab a:first').tab('show');
                        $('#leftTab-three a:first').tab('show');
                        if (list[0].from.wx_id.indexOf("@") != -1) {
                            $('#leftTab-three a:last').tab('show');
                            $('#ulLeftGroup>li:eq(0)').click();
                        }
                    }
                }


            }
        });
    },

    // 获取好友
    getFriendList: function () {
        view.req({
            url: 'getFriendRequest',
            type: "get",
            data : {id: 0},
            done: function (e) {
                if (e.code == 0) {
                    $.hideLoading();
                    auth.alert('提示', e.reason, '关闭', function () {
                        auth.hideAlert();
                    });
                    return false;
                }
                if (e.data.length > 0) {
                    var innerHTML = '';
                    $.each(e.data, function (i, val) {
                        innerHTML += '<li class="new-friend-item fr_id" fr_id="' + val.id + '" wx_account="' + val.wx_account + '"  >' +
                            '           <img src="' + val.wx_avatar + '" class="head-img">' +
                            '           <a>' +
                            '               <span class="nickname">' + val.wx_nickname + '</span>' +
                            '               <span class="btn-box">' +
                            '                   <botton>查看</botton>' +
                            '               </span>' +
                            '           </a>' +
                            '       </li>';
                    });
                    innerHTML += '<li class="btn btn-default consentAll">全部同意</li>';
                    $('.new-friend .submenu').html('');
                    $('.new-friend .submenu').prepend(innerHTML);

                    $('#newFriendCount').text(e.data.length);
                } else {
                    $('.new-friend .submenu').html('');
                    $('#newFriendCount').text(0);
                }
            }
        });
    },


    loadLabels: function () {
        view.req({
            url: 'label/list',
            type: "get",
            done: function (e) {
                if(e.code == 1){
                    var html = '<option value="0">请选择</option>';
                    for (var i in e.data) {
                        html += '<option value="' + e.data[i].id + '">' + e.data[i].text + '</option>';
                    }
                    $('#love_label').empty().append(html);
                }
            }
        });
    },


    messageClassify: function () {
        $("#ulLeft li.wx_friend").each(function () {
            if ($(this).data('wxid').indexOf('@') >= 0) {
                $(this).remove();
            }
        });
        $("#ulLeftGroup li.wx_friend").each(function () {
            if ($(this).data('wxid').indexOf('@') < 0) {
                $(this).remove();
            }
        })
    }
};



// 点击左侧聊天列表
$(document).on('click', '.ulLeft>li', function () {
    $('#div_name').attr('wxId', $(this).data('wxid'));

    //聊天记录初始化
    $('#ulHistory').html('');
    $('#vcSearchKey').val('');

    // 聊天记录多选 初始化
    $("input[name='msg_check']").each(function () {
        $(this).prop("checked", false);
    });
    $('#msg-op').hide();
    $('.bottom-bar').css('background', '#ffffff');
    $('#input-msg').show();// 聊天记录多选 初始化
    $("input[name='msg_check']").each(function () {
        $(this).prop("checked", false);
    });
    $('#msg-op').hide();
    $('.bottom-bar').css('background', '#ffffff');
    $('#input-msg').show();

    if ($(this).hasClass('active')) {
        return false;
    }
    if ($('.ulLeft>li[class$="active"]').length != 0) {
        MessageChat.readMessage($('.ulLeft>li[class$="active"]').attr('belongId'), $('.ulLeft>li[class$="active"]').data('wxid'));
    }
    $('.ulLeft>li').removeClass('active');
    $(this).addClass('active');
    $(this).find('span').removeClass('unread').attr('data-unread', 0);
    var wxid = $(this).data('wxid');
    var accountid = $(this).attr('belongId');
    var belong_wxid = $(this).attr('belongWxId');
    var belongAlias = $(this).attr('belongAlias');
    var wxAccount = belongAlias ? belongAlias : belong_wxid;

    var str = "<span class='text-success' id='chatTitle' title='微信号: "+ belong_wxid +"' data-account-id='"+ accountid +"' data-wxid='"+ wxid +"'>" + $(this).attr('belongNickname') + "(" + wxAccount + ")" + '</span>  的' + ($(this).data('wxid').indexOf("@") == -1 ? '好友' : '群聊') + "<span class='text-info' title='微信号: "+ wxid +"'>" + $(this).data('nickname') + '</span>';
    $('#div_name').html(str);
    if ($(this).data('wxid').indexOf("@") != -1) {
        $("#viewGroupMembers").removeClass('hide');
        $("#viewGroupMembers").attr('onclick', "viewGroupMembers('" + wxid + "'," + accountid + ")");
        // 群聊隐藏查看朋友圈
        $("#view_sns").addClass('hide');
    } else {
        //邀请好友进指定群
        $("#view_sns").removeClass('hide');
        $("#viewGroupMembers").addClass('hide');
    }
    $('#tab_title>li').removeClass('active');
    $('#info_tab>div').removeClass('active');
    $('#kjhf').parent().addClass('active');
    $('#tab-2').addClass('active');

    $('#RobotWxName').html($(this).attr('belongNickname'));
    var wxId = $(this).data('wxid');
    var alias = $(this).data('alias');
    if (alias != '') {
        wxId = alias;
    }
    $('#fansWxId').html(wxId);
    $('#fansNikeName').html($(this).data('nickname'));
    $('#fansSex').html($(this).data('sex'));
    $('#fansLabel').html($(this).data('label'));
    $('#fansRemark').html($(this).data('remark'));
    $('#fansArea').html($(this).data('province') + ' ' + $(this).data('city'));

    $('#ulList').empty();
    // loadMessage($(this).attr('belongId'), $(this).data('wxid'), 0, true);
    MessageChat.loadMessage($(this).attr('belongId'), $(this).data('wxid'), 0, true);
    // readMessage($(this).attr('belongId'), $(this).data('wxid'));
    MessageChat.readMessage($(this).attr('belongId'), $(this).data('wxid'));
});

// 聊天置顶
$(document).on('click', '.set_top', function (e) {
    let order_id = $(this).attr('data-order-id');
    let sort = $(this).attr('data-order-sort');
    let thisId = '#set_top_' + order_id;
    let parentsLi = '#server_order_' + order_id;
    let parentsUL = '#' + $(parentsLi).parent('ul').attr('id');
    let parentsMenu = $(parentsLi).children('.menu');

    if(order_id == ''){
        layer.msg('置顶失败！请刷新页面再试');
        return false;
    }

    view.req({
        url: "msg_set_top",
        type: "POST",
        data: {'order_id': order_id, 'sort': sort},
        timeout: 30000,
        done: function (e) {
            setTimeout(function () {
                if (e.code == 0) {
                    alert1('提示', e.reason, '关闭', function () {
                        hideAlert1()
                    });
                    return false;
                }
                $(thisId).attr('data-order-sort', e.data.sort);
                parentsMenu.removeClass('open');

                if (sort == 0) {    // 置顶
                    $(thisId).text('取消置顶');
                    $(parentsLi).addClass('top');
                    $(parentsLi).prependTo(parentsUL);
                    layer.msg('置顶成功');
                } else {            // 取消
                    $(thisId).text('聊天置顶');
                    $(parentsLi).removeClass('top');
                    $(parentsLi).appendTo(parentsUL);
                    layer.msg('取消成功');
                }

            }, 500);
        },
        error: function () {
            auth.alert('提示', '处理失败，请重试！', '关闭', function () {
                auth.hideAlert();
            });
            return false;
        }
    });
});

// 查看朋友圈
$(document).on('click', '#view_sns', function (e) {
    var id = $('.ulLeft>li[class$="active"]').attr('belongid');
    var wxId = $('.ulLeft>li[class$="active"]').data('wxid');
    if (id == '' || wxId == '') {
        layer.msg('参数错误！请刷新重试');
        return false;
    }
    if (wxId.indexOf("@") != -1) {
        layer.msg('参数错误！请确认对象是否正确');
        return false;
    }
    var baseUrl = "/chat/sns";
    var url = baseUrl + '?id=' + id + '&wx_id=' + wxId;
    $(".popup-sns iframe").attr("src", url);
    $(".popup-sns").popup("show");
});

$('#btnSearchHistory').click(function () {
    $.showLoading();
    $('#ulHistory').html('');
    var id = $('#btnSearchHistory').attr("data-accout-id");
    var wxId = $('#btnSearchHistory').attr("data-wx-id");
    var keyword = $('#vcSearchKey').val();
    $('#btnSearchHistory').attr("data-page", 1);
    loadChatLogs(id, wxId, keyword, 1);
});

$(document).on('click', '#addPage', function () {
    $.showLoading();
    var id = $('#btnSearchHistory').attr("data-accout-id");
    var wxId = $('#btnSearchHistory').attr("data-wx-id");
    var keyword = $('#vcSearchKey').val();
    var page = Number($('#btnSearchHistory').attr("data-page")) + 1;
    $('#btnSearchHistory').attr("data-page", page);
    loadChatLogs(id, wxId, keyword, page);
});

// 添加标签
$(document).on("click", "#btnOpQuick", function () {
    var vcContent = $("#textbox-2").html();
    if (vcContent == "") {
        auth.alert("温馨提示", "请输入快捷语内容", '关闭', function () {
            auth.hideAlert()
        });
        return;
    }
    $("#textbox-2").find(".imgFace").each(function () {
        var name = $(this).attr("data-name");
        $(this).before("[" + name + "]");
        $(this).remove();
    });
    var content = $.trim($("#textbox-2").text());
    if (content.length > 200) {
        auth.alert("温馨提示", "最多可设置200个字符", '关闭', function () {
            auth.hideAlert()
        });
        return;
    }
    $(".popup-reply-txt").popup("hide");
    request('reply/add', {
        'type': 2,
        'text': content
    }, function (e) {
        if (e.code == 0) {
            return false;
        } else {
            MessageChat.loadQuickReply();
        }
    });
});

function setRemark() {
    $(".popup-love-remake").popup("show");
    $(".popup-love-remake #love_remake").val('').focus();
}

function setLabel() {
    $(".popup-set-label").popup("show");
}

function loadChatLogs(id, wxId, keyword, page) {
    if (page <= 0) {
        page = 1;
        $('#btnSearchHistory').attr("data-page", 1);
    }
    request('chat_logs', {
        'id': id,
        'wx_id': wxId,
        'keyword': keyword,
        'pagesize': 10,
        'page': page
    }, function (e) {
        if (e.code == 0) {
            //todo retry option alert
            return false;
        }
        if (typeof (e.data.list) != 'undefined') {
            var list = e.data.list;
            var html = template("chatLogTemplateHtml", {"chatLogs": list});
            if ($('#ulHistory').find('#addPage').length == 0) {
                $('#ulHistory').append(html);
                $('#ulHistory').append('<span class="btn btn-default pageBtn" type="button" id="addPage">查看更多</span>');
            } else {
                $("#addPage").before(html);
            }
            if (e.data.list.length == 0) {
                $("#addPage").text('无更多聊天记录');
                var page = Number($('#btnSearchHistory').attr("data-page")) - 1;
                if (page <= 0) {
                    $('#btnSearchHistory').attr("data-page", 1);
                } else {
                    $('#btnSearchHistory').attr("data-page", page);
                }

            } else {
                $("#addPage").text('查看更多');
            }
        } else {

        }
    });
    $.hideLoading();
}

//删除快捷回复标签
function deleteReply(id) {
    $.showLoading();

    $.ajax({
        'url': 'reply/delete',
        'type': "POST",
        'data': {
            id: id
        },
        'timeout': 200000,
        'error': function (e) {
            $.hideLoading();
        },
        'success': function (rJson) {
            $.hideLoading();

            if (rJson.code == 1) {
                //loadQuickReply();
                var del_id = '#reply_' + id + '';
                $(del_id).remove();
            }
        }
    });
}


// 点击客服消息发送右边发送语音按钮
$(document).on("change", "#fileaudio", function (eve) {
    var eve = eve.target;
    var l = eve.files.length;
    var imgtype;
    var id = $(this).attr("id");
    var trlen = $(".addShow tbody tr").length;
    for (var i = 0; i < l; i++) {
        (function (i) {
            var files = eve.files[i];
            if (files.size > 2 * 1024 * 1024) return;
            var fr = new FileReader();
            fr.readAsDataURL(files);
            fr.onloadend = function (e) {
                var src = e.target.result;
                /*if (id == "fileup") { // 图片
                res = upfile(src, 2);
            }*/
                if (id == "fileaudio") { //语音
                    MessageChat.uploadAudio(src);
                }
                /*if (id == "linkImgUp") {  //链接
                upfile(src, 4);
            }*/
            }
        })(i);
    }
});

// 点击客服消息发送右边下拉
function contShow(type) {
    if (type == 'text') {
        var btn = $('#btn-down');
        var status = $('#btn-down').attr('aria-hidden');
        if (status === 'true') {
            btn.removeClass('fa-caret-down');
            btn.addClass('fa-caret-up');
            btn.attr('aria-hidden', 'false');
            $('#reply-op-list').show(200);
        } else {
            btn.removeClass('fa-caret-up');
            btn.addClass('fa-caret-down');
            btn.attr('aria-hidden', 'true');
            $('#reply-op-list').hide(200);
        }
    } else {
        var btn = $('#btn-down-audio');
        var status = btn.attr('aria-hidden');
        if (status === 'true') {
            btn.removeClass('fa-caret-down');
            btn.addClass('fa-caret-up');
            btn.attr('aria-hidden', 'false');
            $('#reply-audio-list').show(200);
            MessageChat.getAudioList();
        } else {
            btn.removeClass('fa-caret-up');
            btn.addClass('fa-caret-down');
            btn.attr('aria-hidden', 'true');
            $('#reply-audio-list').hide(200);
        }
    }

}

// 发送名片
function sendCard(contactWxid, alias, contactName) {
    var id = $('.ulLeft>li[class$="active"]').attr('belongid');
    var wxId = $('.ulLeft>li[class$="active"]').data('wxid');

    var message = {
        'room_from': {
            'avatar': $('.ulLeft>li[class$="active"]').attr('belongSrc')
        },
        'content': "发送名片:" + contactName,
        'type': 1,
        'self': 1,
        'self_class': 'self',
        'send_time': new Date().Format("yyyy-MM-dd HH:mm:ss"),
    };
    var messageHtml = wxMessage.drawMessage([message]);
    $('#ulList').append(messageHtml);
    $('#conversation').scrollTop($('#ulList').height());

    $.showLoading();
    $(".weui-toast_content").text("发送中");
    request('/chat/send/card', {
        'id': id,
        'wx_id': wxId,
        'contact_wxid': contactWxid,
        'contact_alias': alias,
        'contact_name': contactName,
        'type': 5
    }, function (e) {
        var length = $('#conversation .self .main[msg_tag="' + e.data.msg_tag + '"]').length;
        var lastMain = $('#conversation .self .main[msg_tag="' + e.data.msg_tag + '"]').eq(length - 1);
        var lastMsg = $('#conversation .self').eq($('#conversation .self').length - 1);
        var lastName = lastMsg.children('.right').children('.name');

        lastMain.attr('chat_from', e.data.chat_from);
        lastMain.attr('account_id', e.data.chat_to);
        lastMain.attr('wx_msg_id', e.data.wx_msg_id);
        lastName.text(e.data.nickname + ' ' + lastName.text());
        lastMsg.children('.check_msg').children('input').val(e.data.msg_id);
        lastMsg.children('.check_msg').children('input').attr('id', 'check_' + e.data.msg_id);
        lastMsg.children('.check_msg').children('label').attr('for', 'check_' + e.data.msg_id);

        $.hideLoading();
        if (e.code != 1) {
            if (e.data.msg_id == undefined) {
                lastMsg.remove();
            }
            lastMain.children('.warning-btn').addClass('show');
            alert1('发送失败', e.reason, '关闭', function () {
                hideAlert1()
            });
            return false;
        }
    });

}

// 确认完成该工单
$(".js-status-btn").click(function () {
    $("#txtCompleteDesc").val("");
    $(".popup-u-chat-01").show();
    $("#btnCompleteUChat").unbind("click").on("click", function () {

    });
});
