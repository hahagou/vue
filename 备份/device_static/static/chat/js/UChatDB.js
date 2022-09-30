// 2017.11.03
var uchatdb=null;


function UChatDB(uid){
	this.uid=uid;
	this.db=null;
	
	this.Init=function(){
			if(window.openDatabase)
			{
				this.db=openDatabase('uchat_'+uid ,'1.0','uchat',1024*1024*1024);
				if(this.db) {
					//--初始化要用的表
					var initsql=new Array();
					initsql.push(
						'CREATE TABLE IF NOT EXISTS tbVer(inVer INTEGER);'
					);

				    //initsql.push(
				    //	'DROP TABLE tbQuestion;'
				    //);
				    //initsql.push(
				    //	'DROP TABLE tbQuestionDetail;'
				    //);
				    //initsql.push(
				    //	'DROP TABLE tbQuestionSource;'
				    //);
				    //snSource 10:群聊  11：私聊  12公众号
				    //snState 10:未处理的   11： 正在处理   >12
				    //isVip 是不是Vip临时群  10：不是  11：是
					initsql.push(
						'CREATE TABLE IF NOT EXISTS tbQuestion(inID INTEGER PRIMARY KEY,'+
						'inMerchID INTEGER, snSource INTEGER,snState INTEGER,'+
						'vcTitle VARCHAR(4000),'+
						'inNoReadCount INTEGER ,dtCreateTime DATETIME,dtAlloc  DATETIME,' +
						'dtOverTime DATETIME,inOpID VARCHAR(64),isTrans VARCHAR(10),vcNewTitle varchar(4000),dtLastMsgTime DATETIME);'
					);
				
					initsql.push(
						'CREATE INDEX IF NOT EXISTS "IX_tbQuestion" ON "tbQuestion" ("inMerchID" ASC, "inID" ASC);'
					);

				    //snSendType  10:收   11：发
				    //snMsgType 
				    //snIsReturn 是否回传服务器 10:未回传   11：已回传
				    //inFirstPlay 语音是否播放过  10：未播放过  11：已播放过
					initsql.push(
						'CREATE TABLE IF NOT EXISTS tbQuestionDetail('+
						'inQuestion INTEGER,'+
						'inSource INTEGER,vcMsgID VARCHAR(64) PRIMARY KEY,dtCreateTime VARCHAR(64),' +
						'dtSendTime DATETIME, snSendType  INTEGER, snSendState  INTEGER,'+
						'snMsgType INTEGER, vcContent NVARCHAR(8000), vcTitle VARCHAR(256),'+
						'vcUrl VARCHAR(512), vcImg VARCHAR(512), inDuration INTEGER,snIsReturn INTEGER,'+
                        'inFirstPlay INTEGER,iskeyword INTEGER,vcCustomerWxID varchar(200),vcCustomerName varchar(200),'+
                        'vcHeadimg varchar(800),vcBase64CustomerName varchar(400));'
					);
					
					initsql.push(
						'CREATE INDEX IF NOT EXISTS "IX_tbQuestionDetail" ON "tbQuestionDetail" ("inQuestion" ASC, "dtCreateTime" ASC);'
					);
					
					initsql.push(
						'CREATE TABLE IF NOT EXISTS tbQuestionSource('+
						'inQuestion INTEGER PRIMARY KEY,' + 'vcChatRoomID VARCHAR(128),' +
						'vcChatRoomName VARCHAR(256),' + 'vcCustomerWxID  VARCHAR(64),' +
						'vcCustomerName  VARCHAR(64),' + 'vcHeadimg varchar(256),' +
						'vcRobotWxID varchar(64),' + 'vcRobotName varchar(64),' +
                        'base64customername varchar(512),' +
                        'base64chatroomname varchar(512),' + 'vcDeviceNo varchar(50),' +'vcSerialNo varchar(50));'
					);		

					initsql.push(
    					'CREATE INDEX IF NOT EXISTS "IX_tbQuestionSource" ON "tbQuestionSource" ("inQuestion" ASC);'
					);

					this.db.transaction(
						function(tx){
							for(var i=0;i<initsql.length;i++)
							{
								var sql=initsql[i];
								tx.executeSql(
									sql,
									[],
									function(tx,rs){
									},
									function(tx,err){
										//console.log('error.'+err.message);
									}									
								);
							}
//							tx.executeSql(
//								'INSERT INTO tbVer(inVer)VALUES(?)',
//								[(new Date()).getTime()],null,null								
//							);
						}
					);

					
					return(true);
				}
			}else return(false);

		
	}

    //INSERT OR REPLACE INTO
	this.SaveDetail = function (inQuestion, vcMsgID, dtCreateTime, snMsgType, vcContent, vcTitle,
        vcUrl, vcImg, inDuration, snSendType, snIsReturn, inFirstPlay, iskeyword,
        vcCustomerWxID, vcCustomerName, vcHeadimg, vcBase64CustomerName) {
        var sql ='INSERT OR  IGNORE INTO tbQuestionDetail(inQuestion,vcMsgID,dtCreateTime,snMsgType,vcContent,'+
				'vcTitle, vcUrl,vcImg, inDuration,snSendType,snIsReturn,inFirstPlay,iskeyword,vcCustomerWxID, vcCustomerName, vcHeadimg, vcBase64CustomerName)' +
            'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';    
        try {
            var dtTime = new Date();
            dtTime.setTime(dtCreateTime);
            var time = dtTime.format("yyyy-MM-dd hh:mm:ss");
            var sqlQuestion = 'update tbQuestion set dtLastMsgTime="' + time + '" where inid=' + inQuestion + ' and dtLastMsgTime<"' + time + '" ';
            this.ExecuteSql(sqlQuestion);
        }
        catch (e) {
            logError("SaveDetail_ex", e.message, $.cookie('merchid'));
        }
		if(this.db){
			this.db.transaction(function(tx){
				tx.executeSql(
					sql,
					[inQuestion, vcMsgID, dtCreateTime, snMsgType, vcContent, vcTitle, vcUrl, vcImg,
                        inDuration, snSendType, snIsReturn, inFirstPlay, iskeyword, vcCustomerWxID,
					vcCustomerName, vcHeadimg, vcBase64CustomerName],
					null,function(tx,err){
						console.error('SaveDetail.'+err.message);
					}
				);				
			});		
			return(true);
		}else return(false);
	}
	
	//[{"qid":1,"count":2},{"qid":24,"count":20}]
	this.UpdateNoReadCount=function(data){
		var sql='UPDATE tbQuestion SET inNoReadCount=ifnull(inNoReadCount,0)+? WHERE inID=?';
		if(this.db){
			this.db.transaction(function(tx){
				for(var i=0;i<data.length;i++){
					tx.executeSql(
						sql,
						[data[i].count, data[i].qid],
						null,function(t,e){
							console.error('UpdateNoReadCount.'+e.message);
						}
					);
				}
				
			});	
			return(true);
		}else return(false);
	}

	this.ClearNoReadCountById = function (qid) {
	    var sql = 'UPDATE tbQuestion SET inNoReadCount=0 WHERE inID=?';
	    if (this.db) {
	        this.db.transaction(function (tx) {
	            tx.executeSql(
                    sql,
                    [qid],
                    null, function (t, e) {
                        console.error('ClearNoReadCountById.' + e.message);
                    }
                );	           
	        });
	        return (true);
	    } else return (false);
	}
	
	this.SaveQuestion=function(inQid,inMerchID,snSource,dtCreateTime,inOpID, vcTitle, 
        vcChatRoomID, vcChatRoomName, vcCustomerWxID, vcCustomerName, vcHeadimg, vcRobotWxID, vcRobotName, base64customername, base64chatroomname, isTrans, vcNewTitle, vcDeviceNo, vcSerialNo) {
		if(this.db){
            var sqlQuestion = 'INSERT OR IGNORE INTO tbQuestion(inID,inMerchID,snSource,snState,dtCreateTime,inOpID, vcTitle, inNoReadCount,isTrans,vcNewTitle,dtLastMsgTime)VALUES(' +
							'?,?,?,?,?,?,?,(SELECT inNoReadCount+1 FROM tbQuestion WHERE inID=?),?,?,?)';
            var sqlSource ='INSERT OR IGNORE INTO tbQuestionSource(inQuestion,vcChatRoomID,vcChatRoomName,vcCustomerWxID,'+
  					      'vcCustomerName,vcHeadimg, vcRobotWxID,vcRobotName,base64customername,base64chatroomname,vcDeviceNo,vcSerialNo)VALUES(' +
  					      '?,?,?,?,?,?,?,?,?,?,?,?)';
			this.db.transaction(function(tx){
					tx.executeSql(
						sqlQuestion,
                        [inQid, inMerchID, snSource, 10, dtCreateTime, inOpID, vcTitle, inOpID, isTrans, vcNewTitle, dtCreateTime],
						null,function(tx,err){
							console.error('SaveQuestion.'+err.message);
						}
					);
					tx.executeSql(
						sqlSource,
                        [inQid, vcChatRoomID, vcChatRoomName, vcCustomerWxID, vcCustomerName, vcHeadimg, vcRobotWxID, vcRobotName, base64customername, base64chatroomname, vcDeviceNo, vcSerialNo],
						null, null
					);					

			});	
			return(true);
		}else return(false);
	}
    	
	this.ExecSql=function(sql,callback){
		if(this.db){
			this.db.transaction(function(tx){
				tx.executeSql(sql,[],callback);				
			})
		}
	}
	this.ExecuteSql = function (sql) {
	    if (this.db) {
	        this.db.transaction(function (tx) {
	            tx.executeSql(sql,[],null, function (t, e) {
	                console.error('ExecuteSql.' + e.message);
	            });
	        })
	    }
	}
}


function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}


/**
* 返回指定format的string
* format eg:'yyyy-MM-dd hh:mm:ss'
**/
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}