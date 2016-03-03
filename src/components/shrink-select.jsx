import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

export let ShrinkSelect = props => {
	function select(key) {
		if (props.onChange instanceof Function) {
			props.onChange(key);
		}
	}

	return <DropdownButton title={props.options[props.value]} bsSize="sm" id={props.id}>
		{Object.keys(props.options).map(key => (
			<MenuItem key={key} onClick={() => select(key)}>
				{props.value === key ? <Glyphicon glyph="play" /> : null}
				{props.options[key]}
			</MenuItem>
		))}
	</DropdownButton>;
}
