var lang = 'ru';
var translations = {
	"Вас приветствует расширение ChatOS": "Welcome in extension ChatOS",
	"Перейти в чат": "Come in chat",
	"Справка": "Help",
	"Пополнить баланс": "Add Credits",
	"Укажите комментарий о Вашем поклоннике, чтобы всегда помнить о нем самое главное": "Set notes about your fan to remember about him main information"
}

// Функция для перевода
function __(text){
	if (typeof translations[text] !== 'undefined' && lang != 'ru'){
		return translations[text];
	}else{
		return text;
	}
}

$.get("https://account.chatoptimizer.com/ajax/myLanguage", function(res){
	if (res != 'ru'){
		lang = res;
	}
	if (typeof profile !== 'undefined'){
		profile();
	}
	if (typeof helper !== 'undefined'){
		helper();
	}
});

