function cbGetSelectedText(d) {
	var S='';
	if (d.all) {
		S=d.selection.createRange().text;
	} else {
		S=d.getSelection().toString();
	}
	return S;
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch (request.message) {
			case 'clicked_browser_action':
				chrome.runtime.sendMessage({'message': 'open_corebos_new_tab'});
				break;
			case 'getSelectedText':
				chrome.runtime.sendMessage({
					'message': 'selectedtext',
					'selectedtext': cbGetSelectedText(document),
					'payload': request.payload
				});
				break;
		}
	}
);