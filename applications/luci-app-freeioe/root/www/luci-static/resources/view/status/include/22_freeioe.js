'use strict';
'require fs';
'require rpc';

var callFreeioeInfo = rpc.declare({
	object: 'freeioe',
	method: 'info'
});

var callFreeioeCloud = rpc.declare({
	object: 'freeioe',
	method: 'cloud'
});

return L.Class.extend({
	title: _('FreeIOE'),

	load: function() {
		return Promise.all([
			L.resolveDefault(callFreeioeInfo(), {}),
			L.resolveDefault(callFreeioeCloud(), {}),
		]);
	},

	render: function(data) {
		var info   = data[0],
		    cloud  = data[1];

		var fields = [
			_('PSN'),              info.hw_id + ' / ' + info.id,
			_('Version'),          info.version + ' ( ' + info.skynet_version + ' ) ',
			_('Firmware Version'), info.firmware_version,
			_('Cloud Host'),       cloud.host,
			_('Cloud Status'),     cloud.mqtt.online === 1 ? 'ONLINE' : 'OFFLINE: ' + cloud.mqtt.msg,
		];

		var table = E('div', { 'class': 'table' });

		for (var i = 0; i < fields.length; i += 2) {
			table.appendChild(E('div', { 'class': 'tr' }, [
				E('div', { 'class': 'td left', 'width': '33%' }, [ fields[i] ]),
				E('div', { 'class': 'td left' }, [ (fields[i + 1] != null) ? fields[i + 1] : '?' ])
			]));
		}

		return table;
	}
});
