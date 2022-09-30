// 历史消息查询
var loadMessageParam = {
    'id': 0,        // 所属WSid
    'wx_id': '',    // 好友wxid
    'last_id': '',  // 本页最后一条消息id
    'keyword': '',  // 查询关键词
    'to_end': false,   // 是否加载完毕
    'to_bottom': true,  // 是否跳转最新消息
    'to_init': false,  // 聊天记录展示初始化
};

// 页面聊天列表key
var chatListKey = [];

var MessageChat = {
    // 客服台聊天页Tab标签
    titleTip: function () {
        var unreadCount = this.getUnreadCount();

        if (unreadCount === 0) {
            document.title = '客服工作台';
        } else {
            document.title = '您有' + unreadCount + "条未读消息";
        }
    },

    /* 加载聊天列表 */
    getMessage: function (group_id, account_id, keywords, last_id, init) {
        view.req({
            url: '/chat/list',
            data: {
                'group_id': group_id ? group_id : 0,
                'account_id': account_id ? account_id : 0,
                'keywords': keywords,
                'last_id': last_id ? last_id : 0,
            },
            done: function (e) {
                if (e.code == 0 || typeof (e.data.list) == 'undefined' || typeof (e.data.account) == 'undefined') {
                    //todo retry option alert
                    return false;
                } else {

                    var html = '';
                    if (init) {
                        $('#chatContactTab').html('');
                    }
                    if (e.data.list.length > 0) {
                        G.account = e.data.account;
                        for (let key in e.data.list) {
                            chatListKey.push('chat_' + e.data.list[key].order.wx_key);
                        }
                        html = template("chatsListTemplate", {chats: e.data});
                        $('#chatContactTab').append(html);
                        MessageChat.openChat($("#chatContactTab>li").eq(0));

                        $('.more-btn').show();
                        $('#searchKeyword').val(e.data.keywords);
                        $('#searchLastId').val(e.data.last_id);
                    } else {
                        html = '<p class="text-center text-muted mt-2"> 没有更多了~ </p>';
                        $('#chatContactTab').append(html);
                        $('.more-btn').hide();
                    }

                    // 更新筛选条件
                    $('#searchAccount').html('');
                    let account_option = '<option value="0">WS号</option>';
                    if (Object.keys(e.data.account_list).length > 0) {
                        account_option += template("searchAccountTemplate", {data: e.data});
                    }
                    $('#searchAccount').append(account_option);
                    $('#searchAccount').selectpicker('refresh');

                }
            }
        });
    },

    // 条件搜索
    chatSearch: function (init) {
        let group_id = $('#searchGroup').val() == '' ? 0 : $('#searchGroup').val();
        let account_id = group_id != 0 ? ($('#searchAccount').val() == '' ? 0 : $('#searchAccount').val()) : 0;
        let keywords = $('#searchKeyword').val();
        let last_id = 0;

        MessageChat.getMessage(group_id, account_id, keywords, last_id, true);
    },

    // 新的聊天（新增工单）
    // id:对应WS号 wxid:对应好友 setTop:消息是否置顶
    newMessageList: function (id, wxid, setTop) {
        view.req({
            url: '/chat/list',
            data: {
                'account_id': id,
                'wx_id': wxid,
            },
            done: function (e) {
                if (e.code == 0 || typeof (e.data.list) == 'undefined' || typeof (e.data.account) == 'undefined') {
                    //todo retry option alert
                    return false;
                } else {
                    var html = '';
                    if (e.data.list.length > 0) {
                        G.account = e.data.account;
                        // 聊天列表更新
                        chatListKey = Array.from(chatListKey);
                        for (let key in e.data.list) {
                            let new_chat_key = 'chat_' + e.data.list[key].order.wx_key;

                            if (chatListKey.includes(new_chat_key)) {
                                e.data.list.splice(key);
                            } else {
                                chatListKey.push('chat_' + e.data.list[key].order.wx_key);
                            }
                        }
                        if (e.data.list.length == 0) {
                            return;
                        }

                        html = template("chatsListTemplate", {chats: e.data});
                        var setTopNum = $('#chatContactTab>li.top').length;

                        // 消息置顶
                        if (setTop == 1 || setTopNum == 0) {
                            $('#chatContactTab').prepend(html);
                        } else {
                            // 放置顶消息之后
                            $("#chatContactTab li:nth-child(" + setTopNum + ")").after(html);
                        }
                    }
                }
            }
        });
    },

    // 点击聊天列表展开聊天窗
    openChat: function (e) {
        // 获取未读消息数
        var unread = e.find('.badge').text();
        // 聊天记录初始化
        $('#chatHistory').html('');
        var info = e.find('.contacts-content');

        belongInfo = {
            'id': info.data('belong-id'),
            'wxid': info.data('belong-wxid'),
            'alias': info.data('belong-alias'),
            'avatar': info.data('belong-avatar'),
            'nickname': info.data('belong-nickname'),
            'wx_status': info.data('belong-wx-status'),
            'wx_status_text': info.data('belong-wx-status-text'),
        };

        friendInfo = {
            'id': info.data('friend-id'),
            'wxid': info.data('friend-wxid'),
            'alias': info.data('friend-alias'),
            'avatar': info.data('friend-avatar'),
            'nickname': info.data('friend-nickname'),
            'remark': info.data('friend-remark'),
            'label': info.data('friend-label'),
            'area': info.data('friend-area'),
            'sex': info.data('friend-sex'),
            'type': info.data('friend-type'),
            'phone': info.data('friend-phone'),
            'signature': info.data('friend-signature'),
            'source': info.data('friend-source'),
            'addtime': info.data('friend-addtime'),

        };

        e.siblings('li').removeClass('active');
        e.addClass('active');
        $('#searchCollapse').removeClass('show');

        MessageChat.viewFriendInfo(friendInfo, belongInfo);
        loadMessageParam = {
            'id': belongInfo['id'],
            'wx_id': friendInfo['alias'],
            'last_id': 0,
            'keyword': '',
            'to_end': false,
            'to_bottom': true,
            'to_init': false
        };
        MessageChat.loadMessage(loadMessageParam);
        if (Number(unread) > 0) {
            MessageChat.readMessage(belongInfo['id'], friendInfo['wxid']);
            e.find('.badge').text('0');
            e.find('.badge').hide(200);
            e.removeClass('unread');
        }
        MessageChat.titleTip();
    },

    // 加载历史聊天记录
    loadMessage: function (param) {
        /*var dialog = bootbox.dialog({
            size: "small",
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>',
            closeButton: false
        });*/
        if (param.to_end) {
            return;
        }
        view.req({
            url: '/chat/history',
            type: "get",
            data: {
                'id': param.id,
                'wx_id': param.wx_id,
                'last_id': param.last_id,
                'keyword': param.keyword,
            },
            done: function (e) {
                if (e.data.list.length == 0) {
                    layer.msg('没有更多消息了~');
                    loadMessageParam.to_end = true;
                    return;
                }
                loadMessageParam.last_id = e.data.last_id;
                // 消息渲染
                var html = template("chatsMessageTemplate", {messages: e.data});
                if (param.to_init) {
                    $('#chatHistory').html('');
                }
                $('#chatHistory').prepend(twemoji.parse(qqface_change(html)));
                if (param.to_bottom) {
                    // 消息定位到最新
                    $('#messageBody').scrollTop($('#chatHistory').height());
                }
                if ($('#msg-send-op').hasClass('hide')) {
                    $('.check-msg').removeClass('hide');
                }
            }
        });

        /*setTimeout(function () {
            dialog.modal("hide");
        }, 1000);*/
    },

    // 聊天标记已读
    readMessage: function (id, wxId) {
        view.req({
            url: '/chat/read',
            type: "get",
            data: {'id': id, 'wx_id': wxId},
            done: function (e) {
            }
        });
    },

    // 聊天框好友信息渲染
    viewFriendInfo: function (friend, account) {
        let type = friend.type == 3 ? '好友' : friend.type == 2 ? '群聊' : '公众号';
        $('.chats .view-info-btn').text((friend.type == 3 ? '好友' : friend.type == 2 ? '群聊' : '公众号') + '信息');
        $('.chats .chat-title').text(account.nickname + ' 的' + type + ' ' + friend.nickname);
        $('.chats .account-wxid').text(account.alias == '' ? account.wxid : account.alias);
        $('.chats .friend-nickname').text(friend.remark ? friend.remark : friend.nickname);
        $('.chats .friend-avatar').attr('src', friend.avatar);
        $('.chats .friend-area').text(friend.area);
        $('.chats .friend-sex').text(friend.sex);
        $('.chats .friend-wxid').text(friend.alias == '' ? friend.wxid : friend.alias);
        $('.chats .friend-label').text(friend.label);
        $('.chats .friend-phone').text(friend.phone);
        $('.chats .friend-signature').text(friend.signature);
        $('.chats .friend-source').text(friend.source);
        $('.chats .friend-addtime').text(friend.addtime);
        friend.type == 2 ? $('.chats .view-chat-room-btn').show() : $('.chats .view-chat-room-btn').hide();

        $('.chats .account-wx-status').text((account.wx_status == 1 ? '[在线]' : '[离线]'));
        $('.chats .account-wx-status').removeClass('text-danger');
        $('.chats .account-wx-status').addClass('text-success');
        if (account.wx_status == 0) {
            $('.chats .account-wx-status').addClass('text-danger');
        }
        $('.chats .account-wx-status-text').text((account.wx_status_text != '' ? '[查看异常]' : ''));
        $('.chats .account-wx-status-text').attr('data-original-title', (account.wx_status_text != '' ? '(' + account.wx_status_text + ')' : ''));
        $("[data-toggle='tooltip']").tooltip();

        $('#viewSns').show();
        $('#viewRoomUsers').hide();
        if (friend.type != 3) {
            $('#viewSns').hide();
        }
        if (friend.type == 2) {
            $('#viewRoomUsers').show();
        }
        $('.chats .view-info-icon').attr('belong-id', Number(account.id));
        $('.chats .view-info-icon').attr('friend-wxid', friend.wxid);
    },

    // 获取新的好友数
    getFriendRequestNum: function () {
        /*view.req({
            url: '/chat/get_friend_request_num',
            type: "post",
            data: {id: 0},
            done: function (e) {
                if (e.data.count > 0) {
                    $('#newFriend').removeClass('btn-primary');
                    $('#newFriend').addClass('btn-danger');
                    $('#newFriend').find('span').removeClass('hide');
                    $('#newFriend').find('span').text('(' + e.data.count + ')');
                } else {
                    $('#newFriend').removeClass('btn-danger');
                    $('#newFriend').addClass('btn-primary');
                    $('#newFriend').find('span').addClass('hide');
                    $('#newFriend').find('span').text('');
                }
            }
        });*/
    },

    // 获取新的好友
    getFriendRequest: function () {
        /*view.req({
            url: '/chat/get_friend_request',
            type: "post",
            data: {id: 0},
            done: function (e) {
                let innerHTML = '';
                $('#newFriendList').html('');
                if (e.data.requests.length > 0) {
                    innerHTML = template("friendRequestTemplate", {data: e.data});

                    $('#newFriend').removeClass('btn-primary');
                    $('#newFriend').addClass('btn-danger');
                    $('#newFriend').find('span').removeClass('hide');
                    $('#newFriend').find('span').text('(' + e.data.requests.length + ')');
                } else {
                    innerHTML = '<p class="text-center text-muted mt-2">暂无数据</p>';

                    $('#newFriend').removeClass('btn-danger');
                    $('#newFriend').addClass('btn-primary');
                    $('#newFriend').find('span').addClass('hide');
                    $('#newFriend').find('span').text('');
                }
                $('#newFriendList').append(innerHTML);
            }
        });*/
    },

    // 获取未读消息数量
    getUnreadCount: function () {
        var sum = 0;
        $('.badge').each(function () {
            var count = Number($(this).text());
            sum += count;
        });
        return sum;
    },

    // 发送文本消息
    sendMsgText: function (id, wxId, content) {
        if (id == '' || wxId == '' || content == '') {
            bootbox.alert({
                message: "参数错误！请刷新重试!",
                size: 'small',
            });
            return false;
        }
        view.req({
            url: '/chat/send/text',
            type: "post",
            data: {
                'id': id,
                'wx_id': wxId,
                'content': content,
                'type': 1
            },
            done: function (e) {
                // 消息渲染
                var html = template("chatsMessageTemplate", {messages: e.data});
                $('#chatHistory').append(twemoji.parse(qqface_change(html)));
                // 消息定位到底部
                $('#messageBody').scrollTop($('#chatHistory').height());
            }
        });
    },

    // 获取好友名片列表
    selectCard: function () {
        let accountId = belongInfo['id'];
        let keywords = $('#friendsSearchInput').val();
        if (accountId == '') {
            bootbox.alert({
                message: "参数错误！请刷新重试!",
                size: 'small',
            });
            return false;
        }

        view.req({
            url: '/chat/get/friends',
            type: "get",
            data: {
                account_id: accountId,
                keywords: keywords
            },
            done: function (e) {
                let innerHTML = '';
                $('#friendCardList').html('');
                if (e.data.length > 0) {
                    innerHTML = template("friendCardTemplate", {friends: e.data});
                } else {
                    innerHTML = '<p class="text-center text-muted mt-2">暂无数据</p>';
                }
                $('#friendCardList').append(innerHTML);
            }
        });

        $('#startConversation').modal('show');
    },

    // 发送名片
    sendCard: function (contactWxid, alias, contactName) {
        let id = belongInfo['id'];
        let wxId = friendInfo['wxid'];
        if (id == '' || wxId == '') {
            bootbox.alert({
                message: "参数错误！请刷新重试!",
                size: 'small',
            });
            return false;
        }

        view.req({
            url: '/chat/send/card',
            type: "get",
            data: {
                'id': id,
                'wx_id': wxId,
                'contact_wxid': contactWxid,
                'contact_alias': alias,
                'contact_name': contactName,
                'type': 5
            },
            done: function (e) {
                // 消息渲染
                var html = template("chatsMessageTemplate", {messages: e.data});
                $('#chatHistory').append(twemoji.parse(qqface_change(html)));
                // 消息定位到底部
                $('#messageBody').scrollTop($('#chatHistory').height());
            }
        });
    },

    // 获取快捷回复语
    loadQuickReply: function () {
        view.req({
            url: '/chat/reply/list',
            type: "get",
            data: {'type': 0},
            done: function (e) {
                if (e.code == 1) {
                    var text_ul_html = '';
                    var voice_ul_html = '';
                    var img_ul_html = '';

                    for (let i = 0; i < e.data.length; i++) {
                        if (e.data[i].type == 1) {
                            text_ul_html += template('replyListTemplateHtml', {msg: e.data[i]});
                        }
                        if (e.data[i].type == 2) {
                            img_ul_html += template('replyListTemplateHtml', {msg: e.data[i]});
                        }
                        if (e.data[i].type == 3) {
                            voice_ul_html += template('replyListTemplateHtml', {msg: e.data[i]});
                        }
                    }

                    $('#ulQuickMsgText ul').html(text_ul_html);
                    $('#ulQuickMsgVoice ul').html(voice_ul_html);
                    $('#ulQuickMsgImage .form-row').html(img_ul_html);
                }
            }
        });
    },

    // 添加快捷回复消息
    addQuickMsg: function (type, conent, tag, time) {
        if (type == '' || conent == '') {
            bootbox.alert({
                message: "参数错误！请刷新重试!",
                size: 'small',
            });
            return false;
        }

        view.req({
            url: '/chat/reply/add',
            type: "post",
            data: {
                'type': type,
                'text': conent,
                'tpl_tag': tag,
                'time': time,
            },
            done: function (e) {
                if (e.code == 1) {
                    var text_ul_html = '';
                    var voice_ul_html = '';
                    var img_ul_html = '';

                    for (let i = 0; i < e.data.length; i++) {
                        if (e.data[i].type == 1) {
                            text_ul_html += template('replyListTemplateHtml', {msg: e.data[i]});
                        }
                        if (e.data[i].type == 2) {
                            img_ul_html += template('replyListTemplateHtml', {msg: e.data[i]});
                        }
                        if (e.data[i].type == 3) {
                            voice_ul_html += template('replyListTemplateHtml', {msg: e.data[i]});
                        }
                    }

                    $('#ulQuickMsgText ul').prepend(text_ul_html);
                    $('#ulQuickMsgVoice ul').prepend(voice_ul_html);
                    $('#ulQuickMsgImage .form-row').prepend(img_ul_html);
                }
            }
        });
    },

    // 删除快捷消息
    delQuickMsg: function (id) {
        view.req({
            url: '/chat/reply/delete',
            type: "POST",
            data: {id: id},
            done: function (e) {
                if (e.code == 1) {
                    $('#quick-msg-' + id).remove();
                }
            }
        });
    },

    // 发送语音
    sendAudio: function (id, wxId, src, send_type, time) {
        if (id == '' || wxId == '' || src == '') {
            bootbox.alert({
                message: "参数错误！请刷新重试!",
                size: 'small',
            });
            return false;
        }

        /*var dialog = bootbox.dialog({
            size: "small",
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>',
            closeButton: false
        });*/

        view.req({
            url: '/chat/send/audio',
            type: "post",
            data: {
                'id': id,
                'wx_id': wxId,
                'content': src,
                'type': 3,
                'send_type': send_type,
                'voice_time': time
            },
            done: function (e) {
                // 消息渲染
                var html = template("chatsMessageTemplate", {messages: e.data});
                $('#chatHistory').append(twemoji.parse(qqface_change(html)));
                // 消息定位到底部
                $('#messageBody').scrollTop($('#chatHistory').height());
            }
        });

        setTimeout(function () {
            dialog.modal("hide");
        }, 1000);
    },

    // 发送视频
    sendVideo: function (id, wxId, src, cover_img, play_length) {
        if (id == '' || wxId == '' || src == '') {
            bootbox.alert({
                message: "参数错误！请刷新重试!",
                size: 'small',
            });
            return false;
        }

        var dialog = bootbox.dialog({
            size: "small",
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>',
            closeButton: false
        });

        view.req({
            url: '/chat/send/video',
            type: "post",
            data: {
                'id': id,
                'wx_id': wxId,
                'content': src,
                'type': 4,
                'cover_img': cover_img,
                'play_length': play_length
            },
            done: function (e) {
                // 消息渲染
                var html = template("chatsMessageTemplate", {messages: e.data});
                $('#chatHistory').append(twemoji.parse(qqface_change(html)));
                // 消息定位到底部
                $('#messageBody').scrollTop($('#chatHistory').height());
            }
        });

        setTimeout(function () {
            dialog.modal("hide");
        }, 1000);
    },

    // 上传语音
    uploadAudio: function (src, eletar) {
        var dialog = bootbox.dialog({
            size: "small",
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>',
            closeButton: false
        });

        view.req({
            url: "/chat/upload_audios",
            type: "POST",
            data: {"file": src},
            done: function (e) {
                if (e.code == 1) {
                    var data = {
                        'id': 0,
                        'type': 3,
                        'text': e.data.filepath + '.mp3',
                        'tag': '',
                        'voice_time': e.data.time
                    };
                    var html = template("replyListTemplateHtml", {msg: data});
                    $("#uploadAudioList ul").append(html);
                }
                setTimeout(function () {
                    dialog.modal("hide");
                }, 1000);
            },
        });
    },

    getAudioTpl: function () {
        var all = [];
        var obj = $('#uploadAudioList>ul>li');
        if (obj.length == 0) {
            return all;
        }
        for (var i = 0; i < obj.length; i++) {
            var item = obj.eq(i);
            var t = {};

            t.type = 3;
            t.content = item.attr('data-url');
            t.voice_time = Number(item.attr('data-time'));
            all[all.length] = t;
        }
        return all;
    },

    // 新增快捷语音
    submitAudio: function () {
        var tpl = MessageChat.getAudioTpl();
        if (tpl.length == 0) {
            layer.msg('请上传内容后提交!');
            return false;
        }

        var tpl_tag = $('#reply_tag').val();

        var dialog = bootbox.dialog({
            size: "small",
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>',
            closeButton: false
        });

        for (i = 0; i < tpl.length; i++) {
            MessageChat.addQuickMsg(3, tpl[i].content, tpl_tag, tpl[i].voice_time);
        }

        setTimeout(function () {
            dialog.modal("hide");
        }, 1000);
        $("#modal-addAudio").modal("hide");
    },

    // 上传图片
    uploadImage: function (filedata, name) {
        var formData = {};
        formData.file = filedata;

        var dialog = bootbox.dialog({
            size: "small",
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>',
            closeButton: false
        });

        view.req({
            url: "/chat/upload_images",
            type: "POST",
            data: formData,
            done: function (e) {
                if (e.code == 1) {
                    var data = {
                        'id': 0,
                        'type': 2,
                        'text': e.data.filepath,
                        'tag': '',
                        'voice_time': ''
                    };
                    var html = template("replyListTemplateHtml", {msg: data});
                    $("#upImageList").append(html);
                }
                setTimeout(function () {
                    dialog.modal("hide");
                }, 1000);
            },
        });
    },

    // 新增快捷图片
    submitImage: function () {
        var pic = [];
        $('#upImageList div').each(function (i) {
            var imgs = {};
            imgs.url = $(this).find('img').attr('src');
            pic[i] = imgs;
        });
        if (pic.length == 0) {
            layer.msg('请上传图片后再提交！');
            return false;
        }

        var dialog = bootbox.dialog({
            size: "small",
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>',
            closeButton: false
        });

        for (i = 0; i < pic.length; i++) {
            MessageChat.addQuickMsg(2, pic[i].url, '', 0);
        }

        setTimeout(function () {
            dialog.modal("hide");
        }, 1000);
        $("#modal-addImage").modal("hide");
    },

    // 发送图片
    sendImage: function (id, wxId, src, send_type) {
        if (id == '' || wxId == '' || src == '') {
            bootbox.alert({
                message: "参数错误！请刷新重试!",
                size: 'small',
            });
            return false;
        }

        var dialog = bootbox.dialog({
            size: "small",
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>',
            closeButton: false
        });

        view.req({
            url: '/chat/send/image',
            type: "post",
            data: {
                'id': id,
                'wx_id': wxId,
                'content': src,
                'type': 2,
                'send_type': send_type
            },
            done: function (e) {
                // 消息渲染
                var html = template("chatsMessageTemplate", {messages: e.data});
                $('#chatHistory').append(twemoji.parse(qqface_change(html)));
                // 消息定位到底部
                $('#messageBody').scrollTop($('#chatHistory').height());
            }
        });

        setTimeout(function () {
            dialog.modal("hide");
        }, 1000);
    },

    // 标签列表
    loadLabels: function () {
        view.req({
            url: '/chat/label/list',
            type: "get",
            done: function (e) {
                if (e.code == 1) {
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
    },

    // 获取选择的消息
    getCheckMsg: function () {
        var checked = $(".message .la-check-circle");
        var ids = new Array();
        for (var i = 0; i < checked.length; i++) {
            ids[ids.length] = checked.eq(i).attr('msg-id');
        }
        return ids;
    },

    // 获取通讯录列表
    selectAddressBooks: function () {
        var dialog = bootbox.dialog({
            size: "small",
            message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> 通讯录加载中...</div>',
            closeButton: false
        });
        let keywords = $('#addressBookSearchInput').val();
        view.req({
            url: 'friend/list',
            data: {
                'type': 0,
                'group': 0,
                'account_id': belongInfo.id,
                'keywords': keywords,
                'last_id': 0,
                'pagesize': 2000
            },
            done: function (e) {
                setTimeout(function () {
                    dialog.modal("hide");
                }, 1000);
                var html = template("addressBookTemplate", {friends: e.data.friends});
                $('#addressBookList').html('');
                $('#addressBookList').append(html);
                $('#addressBookModal').modal('show');
            }
        });
    },

    // 获取选择的好友
    getCheckFriends: function () {
        var checked = $(".address_book_list .la-check-circle");
        var ids = new Array();
        for (var i = 0; i < checked.length; i++) {
            ids[ids.length] = checked.eq(i).attr('friend-id');
        }
        return ids;
    },

    // 消息转发
    msgForward: function (msgs, friends, account_id, wx_id) {
        view.req({
            url: '/chat/msg_forward',
            data: {
                'msgs': msgs,
                'friends': friends,
                'account_id': account_id,
                'wx_id': wx_id,
            },
            done: function (e) {
                $('#cancel-forward-msg').click();
                $('#addressBookModal').modal('hide');
                if (e.code == 1) {
                    layer.msg('操作成功, 转发任务后台执行中...');
                }
            }
        });
    },

    // 拍一拍
    pat: function (account_id, chat_from, to_wx_id, nick_name) {
        view.req({
            url: '/chat/pat',
            data: {
                'account_id': account_id,
                'chat_from': chat_from,
                'to_wx_id': to_wx_id
            },
            done: function (e) {
                if (e.code == 1) {
                    layer.msg('你拍了拍 "' + nick_name + '"');
                }
            }
        });
    },
};

// emoji表情渲染
function qqface_change(content) {
    var sb = "";
    var words = new Array();
    var isBegin = false;
    for (var i = 0; i < content.length; i++) {
        var ch = content.charAt(i);
        if (ch == '[') {
            if (sb.length > 0) {
                words.push(sb);
                sb = "";
            }
            sb = sb + ch;
            isBegin = true;
        } else if (ch == ']') {
            sb = sb + ch;
            if (isBegin) {
                words.push(sb);
                sb = "";
                isBegin = false;
            }
        } else {
            sb = sb + ch;
        }
        if (i == content.length - 1) {
            words.push(sb);
            sb = "";
        }
    }
    for (var i = 0; i < words.length; i++) {
        if (words[i].indexOf("[") != -1) {

            words[i] = words[i].substring(1, words[i].length - 1);
            if ($(".scroll-wrapper .face-tb a[title = '" + words[i] + "']")[0]) {
                words[i] = "<img src='/static/chat/images/qqface/" + words[i] + ".png'>";
            }
        }
    }
    content = words.join("");
    return content;
}

$('.js-face-btn').qqFace({
    assign: 'txtContent',
    appendbox: '.msg-input-bar'
});

$('.js-face-btn-2').qqFace({
    appendbox: '.text-box',
    assign: 'inviteMessage'
});

// 点击左侧聊天列表展开聊天
$(document).on('click', '#chatContactTab>li', function () {
    if ($(this).hasClass('active')) {
        return;
    }
    MessageChat.openChat($(this));
});

// 滚动到顶部查看更多历史消息
$('#messageBody').scroll(function (e) {
    if ($(this).scrollTop() == 0 && $('#chatHistory').height() != 0) {
        loadMessageParam.to_bottom = false;
        MessageChat.loadMessage(loadMessageParam);
    }
});

// 查找聊天记录
$(document).on('click', '#searchChatLog', function () {
    var keyword = $('#chatLogKeyWord').val();
    if (keyword == '') {
        bootbox.alert({
            message: "请输入关键词!",
            size: 'small'
        });
        return false;
    }
    loadMessageParam.keyword = keyword;
    loadMessageParam.last_id = 0;
    loadMessageParam.to_end = false;
    loadMessageParam.to_bottom = false;
    loadMessageParam.to_init = true;
    MessageChat.loadMessage(loadMessageParam);
});

// 查看朋友圈
$(document).on('click', '#viewSns', function (e) {
    var id = $(this).attr('belong-id');
    var wxId = $(this).attr('friend-wxid');
    if (id == '' || wxId == '' || wxId.indexOf("@") != -1) {
        bootbox.alert({
            message: "参数错误！请刷新重试!",
            size: 'small',
        });
        return false;
    }
    var baseUrl = "/chat/sns";
    var url = baseUrl + '?id=' + id + '&wx_id=' + wxId;
    $("#modal-iframe iframe").attr("src", url);
    $("#modal-iframe").modal("show");
});

// 查看新的朋友
$(document).on('click', '#newFriend', function (e) {
    MessageChat.getFriendRequest();
});

// 同意群邀请
$(document).on('click', '.agreeInviter', function () {
    let url = $(this).attr('data-url');
    let account_id = $(this).attr('data-account-id');
    if (url == '' || account_id == '') {
        bootbox.alert({
            message: "参数错误！请刷新重试!",
        });
        return false;
    }
    bootbox.dialog({
        size: 'small',
        message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> 处理中...</div>',
        //closeButton: false
    });

    view.req({
        url: '/chat/agree_group_inviter',
        type: "get",
        data: {'account_id': Number(account_id), 'url': url},
        done: function (e) {
            auth.hideLoading();
        }
    });
});

// 发送文本消息
$(document).on('click', '#sendMsg', function () {
    let id = belongInfo.id;
    let wxId = friendInfo.alias;

    $("#txtContent").find(".imgFace").each(function () {
        let name = $(this).attr("data-name");
        $(this).before("[" + name + "]");
        $(this).remove();
    });

    if ($("#txtContent").find('img').length > 0) {
        var img = new Array();
        $("#txtContent img").each(function (index) {
            MessageChat.sendImage(id, wxId, $(this).attr('src'), 1);
            $(this).remove();
        })
    }

    let content = $.trim($('#txtContent').text());
    if (content == '') {
        return false;
    }

    for (var i = 0; i < G.sensitiveWord.length; i++) {
        var replaceStr = '';
        var length = G.sensitiveWord[i].length;
        var r = new RegExp(G.sensitiveWord[i], "ig");
        for (var j = 0; j < length; j++) {
            replaceStr += '*';
        }
        content = content.replace(r, replaceStr);
    }
    $('#txtContent').html('');
    $('#txtContent').val('');

    MessageChat.sendMsgText(id, wxId, content);
});

// Enter键发消息
$(document).on("keydown", "#txtContent", function (e) {
    if (e.which == 13 && !e.ctrlKey) {
        $('#sendMsg').click();
        $('#txtContent').blur();
        setTimeout(function () {
            $('#txtContent').focus();
        }, 300);
        event.stopPropagation();
    }
});

// 撤回消息
$(document).on('click', ".go-back-msg", function () {
    let wx_msg_id = $(this).attr('wx_msg_id');
    let account_id = $(this).attr('account_id');
    let chat_from = $(this).attr('chat_from');
    if (wx_msg_id == '' || chat_from == '') {
        bootbox.alert({
            message: "撤回失败！请刷新重试!",
        });
        return false;
    }

    view.req({
        url: '/chat/go_back',
        data: {
            'wx_msg_id': wx_msg_id,
            'chat_from': chat_from,
            'account_id': account_id,
        },
        done: function (e) {
            $('#chatHistory .self .message-content').each(function () {
                if ($(this).attr('data-wx-msg-id') == wx_msg_id) {
                    $(this).parents('.self').remove();
                }
            });
        }
    });
});

// 处理新好友申请
$(document).on('click', '.op-request>button', function () {
    let _this = $(this);
    let fr_id = _this.parent().attr('data-request-id');
    let op = _this.attr('data-op');
    if (!fr_id || !op) {
        bootbox.alert({
            message: "通过失败！请刷新重试!",
        });
        return false;
    }
    if (op == 3) {
        $('#modal-reply').modal('show');
        $('#sendReply').attr('data-request-id', fr_id);
        return;
    }
    layer.msg('处理中...');
    view.req({
        url: '/chat/do_friend_request',
        data: {
            'id': fr_id,
            'op': op,
            'request_remark': ''
        },
        done: function (e) {
            layer.msg('操作成功');
            _this.parents('li').remove();
            // 更新数量
            MessageChat.getFriendRequestNum();
        }
    });
});

// 同意全部
$(document).on('click', '#agreeAllrequest', function () {
    layer.msg('处理中...');
    view.req({
        url: '/chat/do_friend_request',
        data: {
            'op': 1,
            'request_remark': ''
        },
        done: function (e) {
            layer.msg('操作成功，好友请求后台处理中...');
        }
    });
});

// 回复新好友
$(document).on('click', '#sendReply', function () {
    let fr_id = $(this).attr('data-request-id');
    let request_remark = $('#replyInput').val();
    if (request_remark == '') {
        layer.msg('请输入内容！');
        return false;
    }
    if (fr_id == '') {
        layer.msg('操作异常，请刷新重试！');
        return false;
    }
    layer.msg('处理中...');
    view.req({
        url: '/chat/do_friend_request',
        data: {
            'id': fr_id,
            'op': 3,
            'request_remark': request_remark
        },
        done: function (e) {
            layer.msg('回复成功');
            $('#modal-reply').modal('hide');
            $('#replyInput').val('');
            var innerHTML = '<p class="mt-1 mb-0"><span class="text-success font-sm">' + belongInfo.nickname + ': </span>' + request_remark + '</p>' +
                '<p class="text-muted font-sm mt-0 mb-1">' + e.data.time + '</p>';
            $('.reply_list_' + fr_id).append(innerHTML);
        }
    });
});

// 结束聊天
$(document).on('click', '.delete_chat', function () {
    var id = $(this).attr('data-belong-id');
    var wxId = $(this).attr('data-friend-wxid');
    var key = $(this).attr('data-key');
    var optype = $(this).attr('data-optype');
    if (!id || !wxId) {
        id = loadMessageParam.id;
        wxId = loadMessageParam.wx_id;
        key = ('#chatContactTab>li[class$="active"]').attr('id');
        optype = 0;
        if (!id || !wxId) {
            bootbox.alert({message: "操作失败！请刷新重试!",});
            return false;
        }
    }
    let message = optype == 0 ? '<p>确定结束该聊天?</p>' : '<p>确定不再接收ta的消息?</p>';
    bootbox.dialog({
        title: '提示',
        message: message,
        size: 'small',
        onEscape: true,
        backdrop: true,
        buttons: {
            fum: {
                label: '取消',
                className: 'btn-default',
                callback: function () {

                }
            },
            fo: {
                label: '确定',
                className: 'btn-success',
                callback: function () {
                    view.req({
                        url: '/chat/finish',
                        data: {
                            'id': id,
                            'wx_id': wxId,
                        },
                        done: function (e) {
                            $('#' + key).remove();
                            if ($('#chatContactTab>li').length > 0) {
                                MessageChat.openChat($('#chatContactTab li').eq(0));
                                // 移除聊天列表key
                                chatListKey.splice(chatListKey.findIndex(item => item === key), 1);
                            }
                        }
                    });
                    if (optype == 1) {
                        view.req({
                            url: '/chat/group/od_setShield',
                            data: {
                                'account_id': id,
                                'wx_account': wxId,
                                'service_id': 0,
                            },
                            done: function (e) {}
                        });
                    }
                }
            }
        }
    })
});

// 图片发送
$(document).on("change", ".img-file", function (e) {
    var id = belongInfo.id;
    var wxId = friendInfo.alias;

    var file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
        $('.img-file').val('');
        layer.msg('最大只允许上传5M的图片');
        return false;
    }
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onloadend = function (fre) {
        var src = fre.target.result;
        $('.img-file').val('');



        MessageChat.sendImage(id, wxId, src, 1);
    }
});

// 语音发送
$(document).on("change", ".audio-file", function (e) {
    var id = belongInfo.id;
    var wxId = friendInfo.alias;

    var file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
        $('.audio-file').val('');
        layer.msg('最大只允许上传2M的音频');
        return false;
    }
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onloadend = function (fre) {
        var src = fre.target.result;
        $('.audio-file').val('');

        MessageChat.sendAudio(id, wxId, src, 1, 10000);
    };
});

// 视频发送
$(document).on("change", ".video-file", function (e) {
    var id = belongInfo.id;
    var wxId = friendInfo.alias;

    var file = e.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
        $('.video-file').val('');
        layer.msg('最大只允许发送10M的视频');
        return false;
    }
    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onloadend = function (fre) {
        var src = fre.target.result;
        $('.video-file').val('');

        MessageChat.sendVideo(id, wxId, src, '', 1000);
    };
});

// 新增快捷消息（文本）
$(document).on("click", ".add-new-reply-text", function () {
    $('#addNewReplyText').modal('show');
    $('.expression').children('.scroll-wrapper').addClass('hide-scrollbar');
});

$(document).on("click", "#addNewReplyText .submit-btn", function () {
    $("#inviteMessage").find(".imgFace").each(function () {
        var name = $(this).attr("data-name");
        $(this).before("[" + name + "]");
        $(this).remove();
    });
    var content = $.trim($("#inviteMessage").text());
    if (content == "") {
        layer.msg('请输入内容！');
        return;
    }
    if (content.length > 200) {
        layer.msg('最多可设置200个字符！');
        return;
    }
    MessageChat.addQuickMsg(1, content, '', 0);
    $('#addNewReplyText').modal('hide');
});

// 新增快捷消息（语音/图片）
$(document).on("change", ".upfile", function (eve) {
    var eve = eve.target;
    var l = eve.files.length;
    var id = $(this).attr("id");
    for (var i = 0; i < l; i++) {
        (function (i) {
            var files = eve.files[i];
            if (files.size > 2 * 1024 * 1024) return;
            var fr = new FileReader();
            fr.readAsDataURL(files);
            fr.onloadend = function (e) {
                var src = e.target.result;
                if (id == "fileimage") { // 图片
                    MessageChat.uploadImage(src, 2);
                }
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

// 删除快捷消息
$(document).on("click", ".del-quick-msg", function (e) {
    var key = $(this).attr('data-ul');
    var open = $(this).attr('open');

    if (open) {
        $(this).attr('open', false);
        $(this).children('span').text('删除消息');
        $('#' + key).find('i').hide();
    } else {
        $(this).attr('open', true);
        $(this).children('span').text('取消删除');
        $('#' + key).find('i').show();
    }
});

$(document).on("click", ".del-msg", function (e) {
    var msg_id = $(this).attr('data-id');
    var msg_type = $(this).attr('data-type');
    if (msg_id == 0) {
        msg_type == 2 ? $(this).parent('div').remove() : $(this).parent('li').remove();
        return;
    }
    MessageChat.delQuickMsg(msg_id);
});

// 点击播放快捷语音
$(document).on("click", ".quick-msg-voice", function (e) {
    var key = 'audio-box-' + $(this).data('id');
    var audio_box = document.getElementById(key);
    var audio_play = $(this).find('.audio-play');

    if (audio_box !== null) {
        if (audio_box.paused) {
            audio_box.play();
            audio_play.removeClass('la-volume-off text-muted');
            audio_play.addClass('la-volume-up text-success');
            audio_box.addEventListener('ended', function () {
                audio_play.removeClass('la-volume-up text-success');
                audio_play.addClass('la-volume-off text-muted');
            }, false);
        } else {
            audio_box.pause();
            audio_play.removeClass('la-volume-up text-success');
            audio_play.addClass('la-volume-off text-muted');
        }
    }
});

// 双击发送快捷消息（文本）
$(document).on('dblclick', '#ulQuickMsgText li', function () {
    var id = belongInfo['id'];
    var wxId = friendInfo['wxid'];
    var content = $(this).attr("title");
    if (!id || !wxId || content == '') {
        return false;
    }
    MessageChat.sendMsgText(id, wxId, content);
});

// 双击发送快捷消息（语音）
$(document).on('dblclick', '#ulQuickMsgVoice li', function () {
    var id = belongInfo.id;
    var wxId = friendInfo.alias;
    var content = $(this).attr("data-url");
    var time = $(this).attr("data-time");

    MessageChat.sendAudio(id, wxId, content, 2, time);
});

// 双击发送快捷消息（图片）
$(document).on('dblclick', '#ulQuickMsgImage .img-box', function () {
    var id = belongInfo.id;
    var wxId = friendInfo.alias;
    var content = $(this).attr("data-url");

    MessageChat.sendImage(id, wxId, content, 2);
});

// 查看群成员
$(document).on('click', '#viewRoomUsers', function () {
    var id = belongInfo.id;
    var wxid = friendInfo.alias;

    view.req({
        url: '/chat/get/room_member',
        data: {
            'account_id': id,
            'wx_id': wxid
        },
        done: function (e) {
            var html = template("showRoomMembersTemplate", {members: e.data});
            $(".roomMembersList").html('');
            $("#roomMembersList").html(html);
            $("#roomMembersModal").modal("show");
        }
    });
});

// 聊天置顶
$(document).on('click', '.set_top', function (e) {
    let order_id = $(this).attr('data-order-id');
    let sort = $(this).attr('data-order-sort');
    let thisId = '#set_top_' + order_id;
    let parentsLi = '#' + $(this).attr('data-parent-li');

    if (order_id == '') {
        layer.msg('置顶失败！请刷新页面再试');
        return false;
    }

    view.req({
        url: "/chat/msg_set_top",
        type: "POST",
        data: {'order_id': order_id, 'sort': sort},
        done: function (e) {
            setTimeout(function () {
                $(thisId).attr('data-order-sort', e.data.sort);
                if (sort == 0) {    // 置顶
                    $(thisId).children('span').text('取消置顶');
                    $(thisId).children('i').removeClass('la-level-up-alt');
                    $(thisId).children('i').addClass('la-level-down-alt');
                    $(parentsLi).addClass('top');
                    $(parentsLi).prependTo('#chatContactTab');
                    layer.msg('置顶成功');
                } else {            // 取消
                    $(thisId).children('span').text('聊天置顶');
                    $(thisId).children('i').removeClass('la-level-down-alt');
                    $(thisId).children('i').addClass('la-level-up-alt');
                    $(parentsLi).removeClass('top');
                    $(parentsLi).appendTo('#chatContactTab');
                    layer.msg('取消成功');
                }
            }, 1000);
        }
    });
});

// 修改标签
$(document).on("click", ".edit-tag", function () {
    view.req({
        url: '/chat/label/list',
        data: {},
        done: function (e) {
            var html = template("usersTagTemplate", {tags: e.data});
            $("#love_label").html('');
            $("#love_label").html(html);
            $("#usersTagModal").modal("show");
        }
    });
});

// 添加标签
$(document).on("click", "#btnOpTag", function () {
    var tagContent = $("#addFriendTag").val();
    if (tagContent == "") {
        layer.msg('请输入标签内容');
        return false;
    }

    view.req({
        url: '/chat/add/label',
        data: {
            'content': tagContent,
        },
        done: function (e) {
            if (e.code == 1) {
                var html = "<option value=" + e.data.id + ">" + e.data.tag_text + "</option>";
                $("#love_label").prepend(html);
                layer.msg('添加成功');
            }
        }
    });
});

// 设置标签
$(document).on("change", "#love_label", function () {
    var tagId = $("#love_label option:selected").val();
    var tagContent = $("#love_label option:selected").text();
    if (tagId == "" || tagId == 0) {
        layer.msg('请选择标签');
        return false;
    }

    view.req({
        url: '/chat/set/label',
        data: {
            'id': belongInfo.id,
            'wx_id': friendInfo.alias,
            'content': tagId,
        },
        done: function (e) {
            $('.friend-label').text(tagContent);
            layer.msg('标签标记成功！');
        }
    });
});

// 设置备注
$(document).on("click", ".edit-remark", function () {
    if (friendInfo.type == 2) {
        $("#usersRemarkLabel").text('设置群聊名称');
    }
    $('#groupName').val(friendInfo.remark ? friendInfo.remark : friendInfo.nickname);
    $("#usersRemarkModal").modal("show");
});

$(document).on("click", ".subSetRemark", function () {
    var content = $('#groupName').val();
    if (content == '') {
        layer.msg('请输入内容');
    }

    // 设置群聊名
    if (friendInfo.type == 2) {
        view.req({
            url: "/chat/group/setting_names",
            type: "POST",
            data: {'chatRoom_name': content, 'ids': belongInfo.id},
            timeout: 30000,
            done: function (e) {
                layer.msg('设置成功');
            },
        });
    }

    // 设置好友备注
    if (friendInfo.type == 3) {
        view.req({
            url: "/chat/set/remark",
            type: "POST",
            data: {
                'content': content,
                'id': belongInfo.id,
                'wx_id': friendInfo.wxid,
            },
            timeout: 30000,
            done: function (e) {
                layer.msg('设置成功');
            },
        });
    }

    $('.chats .friend-nickname').text(content);
});

// 加载更多聊天列表
$(document).on("click", ".more-btn", function () {
    let group_id = $('#searchGroup').val();
    let account_id = $('#searchAccount').val();
    let keywords = typeof ($('#searchKeyword').val()) == 'undefined' ? '' : $('#searchKeyword').val();
    let last_id = $('#searchLastId').val();

    MessageChat.getMessage(group_id, account_id, keywords, Number(last_id), false);
});

// 获取原图
$(document).on("click", ".get_big_img", function () {
    var _this = $(this);
    var wx_msg_id = _this.attr('data-wx-msg-id') + '';

    //获取原图
    view.req({
        url: "/chat/get/image",
        type: "POST",
        data: {
            'id': belongInfo.id,
            'wx_msg_id': wx_msg_id,
        },
        timeout: 30000,
        done: function (e) {
            if (e.data.path != '') {
                layer.msg('获取原图成功, 请点击图片查看！');
                $('.image-message-' + wx_msg_id).attr('href', e.data.path);
                _this.remove();
                return;
            }
            layer.msg('获取原图失败！对方可能未选择发送原图,请稍后重试！');
        },
    });
});

// 图片粘贴
document.addEventListener('paste', function (e) {
    if (!(e.clipboardData && e.clipboardData.items)) {
        return;
    }
    //console.log(e.clipboardData.items)
    for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
        var item = e.clipboardData.items[i];
        //console.log(item)
        if (item.kind === "file") {
            var f = item.getAsFile();
            //console.log(f);
            if (typeof FileReader === 'undefined') {
                alert('抱歉，你的浏览器暂不支持图片粘贴！');
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var imgHTML = '<img src="' + e.target.result + '">';
                $('#txtContent').append(imgHTML);
                $('#txtContent').focus();
            }
            reader.readAsDataURL(f)
        }
    }
});

// 转发消息
$(document).on('click', '.msg_forward', function (e) {
    $('#msg-send-op').addClass('hide');
    $('#msg-forward-op').removeClass('hide');
    $('#chatHistory .check-msg').removeClass('hide');
});

// 消息选择
$(document).on('click', '#chatHistory .message', function (e) {
    var check_msg = $(this).find('.check-msg');
    if (check_msg.is('.la-check-circle')) {
        check_msg.removeClass('la-check-circle');
        check_msg.addClass('la-circle');
    } else {
        check_msg.removeClass('la-circle');
        check_msg.addClass('la-check-circle');
    }
    $('#chatHistory').addClass('msg_forward_list');
});

// 消息全选
$(document).on('click', '#check-msg-all', function (e) {
    var checkNum = MessageChat.getCheckMsg();
    if (checkNum.length > 0) {
        $('#chatHistory .check-msg').removeClass('la-check-circle');
        $('#chatHistory .check-msg').addClass('la-circle');
    } else {
        $('#chatHistory .check-msg').removeClass('la-circle');
        $('#chatHistory .check-msg').addClass('la-check-circle');
    }
});

// 取消转发
$(document).on('click', '#cancel-forward-msg', function (e) {
    $('#chatHistory .check-msg').removeClass('la-check-circle');
    $('#chatHistory .check-msg').addClass('la-circle');
    $('#chatHistory .check-msg').addClass('hide');
    $('#msg-send-op').removeClass('hide');
    $('#msg-forward-op').addClass('hide');
});

// 好友选择
$(document).on('click', '#addressBookList .address_book_list', function (e) {
    var check_friend = $(this).find('.check-friend');
    if (check_friend.is('.la-check-circle')) {
        check_friend.removeClass('la-check-circle');
        check_friend.addClass('la-circle');
    } else {
        check_friend.removeClass('la-circle');
        check_friend.addClass('la-check-circle');
    }
});

// 确认转发
$(document).on('click', '#msgForwardSuBtn', function (e) {
    var checkMsg = MessageChat.getCheckMsg();
    if (checkMsg.length == 0) {
        layer.msg('请选择要转发的消息');
        return false;
    }
    var checkFriends = MessageChat.getCheckFriends();
    if (checkFriends.length == 0) {
        layer.msg('请选择要转发的对象');
        return false;
    }
    var accountId = belongInfo.id;
    var wxId = friendInfo.alias;
    MessageChat.msgForward(checkMsg, checkFriends, accountId, wxId);
});

// 拍一拍
$(document).on('dblclick', '#chatHistory .img-box', function (e) {
    let account_id = belongInfo.id;
    let chat_from = friendInfo.wxid;
    let to_wx_id = $(this).attr('chat-from');
    let nick_name = chat_from == to_wx_id ? friendInfo.nickname : belongInfo.nickname;

    MessageChat.pat(account_id, chat_from, to_wx_id, nick_name);
});