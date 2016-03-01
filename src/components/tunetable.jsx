import React from 'react';
import { difficulty, difficultyOrder } from '../difficulty';
import { Checker } from './checker.jsx';

let CheckerArray = props => (
	<span>
		{props.difficulties.map(dif => (
			<Checker key={dif} attribute={props.attribute}
			tune={props.tune} difficulty={dif} checked={props.checkedData[dif]} />
		))}
	</span>
);

export let TuneTable = props => (
	<table className="tune-table"><tbody>
		{props.tunes.map(tune => {
			let difficulties = ['debut', 'regular', 'pro', 'master'];
			if (tune.master_plus) difficulties.push('masplus');
			return <tr className={[tune.type, tune.category].join(' ')} key={tune.id}>
				<th>{tune.title}</th>
				<td className="checkers">
					<CheckerArray
						tune={tune}
						attribute={props.attribute}
						checkedData={props.save[tune.id] ? props.save[tune.id] : {}}
						difficulties={difficulties} />
				</td>
			</tr>;
		})}
		{props.tunes.length > 0 ? null :
			<tr><td>表示する楽曲がありません</td></tr>
		}
	</tbody></table>
);
