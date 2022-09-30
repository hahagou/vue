var view = function(id){
        return new Class(id);
    },

    Class = function(id){
    };

view.data = {
    tokenName: "token"
};

//获取token
view.getToken = function(){
    var session_token = window.sessionStorage.getItem(view.data.tokenName);
    if (session_token == null){
        var local_token = window.localStorage.getItem(view.data.tokenName);
        if(local_token !== null){
            window.sessionStorage.setItem(view.data.tokenName, local_token);
            session_token = local_token;
        }
    }
    return session_token;
};

//清除 token，并跳转到登入页
view.exit = function(){
    sessionStorage.removeItem(view.data.tokenName);
    localStorage.removeItem(view.data.tokenName);
    //跳转到登入页
    window.location.href = '/chat/login';
};

//错误信息
view.error = function(){
    console.log('**********error!');
};

//Ajax请求
view.req = function(options){
    var success = options.success,
        error = options.error;


    options.data = options.data || {};
    options.headers = options.headers || {};

    var token = view.getToken();
    if(token != null){
        options.headers[view.data.tokenName] = token;
    }

    delete options.success;
    delete options.error;

    return $.ajax($.extend({
        type: 'get'
        ,dataType: 'json'
        ,success: function(res){
            if(res.code == 10001){
                //登录状态失效，清除本地 access_token，并强制跳转到登入页
                view.exit();
            } else {
                //只有 response 的 code 一切正常才执行 done
                typeof options.done === 'function' && options.done(res);
            }

            //只要 http 状态码正常，无论 response 的 code 是否正常都执行 success
            typeof success === 'function' && success(res);
        }
        ,error: function(e, code){
            view.error();
            typeof error === 'function' && error(e);


        }
    }, options));
};