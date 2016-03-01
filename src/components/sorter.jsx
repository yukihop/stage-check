import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { store } from '../store';

export let Sorter = props => {
	const orderList = {
		default: 'デフォルト',
		level: '最高難易度譜面の楽曲レベル順',
		notes: '最高難易度譜面のノート数多い順',
		unlock: '登場日時順',
		title: 'タイトル順'
	};

	function sort(order) {
		store.dispatch({ type: 'sort', order });
	}

	return <span>
		&ensp;ソート
		<DropdownButton title={orderList[props.sortOrder]} bsSize="sm" id="sorter">
			{Object.keys(orderList).map(key => {
				let caption = orderList[key];
				return <MenuItem key={key} onClick={() => sort(key)}>{caption}</MenuItem>
			})}
		</DropdownButton>
	</span>;
}
