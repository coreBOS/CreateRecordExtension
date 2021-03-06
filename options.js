// i18n
cbi18nHTML();
cbi18nHTML(); // twice is intentional for nested elements

class ActionRender {

	constructor(props) {
		let cbrowid = 0;
		var cbrow = props.rowKey;
		let el = document.createElement('span');
		let btn = document.createElement('button');
		btn.innerHTML = chrome.i18n.getMessage('Delete');
		btn.title = chrome.i18n.getMessage('Delete');
		switch (props.grid.el.id) {
			case 'cburls':
				if (cburlsgrid!=undefined) {
					cbrowid = cburlsgrid.getRowCount();
				}
				btn.id = 'tuiGridActionscburlsDeleteRow'+cbrowid;
				btn.addEventListener('click', (ev) => {
					tuiGridActions.deleteRow(cburlsgrid, cbrow);
				});
				break;
			case 'cbmods':
				if (cbmodsgrid!=undefined) {
					cbrowid = cbmodsgrid.getRowCount();
				}
				btn.id = 'tuiGridActionscbmodsDeleteRow'+cbrowid;
				btn.addEventListener('click', (ev) => {
					tuiGridActions.deleteRow(cbmodsgrid, cbrow);
				});
				break;
			default:
				if (cbfldsgrid!=undefined) {
					cbrowid = cburlsgrid.getRowCount();
				}
				btn.id = 'tuiGridActionscbfldsDeleteRow'+cbrowid;
				btn.addEventListener('click', (ev) => {
					tuiGridActions.deleteRow(cbfldsgrid, cbrow);
				});
				break;
		}
		el.appendChild(btn);
		this.el = el;
		this.render(props);
	}

	getElement() {
		return this.el;
	}

	render(props) {
		this.el.value = String(props.value);
	}
}

const tuiGridActions = {
	deleteRow: function (grid, rowno) {
		grid.removeRow(rowno);
	},
	addRow: function (grid, data) {
		grid.appendRow(data);
	}
};

const cburlrow = {
	'cbname':'',
	'cburl':'',
	'cbsecret':'',
	'cbkey':''
};

const cbmodrow = {
	'mdlabel':'',
	'cbmodule':'',
	'cbfield':''
};

const cbfldrow = {
	'flabel':'',
	'fname':'',
	'fmodule':''
};

var cbfldsgrid = new tui.Grid({
	el: document.getElementById('cbfields'),
	data: [],
	scrollX: false,
	scrollY: false,
	columns: [
		{
			header: chrome.i18n.getMessage('Label'),
			name: 'flabel',
			editor: 'text'
		},
		{
			header: chrome.i18n.getMessage('Name'),
			name: 'fname',
			editor: 'text'
		},
		{
			header: chrome.i18n.getMessage('Module'),
			name: 'fmodule',
			editor: 'text'
		},
		{
			header: chrome.i18n.getMessage('Action'),
			name: 'faction',
			width: 100,
			renderer: {
				type: ActionRender,
			},
		}
	],
	columnOptions: {
		resizable: true
	}
});

var cburlsgrid = new tui.Grid({
	el: document.getElementById('cburls'),
	data: [],
	scrollX: false,
	scrollY: false,
	columns: [
		{
			header: chrome.i18n.getMessage('Name'),
			name: 'cbname',
			editor: 'text'
		},
		{
			header: chrome.i18n.getMessage('URL'),
			name: 'cburl',
			editor: 'text'
		},
		{
			header: chrome.i18n.getMessage('Secret'),
			name: 'cbsecret',
			editor: 'text'
		},
		{
			header: chrome.i18n.getMessage('Key'),
			name: 'cbkey',
			editor: 'text'
		},
		{
			header: chrome.i18n.getMessage('Action'),
			name: 'faction',
			width: 100,
			renderer: {
				type: ActionRender,
			},
		}
	],
	columnOptions: {
		resizable: true
	}
});

var cbmodsgrid = new tui.Grid({
	el: document.getElementById('cbmods'),
	data: [],
	scrollX: false,
	scrollY: false,
	columns: [
		{
			header: chrome.i18n.getMessage('Label'),
			name: 'mdlabel',
			editor: 'text'
		},
		{
			header: chrome.i18n.getMessage('Module'),
			name: 'cbmodule',
			editor: 'text'
		},
		{
			header: chrome.i18n.getMessage('TitleField'),
			name: 'cbfield',
			editor: 'text'
		},
		{
			header: chrome.i18n.getMessage('Action'),
			name: 'faction',
			width: 100,
			renderer: {
				type: ActionRender,
			},
		}
	],
	columnOptions: {
		resizable: true
	}
});

document.getElementById('savesettings').onclick=function (e) {
	let cburls = cburlsgrid.getData().map((r) => {
		return {
			'cbname': r.cbname,
			'cburl': r.cburl,
			'cbsecret': r.cbsecret,
			'cbkey': r.cbkey
		}
	});
	var cbsecrets = {};
	cburlsgrid.getData().map((r) => {
		cbsecrets[r.cbname] = {
			'secret': r.cbsecret,
			'key': r.cbkey
		};
		return {};
	});
	let cbmods = cbmodsgrid.getData().map((r) => {
		return {
			'mdlabel': r.mdlabel,
			'cbmodule': r.cbmodule,
			'cbfield': r.cbfield
		}
	});
	var cbtitles = {};
	cbmodsgrid.getData().map((r) => {
		cbtitles[r.cbmodule] = r.cbfield;
		return {};
	});
	let cbflds = cbfldsgrid.getData().map((r) => {
		return {
			'flabel':r.flabel,
			'fname':r.fname,
			'fmodule':r.fmodule
		}
	});
	let cbdata = {
		'cburls': cburls,
		'cbsecrets': cbsecrets,
		'cbfields': cbflds,
		'cbmodules': cbmods,
		'cbtitles': cbtitles
	};
	chrome.storage.sync.set({'coreboscreaterecorddata':cbdata});
	document.getElementById('notificationdiv').innerHTML = chrome.i18n.getMessage('SettingsSaved');
	document.getElementById('notificationcontainer').classList.remove('slds-hide');
	setTimeout(
		function () {
			document.getElementById('notificationcontainer').classList.add('slds-hide');
		},
		2500
	);
}
document.getElementById('addBtncburls').onclick=function (e) {
	tuiGridActions.addRow(cburlsgrid, cburlrow);
}
document.getElementById('addBtncbmods').onclick=function (e) {
	tuiGridActions.addRow(cbmodsgrid, cbmodrow);
}
document.getElementById('addBtncbflds').onclick=function (e) {
	tuiGridActions.addRow(cbfldsgrid, cbfldrow);
}
chrome.storage.sync.get('coreboscreaterecorddata', ({ coreboscreaterecorddata }) => {
	if (coreboscreaterecorddata==undefined) {
		return;
	}
	if (coreboscreaterecorddata.cbmodules!=undefined) {
		cbmodsgrid.resetData(coreboscreaterecorddata.cbmodules);
		cbmodsgrid.resetOriginData();
	}
	if (coreboscreaterecorddata.cburls!=undefined) {
		cburlsgrid.resetData(coreboscreaterecorddata.cburls);
		cburlsgrid.resetOriginData();
	}
	if (coreboscreaterecorddata.cbfields!=undefined) {
		cbfldsgrid.resetData(coreboscreaterecorddata.cbfields);
		cbfldsgrid.resetOriginData();
	}
});
