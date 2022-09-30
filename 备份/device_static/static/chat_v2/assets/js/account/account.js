var Account = {
    // 查看朋友圈
    viewSns: function (id, wxId, type) {
        var baseUrl = "/chat/sns";
        var url = baseUrl + '?id=' + id + '&wx_id=' + wxId + '&type=' + type;
        $('#modal-iframe #frindspage').attr('src', url);
        if (type == 0) {
            $('#modalTitleH4').html("查看朋友圈");
        } else {
            $('#modalTitleH4').html("我发表的朋友圈");
            $('#del-btn').show();
        }
        $('#modal-iframe').modal('show');
    },

    // 同步通讯录
    syncAddressBook: function (params) {
        view.req({
            url: '/chat/account/re_fresh',
            type: "get",
            data: params,
            beforeSend: function(){
                $('#load_text').html('数据同步中，请稍候...');
                $('#loaderPop').modal('show');
            },
            done: function (e) {
                setTimeout(function () {
                    $('#loaderPop').modal('hide');
                    if(e.code == 0){
                        $('#notice_text').html(e.error_message);
                        $('#modal-text-tips').modal('show');
                        return false;
                    }
                    window.location.reload();
                }, 1000);
            },
            error : function (e) {
                setTimeout(function () {
                    $('#loaderPop').modal('hide');
                    $('#notice_text').html('请求超时，请重试！');
                    $('#modal-text-tips').modal('show');
                }, 1000);
            }
        })
    },

    //设置WS号
    setWxId: function (params) {
        view.req({
            url: '/chat/account/set/wxid',
            type: "post",
            data: params,
            timeout: 30000,
            done: function (e) {
                if (e.code == 1) {
                    window.location.reload();
                } else {
                    $('#notice_text').html(e.reason);
                    $('#modal-text-tips').modal('show');
                }
            }
        });
    },

    // 清粉
    clearFans: function (accountId) {
        $('#load_text').html('清理中');
        $('#loaderPop').modal("show");

        view.req({
            url: '/chat/account/clear_account',
            type: "POST",
            data: {
                account: accountId,
            },
            timeout: 600000,
            error: function (e) {
            },
            done: function (rJson) {
                $('#load_text').html('');
                $('#loaderPop').modal('hide');

                if (rJson.code == 0) {
                    $('#notice_text').html(rJson.reason);
                    $('#modal-text-tips').modal('show');
                } else {
                    $('#notice_text').html("成功清除" + rJson.data.count + "个僵死粉");
                    $('#modal-text-tips').modal('show');
                }
            }
        });
    },

    // 扫码进群
    qrcodeJoinRoom: function (params, callback) {
        $('#load_text').html('执行中，请稍后...');
        $('#loaderPop').modal('show');

        view.req({
            url: '/chat/account/scan_code_ioin_group',
            type: "POST",
            data: params,
            timeout: 30000,
            dataType: "json",
            done: function (e) {
                setTimeout(function () {
                    $('#loaderPop').modal('hide');
                }, 1000);

                if (e.code == 0) {
                    layer.msg(e.reason);
                    return false;
                }
                if (e.code == 1) {
                    layer.msg('操作成功');
                    $('#modal-upQrcode').modal('hide');
                }
                typeof callback === 'function' && callback(e);
            },
            error: function () {
                setTimeout(function () {
                    $('#loaderPop').modal('hide');
                }, 1000);
                layer.msg('操作失败!请重试');
            }
        });
    },

    //修改分组
    changeGroup: function (params) {
        $('#load_text').html('修改中...');
        $('#loaderPop').modal('show');

        view.req({
            url: '/chat/account/group',
            type: "post",
            data: params,
            done: function (e) {
                setTimeout(function () {
                    $('#loaderPop').modal('hide');
                    $('#notice_text').html(e.reason);
                    $('#modal-text-tips').modal('show');
                    return false;
                }, 1000);
            }
        });
    },

    // 切换二维码
    editCode: function (params) {
        view.req({
            type: "POST",
            dataType: "json",
            url: "/chat/account/edit_code",
            data: params,
            done: function (rJson) {
                if (rJson.code == 0) {
                    layer.msg(rJson.reason);
                    return false;
                }

                $('#img_source').attr('src', rJson.data.qr_code + "?a=" + Math.random());
                $('#wxQrcode' + params.id).attr('src', rJson.data.qr_code + "?a=" + Math.random());
            }
        });
    },

    // 查找好友
    findFriend: function (id, keyword) {
        if (!id || !keyword) {
            layer.msg('无效的参数！');
            return false;
        }

        view.req({
            url: '/chat/account/search_friends',
            type: "post",
            data: {
                'account_id': id,
                'search_wx': keyword
            },
            done: function (e) {
                //$('#friendSearchList').html('');
                //var resultHtml = "<span class='text-muted text-center mt-2'>该用户不存在</span>";
                if (e.data) {
                    layer.msg('添加成功！');
                    //resultHtml = template('searchFriendTemplate', {friend: e.data});
                }
                //$('#friendSearchList').append(resultHtml);
            }
        });
    },

    // 发送好友请求
    addFriendRequest: function (id, search_wx, stranger_v1, stranger_v2, verify_msg ,remark) {
        if (!id || !search_wx || !stranger_v1 || !stranger_v2) {
            layer.msg('无效的参数！');
            return false;
        }
        view.req({
            url: '/chat/account/add_friend',
            type: "post",
            data: {
                'stranger_v1': stranger_v1,
                'stranger_v2': stranger_v2,
                'remark': remark,
                'verify_msg': verify_msg,
                'account_id': id,
                'search_wx': search_wx,
            },
            done: function (e) {
                if (e.code == 1) {
                    layer.msg('发送成功！');
                }
            }
        });
    }
};