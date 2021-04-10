chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var event = new Event('change');
		switch (request.message) {
			case 'selectedtext':
				if (request.payload.field=='description') {
					document.getElementById('description').value = request.selectedtext;
					document.getElementById('description').dispatchEvent(event);
				} else {
					document.getElementById('title').value = request.selectedtext;
					document.getElementById('title').dispatchEvent(event);
				}
				break;
		}
	}
);

document.getElementById('title').onchange=function (e) {
	chrome.storage.sync.set({'corebospopuptitle':document.getElementById('title').value});
};

document.getElementById('description').onchange=function (e) {
	chrome.storage.sync.set({'corebospopupdesc':document.getElementById('description').value});
};

document.getElementById('sendtocb').onclick=function (e) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {'message': 'clicked_browser_action'});
	});
};

document.getElementById('titlepaste').onclick=function (e) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {'message': 'getSelectedText', 'payload':{'field':'title'}});
	});
};

document.getElementById('titleclear').onclick=function (e) {
	document.getElementById('title').value = '';
};

document.getElementById('descpaste').onclick=function (e) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {'message': 'getSelectedText', 'payload':{'field':'description'}});
	});
};

document.getElementById('descclear').onclick=function (e) {
	document.getElementById('description').value = '';
};

document.getElementById('convertto').onchange=function (e) {
	var module = e.target.value;
	chrome.storage.sync.get('coreboscreaterecorddata', ({ coreboscreaterecorddata }) => {
		if (coreboscreaterecorddata==undefined) {
			return;
		}
		if (coreboscreaterecorddata.cbfields!=undefined) {
			var fset = document.getElementById('customfields');
			fset.innerHTML = '';
			var fdef = '';
			for (var i = 0; i < coreboscreaterecorddata.cbfields.length; i++) {
				if (module==coreboscreaterecorddata.cbfields[i].fmodule) {
					var fieldname = coreboscreaterecorddata.cbfields[i].fname;
					var fieldlabel = coreboscreaterecorddata.cbfields[i].flabel;
					fdef += `<div class="slds-form-element slds-form-element_stacked">
					<label class="slds-form-element__label" for="${fieldname}">${fieldlabel}</label>
					<div class="slds-form-element__control">
					<input type="text" id="${fieldname}" class="slds-input" />
					</div>
					</div>`;
				}
			}
			fset.innerHTML = fdef;
		}
	});
};

chrome.storage.sync.get('corebospopuptitle', ({ corebospopuptitle }) => {
	if (corebospopuptitle!=undefined) {
		document.getElementById('title').value = corebospopuptitle;
	} else {
		document.getElementById('title').value = '';
	}
});

chrome.storage.sync.get('corebospopupdesc', ({ corebospopupdesc }) => {
	if (corebospopupdesc!=undefined) {
		document.getElementById('description').value = corebospopupdesc;
	} else {
		document.getElementById('description').value = '';
	}
});

chrome.storage.sync.get('coreboscreaterecorddata', ({ coreboscreaterecorddata }) => {
	if (coreboscreaterecorddata==undefined) {
		return;
	}
	if (coreboscreaterecorddata.cbmodules!=undefined) {
		var mods = coreboscreaterecorddata.cbmodules.map((m) => {
			return {
				'label': m.mdlabel,
				'value': m.cbmodule
			};
		});
		cbFillPicklist('convertto', mods);
		var event = new Event('change');
		document.getElementById('convertto').dispatchEvent(event);
	}
	if (coreboscreaterecorddata.cburls!=undefined) {
		var cbs = coreboscreaterecorddata.cburls.map((c) => {
			return {
				'label': c.cbname,
				'value': c.cburl
			};
		});
		cbFillPicklist('sendto', cbs);
	}
});
