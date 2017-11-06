var urlManId;
var publicId;
var comment;
var fanManCommentTimeout;
function profile(){
	if ($.cookie('user_id') && $.trim($('table.ManParams tbody tr').first().children('td').last().html())){
		fanMans = localStorage["fanMans_" + $.cookie('user_id')];
		if (fanMans){
			publicId = $.trim($('table.ManParams tbody tr').first().children('td').last().html());
			fanMans = JSON.parse(fanMans);
			for (manId in fanMans){if (fanMans[manId].publicId == publicId){urlManId = manId; break;}}
			if (typeof fanMans[urlManId] !== 'undefined'){
				$("#MAIN_ManDetails1_ManDetails div.overflow").append('<div id="mensComments" style="width: ' + 
						($("#MAIN_ManDetails1_ManDetails div.overflow").width() - (
							$("#MAIN_ManDetails1_ManDetails div.overflow .man-photo").width() + 
							$("#MAIN_ManDetails1_ManDetails div.overflow .man-params").width() + 
							35)
						) + 'px; float: left; height: ' + $("#MAIN_ManDetails1_ManDetails div.overflow").height() + 'px" manId="' + urlManId + '">' + 
						
						'<textarea id="menComment" placeholder="' + __('Укажите комментарий о Вашем поклоннике, чтобы всегда помнить о нем самое главное') + '">' + fanMans[urlManId].comment + '</textarea>' + 
					'</div>');
			}
		}
	}

	$("#mensComments").on('keyup', function(){
		clearTimeout(fanManCommentTimeout);
		fanManCommentTimeout = setTimeout(function(){
			saveFanManComment($("#mensComments").attr('manId'), $("#menComment").val());
		}, 500);
	});

	function saveFanManComment(manId, comment){
		fanMans = localStorage["fanMans_" + $.cookie('user_id')];
		if (fanMans){
			fanMans = JSON.parse(fanMans);
			if (typeof fanMans[manId] !== 'undefined'){
				fanMans[manId].comment = comment;
				localStorage["fanMans_" + $.cookie('user_id')] = JSON.stringify(fanMans);
			}
		}
	}
}