import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
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
		<DropdownButton title={options[props.attribute]} bsSize="sm" id="attribute-switcher">
			{Object.keys(options).map(key => {
				let caption = options[key];
				return <MenuItem key={key} onClick={() => switchAttribute(key)}>{caption}</MenuItem>
			})}
		</DropdownButton>
	</span>;
}
