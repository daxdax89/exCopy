function helper(){
	var div = '<div id="chatOSSvadbaHelper">' +
		'<div id="helperHeader">' +
			'<h5>' + __('Welcome to ExodiousUI') + '</h5>' + 
			'<a class="closeHelper"></a>' + 
		'</div>' +
		'<div id="helperBody">' + 
			'<a href="https://www.svadba.com/chat/#" class="buttons">' + __('Open Chat') + '</a>' + 
			'<a href="https://chatoptimizer.com/?p=148" class="buttons" target="_blank">' + __('Help') + '</a>' + 
			'<a href="https://account.chatoptimizer.com/customer/topup" class="buttons" target="_blank">' + __('Add Credits') + '</a>' + 
		'</div>' + 
	'</div>';

	$("body").append(div);
	setBlockTop();

	$(".closeHelper").on('click', function(){
		$("#chatOSSvadbaHelper").fadeOut(300, function(){$(this).remove();})
	});

	window.addEventListener('resize', function(){
		setBlockTop();
	});

	function setBlockTop(){
		$("#chatOSSvadbaHelper").css('top', ((window.innerHeight - $("#chatOSSvadbaHelper").height()) / 2) + 'px')
	}
}