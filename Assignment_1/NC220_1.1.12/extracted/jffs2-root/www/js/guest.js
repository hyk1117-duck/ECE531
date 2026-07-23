$(document).ready(function() {
	guest.ipget();
	guest.lang();
})
var guest = {

	ipget: function() {
				var args = {
					url: '/netconf_get.fcgi',
					success: function(json) {
						if (json.errorCode == 0) {
								common.upnpInfo.ip = (Base64.decode(json.Upnp.wlan_ip));
								common.upnpInfo.port = (Base64.decode(json.Upnp.stream_wlan_port));
						}
					},
					error: function(xhr) {

					}
				}
				common.ajax.init(args);
	},
	lang : function(){
		$(".lang_title").each(function(i){
			$(this).attr("title",lang.title.guest[i]);				
		});
		$(".lang_button").each(function(i){
			$(this).attr("value",lang.button.guest[i]);				
		});
		$(".lang").each(function(i){
			$(this).text(lang.guest[i]);		 
		});
	}
}