loadingFriend = false;
friendList = Array();

var Friend = {
    // 获取通讯录好友
    getFriend: function (type, group, account_id, keywords, last_id, init) {
        view.req({
            url: 'friend/list',
            data: {
                'type': type,
                'group': group,
                'account_id': account_id,
                'keywords': keywords,
                'last_id': last_id,
            },
            done: function (e) {
                if (init) {
                    friendList = Array();
                }

                var html = '';
                if (e.data.friends.length > 0) {
                    $('#friendsTab').html('');

                    friendList.push.apply(friendList, e.data.friends);
                    e.data.friends = friendList;
                    html = template("friendListTemplate", {data: e.data});
                    $('#searchKeyword').val(e.data.keywords);
                    $('#searchLastId').val(e.data.last_id);
                } else {
                    html = '<p class="text-center text-muted mt-2"> 没有更多了~ </p>';
                    $('#searchLastId').val(0);
                }
                $('#friendsTab').append(html);

                // 更新筛选条件
                $('#searchAccount').html('');
                let account_option = '<option value="0">WS号</option>';
                if (e.data.account_list.length > 0) {
                    account_option += template("searchAccountTemplate", {data: e.data});
                }
                $('#searchAccount').append(account_option);
                $('#searchAccount').selectpicker('refresh');

                setTimeout(function () {
                    $('.bootbox').modal('hide');
                }, 3000);

                loadingFriend = e.data.friends.length > 0 ? false : true;
            }
        });
    },

    // 条件搜索
    friendSearch: function (init) {
        let type = $('#searchType').val();
        let group = $('#searchGroup').val() == '' ? 0 : $('#searchGroup').val();
        let account_id = $('#searchAccount').val() == '' ? 0 : $('#searchAccount').val();
        let keywords = $('#searchKeyword').val();
        let last_id = $('#searchLastId').val() == '' ? 0 : $('#searchLastId').val();

        Friend.getFriend(type, group, account_id, keywords, last_id, init);
    }
};

$(function () {
    var info = {};
    var belong = {};

    Friend.getFriend();

    // 点击索引获取好友
    $('#addressBooksList').on('click', '.letter a', function () {
        var s = $(this).html();
        $("#showLetter span").html(s);
        $("#showLetter").show().delay(500).hide(0);
        window.location.hash = '#' + s + '1';
        var top = $('#addressBooksList').scrollTop();
        $('#addressBooksList').scrollTop(top - 170);
    });

    // 点击索引字母显示
    $('#addressBooksList').on('onMouse', '.showLetter span', function () {
        $("#showLetter").show().delay(500).hide(0);
    });

    // 滚动底部加载更多
    $('#addressBooksList').scroll(function (e) {
        var scroH = $(this).scrollTop(); //滚动高度
        var viewH = $(this).height(); //可见高度
        var contentH = $(this).get(0).scrollHeight; //内容高度

        if ((contentH - viewH - scroH) <= 1  && loadingFriend == false) {
            loadingFriend = true;
            Friend.friendSearch(false);
        }
    });

    // 点击好友列表查看详情
    $('#friendsTab').on('click', '.contacts-item', function () {
        var friend = $(this).find('.contacts-info');
        info = {
            'account-id': friend.data('account-id'),
            'member-id': friend.data('member-id'),
            'wx-account': friend.data('wx-account'),
            'alias': friend.data('alias') == '' ? friend.data('wx-account') : friend.data('alias'),
            'wx-nickname': friend.data('wx-nickname'),
            'type': friend.data('type'),
            'wx-remark': friend.data('wx-remark'),
            'wx-area': friend.data('wx-area'),
            'wx-avatar': friend.data('wx-avatar'),
            'wx-sex': friend.data('wx-sex') == 1 ? '男' : friend.data('wx-sex') == 2 ? '女' : '未知',
            'wx-signature': friend.data('wx-signature'),
            'create-time': friend.data('create-time'),
            'wx-phone': friend.data('wx-phone'),
            'source': friend.data('source'),
        };

        belong = {
            'wxid': friend.data('belong-wxid'),
            'alias': friend.data('belong-alias') == '' ? friend.data('belong-wxid') : friend.data('belong-alias'),
            'nickname': friend.data('belong-nickname'),
        };

        $('.friends .avatar-img').attr('src', info['wx-avatar']);
        $('.friends .wx-nickname').text(info['wx-nickname']);
        $('.friends .wx-phone').text(info['wx-phone']);
        $('.friends .wx-area').text(info['wx-area']);
        $('.friends .wx-sex').text(info['wx-sex']);
        $('.friends .wx-remark').text(info['wx-remark']);
        $('.friends .wx-alias').text(info['alias']);
        $('.friends .wx-signature').text(info['wx-signature']);
        $('.friends .wx-add-time').text(info['create-time']);
        $('.friends .source').text(info['source']);
        if (info['type'] == 3) {
            $('.friends .snsShow').attr('data-account-id', info['account-id']);
            $('.friends .snsShow').attr('data-wxid', info['wx-account']);
            $('.friends .snsShow').show();
        } else {
            $('.friends .snsShow').hide();
        }
        $('.friends .wx-belong').text(belong['nickname'] + '(' + belong['alias'] + ')');

        $(this).siblings('li').removeClass('active');
        $(this).addClass('active');
        $('.friends').show(200);
    });

    // 发起聊天
    $(document).on('click', '.sendMsg', function () {
        let id = info['account-id'];
        let wxid = info['alias'];

        if (!id || !wxid) {
            bootbox.alert({
                message: "参数有误!请刷新重试！",
                size: 'small'
            });
            return false;
        }

        view.req({
            url: "/chat/add",
            type: "get",
            data: {'account_id': id, 'chat_from': wxid},
            done: function (e) {
                window.location.href = "/chat/index";
            }
        });
    });

    // 查看好友朋友圈
    $(document).on('click', '.snsShow', function () {
        let id = $(this).attr('data-account-id');
        let wxid = $(this).attr('data-wxid');

        if (!id || !wxid) {
            bootbox.alert({
                message: "参数有误!请刷新重试！",
                size: 'small'
            });
            return false;
        }
        Account.viewSns(id, wxid, 0)
    });
});