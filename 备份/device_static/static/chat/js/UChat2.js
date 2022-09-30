//个人快捷语
function LoadPersonalQuickMsg(inOpId, vcMerChantNo) {
    var searchKey = $("#txtQuickSearch").val();
    $.ajax({
        url: QustionServiceUrl + '/UChatOperatorQuickMsg_GetByOpId',
        type: 'POST',
        data: { strContext: "{\"inOpId\":\"" + inOpId + "\",\"vcMerChantNo\":\"" + vcMerChantNo + "\",\"searchKey\":\"" + searchKey +"\"}" },
        dataType: 'json',
        async: false,
        success: function (result) {
            var result = eval(result);
            if (result.tables != undefined && result.tables.length > 0) {
                var strHtml = "";
                for (var i = 0; i < result.tables[0].length; i++) {
                    var item = result.tables[0][i];

                    var vcTitle = ReplaceImg(item.vcTitle);
                    content = item.vcTitle; //encodeURIComponent(item.vcTitle);
                    voicetime = 0;
                    href = "";
                    desc = "";
                    title = item.vcTitle;// encodeURIComponent(item.vcTitle);
                    strHtml += "<li data-toggle=\"tooltip\" id=\"rTagsId_" + item.inID + "\" data-id=\"" + item.inID + "\" onclick=\"javascript:QuickMessageSub('" + msgtype + "','" + encodeURIComponent(item.vcTitle) + "','" + voicetime + "','" + href + "','" + desc + "','" + title + "',0);\" data-placement=\"bottom\" title=\"" + item.vcTitle + "\">";
                    strHtml += (i + 1) + "、" + vcTitle;                  
                    strHtml += "</li>";
                }                
                $("#ulPersonalQuickMsg").html(strHtml);
            }
        },
        error: function () {
        }
    });
}

var hasPersonalMore = true;
function MorePersonalQuick() {
    if (hasPersonalMore) {
        Quick_nPageIndex += 1;
        LoadPersonalQuickMsg(true, inMerchID);
    }
}

var Quick_nPageIndex = 1;
var Quick_nPageSize = 12;
var Quick_nRecordCount = 0;
//快捷回复
function LoadzQuickMsgList(isMore, inMerchID) {
    if (!isMore)
        Quick_nPageIndex = 1;
    var searchKey = $("#txtQuickSearch").val();

    $.ajax({
        url: ajax_head + '/api/employee/public_quick_msg_list.do',
        type: 'POST',
        data: {
            employee_token:sessionStorage.getItem("key"),
            currentPage:Quick_nPageIndex,
            pageSize:Quick_nPageSize,
            keyword:searchKey
        },
        success: function (ds) {
            var strHtml = "";
            if (ds.code == 200) {
                Quick_nRecordCount = ds.data.page.currentPage;
                var dt = ds.data.list;

                for (var k = 0; k < dt.length; k++) {
                    var item = dt[k];
                    strHtml += "<div class=\"panel\" id=\"quick_" + item.id + "\">";
                    strHtml += "<div class=\"panel-heading\" role=\"tab\">";
                    strHtml += "<h4 class=\"panel-title\">";
                    strHtml += "<a href=\"javascript:QuickMessageSubBatch(" + item.id + ");\">" + decodeURIComponent(item.title) + "</a>";
                    strHtml += "</h4>";
                    strHtml += "</div>";
                    strHtml += "<div class=\"panel-collapse collapse\">";
                    strHtml += "<div class=\"panel-body\">";
                    strHtml += "<ul class=\"reply-list\">";
                    var intCount = 0;
                    var dtChild = JSON.parse(item.content);
                    console.log(dtChild);
                    for (var s = 0; s < dtChild.length; s++) { 
                        var itemChild = dtChild[s];
                        intCount++;
                        var msgtype = itemChild.type;
                        var content = "";
                        var voicetime = "";
                        var href = "";
                        var desc = "";
                        var title = "";
                        var showTitle = "";
                        if (itemChild.type == "text") {
                            content = itemChild.content;//encodeURIComponent(data[w].vcContentTitle);
                            voicetime = "";
                            href ="";
                            desc = "";
                            title = "";//itemChild.vcContentTitle;//encodeURIComponent(itemChild.vcContentTitle);
                            showTitle = ReplaceChineseImg(decodeURIComponent(content)).replace(/\n/ig, "<br />");
                            strHtml += "<li data-toggle=\"tooltip\" data-placement=\"bottom\" onclick=\"javascript:QuickMessageSub('" + msgtype + "','" + encodeURIComponent(content) + "','" + voicetime + "','" + href + "','" + desc + "','" + title + "',0);\"";
                            strHtml += " data-msgtype=\"" + msgtype + "\"  data-content=\"" + content + "\" data-voicetime=\"" + voicetime + "\" data-href=\"" + href + "\" data-desc=\"" + desc + "\" data-title=\"" + title + "\"";
                            strHtml += " style=\"word-wrap:break-word;word-break:break-all;\" title=\"" + content + "\">" + (intCount) + "、" + showTitle + "</li>";
                            //strHtml += "<li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + content + "\">" + showTitle + "</li>";
                        }
                        else if (itemChild.type == "image") {
                            content = itemChild.content;
                            voicetime = "";
                            href = itemChild.content;
                            desc = "";
                            title = itemChild.title;
                            showTitle = itemChild.content;
                            strHtml += "<li data-toggle=\"tooltip\" data-placement=\"bottom\" onclick=\"javascript:QuickMessageSub('" + msgtype + "','" + content + "','" + voicetime + "','" + href + "','" + desc + "','" + title + "',0);\"";
                            strHtml += " data-msgtype=\"" + msgtype + "\"  data-content=\"" + content + "\" data-voicetime=\"" + voicetime + "\" data-href=\"" + href + "\" data-desc=\"" + desc + "\" data-title=\"" + title + "\"";
                            strHtml += " style=\"\" title=\"" + content + "\" class=\"inp\">" + (intCount) + "、<img src=\"" + showTitle + "\"></li>";
                            //strHtml += "<li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + content + "\" class=\"inp\" >" + (w + 1) + "、<img src=\"" + showTitle + "\"></li>";
                        }
                        else if (itemChild.type == "voice") {
                            content = itemChild.content;
                            voicetime = "";
                            href = itemChild.share_url;
                            desc = itemChild.description;
                            title = itemChild.title;
                            showTitle = itemChild.title;
                            strHtml += "<li data-toggle=\"tooltip\" data-placement=\"bottom\"";
                            strHtml += " data-msgtype=\"" + msgtype + "\"  data-content=\"" + content + "\" data-voicetime=\"" + voicetime + "\" data-href=\"" + href + "\" data-desc=\"" + desc + "\" data-title=\"" + title + "\"";
                            strHtml += " style=\"word-wrap:break-word;word-break:break-all;\" title=\"" + content + "\">" + (intCount) + "、[语音] " + showTitle + "</li>";
                            //strHtml += "<li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + content + "\">" + showTitle + "</li>";
                        }
                        else if (itemChild.type == "link") {
                            content = itemChild.share_url;
                            voicetime = "";
                            href = itemChild.content;
                            desc = itemChild.description;
                            title = itemChild.title;
                            showTitle = itemChild.title;
                            strHtml += "<li data-toggle=\"tooltip\" data-placement=\"bottom\" onclick=\"javascript:QuickMessageSub('" + msgtype + "','" + content + "','" + voicetime + "','" + href + "','" + desc + "','" + title + "',0);\"";
                            strHtml += " data-msgtype=\"" + msgtype + "\"  data-content=\"" + content + "\" data-voicetime=\"" + voicetime + "\" data-href=\"" + href + "\" data-desc=\"" + desc + "\" data-title=\"" + title + "\"";
                            strHtml += " style=\"word-wrap:break-word;word-break:break-all;\"  title=\"" + content + "\">" + (intCount) + "、[链接] " + showTitle + "</li>";
                            //strHtml += "<li data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + content + "\">" + showTitle + "</li>";
                        }
                        else {
                            continue;
                        }
                    }
                    strHtml += "</ul>";
                    strHtml += "</div>";
                    strHtml += "</div>";
                    strHtml += "</div>";
                }
            }
            if (isMore) {
                $("#divCommonQuick").html($("#divCommonQuick").html() + strHtml);
            }
            else {
                $("#divCommonQuick").html(strHtml);
            }

            //setHeight();
        },
        error: function () {
        }
    });
}

var hasQuickMore = true;
function MoreQuick() {
    if (hasQuickMore) {
        Quick_nPageIndex += 1;
        LoadzQuickMsgList(true, inMerchID);
    }
}


function GetFriends(vcFansWxId, vcMerChantNo, vcRobotWxId, RobotName) {
    if (vcFansWxId == "" || vcRobotWxId == "") {
        return;
    }
    $.ajax({
        url: QustionServiceUrl + '/Friends_ByWxId',
        type: 'POST',
        data: { strContext: "{\"vcFansWxId\":\"" + vcFansWxId + "\",\"vcMerChantNo\":\"" + vcMerChantNo + "\",\"vcRobotWxId\":\"" + vcRobotWxId+"\"}" },
        dataType: 'json',
        async: false,
        success: function (result) {
            var result = eval(result);
            // console.log(result)
            if (result.tables != undefined && result.tables.length > 0) {
                var strHtml = "";
                var item = result.tables[0][0];
               
                if (item.vcSex == 1)
                    $("#fansSex").html("男");
                else
                    $("#fansSex").html("女");
                var vcCustomerName = ReplaceImg(item.vcNickName);
                var base64customername = item.vcBase64NickName;
                if (base64customername != "" && base64customername != undefined && base64customername != "undefined") {
                    vcCustomerName = ReplaceBase64Img(base64customername);
                }
                $("#div_name").html(vcCustomerName);
                $("#fansNikeName").html(vcCustomerName);

                $("#RobotWxName").html(RobotName);
                if (result.tables.length > 1) {
                    var tagsDt = result.tables[1];

                    var strTags = "";
                    for (var i = 0; i < tagsDt.length; i++) {
                        var tagsItem = tagsDt[i];
                        strTags += "<span data-content=\"" + tagsItem.vcTag + "\" id=\"tags_" + tagsItem.vcTag+"\">" + tagsItem.vcTag + "<a href=\"javascript:void (0)\" data-id=\"tag-" + tagsItem.inID + "\" data-content=\"" + tagsItem.vcTag + "\">x</a></span>";

                    }
                    $(".user-tags .wrap").html(strTags);
                }

            }
        },
        error: function () {
        }
    });
    GetAllTag(vcMerChantNo);
}

function GetAllTag(vcMerChantNo) {
    //var str = "";
    $.ajax({
        url: QustionServiceUrl + '/GetTagByMerChant',
        type: 'POST',
        data: { strContext: "{\"vcFansWxId\":\"\",\"vcMerChantNo\":\"" + vcMerChantNo + "\",\"vcRobotWxId\":\"\"}" },
        dataType: 'json',
        async: false,
        success: function (result) {
            var result = eval(result);
            var str = "";
            if (result.tables != undefined && result.tables.length > 0) {
                var dt = result.tables[0];
                var tagsSelect = "";
                $(".user-tags .wrap").find("span").each(function(){
                    tagsSelect += $(this).attr("data-content");
                });
                for (var i = 0; i < dt.length; i++) {
                    var dr = dt[i];
                    if (tagsSelect.indexOf(dr.vcTag) != -1) {
                        str += '<a><input type="checkbox" id="tag' + dr.inID + '" name="ckTags" checked="checked" value=\"' + dr.vcTag + '\"><label for="tag1">' + dr.vcTag + '</label></a>';
                    }
                    else {
                        str += '<a><input type="checkbox" id="tag' + dr.inID + '"  name="ckTags"  value=\"' + dr.vcTag +'\"><label for="tag1">' + dr.vcTag + '</label></a>';
                    }
                }
            }

            $(".add-tag-data .js-tag-wrap").html(str);
            $("#userSelectTags").attr("data-content", $(".add-tag-data").html());
        },
        error: function (ex) {
            ShowConfirm("提示", "请稍后在重试！");
        }
    });
    //if (str != "")
    //    return str;
}

var inTagsId = 0;
//个人快捷语
function UChatOperatorQuickMsg_Insert(inOpId, vcMerChantNo) {
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

    $.ajax({
        url: QustionServiceUrl + '/UChatOperatorQuickMsg_InsertUpdate',
        type: 'POST',
        data: { strContext: "{\"inID\":\"" + inTagsId + "\",\"inOpId\":\"" + inOpId + "\",\"vcMerChantNo\":\"" + vcMerChantNo + "\",\"vcContent\":\"" + content + "\",\"vcDesc\":\"\"}" },
        dataType: 'json',
        async: false,
        success: function (result) {
            var result = eval(result);
            if (result.result == 1) {
                $(".popup-reply-txt").popup("hide");
                //ShowConfirm("温馨提示", "保存成功！");
                LoadPersonalQuickMsg(inOpId, vcMerChantNo);
                inTagsId = 0;
            }
            else {
                ShowConfirm("温馨提示", "保存失败！");
            }
        },
        error: function () {
        }
    }); 
}

function UChatOperatorQuickMsg_Delete(userSelectTags) {
    if (inTagsId == 0) {
        ShowConfirm("温馨提示", "请选择要删除的个人快捷语！");
        return;
    }
    $.ajax({
        url: QustionServiceUrl + '/UChatOperatorQuickMsg_Delete',
        type: 'POST',
        data: { strContext: "{\"inID\":\"" + inTagsId + "\",\"inOpId\":\"" + inOpId + "\",\"vcMerChantNo\":\"" + vcMerChantNo + "\"}" },
        dataType: 'json',
        async: false,
        success: function (result) {
            var result = eval(result);
            if (result.result == 1) {
                $(".popup-reply-txt").popup("hide");
                //ShowConfirm("温馨提示", "删除成功！");
                LoadPersonalQuickMsg(inOpId, vcMerChantNo);
                inTagsId = 0;
            }
            else {
                ShowConfirm("温馨提示", "删除失败！");
            }
        },
        error: function () {
        }
    });
}

function SetTags(vcMerChantNo, vcRobotWxId, vcFansWeixinId) {
    try {
        var vcTags = "";
        $("input[name='ckTags']:checked").each(function () {
            if (vcTags.indexOf($(this).val()) != -1) {

            }
            else {
                vcTags += $(this).val() + ",";
            }
        })
        vcTags = vcTags.substring(0, vcTags.length - 1);
        if (vcTags == "") {
            ShowConfirm("温馨提示", "请选择标签");
            return;
        }
        $.ajax({
            url: QustionServiceUrl + '/UserTags_Insert',
            type: 'POST',
            data: { strContext: "{\"vcMerChantNo\":\"" + vcMerChantNo + "\",\"vcRobotWxId\":\"" + vcRobotWxId + "\",\"vcFansWeixinId\":\"" + vcFansWeixinId + "\",\"vcTags\":\"" + vcTags + "\"}" },
            dataType: 'json',
            async: false,
            success: function (result) {
                var result = eval(result);
                if (result.result == 1) {
                    //ShowConfirm("温馨提示", "操作成功！");
                    var str = '';
                    var tagId = result.msg;
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
                else {
                    ShowConfirm("温馨提示", "操作失败！");
                }
            },
            error: function () {
            }
        });
    } catch (e) {
        logError("SetTags_ex", e.message, vcMerChantNo);
    }
}

function DelUserTags(vcMerChantNo, vcRobotWxId, vcFansWeixinId, vcTagName) {
    try {
        $.ajax({
            url: QustionServiceUrl + '/UserTags_Delete',
            type: 'POST',
            data: { strContext: "{\"vcMerChantNo\":\"" + vcMerChantNo + "\",\"vcRobotWxId\":\"" + vcRobotWxId + "\",\"vcFansWeixinId\":\"" + vcFansWeixinId + "\",\"vcTags\":\"" + vcTagName + "\"}" },
            dataType: 'json',
            async: false,
            success: function (result) {
                var result = eval(result);
                if (result.result > 0) {
                    var ts = new Date().valueOf();
                    $("#tags_" + vcTagName).remove();

                    GetAllTag(vcMerChantNo);

                    //ShowConfirm("温馨提示", "操作成功！");
                }
                else {
                    ShowConfirm("温馨提示", "操作失败！");
                }
            },
            error: function () {
            }
        });
    } catch (e) {
        logError("DelUserTags_ex", e.message, vcMerChantNo);
    }
}

function AddMerChantTags(vcMerChantNo) {
    try {
        var vcTagName = $("#txtMerChantTag").val();
        if (vcTagName == "") {
            ShowConfirm("温馨提示", "请输入标签名");
            return;
        }
        $.ajax({
            url: QustionServiceUrl + '/Tags_MerInsert',
            type: 'POST',
            data: { strContext: "{\"vcMerChantNo\":\"" + vcMerChantNo + "\",\"vcTagName\":\"" + vcTagName + "\"}" },
            dataType: 'json',
            async: false,
            success: function (result) {
                var result = eval(result);
                if (result.result > 0) {
                    //var val = $(".popover .add-tag-box .form-control").val();
                    var ts = new Date().valueOf();

                    $(".js-tag-wrap").append(' <a><input type="checkbox" id="tag' + ts + '" name=\"ckTags\" value=\"' + vcTagName + '\"><label for="tag' + ts + '">' + vcTagName + '</label></a> ');
                    $('.js-tag-select').attr("data-content", $(".add-tag-data").html());
                    GetAllTag(vcMerChantNo);
                    //ShowConfirm("温馨提示", "操作成功！");
                }
                else {
                    ShowConfirm("温馨提示", "操作失败！");
                }
            },
            error: function () {
            }
        });
    } catch (e) {
        logError("AddMerChantTags_ex", e.message, vcMerChantNo);
    }
}

var isHisMore = false;
var nPageIndex = 1;
var nPageSize = 10;
//vcMerChantNo, vcRobotWxId, vcFansWeixinId, inOpID,
// 聊天记录
function ShowHistory(isHisMore) {
    if (vcCustomerWxID == "" || vcRobotWxID == "") {
        return;
    }
    if (!isHisMore) {
        nPageIndex = 1;
        hasMore = true;
    }
    try {
        var vcSearchKey = $("#vcSearchKey").val();
        $.ajax({
            url: ajax_head + "/api/employee/message_list.do",
            type: 'POST',
            data: {
                employee_token:sessionStorage.getItem("key"),
                // strContext: "{\"vcMerChantNo\":\"" + inMerchID + "\",\"vcRobotWxId\":\"" + vcRobotWxID + "\",\"vcFansWeixinId\":\"" + vcCustomerWxID + "\", \"inOpID\": " + opid + ", \"nPageIndex\":" + nPageIndex + ", \"nPageSize\":" + nPageSize + ", \"vcSearchKey\":\"" + vcSearchKey + "\"}"
                currentPage:nPageIndex,
                pageSize: 100
                },
            dataType: 'json',
            async: true,
            success: function (result) {
                var result = eval(result);
                if (result.result == 2) {
                    var strHtml = "";
                    if (result.tables == undefined || result.tables.length == 0 || result.tables[0][0].inCount == 0) {
                        $(".more").hide();
                        hasMore = false;
                    }
                    else {
                        P_nRecordCount = result.tables[0][0].inCount;

                        for (var i = result.tables[1].length - 1; i >= 0; i--) {
                            var cItem = result.tables[1][i];

                            //try {
                            //    if (qArray == null || qArray.length == 0 || qArray.indexOf(cItem.inQuestion) < 0) {
                            //        qArray.push(cItem.inQuestion);
                            //        strHtml += "<li id=\"lihistory" + inQuestion + "_" + i + "\">";
                            //        strHtml += "<div class=\"create-time\">";
                            //        var dateCreate = new Date(cItem.dtCreateTime);
                            //        //dateCreate.setTime(cItem.dtCreateTime);
                            //        strHtml += "<div>建立时间：" + dateCreate.format("yyyy-MM-dd hh:mm:ss") + "</div>";
                            //        //strHtml += "<div>处理人：王二喜</div>";
                            //        strHtml += "<div><i class=\"fa fa-arrow-down\"></i></div>";
                            //        strHtml += "</div>";
                            //        strHtml += "</li>";
                            //    }
                            //} catch (e) {
                            //    console.info("qArray:" + e.message);
                            //}
                            var vcShowVipNickName = "";
                            var dtTime = new Date(cItem.dtCreateTime);
                            if (cItem.snSendType == 11) {
                                strHtml += "<li class=\"self\" id=\"li_ms_" + cItem.vcMsgID + "\"  data_id=\"" + inQuestion + "\" data_msgid=\"" + cItem.vcMsgID + "\"  data_time=\"" + cItem.dtCreateTime + "\">";
                                strHtml += "<div class=\"left\">";
                                strHtml += "<div class=\"img-box\"><img src=\"" + defaultKFHeadimg + "\"></div>";
                                strHtml += "</div>";
                            }
                            else {
                                strHtml += "<li id=\"li_ms_" + cItem.vcMsgID + "\"  data_id=\"" + inQuestion + "\" data_msgid=\"" + cItem.vcMsgID + "\"  data_time=\"" + cItem.dtCreateTime + "\">";
                                strHtml += "<div class=\"left\">";
                                if (nIsVip == 11) {
                                    vcShowVipNickName = ReplaceImg(cItem.vcCustomerName); //
                                    var base64ShowVipNickName = cItem.vcBase64CustomerName;
                                    if (base64ShowVipNickName != "" && base64ShowVipNickName != undefined && base64ShowVipNickName != "undefined") {
                                        vcShowVipNickName = ReplaceBase64Img(base64ShowVipNickName);
                                    }
                                    if (cItem.vcHeadimg != "" && cItem.vcHeadimg != undefined && cItem.vcHeadimg != "undefined")
                                        strHtml += "<div class=\"img-box\"><img src=\"" + cItem.vcHeadimg + "\"></div>";
                                    else
                                        strHtml += "<div class=\"img-box\"><img src=\"" + defaultHeadimg + "\"></div>";
                                }
                                else {
                                    if (vcHeadimg != "" && vcHeadimg != undefined && vcHeadimg != "undefined")
                                        strHtml += "<div class=\"img-box\"><img src=\"" + vcHeadimg + "\"></div>";
                                    else
                                        strHtml += "<div class=\"img-box\"><img src=\"" + defaultHeadimg + "\"></div>";
                                }
                                strHtml += "</div>";
                            }

                            if (cItem.snMsgType == 2001) {
                                //var vcContent = decodeURIComponent(cItem.vcContent);
                                var vcContent = cItem.vcContent;
                                var vcTxtContent = ReplaceChineseImg(vcContent);
                                if (cItem.snSendType == 11) {
                                    vcTxtContent = ReplaceImg(vcContent);
                                }
                                strHtml += "<div class=\"right\">";
                                strHtml += "<div class=\"name\">" + dtTime.format("yyyy-MM-dd hh:mm:ss") + " " + vcShowVipNickName + "</div>";
                                strHtml += "<div class=\"main\">";
                                strHtml += "<div class=\"txt\" style=\"word-wrap:break-word;word-break:break-all;\">" + vcTxtContent + "</div>";
                                if (cItem.iskeyword == 11) {
                                    strHtml += "<div class=\"trigger-keyword\">【关键词自动回复】</div>";
                                }
                                strHtml += "</div>";
                                strHtml += "</div>";
                            }
                            else if (cItem.snMsgType == 2002) {
                                strHtml += "<div class=\"right\">";
                                strHtml += "<div class=\"name\">" + dtTime.format("yyyy-MM-dd hh:mm:ss") + " " + vcShowVipNickName + "</div>";
                                strHtml += "<div class=\"main\">";
                                strHtml += "<div class=\"img\">";
                                strHtml += "<img src=\"" + cItem.vcContent + "\">";
                                strHtml += "</div>";
                                if (cItem.iskeyword == 11) {
                                    strHtml += "<div class=\"trigger-keyword\">【关键词自动回复】</div>";
                                }
                                strHtml += "</div>";
                                strHtml += "</div>";
                            }
                            else if (cItem.snMsgType == 2003) {
                                var vcContent = cItem.vcContent;
                                strHtml += "";
                                strHtml += "<div class=\"right\">";
                                strHtml += "<div class=\"name\">" + dtTime.format("yyyy-MM-dd hh:mm:ss") + " " + vcShowVipNickName + "</div>";
                                strHtml += "<div class=\"main\">";
                                var read = "";
                                if (cItem.inFirstPlay == 10)
                                    read = "no-read";
                                strHtml += "<div class=\"audio " + read + "\" data-msgid=\"" + cItem.vcMsgID+"\"  id=\"a_" + cItem.vcMsgID + "\"  style=\"width: 121px\"><i></i><span>" + cItem.inDuration + "''</span></div>";
                                if (cItem.iskeyword == 11) {
                                    strHtml += "<div class=\"trigger-keyword\">【关键词自动回复】</div>";
                                }
                                strHtml += "</div>";
                                strHtml += "</div>";
                            }
                            else if (cItem.snMsgType == 2004) {
                            }
                            else if (cItem.snMsgType == 2005) {
                                strHtml += "<div class=\"right\">";
                                strHtml += "<div class=\"name\">" + dtTime.format("yyyy-MM-dd hh:mm:ss") + " " + vcShowVipNickName + "</div>";
                                strHtml += "<div class=\"main link\" onclick=\"linkOpen('" + cItem.vcUrl + "');\">";
                                strHtml += "<div class=\"box-1\">" + ReplaceChineseImg(cItem.vcTitle) + "</div>";
                                strHtml += "<div class=\"box-2\">";
                                strHtml += "<div class=\"img-box\"><img src=\"" + cItem.vcImg + "\"></div>";
                                strHtml += "<div class=\"text\">" + ReplaceChineseImg(cItem.vcContent) + "</div>";
                                strHtml += "</div>";
                                if (cItem.iskeyword == 11) {
                                    strHtml += "<div class=\"trigger-keyword\">【关键词自动回复】</div>";
                                }
                                strHtml += "</div>";
                                strHtml += "</div>";
                            }
                            else if (cItem.snMsgType == 2006)//名片
                            {
                                strHtml += "    <div class=\"right\">";
                                strHtml += "        <div class=\"name\">" + dtTime.format("yyyy-MM-dd hh:mm:ss") + "</div>";
                                strHtml += "        <div class=\"main card\" data-url=\"\">";
                                strHtml += "            <div class=\"wrap\">";
                                strHtml += "                <div class=\"col- 2\">";
                                strHtml += "                    <div class=\"img-box\"><img src=\"" + cItem.vcImg + "\"></div>";
                                strHtml += "                    </div>";
                                strHtml += "                    <div class=\"col-1\">";
                                strHtml += "                        <p class=\"p1\">" + ReplaceChineseImg(cItem.vcTitle) + "</p>";
                                strHtml += "                    </div>";
                                strHtml += "                </div>";
                                strHtml += "                <div class=\"from\">个人名片</div>";
                                strHtml += "            </div>";
                                strHtml += "        </div>";
                            }
                            strHtml += "</li>";


                        }
                        
                        if (isHisMore) {
                            $("#ulHistory").prepend(strHtml);
                        }
                        else {
                            $("#ulHistory").html(strHtml);
                        }
                    }
                }
                else {
                    hasMore = false;
                }

                if (!hasMore) {
                    //隐藏查看更多
                }
              
            },
            error: function () {
            }
        });
    } catch (e) {
        logError("ShowHistory_ex", e.message, inMerchID);
    }
}

var hasMore = true;
function MoreHis() {
    if (hasMore) {
        nPageIndex += 1;
        ShowHistory(true);
    }
}

function GetQuestionNewTime(createtime) {
    var dtTime = new Date(createtime);
    var hour = p(dtTime.getHours());
    var minute = p(dtTime.getMinutes());
    var second = p(dtTime.getSeconds());

    var today = new Date();
    var t = today.getTime() - 1000 * 60 * 60 * 24;
    var yesterday = new Date();
    yesterday.setTime(t);
    var showTime = "";
    if (dtTime.format("yyyy-MM-dd") == yesterday.format("yyyy-MM-dd")) {
        showTime = "昨天";
    }
    else if (dtTime.format("yyyy-MM-dd") == today.format("yyyy-MM-dd")) {
        showTime = hour + ":" + minute;
    }
    else {
        showTime += dtTime.format("MM-dd");
    }
    return showTime;
}

function GetMsgTypeContent(msgtype,title) {
    var khcontent = title;
    if (msgtype == "2002") {
        khcontent = "[图片]";
    }
    else if (msgtype == "2003") {
        khcontent = "[语音]";
    }
    else if (msgtype == "2005") {
        khcontent = "[链接]";
    }
    else if (msgtype == "2006") {
        khcontent = "[名片]";
    }
    return khcontent;
}


//获取消息数据，聊天数据双通
function SQQuestionGet(topic) {
    if ($.cookie('topic') == undefined || $.cookie('topic') == "" || $.cookie('topic') == "undefined" || $.cookie('topic')!=topic) {
        window.location.href = "login.html";
        return;
    }
    try {
        $.ajax({
            url: '/ashx/ServerPushHandler.ashx',
            type: 'POST',
            data: {
                Action: 'GetQuestion', topic: topic
            },
            dataType: 'text',
            async: true,
            cache: false,
            timeout: 60000,
            success: function (res) {
                if (res != "") {
                    eval("res=" + res);
                    if (res[0][0].nResult == "1") {
                        try {
                            var data = DecodeBase64(res[0][0].vcMessage);
                            eval("data=" + data)
                            revmsg(data);
                        }
                        catch (e)
                        {

                        }
                    }
                }
                SQQuestionGet(topic);
            },
            error: function (ex) {
                //logError("SQQuestionGet_error", ex.message + "_" + topic);
                SQQuestionGet(topic);
            }
        });
    }
    catch (e)
    {
        logError("SQQuestionGet_ex", ex.message + "_" + topic);
        SQQuestionGet(topic);          
    }
}
var errorCount = 0;
//心跳检测
/*function OperatorIdle() {
    try {
        $.ajax({
            url: CustomServiceUrl + '/OperatorIdle',
            type: 'POST',
            data: { jsParam: "{\"nId\":\"" + $.cookie('opid') + "\"}" },
            dataType: 'json',
            async: false,
            success: function (result) {
                errorCount = 0;
                //var result = eval(result);
                //if (result.result > 0) {                   
                //}
                //else {                    
                //}
            },
            error: function () {      
                errorCount++;
                if (errorCount > 3) {
                    $.cookie('clientid', '', { expires: -1 });
                    $.cookie('topic', '', { expires: -1 });
                    $.cookie('opid', '', { expires: -1 });
                    $.cookie('sid', '', { expires: -1 });
                    $.cookie('state', '', { expires: -1 });
                    $.cookie('usernames', '', { expires: -1 });
                    $.cookie('merchid', '', { expires: -1 });
                    $.cookie('vcTypeName', '', { expires: -1 });
                    window.location.href = "login.html"
                }
            }
        });
    }
    catch (e) {
        
    }
}*/

var custom_nPageIndex = 1;
var custom_nPageSize = 20;
var custom_nRecordCount = 0;
function LoadCustomList(isMore) {
    if (!isMore)
        custom_nPageIndex = 1;
    var searchKey = $("#txtSearchKey").val();
    $.ajax({
        url: QustionServiceUrl + '/SQCustomList_Get',
        type: 'POST',
        data: { strContext: "{\"nPageIndex\":\"" + custom_nPageIndex + "\",\"nPageSize\":\"" + custom_nPageSize + "\", \"inOpID\":\"" + $.cookie("opid") + "\",\"vcMerChantNo\":'" + $.cookie("merchid") + "',\"vcSearchKey\":'" + searchKey + "'}" },
        dataType: 'json',
        async: false,
        success: function (ds) {
            var ds = eval(ds);
            var strHtml = '';
            if (ds != null && ds.tables.length > 0) {
                custom_nRecordCount = ds.tables[0][0].nCount;
                var dt = ds.tables[1];

                for (var k = 0; k < dt.length; k++) {
                    var item = dt[k];
                    var vcCustomerName = ReplaceImg(item.vcCustomerName, "1");
                    var vcBase64CustomerName = item.vcBase64CustomerName;
                    if (vcBase64CustomerName != "" && vcBase64CustomerName != undefined && vcBase64CustomerName != "undefined") {
                        vcCustomerName = ReplaceBase64Img(vcBase64CustomerName);
                    }
                    var vcCustomHeadimg = item.vcHeadimg;

                    strHtml += '<li onclick="javascript:ClickCustom(this,\'' + item.vcCustomerWxID + '\',\'' + item.vcRobotWxID + '\',\'' + item.vcHeadimg + '\',\'' + item.vcRobotName + '\',\'' + item.vcDeviceNo + '\',\'' + item.vcSerialNo + '\')">';
                    strHtml += '    <a href="javascript:void(0)" class="u-close">x</a>';
                    if (vcCustomHeadimg != "" && vcCustomHeadimg != undefined && vcCustomHeadimg != "undefined")
                        strHtml += '    <div class="img-box"><img src="' + vcCustomHeadimg + '"></div>';
                    else
                        strHtml += '    <div class="img-box"><img src="' + defaultHeadimg + '"></div>';
                    strHtml += '        <div class="txt-box">';
                    strHtml += '            <div class="t1">';
                    strHtml += '                <div class="t1-1">' + vcCustomerName + '</div>';
                    strHtml += '            </div>';
                    strHtml += '            <div class="t2">';
                    strHtml += '                <div class="t2-1">【' + item.vcRobotName + '】</div>';
                    strHtml += '                <div class="t2-2"></div>';
                    strHtml += '            </div>';
                    strHtml += '        </div>';
                    strHtml += '</li>';
                }
            }
            else {
                hasMoreCustom = false;
            }
            if (isMore) {
                $("#ulLeftCustom").html($("#ulLeftCustom").html() + strHtml);
            }
            else {
                $("#ulLeftCustom").html(strHtml);
            }
        },
        error: function () {
        }
    });

}

var hasMoreCustom = true;
function MoreCustomList() {
    if (hasMoreCustom) {
        custom_nPageIndex += 1;
        LoadCustomList(true);
    }
}

var isCustomSendMsg = false;
function ClickCustom(e,CustomerWxID, RobotWxID, Headimg, RobotName, DeviceNo, SerialNo) {
    $("#ulLeftCustom").find("li").removeClass("active");
    $(e).attr("class", "active");
    isCustomSendMsg = true;
    vcCustomerWxID = CustomerWxID;
    vcRobotWxID = RobotWxID;
    vcHeadimg = Headimg;
    vcRobotName = RobotName;
    vcDeviceNo = DeviceNo;
    vcSerialNo = SerialNo;
    inOpId = $.cookie("opid");
    inMerchID = $.cookie("merchid");
    SQCustomSendMsg_GetListByUser(RobotWxID, CustomerWxID, $.cookie("merchid"));
    $("#ulList0").show();

    $("#div_name").html("");
    $("#dtQTime").html("");


}

function SQCustomSendMsg_Insert(RobotWxId, FansWxId, MerChantNo, OpId, MsgType, Content, LinkUrl, LinkImg, Duration, LinkDesc, MsgId) {
    try {
        if (!isCustomSendMsg) {
            return;
        }
        $.ajax({
            url: QustionServiceUrl + '/SQCustomSendMsg_Insert',
            type: 'POST',
            data: {
                strContext: "{\"vcRobotWxId\":\"" + RobotWxId + "\",\"vcFansWxId\":\"" + FansWxId + "\",\"vcMerChantNo\":\"" + MerChantNo + "\",\"inOpId\":" + OpId + ",\"snMsgType\":" + MsgType + ",\"vcContent\":\"" + Content + "\",\"vcLinkUrl\":\"" + LinkUrl + "\",\"vcLinkImg\":\"" + LinkImg + "\",\"inDuration\":" + Duration + ",\"vcLinkDesc\":\"" + LinkDesc + "\",\"vcMsgId\":\"" + MsgId + "\"}"
            },
            dataType: 'json',
            async: false,
            success: function (result) {
                var result = eval(result);
                if (result.result == 1) {
                    $(".popup-reply-txt").popup("hide");
                    //ShowConfirm("温馨提示", "保存成功！");
                    LoadPersonalQuickMsg(inOpId, vcMerChantNo);
                    inTagsId = 0;
                }
                else {
                    ShowConfirm("温馨提示", "保存失败！");
                }
            },
            error: function () {
            }
        });
    }
    catch (e){ }
}

function SQCustomSendMsg_GetListByUser(RobotWxId, FansWxId, MerChantNo) {  
    if ($("#ulList0").length <= 0) {
        $("#ulList").before("<ul class=\"list conversation\" id=\"ulList0\"></ul>");
    }
    $.ajax({
        url: QustionServiceUrl + '/SQCustomSendMsg_GetListByUser',
        type: 'POST',
        data: { strContext: "{\"vcRobotWxId\":\"" + RobotWxId + "\",\"vcFansWxId\":\"" + FansWxId + "\",\"vcMerChantNo\":\"" + MerChantNo + "\"}" },
        dataType: 'json',
        async: false,
        success: function (ds) {
            var ds = eval(ds);
            var strHtml = '';
            if (ds != null && ds.result>0 && ds.tables.length > 0) {
                var dt = ds.tables[0];
                for (var k = 0; k < dt.length; k++) {
                    var item = dt[k];
                    var msgid = item.vcMsgId;
                    var duration = item.inDuration;
                    var desc = item.vcLinkDesc;
                    var img = item.vcLinkImg;
                    var url = item.vcLinkUrl;
                    var content = item.vcContent;
                    var msgtype = item.snMsgType;

                    var qid = 0;
                    var createtime = item.dtCreateDate;
                    var dtTime = new Date(createtime);
                    //dtTime.setTime(createtime);

                    strHtml += "<li class=\"self\"  id=\"li_ms_" + msgid + "\" data_id=\"" + qid + "\" data_msgid=\"" + msgid + "\" data_time=\"" + createtime + "\">";
                    strHtml += "<div class=\"left\">";
                    strHtml += "<div class=\"img-box\"><img src=\"" + defaultKFHeadimg + "\"></div>";
                    strHtml += "</div>";
                    if (msgtype == 2001) {
                        var content = content;
                        try {
                            content = decodeURIComponent(content);
                        } catch (e) {
                            content = content;
                        }
                        b
                       vcTxtContent = ReplaceImg(content);
                                   
                   
                        strHtml += "<div class=\"right\">";
                        strHtml += "<div class=\"name\">" + dtTime.format("yyyy-MM-dd hh:mm:ss") + "</div>";
                        strHtml += "<div class=\"main\">";
                        strHtml += "<div class=\"txt\" style=\"word-wrap:break-word;word-break:break-all;\">" + vcTxtContent + "</div>";                      
                        strHtml += "</div>";
                        strHtml += "</div>";
                    }
                    else if (msgtype == 2002) {
                        strHtml += "<div class=\"right\">";
                        strHtml += "<div class=\"name\">" + dtTime.format("yyyy-MM-dd hh:mm:ss") + "</div>";
                        strHtml += "<div class=\"main\">";
                        strHtml += "<div class=\"img\">";
                        strHtml += "<img src=\"" + content + "\">";
                        strHtml += "</div>";                      
                        strHtml += "</div>";
                        strHtml += "</div>";                        
                    }
                    else if (msgtype == 2003) {
                        var vcContent = content;
                        strHtml += "";
                        strHtml += "<div class=\"right\">";
                        strHtml += "<div class=\"name\">" + dtTime.format("yyyy-MM-dd hh:mm:ss") + "</div>";
                        strHtml += "<div class=\"main\">";                       
                        strHtml += "<div class=\"audio\" data-msgid=\"" + msgid + "\"  id=\"a_" + msgid + "\"  style=\"width: 121px\"><i></i><span>" + duration + "''</span><audio style=\"display:none;\" src=\"" + vcContent + "\"></audio></div>";
                       
                        strHtml += "</div>";
                        strHtml += "</div>";
                    }
                    else if (msgtype == 2004) {
                    }
                    else if (msgtype == 2005) {
                        strHtml += "<div class=\"right\">";
                        strHtml += "<div class=\"name\">" + dtTime.format("yyyy-MM-dd hh:mm:ss") + " </div>";
                        strHtml += "<div class=\"main link\" onclick=\"linkOpen('" + url + "');\">";
                        strHtml += "<div class=\"box-1\">" + ReplaceChineseImg(content) + "</div>";
                        strHtml += "<div class=\"box-2\">";
                        strHtml += "<div class=\"img-box\"><img src=\"" + img + "\"></div>";
                        strHtml += "<div class=\"text\">" + ReplaceChineseImg(desc) + "</div>";
                        strHtml += "</div>";
                        strHtml += "</div>";
                        strHtml += "</div>";                        
                    }
                    strHtml += "</li>";
                }
            }
            $("#ulList0").html(strHtml);
            $("#ulList0").show();
        },
        error: function () {
        }
    });

}