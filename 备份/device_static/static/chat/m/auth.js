var ws = null;
var isAuth = false;
var heart = null;

function conn(server) {
	if (ws != null) {
		return false;
	}
	loading('连接中', '正在尝试连接服务器...');
	ws = new WebSocket(G.server);
	ws.onerror = function (e) {
		ws = null;
		isAuth = false;
		if (heart != null) {
			clearInterval(heart);
		}
		hideLoading();
		alert1('失去连接', '与服务器连接失败', '重连', function () {
			hideAlert1();
			conn();
		});
	};

	ws.onopen = function (e) {
		hideLoading();
		auth();
		setTimeout(function () {
			if (isAuth !== true && ws != null) {
				ws.close();
			}
		}, 10000);

	};

	ws.onmessage = function (e) {
		//console.log(e.data);
		msg(e.data);
	};

	ws.onclose = function (e) {
		ws = null;
		isAuth = false;
		if (heart != null) {
			clearInterval(heart);
		}
		hideLoading();
		alert1('失去连接', '与服务器连接失败', '重连', function () {
			hideAlert1();
			conn();
		});
	}
}

function send(data) {
	ws.send(JSON.stringify(data));
}

function msg(e) {
	try {
		data = JSON.parse(e);
		// console.log('----------msg()中的数据-----------');
		// console.log(data);
	} catch (e) {
		return false;
	}
	if (data.type == 'auth') {
		hideLoading();
		isAuth = data.data.success === true ? true : false;
		if (isAuth === true) {
			heart = setInterval(function () {
				send({"type": "heart"});
			}, 20000);
			initIm();
		} else {
			if (heart != null) {
				clearInterval(heart);
			}
			if (ws != null) {
				ws.close();
			}
		}
	} else if (data.type == 'heart') {

	} else if (data.type == 'chat') {
		if (typeof (data.data.list) != 'undefined' && data.data.list.length != 0) {
			for (var i = 0; i < data.data.list.length; i++) {
				receiveChat(data.data.list[i]);
			}
		}
	}
}

function auth() {
	loading('登录中', '正在登录聊天服务器...');
	var authData = {
		type: 'auth',
		data: {
			"username": G.username,
			"password": G.password
		}
	};
	send(authData);
}


