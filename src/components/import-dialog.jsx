import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import { dispatch } from '../store';

export class ImportDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { encoded: '' };
	}

	ok() {
		dispatch({ type: 'commitImportData', encoded: this.state.encoded });
	}

	cancel() {
		this.setState({ encoded: null });
		dispatch({ type: 'commitImportData', encoded: null });
	}

	render() {
		return <Modal show={this.props.show} onHide={this.cancel.bind(this)}
			onShow={() => this.setState({encoded: ''})}>
			<Modal.Header closeButton>インポート</Modal.Header>
			<Modal.Body>
				<p>エクスポートした文字列を入力してください。</p>
				<Input type="textarea" placeholder="セーブ" value={this.state.encoded}
					onChange={ev => this.setState({encoded: ev.target.value })}/>
			</Modal.Body>
			<Modal.Footer>
				<Button bsStyle="link" onClick={this.cancel.bind(this)}>
					キャンセル
				</Button>
				<Button onClick={this.ok.bind(this)}>OK</Button>
			</Modal.Footer>
		</Modal>;
	}
};
