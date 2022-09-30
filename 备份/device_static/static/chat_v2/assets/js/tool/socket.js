/*
* @desc 聊天socket通讯
*
* */
var G = {
    account: {},
    sensitiveWord: {},
};

// 储存客服屏蔽的群
var shieldGroup = {};
var recorder;
var audio = document.getElementById('record');

$(document).ready(function () {
    var Index = {
        _init: function () {
            this.getRecord();
        },

        // 初始化数据
        getRecord: function () {
            var _that = this;
            view.req({
                url: '/chat/doIndex',
                type: "post",
                done: function (e) {
                    if (e.code == 1) {
                        _that.setWS(e.data);
                        G.sensitiveWord = e.data.sensitiveWord.split(',');
                        $("#vcUserName").text(e.data.username);
                        shieldGroup = e.data.shield_room;
                    } else {
                        layer.alert(e.reason);
                    }
                }
            })
        },

        // 连接websocket
        setWS: function (data) {
            var _that = this;
            auth.connect({
                data: {
                    username: data.username,
                    password: data.password,
                    server: data.im_server,
                    account: {},
                    sensitiveWordStr: data.sensitiveWord.split(','),
                },
                auth: function (e) {
                    if (auth.isAuth) {
                        auth.hideAlert();
                        auth.hideLoading();

                        // 加载数据
                        MessageChat.loadQuickReply();
                        MessageChat.getFriendRequestNum();
                    } else {
                        layer.alert("未知错误");
                    }
                },
                chat: function (e) {
                    if (typeof (e.data.list) != 'undefined' && e.data.list.length != 0) {
                        _that.receiveChat(e.data);
                    }
                },
                notice: function (e) {
                    console.log(e);
                    if (typeof (e.data.list) != 'undefined' && e.data.list.length != 0) {
                        _that.noticeShow(e.data);
                    }
                },
            });
        },

        // 消息提示语音
        playAudio: function () {
            var audio = document.getElementById('audio');
            audio.muted = false;
            audio.play();
        },

        // 成功接收到消息提示
        receiveChat: function (data) {
            /*console.log('----------来消息了-----------');
            console.log(data);*/

            if (data.list.length == 0) {
                return;
            }

            for (var k = 0; k < data.list.length; k++) {
                var is_shield = false;
                // 是否屏蔽了该群
                jQuery.each(shieldGroup, function (i, val) {
                    if (val['wx_account'] == data.order.chat_from && val['account_id'] == data.order.account_id) {
                        is_shield = true;
                        return false;
                    }
                });
                if (is_shield) {
                    continue;
                }
                // 是否为新的好友请求
                if (data.list[k].type == 20) {
                    MessageChat.getFriendRequest();
                }
                this.playAudio();
            }

            if (is_shield) {
                return false;
            }

            let new_chat_key = data.friend.wx_key != '' ? 'chat_' + data.friend.wx_key : 'chat_' + data.order.wx_key;
            let active_chat_key = $('#chatContactTab>li.active').attr('id');

            // 新消息是当前聊天窗口
            if (new_chat_key == active_chat_key) {
                let html = template("chatsMessageTemplate", {messages: data});
                $('#chatHistory').append(twemoji.parse(qqface_change(html)));
                $('#messageBody').scrollTop($('#chatHistory').height());
            } else {
                // 消息是否置顶
                var setTopNum = $('#chatContactTab>li.top').length;
                var isSetTop = 0;
                if (data.order && data.order.sort > 0) {
                    isSetTop = 1;
                }

                // 如果是新的聊天（新增聊天列表）
                if ($('#' + new_chat_key).length == 0) {
                    MessageChat.newMessageList(data.account.id, data.friend.wx_id, isSetTop);
                    //$(active_chat_key).addClass('active');
                } else {
                    var newChatHtml = $('#' + new_chat_key).prop("outerHTML");
                    $('#' + new_chat_key).remove();

                    // 消息位置
                    if (setTopNum == 0 || isSetTop == 1) {
                        $('#chatContactTab').prepend(newChatHtml);
                    } else {
                        $("#chatContactTab li:nth-child(" + setTopNum + ")").after(newChatHtml);
                    }
                }

                // 消息未读数
                let num = $('#' + new_chat_key).find('.badge').text();
                num++;
                $('#' + new_chat_key).find('.badge').text(Number(num));
                $('#' + new_chat_key).find('.badge').show(200);
            }
            MessageChat.titleTip();
        },

        // 通知类消息弹出
        noticeShow: function (data) {
            if (data.list.length == 0) {
                return;
            }
            let tag = data.account.phone ? data.account.phone : data.account.alias;
            for (var k = 0; k < data.list.length; k++) {
                let description = data.list[k].content;
                if (data.list[k].link != '') {
                    description = "<a target='_blank' title='点我查看详情' href='" + data.list[k].link + "'>" + data.list[k].content +"</a><br>" +
                        "<small>[点击蓝色字体在新页面查看详情]</small>";
                }
                var options = getOptions();
                options.title = '来自[' + data.friend.nickname + ']的提示！';
                options.description = description;
                options.remark = '所属微信：' + data.account.nickname + '(' + tag + ')';
                //options.image = '';
                options.image = {
                    visible: true
                };
                options.type = 'danger';
                GrowlNotification.notify(options);
            }
        }
    };

    Index._init();
});