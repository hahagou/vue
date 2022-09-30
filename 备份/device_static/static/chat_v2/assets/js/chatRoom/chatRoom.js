var ChatRoom = {
    // 接收/屏蔽 群消息
    shielGroup: function (params) {
        view.req({
            url : "/chat/group/od_setShield",
            type: "POST",
            data: params,
            timeout: 10000,
            done : function (rJson) {
                layer.msg('成功');
            },
            error: function() {
                layer.msg('系统异常!');
            }
        });
    },

    // 批量屏蔽群消息
    shielGroupAll: function (params) {
        view.req({
            url : "/chat/group/set_shieldAll",
            type: "POST",
            data: params,
            timeout: 90000,
            done : function (rJson) {
                setTimeout("location.reload()", 1000);
            },
            error: function() {
                layer.msg('系统异常!');
            }
        });
    },

    // 退群
    quitGroup: function(params, done){
        view.req({
            url : "/chat/group/quit_room",
            type: "POST",
            data: params,
            timeout: 90000,
            done : function (e) {
                typeof done == "function" && done(e);
            },
            error: function() {
                layer.msg('系统异常!');
            }
        });
    },

    // 打标签
    openTag: function (params, done) {
        view.req({
            url: '/chat/group/op_tag',
            data: params,
            type: "POST",
            done: function (e) {
                typeof done == "function" && done(e);
            }
        });
    },

    // 删除标签
    delTag: function (params, done) {
        view.req({
            url: '/chat/group/del_tagOrder',
            data: params,
            type: "POST",
            done: function (e) {
                typeof done == "function" && done(e);
            }
        });
    },

    // 点击修改二维码图片
    showQRcode: function (params, done) {
        view.req({
            url: '/chat/account/edit_code',
            data: params,
            type: "POST",
            done: function (e) {
                typeof done == "function" && done(e);
            }
        });
    },

    // 设置群名称
    setGroupName: function (params, done) {
        view.req({
            url: '/chat/group/setting_name',
            data: params,
            type: "POST",
            done: function (e) {
                typeof done == "function" && done(e);
            }
        });
    },

    // 设置群备注
    setGroupRemark: function (params, done) {
        view.req({
            url: '/chat/group/setting_remark',
            data: params,
            type: "POST",
            done: function (e) {
                typeof done == "function" && done(e);
            }
        });
    },


    // 导出群二维码
    exportQrCode: function (params, done) {
        view.req({
            url: '/chat/group/export_qrCode',
            data: params,
            type: "POST",
            async: true,
            timeout: 30000,
            done: function (e) {
                typeof done == "function" && done(e);
            },
            error: function (e) {
                $('#notice_text').html('请求超时，请重试！');
                $('#modal-text-tips').modal('show');
            },
        });
    },

    addRoomSub: function (params, done) {
        view.req({
            url: '/chat/group/rapid_add_chatRoom',
            data: params,
            type: "POST",
            async: true,
            timeout: 90000,
            done: function (e) {
                typeof done == "function" && done(e);
            },
            error: function (e) {
                setTimeout(function () {
                    $('#loaderPop').modal('hide');
                }, 1000);
                $('#notice_text').html('请求超时，请重试！');
                $('#modal-text-tips').modal('show');
            },
        });
    },

    saveAddressBook: function (params, done) {
        view.req({
            url: '/chat/friend/saveAddressBook',
            data: params,
            type: "GET",
            timeout: 10000,
            done: function (e) {
                typeof done == "function" && done(e);
            },
            error: function (e) {
                layer.msg('系统异常!');
            },
        });
    },

    // 展示好友
    showFriends: function (params, done) {
        view.req({
            url: '/chat/friend/list',
            data: params,
            type: "POST",
            timeout: 10000,
            done: function (e) {
                typeof done == "function" && done(e);
            },
            error: function (e) {
                layer.msg('系统异常!');
            },
        });
    }
};