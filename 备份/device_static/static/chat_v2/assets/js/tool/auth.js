/*
* @desc 聊天客服登录权限校验
*
* */
var auth = {
    data: {
        username: null,
        password: null,
        server: null,
        account: {},
        sensitiveWordStr: null,
    },
    ws: null,
    isAuth: false,
    heart: null,

    connect: function (options) {
        var _that = this;
        $.extend(_that.data, options.data);
        _that.success = options.success;
        _that.error = options.error;
        _that.auth = options.auth;
        _that.chat = options.chat;
        _that.notice = options.notice;

        if (_that.ws != null) {
            return false;
        }
        _that.loading('连接中', '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> 正在尝试连接服务器...</div>');

        _that.ws = new WebSocket(_that.data.server);

        _that.ws.onerror = function (e) {
            _that.ws = null;
            _that.isAuth = false;
            if (_that.heart != null) {
                clearInterval(_that.heart);
            }
            _that.hideLoading();
            setTimeout(function () {
                _that.alert('失去连接', '与服务器连接失败', '重连', function () {
                    _that.hideAlert();
                    _that.ws = null;
                    _that.connect(options);
                });
            }, 1000);
        };

        _that.ws.onopen = function (e) {
            _that.hideLoading();
            //_that.login();
            setTimeout(function () {
                if (_that.isAuth !== true && _that.ws != null) {
                    _that.ws.close();
                }
            }, 10000);
        };

        // 服务端主动推送消息
        _that.ws.onmessage = function (e) {
            try {
                var data = JSON.parse(e.data);
                /*console.log('----------msg()中的数据-----------');
                console.log(data);*/
            } catch (e) {
                return false;
            }
            _that.msg(data);
        };

        _that.ws.onclose = function (e) {
            // error message
            if (_that.heart != null) {
                clearInterval(_that.heart);
            }
            _that.hideLoading();
            setTimeout(function () {
                _that.alert('失去连接', '与服务器连接失败', '重连', function () {
                    _that.hideAlert();
                    _that.ws = null;
                    _that.connect(options);
                });
            }, 500);
        }
    },

    login: function (data) {
        var _that = this;
        _that.loading('登录中', '正在登录聊天服务器...');
        /*var authData = {
            type: 'auth',
            data: {
                "username": _that.data.username,
                "password": _that.data.password
            }
        };
        _that.send(authData);*/

        $.post('/chat/bind', {client_id: data.client_id}, function (e) {
            _that.hideLoading(1000);
            _that.isAuth = e.code == 1 ? true : false;
            if (_that.isAuth === true) {
                _that.heart = setInterval(function () {
                    _that.send({"type": "heart"});
                }, 20000);
                typeof _that.auth === 'function' && _that.auth(data);
            } else {
                if (_that.heart != null) {
                    clearInterval(heart);
                }
                if (_that.ws != null) {
                    _that.ws.close();
                }
            }
        }, 'json');
    },

    send: function (data) {
        this.ws.send(JSON.stringify(data));
    },

    loading: function (title, content) {
        bootbox.dialog({
            title: title,
            message: content,
            size: "small",
            closeButton: false,
        })
    },

    hideLoading: function (time) {
        time = !time ? 500 : time;
        setTimeout(function () {
            $('.bootbox').modal('hide');
        }, time);
    },

    alert: function (title, content, btnText, callback) {
        bootbox.dialog({
            title: title,
            message: content,
            size: 'small',
            onEscape: true,
            backdrop: true,
            closeButton: false,
            buttons: {
                fum: {
                    label: btnText,
                    className: 'btn-danger',
                    callback: function () {
                        callback();
                    }
                }
            }
        });
    },

    hideAlert: function (time) {
        time = !time ? 500 : time;
        setTimeout(function () {
            $('.bootbox').modal('hide');
        }, time);
    },

    // 接收消息
    msg: function (data) {
        var _that = this;

        if (data.type == 'auth') {
            _that.hideLoading();
            _that.isAuth = data.data.success === true ? true : false;
            if (_that.isAuth === true) {
                _that.heart = setInterval(function () {
                    _that.send({"type": "heart"});
                }, 20000);

                typeof _that.auth === 'function' && _that.auth(data);

            } else {
                if (_that.heart != null) {
                    clearInterval(heart);
                }
                if (_that.ws != null) {
                    _that.ws.close();
                }
            }

        } else if (data.type == 'heart') {

        } else if (data.type == 'init') {
            _that.login(data);

        } else if (data.type == 'chat') {
            typeof _that.chat === 'function' && _that.chat(data);
            MessageChat.titleTip();

        } else if (data.type == 'notice') {
            typeof _that.notice === 'function' && _that.notice(data);
        }
    },
};
