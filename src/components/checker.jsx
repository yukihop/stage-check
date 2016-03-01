import React from 'react';
import { difficulty } from '../difficulty';
import { store } from '../store';

export let Checker = props => {
	let classes = ['checker', props.difficulty];
	if (props.checked) classes.push('checked');

	let onClick = () => {
		store.dispatch({
			type: 'changeCheckedState',
			tune: props.tune.id,
			difficulty: props.difficulty,
			checked: !props.checked
		});
	};

	let full = difficulty[props.difficulty][0];
	let short = difficulty[props.difficulty][1];

	let tmpDifficulty = props.difficulty === 'masplus' ? 'mplus' : props.difficulty;
	if (props.attribute === 'notes') {
		full = short = props.tune[tmpDifficulty + 'notes'];
		if (full == 0) full = short = '？';
	}
	if (props.attribute === 'level') {
		full = short = props.tune[tmpDifficulty + 'lv'];
		if (full == 0) full = short = '？';
	}

	return <span className={classes.join(' ')} onClick={onClick}>
		<span className="level-full">{full}</span>
		<span className="level-short">{short}</span>
	</span>;
}
