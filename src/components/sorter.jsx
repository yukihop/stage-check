import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { store } from '../store';

export let Sorter = props => {
	const orderList = {
		default: 'デフォルト',
		difficulty: '曲毎の最高難易度順',
		notes: 'ノート数多い順',
		title: 'タイトル順'
	};

	function sort(order) {
		store.dispatch({ type: 'sort', order });
	}

	return <span>
		&ensp;ソート
		<DropdownButton title={orderList[props.sortOrder]} bsSize="sm">
			{Object.keys(orderList).map(key => {
				let caption = orderList[key];
				return <MenuItem onClick={() => sort(key)}>{caption}</MenuItem>
			})}
		</DropdownButton>
	</span>;
}
