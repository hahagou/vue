var wxMessage = {
	'template': {
		'message': 		'<li class="``self_class``">' +
							'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="left">' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="img-box"><img src="``from.avatar``"></div>' +
							'</div>' +
							'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="right">' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="name">``from.send_time``</div>' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="main">``item``</div>' +
							'</div>' +
						'</li>',

		'text': 		'<div msg_tag="``msg_tag``" wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="txt" style="word-wrap:break-word;word-break:break-all;">``content``</div>',

		'image': 		'<div msg_tag="``msg_tag``"  wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="img"><img src="``content``" big-src="``big_img_src``" alt=""></div>',

		'faceImage': 	'<div msg_tag="``msg_tag``"  wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="img">' +
							'<img style="background:#fff;border:1px solid #5d5386" big-src="``content``" src="``content``" alt="">' +
						'</div>',

		'video': 		'<div msg_tag="``msg_tag``"  wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="video" data_src="``content``">' +
							'<img src="/static/chat/p.png" width="200px" height="200px">' +
						'</div>',

		'audio': 		'<div msg_tag="``msg_tag``"  wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="audio" style="width: 121px"><i></i><span></span>' +
							'<audio style="display:none;" src="``content``"></audio>' +
						'</div>',

		'card': 		'<li class="``self_class``">' +
							'<div msg_tag="``msg_tag``" wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="left">' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="img-box"><img src="``from.avatar``"></div>' +
							'</div>' +
							'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="right">' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="name">``from.send_time``</div>' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="main">``item``</div>' +
							'</div>' +
						'</li>',

		'hint': 		'<span>``content``</span>',

		'contact': 		'<li lastId="0" belongId="``belong.id``" belongWxId="``belong.wx_id``" belongAlias="``belong.alias``" belongSrc="``belong.avatar``" belongNickname="``belong.nickname``" data-wxid="``from.wx_id``" data-alias="``from.alias``" data-province="``from.province``" data-city="``from.city``" data-sex="``from.sex``" data-nickname="``from.nickname``" data-remark="``from.remark``" data-label="``from.label``" data-order-id="``order.id``" class="wx_friend ``set_top_class``" id="server_order_``order.id``">' +
							'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="img-box sta-unread">' +
								'<span class="``unread_class`` unread_span" data-unread="``unread``"></span>' +
								'<img src="``from.avatar``">' +
							'</div>' +
							'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="txt-box">' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="t1">' +
									'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="t1-1">``from.remark``</div>' +
								'</div>' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="t2">' +
									'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="t2-1"></div>' +
									'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="t2-2"></div>' +
								'</div>' +
							'</div>' +
							'<div class="menu dropup">' +
								'<i class="fa fa-ellipsis-h" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></i>' +
								'<ul class="dropdown-menu">' +
									'<li><a href="javascript:;" class="set_top" id="set_top_``order.id``" data-order-id="``order.id``" data-order-sort="``order.sort``"> ``set_top_text`` </a></li>' +
									'<li><a href="javascript:;" class="set_shield ``shield_class``" id="set_shield_``order.id``" data-order-id="``order.id``" data-shield="``from.shield``" data-account_id="``belong.id``" data-wx_account="``from.wx_id``"> ``set_shield_text`` </a></li>' +
									/*'<li><a href="javascript:;" class=""> 结束该聊天 </a></li>' +*/
								'</ul>' +
							'</div>' +
							'<div class="shield ``set_shield_class``" id="shield_icon_``order.id``"><i class="fa fa-bell-slash" aria-hidden="true"></i></div>' +
						'</li>',

		'contactGroup': '<li lastId="0" belongId="``belong.id``" belongWxId="``belong.wx_id``" belongAlias="``belong.alias``" belongSrc="``belong.avatar``" belongNickname="``belong.nickname``" data-wxid="``room_info.wx_id``" data-province="``room_info.province``" data-city="``room_info.city``" data-sex="``room_info.sex``" data-nickname="``room_info.nickname``" data-remark="``room_info.remark``" data-label="``room_info.label``" data-order-id="``order.id``" class="wx_friend ``set_top_class``" id="server_order_``order.id``">' +
							'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="img-box sta-unread">' +
								'<span class="``unread_class`` unread_span" data-unread="``unread``"></span>' +
								'<img src="``room_info.avatar``">' +
							'</div>' +
							'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="txt-box">' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="t1">' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="t1-1">``room_info.remark``</div>' +
								'</div>' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="t2">' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="t2-1"></div>' +
								'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="t2-2"></div>' +
								'</div>' +
							'</div>' +
							'<div class="menu dropup">' +
								'<i class="fa fa-ellipsis-h" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></i>' +
								'<ul class="dropdown-menu">' +
									'<li><a href="javascript:;" class="set_top" id="set_top_``order.id``" data-order-id="``order.id``" data-order-sort="``order.sort``"> ``set_top_text`` </a></li>' +
									'<li><a href="javascript:;" class="set_shield ``shield_class``" id="set_shield_``order.id``" data-order-id="``order.id``" data-shield="``from.shield``" data-account_id="``belong.id``" data-wx_account="``room_info.wx_id``"> ``set_shield_text`` </a></li>' +
									/*'<li><a href="javascript:;" class=""> 结束该聊天 </a></li>' +*/
								'</ul>' +
							'</div>' +
							'<div class="shield ``set_shield_class``" id="shield_icon_``order.id``"><i class="fa fa-bell-slash" aria-hidden="true"></i></div>' +
						'</li>',

		'inviteGroup': 	'<div class="link_msg">' +
							'<div>``title``</div>' +
							'<div><img src="``thumburl``"/> <small>``desc``</small></div> ' +
							'<button class="btn btn-xs btn-success text-white agreeInviter pull-right ``self_class``" data-url="``link``" account_id="``to.id``">同意加入</button>' +
						'</div>',

		'shareLink': 	'<a href="``link``" target="_blank" class="link_msg">' +
							'<div>``title``</div>' +
							'<div>' +
								'<img src="``thumburl``"/><small>``desc``</small>' +
							'</div>' +
						'</a>',
	},

	'createHtml': function (template, data) {
		return template.replace(/``[a-zA-Z0-9_\.]+``/gi, function (matchs) {
			var keys = matchs.replace(/``/g, '').split('.');
			var val = data;
			for (var i = 0; i < keys.length; i++) {

				//console.log(template);
				if (template == 'text') {
					console.log(val[keys[i]]);
				}
				/*if(val[keys[i]].from.avatar != ''){
				 val[keys[i]].from.avatar = '/static/assets/img/default-avatar.jpg';
				 }*/
				if (typeof (val[keys[i]]) == 'undefined') {
					return '';
				} else {
					val = val[keys[i]];
				}
			}
			return val;
		});
	},

	'getTemplate' : function (message) {
		//console.log(message);
		if (message.type == 1) {			//文字
			var item = wxMessage.template.text;

		} else if (message.type == 2) {		//图片
			var item = wxMessage.template.image;

		} else if (message.type == 3) {		//语音
			var item = wxMessage.template.audio;

		} else if (message.type == 4) {		//语音
			var item = wxMessage.template.audio;

		} else if (message.type == 5) {		//视频
			var item = wxMessage.template.video;

		} else if (message.type == 6) {		//表情
			var item = wxMessage.template.faceImage;

		} else if (message.type == 23) {	//提示
			var item = wxMessage.template.hint;
			return '<li class="``self_class``hint info-text">' + item + '</li>';

		/*} else if (message.type == 42) {	//名片
			var item = wxMessage.template.card;*/

		} else if (message.type == 49) {	//群邀请
			var item = wxMessage.template.inviteGroup;

		} else if (message.type == 50) {	//链接
			var item = wxMessage.template.shareLink;

		} else if (message.type == 52) {	//公众号、订阅号文章消息
			var item = wxMessage.template.shareLink;

		} else {							//其它
			var item = wxMessage.template.text;
		}

		var css = '';
		if (message.is_send == 0) {
			css = 'show';
		}
		// 消息侧边增加按钮
		var more_btn =
			'<div class="warning-btn '+ css +'" title="消息发送失败"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></div>' +
			'<div class="menu dropup">' +
				'<i class="fa fa-ellipsis-h" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></i>' +
				'<ul class="dropdown-menu">' +
					//'<li><a href="javascript:;" class="msg_recall">撤回</a></li>' +
					//'<li><a href="javascript:;" class="msg_resend">重发</a></li>' +
					'<li><a href="javascript:;" class="msg_forward" data-msg_id="``id``">转发</a></li>' +
				'</ul>' +
			'</div>';

		return '<li class="``self_class``">' +
					'<div class="check_msg" id="form">' +
						'<input id="check_``id``" name="msg_check" type="checkbox" value="``id``">' +
						'<label class="" for="check_``id``">' +
							'<i class="fa fa-check"></i>' +
						'</label>' +
					'</div>' +
					'<div wx_msg_id="``wx_msg_id``" chat_from="``from.chat_from``" account_id="``to.id``" class="left">' +
						'<div wx_msg_id="``wx_msg_id``" chat_from="``from.wx_id``" account_id="``to.id``" class="img-box" title="双击头像，拍一拍ta"><img src="``from.avatar``" wx_id="``from.wx_id``" nick_name="``from.nickname``"></div>' +
					'</div>' +
					'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="right">' +
						'<div wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="name">``from.nickname`` ``send_time``</div>' +
						'<div msg_tag="``msg_tag``" wx_msg_id="``wx_msg_id``" chat_from="``chat_from``" account_id="``account_id``" class="main">' + more_btn + item + '</div>' +
					'</div>' +
				'</li>';
	},

	'drawMessage': function (message) {
		var html = '';
		for (var i = 0; i < message.length; i++) {
			var template = wxMessage.getTemplate(message[i]);
			html += wxMessage.drawMessageItem(template, message[i]);
		}
		return html;
	},

	'drawMessageItem': function (template, message) {
		if (typeof (message.room_from) != 'undefined' && message.room_from.length != 0) {
			message.room_info = message.from;
			message.from = message.room_from;
		}
		if (message.from.avatar == "") {
			message.from.avatar = "/static/assets/img/default-avatar.jpg";
		}
		if (typeof (message.account_id) == 'undefined' && message.hasOwnProperty('order')) {
			message.account_id = message.order.account_id;
		}
		if (typeof (message.chat_from) == 'undefined' && message.hasOwnProperty('order')) {
			message.chat_from = message.order.chat_from;
		}
		return wxMessage.createHtml(template, message);
	},

	'drawContact': function (contact) {
		var html = '';
		for (var i = 0; i < contact.length; i++) {
			if (typeof (contact[i].room_from) != 'undefined' && contact[i].room_from.length != 0) {
				var template = wxMessage.template.contactGroup;
			} else {
				var template = wxMessage.template.contact;
			}
			// console.log(contact[i]);
			contact[i].unread_class = contact[i].unread == 0 ? '' : 'unread';
			contact[i].shield_class = "hide";
			contact[i].set_top_text = '置顶聊天';
			contact[i].set_top_class = '';
			contact[i].set_shield_text = contact[i].from.shield == 0 ? '屏蔽消息' : '取消屏蔽';
			contact[i].set_shield_class = contact[i].from.shield == 0 ? 'hide' : '';

			if (contact[i].order) {
				contact[i].set_top_text = contact[i].order.sort == 0 ? '置顶聊天' : '取消置顶';
				contact[i].set_top_class = contact[i].order.sort == 0 ? '' : 'top'
			}
			if (contact[i].from.nickname == "") {
				contact[i].from.nickname = "未命名";
			}
			if (contact[i].from.remark == "") {
				contact[i].from.remark = contact[i].from.nickname;
			}
			if (contact[i].from.avatar == "") {
				contact[i].from.avatar = "/static/assets/img/default-avatar.jpg";
			}
			if (contact[i].from.wx_id.indexOf("@") != -1) {
				contact[i].shield_class = '';
			} else {
				contact[i].set_shield_class = 'hide';
			}

			// console.log('----------渲染模板的数据contact-----------');
			// console.log(contact[i]);
			html += wxMessage.drawMessageItem(template, contact[i]);
			// console.log('----------新消息返回的html-----------');
			// console.log(html);
		}
		return html;
	},

	'drawContactItem': function (template, contact) {
		return wxMessage.createHtml(template, contact);
	}
};