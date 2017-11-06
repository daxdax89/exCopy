document.addEventListener('DOMContentLoaded', function () {
	OIIG2.checkStatus();
});

var tabId;
var connectionPort;

var currentWindow;
var currentTab;
var initialized = true;

var IIG2 = {
	conn: function(command, callback){
		chrome.tabs.getSelected(null, function(tab) {
			tabId = tab.id;
			connectionPort = chrome.tabs.connect(tabId, {});
			connectionPort.postMessage({command: command});
			connectionPort.onMessage.addListener(callback);
		});
	}
}
var OIIG2 = {
	checkStatus: function(){
		console.log('OIIG2.checkStatus();');
		IIG2.conn('checkStatus', function(response){
			$('body').html(response.view);
			$('#popupjs').remove();
			chrome.windows.getCurrent(function(w) {
				currentWindow = w;
				chrome.tabs.getSelected(currentWindow.id,function(t){
					currentTab = t;
					if ($("#initvk").length > 0){
						sendMessage({initVK: 1});
					};
					var synchronize = 0;
					if ($("#synchronize").length > 0){
						synchronize = true;
						$("#synchronize").remove();
					}
					connectByPort();
					if ($("#customerCountry").length > 0){
						countryIso = $("#customerCountry").html();
						$("#customerCountry").remove();
					}
					sendMessage({check: 1, synchronize: synchronize, countryIso: countryIso, currentTab: currentTab});
					OIIG.init();
				});
			});
		})
	}
};

