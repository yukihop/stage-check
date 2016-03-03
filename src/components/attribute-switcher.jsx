import React from 'react';
import { ShrinkSelect } from './shrink-select.jsx';
import { store } from '../store';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

export let AttributeSwitcher = props => {
	const options = {
		difficulty: '難易度',
		level: '楽曲レベル',
		notes: 'ノート数'
	};

	function switchAttribute(attribute) {
		store.dispatch({ type: 'showAttribute', attribute });
	}

	return <span>
		<Glyphicon glyph="eye-open" />&ensp;
		<ShrinkSelect options={options} id="attribute-switcher"
			value={props.attribute} onChange={switchAttribute} />
	</span>;
}
