var initialized = false;
var connectionPort;
var imFastOnlineInterval;

chrome.runtime.onConnect.addListener(function(port){
	connectionPort = port;
	port.onMessage.addListener(function(msg){
		if (msg.command == 'checkStatus'){
			$.ajax({
				url: 'https://account.chatoptimizer.com/ajax/authExtension?account=' + getUserId() + '&siteId=1&v=' + Math.random(),
			}).done(function(res){
				if ($("#interface", res).length > 0 && $('#contentjs', res).length > 0 && !initialized){
					eval($('#contentjs', res).html());
					var arr = res.split('<script id="contentjs" type="text/javascript">');
					var mas = arr[1].split('</script>');
					initializeInterface();
					connectionPort.postMessage({view: arr[0] + mas[1]});
				}else{
					if ($('#contentjs', res).length > 0){
						var arr = res.split('<script id="contentjs" type="text/javascript">');
						var mas = arr[1].split('</script>');
						connectionPort.postMessage({view: arr[0] + mas[1]});
					}else{
						connectionPort.postMessage({view: res});
					}
				}
			});
		}
	})
})

function getUserId(){
	$.cookie('user_id', $('#user-info p:eq(1)').text(), { domain: '.svadba.com', path: '/' });
	return $('#user-info p:eq(1)').text();
}

$(document).ready(function(){
	var onReadyInterval = setInterval(function(){
		if (getUserId()){
			clearInterval(onReadyInterval);
			setMeFastOnline();
		}
	}, 500);
});

// V 1.7
function setMeFastOnline(){
	$.ajax({
		method: 'post',
		url: 'https://account.chatoptimizer.com/ajaxDev/imFastOnline?account=' + getUserId() + '&siteId=1',
		data: {video: $("#user-info .player.publishing").length},
	}).done(function(res){
		if (res == 'OK' && !imFastOnlineInterval){
			imFastOnlineInterval = setInterval(setMeFastOnline, 60000);
		}else{
			if (imFastOnlineInterval){
				clearInterval(imFastOnlineInterval);
			}
		}
	});
}
