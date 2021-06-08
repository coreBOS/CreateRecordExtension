// i18n
cbi18nHTML();
cbi18nHTML(); // twice is intentional for nested elements

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch (request.message) {
			case 'selectedtext':
				if (request.payload.field=='description') {
					document.getElementById('description').value = request.selectedtext;
					document.getElementById('description').dispatchEvent(event);
				} else  if (request.payload.field=='title') {
					document.getElementById('title').value = request.selectedtext;
					document.getElementById('title').dispatchEvent(event);
				} else {
					if (request.payload.field!=undefined){
						document.getElementById(request.payload.field).value = request.selectedtext;
						cbCustomEventDispatcher('cnage', request.payload.field)
					}
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
	cbFormActionUrl();
};

document.getElementById('sendandclean').onclick=function (e) {
	cbFormActionUrl();
	let allFields = [...document.querySelectorAll('.slds-input')];
	chrome.storage.sync.remove('corebospopupdesc');
	chrome.storage.sync.remove('corebospopuptitle');
	allFields.forEach( (textfield) => {
		chrome.storage.sync.remove([textfield.name]);
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
		if (coreboscreaterecorddata.cbtitles!=undefined) {
			document.getElementById('title').name = coreboscreaterecorddata.cbtitles[module];
		}
		if (coreboscreaterecorddata.cbfields!=undefined) {
			var fset = document.getElementById('customfields');
			fset.innerHTML = '';
			var fdef = '';
			for (var i = 0; i < coreboscreaterecorddata.cbfields.length; i++) {
				if (module==coreboscreaterecorddata.cbfields[i].fmodule) {
					var fieldname = coreboscreaterecorddata.cbfields[i].fname;
					var fieldlabel = coreboscreaterecorddata.cbfields[i].flabel;
					fdef += `
					<div class="slds-form-element slds-form-element_stacked">
					<label class="slds-form-element__label" for="${fieldname}">${fieldlabel}</label>
					<div class="slds-form-element__control slds-grid slds-wrap slds-gutters_xxx-small">
					<div class="slds-col slds-size_5-of-6">
					<input type="text" name="${fieldname}" id="${fieldname}" class="slds-input" />
					</div>
					<div class="slds-col slds-size_1-of-6">
					<button type="button" id="pst_${fieldname}"
					class="slds-input_height paste" data-locale="IT_Paste">P</button>
					<button type="button" id="clr_${fieldname}"
					class="slds-input_height clear" data-locale="IT_Clear">C</button></div></div>
					</div>`;
				}
			}
			fset.innerHTML = fdef;
			var allFields = [...document.querySelectorAll('.slds-input')];
			allFields.forEach((textfield) => textfield.addEventListener('change', (e) => {
				chrome.storage.sync.set({[e.target.name]:e.target.value});
			}));
			allFields.forEach( (textfield) => {
				chrome.storage.sync.get( function (data) {
					if (typeof data[textfield.name]!='undefined') {
						document.getElementById(textfield.name).value = data[textfield.name];
					}
				});
			});

			[...document.querySelectorAll('.paste')].forEach( (btn) => btn.addEventListener('click',  (e) => {
					chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
						chrome.tabs.sendMessage(tabs[0].id, {
							'message': 'getSelectedText',
							'payload':{'field':e.target.id.substring(4)
						}});
					});
				})
			);

			[...document.querySelectorAll('.clear')].forEach( (btn) => btn.addEventListener('click',  (e) => {
					document.getElementById(e.target.id.substring(4)).value = '';
				})
			)
		}
	});
};

document.getElementById('sendto').onchange=function (e) {
	var cburl = e.target.options[e.target.selectedIndex].text;
	chrome.storage.sync.get('coreboscreaterecorddata', ({ coreboscreaterecorddata }) => {
		if (coreboscreaterecorddata==undefined) {
			return;
		}
		if (coreboscreaterecorddata.cbsecrets!=undefined) {
			const rightnow = Date.now();
			cbsha1(coreboscreaterecorddata.cbsecrets[cburl].secret + coreboscreaterecorddata.cbsecrets[cburl].key + rightnow).then((hash) => {
				document.getElementById('__vt5rftk').value = 'key:' + hash + ',' + rightnow;
			});
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
		cbCustomEventDispatcher('change', 'convertto');
	}
	if (coreboscreaterecorddata.cburls!=undefined) {
		var cbs = coreboscreaterecorddata.cburls.map((c) => {
			return {
				'label': c.cbname,
				'value': c.cburl
			};
		});
		cbFillPicklist('sendto', cbs);
		cbCustomEventDispatcher('change','sendto')
	}
});
