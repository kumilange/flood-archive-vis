import React from 'react';
import styles from './Legend.module.scss';
import { COLOR_RANGE } from '../../utils';

const LABEL = ['0', '1 - 10', '11 - 50', '51 - 100', '101 - 1000', '1001+'];

export default function Legend() {
	return (
		<div className={styles.legend}>
			<span className={styles.title}>Death Toll</span>
			{LABEL.map((label, index) => (
				<div key={label} className={styles.item}>
					<span
						style={{
							backgroundColor: `rgb(${COLOR_RANGE[index][0]}, ${COLOR_RANGE[index][1]}, ${COLOR_RANGE[index][2]})`,
						}}
						className={styles.color}
					></span>
					<span className={styles.label}>{label}</span>
				</div>
			))}
		</div>
	);
}
