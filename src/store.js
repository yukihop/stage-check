import { createStore } from 'redux';
import jQuery from 'jquery';

class Reducers {
	static changeCheckedState(state, action) {
		if (!(action.tune in state.save)) {
			state.save[action.tune] = {};
		}
		let checks = state.save[action.tune];
		if (action.checked) {
			checks[action.difficulty] = true;
		} else {
			delete checks[action.difficulty];
		}
		if (Object.keys(checks).length === 0) {
			delete state.save[action.tune];
		}
		localStorage.setItem('clearData', JSON.stringify(state.save));
		return state;
	}

	static tunesLoaded(state, action) {
		const tunes = action.data.feed.entry.map(function(entry, i) {
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
		state.tunes = tunes;
		return Reducers.applyFilters(state, {});
	}

	static loadTunes(state, action) {
		var source = 'https://spreadsheets.google.com/feeds/list/1jGNh06Bv94jxZKByO1aWI-uPXP7Ox7xXYtrhhgRDjoI/od6/public/values?alt=json';
		jQuery.ajax({
			url: source,
			dataType: 'json',
			success: data => {
				store.dispatch({ type: 'tunesLoaded', data });
			}
		});
		return state;
	}

	static exportData(state, action) {
		state.exportDialogContent = btoa(JSON.stringify(state.save));
		return state;
	}

	static hideExportDialog(state, action) {
		delete state.exportDialogContent;
		return state;
	}

	static showImportDialog(state, action) {
		state.importDialogShowing = true;
		return state;
	}

	static commitImportData(state, action) {
		if (typeof action.encoded === 'string' && action.encoded.length > 0) {
			try {
				let decoded = JSON.parse(atob(action.encoded));
				state.save = decoded;
			} catch (err) {
				alert('無効なデータです。');
				return state;
			}
		}
		state.importDialogShowing = false;
		return state;
	}

	static initialize(state, action) {
		if (confirm('データを初期化しますか?　エクスポートなどで保存されていないデータは失われます。')) {
			state.save = {};
		}
		return state;
	}

	static applyFilters(state, action) {
		let sortFunc;
		switch (state.sortOrder) {
			case 'title':
				sortFunc = (a, b) => a.title.localeCompare(b.title);
				break;
			case 'level':
				sortFunc = (a, b) => {
					let alv = a.mpluslv > 0 ? a.mpluslv : a.masterlv;
					let blv = b.mpluslv > 0 ? b.mpluslv : b.masterlv;
					return (blv - alv) || (a.order - b.order);
				};
				break;
			case 'notes':
				sortFunc = (a, b) => {
					let anotes = a.mplusnotes > 0 ? a.mplusnotes : a.masternotes;
					let bnotes = b.mplusnotes > 0 ? b.mplusnotes : b.masternotes;
					return (bnotes - anotes) || (a.order - b.order);
				};
				break;
			case 'unlock':
				sortFunc = (a, b) => {
					return b.unlock.localeCompare(a.unlock) || (a.order - b.order);
				};
				break;
			case 'default':
			default:
				sortFunc = (a, b) => a.order - b.order;
				break;
		}

		state.filteredTunes = state.tunes.filter(
			tune => state.activeFilters[tune.category]
		).sort(sortFunc);
		return state;
	}

	static changeFilter(state, action) {
		state.activeFilters[action.filter] = !!action.active;
		return Reducers.applyFilters(state, {});
	}

	static sort(state, action) {
		state.sortOrder = action.order;
		return Reducers.applyFilters(state, {});
	}

	static showAttribute(state, action) {
		state.showingAttribute = action.attribute;
		return state;
	}
}

function reducer(state, action) {
	if (Reducers[action.type] instanceof Function) {
		return Reducers[action.type](state, action);
	}
	if (action.type === '') {

	}

	let save = {};
	try {
		let tmp = localStorage.getItem('clearData');
		save = JSON.parse(tmp);
	} catch (err) {
		alert('セーブファイルが壊れています');
	}
	return {
		tunes: [],
		activeFilters: { normal: true, event: true, oldevent: true, limited: true },
		sortOrder: 'default',
		showingAttribute: 'difficulty',
		filteredTunes: [],
		importDialogShowing: null,
		save
	};
}

export let store = createStore(reducer);
export let dispatch = store.dispatch;
