import React from 'react';
import { difficulty, difficultyOrder } from '../difficulty';
import Well from 'react-bootstrap/lib/Well';

export let Summary = props => {
	let totalCheckable = 0;
	let totalChecked = 0;

	let items = difficultyOrder.map(dif => {
		let difStr = difficulty[dif][1];
		let checked = props.tunes.filter(
			tune => props.save[tune.id] && props.save[tune.id][dif]
		).length;
		totalChecked += checked;
		let checkable = props.tunes.length;
		totalCheckable += checkable;
		return `${difStr} ${checked}/${checkable}`;
	});

	items.push(`Total ${totalChecked}/${totalCheckable}`);

	return <Well className="summary" bsSize="sm">
		{items.join('; ')}
	</Well>;
};
