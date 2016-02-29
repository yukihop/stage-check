import React from 'react';
import { difficulty } from '../difficulty';
import { store } from '../store';

export let Checker = props => {
	let classes = ['checker', props.difficulty];
	if (props.checked) classes.push('checked');

	let onClick = () => {
		store.dispatch({
			type: 'changeCheckedState',
			tune: props.tune,
			difficulty: props.difficulty,
			checked: !props.checked
		});
	};

	return <span className={classes.join(' ')} onClick={onClick}>
		<span className="level-full">{difficulty[props.difficulty][0]}</span>
		<span className="level-short">{difficulty[props.difficulty][1]}</span>
	</span>;
}
