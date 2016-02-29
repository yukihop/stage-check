import React from 'react';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';
import { default as Glyph } from 'react-bootstrap/lib/Glyphicon';
import { store } from '../store';

export let Toolbar = props => {
	function exportData() {
		store.dispatch({ type: 'exportData' });
	}

	function importData() {
		store.dispatch({ type: 'importData' });
	}

	function initialize() {
		store.dispatch({ type: 'initialize' });
	}

	return <div className="toolbar">
		<Glyph glyph="wrench" /> ツール&ensp;
		<ButtonGroup bsSize="sm">
			<Button bsStyle="primary" onClick={exportData}>エクスポート</Button>
			<Button bsStyle="primary" onClick={importData}>インポート</Button>
		</ButtonGroup>
		&ensp;
		<Button bsSize="sm" bsStyle="danger" onClick={initialize}>
			<Glyph glyph="alert" /> 初期化
		</Button>
	</div>;
};
