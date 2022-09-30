var auth = {
    data : {
        username: null,
        password: null,
        server: null,
        account: {},
        sensitiveWordStr: null,
    },
    ws : null,
    isAuth : false,
    heart : null,

    connect : function (options) {
        var _that = this;
        $.extend(_that.data, options.data);
        _that.success = options.success;
        _that.error = options.error;
        _that.auth = options.auth;
        _that.chat = options.chat;

        if (_that.ws != null) {
            return false;
        }
        _that.loading('连接中', '正在尝试连接服务器...');

        _that.ws = new WebSocket(_that.data.server);


        _that.ws.onerror = function (e) {
            _that.ws = null;
            _that.isAuth = false;
            if (_that.heart != null) {
                clearInterval(_that.heart);
            }
            _that.hideLoading();
            _that.alert('失去连接', '与服务器连接失败', '重连', function () {
                _that.hideAlert();
                _that.connect(options);
            });
        };

        _that.ws.onopen = function (e) {
            _that.hideLoading();
            _that.login();
            setTimeout(function () {
                if (_that.isAuth !== true && _that.ws != null) {
                    _that.ws.close();
                }
            }, 10000);

        };

        _that.ws.onmessage = function (e) {
            //console.log(e.data);
            _that.msg(e.data);
        };

        _that.ws.onclose = function (e) {
            // error message
        }
    },

    login : function () {
        var _that = this;
        _that.loading('登录中', '正在登录聊天服务器...');
        var authData = {
            type: 'auth',
            data: {
                "username": _that.data.username,
                "password": _that.data.password
            }
        };
        _that.send(authData);
    },


    send : function (data) {
        this.ws.send(JSON.stringify(data));
    },

    loading : function (title, content) {
        $('#loadingBox #loadingTitle').html(title);
        $('#loadingBox #loadingText').html(content);
        $('#loadingBox').show();
    },

    hideLoading : function () {
        $('#loadingBox').hide();
    },

    hideAlert : function () {
        $('#alertBox').hide();
    },

    alert : function (title, content, btnText, callback) {
        this.hideAlert();
        $('#alertBox #alertTitle').html(title);
        $('#alertBox #alertText').html(content);
        $('#alertBox #alertEvent').html(btnText);
        $(document).off('click', '#alertEvent');
        $(document).on('click', '#alertEvent', function () {
            callback();
        });
        $('#alertBox').show();
    },

    // 接收消息
    msg : function(e) {
        var _that = this;
        try {
            data = JSON.parse(e);
            // console.log('----------msg()中的数据-----------');
            // console.log(data);
        } catch (e) {
            return false;
        }
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

        } else if (data.type == 'chat') {
            typeof _that.chat === 'function' && _that.chat(data);
        }
    },
};
