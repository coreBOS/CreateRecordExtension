function cbGetSelectedText(d) {
	var S='';
	if (d.all) {
		S=d.selection.createRange().text;
	} else {
		S=d.getSelection().toString();
	}
	return S;
}

function cbOpenURL() {
	var u=null;
	if (frames.length==0) {
		u=G(document);
	} else {
		for (i=0; F=frames[i]; ++i) {
			u=G(F.document);
			if(u) break;
		}
	}
	if(u){
		if(u.indexOf('.')<0){
			u+='.com/';
		}
		if(u.indexOf('www.')<0&&u.indexOf('http://')<0){
			u='www.'+u;
		}
		if(u.indexOf('http://')<0){
			u='http://'+u;
		}
		W=window.open();
		W.document.location.href=u;
	}else {
		alert('Select some text.');
	}
}

function cbFillPicklist(picklist, options) {
	var select = document.getElementById(picklist);
	for (var i = 0; i < options.length; i++) {
		var el = document.createElement('option');
		el.text = options[i].label;
		el.value = options[i].value;
		select.appendChild(el);
	}
}

// Called when the user clicks on the browser action.
// chrome.browserAction.onClicked.addListener(function(tab) {
// 	// Send a message to the active tab
// 	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// 		var activeTab = tabs[0];
// 		chrome.tabs.sendMessage(activeTab.id, {'message': 'clicked_browser_action'});
// 	});
// });

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === 'open_corebos_new_tab' ) {
			chrome.storage.sync.get('corebosurl', ({ corebosurl }) => {
				console.log(corebosurl);
				chrome.tabs.create({'url': corebosurl});
			});
		}
	}
);