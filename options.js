class ActionRender {

	constructor(props) {
		let cbrowid = 0;
		var cbrow = props.rowKey;
		let el = document.createElement('span');
		let btn = document.createElement('button');
		btn.innerHTML = 'Delete';
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
		//el.innerHTML = `<button id="${btnid}" data-grid="cburlsgrid" data-row="${props.rowKey}">Delete</button>`;
		//el.innerHTML = `<button onclick="tuiGridActions.deleteRow(cbfldsgrid, ${props.rowKey});">Delete</button>`;
		//el.innerHTML = `<button id="${this.btnid}">Delete</button>`;
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
	'cburl':''
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
			header: 'Label',
			name: 'flabel',
			editor: 'text'
		},
		{
			header: 'Name',
			name: 'fname',
			editor: 'text'
		},
		{
			header: 'Module',
			name: 'fmodule',
			editor: 'text'
		},
		{
			header: 'Action',
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
			header: 'Name',
			name: 'cbname',
			editor: 'text'
		},
		{
			header: 'URL',
			name: 'cburl',
			editor: 'text'
		},
		{
			header: 'Action',
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
			'cburl': r.cburl
		}
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
		'cbfields': cbflds,
		'modules': document.getElementById('modules').value
	};
	chrome.storage.sync.set({'coreboscreaterecorddata':cbdata});
}
document.getElementById('addBtncburls').onclick=function (e) {
	tuiGridActions.addRow(cburlsgrid, cburlrow);
}
document.getElementById('addBtncbflds').onclick=function (e) {
	tuiGridActions.addRow(cbfldsgrid, cbfldrow);
}
chrome.storage.sync.get('coreboscreaterecorddata', ({ coreboscreaterecorddata }) => {
	if (coreboscreaterecorddata==undefined) {
		return;
	}
	if (coreboscreaterecorddata.modules!=undefined) {
		document.getElementById('modules').value = coreboscreaterecorddata.modules;
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
