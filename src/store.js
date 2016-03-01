import { createStore } from 'redux';

function makeFilteredTunes(state) {
	let sortFunc = (a, b) => a.order - b.order;
	switch (state.sortOrder) {
		case 'title':
			sortFunc = (a, b) => {
				let atitle = a.title.replace(/\-/g, '');
				let btitle = b.title.replace(/\-/g, '');
				return atitle.localeCompare(btitle);
			};
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
	}

	state.filteredTunes = state.tunes
		.filter(tune => state.activeFilters[tune.category])
		.sort(sortFunc);
}

function saveState(state) {
	localStorage.setItem('clearData', JSON.stringify(state.save));
}

class Reducers {
	static changeCheckedState(state, action) {
		let newSave = { ...state.save };
		if (!(action.tune in newSave)) {
			newSave[action.tune] = {};
		}
		let checks = { ... newSave[action.tune] };
		if (action.checked) {
			checks[action.difficulty] = true;
		} else {
			delete checks[action.difficulty];
		}
		newSave[action.tune] = checks;
		if (Object.keys(checks).length === 0) {
			delete newSave[action.tune];
		}
		let newState = { ...state, ...{ save: newSave } };
		saveState(newState);
		return newState;
	}

	static registerTunes(state, action) {
		let newState = { ...state, ...{ tunes: action.tunes } };
		makeFilteredTunes(newState);
		return newState;
	}

	static exportData(state, action) {
		return {
			...state,
			...{ exportDialogContent: btoa(JSON.stringify(state.save)) }
		};
	}

	static hideExportDialog(state, action) {
		let newState = { ...state };
		delete newState.exportDialogContent;
		return newState;
	}

	static showImportDialog(state, action) {
		return { ...state, ...{ importDialogShowing: true } };
	}

	static commitImportData(state, action) {
		if (typeof action.encoded === 'string' && action.encoded.length > 0) {
			try {
				let newSave = JSON.parse(atob(action.encoded));
				let newState = { ...state, ...{ importDialogShowing: false, save: newSave }};
				saveState(newState);
				return newState;
			} catch (err) {
				alert('無効なデータです。');
				return state;
			}
		}
		return { ...state, ...{ importDialogShowing: false } };
	}

	static initialize(state, action) {
		let newState = { ...state, ...{ save: {} } };
		saveState(newState);
		return newState;
	}

	static changeFilter(state, action) {
		let newFilters = { ...state.activeFilters };
		newFilters[action.filter] = !!action.active;
		let newState = { ...state, ...{ activeFilters: newFilters } };
		makeFilteredTunes(newState);
		return newState;
	}

	static sort(state, action) {
		let newState = { ...state, ...{ sortOrder: action.order } };
		makeFilteredTunes(newState);
		return newState;
	}

	static showAttribute(state, action) {
		return { ...state, ...{ showingAttribute: action.attribute }};
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
		if (tmp !== null) {
			save = JSON.parse(tmp);
		}
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
		save: save
	};
}

export let store = createStore(reducer);
export let dispatch = store.dispatch;
