$(document).ready(function() {
	common.cloudUrl();
		
	common.IE7hack();
	common.streamPort();
	common.init();
})

var HTTP_M_POST 			= "post";
var HTTP_M_GET 				= "get";
var DAYNIGHTMODE_AUTO 		= 1;
var DAYNIGHTMODE_DAY_MODE 	= 2;
var DAYNIGHTMODE_NIGHT_MODE = 3;
var STREAMTYPE_H264 		= 2;
var STREAMRESOLUTION_VGA 	= 0;		// 640*480
var STREAMRESOLUTION_QVGA 	= 1;		// 320*240

var AUDIOSTREAMTYPE_AAC		= 2;

var current_streamresolution = STREAMRESOLUTION_VGA;
//var IsAudioOff = false;
var LIVE_VIEW_ENABLE = false;
var LIVE_VIEW_DISABLE = true;
var LIVE_VIEW_FLAG = LIVE_VIEW_ENABLE;
var MOTION_LIVE_VIEW_FLAG = LIVE_VIEW_ENABLE;

var PRODUCT_TYPE = {
	NC200 : 0,
	NC220 : 1,
	NC250 : 2,
	NC450 : 3,
	NC350 : 4
}
var isChrome = false;

var common = {
	URL : null,
	productType : "NC220",
	browserName: null, //浏览器类型
	playerObj: null,
	playerWidth: {},
	mdPlayerWidth: {},
	playerPort: null,
	pluginFlag: null, //视频插件是否存在
	osdArgs: {},
	timeStamp: {},
	mdjson: null, //motiondetection回传的json
	zoomMulit: null, //放大倍数
	ResolutionMode: null, //视频制式VGA/QVGA
	showLoadingInterval: null,
	upnpInfo: {}, //upnp访问IP及端口
	recordFlag: null, //是否在录像
	pluginUpdataPath: {}, //插件更新路径
	volumeValInterval: null, //声音检测获取
	brightness: {},
	contrast: {},
	saturation: {},
	watcherHeartBeat: null, //观看模式心跳包，维持会话
	width: 640,
	isUnusable:function () {
		// body...
		var browserTypeVersion = (function(){
		var ua= navigator.userAgent, tem, 
		M= ua.match(/(opera|chrome|safari|firefox|msie|edge|trident(?=\/))\/?\s*(\d+)/i) || [];
		if(/trident/i.test(M[1])){
		    tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
		    return 'IE '+(tem[1] || '');
		}
		if(M[1]=== 'Chrome'){
		    tem= ua.match(/\bOPR\/(\d+)/);
		    if(tem!= null) return 'Opera '+tem[1];
		    tem = ua.match(/Edge\/(\d+)/);
		    if(tem!= null) return 'Edge '+tem[1];
		}
		M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
		return M.join(' ');
		})();
		var browser = browserTypeVersion.split(" ");
		return (browser[0] == "Chrome" && parseInt(browser[1]) >= 42) || browser[0].indexOf("Edge") >= 0;
	},

	cloudUrl : function(){
		
		var args = {
			url: '/getcloudurl.fcgi',
			success: function(json) {
				if (json.errorCode == 0) {
					common.URL = json.cloudweburl;
					// $("#workMode").val(json.workMode);
					// plug.select.initial($("body"));
				}
			},
			error: function(xhr) {
				common.URL = ipc.tplinkcloud.com;
			}
		}
		common.ajax.init(args);
		
		// $("#workMode").bind({
		// 	change : function(){
		// 		var args = {
		// 			url: '/setcloudurl.fcgi',
		// 			data: { 
		// 				token: $("#token").attr("value"),
		// 				workMode:$("#workMode").val() 
		// 			},
		// 			success: function(json) {
		// 				if (json.errorCode == 0) {
		// 					common.URL = json.cloudweburl;
							
		// 				} else {
							
		// 				}
		// 			},
		// 			error: function(xhr) {

		// 			}
		// 		}
		// 		common.ajax.init(args);
		// 	}
		// });
	},
	init: function() {
		common.videomanages.init();
		common.multiple.init();
		common.soundDetection.init();
		common.logout.init();
		plug.button.init($("body"));
	},
	checkInput: function(obj,reg){		
		var regu = reg;
		var value = obj.value;
		var re = new RegExp(regu);
		if (re.test(value)) {
			obj.value=value.replace(reg,'');
		}
	},
	checkInputUseRegularExp: function(string,reg){
		var regu = reg;
		var re = new RegExp(regu);
		if(re.test(string)){
			return false;
		}
		return true;
	},
 	afterPlugInitBind: function() {
		$("#resolution-readjust-out .plugin-select").bind({
			mousedown: function(e) {
				common.multiple.recordBreak();
			}
		});
	},
	resize: function() {
		$(window).resize(function() {

		});
	},
	IE7hack: function() {
		if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE7.0") {
			$("#indexsideover").remove();
			$("#htmlsp1").remove();
		}
	},
	streamPort: function() {
		common.playerPort = 8080;
		if (location.search.indexOf("?streamPort=") == 0) {
			common.playerPort = Number(location.search.split("?streamPort=")[1]) || 8080;
		}
	},
	detectBrowser: function() {
		var windows = (navigator.userAgent.indexOf("Windows", 0) != -1) ? 1 : 0;
		var mac = (navigator.userAgent.indexOf("Mac", 0) != -1) ? 1 : 0;
		var $target = $("#downloadplugin")
		if (windows) {
			if (common.browserName == "Microsoft Internet Explorer") {
				if (navigator.userAgent.indexOf("x64") != -1) {
					return "ie_x64";
				}else{				
					return "ie_x86";
				}
			} else {
				if (navigator.userAgent.indexOf("x64") != -1) {
					return "ff_x64";
				}else{				
					return "ff_x86";
				}
			}
		}
		if (mac) {
			return "mac";
		}
	},
	DetectPluginDownloadUrl: function() {
		var args = {
			url: "https://" + common.URL + "/init2.php",
			dataType: "jsonp",
			data: {
				"REQUEST": "COMMONUPDATE"/*'PLUGINUPDATE'*/,
				"DATA": {
					"OS": common.detectBrowser(),
					"Version": common.playerObj.version || "0.0.1",
					"Model" : common.productType
				}
			},
			success: function(json, response) {
				var json = response;
				if (json.errorCode == 0) {
					window.location.href = json.msg;
				}
			},
			error: function(xhr) {
				plug.window.alert({
					"info": lang.html.cloud.disconnect2
				})
			}
		}
		common.ajax.init(args);
	},
	isIe: function() {
		var userAgent = navigator.userAgent,
			　　rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
		var ua = userAgent.toLowerCase();　　
		var match = rMsie.exec(ua);　　
		if (match != null) {　
			return "Microsoft Internet Explorer";
		}
	},
	ajax: {
		init: function(args) {
			var ajaxurl = args.url,
				ajaxtype = args.type || 'post',
				ajaxdataType = args.dataType || 'text',
				ajaxdata = args.data,
				ajaxcache = args.cache || false,
				ajaxcontentType = args.contentType || 'application/x-www-form-urlencoded;charset=utf-8',
				ajaxtimeout = args.timeout || 0,
				ajaxasync = args.async || true,
				ajaxglobal = args.global || false,
				ajaxBeforeSend = args.beforeSend || function() {},
				ajaxsuccess = args.success || function() {},
				ajaxerror = args.error || function() {},
				ajaxcomplete = args.complete || function() {};
			$.ajax({
				url: ajaxurl,
				type: ajaxtype,
				dataType: ajaxdataType,
				data: ajaxdata,
				cache: ajaxcache,
				contentType: ajaxcontentType,
				timeout: ajaxtimeout,
				async: ajaxasync,
				global: ajaxglobal,
				beforeSend: function() {
					ajaxBeforeSend();
				},
				success: function(response) {
					try {
						var json = jQuery.parseJSON(response);
						if (json.errorCode == 902) {
							location.href = "/login.html";
						}
					} catch (error) {}
					ajaxsuccess(json, response);
				},
				statusCode: {
					403: function() {
						location.href = "/login.html"
					}
				},
				complete: function(xhr) {
					ajaxcomplete(xhr);
				},
				error: function(xhr) {
					var continueError = ajaxerror(xhr);

					return false;
				}
			});
		}
	},
	setAjax: {
		init: function(args) {
			var ajaxurl = args.url,
				ajaxtype = args.type || 'post',
				ajaxdataType = args.dataType || 'text',
				ajaxdata = args.data || {},
				ajaxcache = args.cache || false,
				ajaxcontentType = args.contentType || 'application/x-www-form-urlencoded;charset=utf-8',
				ajaxtimeout = args.timeout || 0,
				ajaxasync = args.async || true,
				ajaxglobal = args.global || false,
				ajaxBeforeSend = args.beforeSend || function() {},
				ajaxsuccess = args.success || function() {},
				ajaxerror = args.error || function() {},
				ajaxcomplete = args.complete || function() {};
			ajaxdata.token = $("#token").attr("value");
			$.ajax({
				url: ajaxurl,
				type: ajaxtype,
				dataType: ajaxdataType,
				data: ajaxdata,
				cache: ajaxcache,
				contentType: ajaxcontentType,
				timeout: ajaxtimeout,
				async: ajaxasync,
				global: ajaxglobal,
				beforeSend: function() {
					ajaxBeforeSend();
				},
				success: function(response) {
					try {
						var string = common.validatedSign.reconstruct(response);
						var json = jQuery.parseJSON(string);
						common.validatedSign.changeVal(json.token);
						if (json.errorCode == 902) {
							location.href = "/login.html";
						} else if (json.errorCode == 903) {
							plug.window.alert({
								"info": lang.ajax.ajaxError
							})
						}
					} catch (error) {}
					ajaxsuccess(json, string);
				},
				complete: function(xhr) {
					ajaxcomplete(xhr);
				},
				statusCode: {
					403: function() {
						location.href = "/login.html"
					}
				},
				error: function(xhr) {
					ajaxerror(xhr);
					//	return false;
				}
			});
		}
	},
	validInfo: function(strIn) {
		if (strIn.pass == true) {
			return true;
		} else {
			strIn.str ? plug.window.alert({
				"info": strIn.str
			}) : null;
			return false;
		}
	},
	showLoadingStart: function(holder, text) {
		holder.text(text);
		common.showLoadingInterval = setInterval(function() {
			holder.text(holder.text() + ".");
			holder.text() == text + "......" ? holder.text(text) : null;
		}, 500)
	},
	showLoadingEnd: function(holder, text) {
		var text = text || "";
		holder.text(text);
		common.showLoadingInterval = clearInterval(common.showLoadingInterval);
	},
	validatedSign: {
		init: function() {
			var a = "";
			a += "<div class='validatedsign' style='display:none'>",
			a += "</div>";
			$(".contanbody-aside-metro-inner").append(a);
			common.validatedSign.changeVal(location.href.split("?")[1]);
		},
		changeVal: function(sign) {
			$("#token").attr("value", sign);
		},
		reconstruct: function(string) {
			var jsonString = string.replace(/}&&{/g, ",");
			return jsonString;
		}
	},
	show: {
		showMonitor: function() {
			$(".containbody-main-inner-child").hide();
			$(".setting-contain-cell").hide();
			$("#videoManages").show();
			
			$("#videozoom").trigger("click","stay");//.click();
			
			setTimeout("common.videomanages.start()", 1);
		},
		showStatus: function() {
			$(".containbody-main-inner-child").hide();
			$("#status").show();
		},
		showSetting: function() {
			$(".containbody-main-inner-child").hide();
			$("#setting").show();
		},
		showBasic: function() {
			common.show.showSetting();
			$("#title-advanced").css("border-top", "1px solid #E0E0E0");
			$(".title-setting-child .setting-status-metro").click();
		},
		showCloud: function() {
			common.show.showSetting();
			$(".setting-contain-cell").hide();
			$(".setting-contain-cloud").show();
		},
		showAdvanced: function() {
			common.show.showSetting();
			$("#title-tool").css("border-top", "1px solid #E0E0E0");
			$(".title-advanced-child .setting-status-metro").click();
		},
		showTool: function() {
			common.show.showSetting();
			$("#setting-usermanage-metro").click();
		}
	},
	multiple: {
		init: function() {
			common.multiple.bind();
		},
		bind: function() {
			$("a").bind({
				mouseover: function() {
					$(this).css({
						"color": "#047DD8",
						"text-decoration": "underline"
					});
				},
				mouseleave: function() {
					$(this).css({
						"color": "#000",
						"text-decoration": "none"
					});
				}
			});
			$(".setting-title").bind({
				mouseenter: function() {
					$(this).addClass("setting-title-hover");
				},
				mouseleave: function() {
					$(this).removeClass("setting-title-hover");
				},
				click: function() {
					$(".setting-title").removeClass("setting-title-selected");
					$(this).addClass("setting-title-selected");
				}
			});
			$(".titlenav").bind({
				mouseenter: function() {
					$(this).addClass("titlenav-hover");
				},
				mouseleave: function() {
					$(this).removeClass("titlenav-hover");
				},
				click: function() {
					
					if($(this).attr("id")=="setting-motionalarm-metro"){
						MOTION_LIVE_VIEW_FLAG = LIVE_VIEW_ENABLE
					}else{
						MOTION_LIVE_VIEW_FLAG = LIVE_VIEW_DISABLE;
					}
					
					$(".titlenav").removeClass("titlenav-selected");
					$(this).addClass("titlenav-selected");
					$(".setting-contain-cell").css({
						"display": "none"
					});
					var holder = ".setting-contain-" + $(this).attr("name").split("-")[1];
					$(holder).css({
						"display": "block"
					});
					/*************声音监测：当离开该页面时停止声音获取************/
					common.volumeValInterval = clearInterval(common.volumeValInterval);
					/*************************/
					if (common.browserName == "Microsoft Internet Explorer") {
						if (common.pluginFlag == 1) {
							common.playerObj.StopVideo();
							common.playerObj.StopAudio();
							var obj = document.getElementById("mdplugin");
							obj.StopVideo();
							return false;
						}

					} else if ($.browser.mozilla && Number(navigator.userAgent.split("Firefox/")[1]).toFixed(0) == 14) {
						common.playerObj.StopVideo();
						common.playerObj.StopAudio();
						var obj = document.getElementById("mdplugin");
						obj.StopVideo();
						return false;
					}

				}
			});
			
			$("#p1FrameRate").bind({
				change : function(){
					var val_arr = [30,25,20,15,10];
					var current_val = $("#p1FrameRate").val();					
					var p2FrameRateVal = $("#p2FrameRate").val();
					
					//$("#p2FrameRate").html("<option value='30' id='rateDisappear-30'>30FPS</option><option value='20' id='rateDisappear-20'>20FPS</option><option value='15' id='rateDisappear-15'>15FPS</option><option value='10' id='rateDisappear-10'>10FPS</option><option value='5' id='rateDisappear-5'>5FPS</option>");
					$("#p2FrameRate").html("<option value='15' id='rateDisappear-15'>15FPS</option><option value='10' id='rateDisappear-10'>10FPS</option><option value='5' id='rateDisappear-5'>5FPS</option>");					
					for(var i = 0 ;i < 5; i++){
						if( val_arr[i] > current_val ){
							$("#rateDisappear-"+val_arr[i]).remove();
						}
						if( val_arr[i] == p2FrameRateVal ){
							$("#rateDisappear-"+val_arr[i]).attr("selected","selected")
						}
					}
					
					plug.select.initial($("#p2FrameRate").parent());
				}
			});
			
			$("body").click(function(){
				$("#daylist").hide();	  
			});
			
			$(".titlenavx").bind({
				mouseenter: function() {
					$(this).addClass("titlenav-hover");
				},
				mouseleave: function() {
					$(this).removeClass("titlenav-hover");
				},
				click: function() {
					if (common.multiple.recordBreak() == true) {
						var $holder = $(this);
						if (!$holder.hasClass("titlenavx-selected")) {
							$(".titlenavx").removeClass("titlenavx-selected");
							$(".title-img").removeClass("title-img-selected");
							$holder.addClass("titlenavx-selected");
							$(".titlenavx").css("border-top", "none")
							$(".title-children").slideUp("fast");
							$("." + $(".titlenavx-selected").attr("id") + "-child").slideDown("fast");
							$(".titlenav-border").hide();
							$holder.children(".titlenav-border").show();
							$holder.children(".title-img").addClass("title-img-selected");
							if (common.browserName == "Microsoft Internet Explorer") {
								if (common.pluginFlag == 1) {
									common.playerObj.StopVideo();
									common.playerObj.StopAudio();
									var obj = document.getElementById("mdplugin");
									obj.StopVideo();
								}
							} else if ($.browser.mozilla && Number(navigator.userAgent.split("Firefox/")[1]).toFixed(0) == 14) {
								common.playerObj.StopVideo();
								common.playerObj.StopAudio();
								var obj = document.getElementById("mdplugin");
								obj.StopVideo();
							}
						}
						var id = $holder.attr("id")
						if (id == "title-videoManages") {
							LIVE_VIEW_FLAG = LIVE_VIEW_ENABLE;
							common.show.showMonitor();
						} else if (id == "title-setting") {
							LIVE_VIEW_FLAG = LIVE_VIEW_DISABLE;
							common.show.showBasic();
						} else if (id == "title-advanced") {
							LIVE_VIEW_FLAG = LIVE_VIEW_DISABLE;
							common.show.showAdvanced();
						} else if (id == "title-tool") {
							LIVE_VIEW_FLAG = LIVE_VIEW_DISABLE;
							common.show.showTool();
						}
						common.watcherHeartBeat = clearInterval(common.watcherHeartBeat);

					}
					return false;
				}
			});
			$("#title-videoManages").bind({
				click: function() {
					$(".title-children").hide();
					$(".title-videoManages-child-x").fadeIn();
				}
				// dblclick: function(){
				// 	$(".select-workMode").show();	
				// }
			});
		},
		recordBreak: function() {
			if (common.recordFlag == 1) {
				var r = confirm(lang.info.recordInterrupt);
				if (r == true) {
					common.videomanages.recordStop();
					return true;
				} else {
					return false;
				}
			}
			return true;
		}
	},
	randomString: function(length) {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

		if (!length) {
			length = Math.floor(Math.random() * chars.length);
		}

		var str = '';
		for (var i = 0; i < length; i++) {
			str += chars[Math.floor(Math.random() * chars.length)];
		}
		return str;
	},
	videomanages: {
		init: function() {
			common.videomanages.bind();
			common.videomanages.getVideoSetting("init");
			common.videomanages.getDayNight();
			common.videomanages.getVideoArgs();
			common.videomanages.getOSDTimeStamp();
			
			setTimeout("common.videomanages.launch(640, 480);$('#title-videoManages').click();",1);
		},
		launch: function(width, height) {
			//try{
			common.browserName = common.isIe();
			common.pluginUpdataPath.count = 1;
			var mdplugin = document.getElementById("mdplugin");
			isChrome = common.isUnusable();
			//mdplugin.SetMDAreaIsEnablenew(1);
			
			if (common.browserName == "Microsoft Internet Explorer") {
				$(".tppluginff").remove();
				common.playerObj = document.getElementById("tpplugin");
				if (navigator.userAgent.indexOf("MSIE 7.0") > 0) {
					try {
						common.playerObj.width = width;
					} catch (error) {
						common.videomanages.downloadTips();
					}
				}
				$("#tppluginfont").show();
				common.playerObj.width = width;
				common.playerObj.height = height;
				common.pluginFlag = common.videomanages.detectionIEplugin();
			}else {
				$(".tppluginie").remove();
				common.playerObj = document.getElementById("tpplugin");
				// common.playerObj.width = width;
				// common.playerObj.height = height;
				//	$("#tpplugin").width(width);
				//	$("#tpplugin").height(height);
				var a = "";
				a += "<OBJECT id='tpplugin' width='" + width + "' height='" + height + "' type='application/x-tp-camera-h264'>",
										
				a += "<param name='wmode' value='transparent'>";  
				a += "</OBJECT>";
				$("#objectplayer").html(a);
				common.pluginFlag = common.videomanages.detectionPlugin();

			}

			if(isChrome) {
				$("#videoobject").css("display","none");
				$("#controlpanel").css("display","none");
				$(".video-ctrl-state").css("display","none");
				$("#chromealert").css("display","block");
			}

			common.playerWidth.width = width;
			common.playerWidth.height = height;
			if (mdplugin) {
				mdplugin.width = width;
				mdplugin.height = height;
			}

			common.playerObj = document.getElementById("tpplugin");
			common.videomanages.start();
			//}catch(error){}
			
			//mdplugin.SetMDAreaIsEnablenew(1);
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
		detectionIEplugin: function() {
			if (typeof common.playerObj.PlayVideo == "unknown") {
				return 1;
			} else {
				return 0;
			}
		},
		detectionPlugin: function() {
			var mimetype = navigator.mimeTypes["application/x-tp-camera-h264"];
			if (mimetype) {
				var plugin = mimetype.enabledPlugin;
				if (plugin) {
					return 1;
				} else {}
			} else {
				return 0;
			}
		},
		DetectIePluginUpdata: function() {
			if (common.pluginUpdataPath.count == 1) {
				common.pluginUpdataPath.count = 0;
				var args = {
					url: "https://"+ common.URL +"/init2.php",
					dataType: "jsonp",
					data: {
						"REQUEST": "COMMONUPDATE"/*'PLUGINUPDATE'*/,
						"DATA": {
							"OS": common.playerObj.ostype,
							"Version": common.playerObj.iepluginversion,
							"Model" : common.productType
						}
					},
					success: function(json, response) {
						var json = response;
						if (json.errorCode == 0) {
							plug.window.confirm({
								"info": lang.info.update,
								"width": 408,
								"btnConfirm": lang.plug.Download,
								"btnCancel": lang.plug.Cancel,
								"confirm": function() {
									window.location.href = json.msg;
								}
							});
						}
					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
			}

		},
		DetectPluginUpdata: function() {
			if (common.pluginUpdataPath.count == 1) {
				common.pluginUpdataPath.count = 0;
				var args = {
					url: "https://"+ common.URL +"/init2.php",
					dataType: "jsonp",
					data: {
						"REQUEST": "COMMONUPDATE"/*'PLUGINUPDATE'*/,
						"DATA": {
							"OS": common.playerObj.ostype,
							"Version": common.playerObj.version,
							"Model" : common.productType
						}
					},
					success: function(json, response) {
						var json = response;
						if (json.errorCode == 0) {
							plug.window.confirm({
								"info": lang.info.update,
								"width": 408,
								"btnConfirm": "Download",
								"btnCancel": "Cancel",
								"confirm": function() {
									window.location.href = json.msg;
								}
							});
						}
					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
			}

		},
		initPluginInfo: function() {
			var obj = document.getElementById("tpplugin");
			obj.ip = location.hostname;
			obj.port = common.playerPort;
			obj.streamtype = STREAMTYPE_H264;
			obj.streamresolution = current_streamresolution;
			obj.audiostreamtype = AUDIOSTREAMTYPE_AAC;
			obj.devname = main.cameraName || "ipcamera";
						
					
						
			var isip = valid.ip(location.hostname);
			if (common.upnpInfo.port) {
				if (isip.pass != true || location.hostname == common.upnpInfo.ip || location.hostname == common.upnpInfo.noip || location.hostname == common.upnpInfo.dyndns || location.hostname == common.upnpInfo.cmxaction) {
					obj.ip = common.upnpInfo.ip;
					obj.port = common.upnpInfo.port;
				}
			}
			
			obj.recordcb = common.videomanages.recordStart;
			
			if (common.browserName == "Microsoft Internet Explorer"){
				obj.recordcbinvoke(function e(result){
					if (result == 0) {
						common.videomanages.recordingShow();//admin.recordingShow();
					} else if (result == 1) {
						common.videomanages.recordStop();//admin.recordStop();
					} else if (result == 2) {// network break up
						common.videomanages.recordStop();//admin.recordStop();
						plug.window.alert({
							"info": lang.info.recordInterrupted
						});
					} else if (result == 3) {
						common.videomanages.recordStop();//admin.recordStop();
						plug.window.alert({
							"info": lang.info.recordDiskFull
						});
					}		
				});
			}
			
			obj.snapshotcb = common.videomanages.snapshotStart;			
			
			obj.username = $("#n").attr("value");
			obj.password = /*Base64.decode()*/$("#sec").attr("value");
		},
		snapcallback: function(rtn) {},
		initMd: function() {
			common.playerObj.MotionDetection(Number(common.mdjson.is_enable), Number(common.mdjson.precision)); //灵敏度设置	
			for (var i = 1; i <= 25; i++) {
				common.playerObj.SetMotionDetectionRegionnew(i, common.mdjson.area[i - 1]); //开启侦测区域
			}
			//common.playerObj.SetMotionDetectionEditMode(0); //侦测关闭	
		},
		initOsd: function() {
			try {
				common.playerObj.ShowOSD(common.osdArgs.enable, 10, 9, 0xFFFFFF, common.osdArgs.fontsize, common.osdArgs.str);
				common.playerObj.ShowTime(common.timeStamp.enable, common.timeStamp.positionX, 10, 0xFFFFFF, common.timeStamp.fontsize);
			} catch (error) {}
		},
		initAudio: function() {
			if ($.cookie("audiooff") == "off") {
			//if(IsAudioOff == true){
				var volume = $.cookie("audiovalue") || 100;
				$(".volume-bar").slider("value", 0);
				common.videomanages.setVolume(0);
				$("#videovolumestop").show();
				$("#videovolumestart").hide();
			} else {
				if (!$.cookie("audiovalue")) {
					$.cookie("audiovalue", 0)
				}
				var volume = $.cookie("audiovalue")
				$(".volume-bar").slider("value", volume);
				common.videomanages.setVolume(volume);
				$("#videovolumestop").hide();
				$("#videovolumestart").show();
			}
		},
		initStart: function() {
				
			try {
				if (common.pluginFlag == 1) {
					setTimeout(function() { //等待控件出现在页面上才能初始化
						
						if(LIVE_VIEW_FLAG){return;}
						
						common.videomanages.initPluginInfo();
						if (common.browserName != "Microsoft Internet Explorer") {
							common.videomanages.initOsd();
						}
						try {
							common.playerObj.PlayVideo();
							common.playerObj.PlayAudio();
							common.videomanages.initAudio();						
						} catch (error) {
							if ($("#videoManages").css("display") != "none") {
								common.videomanages.initStart();
							}
						}
						if (common.browserName == "Microsoft Internet Explorer") {
							setTimeout(function() {
								common.videomanages.initOsd();
							}, 200)
						}
						setTimeout(function() {
							if (common.browserName != "Microsoft Internet Explorer") {
								common.videomanages.DetectPluginUpdata();
							} else {
								common.videomanages.DetectIePluginUpdata();
							}
							
						}, 2000)
					}, 1000);
					if(!isChrome){
						$("#controlpanel").show();
						$(".video-ctrl-state").show();
						$(".video-size-ctrl").show();
					}
				} else {
					if(!isChrome){
						common.videomanages.downloadTips();
					}
				}
			} catch (error) {}
		},
		downloadTips: function() {
			plug.window.confirm({
				"info": lang.ajax.pluginUninstall,
				"btnConfirm": lang.plug.Download,
				"btnCancel": lang.plug.Cancel,
				"confirm": function() {
					common.DetectPluginDownloadUrl();
				}
			});
			$("#controlpanel").show(); // disable some buttons?
			$(".video-ctrl-state").show();
			$(".video-size-ctrl").show();
		},
		refreshImage: function() {
			var imgSrc = "/snapshot.fcgi?_s=" + common.randomString(10);
			$("#objectplayer").html("<img src='" + imgSrc + "' />");
		},
		start: function() {
			
			
			common.videomanages.initStart();
			common.videomanages.heartBeat();
			common.watcherHeartBeat = setInterval(function() {
				common.videomanages.heartBeat();
			}, 600000)
		},
		stop: function() {
			common.playerObj.StopVideo();
			common.playerObj.StopAudio();
		},
		snapshotStart: function(shoot) {
			if (shoot == 3) {
				plug.window.alert({
					"info": lang.info.shootDiskFull
				});
			}
		},
		recordStart: function(record) {
			if (record == 0) {
				common.videomanages.recordingShow();
			} else if (record == 1) {
				common.videomanages.recordStop();
			} else if (record == 2) {
				common.videomanages.recordStop();
				plug.window.alert({
					"info": lang.info.recordInterrupted
				});
			} else if (record == 3) {
				common.videomanages.recordStop();
				plug.window.alert({
					"info": lang.info.recordDiskFull
				});
			}
		},
		recordingShow: function() {
			$("#videovid").hide();
			$("#videovidon").show();
			common.recordFlag = 1;
		},
		recordStop: function() {
			$("#videovidon").hide();
			$("#videovid").show();
			common.recordFlag = 0;
			common.playerObj.StopRecord();
		},
		maxAndMin: function(holder, min, max) {
			holder.val() > max ? holder.val(max) : null;
			holder.val() < min ? holder.val(min) : null;
			return holder.val();
		},
		percent: function(val, min, max) {
			if (min >= 0) {
				return Math.floor(val * 100 / (max - min));
			} else {
				if (val >= 0) {
					return Math.floor((val - min) * 100 / (max - min));
				} else {
					return Math.floor((val - min) * 100 / (max - min));
				}
			}

		},
		backPercent: function(val, min, max) {
			if (min >= 0) {
				return Math.ceil((val / 100) * (max - min) + min);
			} else {
				return Math.ceil((val / 100) * (max - min) + min);
			}
		},
		initVideoBar: function(json) {
			$("#brightness-bar").slider({
				range: "min",
				value: 0,
				min: 0,
				max: 100,
				stop: function(event, ui) {
					var val = common.videomanages.backPercent(ui.value, Number(json.brightness.minimum), Number(json.brightness.maximum));
					$("#brightness-val").val(ui.value);
					var args = {
						"brightness": val
					};
					common.videomanages.setVideoCtrls(args);
				}
			});
			$("#contrast-bar").slider({
				range: "min",
				value: 36,
				min: 0,
				max: 100,
				stop: function(event, ui) {
					var val = common.videomanages.backPercent(ui.value, Number(json.contrast.minimum), Number(json.contrast.maximum))
					$("#contrast-val").val(ui.value);
					var args = {
						"contrast": val
					};
					common.videomanages.setVideoCtrls(args);
				}
			});
			$("#saturation-bar").slider({
				range: "min",
				value: 60,
				min: 0,
				max: 100,
				stop: function(event, ui) {
					var val = common.videomanages.backPercent(ui.value, Number(json.saturation.minimum), Number(json.saturation.maximum))
					$("#saturation-val").val(ui.value);
					var args = {
						"saturation": val
					};
					common.videomanages.setVideoCtrls(args);
				}
			});
		},
		bind: function() {
			plug.button.enable($("#setting-contain-video-ctrl-save"));
			$("#videocut").click(function() {
				var obj = document.getElementById("tpplugin");
				obj.Snapshot("snapshot"); //IE下需要传递一个字符串参数
			});
			$("#setting-camera-metro").click(function() {
				common.videomanages.getVideoSetting();
				common.videomanages.getOSDTimeStamp();
			});
			$("#p1Rate").change(function() {
				if ($(this).val() == 0) {
					$(".video-profile1-bitrate").hide();
					$(".video-profile1-imgquality").show();
				} else {
					$(".video-profile1-bitrate").show();
					$(".video-profile1-imgquality").hide();
				}
			});
			$("#p2Rate").change(function() {
				if ($(this).val() == 0) {
					$(".video-profile2-bitrate").hide();
					$(".video-profile2-imgquality").show();
				} else {
					$(".video-profile2-bitrate").show();
					$(".video-profile2-imgquality").hide();
				}
			});
			$("#videofullscreen").click(function() {
				var windows = (navigator.userAgent.indexOf("Windows", 0) != -1) ? 1 : 0;
				var mac = (navigator.userAgent.indexOf("Mac", 0) != -1) ? 1 : 0;
				if (mac) {
					common.playerObj.StopVideo();
					var a = "";
					a += "<div id='fullplugincontent'>"
					a += "<div id='fullplugininner'>"
					a += '<object id="fullplugin" type="application/x-tp-camera-h264" style="width:100%; height: 100%;position:relative;"></object>';
					a += "</div>"
					a += "</div>"
					$("body").append(a);
					var newWith = Math.ceil($("#fullplugincontent").height() * 1.4);
					$("#fullplugininner").css({
						"width": newWith,
						"height": $("#fullplugincontent").height(),
						"min-width": newWith,
						"min-height": $("#fullplugincontent").height()
					})

					var obj = document.getElementById("fullplugin");
					obj.ip = location.hostname;
					obj.port = common.playerPort;
					var isip = valid.ip(location.hostname);
					if (common.upnpInfo.port) {
						if (isip.pass != true || location.hostname == common.upnpInfo.ip || location.hostname == common.upnpInfo.noip || location.hostname == common.upnpInfo.dyndns || location.hostname == common.upnpInfo.cmxaction) {
							obj.ip = common.upnpInfo.ip;
							obj.port = common.upnpInfo.port;
						}
					}
					obj.username = $("#n").attr("value");
					obj.password = /*Base64.decode()*/$("#sec").attr("value");
					if (common.ResolutionMode == "QVGA") {
							obj.ChangeStreamResolution(STREAMRESOLUTION_QVGA);
					} else if (common.ResolutionMode == "VGA") {
							obj.ChangeStreamResolution(STREAMRESOLUTION_VGA);
					}
					obj.PlayVideo();
					$(window).one("keydown", function(e) {
						if (e.keyCode == "27") {
							$("#fullplugincontent").remove();
							common.playerObj.PlayVideo();
						}
					});
					// $(window).one("resize", function(e) {
					// 	$("#fullplugininner").width(Math.ceil($("#fullplugininner").height()*1.4));
					// });
					$(window).one("dblclick", function(e) {
						$("#fullplugincontent").remove();
						common.playerObj.PlayVideo();
					});
				} else {
					common.playerObj.SetFullScreen();
				}
			})

			$("#brightness-val").bind({
				keydown: function(event) {
					if (event.keyCode == "13") {
						var val = common.videomanages.maxAndMin($(this), 0, 100);
						$("#brightness-bar").slider("value", val);
						var args = {
							"brightness": common.videomanages.backPercent(val, common.brightness.minimum, common.brightness.maximum)
						};
						common.videomanages.setVideoCtrls(args);
					}
				}
			});

			$("#contrast-val").bind({
				keydown: function(event) {
					if (event.keyCode == "13") {
						var val = common.videomanages.maxAndMin($(this), 0, 100)
						$("#contrast-bar").slider("value", val);
						var args = {
							"contrast": common.videomanages.backPercent(val, common.contrast.minimum, common.contrast.maximum)
						};
						common.videomanages.setVideoCtrls(args);
					}
				}
			});

			$("#saturation-val").bind({
				keydown: function(event) {
					if (event.keyCode == "13") {
						var val = common.videomanages.maxAndMin($(this), 0, 100)
						$("#saturation-bar").slider("value", val);
						var args = {
							"saturation": common.videomanages.backPercent(val, common.saturation.minimum, common.saturation.maximum)
						};
						common.videomanages.setVideoCtrls(args);
					}
				}
			});
			$("#zoom-bar").slider({
				range: "min",
				value: 0,
				min: 0,
				step: 30,
				max: 90,
				stop: function(event, ui) {
					if (ui.value == 0) {
						common.zoomMulit = 1;
						common.videomanages.zoom();
						$("#zoom-bar .ui-slider-handle").attr("title", "X1");
					} else if (ui.value == 30) {
						common.zoomMulit = 2;
						common.videomanages.zoom();
						$("#zoom-bar .ui-slider-handle").attr("title", "X2");
					} else if (ui.value == 60) {
						common.zoomMulit = 3;
						common.videomanages.zoom();
						$("#zoom-bar .ui-slider-handle").attr("title", "X3");
					} else if (ui.value == 90) {
						common.zoomMulit = 4;
						common.videomanages.zoom();
						$("#zoom-bar .ui-slider-handle").attr("title", "X4");
					}
				}
			});
			$(".volume-bar").slider({
				range: "min",
				value: 0,
				min: 0,
				max: 100,
				stop: function(event, ui) {
					$(".volume-val").val(ui.value);
					$.cookie("audiovalue", ui.value);
					$(".volume-bar").slider("value", ui.value);
					if (!$.cookie("audiooff")) {
					//if(IsAudioOff == false){
						common.videomanages.setVolume(ui.value, 1);
					}
				}
			});
			$("#videovolumestart").click(function() {
				$(this).hide();
				$("#videovolumestop").show();
				$.cookie("audiooff", "off");
				//IsAudioOff = true;
				$(".volume-bar").slider("value", 0);
				common.playerObj.SetAudioVolume(0);
				//}
			});
			$("#videovolumestop").click(function() {
				$(this).hide();
				$("#videovolumestart").show();
				$.removeCookie("audiooff", "off");
				//IsAudioOff = false;
				var volume = $.cookie("audiovalue")
				$(".volume-bar").slider("value", volume);
				//common.playerObj.PlayAudio();
				common.playerObj.SetAudioVolume(Number(volume));
				//	common.playerObj.PlayAudio();
			});
			$(".volume-val").bind({
				keydown: function(event) {
					if (event.keyCode == "13") {
						var val = common.videomanages.maxAndMin($(this), 0, 100)
						$(".volume-bar").slider("value", val);
						$(".volume-val").val(val);
						common.videomanages.setVolume(val, 1);
					}
				}
			});
			$("#audioable-submit").click(function() {
				var val = common.videomanages.maxAndMin($("#audio-val").val(), 0, 100)
				var args = {
					url: '/setsoundsetting.fcgi',
					data: {
						"enable": $(".volume-radio-setting-selected").val(),
						"volume": val
					},
					success: function(response) {
						var json = jQuery.parseJSON(response);
						if (json.errorCode == 0) {
							if (json.enable == 1) {
								$(".volume-bar").slider("value", json.volume);
								$(".volume-val").val(json.volume);
								common.videomanages.setVolume(val, 1);
								$(".volume-offon-show").show();
								plug.window.alert({
									"info": lang.ajax.videoSet.audioSuccess
								});
							} else {
								$(".volume-offon-show").hide();
							}
						} else {
							plug.window.alert({
								"info": lang.ajax.videoSet.audioFailed
							});
						}
					},
					error: function(xhr) {

					}
				}
				common.setAjax.init(args);
			});
			$(".volume-radio-setting").click(function() {
				$(".volume-radio-setting").removeClass("volume-radio-setting-selected");
				$(this).addClass("volume-radio-setting-selected");
			});
			$("#videovid").bind({
				mouseup: function() {
					var ieRecordMask = common.playerObj.Record();
					if (common.browserName == "Microsoft Internet Explorer" && ieRecordMask == 1) {
						common.videomanages.recordingShow();
					}
				}
			});
			$("#videovidon").bind({
				mouseup: function() {
					common.videomanages.recordStop();
				}
			});

			$("#resolution-readjust").bind({
				click: function() {
					common.multiple.recordBreak();
				},
				change: function() {
					if (!common.multiple.recordBreak()) {
						var curReso = $(".resolution-readjust").find(".selected.lang").text();
						var curResoVal = 640;
						if (curReso == "320*240") {
							curResoVal = 320;
						}

						var choosedResoVal = $(this).val();
						if (curResoVal == common.width) {
							return false;
						} else {
							if (choosedResoVal == 1) {
								common.width = 320;
								$(this).val(2);
							}else{
								common.width = 640;
								$(this).val(1);
							}
							plug.select.initial($("#resolution-readjust").parent());
							return false;
						}
					}
					
					var $holder = $("#resolution-readjust-out").find(".plugin-select");
					if ($(this).val() == 1) {
						if (common.ResolutionMode == "QVGA") {
							common.width = 640;
							common.videomanages.vgaCss();
							common.videomanages.setResolutionRatio(640, 480, 320, 240, "QVGA");
							common.ResolutionMode = "VGA";
							$(this).attr("disabled", true)
							$holder.removeClass("select-slide");
							$holder.addClass("select-disabled");
							$holder.find(".triangle").hide();
							
							
							var obj = document.getElementById('tpplugin');
							obj.ChangeStreamResolution(STREAMRESOLUTION_VGA);
							
							current_streamresolution = STREAMRESOLUTION_VGA;
						}
					} else if ($(this).val() == 2) {
						if (common.ResolutionMode == "VGA") {
							common.width = 320;
							common.videomanages.qvgaCss();
							common.videomanages.setResolutionRatio(320, 240, 640, 480, "VGA");
							common.ResolutionMode = "QVGA";
							$(this).attr("disabled", true)
							$holder.removeClass("select-slide");
							$holder.addClass("select-disabled");
							$holder.find(".triangle").hide();
							
							var obj = document.getElementById('tpplugin');
							obj.ChangeStreamResolution(STREAMRESOLUTION_QVGA);
							
							current_streamresolution = STREAMRESOLUTION_QVGA;
						}
					}

					setTimeout(function() {
						$("#resolution-readjust").attr("disabled", false);
						$holder.removeClass("select-disabled");
						$holder.find(".triangle").show();
					}, 5000)
				}

			});
			
			$("#setting-contain-video-ctrl-save").click(function() {
				if( !common.checkInputUseRegularExp($("#osd-setting-text").val(), /[^a-zA-Z0-9 -]|_/ig ) ){
					plug.window.alert({
						info: lang.valid.osdtext.illegal		  
					});
					$("#osd-setting-text").focus();
					return;
				}
																 
				common.validInfo(valid.osdtext($("#osd-setting-text").val(), 20)) == true ? common.videomanages.setVideoSetting() : null;
			});
			$("#resetvideo").click(function() {
				common.videomanages.resetVideoCtrls();
			});
			/*$("#resolution-readjust").bind({
				click: function() {
					common.multiple.recordBreak()
				},
				change: function() {
					var $holder = $("#resolution-readjust-out").find(".plugin-select");
					if ($(this).val() == 1) {
						if (common.ResolutionMode == "QVGA") {
							common.videomanages.vgaCss();
							common.videomanages.setResolutionRatio(640, 480, 320, 240, "QVGA");
							common.ResolutionMode = "VGA";
							$(this).attr("disabled", true)
							$holder.removeClass("select-slide");
							$holder.addClass("select-disabled");
							$holder.find(".triangle").hide();
						}
					} else if ($(this).val() == 2) {
						if (common.ResolutionMode == "VGA") {
							common.videomanages.qvgaCss();
							common.videomanages.setResolutionRatio(320, 240, 640, 480, "VGA");
							common.ResolutionMode = "QVGA";
							$(this).attr("disabled", true)
							$holder.removeClass("select-slide");
							$holder.addClass("select-disabled");
							$holder.find(".triangle").hide();
						}
					}

					setTimeout(function() {
						$("#resolution-readjust").attr("disabled", false);
						$holder.removeClass("select-disabled");
						$holder.find(".triangle").show();
					}, 5000)
				}

			});*/
			$(".backlight-radio-setting").click(function() {
				$(".backlight-radio-setting").removeClass("backlight-radio-setting-selected");
				$(this).addClass("backlight-radio-setting-selected");
			});
			$(".timestamp-radio-setting").click(function() {
				$(".timestamp-radio-setting").removeClass("timestamp-radio-setting-selected");
				$(this).addClass("timestamp-radio-setting-selected");
			});
			$(".osd-radio-setting").click(function() {
				$(".osd-radio-setting").removeClass("osd-radio-setting-selected");
				$(this).addClass("osd-radio-setting-selected");
			})
			$("#osd-enable").click(function() {
				$(".osd-setting-show").show();
			});
			$("#osd-disable").click(function() {
				$(".osd-setting-show").hide();
			});
			$("#videoflip").click(function() {
				common.videomanages.setMirrorFlip({
					"flip": ""
				});
			});
			$("#videomirror").click(function() {
				common.videomanages.setMirrorFlip({
					"mirror": ""
				});
			});
			$("#videozoom").click(function(event,command) {
				var title;
				var value;
				if(command != "stay"){
					if(common.zoomMulit == 1){
						common.zoomMulit = 2;
						title = "X2";
						value = 30;
					}else if(common.zoomMulit == 2){
						common.zoomMulit = 3;
						title = "X3";
						value = 60;
					}else if(common.zoomMulit == 3){
						common.zoomMulit = 4;
						title = "X4";
						value = 90;
					}else if(common.zoomMulit == 4){
						common.zoomMulit = 1;
						title = "X1";
						value = 0;
					}
				}else{
					if(!common.zoomMulit){
						common.zoomMulit = 1;
						title = "X1";
						value = 0;
					}else{
						
						if(common.zoomMulit == 1){
							title = "X1";
							value = 0;
						}else if(common.zoomMulit == 2){
							title = "X2";
							value = 30;
						}else if(common.zoomMulit == 3){
							title = "X3";
							value = 60;
						}else if(common.zoomMulit == 4){
							title = "X4";
							value = 90;
						}
					}
				}
				common.videomanages.zoom();
				$("#zoom-bar .ui-slider-handle").attr("title", title);
				$("#zoom-bar").slider("value", value);
			});
			$("#daynight").click(function(event) {
				
				if ($("#daylist").css("display") != "none") {
					$("#daylist").hide();
				} else {
					$("#daylist").show();
				}
				
				event.stopPropagation();    //  阻止事件冒泡
			
			});
			$("#dayandnightcover").bind("click",function(event){
				event.stopPropagation();    //  阻止事件冒泡
			});
			$("#daylist").delegate("li", "click", function() {
				var id = this.id;
				if (id == "automode") {
					//	$target.removeClass("outnightmodeimg outdaymodeimg").addClass("daynightimg");
					common.videomanages.setDayNight(DAYNIGHTMODE_AUTO);
				}
				if (id == "daymode") {
					//	$target.removeClass("daynightimg outnightmodeimg").addClass("outdaymodeimg");
					common.videomanages.setDayNight(DAYNIGHTMODE_DAY_MODE);
				}
				//	$target = $("#daynight").find("span");
				if (id == "nightmode") {
					//	$target.removeClass("daynightimg outdaymodeimg").addClass("outnightmodeimg");
					common.videomanages.setDayNight(DAYNIGHTMODE_NIGHT_MODE);
				}
				$("#daylist").hide();
				
				$("#dayandnightcover").css("visibility","visible");
				setTimeout(function(){
					$("#dayandnightcover").css("visibility","hidden");
				},4*1000);
			});

		},
		qvgaCss: function() {
			common.timeStamp.fontsize = 8;
			common.timeStamp.positionX = 210;
			common.osdArgs.fontsize = 8;
			$("#objectplayer").css({
				"left": 160,
				"top": 120,
				"position": "relative"
			});

		},
		zoom: function(n) {
			common.zoomMulit = common.zoomMulit || 1;
			try {
				if (common.pluginFlag == 1) {
					if (common.ResolutionMode == "VGA") {
						$("#tpplugin").width(640);
						$("#tpplugin").height(480);
						$("#mdplugin").width(640);
						$("#mdplugin").height(480);
					} else if (common.ResolutionMode == "QVGA") {
						$("#tpplugin").width(320);
						$("#tpplugin").height(240);
						$("#mdplugin").width(320);
						$("#mdplugin").height(240);
					}
					common.playerObj.SetVideoZoom(common.zoomMulit);
				} else {
					if(!isChrome){
						plug.window.alert({
							"info": lang.ajax.pluginUninstall
						});
					}
				}
			} catch (error) {}

			//	}
		},
		vgaCss: function() {
			common.timeStamp.fontsize = 10;
			common.timeStamp.positionX = 510;
			common.osdArgs.fontsize = 10;
			$("#objectplayer").css({
				"left": 0,
				"top": 0,
				"position": "relative"
			});
			$("#videoManages-main").css({
				//"width": 640
			});
			$("#objectplayer").css({
				//"width": 640,
				//"height": 480
			});

		},
		setResolutionRatio: function(newWidth, newHeight, oldWidth, oldHeight, mode) {
			$("#tpplugin").width(newWidth);
			$("#tpplugin").height(newHeight);
			/*
			$("#mdplugin").width(newWidth);
			$("#mdplugin").height(newHeight);
			*/
			common.playerWidth.width = newWidth;
			common.playerWidth.height = newHeight;
			/*var args = {
				url: '/setvideosetting.fcgi',
				data: {
					"width": newWidth,
					"height": newHeight
				},
				success: function(json) {
					if (json.errorCode == 0) {
						//	$("#zoom-bar").slider("value", 0);
						$("#videozoom").trigger("click","stay");
						//common.videomanages.initOsd();
						if ($("#videoManages").css("display") != "none") {
							common.videomanages.initStart();
						}
						if (newWidth == 640) {
							$("#status-resolution").text("640 * 480");
						} else {
							$("#status-resolution").text("320 * 240");
						}
					} else {
						$("#tpplugin").width(oldWidth);
						$("#tpplugin").height(oldHeight);
						
						$("#mdplugin").width(oldWidth);
						$("#mdplugin").height(oldHeight);
						
						common.playerWidth.width = oldWidth;
						common.playerWidth.height = oldHeight;
						$("#resolution-readjust").val(mode);
					}
				},
				error: function(xhr) {

				}
			}
			common.setAjax.init(args);*/
		},
		setVideoSetting: function() {
			plug.button.disable($("#setting-contain-video-ctrl-save"));
			var args = {
				url: '/setvideosetting.fcgi',
				data: {
					"qualitytype1": $("#p1Rate").val(),
					"qualitylevel1": $("#p1ImgQuality").val(),
					"bitrate1": $("#p1BitRate").val(),
					"fps1":$("#p1FrameRate").val(),
					"qualitytype3": $("#p2Rate").val(),
					"qualitylevel3": $("#p2ImgQuality").val(),
					"bitrate3": $("#p2BitRate").val(),
					"fps3":$("#p2FrameRate").val(),
					"powerline_frequency": $("#lightfrequency").val(),
					"backlight_compensation": $(".backlight-radio-setting-selected").val()
				},
				success: function(json) {
					plug.button.enable($("#setting-contain-video-ctrl-save"));
					if (json.errorCode == 0) {
						common.videomanages.setOSDTimeStamp(); //当OSD请求通过时再判断成功与否
						$("#status-frameRate").html(json.fps);
						//$("#status-imageQuality").html($("#imagequality option:selected").html());
						$("#status-imageQuality").html($("#p1ImgQuality option:selected").html());
						$("#status-imageQuality-2").html($("#p2ImgQuality option:selected").html());
						$("#status-lightFre").html($("#lightfrequency option:selected").html());
						
						//$("#status-resolution").html($("#presolution-readjust option:selected").html());

						$("#status-frameRate").html($("#p1FrameRate").val());
						$("#status-frameRate-2").html($("#p2FrameRate").val());
					} else {
						plug.window.alert({
							"info": lang.ajax.videoSet.videoFailed
						});
					}
				},
				error: function(xhr) {
					plug.button.enable($("#setting-contain-video-ctrl-save"));
				}
			};
			common.setAjax.init(args);
		},
		setMirrorFlip: function(datas) {
			var args = {
				url: '/setvideoctrls.fcgi',
				data: datas,
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
		getDayNight: function() {
			var args = {
				url: '/daynightconfsettinginit.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
						if (json.daynightmode == DAYNIGHTMODE_AUTO) {
							$("#daynight").find("span").removeClass("outnightmodeimg outdaymodeimg").addClass("daynightimg");
						} else if (json.daynightmode == DAYNIGHTMODE_DAY_MODE) {
							$("#daynight").find("span").removeClass("daynightimg outnightmodeimg").addClass("outdaymodeimg");
						} else if (json.daynightmode == DAYNIGHTMODE_NIGHT_MODE) {
							$("#daynight").find("span").removeClass("daynightimg outdaymodeimg").addClass("outnightmodeimg");
						}
						
						common.videomanages.setDayNight(json.daynightmode);
					}
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		},
		setDayNight: function(mode) {
			
			var args = {
				url: "/daynightconf.fcgi",
				type: HTTP_M_POST,
				data: {
					"daynightmode": mode
				},
				success: function(json) {
					if (json.errorCode == 0) {
						if (mode == DAYNIGHTMODE_AUTO) {
							$("#daynight").removeClass("outnightmodeimg outdaymodeimg").addClass("daynightimg");
						} else if (mode == DAYNIGHTMODE_DAY_MODE) {
							$("#daynight").removeClass("daynightimg outnightmodeimg").addClass("outdaymodeimg");
						} else if (mode == DAYNIGHTMODE_NIGHT_MODE) {
							$("#daynight").removeClass("daynightimg outdaymodeimg").addClass("outnightmodeimg");
						}
					} else {

					}
				},
				error: function(xhr) {

				}
			}
			common.setAjax.init(args);
		},
		getVideoSetting: function(mode) {
			var args = {
				url: '/getvideosetting.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
						if (mode == "init") {
							// if (json.width == 640) {
							// 	$("#resolution-readjust").val(1).change();
							// 	common.videomanages.vgaCss();
							// } else if (json.width == 320) {
							// 	$("#resolution-readjust").val(2).change();
							// 	common.videomanages.qvgaCss();
							// }
							common.videomanages.launch(640, 480);
							var resolution = $("#resolution-readjust option:selected").attr("name");
							common.ResolutionMode = resolution;
						}

						$("#p1FrameRate").val(json.profile1.fps1).change();
						$("#p2FrameRate").val(json.profile3.fps3).change();
						$("#p1Rate").val(json.profile1.qualitytype1).change();
						$("#p2Rate").val(json.profile3.qualitytype3).change();
						$("#p1BitRate").val(json.profile1.qualityvalue1.bitrate1).change();
						$("#p2BitRate").val(json.profile3.qualityvalue3.bitrate3).change();
						$("#p1ImgQuality").val(json.profile1.qualityvalue1.qualitylevel1).change();
						$("#p2ImgQuality").val(json.profile3.qualityvalue3.qualitylevel3).change();
						$("#lightfrequency").val(json.powerline_frequency.value).change();
						json.backlight_compensation.value == 0 ? $("#backlight-disable").click() : $("#backlight-enable").click();
						common.videomanages.initVideoStatus(mode);
					}
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		},
		initVideoStatus: function(mode) {
			//$("#status-resolution").text($("#resolution-readjust option:selected").text());
			$("#status-resolution").text("640*480");
			$("#status-frameRate").text($("#p1FrameRate").val());
			$("#status-imageQuality").text($("#p1ImgQuality option:selected").text());
			$("#status-lightFre").text($("#lightfrequency option:selected").text());
			
			$("#status-resolution-2").text($("#p2Resolution").text());
			$("#status-frameRate-2").text($("#p2FrameRate").val());
			$("#status-imageQuality-2").text($("#p2ImgQuality option:selected").text());
			
			if (mode == "init") {
				//针对firefox的强制措施,避免出现切换分辨率后刷新，还是停留在320*240
				$("#resolution-readjust").attr("disabled", false);
				$("#resolution-readjust").val(1).change();
				var $holder = $("#resolution-readjust-out").find(".plugin-select");
				$holder.removeClass("select-disabled");
				$holder.find(".triangle").show();
				/*$(".select-resolution-readjust .selected").html("640*480");*/
			}
		},
		setVolume: function(val, disable) { //0:off,1:on
			common.playerObj.SetAudioVolume(Number(val));
		},
		getVolume: function() {
			var args = {
				url: '/getsoundsetting.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
						$(".volume-val").val(json.volume);
						$(".volume-bar").slider("value", json.volume);
						if (json.enable == 1) {
							$(".volume-offon-show").show();
							$("#audioable-on").click();
						} else {
							$(".volume-offon-show").hide();
							$("#audioable-off").click();
						}
					}
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		},
		setOSDTimeStamp: function() {
			var args = {
				url: '/setosdandtimedisplay.fcgi',
				data: {
					"time_enable": $(".timestamp-radio-setting-selected").val(),
					"osd_enable": $(".osd-radio-setting-selected").val(),
					"osd_size": $("#osdsize").val(),
					"osd_info": Base64.encode($("#osd-setting-text").val())
				},
				success: function(json) {
					if (json.errorCode == 0) {
						var obj = document.getElementById('tpplugin');
						var str = $("#osd-setting-text").val();
						if ($(".osd-radio-setting-selected").val() == 1) {
							common.osdArgs.enable = true;
							common.osdArgs.str = str;
						} else if ($(".osd-radio-setting-selected").val() == 0) {
							common.osdArgs.enable = false;
							common.osdArgs.str = str;
						}
						if ($(".timestamp-radio-setting-selected").val() == 1) {
							common.timeStamp.enable = true;
						} else if ($(".timestamp-radio-setting-selected").val() == 0) {
							common.timeStamp.enable = false;
						}
						plug.window.alert({
							"info": lang.ajax.videoSet.success
						});
					} else {
						plug.window.alert({
							"info": lang.ajax.videoSet.osdFailed
						});
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
						$("#osdsize").val(json.osd_size)
						$("#osd-setting-text").val(Base64.decode(json.osd_info));
						var obj = document.getElementById('tpplugin');
						if (json.osd_enable == 1) {
							$("#osd-enable").click();
							common.osdArgs.enable = true;
							common.osdArgs.str = Base64.decode(json.osd_info);
							//common.osdArgs.fontsize = json.osd_size;
						} else if (json.osd_enable == 0) {
							$("#osd-disable").click();
							common.osdArgs.enable = false;
							common.osdArgs.str = Base64.decode(json.osd_info);
							//common.osdArgs.fontsize = json.osd_size;
						}
						if (json.time_enable == 1) {
							$("#timestamp-enable").click();
							common.timeStamp.enable = true;
						} else if (json.time_enable == 0) {
							$("#timestamp-disable").click();
							common.timeStamp.enable = false;
						}
					} else {

					}
					plug.radio.initial($(".setting-contain-camera"));
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		},
		getVideoArgs: function() {
			var args = {
				url: '/getvideoctrls.fcgi',
				data: {
					"all": "any value"
				},
				success: function(json) {
					if (json.errorCode == 0) {
						common.brightness = json.brightness;
						common.contrast = json.contrast;
						common.saturation = json.saturation;
						common.videomanages.initVideoBar(json);
						common.videomanages.initWebValue(json);
					}
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		},
		initWebValue: function(json) {
			var newbrightness = common.videomanages.percent(json.brightness.value, json.brightness.minimum, json.brightness.maximum);
			var newcontrast = common.videomanages.percent(json.contrast.value, json.contrast.minimum, json.contrast.maximum);
			var newsaturation = common.videomanages.percent(json.saturation.value, json.saturation.minimum, json.saturation.maximum);
			$("#brightness-bar").slider('option', 'value', newbrightness);
			$("#brightness-val").val(newbrightness);
			$("#status-brightness").text(newbrightness + "%");
			$("#contrast-bar").slider('option', 'value', newcontrast);
			$("#contrast-val").val(newcontrast);
			$("#status-contrast").text(newcontrast + "%");
			$("#saturation-bar").slider('option', 'value', newsaturation);
			$("#saturation-val").val(newsaturation);
			$("#status-saturation").text(newsaturation + "%");
		},
		setVideoCtrls: function(setArgs) {
			var args = {
				url: '/setvideoctrls.fcgi',
				data: {
					"brightness": setArgs.brightness || common.videomanages.backPercent($("#brightness-val").val(), common.brightness.minimum, common.brightness.maximum),
					"saturation": setArgs.saturation || common.videomanages.backPercent($("#saturation-val").val(), common.saturation.minimum, common.saturation.maximum),
					"contrast": setArgs.contrast || common.videomanages.backPercent($("#contrast-val").val(), common.contrast.minimum, common.contrast.maximum)
				},
				success: function(json) {
					if (json.errorCode == 0) {
						common.videomanages.initWebValue(json);
					}
				},
				error: function(xhr) {

				}
			}
			common.setAjax.init(args);
		},
		resetVideoCtrls: function() {
			var args = {
				url: '/resetvideoctrls.fcgi',
				data: { //reset这些值随便设
					"brightness": "any value",
					"saturation": "any value",
					"contrast": 10,
					"flip": "",
					"mirror": ""
				},
				success: function(json) {
					if (json.errorCode == 0) {
						common.videomanages.initWebValue(json);
					}
				},
				error: function(xhr) {

				}
			}
			common.setAjax.init(args);
		},
		getReceiver: function() {
			var args = {
				url: '/getreceiver.fcgi',
				data: {

				},
				success: function(json) {
					if (json.errorCode == 0) {

					}
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		},
		deleteReceiver: function() {
			var args = {
				url: '/deletereceiver.fcgi',
				data: {

				},
				success: function(json) {
					if (json.errorCode == 0) {

					}
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		}
	},
	soundDetection: {
		X: null,
		r: null,
		Y: null,
		initflag: null,
		path: null,
		line: null,
		arrow: null,
		glow: null,
		datas: null,
		bgp: null,
		init: function() {
			common.soundDetection.bind();

		},
		bind: function() {
			$("#setting-motionsoundalarm-metro").click(function() {
				//common.soundDetection.initSoundGrid();
			
				/**
				 *  谷歌下不加此代码会导致纵坐标错位
				 **/
				$("tspan").attr("dy",0);
				
				common.soundDetection.getInfo();

				// common.volumeValInterval = setInterval(function() {
				// 	//common.soundDetection.getVoVal();
				// }, 1000);
			});
			plug.select.initial($(".setting-contain-motionsoundalarm"), "down");
			$(".sdetection-radio-setting").click(function() {
				$(".sdetection-radio-setting").removeClass("sdetection-radio-setting-selected");
				$(this).addClass("sdetection-radio-setting-selected");
			});
			$("#motionsounddetection-ctrl-save").click(function() {
				common.soundDetection.setInfo();
			});

			$("#motion-sound-threshold").change(function() {
				common.soundDetection.replaceLine($(this).val());
			});
			$("#mdsenable").click(function() {
				common.soundDetection.initSoundGrid();
				$("#motion-sound-threshold").change();
				$("#sound-set-content").show();
			});
			$("#mdsdisable").click(function() {
				$("#sound-set-content").hide();
				clearInterval(common.volumeValInterval);
			});
		},
		getInfo: function() {
			var args = {
				url: '/GetAudioDetection.fcgi',
				type: "post",
				success: function(json) {
					if (json.errorCode == 0) {
						$("#motion-sound-sensitivity").val(json.adSensitivity).change();
						$("#motion-sound-threshold").val(json.adThreadhold);
						json.adStatus == 1 ? $("#mdsenable").click() : $("#mdsdisable").click();
					} else {

					}
					plug.radio.initial($(".setting-contain-motionsoundalarm"));
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		},
		setInfo: function() {
			plug.button.disable($("#motionsounddetection-ctrl-save"));
			var args = {
				url: '/SetAudioDetection.fcgi',
				data: {
					"adStatus": $(".sdetection-radio-setting-selected").val(),
					"adThreadhold": parseInt($("#motion-sound-threshold").val()),
					"adSensitivity": $("#motion-sound-sensitivity").val()
				},
				success: function(json) {
					plug.button.enable($("#motionsounddetection-ctrl-save"));
					if (json.errorCode == 0) {
						plug.window.alert({
							"info": lang.ajax.sounddetection.setSuccess
						});
					} else {
						plug.window.alert({
							"info": lang.ajax.sounddetection.setFailed
						});
					}
				},
				error: function(xhr) {
					plug.button.enable($("#motionsounddetection-ctrl-save"));
				}
			}
			common.ajax.init(args);
		},
		getVoVal: function() {
			var args = {
				url: '/GetADData.fcgi',
				type: "post",
				success: function(json) {
					common.soundDetection.datas.shift();
					if (json.errorCode == 0) {
						common.soundDetection.datas.push(json.adSounddata);
					} else {
						common.soundDetection.datas.push(0);
					}
					common.soundDetection.refreshSound(common.soundDetection.datas);
				},
				error: function(xhr) {
					common.soundDetection.datas.push(0);
					common.soundDetection.refreshSound(common.soundDetection.datas);
				}
			}
			common.ajax.init(args);
		},
		refreshSound: function(val) {
			clearInterval(common.volumeValInterval);
			var r = common.soundDetection.r;
			var datas = val || [0, 0, 0, 0, 0, 0];
			var newPath = common.soundDetection.getSoundPath(datas);
			common.soundDetection.path.animate({
				path: newPath.p
			}, 0, "linear", function() {
				common.volumeValInterval = setTimeout(function() {
					common.soundDetection.getVoVal();
				}, 1000);
			});
			common.soundDetection.bgp.animate({
				path: newPath.bgpp
			}, 0, "linear");
		},
		getSoundPath: function(data) {
			var r = common.soundDetection.r;
			var path;

			var width = 580,
				height = 330,
				leftgutter = 70,
				bottomgutter = 20,
				txt = {
					font: '12px Helvetica, Arial',
					fill: "#000"
				},
				topgutter = 30;
			var labels = common.soundDetection.labels,
				X = common.soundDetection.X,
				Y = common.soundDetection.Y;

			var p, bgpp;
			for (var i = 0, ii = data.length; i < ii; i++) {
				var y = Math.round(height - bottomgutter - Y * data[i]),
					x = Math.round(leftgutter + X * (i + .5));
				//	var t = r.text(X * .5 + 10, 28 * (6 - i) * 2 - 30, labels[i]).attr(txt);
				if (!i) {
					p = ["M", x, y, "C", x, y];
					bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
				}
				if (i && i < ii - 1) {
					var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
						X0 = Math.round(leftgutter + X * (i - .5)),
						Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
						X2 = Math.round(leftgutter + X * (i + 1.5));
					var a = getAnchors(X0, Y0, x, y, X2, Y2);
					//p = p.concat([X0,Y0,x,y,X2,Y2]);
					//bgpp = bgpp.concat([X0,Y0,x,y,X2,Y2]);
					p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
					bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
					//console.log("i: "+ i + " ii: "+ ii);
					//console.log("x1: "+ a.x1 +" y1: "+ a.y1 + " x2: "+a.x2+" y2: "+a.y2);
				}
			}
			p = p.concat([x, y, x, y]);
			bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
			return {
				"p": p,
				"bgpp": bgpp
			};　
		},
		initSoundGrid: function() {
			if (common.soundDetection.r) {
				common.soundDetection.r.remove();
			}
			var labels = ["Silence", "Whisper", "Quiet home", "Hair dryer", "Noisy office", "Lawn mower"/*0, 20, 40, 60, 80, 100*/];
			common.soundDetection.datas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			var data = common.soundDetection.datas;

			// Draw
			var width = 580,
				height = 330,
				leftgutter = 70,
				bottomgutter = 20,
				topgutter = 20,
				r = Raphael("motiondetection-soundctrl", width + 50, height),
				txt = {
					font: '12px Helvetica, Arial',
					fill: "#000"
				},
				txt1 = {
					font: '14px Helvetica, Arial',
					fill: "#000"
				},
				txt2 = {
					font: '12px Helvetica, Arial',
					fill: "#000"
				},
				txt3 = {
					font: '14px Helvetica, Arial',
					"font-weight": "bold",
					fill: "#2DA1C8"
				}
				X = (width - leftgutter) / data.length,
				//max = Math.max.apply(Math, data),
				max = 100,
				Y = (height - bottomgutter - topgutter) / max;
			r.drawGrid(leftgutter + X * .5 + .5, topgutter, width - leftgutter - X, height - topgutter - bottomgutter, 0, 5, "#ccc");

			t = r.text(560, 323, "Current Sound").attr(txt3);

			for (var i = 0, ii = labels.length; i < ii; i++) {
				t = r.text(X * .5 + 30, 28 * (6 - i) * 2 - 30, labels[i]).attr(txt);
				
				//t = r.text(300, /*5-i*/28 * (6 - i), i);
				
			}
			
			/**
			 *  谷歌下不加此代码会导致纵坐标错位
			 **/
			$("tspan").attr("dy",0);
			//$("svg").append("<defs><linearGradient id='orange_red' x1='20%' y1='0%' x2='40%' y2='100%'><stop offset='80%' style='stop-color:#4DBDD4;stop-opacity:0.8'/><stop offset='100%' style='stop-color:rgb(255,0,0);stop-opacity:1'/></linearGradient></defs>");

			common.soundDetection.X = X;
			common.soundDetection.r = r;
			common.soundDetection.Y = Y;
			common.soundDetection.labels = labels;

			//	var dbtext = r.text(X * .5 + 30, 10, "%").attr(txt1);
			var initPath = common.soundDetection.getSoundPath(data);
			common.soundDetection.path = r.path(initPath.p)
				.attr({
				stroke: "#4DBDD4",
				"stroke-width": 4,
				"stroke-linejoin": "round"
			});
			//var subPath = Raphael.getSubpath(common.soundDetection.path, 10, 100);	
							
			common.soundDetection.bgp = r.path(initPath.bgpp).attr({
				stroke: "none",
				opacity: .8,
				y: 252,
				fill: "#C5EDF1"
			});
			var swidth = width - 55; //橙色虚线79
			//console.log("swidth: " + swidth);
			common.soundDetection.line = r.path("M78,252h," + swidth).attr({
				'stroke': "#FFA600",
				"stroke-width": 2,
				'stroke-dasharray': '-'
			});　　
			var rightborder = r.path("M571,21v,290").attr({ //蓝色右边
				"fill": "#4DBDD4",
				"stroke-width": 3,
				'stroke': "#4DBDD4"
			});
			common.soundDetection.arrow = r.DrawArrow({
				"paper": r,
				"x": 572,
				"y": 252,
				"len": 14
			});
			
			var position = {
				"p80": {
					"line": 78,
					"arrow": 78
				},
				"p60": {
					"line": 136,
					"arrow": 136
				},
				"p40": {
					"line": 194,
					"arrow": 194
				},
				"p20": {
					"line": 252,
					"arrow": 252
				}
			};
			var animateArrow = function(y) {
				var path = common.soundDetection.r.DrawArrow({
					"paper": common.soundDetection.r,
					"mode": "path",
					"x": 572,
					"y": y,
					"len": 14
				});
				
				common.soundDetection.arrow.animate({
					path: path
				}, 500, "linear");
				common.soundDetection.glow.animate({
					path: path
				}, 500, "linear");
				common.soundDetection.line.animate({
					path: "M79," + y + "h,505"
				}, 500, "linear");
			};
			var animateArrowImmediately = function(y) {
				var path = common.soundDetection.r.DrawArrow({
					"paper": common.soundDetection.r,
					"mode": "path",
					"x": 572,
					"y": y,
					"len": 14
				});
				
				common.soundDetection.arrow.animate({
					path: path
				}, 0, "linear");
				common.soundDetection.glow.animate({
					path: path
				}, 0, "linear");
				common.soundDetection.line.animate({
					path: "M79," + y + "h,505"
				}, 0, "linear");
			};
			var move = function(dx,dy,x,y,event){
				//replaceLine("move");
				common.soundDetection.replaceLine("move");
				//console.log("dy : " + dy);
				//console.log("y : " + y);
				
				if( (common.soundDetection.currentLine + dy > position.p80.line - 58) &&
					(common.soundDetection.currentLine + dy <= position.p20.line + 58)
				){
					animateArrowImmediately( common.soundDetection.currentLine + dy);
				
					if( common.soundDetection.currentLine + dy <= position.p80.line ){
						common.soundDetection.finalLine = position.p80.line;	
				
						$("#motion-sound-threshold").val("80");
					}
					if( (common.soundDetection.currentLine + dy > position.p80.line) &&
						(common.soundDetection.currentLine + dy <= position.p60.line)
					){
						common.soundDetection.finalLine = position.p60.line;	
				
						$("#motion-sound-threshold").val("60");
					}
					if( (common.soundDetection.currentLine + dy > position.p60.line) &&
						(common.soundDetection.currentLine + dy <= position.p40.line)
					){
						common.soundDetection.finalLine = position.p40.line;	
				
						$("#motion-sound-threshold").val("40");
					}
					if( (common.soundDetection.currentLine + dy > position.p40.line) &&
						(common.soundDetection.currentLine + dy <= position.p20.line)
					){
						common.soundDetection.finalLine = position.p20.line;	
				
						$("#motion-sound-threshold").val("20");
					}				
					
					plug.select.initial($("#motion-sound-threshold").parent());
				}
			};
			var start = function(x,y,event){
				//console.log("start");
			};
			var end = function(event){
				//console.log("end");
				
				if(common.soundDetection.finalLine != null){
					common.soundDetection.currentLine = common.soundDetection.finalLine;					
				}
				
				animateArrow(common.soundDetection.currentLine);
			};
			common.soundDetection.arrow.drag(move, start, end);
			
			common.soundDetection.glow = common.soundDetection.arrow.glow({ //三角箭头
				"width": 1,
				"offsetx": 0,
				"offsety": 1
			});

			common.soundDetection.refreshSound(data);

		},
		replaceLine: function(n) {
			var n = Number(n);
			var position = {
				"p80": {
					"line": 78,
					"arrow": 78
				},
				"p60": {
					"line": 136,
					"arrow": 136
				},
				"p40": {
					"line": 194,
					"arrow": 194
				},
				"p20": {
					"line": 252,
					"arrow": 252
				}
			};
			var animateArrow = function(y) {
				var path = common.soundDetection.r.DrawArrow({
					"paper": common.soundDetection.r,
					"mode": "path",
					"x": 572,
					"y": y,
					"len": 14
				});
				//path.style.cursor = "pointer";
				
				common.soundDetection.arrow.animate({
					path: path
				}, 500, "linear");
				common.soundDetection.glow.animate({
					path: path
				}, 500, "linear");
				common.soundDetection.line.animate({
					path: "M79," + y + "h,505"
				}, 500, "linear");
			};
			if (n == 80) {
				animateArrow(position.p80.line);
				
				common.soundDetection.currentLine = position.p80.line;
			} else if (n == 60) {
				animateArrow(position.p60.line);
				
				common.soundDetection.currentLine = position.p60.line;
			} else if (n == 40) {
				animateArrow(position.p40.line);
				
				common.soundDetection.currentLine = position.p40.line;
			} else if (n == 20) {
				animateArrow(position.p20.line);
				
				common.soundDetection.currentLine = position.p20.line;
			}

		},
		currentLine : null,
		finalLine : null
	},
	motionDetection: {
		init: function() {
			common.motionDetection.bind();
			common.motionDetection.launch();
			//common.motionDetection.getMD();
		},
		launch: function() {
			var a = "";
			common.browserName = common.isIe();
			if (common.browserName == "Microsoft Internet Explorer") {

			} else {
				$("#mdplugin").remove();
				a += "<OBJECT id='mdplugin' type='application/x-tp-camera-h264'>",
				a += "</OBJECT>";
				$("#motiondetection-vedioctrl").append(a);
			}
		},
		bind: function() {
			plug.select.initial($(".setting-contain-motionalarm"), "down");
			$(".detection-radio-setting").click(function() {
				$(".detection-radio-setting").removeClass("detection-radio-setting-selected");
				$(this).addClass("detection-radio-setting-selected");
			});
			$("#setting-contain-motiondetection-ctrl-save").click(function() {
				if(common.pluginFlag == 1){	//如果有插件则直接设置motiondetection
					common.motionDetection.setMD();
				}else{
					common.motionDetection.setMD_noplugin();
				}
			});
			$("#setting-contain-motiondetection-ctrl-clear").click(function(){
				common.motionDetection.motionAreaCleanAll();
			});			
			$("#setting-motionalarm-metro").click(function() {
				common.motionDetection.getMD();
			});
			$("#mdenable").click(function() {
				if(isChrome){
					$("#motiondetection-vedioctrl").css("display","none");
					$("#mdchromealert").css("display","block");					
				}
				else{
					$("#mdplugin").width(640/*common.playerWidth.width*/);
					$("#mdplugin").height(480/*common.playerWidth.height*/);
					$("#motion-detection-tips").parent().show();
					$("#motion-sensitivity").parent().parent().show();
					$("#setting-contain-motiondetection-ctrl-clear").show();
				}
			});
			$("#mddisable").click(function() {
				$("#mdchromealert").css("display","none");	
				$("#mdplugin").width(1);
				$("#mdplugin").height(1);
				$("#motion-detection-tips").parent().hide();
				$("#motion-sensitivity").parent().parent().hide();
				$("#setting-contain-motiondetection-ctrl-clear").hide();
			});
		},
		initMD: function() {
			if (common.pluginFlag == 1) {
				setTimeout(function() { //延时是为了等待插件在页面上显示出来后才能播放。
					if( MOTION_LIVE_VIEW_FLAG ){return;}
					
					var obj = document.getElementById('mdplugin');				
					
					obj.ip = location.hostname;
					obj.port = common.playerPort;
					//obj.producttype = PRODUCT_TYPE.NC220;
					obj.username = $("#n").attr("value");
					obj.password = /*Base64.decode()*/$("#sec").attr("value");
					obj.streamresolution = STREAMRESOLUTION_VGA;
					
					obj.SetMDAreaIsEnablenew(1);
					obj.MotionDetection(1, Number(common.mdjson.precision)); //灵敏度设置
					for (var i = 1; i <= 25; i++) {
						obj.SetMotionDetectionRegionnew(i, common.mdjson.area[i - 1]); //开启侦测区域
					}
					
					obj.PlayVideo();
					obj.width = common.playerWidth.width;
					obj.height = common.playerWidth.height;
				}, 50)
				/*setTimeout(function() { //延时一定时间MD才能成功启动
					var obj = document.getElementById('mdplugin');
					obj.SetMDAreaIsEnablenew(1);
					obj.MotionDetection(1, Number(common.mdjson.precision)); //灵敏度设置
					for (var i = 1; i <= 25; i++) {
						obj.SetMotionDetectionRegionnew(i, common.mdjson.area[i - 1]); //开启侦测区域
					}
					//obj.SetMotionDetectionEditMode(1); //侦测启动
				}, 2000)*/
			}
		},
		getMD: function() {
			var args = {
				url: '/mdconf_get.fcgi',
				success: function(json) {
					if (json.errorCode == 0) {
						common.mdjson = json;
						json.is_enable == 1 ? $("#mdenable").click() : $("#mddisable").click();
						$("#motion-sensitivity").val(json.precision).change();
						
						common.motionDetection.initMD();
					} else {

					}
					plug.radio.initial($(".setting-contain-motionalarm"));
				},
				error: function(xhr) {

				}
			}
			common.ajax.init(args);
		},
		setMD_noplugin: function(){
			plug.button.disable($("#setting-contain-motiondetection-ctrl-save"));
			var args = {
				url:  '/mdconf_set.fcgi',
				data: {
					"is_enable": $(".detection-radio-setting-selected").val(),
					"precision": $("#motion-sensitivity").val()
				},
				success: function(json) {
					plug.button.enable($("#setting-contain-motiondetection-ctrl-save"));
					if (json.errorCode == 0) {
						plug.window.alert({
							"info": lang.ajax.motiondetection.setSuccess
							/*"afterRemove": function() {
								if ($("#mddisable").hasClass("detection-radio-setting-selected")) {
									$("#mdplugin").css({
										"width": 1,
										"height": 1
									})
								}
							}*/
						});
					} else {
						plug.window.alert({
							"info": lang.ajax.motiondetection.setFailed
						});
					}
				},
				error: function(xhr) {
					plug.button.enable($("#setting-contain-motiondetection-ctrl-save"));
				}
			}
			common.setAjax.init(args);
		},
		setMD: function() {
			plug.button.disable($("#setting-contain-motiondetection-ctrl-save"));
			var obj = document.getElementById('mdplugin');
			var RegionData = [0];
			for (var i = 1; i <= 25; i++) {
				RegionData[i] = obj.GetMotionArea(i);
			}
			var args = {
				url: '/mdconf_set.fcgi',
				data: {
					"is_enable": $(".detection-radio-setting-selected").val(),
					"precision": $("#motion-sensitivity").val(),
					"area1": RegionData[1],
					"area2": RegionData[2],
					"area3": RegionData[3],
					"area4": RegionData[4],
					"area5": RegionData[5],
					"area6": RegionData[6],
					"area7": RegionData[7],
					"area8": RegionData[8],
					"area9": RegionData[9],
					"area10": RegionData[10],
					"area11": RegionData[11],
					"area12": RegionData[12],
					"area13": RegionData[13],
					"area14": RegionData[14],
					"area15": RegionData[15],
					"area16": RegionData[16],
					"area17": RegionData[17],
					"area18": RegionData[18],
					"area19": RegionData[19],
					"area20": RegionData[20],
					"area21": RegionData[21],
					"area22": RegionData[22],
					"area23": RegionData[23],
					"area24": RegionData[24],
					"area25": RegionData[25]
				},
				success: function(json) {
					plug.button.enable($("#setting-contain-motiondetection-ctrl-save"));
					if (json.errorCode == 0) {
						//common.mdjson = json;
						plug.window.alert({
							"info": lang.ajax.motiondetection.setSuccess
							//"afterRemove": function() {
								//if ($("#mddisable").hasClass("detection-radio-setting-selected")) {
									//$("#mdplugin").css({
										//"width": 1,
										//"height": 1
									//})
								//}
							//}
						});
					} else {
						plug.window.alert({
							"info": lang.ajax.motiondetection.setFailed
						});
					}
				},
				error: function(xhr) {
					plug.button.enable($("#setting-contain-motiondetection-ctrl-save"));
				}
			}
			common.setAjax.init(args);
		},
		motionAreaCleanAll : function(){
			var obj = document.getElementById('mdplugin');
			obj.MotionAreaCleanAll();
		}
	},
	logout: {
		init: function() {
			common.logout.bind()
		},
		bind: function() {
			$("#logout").click(function() {
				plug.window.confirm({
					info: lang.ajax.logout.tips,
					btnConfirm: lang.plug.Logout,
					confirm: function() {
						common.logout.ajax()
					}
				})
			})
		},
		ajax: function() {
			var a = {
				url: "/logout.fcgi",
				data: {
					token: $("#token").attr("value")
				},
				success: function(json) {
					if (json.errorCode == 0) {
						if (location.search.indexOf("?streamPort=") == 0) {
							location.href = "/login.html" + location.search;
						} else {
							location.href = "/login.html";
						}
					} else {
						plug.window.alert({
							"info": lang.ajax.logout.failed
						});
					}
				},
				error: function(a) {}
			};
			common.setAjax.init(a)
		}
	}
}