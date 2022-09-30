$(document).ready(function () {
    var Login = {
        getParams : function () {
            return {
                username : $('input[name="username"]').val(),
                password : $('input[name="password"]').val(),
                code :  $('input[name="code"]').val()
            }
        }
    };

    $(document).on('click', '.doLogin', function () {
        var input = Login.getParams();
        if(input.username == ''){
            layer.msg('请输入用户名');
            return false;
        }

        if(input.password == ''){
            layer.msg('请输入密码');
            return false;
        }

        if(input.code == ''){
            layer.msg('请填写验证码');
            return false;
        }

        view.req({
            url: '/chat/login/submit',
            type: "post",
            data: input,
            done: function (e) {
                if (e.code == 1) {
                    var remember = $('input[name="remember"]:checked').val();
                    if(remember === "1"){
                        localStorage.setItem('token', e.data.token);
                    } else {
                        localStorage.removeItem('token');
                    }
                    sessionStorage.setItem('token', e.data.token);
                    window.location.href = '/chat/index.html';
                } else {
                    layer.msg(e.reason);
                    $('input[name="password"]').val('');
                    $('input[name="code"]').val('');
                    return false;
                }
            }
        });
    });
});