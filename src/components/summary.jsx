import React from 'react';
import { difficulty, difficultyOrder } from '../difficulty';
import Well from 'react-bootstrap/lib/Well';

export let Summary = props => {
	let items = difficultyOrder.map(dif => {
		let difStr = difficulty[dif][1];
		let checked = props.tunes.filter(
			tune => props.save[tune.id] && props.save[tune.id][dif]
		).length;
		let checkable = props.tunes.length;
		return `${difStr} ${checked}/${checkable}`;
	});

	return <Well className="summary" bsSize="sm">
		{items.join('; ')}
	</Well>;
};
