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
		const tunes = action.data.feed.entry.map(function(entry) {
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

	static importData(state, action) {
		let data = prompt('Save data?');
		if (data !== null) {
			try {
				let decoded = JSON.parse(atob(data));
				state.save = decoded;
			} catch (err) {
				alert('無効なデータです。');
			}
		}
		return state;
	}

	static initialize(state, action) {
		if (confirm('Init?')) {
			state.save = {};
		}
		return state;
	}

	static applyFilters(state, action) {
		state.filteredTunes = state.tunes.filter(
			tune => state.activeFilters[tune.category]
		);
		return state;
	}

	static changeFilter(state, action) {
		state.activeFilters[action.filter] = !!action.active;
		return Reducers.applyFilters(state, {});
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
		filteredTunes: [],
		save
	};
}

export let store = createStore(reducer);