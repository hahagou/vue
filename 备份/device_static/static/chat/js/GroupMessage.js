$(function () {
    $.ajax({
        url:ajax_head+"/api/employee/online_account_list.do",
        type:"post",
        data:{employee_token:sessionStorage.getItem("key")},
        success:function (res) {
            if(res.code == 200){
                var data = res.data.list;
                var html = "";
                for(var i =0 ; i< data.length ; i++){
                    var dr = data[i];
                    html += "<option value='"+dr.user_name+"'>"+dr.nick_name+"</option>"
                }
                $("#mySelect").html(html);
                $('#mySelect').selectpicker('refresh');
                $('#mySelect').selectpicker('render');
            }else{
                ShowConfirm("温馨提示", res.msg,1);
            }
        }
    })

    $(document).on("change","#mySelect",function () {
        console.log($(this).val());
        getUser($(this).val());
    })

    function getUser(user) {
        $.ajax({
            url: ajax_head+"/api/employee/contact_list.do",
            type:"post",
            data:{
                employee_token:sessionStorage.getItem("key"),
                account_username:user,
                keyword:""
            },
            success:function (ds) {
                $("#qunliao_add .check_box ul").html("");
                var html = template("lxr_list_tem",{"data":ds.data.list});
                $("#qunliao_add .lxr_box ul").html(html);

                qun_sou("qunliao_add");

                // 2.0点击效果
                $("#qunliao_add .lxr_box li").unbind("click").click(function () {
                    if($(this).hasClass("checked")){
                        $(this).removeClass("checked");
                        $("#qunliao_add .add_right .check_box li[username='"+$(this).attr("username")+"']").remove();

                    }else{
                        $(this).addClass("checked");
                        $("#qunliao_add .add_right .check_box ul").append($(this).clone());
                        $("#qunliao_add .add_right .check_box ul li[username = '"+$(this).attr("username")+"']").append("<span><img src='./images/add_del.png' alt=''></span>")
                    }
                    
                    //3.0 删除当前
                    $("#qunliao_add .add_right .check_box li span").unbind("click").click(function () {
                        $(this).parent().remove();
                        $("#qunliao_add .lxr_box li[username = '"+$(this).parent().attr("username")+"']").removeClass("checked");
                    })

                    // 确定添加
                    $("#qunliao_add .qun_btn .add_true").unbind("click").click(function () {
                        var list = [];
                        $("#qunliao_add .add_right .check_box li").each(function (i,e) {
                            list.push($(e).attr("username"));
                        })
                        if(list.length == 0){
                            ShowConfirm("温馨提示", "请先选择要邀请的好友！",1);
                            return;
                        }else{
                            var qun_nick = $("#create_name").val();
                            if(qun_nick == ""){
                                ShowConfirm("温馨提示", "请为新群确定昵称！",1);
                                return;
                            }
                            $.ajax({
                                url:ajax_head+"/api/employee/create_chat_room.do",
                                type:"post",
                                data:{
                                    employee_token:sessionStorage.getItem("key"),
                                    account_username:user,
                                    user:JSON.stringify(list)
                                },
                                success:function (res) {
                                    if(res.code == 200){

                                        var qun_name = func(res.data.user_name);
                                        $.ajax({
                                            url: ajax_head + "/api/employee/send_message.do",
                                            type:"post",
                                            data:{
                                                employee_token:sessionStorage.getItem("key"),
                                                account_username:user,
                                                username:qun_name,
                                                content:"创建群成功！"
                                            },
                                            success:function (data) {}
                                        })
                                        $.ajax({
                                            url:ajax_head+"/api/employee/set_chat_room_name.do",
                                            type:"post",
                                            data:{
                                                employee_token:sessionStorage.getItem("key"),
                                                account_username:user,
                                                chatroom:qun_name,
                                                name:qun_nick
                                            },
                                            success:function (data) {
                                                $("#create_name").val("");

                                                $.ajax({
                                                    url:ajax_head + "/api/employee/process_question_list.do",
                                                    data:{
                                                        employee_token:sessionStorage.getItem("key"),
                                                        keyword:""
                                                    },
                                                    success:function () {

                                                    }
                                                })

                                            }
                                        })
                                        ShowConfirm("温馨提示", "群"+qun_nick+"已创建！",1,function () {
                                           window.location.reload();
                                        });

                                    }else{
                                        ShowConfirm("温馨提示", res.msg,1);
                                    }
                                }
                            })
                        }
                    })

                })
            }
        })
    }


    //群聊中的搜索事件
    function qun_sou(id) {
        $("#"+ id +" .search input").keyup(function () {
            var sousuo_list = [];
            var text = $(this).val();
            $("#"+id+" .lxr_box li").each(function (i,e) {
                if($(e).text().indexOf(text) != -1 || $(e).attr("remark").indexOf(text) != -1){
                    sousuo_list.push(e);
                }
            })
            var html = "";
            $(sousuo_list).each(function (i,e) {
                html += "<li user_name = "+ $(e).attr("username") +">"+ $(e).text() +"</li>"
            })
            if(text != "" && text != " "){
                $("#"+id+" .search ul").show();
                $("#"+ id +" .search ul").html(html);

                // 搜索结果点击
                $("#"+ id +" .search ul li").unbind("click").click(function () {
                    $("#"+ id +" .lxr_box li[username="+ $(this).attr("user_name") +"]").trigger("click");
                    $("#"+ id +" .search ul").hide();
                })
            }else{
                $("#"+ id +" .search ul").hide();
            }
        })
    }
    function func(str){
        return str.substring(2,str.length)
    }



    // 提示框
    function ShowConfirm(title, value, id,func) {
        $("#ConfirmTitle").html(title);
        $("#ConfirmValue").html("<i class=\"fa fa-warning\"></i> " + value);
        $("#divConfirm").popup('show');
        Confirm_ID = id;

        $("#divConfirm .popup-btn-1").unbind("click").on("click",function () {
            $("#divConfirm").popup('hide');

            if(typeof(func) == "function"){
                func();
            }
        })
    }
})
