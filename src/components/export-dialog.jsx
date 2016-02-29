import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Input from 'react-bootstrap/lib/Input';
import { store } from '../store';

export let ExportDialog = props => {
	function hide() {
		store.dispatch({ type: 'hideExportDialog' });
	}

	function select(ev) {
		ev.target.select();
	}

	return <Modal show={props.show} onHide={hide}>
		<Modal.Header closeButton>エクスポート</Modal.Header>
		<Modal.Body>
			<p>以下の文字列をコピーすれば、データのバックアップや他のマシンへの転送が可能です。</p>
			<Input type="textarea" value={props.encoded} onFocus={select}/>
		</Modal.Body>
	</Modal>
};
