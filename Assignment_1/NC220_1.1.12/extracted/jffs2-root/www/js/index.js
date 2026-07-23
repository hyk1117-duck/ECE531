$(document).ready(function() {
	main.init();
})
var main = {
	dateseter_sec: null, //
	dateseter_min: null,
	dateseter_hour: null,
	dateseter_interval: null, //datesetting计时器间隔
	dateTimeManually: null, //手动时间设置标志
	ajaxuploader_fileinfo: null,
	browserVision: null, //浏览器版本
	oldTimeZone: null, //时间设置中时间根据时区变更
	newTimeZone: null,
	selectedTaskId: null,
	cameraName: null,
	motionDetectionJson: null, //移动侦测后台设置数据
	wirelessStatusInterval: null, //connect后检测wirless状态
	wirelessCount: null, //检测次数
	pppoeIp: null, //pppoeip
	pppoeStateInterval: null, //pppoe循环检测
	showLoadingInterval: null, //载入中处理循环
	ftpShowLoadingInterval: null, //ftp载入中处理循环
	smtpShowLoadingInterval: null, //smtp载入中处理循环
	pppoeShowLoadingInterval: null, //pppoe载入中处理循环
	pppoeLoopLoginCount: null, //pppoe执行登录请求计数
	noipShowLoadingInterval: null, //noip载入中处理循环
	dyndnsShowLoadingInterval: null, //dyndns载入中处理循环
	comexeShowLoadingInterval: null, //comexe载入中处理循环
	noipLoopLoginCount: null, //noip执行登录请求计数
	dyndnsLoopLoginCount: null, //dyndns执行登录请求计数
	comexeLoopLoginCount: null, //comexe执行登录请求计数
	noipStateInterval: null, //noip循环检测
	dyndnsStateInterval: null, //dyndns循环检测
	comexeStateInterval: null, //comexe循环检测
	progressBarInterval: null, //进度条百分比
	HtmlEncode: function(text)  
  	{  
         return   text.replace(/&/g,'&amp').replace(/\"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');  
  	},

	init: function() {
		main.lang();
		
		main.selectCreat.init();
		main.setting.init();
		plug.select.initial($("body"));
		//common.afterPlugInitBind();		
		common.motionDetection.init();
	},
	lang : function(){
		$(".lang_title").each(function(i){
			$(this).attr("title",lang.title.admin[i]);				
		});
		$(".lang_option").each(function(i){
			$(this).text(lang.options.admin[i]);				
		});
		$(".lang_button").each(function(i){
			$(this).attr("value",lang.button.admin[i]);				
		});
		$(".lang").each(function(i){
			$(this).text(lang.admin[i]);		 
		});
	},
	selectCreat: {
		init: function() {
			main.selectCreat.option({
				holder: "recurring-start-stands-select",
				values: [1, 2, 3, 4, 5, 6],
				html: ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"]
			});
			main.selectCreat.option({
				holder: "recurring-start-week-select",
				values: [0, 1, 2, 3, 4, 5, 6],
				html: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
			});
			main.selectCreat.option({
				holder: "recurring-start-month-select",
				values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				html: ["January", "February", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "December"]
			});
			main.selectCreat.option({
				holder: "recurring-start-hour-select",
				values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
				html: ["0", "01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
			});
			main.selectCreat.option({
				holder: "recurring-start-min-select",
				values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
				39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
				html: ["0", "01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
				39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
			});
			// main.selectCreat.option({
			// 	holder: "sync-manual-time-Recurring-select",
			// 	values: [-120, -90, -60, -30, 30, 60, 90, 120],
			// 	html: ["-2:00", "-1:30", "-1:00", "-0:30", "+0:30", "+1:00", "+1:30", "+2:00"]
			// });
			main.selectCreat.option({
				holder: "sync-manual-time-Recurring-select",
				values: [ 30, 60, 90, 120],
				html: ["+0:30", "+1:00", "+1:30", "+2:00"],
				selected: 1
			});
			
			//plug.select.initial($("#sync-manual-time-Recurring").parent());
			
			main.selectCreat.option({
				holder: "recurring-end-stands-select",
				values: [1, 2, 3, 4, 5, 6],
				html: ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"]
			});
			main.selectCreat.option({
				holder: "recurring-end-week-select",
				values: [0, 1, 2, 3, 4, 5, 6],
				html: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
			});
			main.selectCreat.option({
				holder: "recurring-end-month-select",
				values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				html: ["January", "February", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "December"]
			});
			main.selectCreat.option({
				holder: "recurring-end-hour-select",
				values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
				html: [0, "01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
			});
			main.selectCreat.option({
				holder: "recurring-end-min-select",
				values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
				39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
				html: [0, "01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
				39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
			});
			main.selectCreat.option({
				holder: "datemode-start-year-select",
				values: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
				html: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]
			});
			main.selectCreat.option({
				holder: "datemode-start-month-select",
				values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				html: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
			});
			//每月日期限定在main.setting.sysDataTime.bind();中有定义
			main.selectCreat.option({
				holder: "datemode-start-day-select",
				values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
				html: ["01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
			});
			main.selectCreat.option({
				holder: "datemode-start-hour-select",
				values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
				html: [0, "01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
			});
			main.selectCreat.option({
				holder: "datemode-start-min-select",
				values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
				39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
				html: [0, "01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
				39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
			});
			main.selectCreat.option({
				holder: "datemode-start-sec-select",
				values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
				39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
				html: [0, "01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
				39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
			});
			main.selectCreat.option({
				holder: "setting-wireless-channel-select",
				values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
				html: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
			});
			main.selectCreat.option({
				holder: "setting-wirelessex-extmaxcli-select",
				values: [32, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				html: ["Unlimited", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				css: {
					"width": 212,
					"padding": 4
				}
			});
			main.selectCreat.option({
				holder: "setting-wirelessmanually-wepkeyindex-select",
				values: [1, 2, 3, 4],
				html: [1, 2, 3, 4],
				css: {
					"width": 212,
					"padding": 4
				}
			});
			main.selectCreat.option({
				holder: "setting-wirelessex-auth-select",
				values: ["None", "WEP", "WPA-PSK", "WPA2-PSK", "WPA/WPA2-PSK"],
				html: ["None", "WEP", "WPA-PSK", "WPA2-PSK", "WPA/WPA2-PSK"],
				css: {
					"width": 212,
					"padding": 4
				}
			});
			main.selectCreat.option({
				holder: "setting-wirelessmanually-auth-select",
				values: ["None", "WEP", "WPA-PSK", "WPA2-PSK", "WPA/WPA2-PSK"],
				html: ["None", "WEP", "WPA-PSK", "WPA2-PSK", "WPA/WPA2-PSK"],
				css: {
					"width": 210,
					"padding": 4
				}
			});
			main.selectCreat.option({
				holder: "setting-wirelessmanually-encp-select",
				values: ["TKIPAES", "AES", "TKIP"],
				html: ["Automatic", "AES", "TKIP"],
				css: {
					"width": 210,
					"padding": 4
				}
			});

			main.selectCreat.option({
				holder: "setting-wirelessex-encp-select",
				values: ["TKIPAES", "AES", "TKIP"],
				html: ["Automatic", "AES", "TKIP"],
				css: {
					"width": 212,
					"padding": 4
				}
			});
			main.selectCreat.option({
				holder: "advance-smtp-server-interval-select",
				values: ["20", "30", "60", "120", "300", "600", "900", "1800", "3600", "7200", "14400", "21600", "43200", "86400"],
				html: ["20s", "30s", "1m", "2m", "5m", "10m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "24h"],
				css: {
					"padding": 1,
					"width": 100
				}
			});
		},
		option: function(args) {
			main.selectCreat.creat(args.holder, args.values, args.html, args.css, args.selected);
		},
		creat: function(holder, values, html, css, selected) {
			var id = holder.split("-select")[0];
			var a = "";
			a += "<select id='" + id + "'>";
			for (var i = 0; i < html.length; i++) {
				a += "<option value='" + values[i] + "' " + (i == selected ? "selected='selected'":"")+ " >";
				a += html[i];
				a += "</option>";
			}
			a += "</select>";
			$("#" + holder).append(a);
			if (css) {
				$("#" + id).css(css);
			}
		}
	},
	setting: {
		init: function() {
			main.setting.bind();
			main.setting.ddns.init();
			main.setting.ipSetting.init();
			main.setting.smtpAlarm.init();
			main.setting.ftpAlarm.init();
			main.setting.sysDataTime.init();
			main.setting.cloudSetting.init();
			main.setting.sysManagement.init();
			main.setting.status.init();
			main.setting.wireless.init();
			main.setting.led.init();
			setTimeout(function() {
				main.setting.log.init();
				main.setting.wireless.scanWireLess();
				main.setting.userManage.init();

			}, 10);
		},
		bind: function() {
			$(".setting-title").click(function() {
				$(".setting-contain-cell").hide();
				var holder = ".setting-contain-" + $(this).attr("id").split("-")[1];
				$(holder).show();
			});
		},
		status: {
			init: function() {
				//main.setting.userManage.getReceiver();
				main.setting.status.bind();
			},
			bind: function() {
				$(".setting-status-metro").click(function() {
					main.setting.userManage.getReceiver();
					main.setting.wireless.getWireless();
					main.setting.ipSetting.ipget();
					main.setting.cloudSetting.gettingAjax();
				});
			}
		},
		userManage: {
			init: function() {
				main.setting.userManage.initAjax();
				main.setting.userManage.bind();
			},
			tableInit: function(json) {
				sevenTables.init({
					holder: ".setting-contain-usermanage-ctrl-table",
					background: "none",
					column: {
						count: 2,
						width: [216, 216],
						display: ["block", "block"]
					},
					data: {
						json: json,
						option: ["name", "type"]
					},
					row: 5,
					checkbox: {
						enable: false,
						width: 50
					},
					title: ["User Name", "User Group"],
					allowAdjustColWidth: {
						enable: false,
						column: [0, 1, 2],
						minWidth: 100,
						maxWidth: 300
					},
					mouseSelect: true,
					pagination: {
						enable: true,
						paginationCount: 15, //默认每页显示条目数若paginationPageList为true则此选项失效
						paginationPageList: {
							enable: true,
							option: [12, 20, 30]
						}
					}
				});
			},
			bind: function() {
				$("#setting-contain-usermanage-ctrl-add").click(function() {
					$(".setting-contain-usermanage-ctrl-cell").hide();
					$(".setting-contain-usermanage-ctrl-adduser").fadeIn();
				});
				$("#usermanage-creatuser-save").click(function() {
					main.setting.userManage.creatUserVaild() == true ? main.setting.userManage.creatUser() : null
				});
				$("#usermanage-chanpassword-save").click(function() {
					main.setting.userManage.changepwdValid() == true ? main.setting.userManage.editUser() : null;
				});
				$("#usermanage-delete-confirm").click(function() {

				});
				$("#setting-contain-usermanage-ctrl-cpwd").click(function() {
					$(".setting-contain-usermanage-ctrl-cell").hide();
					$(".setting-contain-usermanage-ctrl-changepassword").fadeIn();
				});
				$("#setting-contain-usermanage-ctrl-del").click(function(event) {
					$(".setting-contain-usermanage-ctrl-cell").hide();
					main.setting.userManage.deleteUser();
				});
			},
			getReceiver: function() {
				var args = {
					url: '/getreceiver.fcgi',
					success: function(json) {
						if (json.errorCode == 0) {
							var receiverlength = 0;
							for (var i = 0; i < json.receivers.length; i++) {
								if (json.receivers[i].indexOf("video") == 0) {
									receiverlength++;
								}
							}
							$("#status-viewer").text(receiverlength);
						} else {
							$("#status-viewer").text("-")
						}
					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
			},
			changepwdValid: function() {
				if ($("#accountmanage-changepwd-username").text() == "admin") {
					var b = false;
					var a = common.validInfo((valid.password($("#usermanage-changepassword-oldpassword").val()))) && common.validInfo((valid.password($("#usermanage-changepassword-newpassword").val())));
					if (a == true) {
						if ($("#usermanage-changepassword-newpassword").val() != $("#usermanage-changepassword-confirmpassword").val()) {
							plug.window.alert({
								"info": lang.valid.password.confirm
							});
						} else {
							b = true;
						}
					}
					return a && b;
				} else {
					var b = false;
					var a = common.validInfo(valid.password($("#usermanage-changepassword-newpassword").val()));
					if (a == true) {
						if ($("#usermanage-changepassword-newpassword").val() != $("#usermanage-changepassword-confirmpassword").val()) {
							plug.window.alert({
								"info": lang.valid.password.confirm
							});
						} else {
							b = true;
						}
					}
					return a && b;
				}
			},
			creatUserVaild: function() {
				var b = false;
				var a = common.validInfo((valid.accountUsername($("#usermanage-creatuser-username").val()))) && common.validInfo((valid.password($("#usermanage-creatuser-password").val())));
				if (a == true) {
					if ($("#usermanage-creatuser-password").val() != $("#usermanage-creatuser-cpassword").val()) {
						plug.window.alert({
							"info": lang.valid.password.confirm
						});
					} else {
						b = true;
					}
				}
				return a && b;
			},
			initAjax: function() {
				var args = {
					url: '/alluser.fcgi',
					success: function(json) {
						main.setting.userManage.tableInit(json);
						$(".setting-contain-usermanage-ctrl-table .sevenTables-tbody-datagrid-row").click(function() {
							var $holder = $("#accountmanage-changepwd-username"),
								$inputholder = $(".usermanage-changepassword-oldpassword-outer");
							$holder.text($(this).find("td:eq(0) .datagrid-cell-show").text());
							if ($holder.text() == "admin") {
								$inputholder.show();
							} else {
								$inputholder.hide();
							}
						})
					},
					error: function(xhr) {
						var json = [{
							"name": "seven1",
							"type": "amdin1"
						}, {
							"name": "seven2",
							"type": "admin2"
						}];
					}
				}
				common.ajax.init(args);
			},
			refresh: function() {
				var args = {
					url: '/alluser.fcgi',
					success: function(json) {
						var holder = $(".setting-contain-usermanage-ctrl-table").find(".datagrid-btable")
						var tablenum = holder.attr("id").split("seventables-nums-")[1];
						sevenTables.refresh(json, tablenum);
						$(".setting-contain-usermanage-ctrl-table .sevenTables-tbody-datagrid-row").click(function() {
							$("#accountmanage-changepwd-username").text($(this).find("td:eq(0) .datagrid-cell-show").text());
							var $holder = $("#accountmanage-changepwd-username"),
								$inputholder = $(".usermanage-changepassword-oldpassword-outer");
							$holder.text($(this).find("td:eq(0) .datagrid-cell-show").text());
							if ($holder.text() == "admin") {
								$inputholder.show();
							} else {
								$inputholder.hide();
							}
						})
					},
					error: function(xhr) {
						var json = [{
							"name": "seven1",
							"type": "amdin1"
						}, {
							"name": "seven2",
							"type": "admin2"
						}];
					}
				}
				common.ajax.init(args);
			},
			creatUser: function() {
				plug.button.disable($("#usermanage-creatuser-save"));
				var $username = $("#usermanage-creatuser-username"),
					$password = $("#usermanage-creatuser-password");
				var args = {
					url: '/adduser.fcgi',
					data: {
						"Username": $username.val(),
						"Password": Base64.encode($password.val()),
						"Type": "user"
					},
					success: function(json) {
						plug.button.enable($("#usermanage-creatuser-save"));
						if (json.errorCode == 0) {
							main.setting.userManage.refresh();
							$username.val("");
							$password.val("");
							$("#usermanage-creatuser-cpassword").val("");
						} else if (json.errorCode == 1007) {
							plug.window.alert({
								"info": lang.ajax.creatUser.passwordweak
							});
						} else if (json.errorCode == 1010) {
							plug.window.alert({
								"info": lang.ajax.creatUser.notadmin
							});
						} else if (json.errorCode == 1019) {
							plug.window.alert({
								"info": lang.ajax.creatUser.moreaccount
							})
						} else if (json.errorCode == 1013) {
							plug.window.alert({
								"info": lang.ajax.creatUser.accountused
							})
						} else {
							plug.window.alert({
								"info": lang.ajax.creatUser.failed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#usermanage-creatuser-save"));
						plug.window.alert({
							"info": xhr
						});
					}
				}
				common.setAjax.init(args);
			},
			deleteUser: function() {
				$("#accountmanage-changepwd-username").text("");
				main.selectedTaskId = sevenTables.selectedTaskId;
				if (main.selectedTaskId.length == 0) {
					plug.window.alert({
						"info": lang.ajax.removeUser.notarget
					});
					return false;
				} else {
					plug.window.confirm({
						"info": lang.ajax.removeUser.confirm,
						"btnConfirm": lang.plug.Delete,
						"confirm": function() {
							var holder = $("#sevenTables-setting-contain-usermanage-ctrl-table"),
								num = holder.find(".datagrid-btable").attr("id").split("nums-")[1];
							var usernames = sevenTables.privateTables["table" + num].data.json[Number(main.selectedTaskId[0])].name;
							if (main.selectedTaskId.length > 1) {
								for (var i = 1; i < main.selectedTaskId.length; i++) {
									usernames += ",";
									usernames += sevenTables.privateTables["table" + num].data.json[main.selectedTaskId[i]].name;
								}
							}
							plug.button.disable($("#setting-contain-usermanage-ctrl-del"));
							var args = {
								url: '/delmultiuser.fcgi',
								data: {
									"Usernames": usernames
								},
								success: function(json) {
									plug.button.enable($("#setting-contain-usermanage-ctrl-del"));
									if (json.resultArray[0].errorCode == 1009) {
										plug.window.alert({
											"info": lang.ajax.removeUser.cannotremove
										})
									} else if (json.resultArray[0].errorCode == 1012) {
										plug.window.alert({
											"info": lang.ajax.removeUser.noexist
										});
									}
									common.validatedSign.changeVal(json.token);
									main.selectedTaskId = [];
									main.setting.userManage.refresh();
									$(".setting-contain-usermanage-ctrl-cell").removeClass("setting-contain-usermanage-ctrl-selected").slideUp();
									setTimeout(function() {
										$(".setting-contain-usermanage-ctrl-button").css('border-bottom', '1px solid #fff');
									}, 500)
								},
								error: function(xhr) {
									plug.button.enable($("#setting-contain-usermanage-ctrl-del"));
									plug.window.alert({
										"info": xhr
									});
								}
							}
							common.setAjax.init(args);
						},
						"cancel": function() {
							main.selectedTaskId = [];
						}
					});

				}

			},
			editUser: function() {
				plug.button.disable($("#usermanage-chanpassword-save"));
				var args = {
					url: '/setpass.fcgi',
					data: {
						"Username": $("#accountmanage-changepwd-username").text(),
						"OldPassword": Base64.encode($("#usermanage-changepassword-oldpassword").val()),
						"NewPassword": Base64.encode($("#usermanage-changepassword-newpassword").val())
						//,"token": $("#token").attr("value")
					},
					success: function(json) {
						plug.button.enable($("#usermanage-chanpassword-save"));
						if (json.errorCode == 0) {
							if ($("#accountmanage-changepwd-username").text() == "admin") {
								window.location.href = "/login.html";
							} else {
								plug.window.alert({
									"info": lang.ajax.changeUserPwd.success
								});
							}
						} else if (json.errorCode == 1011) {
							plug.window.alert({
								"info": lang.ajax.changeUserPwd.oldpwdwrong
							});
						} else if (json.errorCode == 1024) {
							plug.window.alert({
								"info": lang.ajax.changeUserPwd.samepwd
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.changeUserPwd.failed
							})
						}

					},
					error: function(xhr) {
						plug.button.enable($("#usermanage-chanpassword-save"));
						plug.window.alert({
							"info": xhr
						});
					}
				}
				common.setAjax.init(args);
			}

		},
		cloudSetting: {
			init: function() {
				main.setting.cloudSetting.bind();
				//main.setting.cloudSetting.gettingAjax();
			},
			bind: function() {
				$("#accept").attr("checked", true);
				$("#cloud-setting-submit").click(function() {
					main.setting.cloudSetting.bindValid() == true ? main.setting.cloudSetting.settingAjax() : null;
					//main.setting.cloudSetting.settingAjax();
				});
				// $(".setting-contain-cloud-register").click(function() {
				// 	plug.checkbox.initial($("#setting-cloud-register"));
				// 	$("#setting-cloud-register").show();
				// 	$("#setting-cloud-login").hide();
				// });
				$("#cloud-register-cancle").click(function(event) {
					$("#setting-cloud-register").hide();
					$("#setting-cloud-login").show();
				});
				$(".setting-cloud-metro").click(function(event) {
					$("#cloud-register-cancle").click();
				});
				$("#cloud-register-regist").click(function() {
					//main.setting.cloudSetting.regValid() == true ? main.setting.cloudSetting.register() : null;
				});
				$("#cloud-setting-rebind").click(function() {
					main.setting.cloudSetting.statusShow(0);
				});
				$("#cloud-setting-unbind").click(function() {
					main.setting.cloudSetting.unbind();
					//	main.setting.sysDataTime.dmtSet.gettingAjax();
				});
				$("#cloud-setting-refresh").click(function() {
					main.setting.cloudSetting.refresh();
				});
			},
			bindValid: function() {
				//var a = common.validInfo((valid.cloudUsername($("#cloud-setting-username").val()))) && common.validInfo((valid.inPassword($("#cloud-setting-pwd").val()))) && common.validInfo((valid.cameraname($("#cloud-setting-cameraname").val())));
				//var a = common.validInfo((valid.inPassword($("#cloud-setting-pwd").val()))) && common.validInfo((valid.cameraname($("#cloud-setting-cameraname").val())));
				//var a = common.validInfo((valid.cameraname($("#cloud-setting-cameraname").val())));
				//return a;
				var camname = $("#cloud-setting-cameraname").val();
				var temp = $.trim(camname);
				var a = common.validInfo((valid.cameraname(temp)));
				return a;				
			},
			regValid: function() {
				var b = false;

				var email = $("#cloud-register-email").val();
				if  (email.length < 1 || email.length > 32) {
					plug.window.alert({
						info: lang.valid.email.limit
					});
					return;
				} else if (!valid.email(email).pass) {
					plug.window.alert({
						info: lang.valid.email.invalid
					});
					return;
				}

				var a = common.validInfo((valid.cloudUsername($("#cloud-register-username").val()))) 
						&& common.validInfo((valid.cloudPassword($("#cloud-register-password").val())));
				if (a == true) {
					if ($("#cloud-register-password").val() != $("#cloud-register-cpwd").val()) {
						plug.window.alert({
							"info": lang.valid.password.confirm
						});
						b = false;
					} else if (!$("#accept").attr("checked")) {
						plug.window.alert({
							"info": lang.valid.password.accept
						});
						b = false;
					} else {
						b = true;
					}
				}
				return a && b;
			},
			loading: function() {
				$(".cloud-server-status").hide();
				$(".tips-setting-loading").remove();
				var a = "";
				a += "<div class='tips-setting-loading'>",
				a += "<span class='tips-setting-loading-img'>",
				a += "</span>",
				a += "<span class='tips-setting-loading-font-out'>",
				a += "<span class='tips-setting-loading-font-inner'>",
				a += lang.html.cloud.loading,
				a += "</span>",
				a += "</span>",
				a += "</div>";
				$("#setting-cloud-login .setting-contain-inner-left").append(a);
			},
			gettingAjax: function() {
				var args = {
					url: '/get_cloud.fcgi',
					timeout: 30000,
					success: function(json) {
						//$("#cloud-setting-username").val(json.username);
						if (json.status == 1 && json.binded == 1) {
							setTimeout(function() {
								main.setting.cloudSetting.gettingAjax();
							}, 1000);
						} else {
							$("#cloud-info-username").text(json.username);
							$("#cloud-setting-cameraname").val(json.cameraname);
							$("#cloud-info-camname").text(json.cameraname);
							$("#setting-cloud-login .setting-contain-inner-left .tips-setting-loading").remove();
							main.setting.cloudSetting.statusShow(json.status, json.binded);
						}

					},
					error: function(xhr) {
						main.setting.cloudSetting.statusShow(3, 1);

						$("#setting-cloud-login .setting-contain-inner-left .tips-setting-loading").remove();
					}
				}
				common.ajax.init(args);
			},
			refresh: function() {
				main.setting.cloudSetting.loading();
				plug.button.disable($("#cloud-setting-refresh"));
				$("#cloud-setting-refresh").show();
				var args = {
					url: '/cloud.fcgi',
					timeout: 30000,
					data: {
						"command": "refresh"
					},
					success: function(json) {
						plug.button.enable($("#cloud-setting-refresh"));
						$("#cloud-setting-refresh").show();
						if (json.status == 1 && json.binded == 1) {
							main.setting.cloudSetting.gettingAjax();
						} else {
							$("#setting-cloud-login .setting-contain-inner-left .tips-setting-loading").remove();
							main.setting.cloudSetting.statusShow(json.status, json.binded);
						}
					},
					error: function(xhr) {
						main.setting.cloudSetting.statusShow(3, 1);
						plug.button.enable($("#cloud-setting-refresh"));
						$("#cloud-setting-refresh").show();
						$("#setting-cloud-login .setting-contain-inner-left .tips-setting-loading").remove();
					}
				}
				common.setAjax.init(args);
			},
			statusShow: function(status, binded) {
				$("#cloud-setting-refresh").hide();
				if (status == 3 && binded == 1) { //设备断线无法连接到云平台
					$(".cloud-server-status").hide();
					$("#cloud-bind-error").show();
					var a = "";
					a += "<p>" + lang.html.cloud.disconnect1 + "</p>",
					a += "<p>" + lang.html.cloud.disconnect2 + "</p>";
					$("#cloud-bind-error .setting-contain-cloud-introduce").html(a);
					$(".setting-cloud-button").hide();
					$("#cloud-setting-refresh").show();
					$("#status-cloudConnectStatus").text(lang.state.disconnect);
					$("#status-cloudCameraName").text("-");
					//$("#status-cloudEmail").text("");
					$("#status-cloudUser").text($("#cloud-info-username").text() || "-");
				} else if (status == 4 && binded == 1) { //云平台账户密码被更改，账户登录失败
					$(".cloud-server-status").hide();
					$("#cloud-bind-error").show();
					var a = "";
					a += "<p>" + lang.html.cloud.loginfail1 + "</p>",
					a += "<p>" + lang.html.cloud.loginfail2 + "</p>";
					$("#cloud-bind-error .setting-contain-cloud-introduce").html(a);
					$(".setting-cloud-button").hide();
					$("#cloud-setting-rebind").show();
					$("#status-cloudConnectStatus").text(lang.state.disconnect);
					$("#status-cloudCameraName").text("-");
					//$("#status-cloudEmail").text("");
					$("#status-cloudUser").text($("#cloud-info-username").text() || "-");
				} else if (status == 1 && binded == 1) { //正在链接云平台
					$("#cloud-connection-status").html(lang.html.cloud.connecting);
					$(".cloud-server-status").hide();
					$("#cloud-bind-info").show();
					$(".setting-cloud-button").hide();
					$("#cloud-setting-refresh").show();
					$("#status-cloudConnectStatus").text(lang.state.connecting);
					$("#status-cloudCameraName").text("-");
					//$("#status-cloudEmail").text("");
					$("#status-cloudUser").text($("#cloud-info-username").text() || "-");
				} else if (status == 2 && binded == 1) { //已经链接到云平台
					$(".cloud-server-status").hide();
					$("#cloud-bind-info").show();
					$(".setting-cloud-button").hide();
					$("#cloud-setting-unbind").show();
					$("#status-cloudConnectStatus").text(lang.state.connected);
					$("#status-cloudCameraName").text($("#cloud-setting-cameraname").val() || "-");
					//$("#status-cloudEmail").text("");
					$("#status-cloudUser").text($("#cloud-info-username").text() || "-");
				} else { //未绑定
					$(".cloud-server-status").hide();
					$("#cloud-bind-login").show();
					$(".setting-cloud-button").hide();
					$("#cloud-setting-submit").show();
					$("#status-cloudConnectStatus").text(lang.state.noregister);
					$("#status-cloudCameraName").text("-");
					//$("#status-cloudEmail").text("");
					$("#status-cloudUser").text("-");
				}
			},
			register: function() {
				plug.button.disable($("#cloud-register-regist"));
				var args = {
					url: '/cloud.fcgi',
					timeout: 30000,
					data: {
						"command": "regusr",
						"username": $("#cloud-register-username").val(),
						"password": $("#cloud-register-password").val(),
						"account": $("#cloud-register-email").val()
					},
					success: function(json) {
						plug.button.enable($("#cloud-register-regist"));
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.cloudReg.success
							});
							$("#cloud-setting-username").val($("#cloud-register-email").val());
							$("#cloud-setting-pwd").val($("#cloud-register-password").val());
							$("#cloud-register-email").val("");
							$("#cloud-register-username").val("");
							$("#cloud-register-password").val("");
							$("#cloud-register-cpwd").val("");
							$("#setting-cloud-register").hide();
							$("#setting-cloud-login").show();
						} else if (json.errorCode == 1084) {
							plug.window.alert({
								"info": lang.ajax.cloudReg.emailUsed
							});
						} else if (json.errorCode == 1085) {
							plug.window.alert({
								"info": lang.ajax.cloudReg.usernameUsed
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.cloudReg.failed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#cloud-register-regist"));
					}
				}
				common.setAjax.init(args);
			},
			settingAjax: function() {
				plug.button.disable($("#cloud-setting-submit"));

				var email = $("#cloud-setting-username").val();
				if (email == "E-mail/Username") {
					plug.window.alert({
						info: lang.valid.cloudUsername.empty
					});
					plug.button.enable($("#cloud-setting-submit"));
					return;
				}else if (email.length < 1 || email.length > 64) {
					plug.window.alert({
						info: lang.valid.cloudUsername.limit
					});
					plug.button.enable($("#cloud-setting-submit"));
					return;
				} //else if (!valid.email(email).pass && !valid.cloudUsername(email).pass) {
					//plug.window.alert({
						//info: lang.valid.cloudUsername.invalid
					//});
					//plug.button.enable($("#cloud-setting-submit"));
					//return;
				//}

				var args = {
					url: '/cloud.fcgi',
					timeout: 30000,
					data: {
						"command": "bind",
						"username": $("#cloud-setting-username").val(),
						"password": $("#cloud-setting-pwd").val(),
						"cameraname": $("#cloud-setting-cameraname").val()
					},
					success: function(json) {
						plug.button.enable($("#cloud-setting-submit"));
						$("#cloud-setting-submit").show();
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.cameraBind.bindSuccess
							});
							$("#cloud-info-username").text($("#cloud-setting-username").val());
							$("#cloud-info-camname").text($("#cloud-setting-cameraname").val());
							main.setting.cloudSetting.statusShow(2, 1);
							$("#status-model").text($("#cloud-setting-cameraname").val());
						//} else if (json.errorCode == -20501) {
						} else if (json.errorCode == 1080) {
							plug.window.alert({
								"info": lang.ajax.cameraBind.networdbreak
							});
						} else if (json.errorCode == -20200) {
							plug.window.alert({
								info: lang.valid.email.invalid
							});
						} else if (json.errorCode == -20201) {
							console.log("Invalid telephone number");

						} else if (json.errorCode == -20604) {
							console.log("The account is not email or telephone number");
							
						//} else if (json.errorCode == -20601) {
						} else if (json.errorCode == 1081) {
							plug.window.alert({
								//info: lang.valid.cloudPassword.invalid
								info: lang.ajax.cameraBind.pwderror
							});
							
						//} else if (json.errorCode == -20600) {
						} else if (json.errorCode == 1082) {
							plug.window.alert({
								info: lang.ajax.cameraBind.usrerror
							});
							
						//} else if (json.errorCode == -20506) {
						} else if (json.errorCode == 1083) {
							plug.window.alert({
								info: lang.ajax.cameraBind.binded
							});
						//} else if (json.errorCode == -20507) {
						} else if (json.errorCode == 1088) {
							plug.window.alert({
								info: lang.ajax.cameraBind.unbinded
							});
						} else if (json.errorCode == -20661) {
							plug.window.alert({
								info: lang.ajax.cameraBind.lock
							});
						} else if (json.errorCode == 1084){
							plug.window.alert({
								info: lang.ajax.cameraBind.accountexist
							});
						}else if (json.errorCode == 1085){
							plug.window.alert({
								info: lang.ajax.cameraBind.loginnameexist
							});
						}else if (json.errorCode == 1086){
							plug.window.alert({
								info: lang.ajax.cameraBind.cameranameinvalid
							});
						}else if (json.errorCode == 1087){
							plug.window.alert({
								info: lang.ajax.cameraBind.databaseerror
							});
						}else if (json.errorCode == 1089){
							plug.window.alert({
								info: lang.ajax.cameraBind.requesttimeout
							});
						}else {
							plug.window.alert({
								"info": lang.ajax.cameraBind.bindFailed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#cloud-setting-submit"));
					}
				}
				common.setAjax.init(args);
			},
			unbind: function(mode) {
				plug.button.disable($("#cloud-setting-unbind"));
				$("#cloud-setting-unbind").show();
				var args = {
					url: '/cloud.fcgi',
					data: {
						"command": "unbind"
					},
					timeout: 30000,
					success: function(json) {
						plug.button.enable($("#cloud-setting-unbind"));
						$("#cloud-setting-unbind").show();
						if (json.errorCode == 0) {
							// plug.window.alert({
							// 	"info": lang.ajax.cameraBind.unbindSuccess
							// });
							main.setting.cloudSetting.statusShow(0);
						} else if (json.errorCode == -20501) {
							console.log("Illigal device");

						} else if (json.errorCode == -20200) {
							plug.window.alert({
								info: lang.valid.email.invalid
							});

						} else if (json.errorCode == -20201) {
							console.log("Invalid telephone number");

						} else if (json.errorCode == -20604) {
							console.log("The account is not email or telephone number");

						} else if (json.errorCode == -20600 ) {
							plug.window.alert({
								info: lang.ajax.removeUser.noexist
							});

						} else {
							plug.window.alert({
								"info": lang.ajax.cameraBind.unbindFailed
							});
						}
		
					},
					error: function(xhr) {
						plug.button.enable($("#cloud-setting-unbind"));
						$("#cloud-setting-unbind").show();
					}
				}
				common.setAjax.init(args);
			}
		},
		ipSetting: {
			init: function() {
				main.setting.ipSetting.bind();
				main.setting.ipSetting.ipget();
				main.setting.ipSetting.fwInfoGet();
				//				main.setting.ipSetting.pppoeStateDetect();
			},
			loading: function() {

			},
			bind: function() {
				$("#ipsetting-staticsubmask").blur(function() {
					valid.mask($(this).val());
				})
				$(".setting-ip-metro").click(function() {
					main.setting.ipSetting.ipget();
				});
				//plug.button.enable($("#setting-contain-ip-ctrl-reset"));
				//plug.button.enable($("#setting-contain-ip-network-ctrl-save"));
				//$("#setting-contain-ip-ctrl-reset").attr("disabled", false);
				//$("#setting-contain-ip-network-ctrl-save").attr("disabled", false);
				$("#setting-contain-ip-network-ctrl-save").click(function() {
					main.setting.ipSetting.ipsetValid.valid() == true ? main.setting.ipSetting.ipset() : null;
				});
				$("#setting-ip-metro").click(function() {
					$(".basic-setting-ip-contain").show();
					$("#ipsetting-ipmodel-dynamic").show();
				});
				$("#setting-basic-ip-metro").click(function() {
					$(".basic-setting-ip-contain").hide();
					$("#ipsetting-ipmodel-dynamic").hide();
				});
				$("#ipmodel-static").click(function() {
					$(".setting-contain-ip-ipmodel-choice-cell").hide();
					$("#ipsetting-ipmodel-static").show();
				});
				$("#ipmodel-dynamic").click(function() {
					$(".setting-contain-ip-ipmodel-choice-cell").hide();
					if ($(".basic-setting-ip-contain").css("display") != "none") {
						$("#ipsetting-ipmodel-dynamic").show();
					}
					$("#dhcp-fallback-enable").hide();
				});
				$(".ip-radio-setting").click(function() {
					$(".ip-radio-setting").removeClass("ip-radio-setting-selected");
					$(this).addClass("ip-radio-setting-selected");
				});
				$(".pppoe-radio-setting").click(function() {
					$(".pppoe-radio-setting").removeClass("pppoe-radio-setting-selected");
					$(this).addClass("pppoe-radio-setting-selected");
				});
				$("#pppoe-enable").click(function() {
					$("#pppoe-setting-cotain").show();
				});
				$("#pppoe-disable").click(function() {
					$("#pppoe-setting-cotain").hide();
				});
				$("#ipsetting-pppoelogin").click(function() {
					main.setting.ipSetting.pppoeConnect();
				});
				$("#ipsetting-pppoelogout").click(function() {
					main.setting.ipSetting.pppoeDisconnect();
				});
				$(".bonjour-radio-setting").click(function() {
					$(".bonjour-radio-setting").removeClass("bonjour-radio-setting-selected");
					$(this).addClass("bonjour-radio-setting-selected");
				});
				$(".upnp-radio-setting").click(function() {
					$(".upnp-radio-setting").removeClass("upnp-radio-setting-selected");
					$(this).addClass("upnp-radio-setting-selected");
				});
			},
			ipsetValid: {
				valid: function() {
					return main.setting.ipSetting.ipsetValid.ip() && common.validInfo(valid.port($("#ip-setting-httpport").val())) && main.setting.ipSetting.ipsetValid.pppoe(); /*&& main.setting.ipSetting.ipsetValid.upnp()*/
				},
				pppoe: function() {
					if ($(".pppoe-radio-setting-selected").val() == 1) {
						//&& common.validInfo(valid.confirmpassword($("#ipsetting-pppoepassword").val(), $("#ipsetting-pppoeconfirmpassword").val())
						return common.validInfo(valid.pppoeUsername($("#ipsetting-pppoeusername").val())) && common.validInfo(valid.pppoePassword($("#ipsetting-pppoepassword").val()));
					} else {
						return true;
					}
				},
				ip: function() {
					var a;
					if ($(".ip-radio-setting-selected").val() == 0) {
						a = common.validInfo(valid.ip($("#ipsetting-staticip").val())) && common.validInfo(valid.mask($("#ipsetting-staticsubmask").val())) && common.validInfo(valid.gw($("#ipsetting-staticgateway").val()));
						var dns1 = $("#ipsetting-staticpds").val(),
							dns2 = $("#ipsetting-staticsds").val();
						// if (valid.dnsCompare(dns1, dns2) == true) {
						// 	return a && common.validInfo(valid.dns(dns1)) && common.validInfo(valid.dns(dns2));
						// } else {
						// 	return false;&& common.validInfo(valid.dnsCompare(dns1, dns2))
						// }
						return a && common.validInfo(valid.dns(dns1)) && common.validInfo(valid.dns(dns2));
					} else {
						return common.validInfo(valid.ip($("#ipsetting-fallbackip").val()));
					}
				}
				// ,
				// upnp: function() {
				// 	if ($(".upnp-radio-setting-selected").val() == 1) {
				// 		return common.validInfo(valid.cloudUsername($("#upnp-name").val()))
				// 	} else {
				// 		return true;
				// 	}
				// }
			},
			fallbackValid: function() {
				var a = common.validInfo(valid.ip($("#ipsetting-fallbackip").val())) && common.validInfo(valid.mask($("#ipsetting-fallbacksubmask").val())) && common.validInfo(valid.gw($("#ipsetting-fallbackgateway").val()));
				var dns1 = $("#ipsetting-fallbackpds").val(),
					dns2 = $("#ipsetting-fallbacksds").val();
				if (valid.dnsCompare(dns1, dns2) == true) {
					return a && common.validInfo(valid.dns(dns1)) && common.validInfo(valid.dns(dns2));
				} else {
					return false;
				}
			},
			pppoeShowLoadingStart: function(holder, text) {
				holder.text(text);
				main.pppoeShowLoadingInterval = clearInterval(main.pppoeShowLoadingInterval);
				main.pppoeShowLoadingInterval = setInterval(function() {
					holder.text(holder.text() + ".");
					holder.text() == text + "......" ? holder.text(text) : null;
				}, 500)
			},
			pppoeShowLoadingEnd: function(holder, text) {
				var text = text || "";
				holder.text(text);
				main.pppoeShowLoadingInterval = clearInterval(main.pppoeShowLoadingInterval);
			},
			fwInfoGet: function() {
				var args = {
					url: '/getsysinfo.fcgi',
					success: function(json) {
						$("#status-model").text(json.cameraName);
						$("#status-devicemodel").text(json.model);
						$("#status-fwVersion").text(json.frmVer);
						$("#status-region").text(json.region);
						main.cameraName = json.cameraName;
					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
			},
			ipget: function() {
				var args = {
					url: '/netconf_get.fcgi',
					success: function(json) {
						if (json.errorCode == 0) {
							json.DhcpEnable == 0 ? $("#ipmodel-static").click() : $("#ipmodel-dynamic").click();
							$("#ipsetting-macadrr").html(json.MacAddress);
							$("#ipsetting-dhcpip").val(json.CurIP);
							$("#ipsetting-dhcpsubmask").val(json.CurMask);
							$("#ipsetting-dhcpgateway").val(json.CurGW);
							$("#ipsetting-dhcppds").val(json.CurDns0);
							$("#ipsetting-dhcpsds").val(json.CurDns1);
							$("#ip-setting-httpport").val(json.HttpPort);
							$("#ipsetting-staticip").val(json.StaticIP);
							$("#ipsetting-staticsubmask").val(json.StaticMask);
							$("#ipsetting-staticgateway").val(json.StaticGW);
							$("#ipsetting-staticpds").val(json.StaticDns0);
							$("#ipsetting-staticsds").val(json.StaticDns1);

							$("#ipsetting-fallbackip").val(json.FallbackIP);
							$("#ipsetting-fallbacksubmask").val(json.FallbackMask);
							$("#ipsetting-fallbackgateway").val(json.FallbackGW);
							$("#ipsetting-fallbackpds").val(json.FallbackDns0);
							$("#ipsetting-fallbacksds").val(json.FallbackDns1);


							$("#ipsetting-pppoeip").html(json.PPPoeIP);
							$("#ipsetting-pppoeusername").val(Base64.decode(json.PPPoeUsr));
							$("#ipsetting-pppoepassword").val(Base64.decode(json.PPPoePwd));

							$("#bonjour-name-setting").text(json.Bonjour.bonjourName);
							main.setting.ipSetting.pppoeStatus(json.PPPoeState);
							common.pppoeIp = json.PPPoeIP;
							if (json.PPPoeAuto == 1) {
								$("#pppoe-enable").click();
							} else {
								$("#pppoe-disable").click();
							};
							if (json.Bonjour.bonjourStatus == 1) {
								$("#bonjour-enable").click();
							} else {
								$("#bonjour-disable").click();
							}

							$("#upnp-name").text(Base64.decode(json.Upnp.name));
							if (json.Upnp.isEnable == 1) {
								$("#upnp-enable").attr("checked", true);
								$("#upnp-disable").attr("checked", false);
								common.upnpInfo.ip = (Base64.decode(json.Upnp.wlan_ip));
								common.upnpInfo.port = (Base64.decode(json.Upnp.stream_wlan_port));
							} else {
								$("#upnp-enable").attr("checked", false);
								$("#upnp-disable").attr("checked", true);
							}
							//status页面信息
							$("#status-lanIp").text(json.CurIP || "-");
							$("#status-submask").text(json.CurMask || "-");
							$('#status-gateway').text(json.CurGW || "-");
							$('#status-pdns').text(json.CurDns0 || "-");
							$('#status-sdns').text(json.CurDns1 || "-");
							if (json.DhcpEnable == 0) {
								$("#status-linktype").text(lang.state.static || "-");
								$("#status-dhcp").text(lang.state.disable || "-");
							} else {
								$("#status-linktype").text(lang.state.dhcp || "-");
								$("#status-dhcp").text(lang.state.enable || "-");
							}
							$("#status-pppoewanip").text(json.PPPoeIP || "-");
							$("#status-mac").text(json.MacAddress || "-");
							plug.radio.initial($(".setting-contain-ip"));
						}
					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
			},
			ipset: function() {
				plug.button.disable($("#setting-contain-ip-network-ctrl-save"));
				main.setting.sysManagement.shadeLayer();
				var args = {
					url: '/netconf_set.fcgi',
					timeout: 15000,
					data: {
						"DhcpEnable": $(".ip-radio-setting-selected").val(),
						"StaticIP": $("#ipsetting-staticip").val(),
						"StaticMask": $("#ipsetting-staticsubmask").val(),
						"StaticGW": $("#ipsetting-staticgateway").val(),
						"StaticDns0": $("#ipsetting-staticpds").val(),
						"StaticDns1": $("#ipsetting-staticsds").val(),
						//"FallbackEnable": $(".fallback-radio-setting-selected").val(),
						"FallbackIP": $("#ipsetting-fallbackip").val(),
						"FallbackMask": "255.255.255.0",
						"PPPoeAuto": $(".pppoe-radio-setting-selected").val(),
						"PPPoeUsr": Base64.encode($("#ipsetting-pppoeusername").val()),
						"PPPoePwd": Base64.encode($("#ipsetting-pppoepassword").val()),
						"HttpPort": $("#ip-setting-httpport").val(),
						"isEnable": $(".upnp-radio-setting-selected").val(),
						// "name": $("#upnp-name").val(),
						"bonjourState": $(".bonjour-radio-setting-selected").val()
						//,"bonjourName": $("#bonjour-name-setting").val()
					},
					success: function(json) {
						plug.button.enable($("#setting-contain-ip-network-ctrl-save"));
						main.setting.sysManagement.removeShadeLayer();
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.netconf.ipsetSuccess
							});
							var port;
							$("#ip-setting-httpport").val() == 80 ? port = "" : port = $("#ip-setting-httpport").val();
							if (common.upnpInfo.port && (location.hostname == common.upnpInfo.ip || location.hostname == common.upnpInfo.noip || location.hostname == common.upnpInfo.dyndns || location.hostname == common.upnpInfo.cmxaction)) {

							} else if (common.pppoeIp == location.hostname) {

							} else {
								if (location.hostname == json.DhcpJumpIP && location.port == port) {} else {
									location.href = "http://" + json.DhcpJumpIP + ":" + $("#ip-setting-httpport").val() + "/login.html";
								}
							}
							main.pppoeLoopLoginCount = 0;
							main.setting.ipSetting.pppoeStateDetect();
							//main.setting.ipSetting.pppoeShowLoadingStart($("#ipsetting-pppoestate"), lang.state.connecting);

							main.setting.ipSetting.ipget();
						} else if (json.errorCode == 118) {
							plug.window.alert({
								"info": lang.ajax.netconf.portDisable
							});

						} else if (json.errorCode == 117) {
							plug.window.alert({
								"info": lang.ajax.netconf.ipDisable
							});

						} else if (json.errorCode == 120) {
							plug.window.alert({
								"info": lang.ajax.netconf.portDisable
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.netconf.ipsetFailed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#setting-contain-ip-network-ctrl-save"));
						main.setting.sysManagement.removeShadeLayer();
						if (common.upnpInfo.port && (location.hostname == common.upnpInfo.ip || location.hostname == common.upnpInfo.noip || location.hostname == common.upnpInfo.dyndns || location.hostname == common.upnpInfo.cmxaction)) {
							//	location.href = location.href;
						} else {
							location.href = "http://" + $("#ipsetting-staticip").val() + ":" + $("#ip-setting-httpport").val() + "/login.html";
						}
					}
				}
				common.setAjax.init(args);
			},
			pppoeStatus: function(status) {
				if (status == "Disconnected") {
					$("#status-pppoestatus").text(lang.state.disconnect);
					$("#ipsetting-pppoestate").text(lang.state.disconnect);
				} else if (status == "Connecting") {
					$("#status-pppoestatus").text(lang.state.connecting);
					$("#ipsetting-pppoestate").text(lang.state.connecting);
				} else if (status == "Connected") {
					$("#status-pppoestatus").text(lang.state.connected);
					$("#ipsetting-pppoestate").text(lang.state.connected);
				}
			},
			pppoeStateDetect: function() {
				main.pppoeStateInterval = setInterval(function() {
					var args = {
						url: '/pppoe_state.fcgi',
						success: function(json) {
							main.pppoeLoopLoginCount = main.pppoeLoopLoginCount + 1;
							if (json.errorCode == 0) {
								if (json.PPPoeState == "Connected") {
									main.setting.ipSetting.pppoeShowLoadingEnd($("#ipsetting-pppoestate"));
									main.setting.ipSetting.pppoeStatus("Connected");
									main.pppoeStateInterval = clearInterval(main.pppoeStateInterval);
								} else if (json.PPPoeState == "Connecting") {
									main.setting.ipSetting.pppoeShowLoadingStart($("#ipsetting-pppoestate"), lang.state.connecting);
								} else if (json.PPPoeState == "Disconnected") {
									main.pppoeStateInterval = clearInterval(main.pppoeStateInterval);
									main.setting.ipSetting.pppoeShowLoadingEnd($("#ipsetting-pppoestate"));
									main.setting.ipSetting.pppoeStatus("Disconnected");
								} else if (main.pppoeLoopLoginCount > 20) {
									main.setting.ipSetting.pppoeShowLoadingEnd($("#ipsetting-pppoestate"));
									main.pppoeStateInterval = clearInterval(main.pppoeStateInterval);
									main.setting.ipSetting.pppoeStatus("Disconnected");
								}
							} else {
								alert(lang.ajax.netconf.pppoeLoginFailed);
							}
						},
						error: function(xhr) {

						}
					}
					common.ajax.init(args);
				}, 3000);
			}
		},
		log: {
			init: function() {
				$("#setting-log-metro").click(function() {
					main.setting.log.initAjax();
				});
				main.setting.log.bind();
				//var a = $("#sevenTables-setting-contain-log-ctrl-table .sevenTables-tablesnum-changecontain-selectnum-0").val();
			},
			bind: function() {
				$("#logdownload").click(function() {
					main.setting.log.download();
				});
				$("#clear-log-table").click(function() {
					plug.window.confirm({
						"info": lang.ajax.log.clearConfirm,
						"btnConfirm": lang.plug.Clear,
						"confirm": function() {
							main.setting.log.clear();
						}
					});
				});
				$("#refresh-log-table").click(function() {
					main.setting.log.refresh();
				});
			},
			download: function() {
				var args = {
					url: "/check_1.fcgi",
					data: {},
					success: function(json) {
						if (json.errorCode == 0) {
							location.href = "/downloadlog.fcgi";
						} else {
							plug.window.alert({
								"info": lang.ajax.log.downloadFailed
							});
						}
					},
					error: function(xhr) {

					}
				}
				common.setAjax.init(args);
			},
			clear: function() {
				var args = {
					url: '/clearlog.fcgi',
					data: {},
					success: function(json) {
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.log.clearSuccess
							});
							main.setting.log.refresh();
						} else {
							plug.window.alert({
								"info": lang.ajax.log.clearFailed
							});
						}
					},
					error: function(xhr) {

					}
				}
				common.setAjax.init(args);
			},
			refresh: function() {
				var args = {
					data: {
						"level": 8,
						"name": "ALL",
						"line": 50
					},
					url: '/getlog.fcgi',
					success: function(response) {
						var tableNum = Number($("#sevenTables-setting-contain-log-ctrl-table .datagrid-btable").attr("id").split("seventables-nums-")[1]);
						$("#sevenTables-setting-contain-log-ctrl-table").remove();
						$(".setting-contain-log-ctrl-table").width(724);
						var json = jQuery.parseJSON(response);
						sevenTables.reinit(json.log, tableNum);
						//main.setting.log.tableInit(json.log);
						main.setting.log.decodeLog();
					},
					error: function(xhr) {

					}
				}
				sevenTables.ajax.init(args);

			},
			tableInit: function(json) {
				sevenTables.init({
					holder: ".setting-contain-log-ctrl-table",
					background: "none",
					column: {
						count: 4,
						width: [150, 105, 80, 358]
					},
					data: {
						json: json,
						option: ["time", "module", "level", "msg"]
					},
					row: 5,
					Num: true,
					checkbox: {
						enable: false,
						width: 50
					},
					title: ["Time", "Module", "Level", "Content"],
					allowAdjustColWidth: {
						enable: false,
						column: [0, 1, 2, 3, 4, 5],
						minWidth: 100,
						maxWidth: 300
					},
					mouseSelect: false,
					enabledEdit: {
						enable: false,
						column: [1, 2],
						ajax: {
							url: '/inits/request.fcgi',
							type: 'post',
							dataType: 'text',
							contentType: 'application/x-www-form-urlencoded;charset=utf-8',
							timeout: 20000,
							async: true,
							cache: false,
							global: false,
							data: {
								"httpget_isenable": 1234,
								"sometest": 2343
							},
							beforeSend: function() {
								//	alert(sevenTables.ajaxXhr);
							},
							success: function() {
								//	alert(sevenTables.ajaxResponse);
							},
							complete: function() {
								//	alert(sevenTables.ajaxXhr);
							},
							error: function() {
								//	alert(sevenTables.ajaxXhr);
							}

						}
					},
					toolBar: {
						enable: true,
						changecontain: {
							enable: true,
							select: [{
								title: "Level",
								refreshable: true,
								width: 90,
								option: ["ALL", "EMERG", "ALERT", "CRIT", "ERR", "WARNING", "NOTICE", "INFO", "DEBUG"],
								value: ["8", "0", "1", "2", "3", "4", "5", "6", "7"]
							}, {
								title: "Module",
								refreshable: true,
								width: 120,
								option: ["ALL", "UserManage", "DateTime", "UPnP", "Cloud", "NetSwitch", "Wireless", "NetConfig", "Ddns", "SMTP", "FTP", "DynDdns", "MotionDetection", "Bonjour", "VideoControl", "System"]
							}],
							ajax: {
								url: '/getlog.fcgi',
								type: 'post',
								dataType: 'text',
								contentType: 'application/x-www-form-urlencoded;charset=utf-8',
								timeout: 20000,
								async: true,
								cache: false,
								global: false,
								data: {
									"level": "first",
									"name": "second",
									"line": 50
								},
								beforeSend: function() {
									//	alert(sevenTables.ajaxXhr);
								},
								success: function(response) {
									var json = jQuery.parseJSON(response);
									if (json.errorCode == 0) {
										sevenTables.refresh(json.log);
										if (json.log.length < 10) {
											$(".setting-contain-log-ctrl-table").width(724);
											$(".setting-contain-log-ctrl-table-sevenTables-title-3").width(359)
										} else {
											$(".setting-contain-log-ctrl-table").width(743);
											$(".setting-contain-log-ctrl-table-sevenTables-title-3").width(377)
										}

										main.setting.log.decodeLog();
									} else {
										plug.window.alert({
											"info": lang.ajax.tables.logChangeContainFailed
										});
									}
								},
								complete: function() {
									//	alert(sevenTables.ajaxXhr);
								},
								error: function(xhr) {
									//	alert(sevenTables.ajaxXhr);
								}
							}
						},
						pagination: {
							enable: false,
							paginationCount: 15, //默认每页显示条目数若paginationPageList为true则此选项失效
							paginationPageList: {
								enable: true,
								option: [10, 20, 50]
							}
						}
					},
					scrollCtrl: {
						enable: true,
						height: 310,
						headerTdNum: 3
					}
				});

			},
			initAjax: function() {
				var args = {
					data: {
						"level": 8,
						"name": "ALL",
						"line": 50
					},
					url: '/getlog.fcgi',
					success: function(response) {
						var json = jQuery.parseJSON(response);
						json = json.log;
						$("#sevenTables-setting-contain-log-ctrl-table").remove();
						$(".setting-contain-log-ctrl-table").width(724);
						main.setting.log.tableInit(json);
						main.setting.log.decodeLog();

					},
					error: function(xhr) {
						var json = [{
							"name": "seven1",
							"type": "amdin1"
						}, {
							"name": "seven2",
							"type": "admin2"
						}];
					}
				}
				sevenTables.ajax.init(args);
			},
			decodeLog: function() {
				$(".setting-contain-log-ctrl-table-column-3 .datagrid-cell").each(function() {
					$(this).text(Base64.decode($(this).text()))
				});
			}
		},
		wireless: {
			init: function() {
				main.setting.wireless.bind();
				//main.setting.wireless.getWireless();	
			},
			bind: function() {
				$(".setting-contain-checkbox-cell").attr("checked", false);
				$("#wirelessexhost-disable").attr("disabled", false);
				$("#setting-wireless-info-wpakey-checkbox").attr("checked", false)
				$("#setting-wireless-metro").click(function() {
					main.setting.wireless.getWireless();
					$("#setting-wirless-auto-info-contain").show();
					$("#setting-wireless-info-manually-contain").hide();
					$("#setting-wireless-info-manually").hide();
				})
				$("#setting-advance-wireless-metro").click(function() {
					main.setting.wireless.getWireless();
					$("#setting-wireless-info-manually").show();
				})

				$(".setting-contain-checkbox-cell").click(function() {
					var holder = $("#" + $(this).children("input").attr("id").split("-checkbox")[0]);
					var textHolder = $("#" + $(this).children("input").attr("id").split("-checkbox")[0] + "-text")
					if ($(this).children("input").attr("checked")) {
						holder.hide();
						textHolder.show();
						textHolder.val(holder.val());
					} else {
						holder.show();
						textHolder.hide();
						holder.val(textHolder.val());
					}
				});
				$("#wirelessexhost-disable").click(function() {
					$("#setting-wirelessex-manually").show();
					$("#setting-wirelessex-ssid").attr("disabled", false);
					$("#setting-wirelessex-ssid").css("background", "#fafafa");
				});
				$("#wirelessexhost-enable").click(function() {
					$("#setting-wirelessex-manually").hide();
					$("#setting-wirelessex-ssid").attr("disabled", true);
					$("#setting-wirelessex-ssid").css("background", "#eee");
				});
				$(".setting-contain-ctrl-password").change(function() {
					var holder = $("#" + $(this).attr("id") + "-text");
					holder.val($(this).val());
				});
				$(".setting-contain-ctrl-passwordtext").change(function() {
					var holder = $("#" + $(this).attr("id").split("-text")[0]);
					holder.val($(this).val());
				});
				$("#wirelessex-enable").click(function() {
					$(".wirelessex-radio-setting").removeClass("wirelessex-radio-setting-selected");
					$(this).addClass("wirelessex-radio-setting-selected");
					$("#setting-wireless-extend-information").show();
					//if()
				});
				$("#wirelessex-disable").click(function() {
					$(".wirelessex-radio-setting").removeClass("wirelessex-radio-setting-selected");
					$(this).addClass("wirelessex-radio-setting-selected");
					$("#setting-wireless-extend-information").hide();
				});
				$("#wireless-enable").click(function() {
					$(".wireless-radio-setting").removeClass("wireless-radio-setting-selected");
					$(this).addClass("wireless-radio-setting-selected");
					$(".setting-wirless-info-contain").show();
					//$("#setting-wireless-info-manually-contain").hide();
					$(".setting-contain-wireless-ctrl-table").show();
					$("#setting-wirless-content").show();
					$("#setting-contain-wireless-ctrl-save").attr("value", "Connect");
					main.setting.wireless.enableWireless();
				});
				$("#wireless-disable").click(function() {
					$(".wireless-radio-setting").removeClass("wireless-radio-setting-selected");
					$(this).addClass("wireless-radio-setting-selected");
					$(".setting-wirless-info-contain").hide();
					//$("#setting-wireless-info-manually-contain").hide();
					$(".setting-contain-wireless-ctrl-table").hide();
					$("#setting-wirless-content").hide();
					$("#setting-contain-wireless-ctrl-save").attr("value", "Save");
					plug.button.enable($('#setting-contain-wireless-ctrl-save'));
				});
				$("#setting-wireless-info-manually").toggle(

				function() {
					$("#setting-wirless-auto-info-contain").hide();
					//$(this).attr("value", "Search");
					$("#setting-wireless-info-manually-contain").show();
				},

				function() {
					$("#setting-wireless-info-manually-contain").hide();
					//$(this).attr("value", "Manually");
					$("#setting-wirless-auto-info-contain").show();
				});
				$("#setting-wirelessmanually-auth").change(function() {
					main.setting.wireless.setshow($(this).val());
				});
				$("#setting-wirelessex-auth").change(function() {
					main.setting.wireless.exinfoshow($(this).val());
				});
				$("#setting-contain-wireless-ctrl-save").click(function() {
					if (main.setting.wireless.wirelessValid.valid() == true) {
						plug.window.confirm({
							"info": lang.ajax.wireless.warning,
							"btnConfirm": lang.plug.Change,
							"confirm": function() {
								main.setting.wireless.setWireless()
							},
							"cancel": function() {

							}
						});
					}
				});
				$("#setting-contain-wirelessextender-ctrl-save").click(function() {
					if ($(".wirelessex-radio-setting-selected").val() == 1) {
						if ($(".wirelessex-host-setting-selected").val() == 0) {
							main.setting.wireless.wirelessValid.exValid() == true ? main.setting.wireless.setWirelessExtender() : null;
						} else {
							main.setting.wireless.setWirelessExtender();
						}
					} else {
						main.setting.wireless.setWirelessExtender();
					}
				});
				$("#countryselect").change(function() {
					if ($("#countryselect option:selected").attr("type") == "FCC") {
						$("#setting-wireless-channel option").eq(11).hide();
						$("#setting-wireless-channel option").eq(12).hide();
					} else {
						$("#setting-wireless-channel option").show();
					}
				});
				$("#setting-contain-wireless-ctrl-search").click(function() {
					main.setting.wireless.scanWireLess("refresh");
				});
				$(".wirelessex-host-setting").click(function() {
					$(".wirelessex-host-setting-selected").removeClass("wirelessex-host-setting-selected")
					$(this).addClass("wirelessex-host-setting-selected");
				});
				$("#setting-wirelessextender-metro").click(function() {
					main.setting.wireless.wirelessStatus();
				});
				plug.checkbox.initial($(".setting-contain-wireless"));
			},
			wirelessValid: {
				valid: function() {
					var a = main.setting.wireless.wirelessValid.autoWepKey() && main.setting.wireless.wirelessValid.autoPskKey() && main.setting.wireless.wirelessValid.manualSsid() && main.setting.wireless.wirelessValid.manualWepkey() && main.setting.wireless.wirelessValid.manualPSK();
					return a
				},
				autoWepKey: function() {
					if ($("#setting-wireless-info-wepkey:hidden").length == 1 && $("#setting-wireless-info-wepkey-text:hidden").length == 1) {
						return true;
					} else {
						return common.validInfo(valid.inWepkey($("#setting-wireless-info-wepkey").val()));
					}
				},
				autoPskKey: function() {
					if ($("#setting-wireless-info-wpakey:hidden").length == 1 && $("#setting-wireless-info-wpakey-text:hidden").length == 1) {
						return true;
					} else {
						return common.validInfo(valid.inWpaWpa2Psk($("#setting-wireless-info-wpakey").val()))
					}
				},
				manualSsid: function() {
					if ($("#setting-wirelessmanually-ssid:hidden").length == 0) {
						return common.validInfo(valid.ssid($("#setting-wirelessmanually-ssid").val()))
					} else {
						return true;
					}
				},
				manualWepkey: function() {
					if ($("#setting-wirelessmanually-wepkey:hidden").length == 1 && $("#setting-wirelessmanually-wepkey-text:hidden").length == 1) {
						return true;
					} else {
						return common.validInfo(valid.inWepkey($("#setting-wirelessmanually-wepkey").val()))
					}
				},
				manualPSK: function() {
					if ($("#setting-wirelessmanually-wpakey:hidden").length == 1 && $("#setting-wirelessmanually-wpakey-text:hidden").length == 1) {
						return true;
					} else {
						return common.validInfo(valid.inWpaWpa2Psk($("#setting-wirelessmanually-wpakey").val()))
					}
				},
				exValid: function() {
					var a = main.setting.wireless.wirelessValid.exSetting() && main.setting.wireless.wirelessValid.exWepkey() && main.setting.wireless.wirelessValid.exPSK();
					return a
				},
				exSetting: function() {
					if ($("#wirelessexhost-disable").attr("checked")) {
						return common.validInfo(valid.ssid($("#setting-wirelessex-ssid").val()));
					} else {
						return true;
					}
				},
				exWepkey: function() {
					if ($("#setting-wirelessex-wepkey:hidden").length == 1 && $("#setting-wirelessex-wepkey-text:hidden").length == 1) {
						return true;
					} else {
						return common.validInfo(valid.wepkey($("#setting-wirelessex-wepkey").val()))
					}
				},
				exPSK: function() {
					if ($("#setting-wirelessex-wpakey:hidden").length == 1 && $("#setting-wirelessex-wpakey-text:hidden").length == 1) {
						return true;
					} else {
						return common.validInfo(valid.wpaWpa2Psk($("#setting-wirelessex-wpakey").val()))
					}
				}
			},
			scanWireLessLoading: function() {
				plug.button.disable($('#setting-contain-wireless-ctrl-search'));
				plug.button.disable($('#setting-contain-wireless-ctrl-save'));
				$(".table-setting-loading").remove();
				$("#sevenTables-setting-contain-wireless-ctrl-table").hide();
				var a = "";
				a += "<div class='table-setting-loading'>",
				a += "<span class='table-setting-loading-img'>",
				a += "</span>",
				a += "</div>";
				$(".setting-contain-wireless-ctrl-table").append(a);
			},
			scanWireLessEndLoading: function(json, status) {
				$(".table-setting-loading").remove();
				plug.button.enable($('#setting-contain-wireless-ctrl-search'));
				plug.button.enable($('#setting-contain-wireless-ctrl-save'));
				if ($("#sevenTables-setting-contain-wireless-ctrl-table").attr("id")) {
					var tableNum = Number($("#sevenTables-setting-contain-wireless-ctrl-table .datagrid-btable").attr("id").split("seventables-nums-")[1]);
				}
				$("#sevenTables-setting-contain-wireless-ctrl-table").remove();
				$(".setting-contain-wireless-ctrl-table").width(650);
				if (status == "refresh"&&tableNum) {
					sevenTables.reinit(json.ApInfo, tableNum);
				} else {
					main.setting.wireless.tableInit(json.ApInfo);
				}
				main.setting.wireless.initScanWireLess(json);

			},
			scanWireLess: function(status) {
				main.setting.wireless.scanWireLessLoading();
				var args = {
					url: '/wireless_scan.fcgi',
					timeout: 5000,
					success: function(json) {
						$(".wirelessscan-failed-tips").remove();
						if (json.errorCode == 0) {
							main.setting.wireless.scanWireLessEndLoading(json, status);
						} else if (json.errorCode == -1) {
							main.setting.wireless.scanWireLessEndLoading({}); //避免表格刷新时失去对象，因此当wirless返回失败时，表格照常生成，但是被隐藏。
							$("#sevenTables-setting-contain-wireless-ctrl-table").hide();
						} else {
							var a = "";
							a = "<span class='wirelessscan-failed-tips'>" + lang.ajax.wireless.scanFailed + "</span>"
							$(".setting-contain-wireless-ctrl-table").append(a);
							$(".table-setting-loading").remove();
							plug.button.enable($('#setting-contain-wireless-ctrl-search'));
							plug.button.enable($('#setting-contain-wireless-ctrl-save'));
						}
					},
					error: function(xhr) {
						$(".wirelessscan-failed-tips").remove();
						var a = "";
						a = "<span class='wirelessscan-failed-tips'>" + lang.ajax.wireless.scanFailed + "</span>"
						$(".setting-contain-wireless-ctrl-table").append(a);
						$(".table-setting-loading").remove();
						plug.button.enable($('#setting-contain-wireless-ctrl-search'));
						plug.button.enable($('#setting-contain-wireless-ctrl-save'));
					}
				}
				common.ajax.init(args);
			},
			initScanWireLess: function(json) {
				$(".sevenTables-setting-contain-wireless-ctrl-table-datagrid .sevenTables-tbody-datagrid-row").click(function() {
					var authType = $(this).find("td:eq(2) .datagrid-cell-show").text()
					main.setting.wireless.infoshow(authType);
					$("#setting-wireless-info-channel").text($(this).find("td:eq(4) .datagrid-cell-show").text());
					$("#setting-wireless-info-ssid").text($(this).find("td:eq(0) .datagrid-cell-show").text());
					$("#setting-wireless-info-auth").text($(this).find("td:eq(2) .datagrid-cell-show").text());
					$("#setting-wireless-info-HtExtCha").text($(this).find("td:eq(6) .datagrid-cell-show").text());
					$("#setting-wireless-info-wpakey").val("");
					$("#setting-wireless-info-wepkey").val("");
					$("#setting-wireless-info-wpakey-text").val("");
					$("#setting-wireless-info-wepkey-text").val("");
					$("#setting-wireless-info-encp").html($(this).find("td:eq(3) .datagrid-cell-show").text());
				});
				main.setting.wireless.SSIDdeCodeBase64();
				main.setting.wireless.signImage();
				main.setting.wireless.connectedSelect(json);
			},
			connectedSelect: function(json) {
				if (json.WlanStatus == "Connected" && json.ConnectedAPBSSID.toUpperCase() == json.ApInfo[0].BSSID) {
					var signal, security, holder;
					signal = Number(json.ApInfo[0].Signal);
					//$("#setting-wireless-info-singal").text(signal);
					security = json.ApInfo[0].AuthType;
					holder = $("#setting-contain-wireless-ctrl-table-table-row-0 .setting-contain-wireless-ctrl-table-column-1 .wireless-table-img");
					var a = "";
					a += "<div class='connectedselect'>",
					a += "</div>";
					$("#setting-contain-wireless-ctrl-table-table-row-0 .setting-contain-wireless-ctrl-table-column-0 .datagrid-cell").after(a);
					$("#setting-contain-wireless-ctrl-table-table-row-0").css({
						"color": "#21A5DD",
						"font-weight": "bold"
					});
					if (signal <= 100 && signal >= 80) {
						if (security == "None") {
							holder.addClass("signal-7");
						} else {
							holder.addClass("signal-8");
						}
					} else if (signal < 80 && signal >= 40) {
						if (security == "None") {
							holder.addClass("signal-10");
						} else {
							holder.addClass("signal-12");
						}
					} else {
						if (security == "None") {
							holder.addClass("signal-9");
						} else {
							holder.addClass("signal-11");
						}
					}
				} else if (json.WlanStatus == "ConnectedUnUsed") {

				} else {

				}

			},
			initStatusInfo: function(args) {
				if (args.status == "Connected") {
					$("#status-connectMode").text(lang.state.connected);
					$("#status-ssid").text(args.ssid);
					$("#status-channel").text(args.channel);
					$("#status-link").text(args.rate + "%");
					$("#status-encryp").text(args.Auth);
				} else {
					if (args.status == "ConnectedUnUsed") {
						$("#status-connectMode").text(lang.state.connectedunused);
					} else {
						$("#status-connectMode").text(lang.state.disconnect);
					}
					$("#status-ssid").text("-");
					$("#status-channel").text("-");
					$("#status-link").text("-");
					$("#status-encryp").text("-");
				}
			},
			getWirelessStatus: function() {
				var args = {
					url: '/wireless_get.fcgi',
					success: function(json) {

					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
			},
			getWireless: function() {
				var args = {
					url: '/wireless_get.fcgi',
					success: function(json) {
						$("#setting-wireless-info-channel").text(json.Channel);
						$("#setting-wireless-info-singal").text(json.Signal);
						$("#setting-wireless-info-ssid").html(main.setting.wireless.transToHTML(Base64.decode(json.SSID)));
						$("#setting-wireless-info-auth").text(json.Auth);
						$("#setting-wireless-info-encp").text(json.Encryp);
						$("#setting-wireless-info-wpakey").val(Base64.decode(json.WpaKey));
						$("#setting-wireless-info-wpakey-text").val(Base64.decode(json.WpaKey));
						$("#setting-wirelessex-ssid").val(Base64.decode(json.ExtSSID));
						$("#setting-wirelessex-extmaxcli").val(json.ExtMaxCli).change();
						$("#setting-wirelessexmanually-wepkeyindex").val(json.ExtWepKeyIndex).change();
						$("#setting-wireless-info-HtExtCha").text(json.HtExtCha);
						$("#setting-wirelessmanually-wepkeyindex").val(json.ExtWepKeyIndex).change();
						$("#setting-wirelessex-wepkey").val(Base64.decode(json.ExtWepKey));
						$("#setting-wireless-info-wepkey").val(Base64.decode(json.WepKey));
						$("#setting-wireless-info-wepkeyindex").val(json.WepKeyIndex);
						main.setting.wireless.exinfoshow(json.ExtAuth);
						$("#setting-wirelessex-encp").val(json.ExtEncryp).change();
						$("#setting-wirelessex-wpakey").val(Base64.decode(json.ExtWpaKey));
						$("#countryselect").val(json.Region);
						json.ExtEnable == 1 ? $("#wirelessex-enable").click() : $("#wirelessex-disable").click();
						json.Enable == 1 ? $("#wireless-enable").click() : $("#wireless-disable").click();
						$("#setting-wirelessex-auth").val(json.ExtAuth).change();

						main.setting.wireless.infoshow(json.Auth);
						$("#countryselect").change();
						main.setting.wireless.initStatusInfo({
							"status": json.WlanStatus,
							"ssid": $("#setting-wireless-info-ssid").text(),
							"channel": $("#setting-wireless-info-channel").text(),
							"rate": $("#setting-wireless-info-singal").text() || 85,
							"Auth": $("#setting-wireless-info-auth").text()
						})
						main.setting.wireless.extendStatus(json.WlanStatus, json.ExtSameAsHost, json.SSID);
						////status设置
						// main.setting.wireless.initStatusInfo({
						// 	"status": json.WlanStatus,
						// 	"ssid": $("#setting-wireless-info-ssid").text(),
						// 	"channel": $("#setting-wireless-info-channel").text(),
						// 	"rate":$("#setting-wireless-info-singal").text(),
						// 	"Auth": $("#setting-wireless-info-auth").text()
						// })
						plug.radio.initial($(".setting-contain-wireless"));
						// if (json.WlanStatus == "Connected") {
						// 	main.setting.wireless.scanWireLess("refresh");
						// }
					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
			},
			extendStatus: function(WlanStatus, ExtSameAsHost, SSID) {
				if (WlanStatus == "Connected") {
					$("#wirless-extend-host-ssid").text(Base64.decode(SSID));
					$("#wirelessexhost-enable").attr("disabled", false);
					if (ExtSameAsHost == 0) {
						$("#wirelessexhost-disable").click();
					} else {
						$("#wirelessexhost-enable").click();
					}
				} else {
					$("#wirless-extend-host-ssid").text(lang.state.disconnect);
					$("#wirelessexhost-enable").attr("disabled", true);
					$("#wirelessexhost-disable").click();
				}
				plug.radio.initial($(".setting-contain-wirelessextender"));
				plug.checkbox.initial($(".setting-contain-wirelessextender"));
			},
			enableWireless: function() {
				plug.button.disable($('#setting-contain-wireless-ctrl-save'));
				var args = {
					url: '/wireless_enable.fcgi',
					data: {
						"Enable": $(".wireless-radio-setting-selected").val()
					},
					success: function(json) {
						plug.button.enable($('#setting-contain-wireless-ctrl-save'));
						if (json.errorCode == 0) {
							main.setting.wireless.scanWireLess("refresh");
						} else if (json.errorCode == 1) {

						} else {

						}
					},
					error: function(xhr) {
						plug.button.enable($('#setting-contain-wireless-ctrl-save'));
					}
				}
				common.setAjax.init(args);
			},
			setWireless: function() {
				main.setting.wireless.scanWireLessLoading();
				var args = {
					url: '/wireless_set.fcgi',
					timeout: 3000,
					data: {
						"Enable": $(".wireless-radio-setting-selected").val(),
						"Channel": 10,
						"SSID": "ipcamtest",
						"Auth": "WPA2PSK",
						"Encryp": "AES",
						"WepKeyIndex": 1,
						"WepKey": "",
						"WpaKey": "zsbzsb757",
						"Encryp": "TKIPAES",
						"HtExtCha": 1,
						"SameAsHost": $(".wirelessex-host-setting-selected").val() //当wirelessExtender选中same as host模式时后台自动更改extender host.
					},
					success: function(json) {
						if (json.errorCode == 0) {
							main.wirelessCount = 0;
							if ($(".wireless-radio-setting-selected").val() == 1) {
								main.setting.wireless.wirelessStatusDetection();
							} else {
								plug.button.enable($('#setting-contain-wireless-ctrl-save'));
								plug.window.alert({
									"info": lang.ajax.wireless.setSuccess
								});
							}
						} else if (json.errorCode == 316) {
							$("#sevenTables-setting-contain-wireless-ctrl-table").show();
							$(".table-setting-loading").remove();
							plug.button.enable($('#setting-contain-wireless-ctrl-search'));
							plug.button.enable($('#setting-contain-wireless-ctrl-save'));
							plug.window.alert({
								"info": lang.ajax.wireless.hasused
							});
						} else {
							$("#sevenTables-setting-contain-wireless-ctrl-table").show();
							$(".table-setting-loading").remove();
							plug.button.enable($('#setting-contain-wireless-ctrl-search'));
							plug.button.enable($('#setting-contain-wireless-ctrl-save'));
							plug.window.alert({
								"info": lang.ajax.wireless.setFailed
							});
						}
					},
					error: function(xhr) {
						// plug.window.alert({
						// 	"info": lang.ajax.wireless.wirelessdisconnect,
						// 	"ok": function() {
						// 		window.location.reload();
						// 	}
						// });因BUG53059去除
					}
				}
				if ($("#setting-wireless-info-manually-contain:hidden").length) {
					args.data.Channel = $("#setting-wireless-info-channel").text();
					args.data.SSID = Base64.encode(main.setting.wireless.transToTEXT($("#setting-wireless-info-ssid").html()));
					args.data.Encryp = $("#setting-wireless-info-encp").text();
					args.data.Auth = $("#setting-wireless-info-auth").text();
					args.data.HtExtCha = $("#setting-wireless-info-HtExtCha").text();
					args.data.WepKeyIndex = $("#setting-wireless-info-wepkeyindex").val();
					args.data.WepKey = Base64.encode($("#setting-wireless-info-wepkey").val());
					args.data.WpaKey = Base64.encode($("#setting-wireless-info-wpakey").val());
				} else {
					args.data.Channel = 0;
					args.data.SSID = Base64.encode($("#setting-wirelessmanually-ssid").val());
					args.data.Encryp = $("#setting-wirelessmanually-encp").val();
					args.data.HtExtCha = 2;
					args.data.Auth = $("#setting-wirelessmanually-auth").val();
					args.data.WepKeyIndex = $("#setting-wirelessmanually-wepkeyindex").val();
					args.data.WepKey = Base64.encode($("#setting-wirelessmanually-wepkey").val());
					args.data.WpaKey = Base64.encode($("#setting-wirelessmanually-wpakey").val());
				}
				common.setAjax.init(args);
			},
			infoshow: function(authType) {
				if (authType == "None") {
					//$("#setting-wireless-info-encp-contain").hide();
					//	$("#setting-wireless-info-wepindex-contain").hide();
					$("#setting-wireless-info-wepkey-contain").hide();
					$("#setting-wireless-info-wpakey-contain").hide();
				} else if (authType == "WEP") {
					//	$("#setting-wireless-info-wepindex-contain").show();
					$("#setting-wireless-info-wepkey-contain").show();
					//	$("#setting-wireless-info-encp-contain").hide();
					$("#setting-wireless-info-wpakey-contain").hide();
				} else {
					//	$("#setting-wireless-info-encp-contain").show();
					$("#setting-wireless-info-wpakey-contain").show();
					//	$("#setting-wireless-info-wepindex-contain").hide();
					$("#setting-wireless-info-wepkey-contain").hide();
				}
			},
			wirelessStatusDetection: function() {
				setTimeout(function() {
					var args = {
						url: '/wireless_status.fcgi',
						success: function(json) {
							if (json.WlanStatus == "Connected") {
								main.setting.wireless.scanWireLess("refresh");
							} else if (json.WlanStatus == "ConnectedUnUsed") {
								// plug.window.confirm({
								// 	"info": lang.ajax.wireless.connectunused1 + Base64.decode(json.SSID) + lang.ajax.wireless.connectunused2,
								// 	"confirm": function() {
								// 		main.setting.wireless.scanWireLess("refresh");
								// 	},
								// 	"cancel": function() {
								// 		$(".table-setting-loading").remove();
								// 		plug.button.enable($('#setting-contain-wireless-ctrl-search'));
								// 		plug.button.enable($('#setting-contain-wireless-ctrl-save'));
								// 		$("#sevenTables-setting-contain-wireless-ctrl-table").show();
								// 	}
								// });
								plug.window.alert({
									"info": lang.ajax.wireless.connectunused1 + main.HtmlEncode(Base64.decode(json.SSID)) + lang.ajax.wireless.connectunused2,
									"ok": function() {
										main.setting.wireless.scanWireLess("refresh");
									}
								});

							} else if (json.WlanStatus == "Disconnected" && main.wirelessCount >= 10) {
								plug.window.alert({
									"info": lang.ajax.wireless.conncetfailed
								});
								$(".table-setting-loading").remove();
								plug.button.enable($('#setting-contain-wireless-ctrl-search'));
								plug.button.enable($('#setting-contain-wireless-ctrl-save'));
								$("#sevenTables-setting-contain-wireless-ctrl-table").show();
							} else {
								main.wirelessCount++;
								main.setting.wireless.wirelessStatusDetection();
							}
						}
					}
					common.ajax.init(args);
				}, 2000);

			},
			wirelessStatus: function() {
				var args = {
					url: '/wireless_status.fcgi',
					timeout: 5000,
					success: function(json) {
						main.setting.wireless.extendStatus(json.WlanStatus, json.ExtSameAsHost, json.SSID);
						if (json.WlanStatus == "Connected") {
							$("#status-connectMode").text(lang.state.connect);
						} else {
							$("#status-connectMode").text(lang.state.disconnect);
						}

					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
			},
			setWirelessExtender: function() {
				plug.button.disable($("#setting-contain-wirelessextender-ctrl-save"));
				var args = {
					url: '/wireless_extender_set.fcgi',
					data: {
						"ExtEnable": $(".wirelessex-radio-setting-selected").val(),
						"ExtSSID": Base64.encode($("#setting-wirelessex-ssid").val()),
						"ExtMaxCli": $("#setting-wirelessex-extmaxcli").val(),
						"ExtAuth": $("#setting-wirelessex-auth").val(),
						"ExtWepKeyIndex": $("#setting-wirelessexmanually-wepkeyindex").val(),
						"ExtEncryp": $("#setting-wirelessex-encp").val(),
						"ExtWepKey": Base64.encode($("#setting-wirelessex-wepkey").val()),
						"ExtWpaKey": Base64.encode($("#setting-wirelessex-wpakey").val()),
						"Encryp": $("#setting-wirelessex-encp").val(),
						"ExtSameAsHost": $(".wirelessex-host-setting-selected").val()
					},
					success: function(json) {
						plug.button.enable($("#setting-contain-wirelessextender-ctrl-save"));
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.wirelessextender.setSuccess
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.wirelessextender.setFailed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#setting-contain-wirelessextender-ctrl-save"));
					}
				}
				if ($(".wirelessex-host-setting-selected").val() == 0) {
					args.ExtSSID = Base64.encode($("#setting-wirelessex-ssid").val())
				} else {
					args.ExtSSID = Base64.encode($("#wirless-extend-host-ssid").text())
				}
				common.setAjax.init(args);
			},
			setshow: function(authType) {
				if (authType == "None") {
					$("#setting-wirelessmanually-wepkeyindex-select-contain").hide();
					$("#setting-wirelessmanually-wepkey-contain").hide();
					$("#setting-wirelessmanually-wpakey-contain").hide();
					$("#setting-wirelessmanually-encp-select-contain").hide();
				} else if (authType == "WEP") {
					$("#setting-wirelessmanually-wepkeyindex-select-contain").show();
					$("#setting-wirelessmanually-wepkey-contain").show();
					$("#setting-wirelessmanually-wpakey-contain").hide();
					$("#setting-wirelessmanually-encp-select-contain").hide();
				} else {
					$("#setting-wirelessmanually-wepkeyindex-select-contain").hide();
					$("#setting-wirelessmanually-wepkey-contain").hide();
					$("#setting-wirelessmanually-wpakey-contain").show();
					$("#setting-wirelessmanually-encp-select-contain").show();
				}
			},
			exinfoshow: function(authType) {
				if (authType == "None") {
					$("#setting-wirelessex-wepkey-contain").hide();
					$("#setting-wirelessex-wpakey-contain").hide();
				} else if (authType == "WEP") {
					$("#setting-wirelessex-wpakey-contain").hide();
					$("#setting-wirelessex-wepkey-contain").show();
				} else {
					$("#setting-wirelessex-wepkey-contain").hide();
					$("#setting-wirelessex-wpakey-contain").show();
				}
			},
			SSIDdeCodeBase64: function() {
				$("#sevenTables-setting-contain-wireless-ctrl-table .datagrid-body .setting-contain-wireless-ctrl-table-column-0 .datagrid-cell").each(function() {
					$(this).html(main.setting.wireless.transToHTML(Base64.decode($(this).html())));
					//	$(this).html(Base64.decode($(this).text()));
				});
			},
			transToHTML: function(str) {
				var transHtml = [
					/&/g, "&amp;",
					/\\/g, "&#92;",
					/'/g, "&#39;",
					/"/g, "&quot;",
					/</g, "&lt;",
					/>/g, "&gt;",
					/ /g, "&nbsp;"];
				for (var i = 0; i < transHtml.length; i += 2) {
					str = str.replace(transHtml[i], transHtml[i + 1]);
				}
				return str;
			},
			transToTEXT: function(str) {
				var transHtml = [
					/&amp;/g, "&",
					/&#92;/g, "\\",
					/&#39;/g, "'",
					/&quot;/g, '"',
					/&lt;/g, "<",
					/&gt;/g, ">",
					/&nbsp;/g, " "];
				for (var i = 0; i < transHtml.length; i += 2) {
					str = str.replace(transHtml[i], transHtml[i + 1]);
				}
				return str;
			},
			signImage: function() {
				$("#sevenTables-setting-contain-wireless-ctrl-table .datagrid-body .setting-contain-wireless-ctrl-table-column-1 .datagrid-cell").each(function() {
					if (Number($(this).text()) <= 100 && Number($(this).text()) >= 80) {
						$(this).html("<div class='wireless-table-img'></div>");
						if ($(this).parent().next().children(".datagrid-cell").text() == "None") {
							$(this).children(".wireless-table-img").addClass("signal-4");
						} else {
							$(this).children(".wireless-table-img").addClass("signal-1");
						}
					} else if (Number($(this).text()) < 80 && Number($(this).text()) >= 40) {
						$(this).html("<div class='wireless-table-img'></div>");
						if ($(this).parent().next().children(".datagrid-cell").text() == "None") {
							$(this).children(".wireless-table-img").addClass("signal-5");
						} else {
							$(this).children(".wireless-table-img").addClass("signal-2");
						}
					} else {
						$(this).html("<div class='wireless-table-img'></div>");
						if ($(this).parent().next().children(".datagrid-cell").text() == "None") {
							$(this).children(".wireless-table-img").addClass("signal-6");
						} else {
							$(this).children(".wireless-table-img").addClass("signal-3");
						}
					}
				});
			},
			tableInit: function(json) {
				sevenTables.init({
					holder: ".setting-contain-wireless-ctrl-table",
					background: "none",
					emptytips: lang.ajax.wireless.scanempty,
					column: {
						count: 7,
						width: [320, 50, 120, 90, 50, 150, 50],
						display: ["block", "block", "block", "none", "none", "block", "none"]
					},
					data: {
						json: json,
						option: ["SSID", "Signal", "AuthType", "EncrypType", "Channel", "BSSID", "HtExtCha"]
					},
					row: 5,
					checkbox: {
						enable: false,
						width: 50
					},
					title: ["Wireless Network Name", "Signal", "Security", "Encryption", "Channel", "MAC Address", "HtExtCha"],
					allowAdjustColWidth: {
						enable: false,
						//	column: [0, 1, 2],
						minWidth: 100,
						maxWidth: 300
					},
					mouseSelect: true,
					enabledEdit: {
						enable: false
					},
					toolBar: {
						enable: false,
						pagination: {
							enable: true,
							paginationCount: 15, //默认每页显示条目数若paginationPageList为true则此选项失效
							paginationPageList: {
								enable: true,
								option: [6, 20, 30]
							},
							refresh: {
								enable: true,
								mode: "ajax",
								ajax: {
									url: '/wireless_scan.fcgi',
									type: 'post',
									dataType: 'text',
									contentType: 'application/x-www-form-urlencoded;charset=utf-8',
									async: true,
									beforeSend: function() {
										//	alert(sevenTables.ajaxXhr);
									},
									success: function(response) {
										var json = jQuery.parseJSON(response);
										sevenTables.refresh(json.ApInfo);
										main.setting.wireless.initScanWireLess();
									},
									complete: function() {
										//	alert(sevenTables.ajaxXhr);
									},
									error: function(xhr) {
										//	alert(sevenTables.ajaxXhr);
									}
								}
							}
						}
					},
					scrollCtrl: {
						enable: true,
						height: 310,
						headerTdNum: 5
					}
				});
			}
		},
		ddns: {
			init: function() {
				main.setting.ddns.bind();
				main.setting.ddns.ddnsDyndnsStateDetect();
				main.setting.ddns.ddnsComexeStateDetect();
				main.setting.ddns.ddnsNoipStateDetect();
			},
			bind: function() {
				//*************************************************//
				//	$("#setting-contain-ddns-ctrl-dyndns-save").attr("disabled", false);
				plug.button.enable($("#setting-contain-ddns-ctrl-dyndns-save"));
				plug.button.enable($("#setting-contain-ddns-ctrl-cmxaction-save"));
				plug.button.enable($("#setting-contain-ddns-ctrl-noip-save"));
				plug.button.enable($("#ddns-noip-Login"));
				plug.button.enable($("#ddns-dyndns-Login"));
				plug.button.enable($("#ddns-cmxaction-Login"));
				$("#ddns_type").val(0);
				$("#setting-ddns-metro").click(function() {
					main.setting.ddns.getAjax();
				});
				$("#ddns_type").change(function() {
					$(".setting-contain-ddns-type").hide();
					$(".setting-contain-ip-ctrl-button-inner-cell").hide();
					if ($("#ddns_type").val() == 2) {
						$(".ddns-type-Comexe").show();
						$("#ddns-select-regist-title").attr("href", "http://www.comexe.cn");
						$(".ddns-ctrl-cmxaction-save").show();
					} else if ($("#ddns_type").val() == 1) {
						$(".ddns-type-dyndns").show();
						$(".ddns-ctrl-dyndns-save").show();
						$("#ddns-select-regist-title").attr("href", "http://www.dyn.com");
					} else if ($(this).val() == 0) {
						$(".ddns-type-noip").show();
						$(".ddns-ctrl-noip-save").show();
						$("#ddns-select-regist-title").attr("href", "http://www.noip.com");
					}
				});
				$("#ddns-noip-Login").click(function() {
					var args = {
						"Noipautorun": $(".ddns-noip-radio-selected").val(),
						"Noipusername": $("#ddns-noip-user").val(),
						"Noippassword": $("#ddns-noip-pwd").val(),
						"Noipdomain": $("#ddns-noip-domain").val()
					}
					//var a = common.validInfo(valid.cloudUsername(args.Noipusername)) && common.validInfo(valid.ddnspassword(args.Noippassword)) && common.validInfo(valid.domain(args.Noipdomain));
					//a == true ? main.setting.ddns.ddnsNoipLogin(args) : null;
					main.setting.ddns.ddnsNoipLogin(args)
				});
				$("#ddns-noip-Logout").click(function() {
					plug.button.disable($("#ddns-noip-Logout"));
					var args = {
						"NoipAction": 2,
						"types": "noip"
					}
					main.setting.ddns.ddnslogout(args)
				});
				$("#ddns-dyndns-Login").click(function() {
					//	var a = common.validInfo(valid.cloudUsername($("#ddns-dyndns-user").val())) && common.validInfo(valid.ddnspassword($("#ddns-dyndns-pwd").val())) && common.validInfo(valid.domain($("#ddns-dyndns-domain").val()));
					//if (a == true) {
					main.setting.ddns.ddnsDyndnsLogin()
					//}
				});
				$("#ddns-dyndns-Logout").click(function() {
					plug.button.disable($("#ddns-dyndns-Logout"));
					var args = {
						"DynAction": 2,
						"types": "dyndns"
					}
					main.setting.ddns.ddnslogout(args)
				});
				$("#ddns-cmxaction-Login").click(function() {

					var args = {
						"Cmxautorun": $(".ddns-cmxaction-radio-selected").val(),
						"Cmxusername": $("#ddns-cmxaction-user").val(),
						"Cmxpassword": $("#ddns-cmxaction-pwd").val(),
						"Cmxdomain": $("#ddns-cmxaction-domain").val()
					}
					//var a = common.validInfo(valid.cloudUsername(args.Cmxusername)) && common.validInfo(valid.ddnspassword(args.Cmxpassword)) && common.validInfo(valid.domain(args.Cmxdomain));
					//a == true ? main.setting.ddns.ddnsComexeLogin(args) : null;
					main.setting.ddns.ddnsComexeLogin(args)
				});
				$("#ddns-cmxaction-Logout").click(function() {
					plug.button.disable($("#ddns-cmxaction-Logout"));
					var args = {
						"CmxAction": 2,
						"types": "cmxaction"
					}
					main.setting.ddns.ddnslogout(args);
				});
				$("#setting-contain-ddns-ctrl-noip-save").click(function() {
					//var a = common.validInfo(valid.cloudUsername($("#ddns-noip-user").val())) && common.validInfo(valid.ddnspassword($("#ddns-noip-pwd").val())) && common.validInfo(valid.domain($("#ddns-noip-domain").val()));
					//a == true ? main.setting.ddns.noipSave() : null;
					main.setting.ddns.noipSave()
				});
				$("#setting-contain-ddns-ctrl-dyndns-save").click(function() {
					//	var a = common.validInfo(valid.cloudUsername($("#ddns-dyndns-user").val())) && common.validInfo(valid.ddnspassword($("#ddns-dyndns-pwd").val())) && common.validInfo(valid.domain($("#ddns-dyndns-domain").val()));
					//	a == true ? main.setting.ddns.dynSave() : null;
					main.setting.ddns.dynSave()
				});
				$("#setting-contain-ddns-ctrl-cmxaction-save").click(function() {
					//	var a = common.validInfo(valid.ddnsUsername($("#ddns-cmxaction-user").val())) && common.validInfo(valid.ddnspassword($("#ddns-cmxaction-pwd").val())) && common.validInfo(valid.domain($("#ddns-cmxaction-domain").val()));
					//	a == true ? main.setting.ddns.cmxSave() : null;
					main.setting.ddns.cmxSave()
				});
			},
			noipSave: function() {
				plug.button.disable($("#setting-contain-ddns-ctrl-noip-save"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"NoipAction": "0",
						"NoipUserName": Base64.encode($("#ddns-noip-user").val()),
						"NoipPassWord": Base64.encode($("#ddns-noip-pwd").val()),
						"NoipDomain": Base64.encode($("#ddns-noip-domain").val())
					},
					success: function(json) {
						plug.button.enable($("#setting-contain-ddns-ctrl-noip-save"));
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.ddns.setSuccess
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.setFailed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#setting-contain-ddns-ctrl-noip-save"));
					}
				}
				common.setAjax.init(args);
			},
			dynSave: function() {
				plug.button.disable($("#setting-contain-ddns-ctrl-dyndns-save"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"DynAction": "0",
						"DynUserName": Base64.encode($("#ddns-dyndns-user").val()),
						"DynPassWord": Base64.encode($("#ddns-dyndns-pwd").val()),
						"DynDomain": Base64.encode($("#ddns-dyndns-domain").val())
					},
					success: function(json) {
						plug.button.enable($("#setting-contain-ddns-ctrl-dyndns-save"));
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.ddns.setSuccess
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.setFailed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#setting-contain-ddns-ctrl-dyndns-save"));
					}
				}
				common.setAjax.init(args);
			},
			cmxSave: function() {
				plug.button.disable($("#setting-contain-ddns-ctrl-cmxaction-save"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"CmxAction": "0",
						"CmxUserName": Base64.encode($("#ddns-cmxaction-user").val()),
						"CmxPassWord": Base64.encode($("#ddns-cmxaction-pwd").val()),
						"CmxDomain": Base64.encode($("#ddns-cmxaction-domain").val())
					},
					success: function(json) {
						plug.button.enable($("#setting-contain-ddns-ctrl-cmxaction-save"));
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.ddns.setSuccess
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.setFailed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#setting-contain-ddns-ctrl-cmxaction-save"));
					}
				}
				common.setAjax.init(args);
			},
			noipShowLoadingStart: function(holder, text) {
				holder.text(text);
				main.noipShowLoadingInterval = clearInterval(main.noipShowLoadingInterval);
				main.noipShowLoadingInterval = setInterval(function() {
					holder.text(holder.text() + ".");
					holder.text() == text + "......" ? holder.text(text) : null;
				}, 500)
			},
			noipShowLoadingEnd: function(holder, text) {
				var text = text || "";
				holder.text(text);
				main.noipShowLoadingInterval = clearInterval(main.noipShowLoadingInterval);
			},
			dyndnsShowLoadingStart: function(holder, text) {
				holder.text(text);
				main.dyndnsShowLoadingInterval = clearInterval(main.dyndnsShowLoadingInterval);
				main.dyndnsShowLoadingInterval = setInterval(function() {
					holder.text(holder.text() + ".");
					holder.text() == text + "......" ? holder.text(text) : null;
				}, 500)
			},
			dyndnsShowLoadingEnd: function(holder, text) {
				var text = text || "";
				holder.text(text);
				main.dyndnsShowLoadingInterval = clearInterval(main.dyndnsShowLoadingInterval);
			},
			comexeShowLoadingStart: function(holder, text) {
				holder.text(text);
				main.comexeShowLoadingInterval = clearInterval(main.comexeShowLoadingInterval);
				main.comexeShowLoadingInterval = setInterval(function() {
					holder.text(holder.text() + ".");
					holder.text() == text + "......" ? holder.text(text) : null;
				}, 500)
			},
			comexeShowLoadingEnd: function(holder, text) {
				var text = text || "";
				holder.text(text);
				main.comexeShowLoadingInterval = clearInterval(main.comexeShowLoadingInterval);
			},
			getAjax: function() {
				var args = {
					url: '/ddns_get.fcgi',
					success: function(json) {
						if (json.errorCode == 0) {
							//json.NoipAutoBoot == 0 ? $("#ddns-noip-disable").click() : $("#ddns-noip-enable").click();
							//json.CmxAutoBoot == 0 ? $("#ddns-cmxaction-disable").click() : $("#ddns-cmxaction-enable").click();
							//json.DynAutoBoot == 0 ? $("#ddns-dyndns-disable").click() : $("#ddns-dyndns-enable").click();
							json.NoipAutoBoot == 0 ? null : $("#ddns-noip-enable").attr("checked", true);
							json.CmxAutoBoot == 0 ? null : $("#ddns-cmxaction-enable").attr("checked", true);
							json.DynAutoBoot == 0 ? null : $("#ddns-dyndns-enable").attr("checked", true);
							$("#ddns-cmxaction-user").val(Base64.decode(json.CmxUserName));
							$("#ddns-cmxaction-pwd").val(Base64.decode(json.CmxPassWord));
							$("#ddns-cmxaction-domain").val(Base64.decode(json.CmxDomain));
							$("#ddns-noip-user").val(Base64.decode(json.NoipUserName));
							$("#ddns-noip-pwd").val(Base64.decode(json.NoipPassWord));
							$("#ddns-noip-domain").val(Base64.decode(json.NoipDomain));
							$("#ddns-dyndns-user").val(Base64.decode(json.DynUserName));
							$("#ddns-dyndns-pwd").val(Base64.decode(json.DynPassWord));
							$("#ddns-dyndns-domain").val(Base64.decode(json.DynDomain));
							main.setting.ddns.ddnsConnectState(json.NoipStatus, "noip");
							main.setting.ddns.ddnsConnectState(json.CmxStatus, "cmxaction");
							main.setting.ddns.ddnsConnectState(json.DynStatus, "dyndns");
							common.upnpInfo.noip = Base64.decode(json.NoipDomain);
							common.upnpInfo.dyndns = Base64.decode(json.DynDomain);
							common.upnpInfo.cmxaction = Base64.decode(json.CmxDomain);
						}
					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
			},
			ddnsNoipLogin: function(setArgs) {
				plug.button.disable($("#ddns-noip-Login"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"NoipAction": 1,
						"NoipUserName": Base64.encode(setArgs.Noipusername),
						"NoipPassWord": Base64.encode(setArgs.Noippassword),
						"NoipDomain": Base64.encode(setArgs.Noipdomain)
					},
					success: function(json) {
						if (json.errorCode == 0) {
							plug.button.enable($("#ddns-noip-Login"));
							$("#ddns-noip-Login").hide();
							$("#ddns-noip-Logout").show();
							plug.button.disable($("#setting-contain-ddns-ctrl-noip-save"));
							main.noipLoopLoginCount = 0;
							main.setting.ddns.ddnsNoipStateDetect();
							main.setting.ddns.noipShowLoadingStart($("#ddns-noip-connect"), lang.state.connecting);

						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.loginFailed
							});
						}
					},
					error: function(xhr) {

					}
				}
				common.setAjax.init(args);
			},
			ddnsNoipStateDetect: function() {
				main.noipStateInterval = setInterval(function() {
					var args = {
						url: '/noip_status.fcgi',
						success: function(json) {
							main.noipLoopLoginCount = main.noipLoopLoginCount + 1;
							if (json.errorCode == 0) {
								if (json.NoipStatus == "Connected") {
									main.setting.ddns.noipShowLoadingEnd($("#ddns-noip-connect"));
									main.setting.ddns.ddnsConnectState("Connected", "noip");
									main.noipStateInterval = clearInterval(main.noipStateInterval);
								} else if (json.NoipStatus == "Disconnected") {
									main.noipStateInterval = clearInterval(main.noipStateInterval);
									main.setting.ddns.noipShowLoadingEnd($("#ddns-noip-connect"));
									main.setting.ddns.ddnsConnectState("Disconnected", "noip");
									$("#ddns-noip-Login").show();
									$("#ddns-noip-Logout").hide();
								} else if (main.noipLoopLoginCount > 20) {
									main.setting.ddns.noipShowLoadingEnd($("#ddns-noip-connect"));
									main.noipStateInterval = clearInterval(main.noipStateInterval);
									plug.button.enable($("#setting-contain-ddns-ctrl-noip-save"));
									main.setting.ddns.ddnsConnectState("Disconnected", "noip");
									$("#ddns-noip-Logout").click();
								} else if (json.NoipStatus == "Connecting") {
									$("#ddns-noip-Login").hide();
									$("#ddns-noip-Logout").show();
									main.setting.ddns.noipShowLoadingStart($("#ddns-noip-connect"), lang.state.connecting);
								}
							} else {}
						},
						error: function(xhr) {

						}
					}
					common.ajax.init(args);
				}, 3000);
			},
			ddnsComexeLogin: function(setArgs) {
				plug.button.disable($("#ddns-cmxaction-Login"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"CmxAction": 1,
						"CmxUserName": Base64.encode(setArgs.Cmxusername),
						"CmxPassWord": Base64.encode(setArgs.Cmxpassword),
						"CmxDomain": Base64.encode(setArgs.Cmxdomain)
					},
					success: function(json) {
						if (json.errorCode == 0) {
							plug.button.enable($("#ddns-cmxaction-Login"));
							$("#ddns-cmxaction-Login").hide();
							$("#ddns-cmxaction-Logout").show();
							plug.button.disable($("#setting-contain-ddns-ctrl-cmxaction-save"));
							main.comexeLoopLoginCount = 0;
							main.setting.ddns.comexeShowLoadingStart($("#ddns-cmxaction-connect"), lang.state.connecting);
							main.setting.ddns.ddnsComexeStateDetect();
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.setFailed
							});
						}
					},
					error: function(xhr) {

					}
				}
				common.setAjax.init(args);
			},
			ddnsComexeStateDetect: function() {
				main.comexeStateInterval = setInterval(function() {
					var args = {
						url: '/cmx_status.fcgi',
						success: function(json) {
							main.comexeLoopLoginCount = main.comexeLoopLoginCount + 1;
							if (json.errorCode == 0) {
								if (json.CmxStatus == "Connected") {
									main.setting.ddns.comexeShowLoadingEnd($("#ddns-cmxaction-connect"));
									main.setting.ddns.ddnsConnectState("Connected", "cmxaction");
									main.comexeStateInterval = clearInterval(main.comexeStateInterval);
								} else if (json.CmxStatus == "Disconnected") {
									main.comexeStateInterval = clearInterval(main.comexeStateInterval);
									main.setting.ddns.comexeShowLoadingEnd($("#ddns-cmxaction-connect"));
									main.setting.ddns.ddnsConnectState("Disconnected", "cmxaction");
									$("#ddns-cmxaction-Login").show();
									$("#ddns-cmxaction-Logout").hide();
								} else if (main.comexeLoopLoginCount > 20) {
									main.setting.ddns.comexeShowLoadingEnd($("#ddns-cmxaction-connect"));
									main.comexeStateInterval = clearInterval(main.comexeStateInterval);
									plug.button.enable($("#setting-contain-ddns-ctrl-cmxaction-save"));
									main.setting.ddns.ddnsConnectState("Disconnected", "cmxaction");
									$("#ddns-cmxaction-Logout").click();
								} else if (json.CmxStatus == "Connecting") {
									$("#ddns-cmxaction-Login").hide();
									$("#ddns-cmxaction-Logout").show();
									main.setting.ddns.comexeShowLoadingStart($("#ddns-cmxaction-connect"), lang.state.connecting);
								}
							} else {
								//alert(lang.ajax.ddns.loginFailed);
							}

						},
						error: function(xhr) {

						}
					}
					common.ajax.init(args);
				}, 3000);
			},
			ddnsDyndnsLogin: function() {
				plug.button.disable($("#ddns-dyndns-Login"));
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"DynAction": 1,
						"DynUserName": Base64.encode($("#ddns-dyndns-user").val()),
						"DynPassWord": Base64.encode($("#ddns-dyndns-pwd").val()),
						"DynDomain": Base64.encode($("#ddns-dyndns-domain").val())
					},
					success: function(json) {
						if (json.errorCode == 0) {
							plug.button.enable($("#ddns-dyndns-Login"));
							$("#ddns-dyndns-Login").hide();
							$("#ddns-dyndns-Logout").show();
							plug.button.disable($("#setting-contain-ddns-ctrl-dyndns-save"));
							main.dyndnsLoopLoginCount = 0;
							main.setting.ddns.ddnsDyndnsStateDetect();
							main.setting.ddns.dyndnsShowLoadingStart($("#ddns-dyndns-connect"), lang.state.connecting);
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.setFailed
							});
						}
					},
					error: function(xhr) {}
				}
				common.setAjax.init(args);
			},
			ddnsDyndnsStateDetect: function() {
				main.dyndnsStateInterval = setInterval(function() {
					var args = {
						url: '/dyn_status.fcgi',
						success: function(json) {
							main.dyndnsLoopLoginCount = main.dyndnsLoopLoginCount + 1;
							if (json.errorCode == 0) {
								if (json.DynStatus == "Connected") {
									main.setting.ddns.dyndnsShowLoadingEnd($("#ddns-dyndns-connect"));
									main.setting.ddns.ddnsConnectState("Connected", "dyndns");
									main.dyndnsStateInterval = clearInterval(main.dyndnsStateInterval);
								} else if (json.DynStatus == "Disconnected") {
									main.dyndnsStateInterval = clearInterval(main.dyndnsStateInterval);
									main.setting.ddns.dyndnsShowLoadingEnd($("#ddns-dyndns-connect"));
									main.setting.ddns.ddnsConnectState("Disconnected", "dyndns");
									$("#ddns-dyndns-Login").show();
									$("#ddns-dyndns-Logout").hide();
								} else if (main.dyndnsLoopLoginCount > 20) {
									main.setting.ddns.dyndnsShowLoadingEnd($("#ddns-dyndns-connect"));
									main.dyndnsStateInterval = clearInterval(main.dyndnsStateInterval);
									plug.button.enable($("#setting-contain-ddns-ctrl-dyndns-save"));
									main.setting.ddns.ddnsConnectState("Disconnected", "dyndns");
									$("#ddns-dyndns-Logout").click();
								} else if (json.DynStatus == "Connecting") {
									$("#ddns-dyndns-Login").hide();
									$("#ddns-dyndns-Logout").show();
									main.setting.ddns.dyndnsShowLoadingStart($("#ddns-dyndns-connect"), lang.state.connecting);
								}

							} else {}
						},
						error: function(xhr) {

						}
					}
					common.ajax.init(args);
				}, 3000);
			},
			ddnslogout: function(setArgs) {
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"CmxAction": setArgs.CmxAction || "-1",
						"DynAction": setArgs.DynAction || "-1",
						"NoipAction": setArgs.NoipAction || "-1"
					},
					success: function(json) {
						if (json.errorCode == 0) {
							if (setArgs.NoipAction) {
								main.setting.ddns.noipShowLoadingEnd($("#ddns-noip-connect"));
								main.noipStateInterval = clearInterval(main.noipStateInterval);
								//plug.button.enable($("#ddns-noip-Login"));
							} else if (setArgs.DynAction) {
								main.setting.ddns.dyndnsShowLoadingEnd($("#ddns-dyndns-connect"));
								main.dyndnsStateInterval = clearInterval(main.dyndnsStateInterval);
								//	plug.button.enable($("#ddns-dyndns-Login"));
							} else if (setArgs.CmxAction) {
								main.setting.ddns.comexeShowLoadingEnd($("#ddns-comexe-connect"));
								main.comexeStateInterval = clearInterval(main.comexeStateInterval);
								//	plug.button.enable($("#ddns-cmxaction-Login"));
							}
							main.setting.ddns.ddnsConnectState("Disconnected", setArgs.types);
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.logoutFailed
							});
						}
					},
					error: function(xhr) {

					}
				}
				common.setAjax.init(args);
			},

			ddnsConnectState: function(status, types) {
				var $connect = $("#ddns-" + types + "-connect"),
					$login = $("#ddns-" + types + "-Login"),
					$logout = $("#ddns-" + types + "-Logout"),
					$savebutton = $("#setting-contain-ddns-ctrl-" + types + "-save");
				if (status == "Disconnected") {
					// plug.button.enable($login);
					plug.button.enable($logout);
					$login.show();
					$logout.hide();
					plug.button.enable($savebutton);
					$connect.html(lang.state.disconnect);
				} else if (status == "Connecting") {
					// plug.button.disable($login);
					// plug.button.enable($logout);
					$login.hide();
					$logout.show();
					plug.button.disable($savebutton);
					$connect.html(lang.state.connecting);
				} else if (status == "Connected") {
					// plug.button.disable($login);
					// plug.button.enable($logout);
					$logout.show();
					$login.hide();
					plug.button.disable($savebutton);
					$connect.html(lang.state.connected);
				}
			},
			setAjax: function(setArgs) {
				setArgs.Cmxusername = setArgs.Cmxusername || "-1";
				setArgs.Cmxpassword = setArgs.Cmxpassword || "-1";
				setArgs.Cmxdomain = setArgs.Cmxdomain || "-1";
				setArgs.Dynusername = setArgs.Dynusername || "-1";
				setArgs.Dynpassword = setArgs.Dynpassword || "-1";
				setArgs.Dyndomain = setArgs.Dyndomain || "-1";
				setArgs.Noipusername = setArgs.Noipusername || "-1";
				setArgs.Noippassword = setArgs.Noippassword || "-1";
				setArgs.Noipdomain = setArgs.Noipdomain || "-1";
				var args = {
					url: '/ddns_set.fcgi',
					data: {
						"CmxAction": setArgs.CmxAction || "-1",
						"CmxAutoBoot": setArgs.Cmxautorun || "-1",
						"CmxUserName": Base64.encode(setArgs.Cmxusername),
						"CmxPassWord": Base64.encode(setArgs.Cmxpassword),
						"CmxDomain": Base64.encode(setArgs.Cmxdomain),
						"DynAction": setArgs.DynAction || "-1",
						"DynAutoBoot": setArgs.Dynautorun || "-1",
						"DynUserName": Base64.encode(setArgs.Dynusername),
						"DynPassWord": Base64.encode(setArgs.Dynpassword),
						"DynDomain": Base64.encode(setArgs.Dyndomain),
						"NoipAction": setArgs.NoipAction || "-1",
						"NoipAutoBoot": setArgs.Noipautorun || "-1",
						"NoipUserName": Base64.encode(setArgs.Noipusername),
						"NoipPassWord": Base64.encode(setArgs.Noippassword),
						"NoipDomain": Base64.encode(setArgs.Noipdomain)
					},
					success: function(json) {
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.ddns.setSuccess
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.ddns.setFailed
							});
						}
					},
					error: function(xhr) {

					}
				}
				common.setAjax.init(args);
			}
		},
		smtpAlarm: {
			init: function() {
				//	main.setting.smtpAlarm.getVal();
				main.setting.smtpAlarm.bind();
			},
			bind: function() {
				// $("#setting-ftpalarm-metro").click(function() {
				// 	main.setting.smtpAlarm.getVal();
				// });
				$("#email_notifica").click(function() {
					if ($(this).attr("checked")) {
						$("#setting-contain-notice-smtp").show();
					} else {
						$("#setting-contain-notice-smtp").hide();
					}
				});
				$("#setting-contain-smtp-alarm-ctrl-save").click(function() {
					main.setting.smtpAlarm.validSmtp() == true ? main.setting.smtpAlarm.saveVal() : null;
				});
				$("#setting-contain-test-a-email").click(function() {
					main.setting.smtpAlarm.validSmtp() == true ? main.setting.smtpAlarm.testEmail() : null;
				});
				$("#recipient-creat-title").click(function() {
					$(".recipient-creat-contain:hidden:first").show();
					$(".recipient-creat-contain:hidden").length == 0 ? $(this).hide() : null;
				});
				$(".recipient-creat-delete").click(function() {
					$("#recipient-creat-title").show();
					$(this).siblings("input").val("");
					$(this).parent("span").parent(".recipient-creat-contain").hide();
				});
				$("#advance-smtp-server-sslencry").change(function() {
					if ($(this).val() == 1) {
						$("#advance-smtp-server-port").val(465)
					} else {
						$("#advance-smtp-server-port").val(25)
					}
				})
			},
			showLoadingStart: function(holder, text) {
				holder.text(text);
				main.smtpShowLoadingInterval = setInterval(function() {
					holder.text(holder.text() + ".");
					holder.text() == text + "......" ? holder.text(text) : null;
				}, 500)
			},
			showLoadingEnd: function(holder, text) {
				var text = text || "";
				holder.text(text);
				main.smtpShowLoadingInterval = clearInterval(main.smtpShowLoadingInterval);
			},
			validSmtp: function() {
				var smtpRemail1 = $("#advance-smtp-server-recipient1").val(),
					smtpRemail2 = $("#advance-smtp-server-recipient2").val(),
					smtpRemail3 = $("#advance-smtp-server-recipient3").val(),
					smtpRemail4 = $("#advance-smtp-server-recipient4").val();
				if (smtpRemail1 + smtpRemail2 + smtpRemail3 + smtpRemail4 == "") {
					plug.window.alert({
						"info": lang.valid.smtpRemailAllEmpty
					});
				} else {
					var smtpEmai1Show = $("#recipient-creat-1").css("display"),
						smtpEmai2Show = $("#recipient-creat-2").css("display"),
						smtpEmai3Show = $("#recipient-creat-3").css("display"),
						smtpEmai4Show = $("#recipient-creat-4").css("display");
					if (smtpEmai1Show=="block" && smtpRemail1.length < 1 || smtpRemail1.length > 32) {
						plug.window.alert({
							info: lang.valid.email.limit
						});
						return;
					}
					if (smtpEmai2Show=="block" && smtpRemail2.length < 1 || smtpRemail2.length > 32) {
						plug.window.alert({
							info: lang.valid.email.limit
						});
						return;
					}
					if (smtpEmai3Show=="block" && smtpRemail3.length < 1 || smtpRemail3.length > 32) {
						plug.window.alert({
							info: lang.valid.email.limit
						});
						return;
					}
					if (smtpEmai4Show=="block" && smtpRemail4.length < 1 || smtpRemail4.length > 32) {
						plug.window.alert({
							info: lang.valid.email.limit
						});
						return;
					}

					if ($("#advance-smtp-server-username").val().length < 1 || $("#advance-smtp-server-username").val().length > 32) {
						plug.window.alert({
							info: lang.valid.email.limit
						});
						return;
					}

					var a = false,
						ip;
					var ippattern = /^[0-9.]+$/;
					ippattern.test($("#advance-smtp-server-ip").val()) == false ? ip = common.validInfo(valid.domain($("#advance-smtp-server-ip").val())) : ip = common.validInfo(valid.ip($("#advance-smtp-server-ip").val()));
					ip == true ? a = common.validInfo(valid.smtpPort($("#advance-smtp-server-port").val())) && common.validInfo(valid.email(smtpRemail1, {
						"holder": "smtpRemail1",
						"lengthNull": "enable"
					})) && common.validInfo(valid.email(smtpRemail2, {
						"holder": "smtpRemail2",
						"lengthNull": "disable"
					})) && common.validInfo(valid.email(smtpRemail3, {
						"holder": "smtpRemail3",
						"lengthNull": "disable"
					})) && common.validInfo(valid.email(smtpRemail4, {
						"holder": "smtpRemail4",
						"lengthNull": "disable"
					}))
					// && common.validInfo(valid.email($("#advance-smtp-server-sender").val(), {
					// 	"holder": "smtpSender",
					// 	"lengthNull": "enable"
					// })) 
					&&
					//common.validInfo(valid.smtpUsername($("#advance-smtp-server-username").val())) && common.validInfo(valid.smtpPwd($("#advance-smtp-server-password").val())) : null;
					common.validInfo(valid.email($("#advance-smtp-server-username").val(), {
						"holder": "smtpSender",
						"lengthNull": "enable"
					})) && common.validInfo(valid.smtpPwd($("#advance-smtp-server-password").val())) : null;
					a = a && ip;
					return a;
				}
			},
			// getVal: function() {
			// 	var args = {
			// 		url: '/smtp_load.fcgi',
			// 		success: function(json) {

			// 		},
			// 		error: function(xhr) {

			// 		}
			// 	}
			// 	common.ajax.init(args);
			// },
			saveVal: function() {
				plug.button.disable($("#setting-contain-ftp-alarm-ctrl-save"));
				var args = {
					url: '/smtp_and_ftp_save.fcgi',
					data: {
						"smtp_is_enable": 0,
						// "smtp_from": Base64.encode($("#advance-smtp-server-sender").val()),
						"smtp_to": Base64.encode($("#advance-smtp-server-recipient1").val() + ";" + $("#advance-smtp-server-recipient2").val() + ";" + $("#advance-smtp-server-recipient3").val() + ";" + $("#advance-smtp-server-recipient4").val()),
						"smtp_mailhub": Base64.encode($("#advance-smtp-server-ip").val() + ":" + $("#advance-smtp-server-port").val()),
						"smtp_auth_user": Base64.encode($("#advance-smtp-server-username").val()),
						"smtp_auth_pass": Base64.encode($("#advance-smtp-server-password").val()),
						"smtp_encryption": $("#advance-smtp-server-sslencry").val(),
						"smtp_send_time": $("#advance-smtp-server-interval").val(),
						"ftp_is_enable": 0,
						"ftp_server": Base64.encode($("#advance-ftp-server-serviceaddr").val()),
						"ftp_port": Base64.encode($("#advance-ftp-server-port").val()),
						"ftp_user": Base64.encode($("#advance-ftp-server-username").val()),
						"ftp_password": Base64.encode($("#advance-ftp-server-password").val()),
						"ftp_path": Base64.encode($("#advance-ftp-server-path").val()),
						"ftp_mode": Base64.encode("0")
					},
					success: function(json) {
						main.setting.smtpAlarm.responseError(json);
						plug.button.enable($("#setting-contain-ftp-alarm-ctrl-save"));
					},
					error: function(xhr) {
						plug.button.enable($("#setting-contain-ftp-alarm-ctrl-save"));
					}
				}
				if ($("#ftp_img_upload").attr("checked")) {
					args.data.ftp_is_enable = 1
				}
				if ($("#email_notifica").attr("checked")) {
					args.data.smtp_is_enable = 1
				}
				if ($("#advance-ftp-server-initiative").attr("checked")) {
					args.data.ftp_mode = Base64.encode("1");
				}
				common.setAjax.init(args);
			},
			result: function(result) {
				var code = Base64.decode(result);
				if (code == "0000") {
					plug.window.alert({
						"info": lang.ajax.smtp.oooo
					})
				} else if (code == "0001") {
					plug.window.alert({
						"info": lang.ajax.smtp.ooox
					})
				} else if (code == "0011") {
					plug.window.alert({
						"info": lang.ajax.smtp.ooxx
					})
				} else if (code == "0111") {
					plug.window.alert({
						"info": lang.ajax.smtp.oxxx
					})
				} else if (code == "1111") {
					plug.window.alert({
						"info": lang.ajax.smtp.xxxx
					})
				} else if (code == "1110") {
					plug.window.alert({
						"info": lang.ajax.smtp.xxxo
					})
				} else if (code == "1100") {
					plug.window.alert({
						"info": lang.ajax.smtp.xxoo
					})
				} else if (code == "1000") {
					plug.window.alert({
						"info": lang.ajax.smtp.xooo
					})
				} else if (code == "0110") {
					plug.window.alert({
						"info": lang.ajax.smtp.oxxo
					})
				} else if (code == "0010") {
					plug.window.alert({
						"info": lang.ajax.smtp.ooxo
					})
				} else if (code == "0100") {
					plug.window.alert({
						"info": lang.ajax.smtp.oxoo
					})
				} else if (code == "0101") {
					plug.window.alert({
						"info": lang.ajax.smtp.oxox
					})
				} else if (code == "1010") {
					plug.window.alert({
						"info": lang.ajax.smtp.xoxo
					})
				} else if (code == "1001") {
					plug.window.alert({
						"info": lang.ajax.smtp.xoox
					})
				} else if (code == "1101") {
					plug.window.alert({
						"info": lang.ajax.smtp.xxox
					})
				} else if (code == "1011") {
					plug.window.alert({
						"info": lang.ajax.smtp.xoxx
					})
				}
			},
			responseError: function(json) {
				if (json.errorCode == 0) {
					if (json.result) {
						main.setting.smtpAlarm.result(json.result);
					} else {
						plug.window.alert({
							"info": lang.ajax.notice.setSuccess
						})
					}
				} else if (json.errorCode == 1300) {
					plug.window.alert({
						"info": lang.ajax.ftp.setFailed
					});
				} else if (json.errorCode == 1259) {
					plug.window.alert({
						"info": lang.ajax.smtp.connectFailed
					});
				} else if (json.errorCode == 1261) {
					plug.window.alert({
						"info": lang.ajax.smtp.xxxx
					});
				} else if (json.errorCode == 1260) {
					plug.window.alert({
						"info": lang.ajax.smtp.pwderror
					});
				} else if (json.errorCode == 1262) {
					plug.window.alert({
						"info": lang.ajax.smtp.sendererror
					});
				} else if (json.errorCode == 1275) {
					plug.window.alert({
						"info": lang.ajax.smtp.setFailed
					});
				} else if (json.errorCode == 1285) {
					plug.window.alert({
						"info": lang.ajax.ftp.disconnect
					});
				} else if (json.errorCode == 1286) {
					plug.window.alert({
						"info": lang.ajax.ftp.loginFailed
					});
				} else if (json.errorCode == 1287) {
					plug.window.alert({
						"info": lang.ajax.ftp.upLoadFailed
					});
				} else if (json.errorCode == 1288) {
					plug.window.alert({
						"info": lang.ajax.ftp.modeError
					});
				} else if (json.errorCode == 1289) {
					plug.window.alert({
						"info": lang.ajax.ftp.ftpPowerLow
					});
				} else if (json.errorCode == 1281) {
					plug.window.alert({
						"info": lang.ajax.ftp.missusrname
					});
				} else if (json.errorCode == 1277) {
					plug.window.alert({
						"info": lang.ajax.ftp.servererror
					});
				} else {
					plug.window.alert({
						"info": lang.ajax.smtp.setFailed
					});
				}
			},
			testFailed: function() {
				//$("#setting-contain-test-a-email").attr("disabled", false);
				plug.button.enable($("#setting-contain-test-a-email"));
				plug.button.enable($("#setting-contain-ftp-alarm-ctrl-save"));
				common.showLoadingEnd($("#smtp-test-loadingshow"));
				plug.window.alert({
					"info": lang.ajax.testmail
				});
			},
			testEmail: function() {
				//$("#setting-contain-test-a-email").attr("disabled", true);
				plug.button.disable($("#setting-contain-test-a-email"));
				plug.button.disable($("#setting-contain-ftp-alarm-ctrl-save"));
				common.showLoadingStart($("#smtp-test-loadingshow"), lang.state.testing);
				var args = {
					url: '/smtp_test.fcgi',
					data: {
						"smtp_is_enable": 1,
						// "smtp_from": Base64.encode($("#advance-smtp-server-sender").val()),
						"smtp_to": Base64.encode($("#advance-smtp-server-recipient1").val() + ";" + $("#advance-smtp-server-recipient2").val() + ";" + $("#advance-smtp-server-recipient3").val() + ";" + $("#advance-smtp-server-recipient4").val()),
						"smtp_mailhub": Base64.encode($("#advance-smtp-server-ip").val() + ":" + $("#advance-smtp-server-port").val()),
						"smtp_auth_user": Base64.encode($("#advance-smtp-server-username").val()),
						"smtp_auth_pass": Base64.encode($("#advance-smtp-server-password").val()),
						"smtp_encryption": $("#advance-smtp-server-sslencry").val(),
						"smtp_send_time": $("#advance-smtp-server-interval").val()
					},
					success: function(json) {
						//main.setting.smtpAlarm.responseError(json);
						if (json.errorCode == 0) {
							
							/*var args = {
								url: '/smtp_test.fcgi',
								timeout: 60000,
								data: {
									"smtp_test": 1
								},
								success: function(json) {
									//$("#setting-contain-test-a-email").attr("disabled", false);
									plug.button.enable($("#setting-contain-test-a-email"));
									plug.button.enable($("#setting-contain-ftp-alarm-ctrl-save"));
									common.showLoadingEnd($("#smtp-test-loadingshow"));
									main.setting.smtpAlarm.responseError(json);
								},
								error: function(xhr) {
									main.setting.smtpAlarm.testFailed();
									return false;
								}
							}
							common.ajax.init(args);*/
							plug.button.enable($("#setting-contain-test-a-email"));
							plug.button.enable($("#setting-contain-ftp-alarm-ctrl-save"));
							common.showLoadingEnd($("#smtp-test-loadingshow"));
							main.setting.smtpAlarm.responseError(json);
						} else {
							//$("#setting-contain-test-a-email").attr("disabled", false);
							plug.button.enable($("#setting-contain-test-a-email"));
							plug.button.enable($("#setting-contain-ftp-alarm-ctrl-save"));
							common.showLoadingEnd($("#smtp-test-loadingshow"));
							main.setting.smtpAlarm.responseError(json);
						}
					},
					error: function(xhr) {
						main.setting.smtpAlarm.testFailed();
						return false;
					}
				}
				common.setAjax.init(args);

			}
		},
		ftpAlarm: {
			init: function() {
				//main.setting.ftpAlarm.getVal();
				main.setting.ftpAlarm.bind();
			},
			bind: function() {
				$("#advance-ftp-test").attr("disabled", false);
				$("#setting-ftpalarm-metro").one("click", function() {
					plug.checkbox.initial($(".setting-contain-ftpalarm"));
				});
				$("#setting-contain-test-a-email").attr("disabled", false);
				$("#setting-ftpalarm-metro").click(function() {
					main.setting.ftpAlarm.getVal();
				});
				$("#setting-contain-ftp-alarm-ctrl-save").click(function() {
					if ($("#ftp_img_upload").attr("checked") && $("#email_notifica").attr("checked")) {
						main.setting.ftpAlarm.ftpvalid() && main.setting.smtpAlarm.validSmtp() == true ? main.setting.smtpAlarm.saveVal() : null;
					} else if ($("#ftp_img_upload").attr("checked") && !$("#email_notifica").attr("checked")) {
						main.setting.ftpAlarm.ftpvalid() == true ? main.setting.smtpAlarm.saveVal() : null;
					} else if (!$("#ftp_img_upload").attr("checked") && !$("#email_notifica").attr("checked")) {
						main.setting.smtpAlarm.saveVal();
					} else if (!$("#ftp_img_upload").attr("checked") && $("#email_notifica").attr("checked")) {
						main.setting.smtpAlarm.validSmtp() == true ? main.setting.smtpAlarm.saveVal() : null;
					}
				});
				// $("#setting-contain-smtp-ftp-alarm-ctrl-cancel").click(function() {
				// 	main.setting.ftpAlarm.resetVal();
				// });
				$("#advance-ftp-test").click(function() {
					main.setting.ftpAlarm.ftpvalid() == true ? main.setting.ftpAlarm.testFtp() : null;
				});
				$(".ftp-radio-setting").click(function() {
					$(".ftp-radio-setting").removeClass("ftp-radio-setting-selected");
					$(this).addClass("ftp-radio-setting-selected");
				});
				$("#ftp_img_upload").click(function() {
					if ($(this).attr("checked")) {
						$("#setting-contain-notice-ftp").show();
					} else {
						$("#setting-contain-notice-ftp").hide();
					}
				});
			},
			showLoadingStart: function(holder, text) {
				holder.text(text);
				main.ftpShowLoadingInterval = setInterval(function() {
					holder.text(holder.text() + ".");
					holder.text() == text + "......" ? holder.text(text) : null;
				}, 500)
			},
			showLoadingEnd: function(holder, text) {
				var text = text || "";
				holder.text(text);
				main.ftpShowLoadingInterval = clearInterval(main.ftpShowLoadingInterval);
			},
			ftpvalid: function() {
				var flag;
				$("#advance-ftp-server-username").val() == null ? ($("#advance-ftp-server-password").val() == null ? flag = false : flag = true) : flag = true;
				if (flag == true) {
					var a = common.validInfo((valid.ftp($("#advance-ftp-server-serviceaddr").val()))) 
							&& common.validInfo((valid.ftpPort($("#advance-ftp-server-port").val()))) 
							&& common.validInfo((valid.ftpUsername($("#advance-ftp-server-username").val()))) 
							&& common.validInfo((valid.ftpPath($("#advance-ftp-server-path").val())))
							&& common.validInfo((valid.ftpPassword($("#advance-ftp-server-password").val())));
					return a;
				} else {
					plug.window.alert({
						"info": lang.valid.ftp.unamenull
					});
				}
			},
			getVal: function() {
				var args = {
					url: '/smtp_and_ftp_load.fcgi',
					success: function(json) {
						$("#advance-ftp-server-serviceaddr").val(Base64.decode(json.ftp_server));
						$("#advance-ftp-server-port").val(Base64.decode(json.ftp_port));
						$("#advance-ftp-server-username").val(Base64.decode(json.ftp_user));
						$("#advance-ftp-server-password").val(Base64.decode(json.ftp_password));
						$("#advance-ftp-server-path").val(Base64.decode(json.ftp_path));
						if (json.ftp_mode == 1) {
							$("#advance-ftp-server-initiative").attr("checked", true)
						} else {
							$("#advance-ftp-server-initiative").attr("checked", false)
						}
						if (json.ftp_is_enable == 1) { //不用click()是因为显示页面时会重新获取此请求，造成重复点击
							$("#ftp_img_upload").attr("checked", true);
							$("#setting-contain-notice-ftp").show();
							plug.checkbox.initial($(".setting-contain-ftpalarm"));
						} else {
							$("#ftp_img_upload").attr("checked", false);
							$("#setting-contain-notice-ftp").hide();
						}
						//$(".setting-contain-ftpalarm .checkbox").remove();
						//$("#setting-contain-notice-ftp").click();
						var a = Base64.decode(json.smtp_to)
						$("#advance-smtp-server-recipient2").val("");
						$("#advance-smtp-server-recipient3").val("");
						$("#advance-smtp-server-recipient4").val("");
						if (a.split(";")[1]) {
							$("#advance-smtp-server-recipient2").val(a.split(";")[1]);
							$("#recipient-creat-2").show();
						}
						if (a.split(";")[2]) {
							$("#advance-smtp-server-recipient3").val(a.split(";")[2]);
							$("#recipient-creat-3").show();
						}
						if (a.split(";")[3]) {
							$("#advance-smtp-server-recipient4").val(a.split(";")[3]);
							$("#recipient-creat-4").show();
						}
						$("#advance-smtp-server-recipient1").val(a.split(";")[0]);
						// $("#advance-smtp-server-sender").val(Base64.decode(json.smtp_from));
						$("#advance-smtp-server-username").val(Base64.decode(json.smtp_auth_user));
						$("#advance-smtp-server-password").val(Base64.decode(json.smtp_auth_pass));
						$("#advance-smtp-server-sslencry").val(json.smtp_encryption).change();
						$("#advance-smtp-server-interval").val(json.smtp_send_time).change();
						
						var b = Base64.decode(json.smtp_mailhub);
						$("#advance-smtp-server-ip").val(b.split(":")[0]);
						$("#advance-smtp-server-port").val(b.split(":")[1]);
						
						if (json.smtp_is_enable == 1) {
							$("#email_notifica").attr("checked", true);
							$("#setting-contain-notice-smtp").show();
						} else {
							$("#email_notifica").attr("checked", false);
							$("#setting-contain-notice-smtp").hide();
						}
						plug.checkbox.initial($(".setting-contain-ftpalarm"));
					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
			},
			// resetVal: function() {
			// 	main.setting.ftpAlarm.getVal();
			// },
			responseError: function(errorCode) {
				if (errorCode == 0) {
					plug.window.alert({
						"info": lang.ajax.ftp.setSuccess
					});
				} else if (errorCode == -1 || errorCode == 1285) {
					plug.window.alert({
						"info": lang.ajax.ftp.setFailed
					});
				} else if (errorCode == 1300) {
					plug.window.alert({
						"info": lang.ajax.ftp.setFailed
					})
				} else if (errorCode == 1286) {
					plug.window.alert({
						"info": lang.ajax.ftp.loginFailed
					});
				} else if (errorCode == 1287) {
					plug.window.alert({
						"info": lang.ajax.ftp.upLoadFailed
					});
				} else if (errorCode == 1288) {
					plug.window.alert({
						"info": lang.ajax.ftp.modeError
					});
				} else if (errorCode == 1289) {
					plug.window.alert({
						"info": lang.ajax.ftp.ftpPowerLow
					});
				} else if (errorCode == 1281) {
					plug.window.alert({
						"info": lang.ajax.ftp.missusrname
					});
				} else if (errorCode == 1277) {
					plug.window.alert({
						"info": lang.ajax.ftp.servererror
					});
				}
			},
			testFailed: function() {
				main.setting.ftpAlarm.showLoadingEnd($("#ftp-test-loadingshow"));
				//$("#advance-ftp-test").attr("disabled", false);
				plug.button.enable($("#advance-ftp-test"));
				plug.button.enable($("#setting-contain-ftp-alarm-ctrl-save"));
				plug.window.alert({
					"info": lang.ajax.testftp
				});
			},
			testFtp: function() {
				//$("#advance-ftp-test").attr("disabled", true);
				plug.button.disable($("#advance-ftp-test"));
				plug.button.disable($("#setting-contain-ftp-alarm-ctrl-save"));
				main.setting.ftpAlarm.showLoadingStart($("#ftp-test-loadingshow"), lang.state.testing);
				/*var args = {
					url: '/ftp_test.fcgi',
					timeout: 60000,
					data: {
						"ftp_test": 1
					},
					success: function(json) {
						//$("#advance-ftp-test").attr("disabled", false);
						plug.button.enable($("#advance-ftp-test"));
						plug.button.enable($("#setting-contain-ftp-alarm-ctrl-save"));
						main.setting.ftpAlarm.showLoadingEnd($("#ftp-test-loadingshow"));
						main.setting.ftpAlarm.responseError(json.errorCode)
					},
					error: function(xhr) {
						main.setting.ftpAlarm.testFailed();
						return false;
					}
				}
				common.ajax.init(args);*/
				
				var args = {
					url: '/ftp_test.fcgi'/*'/ftp_save.fcgi'*/,
					data: {
						"ftp_is_enable": 1,
						"ftp_server": Base64.encode($("#advance-ftp-server-serviceaddr").val()),
						"ftp_port": Base64.encode($("#advance-ftp-server-port").val()),
						"ftp_user": Base64.encode($("#advance-ftp-server-username").val()),
						"ftp_password": Base64.encode($("#advance-ftp-server-password").val()),
						"ftp_path": Base64.encode($("#advance-ftp-server-path").val()),
						"ftp_mode": Base64.encode("0")
					},
					success: function(json) {
						if (json.errorCode == 0) {
							/*var args = {
								url: '/ftp_test.fcgi',
								timeout: 60000,
								data: {
									"ftp_test": 1
								},
								success: function(json) {
									//$("#advance-ftp-test").attr("disabled", false);
									plug.button.enable($("#advance-ftp-test"));
									plug.button.enable($("#setting-contain-ftp-alarm-ctrl-save"));
									main.setting.ftpAlarm.showLoadingEnd($("#ftp-test-loadingshow"));
									main.setting.ftpAlarm.responseError(json.errorCode)
								},
								error: function(xhr) {
									main.setting.ftpAlarm.testFailed();
									return false;
								}
							}
							common.ajax.init(args);*/
							plug.button.enable($("#advance-ftp-test"));
							plug.button.enable($("#setting-contain-ftp-alarm-ctrl-save"));
							main.setting.ftpAlarm.showLoadingEnd($("#ftp-test-loadingshow"));
							main.setting.ftpAlarm.responseError(json.errorCode)
						} else {
							//$("#advance-ftp-test").attr("disabled", false);
							plug.button.enable($("#advance-ftp-test"));
							plug.button.enable($("#setting-contain-ftp-alarm-ctrl-save"));
							main.setting.ftpAlarm.showLoadingEnd($("#ftp-test-loadingshow"));
							main.setting.ftpAlarm.responseError(json.errorCode)
							return false;
						}
					},
					error: function(xhr) {
						main.setting.ftpAlarm.testFailed();
						return false;
					}
				};
				
				if ($("#advance-ftp-server-initiative").attr("checked")) {
					args.data.ftp_mode = Base64.encode("1");
				}
				
				common.setAjax.init(args);
				
			}

		},
		led: {
			init: function() {
				main.setting.led.bind();
				//	main.setting.led.getLed();
			},
			bind: function() {
				plug.button.enable($("#ledable-submit"));
				$(".led-radio-setting").click(function() {
					$(".led-radio-setting-selected").removeClass("led-radio-setting-selected");
					$(this).addClass("led-radio-setting-selected");
				});
				$(".setting-led-metro").click(function() {
					main.setting.led.getLed();
				});
				$("#ledable-submit").click(function() {
					main.setting.led.saveLed();
				});
			},
			getLed: function() {
				var args = {
					url: '/ledgetting.fcgi',
					success: function(json) {
						if (json.enable == 1) {
							$("#ledable-on").click();
						} else {
							$("#ledable-off").click();
						}
						plug.radio.initial($(".setting-contain-led"));
					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
			},
			saveLed: function() {
				plug.button.disable($("#ledable-submit"));
				var args = {
					url: '/ledsetting.fcgi',
					data: {
						"enable": $(".led-radio-setting-selected").val()
					},
					success: function(json) {
						plug.button.enable($("#ledable-submit"));
						if (json.errorCode == 0) {
							plug.window.alert({
								"info": lang.ajax.led.setSuccess
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.led.setFailed
							});
						}
					},
					error: function(xhr) {
						plug.button.enable($("#ledable-submit"));
						plug.window.alert({
							"info": lang.valid.led.setFailed
						});
					}
				}
				common.setAjax.init(args);
			}
		},
		sysDataTime: {
			init: function() {
				main.setting.sysDataTime.bind();
				//main.setting.sysDataTime.dmtSet.gettingAjax();
			},
			bind: function() {
				$("#setting-time-metro").click(function() {
					main.setting.sysDataTime.dmtSet.gettingAjax();
					main.setting.sysDataTime.getLocalTime();

				});
				$("#daysave-enable").click(function() {
					if ($("#daysave-enable").attr("checked")) {
						$("#dmt-Recurring-setting-contain").show();
					} else {
						$("#dmt-Recurring-setting-contain").hide();
					}
				});
				$("#synntp-enable").click(function() {
					if ($("#synntp-enable").attr("checked")) {
						//$("#synntp-enable").attr("disabled", false);
						//$("#set-time-manually").attr("disabled", true);
						//$("#set-time-manually").siblings(".checkbox").removeClass("select-slide");
						//$("#set-time-manually").siblings(".checkbox").addClass("checkbox-disabled");
						$("#set-time-manually").siblings(".checkbox").removeClass("checkbox-checked");
						$("#set-time-manually").attr("checked", false);
						$("#set-time-manually-contain").hide();
						$('#synntp-setting-contain').show();
						$("#synntp-ntpserver").click();
					} else {
						//$("#synntp-enable").attr("disabled", false);
						//$("#set-time-manually").siblings(".checkbox").removeClass("checkbox-disabled");
						//$("#set-time-manually").attr("disabled", false);
						$("#set-time-manually").attr("checked", false);
						$("#set-time-manually-contain").hide();
						$('#synntp-setting-contain').hide();
					}
				});
				$("#synntp-ntpserver").click(function() {
					$(".setting-contain-timezone-ntpservice").show();
					$(".sync-ntp-sword").click();
				});
				$("#synntp-dhcp").click(function() {
					$(".setting-contain-timezone-ntpservice").hide();
				});
				$("#set-time-manually").click(function() {
					if ($("#set-time-manually").attr("checked")) {
						$("#set-time-manually").attr("checked", true);
						$("#synntp-enable").attr("checked", false);
						$("#synntp-enable").siblings(".checkbox").removeClass("checkbox-checked");
						//	$("#synntp-enable").attr("disabled", false);
						//	$("#set-time-manually").siblings(".checkbox").removeClass("select-disabled");
						//	$("#set-time-manually").attr("disabled", false);
						$("#set-time-manually-contain").show();
						$('#synntp-setting-contain').hide();
						$("#synntp-enable").attr("checked", false);
					} else {

						$("#set-time-manually-contain").hide();
						$('#synntp-setting-contain').hide();
					}
				});
				$("#dmt-disable").click(function() {
					$("#dmt-Recurring-setting").show();
				});
				$("#dmt-enable").click(function() {
					$("#dmt-Recurring-setting").hide();
				});
				$(".dmtradio-select").click(function() {
					$(".dmtradio-selected").removeClass("dmtradio-selected");
					$(this).addClass("dmtradio-selected");
				})
				$(".synntp-ntpserver-radio").click(function() {
					$(".synntp-ntpserver-radio-selected").removeClass("synntp-ntpserver-radio-selected");
					$(this).addClass("synntp-ntpserver-radio-selected");
				});
				$("#synpctime").click(function() {
					main.setting.sysDataTime.getLocalTime()
				});
				$("#timezoneSubmit").click(function() {
					main.setting.sysDataTime.getNtpTime();
					main.dateTimeManually = 0;
					$(".setting-current-time").show();
					$("#sync-manual-time-year").hide();
					$("#sync-manual-time-hour").hide();
				});
				// $("#system-setTimeZone").bind({
				// 	click: function() { //当select条被点击时，记录下当前时区
				// 		var gmt = $("#system-setTimeZone option:selected").text().split("(GMT")[1].split(") ")[0];
				// 		main.oldTimeZone = (Number(gmt.split(":")[0]) + Number((gmt.split(":")[1]) / 60)) || 0;
				// 	},
				// 	change: function() {
				// 		var gmt = $("#system-setTimeZone option:selected").text().split("(GMT")[1].split(") ")[0]; //获取当前选中时间的时区eg:+/-01:00
				// 		main.newTimeZone = (Number(gmt.split(":")[0]) + Number((gmt.split(":")[1]) / 60)) || 0; //将当前时区转化为小时，eg:3:30转化为3.5
				// 		var date = $(".setting-current-date").text().split("-"),
				// 			year = date[0],
				// 			month = date[1],
				// 			day = date[2];
				// 		var d = new Date();
				// 		d.setYear(year);
				// 		d.setMonth(month - 1);
				// 		d.setDate(day);
				// 		d.setHours(main.dateseter_hour);
				// 		d.setMinutes(main.dateseter_min - (main.oldTimeZone - main.newTimeZone) * 60); //算取新老时区的分钟差
				// 		d.setSeconds(main.dateseter_sec);
				// 		year = d.getFullYear();
				// 		month = d.getMonth() + 1;
				// 		day = d.getDate();
				// 		$(".setting-current-date").text(year + "-" + main.setting.sysDataTime.swapsb(month) + "-" + main.setting.sysDataTime.swapsb(day));
				// 		main.dateseter_hour = d.getHours();
				// 		main.dateseter_min = d.getMinutes();
				// 		main.dateseter_sec = d.getSeconds();
				// 		clearInterval(main.dateseter_interval);
				// 		main.dateseter_interval = setInterval("main.setting.sysDataTime.videotimer()", 1000);
				// 	}
				// });
				$("#synctime").click(function() {
					//	main.setting.sysDataTime.getServerTime();
					main.setting.sysDataTime.setsyncTime();
				});
				$("#updatetime").click(function() {
					main.setting.sysDataTime.setServerTime();
				});
				$("#synchronizes").click(function() {
					main.setting.sysDataTime.setLocalTime();
					main.dateTimeManually = 0;
					$(".setting-current-time").show();
					$("#sync-manual-time-year").hide();
					$("#sync-manual-time-hour").hide();
				});
				$("#dmtapply").click(function() {
					//main.setting.sysDataTime.dmtSet.valid() == true ? main.setting.sysDataTime.dmtSet.settingAjax() : null;
					main.setting.sysDataTime.dmtSet.settingDateTime();
				});
				$("#sync-auto-time-nptser1").change(function() {
					$("#sync-manual-time-nptser1").val($(this).children("option:selected").html());
				});
				$(".sync-ntp-sword").click(function() {
					$("#sync-manual-time-nptser1").val($("#sync-auto-time-nptser1").children("option:selected").html());
				});
				$("#datemode-start-month").change(function() {
					main.setting.sysDataTime.dayByDay("#datemode-start-day", "#datemode-start-month", "#datemode-start-year");
				});
				$("#datemode-start-day").click(function() {
					main.setting.sysDataTime.dayByDay("#datemode-start-day", "#datemode-start-month", "#datemode-start-year");
				});
				$("#datemode-start-year").change(function() {
					main.setting.sysDataTime.dayByDay("#datemode-start-day", "#datemode-start-month", "#datemode-start-year");
				});
			},
			dmtSet: {
				timer : null,
				init: function(mode, args) {
					switch (mode) {
						case "predefined":
							var country = $(".dmt-pre-country:checked").attr("id").split("dmt-predef-")[1];
							return main.setting.sysDataTime.dmtSet.getTimeFromPredefineMode(country, args.year, args.flag);
							break
						case "recurring":
							return main.setting.sysDataTime.dmtSet.getTimeFromRecurringMode(args.year, args.month, args.week, args.day, args.hour, args.minute);
							break
						case "date":
							return main.setting.sysDataTime.dmtSet.getTimeFromDateMode(args.year, args.month, args.date, args.hour, args.minute);
							break
						default:
							return "unknownNumber";
					}
				},
				valid: function() {
					var a, b;
					if ($("#sync-manual-time-Recurring:hidden").length == 0) {
						a = common.validInfo(valid.timeOffset($("#sync-manual-time-Recurring").val()), 720, 0);
					} else {
						a = true;
					}
					if ($("#sync-manual-time-datemode:hidden").length == 0) {
						b = common.validInfo(valid.timeOffset($("#sync-manual-time-datemode").val()), 720, 0);
					} else {
						b = true
					}
					return common.validInfo(valid.domainAndIp($("#sync-manual-time-nptser1").val())) && a && b;
					//	valid.domain($("#sync-manual-time-nptser1").val());
				},
				gettingAjax: function() {
					clearTimeout(main.setting.sysDataTime.dmtSet.timer);
					main.setting.sysDataTime.dmtSet.timer = setTimeout( function(){main.setting.sysDataTime.dmtSet.gettingAjax()},60*1000);
					
					var args = {
						url: '/gettimesetting.fcgi',
						success: function(json) {
							main.dateTimeManually = 0;
							$("#system-setTimeZone").val(json.timezone).change();
							main.setting.sysDataTime.resetServerTime(json.datetime);
							
							
							if (json.dlstState == 1) {
								$("#daysave-enable").attr("checked", true);
								$("#dmt-Recurring-setting-contain").show();
							} else {
								$("#daysave-enable").attr("checked", false);
								$("#dmt-Recurring-setting-contain").hide();
							}
							if (json.dlstIsAuto == 0) {
								$("#dmt-disable").click();
								$("#sync-manual-time-Recurring").val(json.dlstOffset).change();
								$("#recurring-start-week").val(json.dlstStartDay).change();
								$("#recurring-start-stands").val(json.dlstStartWeek).change();
								$("#recurring-start-month").val(json.dlstStartMonth).change();
								$("#recurring-start-hour").val(json.dlstStartHour).change();
								$("#recurring-start-min").val(json.dlstStartMinute).change();
								$("#recurring-end-week").val(json.dlstEndDay).change();
								$("#recurring-end-stands").val(json.dlstEndWeek).change();
								$("#recurring-end-month").val(json.dlstEndMonth).change();
								$("#recurring-end-hour").val(json.dlstEndHour).change();
								$("#recurring-end-min").val(json.dlstEndMinute).change();
							} else {
								$("#dmt-enable").click();
							}
							//$("#synntp-enable").attr("disabled", false);
							plug.button.enable($("#synntp-enable"));
							plug.button.enable($("#set-time-manually"));
							//$("#set-time-manually").attr("disabled", false);
							if (json.sync2ntp == 1) {
								$("#synntp-enable").attr("checked", true);
								//$("#synntp-enable").attr("disabled", false);
								//$("#set-time-manually").attr("disabled", true);
								//$("#set-time-manually").siblings(".checkbox").removeClass("select-slide");
								//$("#set-time-manually").siblings(".checkbox").addClass("select-disabled");
								$("#set-time-manually").attr("checked", false);
								$("#set-time-manually-contain").hide();
								$('#synntp-setting-contain').show();
								if (json.sync2dhcp == 0) {
									$("#synntp-ntpserver").click();
								} else {
									$("#synntp-dhcp").click();
								}
							} else if (json.sync2pc == 1) {
								$("#set-time-manually").attr("checked", true);

								//$("#set-time-manually").siblings(".checkbox").removeClass("select-disabled");
								$("#set-time-manually-contain").show();
								$('#synntp-setting-contain').hide();
								$("#synntp-enable").attr("checked", false);
							} else {
								$("#set-time-manually").attr("checked", false);
								$("#synntp-enable").attr("checked", false);
								$("#set-time-manually-contain").hide();
								$('#synntp-setting-contain').hide();
							}
							//$("#datemode-start-year").val();
							json.ntpserver == null ? $("#sync-manual-time-nptser1").val($("#sync-auto-time-nptser1").children("option:selected").html()) : $("#sync-manual-time-nptser1").val(json.ntpserver);
							plug.checkbox.initial($(".setting-contain-time"));
							plug.radio.initial($(".setting-contain-time"));
						},
						error: function(xhr) {

						}
					}
					common.ajax.init(args);
				},
				settingDateTime: function() {
					plug.button.disable($("#dmtapply"));
					var args = {
						url: '/settimesetting.fcgi',
						data: {
							"datetime": $("#datemode-start-year").val() + "-" + $("#datemode-start-month").val() + "-" + $("#datemode-start-day").val() + " " + $("#datemode-start-hour").val() + ":" + $("#datemode-start-min").val() + ":" + $("#datemode-start-sec").val(),
							"timezone": $("#system-setTimeZone").val(),
							"sync2ntp": 0,
							"sync2dhcp": $(".synntp-ntpserver-radio-selected").val(),
							"sync2pc": 0,
							"ntpserver": $("#sync-manual-time-nptser1").val(),
							"dlstState": 0,
							"dlstIsAuto": $(".dmtradio-selected").val(),
							"dlstOffset": $("#sync-manual-time-Recurring").val(),
							"dlstStartMonth": $("#recurring-start-month").val(),
							"dlstStartWeek": $("#recurring-start-stands").val(),
							"dlstStartDay": $("#recurring-start-week").val(),
							"dlstStartHour": $("#recurring-start-hour").val(),
							"dlstStartMinute": $("#recurring-start-min").val(),
							"dlstEndMonth": $("#recurring-end-month").val(),
							"dlstEndWeek": $("#recurring-end-stands").val(),
							"dlstEndDay": $("#recurring-end-week").val(),
							"dlstEndHour": $("#recurring-end-hour").val(),
							"dlstEndMinute": $("#recurring-end-min").val()
						},
						success: function(json) {
							plug.button.enable($("#dmtapply"));
							if (json.errorCode == 0) {
								plug.window.alert({
									"info": lang.ajax.system.dateSetSuccess
								});
								if ($("#set-time-manually").attr("checked")) {
									var time = {
										"datetime": $("#datemode-start-year").val() + "-" + $("#datemode-start-month").val() + "-" + $("#datemode-start-day").val() + " " + $("#datemode-start-hour").val() + ":" + $("#datemode-start-min").val() + ":" + $("#datemode-start-sec").val()
									}
									main.setting.sysDataTime.resetServerTime(time.datetime);
								}
							} else if (json.errorCode == 1041) {
								plug.window.alert({
									"info": lang.ajax.system.yearerror
								});
							} else if (json.errorCode == 1045) {
								plug.window.alert({
									"info": lang.ajax.system.yearoverflow
								});
							} else if (json.errorCode == 1046) {
								plug.window.alert({
									"info": lang.ajax.system.ntpoverflow
								});
							} else if (json.errorCode == 1042) {
								plug.window.alert({
									"info": lang.ajax.system.timeConflicttimezone
								});
							} else {
								plug.window.alert({
									"info": lang.ajax.system.dateSetError
								});
							}
							$(".setting-current-time").show();
							$("#sync-manual-time-year").hide();
							$("#sync-manual-time-hour").hide();
							main.dateTimeManually = 0;
						},
						error: function(xhr) {
							plug.button.enable($("#dmtapply"));
						}
					}
					if ($("#daysave-enable").attr("checked")) {
						args.data.dlstState = 1;
					}
					if ($("#synntp-enable").attr("checked")) {
						args.data.sync2ntp = 1;
					} else {
						args.data.sync2ntp = 0;
					}
					if ($("#set-time-manually").attr("checked")) {
						args.data.sync2pc = 1;
					} else {
						args.data.sync2pc = 0;
					}
					common.setAjax.init(args);
				},
				settingAjax: function() {
					var args = {
						url: '/settimesetting.fcgi',
						data: {
							"datetime": "",
							"timezone": $("#system-setTimeZone").val(),
							"ntpserver": $("#sync-manual-time-nptser1").val(),
							"dlstStatus": "",
							"dlstMode": "",
							"dlstCountry": "",
							"dlstOffset": "",
							"dlstStartTime": "",
							"dlstEndTime": "",
							"pcTimezoneOffset": new Date().getTimezoneOffset()
						},
						success: function(json) {
							if (json.errorCode == 0) {
								plug.window.alert({
									"info": lang.ajax.system.dateSetSuccess
								});
								var time = {
									"datetime": $("#sync-manual-time-year").val() + " " + $("#sync-manual-time-hour").val()
								}
								main.setting.sysDataTime.resetServerTime(time.datetime);

							} else if (json.errorCode == 1041) {
								plug.window.alert({
									"info": lang.ajax.system.yearerror
								});
							} else if (json.errorCode == 1045) {
								plug.window.alert({
									"info": lang.ajax.system.yearoverflow
								});
							} else if (json.errorCode == 1046) {
								plug.window.alert({
									"info": lang.ajax.system.ntpoverflow
								});
							} else if (json.errorCode == 1042) {
								plug.window.alert({
									"info": lang.ajax.system.timeConflicttimezone
								});
							} else {
								plug.window.alert({
									"info": lang.ajax.system.dateSetError
								});
							}
							$(".setting-current-time").show();
							$("#sync-manual-time-year").hide();
							$("#sync-manual-time-hour").hide();
							main.dateTimeManually = 0;
						},
						error: function(xhr) {

						}
					}
					// main.setting.sysDataTime.swapYear($("#sync-manual-time-year").val())
					main.dateTimeManually == 1 ? args.data.datetime = $("#sync-manual-time-year").val() + " " + $("#sync-manual-time-hour").val() : args.data.datetime = $(".setting-current-date").html() + " " + $(".setting-current-hour").html();

					if ($("#dmt-enable").attr("checked")) {
						args.data.dlstStatus = "enable";
						var startTime, endTime;
						var thisYear = new Date();
						if ($("#dmt-predefined-mode").attr("checked")) {
							args.data.dlstMode = 1;
							var startArgs = {
								year: thisYear.getFullYear(),
								flag: 1
							};
							var endArgs = {
								year: thisYear.getFullYear(),
								flag: 0
							};
							args.data.dlstStartTime = main.setting.sysDataTime.dmtSet.init("predefined", startArgs);
							args.data.dlstEndTime = main.setting.sysDataTime.dmtSet.init("predefined", endArgs);
							if (Date.parse(thisYear.toString()) / 1000 > args.data.dlstEndTime) {
								startArgs.year += 1;
								endArgs.year += 1;
								args.data.dlstStartTime = main.setting.sysDataTime.dmtSet.init("predefined", startArgs);
								args.data.dlstEndTime = main.setting.sysDataTime.dmtSet.init("predefined", endArgs);
							}
							args.data.dlstCountry = $(".dmt-predef-radio-selected").attr("id").split("dmt-predef-")[1];
						} else if ($("#dmt-recurring-mode").attr("checked")) {
							args.data.dlstMode = 2;
							args.data.dlstOffset = $("#sync-manual-time-Recurring").val();

							var startArgs = {
								year: thisYear.getFullYear(),
								month: $("#recurring-start-month").val(),
								week: $("#recurring-start-stands").val(),
								day: $("#recurring-start-week").val(),
								hour: $("#recurring-start-hour").val(),
								minute: $("#recurring-start-min").val()
							};
							var endArgs = {
								year: thisYear.getFullYear(),
								month: $("#recurring-end-month").val(),
								week: $("#recurring-end-stands").val(),
								day: $("#recurring-end-week").val(),
								hour: $("#recurring-end-hour").val(),
								minute: $("#recurring-end-min").val()
							};
							args.data.dlstStartTime = main.setting.sysDataTime.dmtSet.init("recurring", startArgs);
							args.data.dlstEndTime = main.setting.sysDataTime.dmtSet.init("recurring", endArgs);

							if (args.data.dlstStartTime > args.data.dlstEndTime) {
								endArgs.year += 1;
								args.data.dlstEndTime = main.setting.sysDataTime.dmtSet.init("recurring", endArgs);
							}
							if (Date.parse(thisYear.toString()) / 1000 > args.data.dlstEndTime) {
								startArgs.year += 1;
								endArgs.year += 1;
								args.data.dlstStartTime = main.setting.sysDataTime.dmtSet.init("recurring", startArgs);
								args.data.dlstEndTime = main.setting.sysDataTime.dmtSet.init("recurring", endArgs);
							}


						} else if ($("#dmt-date-mode").attr("checked")) {
							args.data.dlstMode = 3;
							args.data.dlstOffset = $("#sync-manual-time-datemode").val();

							var startArgs = {
								year: thisYear.getFullYear(),
								month: $("#datemode-start-month").val(),
								date: $("#datemode-start-day").val(),
								hour: $("#datemode-start-hour").val(),
								minute: $("#datemode-start-min").val()
							};
							var endArgs = {
								year: thisYear.getFullYear(),
								month: $("#datemode-end-month").val(),
								date: $("#datemode-end-day").val(),
								hour: $("#datemode-end-hour").val(),
								minute: $("#datemode-end-min").val()
							};

							args.data.dlstStartTime = main.setting.sysDataTime.dmtSet.init("date", startArgs);
							args.data.dlstEndTime = main.setting.sysDataTime.dmtSet.init("date", endArgs);

							if (args.data.dlstStartTime > args.data.dlstEndTime) {
								endArgs.year += 1;
								args.data.dlstEndTime = main.setting.sysDataTime.dmtSet.init("date", endArgs);
							}
							if (Date.parse(thisYear.toString()) / 1000 > args.data.dlstEndTime) {
								startArgs.year += 1;
								endArgs.year += 1;
								args.data.dlstStartTime = main.setting.sysDataTime.dmtSet.init("date", startArgs);
								args.data.dlstEndTime = main.setting.sysDataTime.dmtSet.init("date", endArgs);
							}
						}

					} else {
						args.data.dlstStatus = "disable";
					}
					common.setAjax.init(args);
				},
				isLeapYear: function(year) {
					if (year < 1900 && year > 9999) return -1;
					return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0) ? 1 : 0;
				},
				dateOfMonth: function(year, month, week, day) {
					var days = [
						[
						0,
						31,
						31 + 28,
						31 + 28 + 31,
						31 + 28 + 31 + 30,
						31 + 28 + 31 + 30 + 31,
						31 + 28 + 31 + 30 + 31 + 30,
						31 + 28 + 31 + 30 + 31 + 30 + 31,
						31 + 28 + 31 + 30 + 31 + 30 + 31 + 31,
						31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30,
						31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31,
						31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30],
						[
						0,
						31,
						31 + 29,
						31 + 29 + 31,
						31 + 29 + 31 + 30,
						31 + 29 + 31 + 30 + 31,
						31 + 29 + 31 + 30 + 31 + 30,
						31 + 29 + 31 + 30 + 31 + 30 + 31,
						31 + 29 + 31 + 30 + 31 + 30 + 31 + 31,
						31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 30,
						31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31,
						31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30]
					];
					var otm = new Date();
					if (week > 0) {
						otm.setYear(year);
						otm.setMonth(month - 1);
						otm.setDate(1);
						otm.setHours(0);
						otm.setMinutes(0);
						otm.setSeconds(0);
						var firstdayweek = otm.getDay();
						var dis = firstdayweek > day ? day + week * 7 - firstdayweek : day - firstdayweek + (week - 1) * 7;
						return 1 + dis;
					} else if (week < 0) {
						otm.setYear(year);
						otm.setMonth(month);
						otm.setDate(1);
						otm.setHours(0);
						otm.setMinutes(0);
						otm.setSeconds(0);

						var firstdayweek = otm.getDay() - 1 > 0 ? otm.getDay() - 1 : otm.getDay() + 7 - 1;

						var dis = firstdayweek < day ? firstdayweek + (-week) * 7 - day : firstdayweek - day + (-week - 1) * 7;

						return days[main.setting.sysDataTime.dmtSet.isLeapYear(year)][month] - days[main.setting.sysDataTime.dmtSet.isLeapYear(year)][month - 1] - dis;

					} else return -1;

				},
				getTimeFromRecurringMode: function(year, month, week, day, hour, minute) {

					var d = new Date();
					d.setYear(year);
					d.setMonth(month - 1);
					d.setDate(main.setting.sysDataTime.dmtSet.dateOfMonth(d.getFullYear(), month, week, day));
					d.setHours(hour);
					d.setMinutes(minute);
					d.setSeconds(0);
					return Date.parse(d.toString()) / 1000;
				},
				getTimeFromDateMode: function(year, month, date, hour, minute) {
					var d = new Date();
					d.setYear(year);
					d.setMonth(month - 1);
					d.setDate(date);
					d.setHours(hour);
					d.setMinutes(minute);
					d.setSeconds(0);

					return Date.parse(d.toString()) / 1000;
				},
				// getTimeFromPredefineMode: function(country, year, flag) {
				// 	var syear, smonth, sweek, sday, shour;
				// 	var eyear, emonth, eweek, eday, ehour;

				// 	switch (country) {
				// 		case "USA":
				// 			{
				// 				smonth = 3;
				// 				sweek = 2;
				// 				sday = 7;
				// 				emonth = 11;
				// 				eweek = 1;
				// 				eday = 7;
				// 				shour = ehour = 2;
				// 			}
				// 			break;
				// 		case "EUROPEAN":
				// 			{
				// 				smonth = 3;
				// 				sweek = -1;
				// 				sday = 7;
				// 				emonth = 10;
				// 				eweek = -1;
				// 				eday = 7;
				// 				shour = ehour = 2;
				// 			}
				// 			break;
				// 		case "AUSTRALIA":
				// 			{
				// 				smonth = 10;
				// 				sweek = 1;
				// 				sday = 7;
				// 				emonth = 4;
				// 				eweek = 1;
				// 				eday = 7;
				// 				shour = ehour = 0;
				// 			}
				// 			break;
				// 		case "NEWZEALAND":
				// 			{
				// 				smonth = 9;
				// 				sweek = -1;
				// 				sday = 7;
				// 				emonth = 4;
				// 				eweek = 1;
				// 				eday = 7;
				// 				shour = ehour = 0;
				// 			}
				// 			break;
				// 		default:
				// 			return -1;
				// 	}

				// 	var d = new Date();
				// 	syear = eyear = year;
				// 	if (smonth >= emonth) {
				// 		eyear = syear + 1;
				// 	}
				// 	if (flag > 0) {
				// 		d.setYear(syear);
				// 		d.setMonth(smonth - 1);
				// 		d.setDate(main.setting.sysDataTime.dmtSet.dateOfMonth(syear, smonth, sweek, sday));
				// 		d.setHours(shour);
				// 		d.setMinutes(0);
				// 		d.setSeconds(0);
				// 	} else {
				// 		d.setYear(eyear);
				// 		d.setMonth(emonth - 1);
				// 		d.setDate(main.setting.sysDataTime.dmtSet.dateOfMonth(eyear, emonth, eweek, eday));
				// 		d.setHours(ehour);
				// 		d.setMinutes(0);
				// 		d.setSeconds(0);
				// 	}
				// 	return Date.parse(d.toString()) / 1000;
				// },
				getDatefromTime: function(time, tz) {
					var dateObject = new Date();
					time = time + (dateObject.getTimezoneOffset() + tz) * 60;
					dateObject.setTime(time * 1000);
					var args = {
						year: dateObject.getFullYear(),
						month: dateObject.getMonth() + 1,
						week: dateObject.getDay(),
						day: dateObject.getDate(),
						hour: dateObject.getHours(),
						minutes: dateObject.getMinutes(),
						second: dateObject.getSeconds()
					}
					return args;
				}

			},
			getServerTime: function() {
				var args = {
					url: '/gettime.fcgi',
					success: function(json) {
						main.setting.sysDataTime.resetServerTime(json.datetime);
					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);

			},
			getNtpTime: function() {
				var args = {
					url: '/getntptime.fcgi',
					timeout: 5000,
					data: {
						"ntpserver": $("#sync-manual-time-nptser1").val()
					},
					success: function(json) {
						if (json.errorCode == 0) {
							main.setting.sysDataTime.resetServerTime(json.datetime);

						} else {
							plug.window.alert({
								"info": lang.ajax.system.synNtpFailed
							});
						}
					},
					error: function(xhr) {
						plug.window.alert({
							"info": lang.ajax.system.synServerBreak
						});
					}
				}
				common.ajax.init(args);
			},
			setLocalTime: function() {
				var args = {
					url: '/settime.fcgi',
					data: {
						"datetime": main.setting.sysDataTime.getLocalTime()
						//,"token": $("#token").attr("value")
					},
					success: function(json) {
						main.setting.sysDataTime.getServerTime();
					},
					error: function(xhr) {

					}
				}
				common.setAjax.init(args);
			},
			asyncManuallyTime: function() {

			},
			getLocalTime: function() {
				var d = new Date();
				$("#datemode-start-year").val(d.getFullYear()).change();
				$("#datemode-start-month").val(Number(d.getMonth() + 1)).change();
				$("#datemode-start-day").val(d.getDate()).change();
				$("#datemode-start-hour").val(d.getHours()).change();
				$("#datemode-start-min").val(d.getMinutes()).change();
				$("#datemode-start-sec").val(d.getSeconds()).change();
				// main.dateseter_sec = hour.split(":")[2],
				// main.dateseter_min = hour.split(":")[1],
				// main.dateseter_hour = hour.split(":")[0];
				//var swapYear = year.split("-")[0] + "-" + main.setting.sysDataTime.swapsb(year.split("-")[1]) + "-" + main.setting.sysDataTime.swapsb(year.split("-")[2]);

				//main.setting.sysDataTime.resetServerTime(a);
			},
			getGMTtime: function() {
				var gmtTime = (new Date()).toGMTString().split(",")[1].split(" ");
				return gmtTime[3] + "-" + main.setting.sysDataTime.swapmonth(gmtTime[2]) + "-" + gmtTime[1] + " " + gmtTime[4];
			},
			// monthDay: function(holderMonth, holderDay) {
			// 	$(holderMonth).change(function() {
			// 		var s = $(this).val();
			// 		if (s == "1" || s == "3" || s == "5" || s == "7" || s == "8" || s == "10" || s == "12") {
			// 			$(holderDay + " option:eq(29)").show();
			// 			$(holderDay + " option:eq(30)").show();
			// 		} else if (s == "2") {
			// 			$(holderDay + " option:eq(29)").hide();
			// 			$(holderDay + " option:eq(30)").hide();
			// 			if ($(holderDay).val() == 30 || $(holderDay).val() == 31) {
			// 				$(holderDay).val(28);
			// 			}
			// 		} else {
			// 			$(holderDay + " option:eq(29)").show();
			// 			$(holderDay + " option:eq(30)").hide();
			// 			if ($(holderDay).val() == 31) {
			// 				$(holderDay).val(30);
			// 			}
			// 		}
			// 	});
			// },
			dayByDay: function(holderDay, holderMonth, holderYear) {
				var day = $(holderDay).val(),
					month = $(holderMonth).val(),
					year = $(holderYear).val();
				if (day == 31) //判断当从大月切换到小月时日期选择为31号的情况（小月包含2月）
				{
					if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
						$(holderDay + " option:eq(28)").show();
						$(holderDay + " option:eq(29)").show();
						$(holderDay + " option:eq(30)").show();
					} else if (month == "2") {
						$(holderDay + " option:eq(29)").hide();
						$(holderDay + " option:eq(30)").hide();

						var type = main.setting.sysDataTime.dmtSet.isLeapYear(year);
						if (type == 0) {
							$(holderDay + " option:eq(28)").hide();
							$(holderDay).val(28);
						} else {
							$(holderDay).val(29);
						}
					} else {
						$(holderDay + " option:eq(28)").show();
						$(holderDay + " option:eq(29)").show();
						$(holderDay + " option:eq(30)").hide();
						$(holderDay).val(30);
					}
				} else if (day == 30) //判断从小月切换到大月时
				{
					if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
						$(holderDay + " option:eq(28)").show();
						$(holderDay + " option:eq(29)").show();
						$(holderDay + " option:eq(30)").show();
					} else if (month == "2") {
						$(holderDay + " option:eq(28)").hide();
						$(holderDay + " option:eq(29)").hide();
						$(holderDay + " option:eq(30)").hide();

						var type = main.setting.sysDataTime.dmtSet.isLeapYear(year);
						if (type == 0) {
							$(holderDay + " option:eq(28)").hide();
							$(holderDay).val(28);
						} else {
							$(holderDay + " option:eq(28)").show();
							$(holderDay).val(29);
						}
					}

				} else if (day == 29) {
					if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
						$(holderDay + " option:eq(28)").show();
						$(holderDay + " option:eq(29)").show();
						$(holderDay + " option:eq(30)").show();
					} else if (month == "2") {
						$(holderDay + " option:eq(29)").hide();
						$(holderDay + " option:eq(30)").hide();
						var type = main.setting.sysDataTime.dmtSet.isLeapYear(year);
						if (type == 0) {
							$(holderDay + " option:eq(28)").hide();
							$(holderDay).val(28);
						} else {
							$(holderDay).val(29);
						}
					} else {
						$(holderDay + " option:eq(28)").show();
						$(holderDay + " option:eq(29)").show();
					}
				} else {
					if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
						$(holderDay + " option:eq(28)").show();
						$(holderDay + " option:eq(29)").show();
						$(holderDay + " option:eq(30)").show();
					} else if (month == "2") {
						$(holderDay + " option:eq(28)").hide();
						$(holderDay + " option:eq(29)").hide();
						$(holderDay + " option:eq(30)").hide();
						var type = main.setting.sysDataTime.dmtSet.isLeapYear(year);
						if (type == 0) {
							$(holderDay + " option:eq(28)").hide();
						} else {
							$(holderDay + " option:eq(28)").show();
						}
					} else {
						$(holderDay + " option:eq(28)").show();
						$(holderDay + " option:eq(29)").show();
						$(holderDay + " option:eq(30)").hide();
					}
				}
				//	$("#datemode-start-day").siblings(".plugin-select").remove();
				plug.select.initial($("#datemode-start-day-select"));
			},
			swapmonth: function(n) {
				switch (n) {
					case "Jan":
						return "01";
						break
					case "Feb":
						return "02";
						break
					case "Mar":
						return "03";
						break
					case "Apr":
						return "04";
						break
					case "May":
						return "05";
						break
					case "Jun":
						return "06";
						break
					case "Jul":
						return "07";
						break
					case "Aug":
						return "08";
						break
					case "Sep":
						return "09";
						break
					case "Oct":
						return "10";
						break
					case "Nov":
						return "11";
						break
					case "Dec":
						return "12";
						break
					default:
						return "unknownNumber";
				}

			},
			swapWeek: function(n) {
				switch (n) {
					case "Mon":
						return 1;
						break
					case "Tue":
						return 2;
						break
					case "Wed":
						return 3;
						break
					case "Thu":
						return 4;
						break
					case "Fri":
						return 5;
						break
					case "Sat":
						return 6;
						break
					case "Sun":
						return 7;
						break
					default:
						return "unknownNumber";
				}

			},
			swapsb: function(n) {
				switch (n) {
					case "0":
						return "00";
						break
					case "1":
						return "01";
						break
					case "2":
						return "02";
						break
					case "3":
						return "03";
						break
					case "4":
						return "04";
						break
					case "5":
						return "05";
						break
					case "6":
						return "06";
						break
					case "7":
						return "07";
						break
					case "8":
						return "08";
						break
					case "9":
						return "09";
						break
					default:
						return n;
				}
			},
			swapYear: function(year) {
				var swapYear = year.split("-")[0] + "-" + main.setting.sysDataTime.swapsb(year.split("-")[1]) + "-" + main.setting.sysDataTime.swapsb(year.split("-")[2]);
				$("#sync-manual-time-year").val(swapYear);
				$(".setting-current-date").html(swapYear);
				return swapYear;
			},
			resetServerTime: function(json) {
				var hour = json.split(" ")[1],
					year = json.split(" ")[0];
				main.setting.sysDataTime.swapYear(year);
				$("#sync-manual-time-hour").val(hour);
				main.dateseter_sec = hour.split(":")[2],
				main.dateseter_min = hour.split(":")[1],
				main.dateseter_hour = hour.split(":")[0];
				$("#datemode-start-year").val(Number(year.split("-")[0])).change();
				$("#datemode-start-month").val(Number(year.split("-")[1])).change();
				$("#datemode-start-day").val(Number(year.split("-")[2])).change();
				$("#datemode-start-hour").val(main.dateseter_hour).change();
				$("#datemode-start-min").val(main.dateseter_min).change();
				$("#datemode-start-sec").val(main.dateseter_sec).change();
				clearInterval(main.dateseter_interval);
				main.dateseter_interval = setInterval("main.setting.sysDataTime.videotimer()", 1000);
			},
			videotimer: function() {
				//var str;			
				if (main.dateseter_sec == 59) {
					main.dateseter_sec = 0;

					if (main.dateseter_min == 59) {
						main.dateseter_min = 0;
						main.dateseter_hour++;
						if (main.dateseter_hour == 24) {
							main.dateseter_hour = 0;
							main.setting.sysDataTime.dmtSet.gettingAjax(); //一天交接的地方直接从后台拿数据刷新。
						}
					} else {
						main.dateseter_min++;
					}
				} else {
					main.dateseter_sec++;
				}
				str = main.setting.sysDataTime.swapsb(main.dateseter_hour.toString()) + ":" + main.setting.sysDataTime.swapsb(main.dateseter_min.toString()) + ":" + main.setting.sysDataTime.swapsb(main.dateseter_sec.toString());
				$(".setting-current-hour").html(str);
			}
		},
		sysManagement: {
			init: function() {
				main.setting.sysManagement.bind();
			},
			bind: function() {
				$("#sysmanage-restore-path").val("");
				$("#sysmanage-restore-path-input").val("");
				$("#sysmanage-upgrade-path-input").val("");
				$("#sysmanage-upgrade-path").val("");
				$("#sysmanage-reboot").click(function() {
					plug.window.confirm({
						"info": lang.ajax.system.rebootConfirm,
						"btnConfirm": lang.plug.Reboot,
						"confirm": function() {
							main.setting.sysManagement.reboot();
						}
					});
				});
				$("#sysmanage-restore-path-button").click(function() {
					$("#sysmanage-restore-path").click();
				});
				$("#sysmanage-software-detect").click(function() {
					window.location.href = $(this).attr("href");
				});
				$("#sysmanage-restore-path").change(function() {
					$("#sysmanage-restore-path-input").val($(this).val());
				});
				$("#sysmanage-upgrade-path-button").click(function() {
					$("#sysmanage-upgrade-path").click();
				});
				$("#sysmanage-upgrade-path").change(function() {
					$("#sysmanage-upgrade-path-input").val($(this).val());
				});
				$("#sysmanage-upgrade-path-input").bind({
					keydown: function(event) {
						if (event.keyCode == "8") {
							$(this).val("");
							$("#sysmanage-upgrade-path").val("");
						} else {
							return false;
						}
					}
				});
				$("#sysmanage-restore-path-input").bind({
					keydown: function(event) {
						if (event.keyCode == "8") {
							$(this).val("");
							$("#sysmanage-restore-path").val("");
						} else {
							return false;
						}
					}
				});
				$("#sysmanage-factory-reset").click(function() {
					plug.window.confirm({
						"info": lang.ajax.system.restoreConfirm,
						"btnConfirm": lang.plug.Reset,
						"confirm": function() {
							main.setting.sysManagement.factoryDefault();
						}
					});
				});
				$("#sysmanage-backup").click(function() {
					main.setting.sysManagement.Backup();
				});
				$("#sysmanage-restore-path").change(function() {
					//main.ajaxuploader_fileinfo = this.files[0];
					$("#sysmanage-restore-path-input").val($(this).val());
				});
				$("#sysmanage-factory-restore").click(function() {
					if ($("#sysmanage-restore-path").val() == "") {
						plug.window.alert({
							"info": lang.ajax.system.factoryRestore
						});
						return false;
					}
					if (false != main.setting.sysManagement.checkRestoreFile(document.getElementById("sysmanage-restore-path"), "cfg", 20 * 1024, 1024)) {
						main.setting.sysManagement.progressBar(lang.system.management.restoretitle, 60000, lang.system.management.rebootcaution);
						main.setting.sysManagement.restore();
					}
				});
				$("#sysmanage-upgrade").click(function() {
					if ($("#sysmanage-upgrade-path").val() == "") {
						plug.window.alert({
							"info": lang.ajax.system.factoryRestore
						});
						return false;
					}
					if (false != main.setting.sysManagement.checkUpgradeFile(document.getElementById("sysmanage-upgrade-path"), "bin", 16 * 1024 * 1024, 2 * 1024 * 1024)) {
						main.setting.sysManagement.progressBar(lang.system.management.upgradetitle, 205000, lang.system.management.upgrade);
						main.setting.sysManagement.Upgrade();
					}
				});
				$("#setting-sysmanage-metro").click(function() {
					//main.setting.sysManagement.detectUpgrade();
				});
				if (common.isIe() == "Microsoft Internet Explorer") { //ajaxUpload在IE下兼容，改为显示file控件透明度置为0
					if ($.browser.version == "7.0") {
						$("#sysmanage-restore-path-button").hide();
						$("#sysmanage-upgrade-path-button").hide();
						$(".setting-contain-file-update").css({
							"visibility": "visible"
						})
					} else {
						$(".setting-contain-file-update").css({
							"opacity": 0,
							"visibility": "visible"
						})
					}
				}
			},
			checkRestoreFile: function(obj, suffix, maxSize, minSize) {
				var size, name;
				if (common.browserName == "Microsoft Internet Explorer") {
					name = obj.value;
					size = minSize; //IE暂时不做大小判断置为1.
				} else {
					size = obj.files[0].size;
					name = obj.files[0].name;
					if (!size) {
						size = obj.files[0].fileSize;
						name = obj.files[0].fileName;
						if (!size) {
							size = obj.value;
							name = minSize
						}
					}
				}
				if (name.match(eval("/\." + suffix + "$/i")) == null) {
					plug.window.alert({
						"info": lang.system.management.restorename
					})
					return false;
				} else {
					if (size > maxSize) {
						plug.window.alert({
							"info": lang.system.management.restoremaxsize
						})
						return false;
					} else if (size < minSize) {
						plug.window.alert({
							"info": lang.system.management.restoreminsize
						})
						return false;
					}
				}
			},
			checkUpgradeFile: function(obj, suffix, maxSize, minSize) {
				var size, name;
				if (common.browserName == "Microsoft Internet Explorer") {
					name = obj.value;
					size = minSize; //IE暂时不做大小判断置为1.
				} else {
					size = obj.files[0].size;
					name = obj.files[0].name;
					if (!size) {
						size = obj.files[0].fileSize;
						name = obj.files[0].fileName;
						if (!size) {
							size = obj.value;
							name = minSize
						}
					}
				}
				if (name.match(eval("/\." + suffix + "$/i")) == null) {
					plug.window.alert({
						"info": lang.system.management.upgradename
					})
					return false;
				} else {
					if (size > maxSize) {
						plug.window.alert({
							"info": lang.system.management.upgrademaxsize
						})
						return false;
					} else if (size < minSize) {
						plug.window.alert({
							"info": lang.system.management.upgrademinsize
						})
						return false;
					}
				}
			},
			shadeLayer: function() {
				var a = "";
				a += "<div class='shade-layer'>",
				a += "<div class='shade-layer-img-holder'>",
				a += "<span class='shade-layer-img'>",
				a += "</span>",
				a += "</div>",
				a += "</div>";
				$("body").append(a);
			},
			removeShadeLayer: function() {
				$(".shade-layer").remove();
			},
			progressBar: function(title, delaytime, caution) {
				$("#setting-conatain-sysreboot").hide();
				$(".sevenprogressbar").show();
				main.setting.sysManagement.shadeLayer();
				$(".sevenprogressbar-text").text(caution);
				$("#setting-contain-system-management").text(title);

				$(".sevenprogressbar-img").css({
					"width": 0
				});
				main.progressBarInterval = setInterval(function() {
					var width = parseInt($(".sevenprogressbar-img").width() * 100 / $(".sevenprogressbar-cell").width());
					$(".sevenprogressbar-percent").text(width + "%");
					if (width == 100) {
						main.progressBarInterval = clearInterval(main.progressBarInterval);
						window.location.reload();
					}
				}, 1000);
				$(".sevenprogressbar-img").animate({
					width: '100%'
				}, delaytime);
			},
			exitProgressBar: function() {
				main.progressBarInterval = clearInterval(main.progressBarInterval);
				$(".sevenprogressbar-img").stop();
				$(".sevenprogressbar-img").width(0);
				main.setting.sysManagement.removeShadeLayer();
				$(".sevenprogressbar").hide();
				$(".sevenprogressbar-percent").text();
				$("#setting-conatain-sysreboot").show();
				$("#setting-contain-system-management").text(lang.system.management.management);
			},
			reboot: function() {
				main.setting.sysManagement.progressBar(lang.system.management.reboottitle, 60000, lang.system.management.rebootcaution);
				var args = {
					url: '/reboot.fcgi',
					success: function(json) {
						if (json.errorCode == 0) {

						} else {
							plug.window.alert({
								"info": lang.ajax.system.rebootFailed
							});
							main.setting.sysManagement.exitProgressBar();
						}
					},
					error: function(xhr) {

					}
				}
				common.setAjax.init(args);
			},
			factoryDefault: function() {
				main.setting.sysManagement.progressBar(lang.system.management.factitle, 60000, lang.system.management.factorydefault);
				var args = {
					url: '/reset.fcgi',
					success: function(json) {
						if (json.errorCode == 0) {

						} else {
							plug.window.alert({
								"info": lang.ajax.system.factorydefaultFailed
							});
							main.setting.sysManagement.exitProgressBar();
						}
					},
					error: function(xhr) {

					}
				}
				common.setAjax.init(args);
			},
			Backup: function() {
				var args = {
					url: '/check_1.fcgi',
					timeout: 2000,
					success: function(json) {
						if (json.errorCode == 0) {
							window.location.href = "backup.fcgi";
						} else {
							plug.window.alert({
								"info": lang.ajax.system.backupFailed
							});
						}
					},
					error: function(xhr) {
						plug.window.alert({
							"info": lang.ajax.system.backupFailed
						});
					}
				}
				common.setAjax.init(args);
			},
			detectUpgrade: function() {
				var args = {
					url: "https://"+ common.URL +"/init2.php",
					dataType: "jsonp",
					timeout: 5000,
					data: {
						"REQUEST": 'COMMONUPDATE'/*'IPCAMERAUPDATE'*/,
						"DATA": {
							"OS": "firmware",
							"Version": $("#status-fwVersion").text().substring(0,6),
							"Model": common.productType
						}
					},
					success: function(json, response) {
						if (response.errorCode == 10000) {
							// plug.window.alert({
							// 	"info": lang.ajax.system.newversion
							// });
						} else if (response.errorCode == 0) {
							plug.window.confirm({
								"info": lang.ajax.system.oldversion,
								"btnConfirm": lang.system.management.download,
								"confirm": function() {
									window.location.href = response.msg;
								}
							});
							$("#sysmanage-software-detect").attr("href", response.msg).show();
							$("#sysmanage-software-detect-tips").hide();
						} else {
							plug.window.alert({
								"info": lang.ajax.system.dectectFailed
							});
						}
					},
					error: function(xhr) {
						plug.window.alert({
							"info": lang.ajax.system.detectdisconnect
						});
					}
				}
				common.ajax.init(args);
			},
			restore: function() {
				var args = {
					url: '/check_1.fcgi',
					success: function(json) {
						if (json.errorCode == 0) {
							// $("#loading")
							// 	.ajaxStart(function() {
							// 	$(this).show();
							// })
							// 	.ajaxComplete(function() {
							// 	$(this).hide();
							// });
							$.ajaxFileUpload({
								url: 'restore.fcgi', //服务器端程序
								secureuri: false,
								fileElementId: 'sysmanage-restore-path', //input框的ID
								dataType: 'text', //返回数据类型
								beforeSend: function() { //上传前需要处理的工作，如显示Loading...
								},
								success: function(data, status) { //上传成功
									var json = jQuery.parseJSON(data)
									if (json.errorCode == 0) {} else if (json.errorCode == 1052) {
										$("#sysmanage-restore-path").change(function() {
											$("#sysmanage-restore-path-input").val($(this).val());
										});
										$("#sysmanage-restore-path-input").val("");
										$("#sysmanage-restore-path").val("");
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.system.management.restorename
										});
									} else {
										$("#sysmanage-restore-path").change(function() {
											$("#sysmanage-restore-path-input").val($(this).val());
										});
										$("#sysmanage-restore-path-input").val("");
										$("#sysmanage-restore-path").val("");
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.ajax.system.uploadFailed
										});
									}
								},
								error: function(data, status, e) {
									var json = jQuery.parseJSON(data.responseText);
									if (json.errorCode == 1052) {
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.system.management.restorename
										});
									} else if (json.errorCode == 1053) {
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.system.management.restoreminsize
										});
									} else if (json.errorCode == 1054) {
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.system.management.restoremaxsize
										});
									} else {
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.ajax.system.uploadFailed
										});
									}
									$("#sysmanage-restore-path").change(function() {
										$("#sysmanage-restore-path-input").val($(this).val());
									});
									$("#sysmanage-restore-path-input").val("");
									$("#sysmanage-restore-path").val("");
								}
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.system.upgradeFailed
							});
						}
					},
					error: function(xhr) {}
				}
				common.setAjax.init(args);
			},
			Upgrade: function() {
				var args = {
					url: '/check_1.fcgi',
					success: function(json) {
						if (json.errorCode == 0) {
							$("#loading")
								.ajaxStart(function() {
								$(this).show();
							})
								.ajaxComplete(function() {
								$(this).hide();
							});
							
							
							$.ajaxFileUpload({
								url: 'upgrade.fcgi', //服务器端程序
								secureuri: false,
								//data : {size: 2000, id : 1},
								fileElementId: 'sysmanage-upgrade-path', //input框的ID
								dataType: 'text', //返回数据类型
								beforeSend: function() { //上传前需要处理的工作，如显示Loading...

								},
								success: function(data, status) { //上传成功
									var json = jQuery.parseJSON(data)
									// if (status == "success") {
									if (json.errorCode == 0) {
										//从data中获取数据，进行处理
									} else if (json.errorCode == 1052) {
										$("#sysmanage-upgrade-path-input").val("");
										$("#sysmanage-upgrade-path").val("");
										$("#sysmanage-upgrade-path").change(function() {
											$("#sysmanage-upgrade-path-input").val($(this).val());
										});
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.system.management.upgradename
										});
									} else {
										$("#sysmanage-upgrade-path-input").val("");
										$("#sysmanage-upgrade-path").val("");
										$("#sysmanage-upgrade-path").change(function() {
											$("#sysmanage-upgrade-path-input").val($(this).val());
										});
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.ajax.system.upgradeFailed
										});
									}
								},
								error: function(data, status, e) {
									var json = jQuery.parseJSON(data.responseText) || {
										"errorCode": -1
									};
									if (json.errorCode == 0) {} else if (json.errorCode == 1052) {
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.system.management.upgradename
										});
									} else if (json.errorCode == 1053) {
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.system.management.upgrademinsize
										});
									} else if (json.errorCode == 1054) {
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.system.management.upgrademaxsize
										});
									} else {
										main.setting.sysManagement.exitProgressBar();
										plug.window.alert({
											"info": lang.ajax.system.upgradeFailed
										});
									}
									$("#sysmanage-upgrade-path-input").val("");
									$("#sysmanage-upgrade-path").val("");
									$("#sysmanage-upgrade-path").change(function() {
										$("#sysmanage-upgrade-path-input").val($(this).val());
									});
								}
							});
						} else {
							plug.window.alert({
								"info": lang.ajax.system.upgradeFailed
							});
						}
					},
					error: function(xhr) {}
				}
				common.setAjax.init(args);

			}


		}
	}
}