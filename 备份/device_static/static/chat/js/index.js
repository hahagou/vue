$(function () {
    //------------------------------------------- 公共变量区域  ----------------------------------------------------
    var current_admin = "";//当前管理员
    var current_user = "";//当前对话者
    var question_id = "";//问题ID
    var contact_id = "";//用户ID
    var formData="";
    var old_id = "";//旧消息ID



    //----------------------------------------------- 配置websocket -------------------------------------------------
    // var webSocket = null;
    // function connectWebsocket(token) {
    //     if(webSocket != null){
    //         alert("webSocket 已经连接，请勿重复连接！");
    //         return;
    //     }
    //     var host = null;
    //     if (window.location.protocol == 'http:') {
    //         // host = 'ws://'+document.domain+":"+window.location.port+'/websocket/'+token;
    //         host = ws_url+"/websocket/"+token;
    //     } else {
    //     }
    //     webSocket = new ReconnectingWebSocket(host,null,{debug: true,debugAll:true});
    //     webSocket.onconnecting = function (event) {

    //     };
    //     webSocket.onopen = function (event) {

    //     };
    //     webSocket.onmessage = function (event) {
    //         var data = JSON.parse(event.data);
    //         if(data.type == "msg"){
    //             if($("#aUChatTab").parent().hasClass("active")){
    //                 RefreshQuestionList();
    //             }else if($("#aCustomTab").parent().hasClass("active")){
    //                 RecentContactsList();
    //             }
    //             $(data.list).each(function (i,e) {
    //                 if(e.c == current_user){
    //                     GetInfoNewById(current_admin,current_user);
    //                 }
    //             })
    //         }

    //     };
    //     webSocket.onclose = function (event) {

    //     };
    //     webSocket.onerror = function (event) {

    //     };
    // };
    // function sendWebsocket(msg){
    //     if(webSocket == null){
    //         alert("webSocket 尚未连接！");
    //         return;
    //     }
    //     webSocket.send(msg)

    // };
    // function closeWebsocket(){
    //     if(webSocket == null){
    //         alert("webSocket 尚未连接，无需关闭！");
    //         return;
    //     }

    //     webSocket.close(1000,"exit...");
    //     webSocket = null;
    // };
    // function testSend(){
    //     sendWebsocket("你好！");
    // }
    // function testClose(){
    //     closeWebsocket();
    // }

    // // webSocket检测
    // setInterval(function () {
    //     sendWebsocket(new Date().getTime());
    // },30000)

    //-----------------------------------------------  页面初始化  ---------------------------------------------------
    // page_init();
    // function page_init() {
    //     connectWebsocket(sessionStorage.getItem("key"));
    //     RefreshQuestionList();
    //     RecentContactsList();
    //     get_self_status();
    //     LoadzQuickMsgList();
    //     LoadPersonalQuickMsg();
    //     getQunCjList();
    //     $("#vcUserName").html(sessionStorage.getItem("admin_name"));
    // }


    //----------------------------------------------- 事件触发机制  -------------------------------------------------


    // 待回复列表刷新
    $("#aUChatTab").click(function () {
        RefreshQuestionList();
    })
    //最近联系列表刷新
    $("#aCustomTab").click(function () {
        RecentContactsList();
    })

    //批量选中点击
    $("#check_list").on("click",function () {
        if($(this).prop("checked")){
            $(".checked_all").addClass("green");
            $(".js-face-btn").hide();
            $("a[data-note='图片']").hide();
        }else{
            $(".checked_all").removeClass("green");
            $(".js-face-btn").show();
            $("a[data-note='图片']").show();
        }
    })

    $(document).on("click",".checked_all.green",function () {
        console.log(1);
        if($(".ulLeft .active").length != 0){
            $(".ulLeft li").removeClass("active");
        }else{
            $(".ulLeft li").addClass("active");
        }
    })

    //左侧好友区域点击
    $(".scroll-box").on("click",".wx_friend",function () {
        var admin_id = $(this).attr("data-account_username");//发送者ID
        current_admin = admin_id;
        var question = $(this).attr("id"); //对方账号
        if($("#check_list").prop("checked")){
           if($(this).hasClass("active")){
               $(this).removeClass("active");
           }else{
               $(this).addClass("active");
           }
            return;
        }
        current_user = question;
        question_id = $(this).attr("question_id");//问题ID
        contact_id = $(this).attr("contact_id");//用户ID

        if(question.indexOf("@chatroom") != -1){
            $("#aFriends").text("群信息");
            $("#group-info").show();
            $("#user-info").hide();
            $(".top-name .right").show();
            GetChat_State(current_admin,current_user);
        }else{
            $("#aFriends").text("好友信息");
            $("#group-info").hide();
            $("#user-info").show();
            $(".top-name .right").hide();
        }

        GetInfoById(admin_id,question);
        $(this).find(".sp_noReadCount").remove();
        get_all_num();
        $("#div_name").html($(this).attr("from_name") + " 的好友："+ $(this).find(".t1-1").html());
        // $('#div_name').attr('wxId',$(this).data('wxid'));
        $(this).addClass("active").siblings().removeClass("active");
        $("#txtContent").html("");

        $(".u-center .scroll-box").animate({ scrollTop: parseInt($("#ulList").height()) + parseInt($("#ulList").height()) }, 0);
        $("#kjhf").trigger("click");

    })

    //特别关心好友点击
    $("#ulLove").on("click",".wx_friend",function () {
        var admin_id = $(this).attr("data-account_username");//发送者ID
        current_admin = admin_id;
        var question = $(this).attr("id"); //对方账号
        if($("#check_list").prop("checked")){
            if($(this).hasClass("active")){
                $(this).removeClass("active");
            }else{
                $(this).addClass("active");
            }
            return;
        }
        current_user = question;
        question_id = $(this).attr("question_id");//问题ID
        contact_id = $(this).attr("contact_id");//用户ID

        if(question.indexOf("@chatroom") != -1){
            $("#aFriends").text("群信息");
            $("#group-info").show();
            $("#user-info").hide();
            $(".top-name .right").show();
            GetChat_State(current_admin,current_user);
        }else{
            $("#aFriends").text("好友信息");
            $("#group-info").hide();
            $("#user-info").show();
            $(".top-name .right").hide();
        }

        GetInfoById(admin_id,question);
        $(this).find(".sp_noReadCount").remove();
        get_all_num();
        $("#div_name").html($(this).attr("from_name") + " 的好友："+ $(this).find(".t1-1").html());
        // $('#div_name').attr('wxId',$(this).data('wxid'));
        $(this).addClass("active").siblings().removeClass("active");
        $("#txtContent").html("");

        $(".u-center .scroll-box").animate({ scrollTop: parseInt($("#ulList").height()) + parseInt($("#ulList").height()) }, 0);

    })

    //群头像点击
    $("#RoomList_box").on("click","li",function () {
        if($(this).hasClass("checked")){
            $(this).removeClass("checked");
        }else{
            $(this).addClass("checked");
        }
    })

    //发送方式
    $(".send-btn .btn-2").click(function (e) {
        $(".bottom-bar .box-3 .select-list").show();
        e.stopPropagation();
    });
    $(".bottom-bar .box-3 .select-list p").click(function () {
        $(this).find("input").prop("checked", true);
        $(".bottom-bar .box-3 .select-list").hide();
    });

    // 消息回复
    $(document).on("keydown","#txtContent",function (e) {
        var enterKeyValue = $("input[name='chkKey']:checked").val();
        if (e.which == 13 && e.ctrlKey) {
            if (enterKeyValue == 1) {
                try {
                    dopublish();
                } catch(e){
                    $("#txtContent").html("");
                    logError("dopublish_ex", e.message, inMerchID);
                }
            }
        }else if (e.which == 13) {
            if (enterKeyValue == 0) {
                try {
                    dopublish();
                } catch (e) {
                    $("#txtContent").html("");
                }
            }
        }
        event.stopPropagation();
    });
    $(".msg_send").on("click",function () {
        dopublish();
    })

    //任务完成
    $(".js-status-btn").click(function () {
        if($("#check_list").prop("checked")){
            var arr = [];
            $(".ulLeft li.active").each(function (i,e) {
                arr.push($(e).attr("question_id"));
            })
            if(arr.length == 0){
                ShowConfirm("温馨提示", "请先选择操作问题！", 1);
                return;
            }
            $("#txtCompleteDesc").val("");
            $(".popup-u-chat-01").popup("show");
            $("#btnCompleteUChat").unbind("click").on("click",function () {
                var qq = 0;
                ajax_nw(
                    ajax_head + "/api/employee/complete_question.do",
                    {question_id:arr, remark:$("#txtCompleteDesc").val()},
                    function (data) {
                        $(".popup-u-chat-01").popup("hide");
                        window.location.reload();
                    }
                )
            })
        }else{
            if(question_id == ""){
                ShowConfirm("温馨提示", "请先选择操作问题！", 1);
                return;
            }
            $("#txtCompleteDesc").val("");
            $(".popup-u-chat-01").popup("show");
            $("#btnCompleteUChat").unbind("click").on("click",function () {
                ajax_nw(
                    ajax_head + "/api/employee/complete_question.do",
                    {question_id:question_id, remark:$("#txtCompleteDesc").val()},
                    function (data) {
                        $(".popup-u-chat-01").popup("hide");
                        window.location.reload();

                    }
                )
            })
        }
    });

    $(document).on("click", ".popup-u-chat-01 .list>li", function () {
        var $arrow = $(this).find(".arrow");
        $(".popup-u-chat-01 .arrow").removeClass("active");
        $(".popup-u-chat-01 .child").hide();
        $arrow.addClass("active");
        $arrow.next().show();
    })

    $(document).on("change", "input[name='CompleteType']", function () {
        var type = $(this).val();
        var index = 0;
        $("input[name='child1']").each(function () {
            var parent = $(this).attr("data-parent");
            //if (type == parent) {
            //    if (index == 0) {
            //        $(this).prop("checked", "checked");
            //    }
            //    index++;
            //}
        });
    })

    // 任务转发
    $(".js-tree-btn").click(function () {
        OperatorTypeQuery();
    });

    //退出
    $(".js-win-close").click(function () {
        ajax_nw(
            ajax_head + "/api/employee/loginout.do",
            {},
            function (data) {
                window.location.href = "login.html"
            }
        )
    });

    //右侧历史记录点击
    $("#aHistory").click(function () {
        if(question_id == ""){
            return;
        }
        GetHistoryList(current_admin,current_user)
    });

    $(document).on("click", "#btnSearchHistory", function () {
        GetHistoryList(current_admin,current_user)
    })

    //搜索功能
    $("#btnSearch").on("click",function () {
        if($("#aUChatTab").parent().hasClass("active")){
            RefreshQuestionList();
        }else if($("#aCustomTab").parent().hasClass("active")){
            RecentContactsList();
        }
    })


    //更改客服状态
    $(".u-chat .u-top .dropdown-menu a").click(function () {
        var id = $(this).find("i").attr("data-id");
        change_status(id);
    });

    //最大最小化
    $(".js-win-max").click(function () {
        $(this).find(".icon-3").toggleClass("active");
        $(".u-chat").toggleClass("max");
        if ($(this).attr("title") == "最大化") {
            $(this).attr("title", "还原")
        } else {
            $(this).attr("title", "最大化")
        }
    });

    //发送图片
    $(".slide .js-file").change(function () {
        var $this = $(this);
        var files = $(this)[0].files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            //if (!/image\/\w+/.test(file.type)) {
            //    alert("请确保文件为图像类型");
            //    return false;
            //}
            if (/image\/\w+/.test(file.type)) {
                formData =  new FormData();
                formData.append('image',file);

                var imgUrl = window.URL.createObjectURL(file);
                if (typeof FileReader === 'undefined') {
                    result.innerHTML = "抱歉，你的浏览器不支持 FileReader";
                    input.setAttribute('disabled', 'disabled');
                } else {
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        $("#txtContent").append('<img src="' + this.result + '">');
                    }
                }
            }
        }
        $($this).val("");
    });

    //语音消息
    $(document).on("click", ".audio", function (){
        var audio = $(this).find("audio")[0];
        var audio_box = $(this);
        if(audio_box.hasClass("play")){
            audio_box.removeClass("play");
            audio.pause();
        }else{
            audio_box.addClass("play");
            audio.play();
        }
        audio.addEventListener('ended', function (){
            audio_box.removeClass("play");
        }, false);
    })

    //提示
    $("[data-note]").hover(function () {
        $(this).append('<div class="data-note">' + $(this).attr("data-note") + '</div>')
    }, function () {
        $(this).find(".data-note").remove();
    });

    //表情
    $('.js-face-btn').qqFace({
        assign: 'txtContent',
        appendbox: '.bottom-bar'
    });

    //回复文字表情
    $('.js-face-btn-2').qqFace({
        appendbox: '.popup-reply-txt .text-box',
        assign: 'textbox-2'
    });

    //获取好友信息
    $("#aFriends").click(function () {
        if($(this).text() == "群信息"){
            $(".js-remark-inp").addClass("hidden");
            $("#divChatRoomName").removeClass("hidden");
            $(".js-remark-btn").removeClass("hidden");

            $("#RoomList").html("");
            GetRoomInfo();
            GetAiList();
        }else{
            GetFriends(contact_id);
        }
    })

    //快捷回复
    $("#kjhf").on("click",function () {
        LoadPersonalQuickMsg();
    })
    $(document).on("click","#btnSearchQuick",function () {
        LoadPersonalQuickMsg();
    })

    //新增快捷回复语
    $(document).on("click", ".add-new-reply", function () {
        $("#textbox-2").html('');
        $(".popup-reply-txt").popup("show");
        $(".popup-reply-txt .text-box").focus();
        $("#btnOpQuick").attr("type","new");
    });
    $(document).on("click", "#btnOpQuick", function () {
        var type = $(this).attr("type")
        UChatOperatorQuickMsg_Insert(type);
    });

    //字数限制
    $(".popup-reply-txt .text-box .inp").on("input paste", function () {
        $(this).parent().next().find("span").text($(this).attr("maxlength") - $(this).text().length);
    });

    //快捷回复切换
    $(document).on("click",".u-right .part-2 .panel-heading",function () {
        $(this).toggleClass("active");
        $(this).next().toggleClass("in");
    });

    //判断重叠
    function isOverlapping(el1, el2) {
        var rect1 = el1.getBoundingClientRect();
        var rect2 = el2.getBoundingClientRect();
        if (rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom) {
            return false;
        } else {
            return true;
        }
    }

    document.getElementById("tab-2").oncontextmenu = function(e){
        return false;
    }

    //快捷回复左键
    $(document).on("dblclick",".u-right .part-2 .reply-list>li",function () {
        var el1 = this;
        $(".u-center .bottom-bar .box-2 .inp").text($(el1).attr("title")).css("opacity","0");
        var data = {};
        data.img_url = $(el1).attr("data-content");
        data.voice_mp3 = $(el1).attr("data-content");
        data.voice_slik = $(el1).attr("data-href");
        data.desc = $(el1).attr("data-desc");
        if($(el1).attr('data-msgtype') == "voice"){
            dopublish(data,"voice");
        }else if($(el1).attr('data-msgtype') == "image"){
            dopublish(data,"image");
        }else if($(el1).attr('data-msgtype') == "link"){
            data = {
                title: $(el1).attr("data-title"),
                desc: $(el1).attr("data-desc"),
                url: $(el1).attr("title"),
                image: $(el1).attr("data-href")
            };
            dopublish(data,"link");
        }else{
            dopublish(data);
        }
        $(this).off("click");
    })

    //快捷回复右键
    $(document).on("click", function () {
        $(".contextmenu-2").hide();
        $(".contextmenu-3").hide();
        $(".contextmenu-4").hide();
        $(".contextmenu-5").hide();
        $(".contextmenu-6").hide();
        $(".contextmenu-7").hide();
    });
    $(document).on("contextmenu", ".u-right .part-2 .reply-list>li", function (ev) {
        if (ev.button == 2) {
            var x = ev.clientX;
            var y = ev.clientY;
            $(".contextmenu-2").show().css({
                left: x + "px",
                top: y + "px"
            });
            if($("#aPersonalQuickMsg").attr("aria-expanded") == "false"){
                $(".contextmenu-2 .btn-3,.contextmenu-2 .btn-4").addClass("hidden");
            }else{
                $(".contextmenu-2 .btn-3,.contextmenu-2 .btn-4").removeClass("hidden");
            }

            if($(this).attr("data-msgtype") == "link"){
                $(".contextmenu-2 .btn-2,.contextmenu-2 .btn-3").addClass("hidden");
            }else{
                $(".contextmenu-2 .btn-2,.contextmenu-2 .btn-3").removeClass("hidden");
            }

            var yy = $(this);
            rTagsId = $(this).attr("data-id");
            $(".reply-list").each(function () {
                $(this).find("li").each(function () {
                    var el1 = $(this)[0],
                        el2 = $(".contextmenu-2 .point")[0];
                    if (isOverlapping(el1, el2)) {
                        $(".contextmenu-2 .btn-2").unbind("click").on("click",function () {
                            $(".u-center .bottom-bar .box-2 .inp").text($(el1).attr("title"));
                            $(this).off("click");
                        });
                        $(".contextmenu-2 .btn-1").unbind("click").on("click",function () {
                            if($(el1).attr("data-msgtype") == "link") {
                                var data = {
                                    title: $(el1).attr("data-title"),
                                    desc: $(el1).attr("data-desc"),
                                    url: $(el1).attr("title"),
                                    image: $(el1).attr("data-href")
                                };
                                dopublish(data, "link");
                            }else{
                                $(".u-center .bottom-bar .box-2 .inp").text($(el1).attr("title")).css("opacity","0");
                                var data = {};
                                data.img_url = $(el1).attr("data-content");
                                data.voice_mp3 = $(el1).attr("data-content");
                                data.voice_slik = $(el1).attr("data-href");
                                data.desc = $(el1).attr("data-desc");

                                if($(el1).attr('data-msgtype') == "voice"){
                                    dopublish(data,"voice");
                                }else if($(el1).attr('data-msgtype') == "image"){
                                    dopublish(data,"image");
                                }else{
                                    dopublish(data);
                                }
                                dopublish(data);
                            }
                            $(this).off("click");
                        });

                        $(".contextmenu-2 .btn-3").unbind("click").on("click",function () {
                            inTagsId = $(el1).attr("data-id");
                            $(".popup-reply-txt").popup("show");
                            var editTitle = ReplaceImg($(el1).attr("title"));
                            $("#textbox-2").html(editTitle);
                            $(".popup-reply-txt .text-box").focus();
                            $("#btnOpQuick").attr("type","old");
                            $("#btnOpQuick").attr("data_id",rTagsId);
                        });

                        $(".contextmenu-2 .btn-4").unbind("click").on("click",function () {
                            inTagsId = $(el1).attr("data-id");
                            delQuickMsg(inTagsId);
                        });
                    }
                })
            })
        }
    });

    //语音快捷右键
    $(document).on("contextmenu", "#conversation .audio", function (ev) {
        var Url2= $(this).find("audio").attr("src");
        Url2 = Url2.slice(0,Url2.lastIndexOf(".")) + ".silk";
        if (ev.button == 2) {
            var x = ev.clientX;
            var y = ev.clientY;
            $(".contextmenu-5").show().css({
                left: x + "px",
                top: y + "px"
            });
            $(".contextmenu-5 .btn-1").unbind("click").on("click",function () {

                var oInput = document.createElement('input');
                oInput.value = Url2;
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.className = 'oInput';
                oInput.style.display='none';
                alert('复制成功');
            })
        }
    });

    $(document).on("click","#love",function () {
        loveList(0);
        love_tt_list();
    })

    //特别关心列表
    function loveList(id) {
        ajax_nw(
            ajax_head+"/api/employee/employee_collect_list.do",
            {
                employee_token:sessionStorage.getItem("key"),
                employee_collect_group_id:id
            },
            function (res) {
                if(res.code == 200){
                    var html = template("wait_reply_tem",{"data":{"list":res.data.list,"user":current_user}});
                    $("#ulLove").html(html);
                }else{
                    ShowConfirm("温馨提示", res.msg);
                }
            }
        )
    }


    //特别关心右键
    $(document).on("contextmenu", "#ulLeft>li", function (ev) {
        var Cid= $(this).attr("contact_id");
        if (ev.button == 2) {
            var x = ev.clientX;
            var y = ev.clientY;
            $(".contextmenu-6").show().css({
                left: x + "px",
                top: y + "px"
            });

            $(".contextmenu-6 .btn-1").unbind("click").on("click",function () {
                ajax_nw(
                    ajax_head+"/api/employee/employee_collect_add.do",
                    {
                        employee_token:sessionStorage.getItem("key"),
                        contact_id:Cid,
                        employee_collect_group_id:0
                    },
                    function (res) {
                        if(res.code == 200){
                            loveList(0);
                        }else{
                            ShowConfirm("温馨提示", res.msg);
                        }
                    }
                )
            })

        }
        return false;
    });

    //取消特别关心右键
    $(document).on("contextmenu", "#ulLove>li", function (ev) {
        var Cid= $(this).attr("data-employee_collect_id");
        var cont_id = $(this).attr("contact_id");
        if (ev.button == 2) {
            var x = ev.clientX;
            var y = ev.clientY;
            $(".contextmenu-7").show().css({
                left: x + "px",
                top: y + "px"
            });
            $(".contextmenu-7 .btn-1").unbind("click").on("click",function () {
                ajax_nw(
                    ajax_head+"/api/employee/employee_collect_delete.do",
                    {
                        employee_token:sessionStorage.getItem("key"),
                        id:Cid
                    },
                    function (res) {
                        if(res.code == 200){
                            loveList(0);
                        }else{
                            ShowConfirm("温馨提示", res.msg);
                        }
                    }
                )
            })

            $(".contextmenu-7 .btn-2").unbind("click").on("click",function () {
                var id = $(this).attr("data-id");
                ajax_nw(
                    ajax_head+"/api/employee/employee_collect_edit.do",
                    {
                        employee_token:sessionStorage.getItem("key"),
                        employee_collect_group_id:id,
                        contact_id:cont_id,
                        id:Cid,
                        remark:""
                    },
                    function (res) {
                        if(res.code == 200){
                            loveList(0);
                        }else{
                            ShowConfirm("温馨提示", res.msg);
                        }
                    }
                )
            })

            $(".contextmenu-7 .btn-3").unbind("click").on("click",function () {
                var id = $(this).attr("data-id");
                $(".popup-love-remake").popup("show");


                $("#btn_love").unbind("click").on("click",function () {
                    console.log(1);
                    if($("#love_remake").val() == ""){
                        ShowConfirm("温馨提示", "请输入备注名！");
                        return false;
                    }
                    ajax_nw(
                        ajax_head+"/api/employee/employee_collect_edit.do",
                        {
                            employee_token:sessionStorage.getItem("key"),
                            employee_collect_group_id:id,
                            contact_id:cont_id,
                            id:Cid,
                            remark:$("#love_remake").val()
                        },
                        function (res) {
                            $(".popup-love-remake").popup("hide");
                            if(res.code == 200){
                                loveList(0);
                            }else{
                                ShowConfirm("温馨提示", res.msg);
                            }
                        }
                    )
                })


            })
        }
        return false;
    });

    // 分组选择
    $(document).on("click","#love_tt_list .love_group_li",function () {
        var id = $(this).attr("data-id");
        loveList(id);
    })

    //新增分组
    $(document).on("click",".add-love-group",function () {
        $(".popup-love-group").popup("show");
    })

    var tt_btn = true;
    $("#btnTtClick").on("click",function () {
        if($("#tt_love_name").val() == ""){
            ShowConfirm("温馨提示", "请输入分组名！");
            return false;
        }
        if(tt_btn){
            tt_btn =false;
            ajax_nw(
                ajax_head+"/api/employee/employee_collect_group_add.do",
                {
                    employee_token:sessionStorage.getItem("key"),
                    name:$("#tt_love_name").val()
                },
                function (res) {
                    tt_btn = true;
                    $(".popup-love-group").popup("hide");
                    if(res.code == 200){
                        love_tt_list();

                    }else{
                        ShowConfirm("温馨提示", res.msg);
                    }
                }
            )
        }

    })

    //特别关心分组列表
    function love_tt_list() {
        ajax_nw(
            ajax_head+"/api/employee/employee_collect_group_list.do",
            {
                employee_token:sessionStorage.getItem("key"),
            },
            function (res) {
                if(res.code == 200){
                    var html = "<div class=\"love_group_li\"  data-id='0'   >未分组</div>";
                    $(res.data.list).each(function (i,e) {
                        html += '<div class="love_group_li" data-id="'+e.id+'">'+e.name+' <span class="TT_close">X</span></div>'
                    })
                    $("#love_tt_list").html(html);

                    var html2 = "";
                    $(res.data.list).each(function (i,e) {
                        html2 += '    <a href="javascript:void(0)" data-id="'+e.id+'" class="btn-2">添加到 '+e.name+'</a>'
                    })
                    $(".contextmenu-7").html('    <i class="point"></i><a href="javascript:void(0)" class="btn-3">备注</a> <a href="javascript:void(0)" class="btn-1">取消特别关注</a>')
                    $(".contextmenu-7>.point").after(html2);

                }else{
                    ShowConfirm("温馨提示", res.msg);
                }
            }
        )
    }



    //特别关心分组删除
    $(document).on("click",".love_group_li .TT_close",function () {
        var id = $(this).parent().attr("data-id");
        ShowConfirm("温馨提示", "请问是否确认删除该类分组！",function () {
            ajax_nw(
                ajax_head+"/api/employee/employee_collect_group_delete.do",
                {
                    employee_token:sessionStorage.getItem("key"),
                    id:id
                },function (res) {
                    if(res.code == 200){
                        love_tt_list();
                        loveList(0);
                    }else{
                        ShowConfirm("温馨提示", res.msg);
                    }
                }
            )
        });
    })

    //打标签
    $('.select-tag').popover({
        container: ".select-tag-wrap",
        title: "打标签",
        html: true,
        trigger: "click",
        placement: "left",
        template: '<div class="popover" role="tooltip">' +
        '<div class="arrow"></div>' +
        '<h3 class="popover-title"></h3>' +
        '<div class="popover-content"></div>' +
        '<div class="popover-footer"><button class="btn btn-xs btn-primary" id=\"btnTagOk\">确定</button><button class="btn btn-xs btn-default">取消</button></div>' +
        '</div>',
        //content: $(".add-tag-data").html()
    });

    //新建标签
    $(document).on("click", ".js-add-tag", function () {
        $(".popover .add-tag-box .form-control").val("");
        $(".js-add-tag").hide();
        $(".add-tag-box").show();
    });
    $(document).on("click", ".popover .add-tag-box .btn", function () {
        $(".js-add-tag").show();
        $(".add-tag-box").hide();
    });

    //新建标签
    $(document).on("click",".popover .add-tag-box .js-tag-confirm",function () {
        var name = $(this).prev().val();
        if(name == ""){
            ShowConfirm("温馨提示", "请先填写标题名称！");
            return false ;
        }
        ajax_nw(
            ajax_head+"/api/employee/tag_add.do",
            {
                employee_token:sessionStorage.getItem("key"),
                name:name
            },
            function (res) {
                if(res.code == 200){
                    GetAllTag();
                }else{
                    ShowConfirm("温馨提示", res.msg);
                }
            }
        )
    })

    //设置标签
    $(document).on("click", ".user-tags .popover-footer .btn-primary", function () {
        SetTags();
    });

    //聊天记录历史下拉加载
    $("#tab-3 .conversation").scroll(function () {
        var scrollHight = $(this)[0].scrollHeight;
        var scrollTop = $(this)[0].scrollTop;
        var divHight = $(this).height();
        if (scrollTop + divHight >= scrollHight - 5) {
            getNewList(current_admin,current_user);
        }
    });

    // ------------------  群功能模块  ----------------------------
    // 一键全选
    $("#check_all").click(function () {
        if($("#RoomList").find(".checked").length == 0){
            $("#RoomList li").addClass("checked");
        }else{
            $("#RoomList li").removeClass("checked");
        }
    })
    //退出该群
    $("#OutRoom").click(function () {
        ShowConfirm("温馨提示", "是够确认离开该群？", function () {
            out_room();
        });
    })
    //删除群好友
    $("#del_room").click(function () {
        var arr = [];
        $("#RoomList .checked").each(function (i,e) {
            arr.push($(e).attr("username"));
        })
        if(arr.length == 0){
            ShowConfirm("温馨提示", "请先选择要删除的群好友",1);
            return;
        }
        function a(e) {
            ajax_nw(
                ajax_head+"/api/employee/delete_chat_room_member.do",
                {
                    account_username:current_admin,
                    chatroom:current_user,
                    user:e
                },
                function (ds) {
                    GetRoomInfo();
                }
            )
        }

        $(arr).each(function (i,e) {
            a(e)
        })
    })
    //邀请好友
    $("#add_room").click(function () {
        layui.use("layer",function () {
           var layer = layui.layer;
            var add_qun = layer.open({
                type: 1,
                title:false,
                area:['550px','500px'],
                content: $('#qunliao_add'),
                closeBtn:0,
                success:function () {
                    ajax_nw(
                        ajax_head+"/api/employee/contact_list.do",
                        {
                            account_username:current_admin,
                            keyword:""
                        },
                        function (ds) {
                            console.log(ds);
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
                                    $("#create_qun .add_right .check_box ul li[username = '"+$(this).attr("username")+"']").append("<span><img src='../img/add_del.png' alt=''></span>")
                                }



                                //3.0 删除当前
                                $("#qunliao_add .add_right .check_box li span").unbind("click").click(function () {
                                    $(this).parent().remove();
                                    $("#qunliao_add .lxr_box li[username = '"+$(this).parent().attr("username")+"']").removeClass("checked");
                                })

                                // 确定添加
                                var add_switch = true;
                                $("#qunliao_add .qun_btn .add_true").unbind("click").click(function () {

                                    var list = [];
                                    $("#qunliao_add .add_right .check_box li").each(function (i,e) {
                                        list.push($(e).attr("username"));
                                    })
                                    if(list.length == 0){
                                        ShowConfirm("温馨提示", "请先选择要邀请的好友！",1);
                                        return;
                                    }else{
                                        if(add_switch){
                                            $(list).each(function (i,e) {
                                                aaa(e);
                                            })
                                            function aaa(b) {
                                                ajax_nw(
                                                    ajax_head+"/api/employee/invite_chat_room_member.do",
                                                    {
                                                        account_username:current_admin,
                                                        chatroom:current_user,
                                                        user:b
                                                    },
                                                    function (ds) {
                                                        add_switch = false;
                                                        layer.close(add_qun);
                                                    }
                                                )
                                            }
                                        }
                                    }

                                })

                            })
                        }
                    )

                    //关闭
                    $("#qunliao_add .qun_btn .qun_close").unbind("click").click(function () {
                        layer.close(add_qun);
                    })
                }
            })
        })

    })

    //转账消息
    var transfer_b = true;
    $("#ulList").on("click",".transfer",function () {
        var that = this;
        var msg_id = $(this).parents("li").attr("data_id");
        if(transfer_b){
            transfer_b = false;
            $.ajax({
                url:ajax_head+"/api/employee/transfer_query.do",
                type:"post",
                data:{
                    employee_token:sessionStorage.getItem("key"),
                    account_username:current_admin,
                    id:msg_id
                },
                success:function (data) {
                    if(data.code == 200){
                        data = JSON.parse(data.data.external);
                        layui.use("layer",function () {
                            var layer = layui.layer;
                            if(data.trans_status == 2000){
                                //未接受
                                var zz_page1 = layer.open({
                                    type: 1,
                                    title:false,
                                    area:['270px','480px'],
                                    content: $('#zhuanzhang_1'),
                                    success:function () {
                                        transfer_b = true;
                                        if(current_admin == data.payer_name){
                                            //我发出去的
                                            $("#zhuanzhang_1 .btn").hide();
                                            $("#zhuanzhang_1>p").text("1天内朋友未确认，将退还给你。")
                                        }
                                        $("#zhuanzhang_1 .price").text("￥"+data.fee/100);
                                        $("#zhuanzhang_1 .time").text("转账时间："+$.myTime.UnixToDate(data.pay_time,true));

                                        $("#zhuanzhang_1 .btn button").unbind("click").click(function () {
                                            $.ajax({
                                                url:ajax_head+"/api/employee/transfer_operation.do",
                                                type:"post",
                                                data:{
                                                    employee_token:sessionStorage.getItem("key"),
                                                    account_username:current_admin,
                                                    id:msg_id
                                                },
                                                success:function (data) {
                                                    if(data.code == 200){
                                                        layer.closeAll();
                                                        $(that).trigger("click");
                                                    }
                                                }
                                            })
                                        })
                                    }
                                })
                            }else if(data.trans_status == 2001){
                                //已接受
                                var zz_page2 = layer.open({
                                    type: 1,
                                    title:false,
                                    area:['270px','480px'],
                                    content: $('#zhuanzhang_2'),
                                    success:function () {
                                        transfer_b = true;
                                        $("#zhuanzhang_2 .price").text("￥"+data.fee/100);
                                        $("#zhuanzhang_2 .begin_time").text("转账时间："+$.myTime.UnixToDate(data.pay_time,true));
                                        $("#zhuanzhang_2 .end_time").text("收钱时间："+$.myTime.UnixToDate(data.modify_time,true))
                                    }
                                })
                            }
                        })
                    }else{
                        transfer_b = true;
                        ShowConfirm("提示",data.msg);
                    }
                },
                error:function (ex) {
                    alert(ex);
                }
            })
        }
    })

    //红包消息
    $("#ulList").on("click",".red_packet",function () {
        var that = this;
        var msg_id = $(this).parents("li").attr("data_id");
        var data_url = $(this).attr("data_head");//头像
        var data_user = $(this).attr("data_user");//用户名
        var data_nick = $(this).attr("data_nick");//昵称
        var data_text = $(this).find(".text").text();//内容
        ajax_nw(
            ajax_head+"/api/employee/receive_red_packet.do",
            {
                account_username: current_admin,
                id:msg_id,
            },
            function (data) {
                layui.use("layer",function () {
                    var layer = layui.layer;
                    if (data.code == 200) {
                        var key = data.data.key;
                        if(data.data.external == null){
                            layer.msg("请在手机上查看！");
                        }else{
                            $("#hongbao_kai").removeClass("over").text("開");
                            var data1 = JSON.parse(data.data.external);
                            if(data1.hbType == 0){
                                // 单人红包
                                if(data1.isSender == 0){
                                    //我接受的
                                    if(data1.receiveStatus == 0){
                                        //未抢
                                        var hongbao1 = layer.open({
                                            type: 1,
                                            title: false,
                                            area: ['300px', '450px'],
                                            content: $('#hongbao1'),
                                            success: function () {
                                                $("#hongbao1 .header img").attr("src", data_url);
                                                $("#hongbao1 .name").text(data_nick);
                                                $("#hongbao1 .neirong").text(data1.wishing);
                                                $("#hongbao1 #hongbao_kai").unbind("click").click(function () {
                                                    ajax_nw(
                                                        ajax_head+"/api/employee/open_red_packet.do",
                                                        {
                                                            account_username:current_admin,
                                                            id:msg_id,
                                                            key:key
                                                        },
                                                        function (data) {
                                                            if (data.code == 200) {
                                                                layer.close(hongbao1);
                                                                layer.open({
                                                                    type: 1,
                                                                    title: false,
                                                                    closeBtn: 0,
                                                                    area: ['300px', '450px'],
                                                                    content: $('#hongbao2'),
                                                                    success: function () {
                                                                        $("#hongbao2 .xiangqing ul").html("");
                                                                        $("#hongbao2>.header_img>img").attr("src",data_url);
                                                                        $("#hongbao2 .name").text(data_nick);
                                                                        $("#hongbao2 .neirong").text(data_text);
                                                                        //返回键
                                                                        $("#hongbao2 .go_back").unbind("click").click(function () {
                                                                            layer.closeAll();
                                                                        })
                                                                        ajax_nw(
                                                                            ajax_head+"/api/employee/query_red_packet.do",
                                                                            {
                                                                                account_username:current_admin,
                                                                                id:msg_id,
                                                                                index:0
                                                                            },
                                                                            function (data2) {
                                                                                if (data2.code == 200) {
                                                                                    data2 = JSON.parse(data2.data.external);
                                                                                    console.log(data2);
                                                                                    $("#hongbao2 .money .price").text(data2.amount / 100);
                                                                                    $("#hongbao2 .money .blue_font").text(data2.changeWording);
                                                                                    $("#hongbao2 .xiangqing").text("").css("backgound", "#f3f3f3");

                                                                                   /* if (data2.record.length == 1) {
                                                                                        //单人红包
                                                                                    } else {
                                                                                        //群红包
                                                                                        var red_arr = [];
                                                                                        var info = [];
                                                                                        $(data2.record).each(function (i, e) {
                                                                                            var a = {
                                                                                                money:e.receiveAmount,
                                                                                                time:$.myTime.UnixToDate(e.receiveTime, true),
                                                                                                name:e.userName,
                                                                                                game:e.gameTips==null?e.gameTips = "":e.gameTips
                                                                                            }
                                                                                            info.push(a);
                                                                                            red_arr.push(e.userName);
                                                                                        })
                                                                                        $.ajax({
                                                                                            url:ajax_head+"/api/employee/get_contact.do",
                                                                                            type:"post",
                                                                                            data:{
                                                                                                employee_token:sessionStorage.getItem("key"),
                                                                                                account_username:current_admin,
                                                                                                user:JSON.stringify(red_arr)
                                                                                            },
                                                                                            success:function (res) {
                                                                                                if (res.code == 200) {
                                                                                                    console.log(res);
                                                                                                    console.log(res.data.data);
                                                                                                    if(res.data.data != undefined){
                                                                                                        data = res.data.data;
                                                                                                        for(var i = 0 ; i<data.length;i++){
                                                                                                            info[i].content = data[i];
                                                                                                        }
                                                                                                    }else{
                                                                                                        info[0].content = res.data;
                                                                                                    }
                                                                                                    console.log(info);
                                                                                                    var html = template("hongbao_list",{"data":info});
                                                                                                    $("#hongbao2 .xiangqing ul").html(html);
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    }*/
                                                                                }
                                                                            }
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    )
                                                })
                                            }
                                        })
                                    }else{
                                        //抢了
                                        layer.open({
                                            type: 1,
                                            title: false,
                                            closeBtn: 0,
                                            area: ['300px', '570px'],
                                            content: $('#hongbao2'),
                                            success: function () {
                                                $("#hongbao2 .xiangqing ul").html("");
                                                $("#hongbao2>.header_img>img").attr("src", data_url);
                                                $("#hongbao2 .name").text(data_nick);
                                                $("#hongbao2 .neirong").text(data_text);


                                                //返回键
                                                $("#hongbao2 .go_back").unbind("click").click(function () {
                                                    layer.closeAll();
                                                })


                                                ajax_nw(
                                                    ajax_head+"/api/employee/query_red_packet.do",
                                                    {
                                                        account_username:current_admin,
                                                        id:msg_id,
                                                        index:0
                                                    },
                                                    function (data2) {
                                                        if (data2.code == 200) {
                                                            data2 = JSON.parse(data2.data.external);

                                                            $("#hongbao2 .money .price").text(data2.amount / 100);
                                                            $("#hongbao2 .money .blue_font").text(data2.changeWording);
                                                            if (data2.amount != 0) {
                                                                $("#hongbao2 .money").show();
                                                                $("#hongbao2 .xiangqing").css("margin-top", "10px");
                                                            } else {
                                                                $("#hongbao2 .money").hide();
                                                                $("#hongbao2 .xiangqing").css("margin-top", "78px");
                                                            }
                                                            $("#hongbao2 .xiangqing").hide();

                                                        }
                                                    }
                                                )
                                            }
                                        })
                                    }
                                }else{
                                    //我发出去的
                                    layer.open({
                                        type: 1,
                                        title: false,
                                        closeBtn: 0,
                                        area: ['300px', '570px'],
                                        content: $('#hongbao2'),
                                        success: function () {
                                            $("#hongbao2 .xiangqing ul").html("");
                                            $("#hongbao2>.header_img>img").attr("src", data_url);
                                            $("#hongbao2 .name").text(data_nick);
                                            $("#hongbao2 .neirong").text(data_text);
                                            $("#hongbao2 .money").hide();
                                            //返回键
                                            $("#hongbao2 .go_back").unbind("click").click(function () {
                                                layer.closeAll();
                                            })
                                            ajax_nw(
                                                ajax_head+"/api/employee/query_red_packet.do",
                                                {
                                                    account_username:current_admin,
                                                    id:msg_id,
                                                    index:0
                                                },
                                                function (data2) {
                                                    if (data2.code == 200) {
                                                        data2 = JSON.parse(data2.data.external);
                                                        console.log(data2);
                                                        $("#hongbao2 .money").hide();
                                                        $("#hongbao2 .xiangqing").css("margin-top", "78px");
                                                        $("#hongbao2 .xiangqing").show();
                                                        $("#hongbao2 .xiangqing").css("opacity", 1);
                                                        $("#hongbao2 .xiangqing h3").text(data2.headTitle);
                                                        if(data2.hbStatus == 4){
                                                            var red_arr = [];
                                                            var info = [];
                                                            $(data2.record).each(function (i, e) {
                                                                var a = {
                                                                    money:e.receiveAmount,
                                                                    time:$.myTime.UnixToDate(e.receiveTime, true),
                                                                    name:e.userName,
                                                                    game:e.gameTips==null?e.gameTips = "":e.gameTips
                                                                }
                                                                info.push(a);
                                                                red_arr.push(e.userName);
                                                            })
                                                            $.ajax({
                                                                url:ajax_head+"/api/employee/get_contact.do",
                                                                type:"post",
                                                                data:{
                                                                    employee_token:sessionStorage.getItem("key"),
                                                                    account_username:current_admin,
                                                                    user:JSON.stringify(red_arr)
                                                                },
                                                                success:function (res) {
                                                                    if (res.code == 200) {
                                                                        info[0].content = res.data;
                                                                        var html = template("hongbao_list",{"data":info});
                                                                        $("#hongbao2 .xiangqing ul").html(html);
                                                                        red_packet_list(data2.recAmount,msg_id);
                                                                    }
                                                                }
                                                            })
                                                        }else{
                                                            $("#hongbao2 .xiangqing ul").html("<li class='tishi_tk'>"+data2.operationTail.name+"</li>");
                                                        }
                                                    }
                                                }
                                            )
                                        }
                                    })
                                }
                            }else{
                                $("#hongbao2 .money").css("opacity",1);
                                // 群红包
                                if(data1.receiveStatus == 0){
                                    //未抢
                                    var hongbao1 = layer.open({
                                        type: 1,
                                        title: false,
                                        area: ['300px', '450px'],
                                        content: $('#hongbao1'),
                                        success: function () {
                                            $("#hongbao1 .header img").attr("src", data_url);
                                            $("#hongbao1 .name").text(data_nick);
                                            if(data1.hbStatus != 4){
                                                //未抢完
                                                $("#hongbao1 .neirong").text(data1.wishing);
                                            }else{
                                                //抢完的
                                                $("#hongbao1 .neirong").text(data1.statusMess);
                                                $("#hongbao_kai").addClass("over").text("查看大家的手气 >")
                                                $("#hongbao2 .money").css("opacity",0);
                                            }


                                            $("#hongbao1 #hongbao_kai").unbind("click").click(function () {
                                                ajax_nw(
                                                    ajax_head+"/api/employee/open_red_packet.do",
                                                    {
                                                        account_username:current_admin,
                                                        id:msg_id,
                                                        key:key
                                                    },
                                                    function (data) {
                                                        if (data.code == 200) {
                                                            layer.close(hongbao1);
                                                            layer.open({
                                                                type: 1,
                                                                title: false,
                                                                closeBtn: 0,
                                                                area: ['300px', '570px'],
                                                                content: $('#hongbao2'),
                                                                success: function () {
                                                                    $("#hongbao2 .xiangqing ul").html("");
                                                                    $("#hongbao2>.header_img>img").attr("src",data_url);
                                                                    $("#hongbao2 .name").text(data_nick);
                                                                    $("#hongbao2 .neirong").text(data_text);
                                                                    //返回键
                                                                    $("#hongbao2 .go_back").unbind("click").click(function () {
                                                                        layer.closeAll();
                                                                    })
                                                                    ajax_nw(
                                                                        ajax_head+"/api/employee/query_red_packet.do",
                                                                        {
                                                                            account_username:current_admin,
                                                                            id:msg_id,
                                                                            index:0
                                                                        },
                                                                        function (data2) {
                                                                            if (data2.code == 200) {
                                                                                data2 = JSON.parse(data2.data.external);
                                                                                $("#hongbao2 .xiangqing h3").text(data2.headTitle);
                                                                                $("#hongbao2 .money .price").text(data2.amount / 100);
                                                                                $("#hongbao2 .money .blue_font").text(data2.changeWording);
                                                                                 //群红包
                                                                                var red_arr = [];
                                                                                var info = [];
                                                                                $(data2.record).each(function (i, e) {
                                                                                    var a = {
                                                                                        money:e.receiveAmount,
                                                                                        time:$.myTime.UnixToDate(e.receiveTime, true),
                                                                                        name:e.userName,
                                                                                        game:e.gameTips==null?e.gameTips = "":e.gameTips
                                                                                    }
                                                                                    info.push(a);
                                                                                    red_arr.push(e.userName);
                                                                                })
                                                                                $.ajax({
                                                                                    url:ajax_head+"/api/employee/get_contact.do",
                                                                                    type:"post",
                                                                                    data:{
                                                                                        employee_token:sessionStorage.getItem("key"),
                                                                                        account_username:current_admin,
                                                                                        user:JSON.stringify(red_arr)
                                                                                    },
                                                                                    success:function (res) {
                                                                                        if (res.code == 200) {
                                                                                            if(res.data.data != undefined){
                                                                                                data = res.data.data;
                                                                                                for(var i = 0 ; i<data.length;i++){
                                                                                                    info[i].content = data[i];
                                                                                                }
                                                                                            }else{
                                                                                                info[0].content = res.data;
                                                                                            }
                                                                                            var html = template("hongbao_list",{"data":info});
                                                                                            $("#hongbao2 .xiangqing ul").html(html);
                                                                                            red_packet_list(data2.recAmount,msg_id);
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    }
                                                )
                                            })
                                        }
                                    })
                                }else{
                                    //抢了
                                    layer.open({
                                        type: 1,
                                        title: false,
                                        closeBtn: 0,
                                        area: ['300px', '570px'],
                                        content: $('#hongbao2'),
                                        success: function () {
                                            $("#hongbao2 .xiangqing ul").html("");
                                            $("#hongbao2>.header_img>img").attr("src", data_url);
                                            $("#hongbao2 .name").text(data_nick);
                                            $("#hongbao2 .neirong").text(data_text);


                                            //返回键
                                            $("#hongbao2 .go_back").unbind("click").click(function () {
                                                layer.closeAll();
                                            })


                                            ajax_nw(
                                                ajax_head+"/api/employee/query_red_packet.do",
                                                {
                                                    account_username:current_admin,
                                                    id:msg_id,
                                                    index:0
                                                },
                                                function (data2) {
                                                    if (data2.code == 200) {
                                                        data2 = JSON.parse(data2.data.external);

                                                        $("#hongbao2 .money .price").text(data2.amount / 100);
                                                        $("#hongbao2 .money .blue_font").text(data2.changeWording);
                                                        if (data2.amount != 0) {
                                                            $("#hongbao2 .money").show();
                                                            $("#hongbao2 .xiangqing").css("margin-top", "10px");
                                                        } else {
                                                            $("#hongbao2 .money").hide();
                                                            $("#hongbao2 .xiangqing").css("margin-top", "78px");
                                                        }
                                                        $("#hongbao2 .xiangqing h3").text(data2.headTitle);
                                                         $("#hongbao2 .xiangqing ul").html("");
                                                         $("#hongbao2 .xiangqing").show();
                                                        var red_arr = [];
                                                        var info = [];
                                                        $(data2.record).each(function (i, e) {
                                                            var a = {
                                                                money:e.receiveAmount,
                                                                time:$.myTime.UnixToDate(e.receiveTime, true),
                                                                name:e.userName,
                                                                game:e.gameTips==null?e.gameTips = "":e.gameTips
                                                            }
                                                            info.push(a);
                                                            red_arr.push(e.userName);
                                                        })
                                                        $.ajax({
                                                            url:ajax_head+"/api/employee/get_contact.do",
                                                            type:"post",
                                                            data:{
                                                                employee_token:sessionStorage.getItem("key"),
                                                                account_username:current_admin,
                                                                user:JSON.stringify(red_arr)
                                                            },
                                                            success:function (res) {
                                                                if (res.code == 200) {
                                                                    if(res.data.data != undefined){
                                                                        data = res.data.data;
                                                                        for(var i = 0 ; i<data.length;i++){
                                                                            info[i].content = data[i];
                                                                        }
                                                                    }else{
                                                                        info[0].content = res.data;
                                                                    }
                                                                    var html = template("hongbao_list",{"data":info});
                                                                    $("#hongbao2 .xiangqing ul").html(html);
                                                                    red_packet_list(data2.recAmount,msg_id);
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                            )
                                        }
                                    })
                                }
                            }
                        }
                    }
                })

            })
    })

    //群红包列表分页
    function red_packet_list(index,msg_id) {
        var now_list = $("#hongbao2 .xiangqing li").length;
        if(index>now_list){
            ajax_nw(
                ajax_head+"/api/employee/query_red_packet.do",
                {
                    account_username:current_admin,
                    id:msg_id,
                    index:now_list
                },
                function (data2) {
                    if (data2.code == 200) {
                        data2 = JSON.parse(data2.data.external);
                        $("#hongbao2 .money .price").text(data2.amount / 100);
                        $("#hongbao2 .money .blue_font").text(data2.changeWording);
                        if (data2.amount != 0) {
                            $("#hongbao2 .money").show();
                            $("#hongbao2 .xiangqing").css("margin-top", "10px");
                        } else {
                            $("#hongbao2 .money").hide();
                            $("#hongbao2 .xiangqing").css("margin-top", "78px");
                        }
                        var red_arr = [];
                        var info = [];
                        $(data2.record).each(function (i, e) {
                            var a = {
                                money:e.receiveAmount,
                                time:$.myTime.UnixToDate(e.receiveTime, true),
                                name:e.userName,
                                game:e.gameTips==null?e.gameTips = "":e.gameTips
                            }
                            info.push(a);
                            red_arr.push(e.userName);
                        })
                        $.ajax({
                            url:ajax_head+"/api/employee/get_contact.do",
                            type:"post",
                            data:{
                                employee_token:sessionStorage.getItem("key"),
                                account_username:current_admin,
                                user:JSON.stringify(red_arr)
                            },
                            success:function (res) {
                                if (res.code == 200) {
                                    if(res.data.data != undefined){
                                        data = res.data.data;
                                        for(var i = 0 ; i<data.length;i++){
                                            info[i].content = data[i];
                                        }
                                    }else{
                                        info[0].content = res.data;
                                    }
                                    var html = template("hongbao_list",{"data":info});
                                    $("#hongbao2 .xiangqing ul").append(html);
                                    red_packet_list(data2.recAmount,msg_id);
                                }
                            }
                        })
                    }
                }
            )
        }

    }

    //图片放大
    $("#ulList").on("click",".img",function () {
        var that = this;
        layui.use("layer",function () {
            var layer = layui.layer;
            var json ={
                "title": "", //相册标题
                "id": 123, //相册id
                "start": 0, //初始显示的图片序号，默认0
                "data": [   //相册包含的图片，数组格式
                    {
                        "alt": "图片名",
                        "pid": 666, //图片id
                        "src": $(that).find("img").attr("src")+"?t="+Date.parse(new Date()), //原图地址
                        "thumb": "" //缩略图地址
                    }
                ]
            }
            layer.photos({
                photos: json //格式见API文档手册页
                ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机
                ,shade:0.1//遮罩
            });
        })
    })

    // 视频消息
    $("#ulList").on("click",".video",function () {
        var src = $(this).attr("data_src");
        layui.use("layer",function () {
            var layer = layui.layer;
            layer.open({
                type: 2,
                title: false,
                area: ['600px', '450px'],
                shade: 0.8,
                closeBtn: 0,
                shadeClose: true,
                content: src
            });
        })
    })

    //链接消息
    $("#ulList").on("click",".lianjie_link  ",function () {
        var url = $(this).attr("data_url");
        window.open(url);
    })
    //链接转发
    document.getElementById("ulList").oncontextmenu = function(e){
        return false;
    }
    $("#ulList").on("contextmenu", ".link", function (ev) {
        var that = this;
        if (ev.button == 2) {
            var x = ev.clientX;
            var y = ev.clientY;
            $(".contextmenu-3").show().css({
                left: x + "px",
                top: y + "px"
            });
            var yy = $(this);
            rTagsId = $(this).attr("data-id");
            $(".reply-list").each(function () {
                $(this).find("li").each(function () {
                    var el1 = $(this)[0],
                        el2 = $(".contextmenu-2 .point")[0];
                    if (isOverlapping(el1, el2)) {
                        $(".contextmenu-3 .btn-1").unbind("click").on("click",function () {
                            // 小程序
                            if($(that).hasClass("small_app")){
                                ajax_nw(
                                    ajax_head + "/api/employee/media_applet_add.do",
                                    {
                                        title:$(that).find(".box-1").text(),
                                        content:$(that).attr("data-content").substring($(that).attr("data-content").indexOf("<appmsg"),$(that).attr("data-content").indexOf("</appmsg>")+9).replace("<url>","<url><![CDATA[").replace("</url>","]]></url>")
                                    },
                                    function (res) {
                                        if(res.code == 200){
                                            ShowConfirm("温馨提示","已添加到素材库，请到管理端查看！");
                                        }else{
                                            ShowConfirm("温馨提示",res.msg);
                                        }
                                        $(".popup-reply-txt").popup("hide");
                                        inTagsId = 0;
                                    }
                                )

                            }else {
                                // 链接
                                var data = {
                                    title:$(that).find(".box-1").text(),
                                    desc:$(that).find(".text").text(),
                                    url:$(that).attr("data_url"),
                                    image:$(that).find(".img-box img").attr("src"),
                                    type:"link"
                                };
                                ajax_nw(
                                    ajax_head + "/api/employee/personal_quick_msg_add.do",
                                    {
                                        content:JSON.stringify(data)
                                    },
                                    function (result) {
                                        $(".popup-reply-txt").popup("hide");
                                        LoadPersonalQuickMsg();
                                        inTagsId = 0;
                                    }
                                )
                            }

                            $(this).off("click");
                        });
                    }
                })
            })
        }
    });


    //设置群昵称
    $(".js-remark-btn").on("click",function () {
        $("#divChatRoomName").addClass("hidden");
        $(".js-remark-btn").addClass("hidden");
        $(".js-remark-inp .form-control").val($("#divChatRoomName").text());
        $(".js-remark-inp").removeClass("hidden");
    })

    $("#save_roomName").on("click",function () {
        var name = $("#txtRemark").val();
        $(".js-remark-inp").addClass("hidden");
        $("#divChatRoomName").removeClass("hidden");
        $(".js-remark-btn").removeClass("hidden")
        if(name == $("#divChatRoomName").text()){
            return;
        }
        setRoomName(name);
    })

    //群聊邀请确认
    $(document).on("click",".qunliao_link",function () {
        var url  = $(this).attr("data_url");

        if(url.indexOf("http://support.weixin.qq.com")== -1){
            var sFeatures = "height=600, width=810, scrollbars=yes, resizable=yes";
            window.open(url, sFeatures);
        }else{
            ajax_nw(
                ajax_head+"/api/employee/get_request_token.do",
                {
                    account_username:current_admin,
                    url:url
                },
                function (res) {
                    if(res.code == 200){
                        $.ajax({
                            url:res.data.full_url,
                            type:"post",
                            data:{},
                            done:function (a) {
                                ShowConfirm("温馨提示","您已进入此群聊！");
                            },
                            success:function (res) {
                            },
                            error:function (ex) {
                                ShowConfirm("温馨提示","您已进入此群聊！");
                            }
                        })
                    }

                }
            )
        }
    })

    $("#index_1").on("click",function () {
        RefreshQuestionList();
    })

    //个人名片
    $(document).on('click',".card",function () {
        var v1 = $(this).attr("data_v1");
        var v2 = $(this).attr("data_v2");
        ShowConfirm("温馨提示", "是否添加此微信号？"+"<br><div><input type='text' placeholder='请输入验证消息' style='margin-top: 9px;width: 220px;padding-left: 7px;' id='card_info'></div>", function () {
            var text = $("#card_info").val();
            text == ""?text = "你好！":text;
            ajax_nw(
                ajax_head+"/api/employee/add_user.do",
                {
                    employee_token:sessionStorage.getItem("key"),
                    account_username:current_admin,
                    v1:v1,
                    v2:v2,
                    type:17,
                    verify:text
                },
                function (res) {
                    if(res.code == 200){
                        ShowConfirm("温馨提示","请求已发送！");
                    }else{
                        ShowConfirm("提示",res.msg);
                    }
                }
            )
        });
    })

    //群成员 群场景切换
    $(".qun_chengyuan").click(function () {
        $(".qun_arr_list").show();
        $(".qun_cj_arr").hide();
    })
    $(".qun_changjing").click(function () {
        $(".qun_arr_list").hide();
        $(".qun_cj_arr").show();
    })

    //场景预览
    $(document).on("click", ".group-scene .btn-primary", function () {
        var obj = $(this).parents(".group-scene .dis-tb");
        yl_sceneId = obj.attr("data-id");
        var title = obj.attr("data-title");
        var time = obj.attr("data-time");
        $("#spSceneTitle").html(title);
        $("#spSceneTime").html(time);
        GetSceneContentList(yl_sceneId);
        $(".popup-chat").popup('show')
    });

    //场景开启
    $(document).on("click", ".group-scene .btn-default", function () {
        var obj = $(this).parents(".group-scene .dis-tb");
        kq_sceneId = obj.attr("data-id");
        var title = obj.attr("data-title");
        var time = obj.attr("data-time");

        $("#tdSceneTile").html(title);
        $("#tdSceneTime").html(time);
        // $("#divSceneChatRoomName").html(vcChatRoomName);
        //$(".popup-scene-open").popup('show')
        GetChatRoom_ValidateScene(kq_sceneId);
    });

    //场景开启>账号修改
    $(document).on("click", ".popup-scene-open .js-edit", function () {
        $(this).parent().parent().find(".toggle .name").toggle();
        $(this).parent().parent().find(".toggle select").toggle();
        if ($(this).attr("data-mode") != 1) {
            $(this).attr("data-mode", "1").text("保存");
        } else {
            $(this).parent().parent().find(".toggle .name").text($(this).parent().parent().find(".toggle select option:selected").text())
            $(this).parents("tr").attr("dataid", $(this).parent().parent().find(".toggle select option:selected").val());
            $(this).attr("data-mode", "0").text("修改");
        }
    });
    $(document).on("click", "#btnSceneSave", function () {
        Save(10);
    })
    
    //改变群消息状态
    $("#change_qun_btn").click(function () {
        var text = $(this).text();
        var state;
        text == "是"?state = 1:state = 0;
        ajax_nw(
            ajax_head+"/api/employee/set_chatroom_config.do",
            {
                account_username:current_admin,
                chatroom:current_user,
                recv_msg:state
            },
            function (res) {
                if(res.code == 200){
                    GetChat_State(current_admin,current_user);
                }else{
                    ShowConfirm("温馨提示", res.msg);
                }
            }
        )
    })
    
    // 接受请求
    $(document).on("click",".receive_btn",function () {
        var stranger = $(this).attr("stranger");
        var ticket = $(this).attr("ticket");
        ajax_nw(
            ajax_head+"/api/employee/accept_user.do",
            {
                account_username:current_admin,
                stranger:stranger,
                ticket:ticket
            },
            function (res) {
                if(res.code == 200){
                    ShowConfirm("提示","已发送");
                }else{
                    ShowConfirm("提示",res.msg);
                }
            }
        )
    })

    //选择机器人配置
    $("#robot_list").change(function () {
        var id = $(this).val();
        ajax_nw(
            ajax_head+"/api/employee/chatroom_set_robot_config_id.do",
            {
                account_username:current_admin,
                chatroom:current_user,
                robot_config_id:id
            },
            function (res) {
                if(res.code == 200){

                }else{
                    ShowConfirm("温馨提示", res.msg);
                }
            }
        )
    })

    // 机器人是否启用
    $("#robot_btn").click(function () {
        var index;
        if($(this).text() == "开启"){
            index = 0;
            $(this).text("关闭").removeClass("green");
        }else{
            index = 1 ;
            $(this).text("开启").addClass("green");
        }

        ajax_nw(
            ajax_head+"/api/employee/chatroom_set_is_robot_enable.do",
            {
                account_username:current_admin,
                chatroom:current_user,
                is_robot_enable:index
            },
            function (res) {
                if(res.code == 200){

                }else{
                    ShowConfirm("温馨提示", res.msg);
                }
            }
        )
    })

    //右键撤回信息
    $("#ulList").on("contextmenu","li .main",function (ev) {
        if(ev.button == 2){
            var that = $(this).parent().parent();
            var msgid = $(that).attr("data_msgid");
            var nowDate = Date.parse(new Date())/1000;
            var oldDate = $(that).attr("data_time");

           if(Math.abs(nowDate - oldDate) - 180 <= 0 ){
                if($(that).hasClass("self")){
                    var x = ev.clientX;
                    var y = ev.clientY;
                    $(".contextmenu-4").show().css({
                        left: x + "px",
                        top: y + "px"
                    });
                    $(".contextmenu-4 .btn-1").unbind("click").on("click",function () {
                        ajax_nw(
                            ajax_head+"/api/employee/revoke_message.do",
                            {
                                account_username:current_admin,
                                msg_id:msgid,
                                user:current_user
                            },
                            function (res) {
                                if(res.code == 200){
                                    $(that).remove();
                                }
                            }
                        )
                    })
                }
           }
        }
    })

    //查看群二维码
    $(".change_btn .erweima").click(function () {
        erweima();
    })

    // ------------------------------------------ 事件封装 -----------------------------------------------------------
    // 聊天记录表情转换
    function qqface_change(content) {
        var sb = "";
        var words = new Array();
        var isBegin = false;
        for(var i=0;i<content.length;i++){
            var ch = content.charAt(i);
            if(ch=='['){
                if(sb.length>0){
                    words.push(sb);
                    sb = "";
                }
                sb = sb+ch;
                isBegin = true;
            }else if(ch==']'){
                sb = sb+ch;
                if(isBegin){
                    words.push(sb);
                    sb = "";
                    isBegin = false;
                }
            }else{
                sb = sb+ch;
            }
            if(i==content.length-1){
                words.push(sb);
                sb = "";
            }
        }
        for(var i = 0 ; i < words.length ; i++){
            if(words[i].indexOf("[")!= -1){

                words[i] = words[i].substring(1,words[i].length -1);
                if($(".scroll-wrapper .face-tb a[title = '"+words[i]+"']")[0]){
                    words[i] = "<img src='images/qqface/"+words[i]+".png'>";

                }
            }
        }
        content = words.join("");
        return content;
    }

    //获取自身状态
    function get_self_status() {
        ajax_nw(
            ajax_head + "/api/employee/employee_info.do",
            {},
            function (data) {
                    var status = data.data.employee.online_state;
                    switch(status){
                        case "online":
                            $(".dropdown").find(".btn [class*='icon-']").attr("class", "icon-1");
                            break;
                        case "offline":
                            $(".dropdown").find(".btn [class*='icon-']").attr("class", "icon-3");
                            break;
                        case "suspend":
                            $(".dropdown").find(".btn [class*='icon-']").attr("class", "icon-2");
                            break;
                    }
            }
        )
    }

    //计算未读总数
    function get_all_num() {
        var all_num = 0;
        $(".ulLeft .sp_noReadCount").each(function (i,e) {
            all_num += $(e).text()/1;
        })
        if(all_num != 0 ){
            $(".all_sp_noReadCount").show();
            $(".all_sp_noReadCount").text(all_num);
        }else{
            $(".all_sp_noReadCount").hide();
        }
    }

    //待回复列表
    function RefreshQuestionList() {
        ajax_nw(
            ajax_head + "/api/employee/process_question_list.do",
            {keyword:$("#txtSearchKey").val()},
            function (result) {
                $("#i_count").html(result.data.list.length);
                var html = template("wait_reply_tem",{"data":{"list":result.data.list,"user":current_user}});
                $(".ulLeft").html(html);

                get_all_num();



            }
        )
    }

    //最近联系列表
    function RecentContactsList() {
        ajax_nw(
            ajax_head + "/api/employee/completed_question_list.do",
            {keyword:$("#txtSearchKey").val()},
            function (result) {
                var html = template("wait_reply_tem",{"data":result.data});
                $("#ulLeftCustom").html(html);

            }
        )
    }

    //获取中间聊天记录
    function GetInfoById(admin_id,question) {
        ajax_nw(
            ajax_head + "/api/employee/message_list.do",
            {
                currentPage:1,
                pageSize:40,
                account_username:admin_id,
                username:question,
                order_by:"DESC",
                keyword:"",
                question_id:question_id
            },
            function (data) {
                var html = "";
                if(question == "fmessage"){
                    html = template("friends_list",{data:data.data.list});
                    $(".bottom-bar").hide();
                    $("#conversation").css("height","560px");
                }else{
                    data.data.list.reverse();
                    html = template("message_list_tem",{data:data.data});
                    $("#conversation").css("height","390px");
                    $(".bottom-bar").show();
                }
                $("#ulList").html(html);
                $(".u-center .scroll-box").animate({ scrollTop: parseInt($("#ulList").height()) + parseInt($("#ulList").height()) }, 0);
            }
        )
    }

    // 右侧聊天记录
    function GetHistoryList(admin_id,question) {
        ajax_nw(
            ajax_head + "/api/employee/message_list.do",
            {
                currentPage:1,
                pageSize:50,
                account_username:admin_id,
                username:question,
                order_by:"ASC",
                keyword:$("#vcSearchKey").val(),
                question_id:question_id
            },
            function (data) {
                var html = template("message_list_tem",{data:data.data});
                $("#ulHistory").html(html);
            }
        )
    }

    //右侧聊天记录更新
    function getNewList(admin_id,question) {
        var last_id = $("#ulHistory li:last-child").attr("data_id");
        if(last_id == old_id){
            return;
        }
        if(admin_id == "" || question == ""){
            return;
        }
        old_id = last_id;
        ajax_nw(
            ajax_head + "/api/employee/incremental_message_list.do",
            {
                currentPage:1,
                pageSize:50,
                account_username:admin_id,
                username:question,
                order_by:"ASC",
                id:last_id,
                question_id:question_id
            },
            function (data) {
                var html = template("message_list_tem",{data:data.data});
                $("#ulHistory").append(html);
            }
        )
    }

    //聊天记录更新
    function GetInfoNewById(admin_id,question) {
        var last_id = $("#ulList li:last-child").attr("data_id");
        if(admin_id == "" || question == ""){
            return;
        }
        ajax_nw(
            ajax_head + '/api/employee/incremental_message_list.do',
            {
                currentPage:1,
                pageSize:10,
                account_username:admin_id,
                username:question,
                id:last_id,
                question_id:question_id
            },
            function (data) {
                var html = "";
                if(question == "fmessage"){
                    html = template("friends_list",{data:data.data.list});
                }else{
                    html = template("message_list_tem",{data:data.data});
                }
                $("#ulList").append(html);
                $(".u-center .scroll-box").animate({ scrollTop: parseInt($("#ulList").height()) + parseInt($("#ulList").height()) }, 0);
            }
        )
    }

    //消息回复
    var false_message = true;
    function dopublish(data,type) {
        if(!false_message){
            return false;
        }
        false_message = false;

        //链接
        if(type == "link"){
            ajax_nw(
                ajax_head+"/api/employee/send_link.do",
                {
                    account_username:current_admin,
                    username:current_user,
                    title:data.title,
                    des:data.desc,
                    url:data.url,
                    thumburl:data.image
                },
                function (res) {
                    false_message = true;
                    GetInfoNewById(current_admin,current_user);
                }
            )
        }else if(type == "voice"){
            ajax_nw(
                ajax_head+"/api/employee/send_voice_url.do",
                {
                    account_username:current_admin,
                    username:current_user,
                    silk_url:data.voice_slik,
                    mp3_url:data.voice_mp3,
                    voice_time:data.desc
                },
                function (res) {
                    $("#txtContent").html("").css("opacity","1");
                    false_message = true;
                    GetInfoNewById(current_admin,current_user);
                }
            )
        }else if (type == "image"){
            ajax_nw(
                ajax_head+"/api/employee/send_image_url.do",
                {
                    account_username:current_admin,
                    username:current_user,
                    url:data.img_url
                },
                function (res) {
                    false_message = true;
                    $("#txtContent").html("").css("opacity","1");
                    GetInfoNewById(current_admin,current_user);
                }
            )
        }else{
			console.log($("#txtContent").html())
            var src = $("#txtContent").html() + "";
            if (false) {
				console.log(1)
                ShowConfirm("温馨提示", "请输入聊天内容", 1);
                false_message = true;
                return;
            }

            $("#txtContent").find(".imgFace").each(function () {
                var name = $(this).attr("data-name");
                $(this).before("[" + name + "]");
                $(this).remove();
            });

            var topic = yunba_userinfo.topic;
            var content = $.trim($("#txtContent").text());
            if (content.length > 512) {
                ShowConfirm("温馨提示", "输入文字太长，请精简后重试！", 1);
                false_message = true;
                return;
            }
            if(current_admin== "" || current_user== ""){
                ShowConfirm("温馨提示", "请先选择发送对象！", 1);
                false_message = true;
                return;
            }

            //文字
            if(content != ""){
                ajax_nw(
                    ajax_head + "/api/employee/send_message.do",
                    {
                        account_username:current_admin,
                        username:current_user,
                        content:content
                    },
                    function (data) {
                        false_message = true;
                        $("#txtContent").html("").css("opacity","1");
                        GetInfoNewById(current_admin,current_user);
                    }
                )
            }
            //图片
            if(src.indexOf(",") >= 0 && src.indexOf(">") > 0){
                var b_index = src.indexOf(",") + 1;
                var e_index = src.indexOf(">") - 1;
                msgContent = src.substring(b_index, e_index);
                if (msgContent == "") {
                    false_message = true;
                    return;
                }
                var indexImg = 0;
                $("#txtContent").find("img").each(function () {
                    var imgContent = $(this).attr("src");
                    if (imgContent != "") {
                        imgContent = imgContent.replace("data:image/png;base64,","");
                        formData.append("employee_token",sessionStorage.getItem("key"));
                        formData.append("account_username",current_admin);
                        formData.append("username",current_user);

                        $.ajax({
                            url: ajax_head + "/api/employee/send_image.do",
                            type: "post",
                            data: formData,
                            cache: false,
                            processData: false,
                            contentType: false,
                            success: function(data) {
                                false_message = true;
                                if(data.code == 200){
                                    $("#txtContent").html("").css("opacity","1");
                                    GetInfoNewById(current_admin,current_user);
                                }else if(data.code == 1001){
                                    ShowConfirm("温馨提示", "该账号已下线，消息发送失败，请先在后台账号管理上线该账号。", 1);
                                }else{
                                    ShowConfirm("温馨提示", data.msg, 1);
                                }
                            },
                            error: function(e) {
                                alert("网络错误，请重试！！");
                            }
                        });
                    }
                });
            }
        }





    }

    //客服类别
    function OperatorTypeQuery() {


        var vcSearch = $("#txtSearchTrans").val();
        ajax_nw(
            ajax_head + '/api/employee/online_employee_list.do',
            {},
            function (data) {
                if (data.code == 200) {
                    var send_id = 0;

                    if (data.data.list.length == 0) {
                        $(".popup-u-chat-03").popup("hide");
                        ShowConfirm("温馨提示", "当前无其他客服在线，请稍后再试。", 1);
                        return;
                    }
                    else{
                        var data = data.data;
                        var strHtml = "";
                        strHtml += "<li>";
                        strHtml += "<a href=\"javascript:void(0)\" class=\"parent active\">默认类别 (在线 " + data.list.length + " 人) <i class=\"arrow\"></i></a>";
                        strHtml += "<div class=\"child\">";
                        for (var j = 0; j < data.list.length; j++) {
                            var dtItem = data.list[j];
                            strHtml += "<label><input type=\"radio\" value=\"" + dtItem.username + "\" data-id=\"" + dtItem.id + "\" data-admin_id=\"" + dtItem.admin_id + "\"   name=\"Operator\" class=\"p-checkbox\">" + dtItem.username + "</label>";
                        }
                        strHtml += "</div>";
                        strHtml += "</li>";

                        $("#btnCustomer").html(strHtml);
                        $(".popup-u-chat-03").popup("show");


                        //对象选择
                        $("#btnCustomer .child label").unbind("click").click(function () {
                            send_id = $(this).find("input").attr("data-id");
                        })

                        //问题转发
                        $("#btnTrans").unbind("click").on("click",function () {
                            if(send_id == 0){
                                ShowConfirm("温馨提示", "请先选择你要转发的对象。", 1);
                                return;
                            }


                            if($("#check_list").prop("checked")){
                                var arr = [];
                                $(".ulLeft .active").each(function (i,e) {
                                    arr.push($(e).attr("question_id"));
                                })

                                if(arr.length == 0){
                                    ShowConfirm("温馨提示", "请先选择你要转发的问题。", 1);
                                    return;
                                }

                                $(arr).each(function (i,e) {
                                    $.ajax({
                                        url:ajax_head + "/api/employee/transmit_question.do",
                                        type:"post",
                                        data:{
                                            employee_token:sessionStorage.getItem("key"),
                                            question_id:e,
                                            to_employee_id:send_id
                                        },
                                        success:function (data) {
                                            if(data.code == 200){
                                                $(".popup-u-chat-03").popup("hide");
                                                $("#ulList").html("")
                                                RefreshQuestionList();
                                            }
                                        }
                                    })
                                })
                                return;
                            }else{
                                if(question_id == ""){
                                    ShowConfirm("温馨提示", "请先选择你要转发的问题。", 1);
                                    return;
                                }
                                $.ajax({
                                    url:ajax_head + "/api/employee/transmit_question.do",
                                    type:"post",
                                    data:{
                                        employee_token:sessionStorage.getItem("key"),
                                        question_id:question_id,
                                        to_employee_id:send_id
                                    },
                                    success:function (data) {
                                        if(data.code == 200){
                                            $(".popup-u-chat-03").popup("hide");
                                            $("#ulList").html("")
                                            RefreshQuestionList();
                                        }
                                    }
                                })
                            }



                        })
                    }
                }
            }
        )
    }

    // 提示框
    function ShowConfirm(title, text, callback) {
        var str = '';
        str += '<div class="modal fade" tabindex="-1" role="dialog" id="modal-confirm">';
        str += '<div class="modal-dialog modal-sm" role="document">';
        str += '<div class="modal-content">';
        str += '<div class="modal-header">';
        str += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>';
        str += '<h4 class="modal-title">' + title + '</h4>';
        str += '</div>';
        str += '<div class="modal-body text-center">' + text + '</div>';
        str += '<div class="modal-footer">';
        if (typeof callback === "function") {
            str += '<button type="button" class="btn btn-primary confirm"  data-dismiss="modal">确定</button>';
        }
        str += '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>';
        str += '</div>';
        str += '</div>';
        str += '</div>';
        str += '</div>';
        $("body").append(str);
        $("#modal-confirm").modal("show");

        $("#modal-confirm [data-dismiss='modal']").click(function () {
            var $this = $(this);
            setTimeout(function () {
                if ($this.hasClass("confirm")) {
                    callback();
                }
                $("#modal-confirm").remove();
            }, 300);
        });
    }

    //更改客服状态
    function change_status(status) {
        ajax_nw(
            ajax_head + "/api/employee/change_online_status.do",
            {online_status:status},
            function (data) {
                ShowConfirm("温馨提示", "操作成功！", 1);
                switch(status){
                    case "online":
                        $(".dropdown").find(".btn [class*='icon-']").attr("class", "icon-1");
                        break;
                    case "offline":
                        $(".dropdown").find(".btn [class*='icon-']").attr("class","icon-3")
                        break;
                    case "suspend":
                        $(".dropdown").find(".btn [class*='icon-']").attr("class", "icon-2");
                        break;
                }
            }
        )
    }

    //语音播放完成
    function PlayOver() {
        $("#a_" + currentPlayMsgId).removeClass("play");
        $("#a_" + currentPlayMsgId).attr("onclick", "javascript:PlayAudio('" + currentPlayMsgId + "','" + currentPlayUrl + "');");

        currentPlayMsgId = "";
        currentPlayUrl = "";
    }

    //获取好友信息
    function GetFriends(id) {
        if(id == ""){
            return;
        }
        ajax_nw(
            ajax_head + "/api/employee/contact_detail.do",
            {
                contact_id:id
            },
            function (data) {
                var strHtml = "";
                var item = data.data.contact;
                if (item.sex == 1)
                    $("#fansSex").html("男");
                else
                    $("#fansSex").html("女");
                /* var vcCustomerName = ReplaceImg(item.vcNickName);
                    var base64customername = item.vcBase64NickName;
                    if (base64customername != "" && base64customername != undefined && base64customername != "undefined") {
                    vcCustomerName = ReplaceBase64Img(base64customername);
                    }*/
                // $("#div_name").html(item.nick_name);
                $("#fansNikeName").html(item.nick_name);
                $("#RobotWxName").html(item.account_nickname);
                if (item.tags.length > 1) {
                    var tagsDt = item.tags;
                    var strTags = "";
                    for (var i = 0; i < tagsDt.length; i++) {
                        var tagsItem = tagsDt[i];
                        strTags += "<span data-content=\"" + tagsItem.name + "\" id=\"tags_" + tagsItem.id+"\">" + tagsItem.name + "<a href=\"javascript:void (0)\" data-id=\"tag-" + tagsItem.id + "\" data-content=\"" + tagsItem.name + "\">x</a></span>";
                    }
                    $(".user-tags .wrap").html(strTags);
                }

                GetAllTag();
            }
        )
    }

    //获取群信息
    function GetRoomInfo() {
        ajax_nw(
            ajax_head + "/api/employee/contact_detail.do",
            {
                contact_id:contact_id
            },
            function (ds) {
                $("#divChatRoomName").text(ds.data.contact.nick_name);//群昵称
                if(ds.data.contact.chatroom_owner == ds.data.contact.account_username){
                    $("#del_room").removeClass("hide");
                }else{
                    $("#del_room").addClass("hide");
                }
            }
        )

        ajax_nw(
            ajax_head + "/api/employee/get_chat_room_member.do",
            {
                admin_token:sessionStorage.getItem("key"),
                account_username:current_admin,
                chatroom:current_user
            },
            function (data) {
                $(".js-nei-account").text(data.data.count + "人");
                var data2 = data.data.member;
                var html = template("qunliao_list_tem",{"data":data2});
                $("#RoomList").html(html);
            }
        )
    }

    //退出群
    function out_room() {
        ajax_nw(
            ajax_head+"/api/employee/quit_chat_room.do",
            {
                account_username:current_admin,
                chatroom:current_user
            },
            function (ds) {
                ajax_nw(
                    ajax_head + "/api/employee/complete_question.do",
                    {question_id:question_id, remark:"管理员退出该群"},
                    function (data) {
                        $(".popup-u-chat-01").popup("hide");
                        window.location.reload();

                    }
                )
            }
        )
    }

    //快捷回复
    function LoadPersonalQuickMsg() {
        var searchKey = $("#txtQuickSearch").val();
        ajax_nw(
            ajax_head + '/api/employee/personal_quick_msg_list.do',
            {
                currentPage:1,
                pageSize:100,
                keyword:searchKey
            },
            function (result) {
                var strHtml = "";
                for (var i = 0; i < result.data.list.length; i++) {
                    var item = result.data.list[i];
                    var vcTitle = ReplaceImg(item.content);
                    content = item.content; //encodeURIComponent(item.vcTitle);
                    voicetime = 0;
                    href = "";
                    desc = "";
                    title = item.content;// encodeURIComponent(item.vcTitle);
                    if(content.indexOf('"type":"link"') != -1){
                        var data = JSON.parse(content);
                        strHtml += '<li  id="rTagsId_' + item.id + '" data-id="' + item.id + '"  data-toggle="tooltip" data-placement="bottom" data-msgtype="link" data-content="'+data.url+'" data-voicetime="" data-href="'+data.image+'" data-desc="'+data.desc+'" data-title="'+data.title+'" title="'+data.url+'" style="word-wrap:break-word;word-break:break-all;" >'+(i + 1) + '、 [链接]' + data.title+'</li>';
                    }else{
                        strHtml += "<li data-toggle=\"tooltip\" id=\"rTagsId_" + item.id + "\" data-id=\"" + item.id + "\"  data-placement=\"bottom\" title=\"" + item.content + "\">";
                        strHtml += (i + 1) + "、" + vcTitle;
                        strHtml += "</li>";
                    }

                }
                $("#ulPersonalQuickMsg").html(strHtml);
            }
        )
    }

    //新增个人快捷语
    function UChatOperatorQuickMsg_Insert(type) {
        var vcContent = $("#textbox-2").html();
        if (vcContent == "") {
            ShowConfirm("温馨提示", "请输入快捷语内容");
            return;
        }
        $("#textbox-2").find(".imgFace").each(function () {
            var name = $(this).attr("data-name");
            $(this).before("[" + name + "]");
            $(this).remove();
        });
        var content = $.trim($("#textbox-2").text());
        if (content.length > 300) {
            ShowConfirm("温馨提示", "输入文字太长，请精简后重试！");
            return;
        }
        var url = "";
        var send_data = {};
        if(type == "new"){
            url=ajax_head + "/api/employee/personal_quick_msg_add.do",
            send_data = { content:content}
        }else{
            url=ajax_head + "/api/employee/personal_quick_msg_edit.do",
                send_data ={ content:content,id: $("#btnOpQuick").attr("data_id")}
        }

        ajax_nw(
            url,
            send_data,
            function (result) {
                $(".popup-reply-txt").popup("hide");
                LoadPersonalQuickMsg();
                inTagsId = 0;

            }
        )
    }

    //删除个人快捷语
    function delQuickMsg(inOpId) {
        if (inOpId == 0 || inOpId== "" || inOpId== undefined) {
            ShowConfirm("温馨提示", "请选择要删除的个人快捷语！");
            return;
        }
        ajax_nw(
            ajax_head + '/api/employee/personal_quick_msg_delete.do',
            {id:inOpId},
            function (result) {
                $(".popup-reply-txt").popup("hide");
                LoadPersonalQuickMsg();
                inTagsId = 0;
            })
    }

    //获取所有标签
    function GetAllTag(vcMerChantNo) {
        //var str = "";
        ajax_nw(
            ajax_head + '/api/employee/tag_list.do',
            {},
            function (result) {
                var dt = result.data;
                var tagsSelect = "";
                $(".user-tags .wrap").find("span").each(function(){
                    tagsSelect += $(this).attr("data-content");
                });
                var str= "";
                for (var i = 0; i < dt.length; i++) {
                            var dr = dt[i];
                    if (tagsSelect.indexOf(dr.name) != -1) {
                        str += '<a><input type="checkbox" data_id="' + dr.id + '" name="ckTags" checked="checked" value=\"' + dr.name + '\"><label for="tag1">' + dr.name + '</label></a>';
                    }
                    else {
                        str += '<a><input type="checkbox" data_id="' + dr.id + '"  name="ckTags"  value=\"' + dr.name +'\"><label for="tag1">' + dr.name + '</label></a>';
                    }
                }

                $("#all_tags").html(str);
                $("#userSelectTags").attr("data-content", $(".add-tag-data").html());
            }
        )
    }

    //设置标签
    function SetTags() {

        try {
            var vcTags = "";
            $(".popover-content .js-tag-wrap input[name='ckTags']:checked").each(function () {
                if (vcTags.indexOf($(this).val()) != -1) {
                }
                else {
                    vcTags += $(this).attr("data_id") + ",";
                }
            })
            vcTags = vcTags.substring(0, vcTags.length - 1).split(",");
            if (vcTags == "") {
                ShowConfirm("温馨提示", "请选择标签");
                return;
            }
            ajax_nw(
                ajax_head + '/api/employee/contact_tag_add.do',
                {contact_id:contact_id,tag_id:vcTags},
                function (result) {
                    //ShowConfirm("温馨提示", "操作成功！");
                    var tagId = result.msg;
                    var str = "";
                    $(".user-tags .js-tag-wrap>a").each(function (i) {
                        if ($(this).find("input").prop("checked")) {
                            var ts = new Date().valueOf();
                            $(".add-tag-data .js-tag-wrap>a").eq(i).find("input").attr("checked", "checked");
                            str += '<span data-content="' + $(this).find("label").text() + '" id="tags_' + $(this).find("label").text() + '" data-id="tag' + $(this).find("label").text() + '">' + $(this).find("label").text() + '<a href="javascript:void(0)" data-content=' + $(this).find("label").text() + '>x</a></span>';
                        } else {
                            $(".add-tag-data .js-tag-wrap>a").eq(i).find("input").removeAttr("checked");
                        }
                    });
                    $(".user-tags .wrap").html(str);
                    $('.select-tag').attr("data-content", $(".add-tag-data").html())
                }
            )
        } catch (e) {
            logError("SetTags_ex", e.message, vcMerChantNo);
        }
    }

    //下线判断
    function ajax_nw(url,data,a) {
        data.employee_token = sessionStorage.getItem("key");
        $.ajax({
            url:url,
            type:"post",
            data:data,
            traditional: true,
            success:function (b) {
                if(b.code == 401){
                    ShowConfirm("提示", "帐号已下线！",function () {
                        window.location.href = "/imUser/login.html";
                    });
                    return false;
                }else if(b.code == 200){
                    a(b);
                }else{
                    ShowConfirm("提示", b.msg);
                }
            },
            error: function (ex) {
                console.log(ex);
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
                html += "<li user_name = "+ $(e).attr("username") +">"+ $(e).text() +"("+$(e).attr("remark")+")</li>"
            })
            if(text != "" && text != " "){
                $("#"+id+" .search ul").show();
                $("#"+ id +" .search ul").html(html);

                // 搜索结果点击
                $("#"+ id +" .search ul li").unbind("click").click(function () {
                    console.log($("#" + id + " .lxr_box li[username=" + $(this).attr("user_name") + "]"));
                    console.log($(this).attr("user_name"));
                    $("#"+ id +" .lxr_box li[username="+ $(this).attr("user_name") +"]").trigger("click");
                    $("#"+ id +" .search ul").hide();
                })
            }else{
                $("#"+ id +" .search ul").hide();
            }
        })
    }

    // 设置群昵称
    function setRoomName(name) {
        ajax_nw(
            ajax_head+"/api/employee/set_chat_room_name.do",
            {
                account_username:current_admin,
                chatroom:current_user,
                name:name
            },
            function (res) {
                $("#divChatRoomName").text(name);

            }
        )
    }

    //获取群场景列表
    function getQunCjList() {
        ajax_nw(
            ajax_head+"/api/employee/chatroom_scene_list.do",
            {
                currentPage:1,
                pageSize:999999,
                keyword:""
            },
            function (res) {
                if(res.code == 200){
                    var html = template("qunCj_list_tem",{"data":res.data.list});
                    $("#divScene").html(html);

                    //场景名称hover提示
                    $(".js-scene-name").popover({
                        trigger: 'hover',
                        placement: 'bottom'
                    });

                }
            }
        )
    }

    //获取群场景详情
    function GetSceneContentList(id) {
        ajax_nw(
            ajax_head+"/api/employee/chatroom_scene_content_list.do",
            {
                chatroom_scene_id:id
            },
            function (ds) {
                if(ds.code == 200 && ds.data.chatroom_scene_content != null){
                    var strHtml = '';
                    var dt = ds.data.chatroom_scene_content;
                    for (var k = 0; k < dt.length; k++) {
                        var item = dt[k];
                        var vcContent = qqface_change(item.content);
                        strHtml += '<li>';
                        strHtml += '    <div class="left">';
                        strHtml += '        <div class="img-box"><img src="images/scene_kehu.png"></div>';
                        strHtml += '        </div>';
                        strHtml += '        <div class="right">';
                        strHtml += '            <div class="name">间隔' + item.duration + '秒 ' + item.chatroom_scene_speak.name + '</div>';
                        if (item.type == "text") {
                            strHtml += '            <div class="main">';
                            strHtml += '                <div class="txt">' + vcContent + '</div>';
                            strHtml += '            </div>';
                        }
                        else if (item.type == "image") {
                            strHtml += '            <div class="main">';
                            strHtml += '               <div class="img">';
                            strHtml += '                   <img src="' + item.media.content + '">';
                            strHtml += '                   </div>';
                            strHtml += '            </div>';
                        }
                        else if (item.type == "voice") {
                            strHtml += '            <div class="main">';
                            strHtml += '                <div class="audio no-read" style="width: 121px"><i></i><audio src="' + item.media.share_url + '"  data-len=\"" + item.media.description +"\"></audio><span>'+item.media.description+'\'\'</span></div>';//vcLinkUrl
                            strHtml += '            </div>';
                        }
                        else if (item.type == "link") {
                            strHtml += '            <div class="main link" data-url="' + item.media.share_url + '">';
                            strHtml += '                <div class="box-1">' + item.media.title + '</div>';
                            strHtml += '                <div class="box-2">';
                            strHtml += '                    <div class="img-box"><img src="' + item.media.content + '"></div>';
                            strHtml += '                        <div class="text">';
                            strHtml += '                            ' + item.media.description + '';
                            strHtml += '                        </div>';
                            strHtml += '                    </div>';
                            strHtml += '           </div>';
                        }
                        strHtml += '        </div>';
                        strHtml += '</li>';
                    }
                    $("#yl_Scene").html(strHtml);

                }
            }
        )
    }

    //开启群场景
    function GetChatRoom_ValidateScene(id) {
        ajax_nw(
            ajax_head+"/api/employee/chatroom_scene_detail.do",
            {
                account_username:current_admin,
                chatroom:current_user,
                chatroom_scene_id:id
            },
            function (res) {
                if(res.code == 200){
                    var strHtml = '';
                    var dt = res.data.chatroom_scene_speak;
                    for (var k = 0; k < dt.length; k++) {
                        var item = dt[k];
                        var strSex = '不限制';
                        if (item.sex == 1)
                            strSex = '男';
                        else if (item.sex == 2)
                            strSex = '女';
                        strHtml += '';
                        strHtml += '<tr dataid="' + item.id + '">';
                        strHtml += '    <td>' + item.name + '（' + strSex + '）</td>';
                        strHtml += '    <td>';
                        strHtml += '        <select>';
                        for (var i = 0; i < item.accounts.length; i++) {
                            var itemRobot =item.accounts[i];
                            strHtml += '                <option value="' + itemRobot.user_name + '">' + itemRobot.nick_name + '</option>';
                        }
                        strHtml += '        </select>';
                        strHtml += '    </td>';
                        strHtml += '    <td></td>';
                        strHtml += '</tr>';
                    }
                    $("#tbSceneSelect").html(strHtml);
                    $("#divSceneChatRoomName").text(res.data.contact.nick_name);
                    $(".popup-scene-open").popup('show');
                }else{
                    ShowConfirm("温馨提示", res.msg);
                }
            }
        )
    }

    //获取群状态
    function GetChat_State(admin,user) {
        ajax_nw(
            ajax_head+"/api/employee/get_chatroom_config.do",
            {
                account_username:admin,
                chatroom:user
            },
            function (res) {
                if(res.code == 200){
                    if(res.data.recv_msg == 1){
                        $("#change_qun_btn").text("否").css("color","#58bc9c");
                    }else{
                        $("#change_qun_btn").text("是").css("color","#c30d23");
                    }
                    if(res.data.is_robot_enable == 1){
                        $("#robot_btn").text("开启").addClass("green");
                    }else{
                        $("#robot_btn").text("关闭").removeClass("green");
                    }
                    $("#robot_list").attr("data_select",res.data.robot_config_id);
                }else{
                    ShowConfirm("温馨提示", res.msg);
                }
            }
        )
    }

    //获取聊天机器人列表
    function GetAiList() {
        ajax_nw(
            ajax_head+"/api/employee/robot_config_list.do",
            {},
            function (res) {
                if(res.code == 200){
                    var value = $("#robot_list").attr("data_select");
                    var html = '<option value="0">请选择机器人</option>';
                    for(var i = 0 ; i < res.data.length; i++){
                        if(value == res.data[i].id){
                            html += '<option selected value="'+res.data[i].id+'">'+res.data[i].name+'</option>'
                        }else{
                            html += '<option value="'+res.data[i].id+'">'+res.data[i].name+'</option>'
                        }
                    }
                    $("#robot_list").html(html);
                }else{
                    ShowConfirm("温馨提示", res.msg);
                }
            }
        )
    }

    //查看二维码
    function erweima() {
        ajax_nw(
            ajax_head+'/api/employee/get_user_qrcode.do',
            {
                account_username:current_admin,
                user:current_user,
                style:0
            },
            function (res) {
                if(res.code == 200){

                    var json = {
                        "title":"二维码",
                        "id":"1",
                        "start":0,
                        "data":[{
                            "alt":"",
                            "pid":1,
                            "src":"data:image/png;base64,"+res.data.qr_code,
                            "thumb":"data:image/png;base64,"+res.data.qr_code
                        }]
                    }
                    layui.use("layer",function () {
                        var layer = layui.layer;
                        var layer_img = layer.photos({
                            photos:json,
                            anim:5,
                            shade:0.1,
                            success:function () {
                                $(".layui-layer-imgtit em").html("该二维码七日内有效");
                            }
                        })
                    })
                }else{
                    ShowConfirm("提示", res.msg);
                }
            }
        )
    }

    //发送
    var objClick = 0;
    var objExecute = true;
    function Save() {
        if (objClick == 0) {
            objClick = 1;
            setTimeout(function () {
                var nSceneId = kq_sceneId;
                var aryRobot = [];
                var wxRobot = [];
                $("#tbSceneSelect").find("tr").each(function () {
                  var id = $(this).attr("dataid");
                  aryRobot.push(id);

                  var wx = $(this).find("select").val();
                  wxRobot.push(wx);
                });
                if (aryRobot.length == 0) {
                    objClick = 0;
                    ShowConfirm("提示", "请先分配账号！");
                    return false;
                }
                $(".popup-scene-open").popup('hide');
                if (objExecute) {
                    objExecute = false;

                    $.ajax({
                        url:ajax_head+"/api/employee/chatroom_scene_record_add.do",
                        type:"post",
                        traditional: true,
                        data:{
                            employee_token:sessionStorage.getItem("key"),
                            account_username:current_admin,
                            chatroom:current_user,
                            chatroom_scene_id:nSceneId,
                            chatroom_scene_speak_id:aryRobot,
                            user_name:wxRobot
                        },
                        success:function (res) {
                            objClick = 0;
                            objExecute = true;
                            if(res.code != 200){
                                ShowConfirm("提示", res.msg);
                            }
                        },
                        error:function (ex) {
                            objClick = 0;
                            objExecute = true;
                            alert(ex);
                        }
                    })
                }
                else {
                    objExecute = true;
                    objClick = 0;
                    ShowConfirm("提示", "请不要频繁提交！");
                }
                objClick = 0;
            }, 600);
        }
    }

})
