function cbGetSelectedText(d) {
	var S='';
	if (d.all) {
		S=d.selection.createRange().text;
	} else {
		S=d.getSelection().toString();
	}
	return S;
}

async function cbsha1(str) {
	var buffer = new TextEncoder('utf-8').encode(str);
	const hash = await crypto.subtle.digest('SHA-1', buffer);
	return cbHash2hex(hash);
}

function cbHash2hex(buffer) {
	var hexCodes = [];
	var view = new DataView(buffer);
	for (var i = 0; i < view.byteLength; i += 4) {
		// Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
		var value = view.getUint32(i)
		// toString(16) will give the hex representation of the number without padding
		var stringValue = value.toString(16)
		// We use concatenation and slice for padding
		var padding = '00000000'
		var paddedValue = (padding + stringValue).slice(-padding.length)
		hexCodes.push(paddedValue);
	}
	// Join all the hex strings into one
	return hexCodes.join('');
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