import React from 'react';
import { ShrinkSelect } from './shrink-select.jsx';
import { store } from '../store';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

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
		<Glyphicon glyph="sort" />&ensp;
		<ShrinkSelect options={orderList} id="sorter"
			value={props.sortOrder} onChange={sort} />
	</span>;
}
