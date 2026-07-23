	$(function() {
		login.launch();

	});
	var login = {
		init: function() {

		},
		launch: function() {
			login.lang();
			login.bind();
			login.region();
			login.rmbuser();
			login.checkbox();
		},
		lang: function(){
			
			$(".lang_title").each(function(i){
				$(this).attr("title",lang.title.login[i]);				
			});
			$(".lang_button").each(function(i){
				$(this).attr("value",lang.button.login[i]);				
			});
			$(".lang").each(function(i){
				$(this).text(lang.login[i]);					 
			});
		},
		bind: function() {
			$("#username").bind({
				focus: function() {	
					$(".login-contain-cell-username").addClass("login-contain-cell-username-focus");
					$(".login-usr-img").addClass("login-usr-img-focus");
					$(".login-contain-cell-username .login-contain-border-img").addClass("login-contain-border-img-focus");
				},
				blur: function() {
					$(".login-contain-cell-username").removeClass("login-contain-cell-username-focus");
					$(".login-usr-img").removeClass("login-usr-img-focus");
					$(".login-contain-cell-username .login-contain-border-img").removeClass("login-contain-border-img-focus");
				}
			});
			$("#username").focus().select();
			$("#login").click(function() {
				login.request();
			});
			$("#password").bind({
				focus: function() {
					$(".login-contain-cell-password").addClass("login-contain-cell-username-focus");
					$(".login-pwd-img").addClass("login-pwd-img-focus");
					$(".login-contain-cell-password .login-contain-border-img").addClass("login-contain-border-img-focus");
				},
				blur: function() {
					$(".login-contain-cell-password").removeClass("login-contain-cell-username-focus");
					$(".login-pwd-img").removeClass("login-pwd-img-focus");
					$(".login-contain-cell-password .login-contain-border-img").removeClass("login-contain-border-img-focus");
				},
				keydown: function(event) {
					if (event.keyCode == "13") {
						login.request();
					}
				}
			});
			$("#rememberpwd").click(function() {

			});

			// $("#container .logo").css({
			// 	"margin":"250px auto 0px"
			// });
		},
		checkbox: function() {
			plug.checkbox.initial($("body"));
			$("#rememberpwd").siblings(".checkbox").attr("tabindex", 3);
			$("#rememberpwd").siblings(".checkbox").bind({
				keydown: function(event) {
					if (event.keyCode == "32") {
						$("#rememberpwd").click();
					}
					else if (event.keyCode == "13") {
						login.request();
					}
				}
			});
		},
		region: function() {
			$("#regionselect").val($("#region").attr("value"));
		},
		rmbuser: function() {
			if ($.cookie("rmbUser") == "true") {
				$("#rememberpwd").attr("checked", true);
				$("#username").val($.cookie("userName"));
				$("#password").focus().select();
				//	$("#password").val($.cookie("passWord"));
			}
		},
		saveUserInfo: function() {
			if ($("#rememberpwd").attr("checked")) {
				var userName = $("#username").val();
				var passWord = $("#password").val();
				$.cookie("rmbUser", "true", {
					expires: 7
				}); // 存储一个带7天期限的 cookie
				$.cookie("userName", userName, {
					expires: 7
				}); // 存储一个带7天期限的 cookie
				// $.cookie("passWord", passWord, {
				// 	expires: 7
				// }); // 存储一个带7天期限的 cookie
			} else {
				$.cookie("rmbUser", "", {
					expires: -1
				});
				$.cookie("userName", '', {
					expires: -1
				});
				// $.cookie("passWord", '', {
				// 	expires: -1
				// });
			}
		},
		request: function() {
			login.saveUserInfo();
			var data = {
				"Username": $('#username').attr('value'),
				"Password": Base64.encode($('#password').attr('value')),
				"region": $("#regionselect").val(),
				"frequency": $("#regionselect option:selected").attr("frequency")
			};
			$.ajax({
				url: '/login.fcgi',
				type: 'post',
				dataType: 'text',
				data: data,
				contentType: 'application/x-www-form-urlencoded;charset=utf-8',
				success: function(response) {
					var json = jQuery.parseJSON(response);
					switch (json.errorCode) {
						case 1000:
							plug.window.alert({
								"info": lang.ajax.login.usrnull
							});
							break;
						case 1001:
							plug.window.alert({"info":lang.ajax.login.loginerror});
							break;
						case 1002:
							plug.window.alert({"info":lang.ajax.login.loginerror});
							break;
						case 1003:
							plug.window.alert({"info":lang.ajax.login.pwdnull});
							break;
						case 1012:
							plug.window.alert({"info":lang.ajax.login.usrnotexist});
							break;
						case 1011:
							plug.window.alert({"info":lang.ajax.login.pwderror});
							break;
						case 0:
							if (json.isAdmin) {
								if (location.search.indexOf("?streamPort=") == 0)
								{
									location.href = "/index.html"+location.search;
								}
								else{
									window.location.href = "/index.html";
								}
								
							} else {
								if (location.search.indexOf("?streamPort=") == 0)
								{
									location.href = "/guest.html"+location.search;
								}
								else{
									window.location.href = "/guest.html";
								}	
							}
							//	window.location.href = "/demo.html?"+json.token;						
							//	$.cookie("account", Base64.encode($('#username').val()));
							//	$.cookie("pwd", Base64.encode($('#password').val()));
							break;
						default:
							plug.window.alert({"info":lang.ajax.login.loginerror});
					}
				},
				error: function(xhr) {

				}

			});
		}
	}