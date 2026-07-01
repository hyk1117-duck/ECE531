var video = {
	mdPlayerWidth: {},
	osdArgs: {},
	timeStamp: {},
	mdjson: null, 
	zoomMulit: null, 
	ResolutionMode: null, 
	streamType: null,
	current_streamresolution: null, 
	audiostreamtype: null,
	showLoadingInterval: null,
	upnpInfo: {},
	volumeValInterval: null,
	brightness: {},
	contrast: {},
	saturation: {},
	watcherHeartBeat: null, 
	IEInterval: null,

	init:function(){
		if((conf.ProductType == "NC450") && (conf.isAdmin == 1))
		{
			video.getVelocity();
		}

		if((conf.ProductType == "NC220") ||
		   (conf.ProductType == "NC230") ||
		   (conf.ProductType == "NC250") ||	
		   (conf.ProductType == "NC460") ||	
		   (conf.ProductType == "NC450") ||
		   (conf.ProductType == "NC260"))
		{
			$("#daynight").show();
			video.getDayNight();
		}
		
		video.getVideoArgs();
		video.VideoStart();			
	},
	VideoStart: function(){
		if(typeof common.browserInfo.ie != "undefined" || typeof common.browserInfo.edge != "undefined"){//IE ,edge
			$(".live-view-tips").attr("src","../images/tpcamera_tips.png");
			$("#content-live_view").hide();
			$("#liveview-contain").hide();
			$("#video-control_bar").hide();
			
			$(".liveview-error").show();
		}else{
			if(conf.ProductType == "NC220"){
				$("#livegetimage").attr("src",common.imgsrcVGA+"&&tempid="+Math.random());
			}
			else if(conf.ProductType == "NC230" ||
					conf.ProductType == "NC250" ||
					conf.ProductType == "NC260" ||
					conf.ProductType == "NC450" 
			){
				$("#livegetimage").attr("src",common.imgsrcHD+"&&tempid="+Math.random());
			}	
		}
		video.heartBeat();
		video.watcherHeartBeat = setInterval(function() {
												video.heartBeat();
										}, 600000);	
	},
	VideoStop: function(){
		if(typeof common.browserInfo.ie == "undefined" || typeof common.browserInfo.edge == "undefined" || typeof common.browserInfo.safari != "undefined"){
			$("#livegetimage").attr("src","#");
			video.watcherHeartBeat = clearInterval(video.watcherHeartBeat);
		}
		if(typeof common.browserInfo.safari != "undefined"){
			$("#livegetimage").attr("src","#");
			window.stop();//interrupt all request
		}
	},

	getVelocity : function(){		
		var args = {
				url: "/getPtzVelocity.fcgi",
				success: function(json, response) {
					var json = jQuery.parseJSON(response);
					if (json.errorCode == 0) {
						$("#navigator-velocity-select").val(json.value).change();
					}
				},
				error: function(xhr) {
				}
			}
		common.ajax.init(args);
	},

	changeVelocity : function(value){	
		var args = {
			url: "/setPtzVelocity.fcgi",
			data: {
				value : value
			},
			success: function(json, response) {
				var json = response;
				if (json.errorCode == 0) {
					
				}
			},
			error: function(xhr) {
			}
		}
		common.ajax.init(args);
	},

	Snapshot: function(){
		$("#if-videocut").remove();

		if(conf.ProductType == "NC220"){
			var iframe = "<iframe id='if-videocut' src='"+common.snapshotVGA+"' style='display:none;'>";
		}
		else if(conf.ProductType == "NC230" ||
			    conf.ProductType == "NC250" ||
				conf.ProductType == "NC260" ||
				conf.ProductType == "NC450" 
		){
			var iframe = "<iframe id='if-videocut' src='"+common.snapshotHD+"' style='display:none;'>";
		}

		$("body").append(iframe); 
	},
	setMirrorFlip: function(datas) {
		var args = {
			url: '/setvideoctrls.fcgi',
			data: datas,
			dataType:"json",
			success: function(json) {
				if (json.errorCode == 0) {

				} else {
					plug.window.alert({
						"info": lang.ajax.videoSet.videoFailed
					});
				}
			},
			error: function(xhr) {

			}
		};
		common.setAjax.init(args);
	},
	setDayNight: function(mode) {		
		var args = {
			url: "/daynightconf.fcgi",
			type: 'post',
			data: {
				"daynightmode": mode
			},
			success: function(json) {
				if (json.errorCode == 0) {		
					live_view.daynightDisplay(json.daynightmode);
				} else {
				}
			},
			error: function(xhr) {
			}
		};
		common.ajax.init(args);
	},
	setVideoCtrls:function(setArgs){
		var args = {
			url: '/setvideoctrls.fcgi',
			data: {
				"brightness": setArgs.brightness ,
				"saturation": setArgs.saturation ,
				"contrast": setArgs.contrast
			},
			dataType:"json",
			success: function(json) {
				if (json.errorCode == 0) {				
				}
			},
			error: function(xhr) {
			}
		}
		common.setAjax.init(args);
	},
	backPercent: function(val, min, max) {
		if (min >= 0) {
			return Math.ceil((val / 100) * (max - min) + min);
		} else {
			return Math.ceil((val / 100) * (max - min) + min);
		}
	},
	turnPercent: function(val, min, max) {
		return Math.ceil( (val - min) * ( 100 / (max-min) ) );
	},
	getVideoArgs: function() {
		var args = {
			url: '/getvideoctrls.fcgi',
			data: {
				"all": "any value"
			},
			success: function(json) {
				if (json.errorCode == 0) {
					video.brightness = json.brightness;
					video.contrast = json.contrast;
					video.saturation = json.saturation;		
					video.initVideoBar(json);
				}
			},
			error: function(xhr) {

			}
		}
		common.ajax.init(args);
	},
	initVideoBar:function(json){
		var setting = {
			brightness: video.turnPercent(json.brightness.value,json.brightness.minimum,json.brightness.maximum),
			contrast: video.turnPercent(json.contrast.value,json.contrast.minimum,json.contrast.maximum),
			saturation: video.turnPercent(json.saturation.value,json.saturation.minimum,json.saturation.maximum)
		}
		live_view.videoBar(setting);
	},

	heartBeat: function() {
		var args = {
			url: '/watcherheartbeat.fcgi',
			success: function(response) {
				var json = jQuery.parseJSON(response);
			},
			error: function(xhr) {}
		}
		common.setAjax.init(args);
	},
	resetVideoCtrls: function() {
		var args = {
			url: '/resetvideoctrls.fcgi',
			data: { 
				"brightness": "any value",
				"saturation": "any value",
				"contrast": 10,
				"flip": "",
				"mirror": ""
			},
			success: function(json) {

				if (json.errorCode == 0) {
					video.initVideoBar(json);
				}
			},
			error: function(xhr) {

			}
		}
		common.setAjax.init(args);
	},

	getOSDTimeStamp: function() {
		var args = {
			url: '/getosdandtimedisplay.fcgi',
			success: function(json) {
				if (json.errorCode == 0) {
					if (json.osd_enable == 1) {
						video.osdArgs.enable = true;
						video.osdArgs.str = Base64.decode(json.osd_info);
					} else if (json.osd_enable == 0) {
						video.osdArgs.enable = false;
						video.osdArgs.str = Base64.decode(json.osd_info);
					}
					if (json.time_enable == 1) {
						video.timeStamp.enable = true;
					} else if (json.time_enable == 0) {
						video.timeStamp.enable = false;
					}
				} else {

				}
			},
			error: function(xhr) {

			}
		}
		common.ajax.init(args);
	},
	initOsd: function() {
		try {
			video.playerObj.ShowOSD(video.osdArgs.enable, 10, 9, 0xFFFFFF, video.osdArgs.fontsize, video.osdArgs.str);
			video.playerObj.ShowTime(video.timeStamp.enable, video.timeStamp.positionX, 10, 0xFFFFFF, video.timeStamp.fontsize);
		} catch (error) {}
	},

	getDayNight: function() {
		var args = {
			url: '/daynightconfsettinginit.fcgi',
			success: function(json) {
				if (json.errorCode == 0) {
					live_view.daynightDisplay(json.daynightmode);
				}
			},
			error: function(xhr) {

			}
		}
		common.ajax.init(args);
	}
}