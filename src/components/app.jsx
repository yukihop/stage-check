import React from 'react';
import { FilterSelector } from './filter-selector.jsx';
import { Sorter } from './sorter.jsx';
import { TuneTable } from './tunetable.jsx';
import { Summary } from './summary.jsx';
import { Toolbar } from './toolbar.jsx';
import { ExportDialog } from './export-dialog.jsx';
import Panel from 'react-bootstrap/lib/Panel';

export let App = props => {
	return <div className="container-fluid">
		<h1><span className="glyphicon glyphicon-ok" /> Cinderella Checker</h1>
		<div className="filter-bar">
			<FilterSelector activeFilters={props.activeFilters} tunes={props.tunes}/>
			<Sorter sortOrder={props.sortOrder}/>
		</div>
		{props.tunes.length > 0 ?
			<TuneTable tunes={props.filteredTunes} save={props.save} />
		:
			<Panel>楽曲一覧を読み込み中...</Panel>
		}
		<Summary tunes={props.filteredTunes} save={props.save} />
		<Toolbar />
		<Panel header="説明">
			<ul>
				<li>クリアチェック・フルコンチェックなどにご利用ください。</li>
				<li>最新のブラウザでご利用ください。古いIEなどでは一切動作確認していません。</li>
				<li>すべてのデータはこれを起動している<strong>ブラウザ自体にローカルに保存</strong>され、外部サーバには送信されません。データをバックアップ・転送したい場合はエクスポート機能をご利用ください。</li>
				<li>常に最新の曲リストを反映するとは限りません。</li>
				<li>ソースコードと改変履歴は<a href="https://github.com/yukihop/stage-check/commits/">こちら</a></li>
			</ul>
		</Panel>
		<ExportDialog encoded={props.exportDialogContent}
			show={typeof props.exportDialogContent === 'string'}/>
	</div>
};
