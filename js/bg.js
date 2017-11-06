var windowId;
var tabId;
var vkWindowId;
var vkTabId = 0;
var vkURL;
var vkToken;
var vkTokenSent = false;
var translations = [];
var currentTab;
var nots = [];
var girlId;

chrome.tabs.onUpdated.addListener(function(id,info,tab) {
	if (typeof info !== 'undefined' && typeof tab !== 'undefined'){
		if (typeof info.status !== 'undefined' && typeof tab.url !== 'undefined'){
			if (id == vkTabId){
				if (typeof info.status !== 'undefined' && typeof tab.url !== 'undefined'){
					vkURL = tab.url;
					if (tab.url.indexOf("http://vk.com/login.php") > -1 || tab.url.indexOf("https://api.vk.com/blank.html") > -1 || tab.url.indexOf('https://oauth.vk.com/blank.html') > -1){
						console.log(vkURL);
						console.log(tab);
						if (tab.url.indexOf("https://api.vk.com/blank.html") > -1){
							if (!vkTokenSent){
								if (typeof vkURL.split('access_token=')[1] !== 'undefined'){
									vkToken = vkURL.split('access_token=')[1].split('&')[0];
									sendToken(vkToken);
									vkTokenSent = true;
									chrome.windows.get(vkWindowId, 
										function(){
											chrome.windows.remove(vkWindowId, function(){console.log('window removed');});
										}
									);
								}
							}
						}else{
							chrome.windows.get(vkWindowId, 
								function(){
									chrome.windows.remove(vkWindowId, function(){console.log('window removed');});
								}
							);
							alert('Чтобы общаться в обсуждении, Вам необходимо добавить приложение и подтвердить разрешить публикацию сообщений от Вашего имени.');
						}
					}
				}
			}else if(info.status == 'complete' && tab.url){
				if(tab.url.indexOf('svadba.com/chat/') > -1){
					chrome.pageAction.show(id);
					windowId = tab.windowId;
					tabId = tab.id;
				}
			}
		}
	}
});  
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (typeof request !== 'undefined'){
			if (typeof request.launchVK !== 'undefined'){
				if (request.launchVK === 'ok'){
					vkTokenSent = false;
					console.log(sender.tab ?
							"from a content script:" + sender.tab.url : 
							"from the extension");
					chrome.windows.create({url: 'https://oauth.vk.com/authorize?client_id=4976148&scope=offline,groups&redirect_uri=https://api.vk.com/blank.html&response_type=token&v=5.37&state=123456789'}, function(res){
						vkWindowId = res.id;
						chrome.tabs.getSelected(vkWindowId,function(tab){
							vkTabId = tab.id;
							/*chrome.tabs.onUpdated.addListener(function(id,info,tab) {
							});*/
						});
					});		
				}
			}
			if (typeof request.showNotification !== 'undefined'){
				currentTab = request.currentTab;
				girlId = request.girlId;
				manName = request.manName; 
				publicManId = request.publicManId;
				manId = request.manId;
				translations = request.translations;
				chatLink = typeof request.chatLink !== 'undefined' ? request.chatLink : '//www.svadba.com/chat/#';
				console.log(chatLink);
				showNotification(manName, publicManId, manId, chatLink);
			}
			if (typeof request.removeNotification !== 'undefined'){
				currentTab = request.currentTab;
				girlId = request.girlId;
				manId = request.manId;
				removeNotification(manId);
			}
		}
	}
);

function sendToken(token){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabId, {token: token}, function(response) {
		console.log(response);
	  });
	});			
}

/* Show notification about incoming message */
function showNotification(manName, publicManId, manId, chatLink){
	var d = new Date();
	var not = {};
	not.id = girlId + '_' + manId;
	not.manId = manId;
	not.chatLink = chatLink;
	var find = false;
	if (nots.length > 0){
		for (var i = 0; i < nots.length; i++){
			if (nots[i]["id"] == not.id){
				selNotification = i;
				find = true;
				break;
			}
		}
	}
	if (!find){
		nots.push(not);
		selNotification = nots.length - 1;
	}
	chrome.notifications.create(
		nots[selNotification]["id"], 
		{
			type: 'basic', 
			iconUrl: './img/128.png', 
			title: 'Svadba ' + __('девушка') + ' ' + girlId, 
			message: __('Входящее сообщение от мужчины') + ': ' + manName + ' (' + publicManId + ')', 
			contextMessage: __('Кликните, чтобы открыть чат'), 
			isClickable: true, 
			requireInteraction: true
		}, 
		function(res){
			console.log('Notification showed');
			chrome.notifications.onClicked.addListener(function(notId){
				selNotification = false;
				for (i = 0; i < nots.length; i++){
					if (nots[i]["id"] == notId){
						selNotification = i;
						break;
					}
				}
				if (selNotification !== false){
					var url = nots[selNotification]["chatLink"] + '/' + nots[selNotification]["manId"];
					chrome.windows.update(currentTab.windowId, {focused: true}, 
						function(){
							chrome.tabs.update(currentTab.id, {url: url, selected: true});
						}
					);
					chrome.notifications.clear(nots[selNotification]["id"]);
					nots.splice(selNotification, 1);
				}
			});
			chrome.notifications.onClosed.addListener(function(notId){
				selNotification = false;
				for (i = 0; i < nots.length; i++){
					if (nots[i]["id"] == notId){
						selNotification = i;
						break;
					}
				}
				if (selNotification !== false){
					nots.splice(selNotification, 1);
				}
			});
		}
	);
}

function removeNotification(manId){
	if (typeof manId !== 'undefined'){
		if (nots.length > 0){
			selNotification = false;
			for (i = 0; i < nots.length; i++){
				if (nots[i]["id"].indexOf(girlId + '_' + manId) > -1){
					selNotification = i;
					break;
				}
			}
			if (selNotification !== false){
				console.log('Notification removed');
				chrome.notifications.clear(nots[selNotification]["id"]);
				nots.splice(selNotification, 1);
			}
		}
	}
}

// Функция для перевода
function __(text){
	if (typeof translations[text] !== 'undefined'){
		return translations[text];
	}else{
		return text;
	}
}

