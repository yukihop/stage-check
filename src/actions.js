import request from 'superagent';
import { dispatch } from './store';

function extractFromSheet(data) {
	return data.feed.entry.map(function(entry, i) {
		var obj = {};
		for (var key in entry) {
			var m;
			if (m = /gsx\$(.+)/.exec(key)) {
				var val = entry[key].$t;
				if (/^\d+$/.test(val)) val = parseInt(val);
				obj[m[1]] = val;
			}
		}
		obj.master_plus = obj.mpluslv > 0;
		obj.order = i;
		return obj;
	});
}

export function loadTunes() {
	var source = 'https://spreadsheets.google.com/feeds/list/1jGNh06Bv94jxZKByO1aWI-uPXP7Ox7xXYtrhhgRDjoI/od6/public/values?alt=json';
	request.get(source)
		.end((err, res) => {
			dispatch({
				type: 'registerTunes',
				tunes: extractFromSheet(res.body)
			});
		});
}

export function initialize() {
	if (confirm('データを初期化しますか?　エクスポートなどで保存されていないデータは失われます。')) {
		dispatch({ type: 'initialize' });
	}
}
