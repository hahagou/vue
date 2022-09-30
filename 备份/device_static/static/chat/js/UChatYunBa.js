// 2017.11.03
var uchatyb=null;

var yunba_config={
	appkey:'5819891349af2025217d2944',
	//server: 'http://sock.yunba.io',
    //port: '3000',
	//server: 'sock-utalk.yunba.io',
    //port: '9998',
	auto_reconnect: true,
};
//var yunba_userinfo={
//	clientid: '94b6bb5ea447afc1dba30023aaa98349',
//	topic:'94b6bb5ea447afc1dba30023aaa98349',
//}

var yunba_userinfo = {
    clientid: '',
    topic: '',
}

function UChatYunBa(cb_subscribe,cb_disconnect){
	var yunba=null;
	this.client_connected=false;
	this.sessionid="";
	this.subscribe_success=false;
	var mqtt_set_alias = function () {
	    yunba.set_alias({ 'alias': yunba_userinfo.topic }, function (data) {
	        if (!data.success) {
	            console.log("yunba.set_alias error" + data.msg);
	        }
	        else {
	            console.info("yunba.set_alias");
	        }
	    });
	    //setInterval(function () {
	    //    yunba.set_alias({ 'alias': yunba_userinfo.topic }, function (data) {
	    //        if (!data.success) {
	    //            console.log("yunba.set_alias error" + data.msg);
	    //        }
	    //        else {
	    //            console.info("yunba.set_alias");
	    //        }
	    //    });
	    //}, 1000 * 60 * 2);
	}
	
	var mqtt_connect=function() {
	    yunba.connect_by_customid(yunba_userinfo.clientid, 
	    function(success, msg, sessionid){
	    	if (success) {
	    		uchatyb.sessionid=sessionid;
	    		uchatyb.client_connected=true;
	    		mqtt_subscribe(yunba_userinfo.topic);
	    	}else{
	    		sessionid='';
	    		this.client_connected=false;
	    		console.error('onnect_by_customid error.'+ msg);
	    	}
	    	
	    });
	}
	
	var mqtt_disconnect=function() {
	  yunba.disconnect(function (success, msg){
			if (success) {
	  			uchatyb.client_connected=false;
	  			uchatyb.subscribe_success=false;
	  			console.log('disconnect');
			} else {
				console.error('disconnect error.' + msg);
			}}
		);
	}		
	
	var mqtt_subscribe = function (topic) {
	    yunba.subscribe({ 'topic': topic }, function (success, msg) {
	        if (success) {
	            uchatyb.subscribe_success = true;
	            console.log('subscribe success.' + topic);
	            if ((cb_subscribe != undefined) && (cb_subscribe != null)) {
	                cb_subscribe();
	            }
	        } else {
	            uchatyb.subscribe_success = false;
	            console.error('subscribe error.' + msg);
	        }
	    });
	    setInterval(function () {
	        yunba.subscribe({ 'topic': topic }, function (success, msg) {
	            if (success) {
	                uchatyb.subscribe_success = true;
	                //console.log('subscribe success.' + topic);
	                if ((cb_subscribe != undefined) && (cb_subscribe != null)) {
	                    cb_subscribe();
	                }
	            } else {
	                uchatyb.subscribe_success = false;
	                console.error('subscribe error.' + msg);
	            }
	        });
	    }, 1000 * 60 * 2);
	}
	
	this.Publish=function(topic,message,cb) {
	    yunba.publish({ 'topic': topic, 'msg': message, 'qos': 2 }, function (success, msg) {
	        if (success) {
	        } else {
	         console.error('publish error.' + msg);
	        }
	        if(cb) cb(success,msg);
	  	}	  	
	  );
	}

	this.Publish_to_alias = function (alias, message, cb) {
	    yunba.publish_to_alias({ 'alias': alias, 'msg': message, 'qos': 2 }, function (success, msg) {
	        if (success) {
	        } else {
	            console.error('publish error.' + msg);
	        }
	        if (cb) cb(success, msg);
	    }
	  );
	}
	
	this.Init=function(rev_callbak){
		if(yunba!=null){
			mqtt_disconnect();
			yunba=null;
		}
		
		yunba=new Yunba(yunba_config);
	    yunba.init(function (success) {
	      if (success) {
	      	//socket connected.

	        if(rev_callbak)  yunba.set_message_cb(rev_callbak);
	        mqtt_connect();
	        mqtt_set_alias();
	      }else{
	      	console.log('disconnect');

  			uchatyb.client_connected=false;
  			uchatyb.subscribe_success=false;	
  			if( (cb_disconnect!=undefined) && (cb_disconnect!=null) )
  			{
  				cb_disconnect();
  			}
  			
	      }
	    });		
	}
	
	
	this.ReConnection = function (topic) {
	    yunba.get_state(topic, function (data) {
	        if (data.success) {
	            console.log("����:" + "topic:" + yunba_userinfo.topic+"," + data.data);
	        } else {
	            //this.Init(revmsg);
	            console.log("�����ߣ�" + "topic:" + yunba_userinfo.topic + "," + data.error_msg);
	        }
	    });
	}
}



    


