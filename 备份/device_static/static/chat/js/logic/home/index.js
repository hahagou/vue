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
                    if(e.data.success){
                        MessageChat.getMessage();
                        MessageChat.getFriendList();

                        MessageChat.loadLabels();

                        MessageChat.messageClassify();
                        MessageChat.getAudioList();
                        MessageChat.loadQuickReply();
                    } else {
                        layer.alert("未知错误");
                    }
                },
                chat: function (e) {
                    if (typeof (e.data.list) != 'undefined' && e.data.list.length != 0) {
                        for (var i = 0; i < e.data.list.length; i++) {
                            _that.receiveChat(e.data.list[i]);
                        }
                    }
                }

            });
        },

        // 消息提示语音
        playAudio: function () {
            var audio = document.getElementById("audio");
            audio.play();
        },

        // 成功接收到消息提示
        receiveChat: function(data) {
            var is_shield = false;

            jQuery.each(shieldGroup, function (i, val) {
                if (val['wx_account'] == data.from.wx_id && val['account_id'] == data.to.id) {
                    //如果屏蔽了该群
                    is_shield = true;
                    return false;
                }
            });
            if(!is_shield){
                this.playAudio();
            }

            // console.log('----------来消息了-----------');
            // console.log(data);
            //新的好友请求
            if (data.type == 20) {
                MessageChat.getFriendList();
            } else {
                // 如果是好友
                // var text='';
                // console.log('data.from'+data.from);
                //     jQuery.each(data.from, function(i, val) {
                //
                //         text = text + "Key:" + i + ", Value:" + val;
                //
                //     });
                //     console.log(text);

                var setTopNum = $('#ulLeft>li.top').length;
                var isSetTop = 0;
                if (data.order && data.order.sort > 0) {
                    isSetTop = 1;
                }
                // console.log('-----消息工单是否已设置顶：' + isSetTop + '----');

                if (data.from.wx_id.indexOf("@") < 0) {
                    var activeLi = $('#ulLeft>li[class$="active"]');
                    // console.log('-----当前好友聊天列表置顶数：' + setTopNum + '----');

                    if (data.from.wx_id == activeLi.data('wxid') && data.to.id == activeLi.attr('belongId')) {
                        $('#ulLeft>li[class$="active"]').prependTo('#ulLeft');
                        var messageHtml = wxMessage.drawMessage([data]);
                        $('#ulList').append(qqface_change(messageHtml));
                        $('#conversation').scrollTop($('#ulList').height());
                    } else {
                        //如果是新的聊天
                        // console.log('----------新的好友信息-----------');
                        // console.log(data);
                        if ($('#ulLeft>li[data-wxid$="' + data.from.wx_id + '"][belongId="' + data.to.id + '"]').length == 0) {
                            data['belong'] = data.to;
                            data.unread = 1;
                            var contactHtml = wxMessage.drawContact([data]);
                            if (setTopNum == 0 || isSetTop == 1) {
                                $('#ulLeft').prepend(contactHtml);
                            } else {
                                $("#ulLeft li.wx_friend:nth-child(" + setTopNum + ")").after(contactHtml);
                            }
                        } else {
                            var obj = $('#ulLeft>li[data-wxid$="' + data.from.wx_id + '"][belongId="' + data.to.id + '"]').find('span');
                            obj.addClass('unread').attr('data-unread', Number(obj.attr('data-unread')) + 1);
                            if (setTopNum == 0 || isSetTop == 1) {
                                $('#ulLeft>li[data-wxid$="' + data.from.wx_id + '"][belongId="' + data.to.id + '"]').prependTo('#ulLeft');
                            } else {
                                $("#ulLeft li.wx_friend:nth-child(" + setTopNum + ")").after($('#ulLeft>li[data-wxid$="' + data.from.wx_id + '"][belongId="' + data.to.id + '"]'));
                            }
                        }
                    }
                } else {
                    var activeLi = $('#ulLeftGroup>li[class$="active"]');
                    setTopNum = $('#ulLeftGroup>li.top').length;
                    // console.log('-----当前群聊聊天列表置顶数：' + setTopNum + '----');

                    if (data.from.wx_id == activeLi.data('wxid') && data.to.id == activeLi.attr('belongId')) {
                        //如果是当前选中的聊天框
                        $('#ulLeftGroup>li[class$="active"]').prependTo('#ulLeftGroup');
                        var messageHtml = wxMessage.drawMessage([data]);
                        $('#ulList').append(qqface_change(messageHtml));
                        $('#conversation').scrollTop($('#ulList').height());
                    } else {
                        //如果是新的聊天
                        if ($('#ulLeftGroup>li[data-wxid$="' + data.from.wx_id + '"][belongId="' + data.to.id + '"]').length == 0) {
                            // console.log('----------新的群聊-----------');
                            // console.log(data);
                            var is_shield = false;
                            jQuery.each(shieldGroup, function (i, val) {
                                if (val['wx_account'] == data.from.wx_id && val['account_id'] == data.to.id) {
                                    //如果屏蔽了该群
                                    is_shield = true;
                                    return false;
                                }
                            });
                            data['belong'] = data.to;
                            // console.log('----------data[\'belong\']-----------');
                            // console.log(data['belong']);
                            data.unread = 1;
                            var contactHtml = wxMessage.drawContact([data]);
                            if (is_shield) {
                                re = new RegExp("unread unread_span", "i");
                                var contactHtml = contactHtml.replace(re, "unread_span");
                            }
                            if (setTopNum == 0 || isSetTop == 1) {
                                $('#ulLeftGroup').prepend(contactHtml);
                            } else {
                                $("#ulLeftGroup li.wx_friend:nth-child(" + setTopNum + ")").after(contactHtml);
                            }
                        } else {
                            //已有会话记录
                            // console.log('----------已有会话记录的群聊-----------');
                            // console.log(data);
                            var obj = $('#ulLeftGroup>li[data-wxid$="' + data.from.wx_id + '"][belongId="' + data.to.id + '"]').find('span');
                            var is_shield = false;

                            jQuery.each(shieldGroup, function (i, val) {
                                if (val['wx_account'] == data.from.wx_id && val['account_id'] == data.to.id) {
                                    //如果屏蔽了该群
                                    is_shield = true;
                                    return false;
                                }
                            });

                            if (is_shield) {
                                obj.removeClass('unread').attr('data-unread', Number(obj.attr('data-unread')) + 1);
                            } else {
                                obj.addClass('unread').attr('data-unread', Number(obj.attr('data-unread')) + 1);
                            }
                            if (setTopNum == 0 || isSetTop == 1) {
                                $('#ulLeftGroup>li[data-wxid$="' + data.from.wx_id + '"][belongId="' + data.to.id + '"]').prependTo('#ulLeftGroup');
                            } else {
                                $("#ulLeftGroup li.wx_friend:nth-child(" + setTopNum + ")").after($('#ulLeftGroup>li[data-wxid$="' + data.from.wx_id + '"][belongId="' + data.to.id + '"]'));
                            }
                        }
                    }
                }

            }

            MessageChat.titleTip();
        }
    };


    Index._init();
});