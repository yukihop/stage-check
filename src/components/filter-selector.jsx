import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import { default as Glyph } from 'react-bootstrap/lib/Glyphicon';
import { store } from '../store';

export let FilterSelector = props => {
	const categories = [
		{ id: 'normal', caption: '通常', glyph: '' },
		{ id: 'limited', caption: '限定', glyph: 'adjust' },
		{ id: 'event', caption: 'イベント', glyph: 'time' },
		{ id: 'oldevent', caption: '過去イベント', glyph: 'ban-circle' },
	];

	function clicked(id) {
		store.dispatch({ type: 'changeFilter', filter: id, active: !props.activeFilters[id] });
	}

	return <span>
		<Glyph glyph="filter" /> 表示&ensp;
		<ButtonGroup bsSize='sm'>
			{categories.map(cat => {
				let count = props.tunes.filter(tune => tune.category === cat.id).length;
				return <Button key={cat.id} active={!!props.activeFilters[cat.id]}
				onClick={clicked.bind(null, cat.id)}>
					{cat.caption}
					{cat.glyph ? <Glyph glyph={cat.glyph} /> : null}
					&ensp;({count})
				</Button>
			})}
		</ButtonGroup>
	</span>
}
