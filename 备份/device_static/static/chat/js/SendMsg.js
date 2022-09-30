
function SendMsg(msg_inQuestion, msg_vcRobotWxID, msg_vcCustomerWxID, msg_vcChatRoomID, msg_createtime, msg_inSource, msgtype, content, voicetime, href, desc, title, isBatch) {
    content = decodeURIComponent(content);
    var tempContent = content;
    content = content.replace(/<div>/ig, "").replace(/<\/div>/ig, "\r\n").replace(/<\/br>/ig, "").replace(/<br>/ig, "");
    content = content.replace(/&gt;/ig, ">");
    GetMsgId();
    var createtime = (new Date()).getTime().toString();
    if (msg_inSource == "12") {
        var msgContent = content;
        if (msgtype == 2005)
            msgContent = href;
        var nVoiceTime = voicetime
        var vctitle = title;
        var vcDescription = desc;
        var vcPicUrl = content;
        var vcImgFile = content;
        console.info("RecOver_msgContent:" + msgContent);
        SendGZHMsg2(msg_inQuestion,msgtype, msg_createtime, msg_vcCustomerWxID, msgContent, vctitle, vcDescription, vcPicUrl, nVoiceTime, vcImgFile);
        $("#txtContent").html("");
        $(".popup-u-chat-02").popup("hide");
    }
    else {
        var msgbody = {
            qid: msg_inQuestion,
            cmd: 18001,
            cmdName: "sendMessageAuto",
            msgid: $.cookie("opid") + vcMsgId,
            tocustomerwxid: msg_vcCustomerWxID,
            tochatroomid: msg_vcChatRoomID,
            createtime: msg_createtime,
            data: [{
                nMsgType: msgtype,
                msgContent: content,
                nVoiceTime: voicetime,
                vcHref: href,
                vcDesc: desc,
                vcTitle: title
            }
            ]
        };

        if (uchatyb && uchatyb.client_connected) {
            if (msgtype == 2005) {
                uchatdb.SaveDetail(msg_inQuestion, $.cookie("opid") + vcMsgId, msg_createtime, msgtype, desc, title, href, content, voicetime, 11, 10, 10);
                AppendDetail(msg_inQuestion, $.cookie("opid") + vcMsgId, msg_createtime, msgtype, desc, title, href, content, voicetime, 11, 10);
            }
            else {
                uchatdb.SaveDetail(msg_inQuestion, $.cookie("opid") + vcMsgId, msg_createtime, msgtype, tempContent, title, href, desc, voicetime, 11, 10, 10);
                AppendDetail(msg_inQuestion, $.cookie("opid") + vcMsgId, msg_createtime, msgtype, tempContent, title, href, desc, voicetime, 11, 10);
            }
            var kjcontent = "";
            if (msgtype == "2001") {
                kjcontent = ReplaceChineseImg($.trim(content));
            }
            else if (msgtype == "2002") {
                kjcontent = "[图片]";
            }
            else if (msgtype == "2003") {
                kjcontent = "[语音]";
            }
            else if (msgtype == "2005") {
                kjcontent = "[链接]";
            }
            if (kjcontent != "") {
                uchatdb.ExecuteSql(" update tbQuestion set vcNewTitle='" + kjcontent + "' where inID=" + msg_inQuestion);
                $("#lileft_" + msg_inQuestion + "").find(".t2-1").html(kjcontent);
            }
            //repeatUChat();
            $("#txtContent").html("");
            $(".popup-u-chat-02").popup("hide");
            uchatyb.Publish(msg_vcRobotWxID, JSON.stringify(msgbody), function (success, msg) {
                if (success) {

                }
                else {
                    //alert('failure:' + msg);
                    console.info("QuickMessageSub:快捷回复消息推送失败" + JSON.stringify(msgbody));
                    ShowConfirm("温馨提示", 'failure:' + msg, 1);
                }
            });
           
        }
    }
}


function SendGZHMsg2(msg_inQuestion,msgtype, createtime, vcCustomerWxID, msgContent, vctitle, vcDescription, vcPicUrl, nVoiceTime, vcImgFile) {
    var sendMsgContent = msgContent;
    if (msgtype == "2001") {
        sendMsgContent = msgContent;
    }
    else if (msgtype == "2002") {
        sendMsgContent = vcImgFile;
    }
    else if (msgtype == "2003") {
        sendMsgContent = msgContent;
    }
    else if (msgtype == "2005") {
        sendMsgContent = msgContent;
    }
    $.ajax({
        url: PublicNumberUrl + '/SendMsg',
        type: 'POST',
        data: { msgType: msgtype, openId: vcCustomerWxID, content: sendMsgContent, Title: vctitle, Description: vcDescription, PicUrl: vcPicUrl },
        dataType: 'json',
        async: false,
        success: function (result) {
            var result = eval(result);
            if (result[0][0].nResult == 1) {
                var vcUrl = "";
                if (msgtype == "2005") {
                    vcUrl = sendMsgContent;
                    sendMsgContent = vcDescription;
                }
                else if (msgtype == 2002) {
                    sendMsgContent = msgContent;
                }
                uchatdb.SaveDetail(msg_inQuestion, $.cookie("opid") + vcMsgId, createtime, msgtype, sendMsgContent, vctitle, vcUrl, vcPicUrl, nVoiceTime, 11, 10, 10);
                AppendDetail(msg_inQuestion, $.cookie("opid") + vcMsgId, createtime, msgtype, sendMsgContent, vctitle, vcUrl, vcPicUrl, nVoiceTime, 11, 10);

                var content = "";
                if (msgtype == "2001") {
                    content = ReplaceChineseImg($.trim($("#txtContent").text()));
                }
                else if (msgtype == "2002") {
                    content = "[图片]";
                }
                else if (msgtype == "2003") {
                    content = "[语音]";
                }
                else if (msgtype == "2005") {
                    content = "[链接]";
                }
                if (content != "") {
                    uchatdb.ExecuteSql(" update tbQuestion set vcNewTitle='" + content + "' where inID=" + msg_inQuestion);
                    $("#lileft_" + msg_inQuestion + "").find(".t2-1").html(content);
                }
                $("#txtContent").html("");               
            } else {
                //alert("获取消息ID失败");
                ShowConfirm("温馨提示", result[0][0].vcMessage, 1);
                return;
            }
        },
        error: function () {
            
        }
    });
}