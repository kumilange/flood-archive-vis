import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import Map, { AttributionControl } from 'react-map-gl/maplibre';
import { MapView } from '@deck.gl/core/typed';
import DeckGL from '@deck.gl/react/typed';
import { _GeoJSONLoader as GeoJSONLoader } from '@loaders.gl/json';
import { load } from '@loaders.gl/core';
import type { Geometry, GeoJsonProperties } from 'geojson';
import {
	formatLabel,
	generateGeojsonLayer,
	getCursor,
	getTimeRange,
	getTooltip,
} from './utils';
import RangeSlider from './components/RangeSlider';
import Legend from './components/Legend';
import AreaDropDown from './components/AreaSelect';
import { useAtomValue } from 'jotai';
import { initialViewAtom } from './atoms';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles/reset.css';
import './styles/index.css';
import './styles/maplibregl.css';
import styles from './App.module.scss';

const MAP_STYLE =
	'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const MAP_VIEW = new MapView({
	repeat: true,
	farZMultiplier: 100,
});
const DATA_URL =
	'https://kumilange.github.io/data-store/flood/floodArchive.geojson';

export default function App({
	data,
}: {
	data?: GeoJSON.FeatureCollection<Geometry, GeoJsonProperties>;
}) {
	const viewAtom = useAtomValue(initialViewAtom);
	const [filter, setFilter] = useState<[start: number, end: number]>();
	const timeRange = useMemo(() => getTimeRange(data?.features), [data]);
	const filterValue = filter || timeRange;
	const layers = useMemo(
		() => [data && generateGeojsonLayer({ data, filterValue })],
		[data, filterValue],
	);

	return (
		<main>
			<div className={styles.wrapper}>
				<h1 className={styles.heading}>
					Global Active Archive of Large Flood Events, 1985-2021
				</h1>
				<AreaDropDown />
			</div>
			<DeckGL
				views={[MAP_VIEW]}
				layers={layers}
				initialViewState={viewAtom}
				controller={true}
				getTooltip={getTooltip}
				getCursor={getCursor}
			>
				<Map reuseMaps mapStyle={MAP_STYLE} attributionControl={false}>
					<AttributionControl customAttribution="G.R. Brakenridge. Global Active Archive of Large Flood Events. Dartmouth Flood Observatory, University of Colorado, USA." />
				</Map>
			</DeckGL>
			<Legend />
			{timeRange && (
				<div className={styles.slider}>
					<RangeSlider
						min={timeRange[0]}
						max={timeRange[1]}
						value={filterValue}
						formatLabel={formatLabel}
						onChange={setFilter}
					/>
				</div>
			)}
		</main>
	);
}

export async function renderToDOM(container: HTMLDivElement) {
	const root = createRoot(container);
	const geojson = await load(DATA_URL, GeoJSONLoader);

	root.render(<App data={geojson} />);
}
