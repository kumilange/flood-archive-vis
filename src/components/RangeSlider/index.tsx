import React, {
	useEffect,
	useState,
	Dispatch,
	SetStateAction,
	useRef,
} from 'react';
import { Slider, Button } from 'antd';
import CaretRightOutlined from '@ant-design/icons/CaretRightOutlined';
import PauseOutlined from '@ant-design/icons/PauseOutlined';
import './ant-slider.scss';
import styles from './RangeSlider.module.scss';

const MS_PER_DAY = 8.64e7;
const ANIMATION_SPEED = MS_PER_DAY * 10;
const getIconColor = (isEnabled: boolean) =>
	isEnabled ? '#08519c' : 'rgba(0, 0, 0, 0.26)';

export default function RangeSlider({
	min,
	max,
	value,
	onChange,
	formatLabel,
}: {
	min: number;
	max: number;
	value: [start: number, end: number];
	onChange: Dispatch<SetStateAction<[start: number, end: number] | undefined>>;
	formatLabel: (value: number) => string;
}) {
	const animationIdRef = useRef<number>();
	const [isPlaying, setIsPlaying] = useState(false);
	const isButtonEnabled = value[0] > min || value[1] < max;
	const iconProps = {
		style: { color: getIconColor(isButtonEnabled), fontSize: '30px' },
	};

	useEffect(() => {
		if (isPlaying) {
			const span = value[1] - value[0];
			let nextValueMin = value[0] + ANIMATION_SPEED;

			if (nextValueMin + span >= max) {
				nextValueMin = min;
			}

			animationIdRef.current = requestAnimationFrame(() => {
				animationIdRef.current = 0;
				onChange([nextValueMin, nextValueMin + span]);
			});
		}

		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}
		};
	}, [isPlaying, value, min, max, onChange]);

	return (
		<>
			<Button
				color="primary"
				shape="circle"
				disabled={!isButtonEnabled}
				onClick={() => setIsPlaying(!isPlaying)}
				title={isPlaying ? 'Stop' : 'Animate'}
				icon={
					isPlaying ? (
						<PauseOutlined {...iconProps} />
					) : (
						<CaretRightOutlined {...iconProps} />
					)
				}
			/>
			<div className={styles.wrapper}>
				<Slider
					min={min}
					max={max}
					value={value}
					range={{ draggableTrack: true }}
					tooltip={{ open: false }}
					onChange={(newValue: number[]) =>
						onChange(newValue as [number, number])
					}
					marks={{
						[value[0]]: formatLabel(value[0]),
						[value[1]]: formatLabel(value[1]),
					}}
				/>
			</div>
		</>
	);
}
