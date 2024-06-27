import { Color, PickingInfo } from '@deck.gl/core/typed';
import { GeoJsonLayer } from '@deck.gl/layers/typed';
import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { COLOR, DATA_FILTER } from './constants';

export const COLOR_RANGE = [
	[239, 243, 255],
	[198, 219, 239],
	[158, 202, 225],
	[107, 174, 214],
	[49, 130, 189],
	[8, 81, 156],
];
export function getTimeRange(
	features?: Feature<Geometry, GeoJsonProperties>[],
): [number, number] {
	if (!features) {
		return [0, 0];
	}

	return features.reduce(
		(range, f) => {
			const t = f?.properties?.timestamp;
			range[0] = Math.min(range[0], t);
			range[1] = Math.max(range[1], t);
			return range;
		},
		[Infinity, -Infinity],
	);
}

export function getTooltip({ object }: PickingInfo) {
	if (!object) return null;
	const {
		properties: { Dead, Area, Country, timestamp },
	} = object;

	return {
		text: `\
	  Country: ${Country}
		Date: ${formatLabel(timestamp)}
    Death: ${Dead}
    Area: ${Area} sq km
    `,
		style: {
			zIndex: '2',
			backgroundColor: 'white',
			color: `#${COLOR.primary}`,
			border: `2px solid #${COLOR.primary}`,
			borderRadius: '4px',
		},
	};
}

export function getCursor({ isHovering }: { isHovering: boolean }) {
	return isHovering ? 'pointer' : 'default';
}

export function formatLabel(timestamp: number) {
	return new Date(timestamp).toLocaleDateString('en-US', {
		timeZone: 'utc',
		year: 'numeric',
		month: '2-digit',
	});
}

type PropertiesType = {
	ID: number;
	Country: string;
	Area: number;
	Began: string;
	Ended: string;
	Date: number;
	Dead: number;
	Displaced: number;
	MainCause: string;
	timestamp: number;
};
function generateFillColor(f: Feature<Geometry, GeoJsonProperties>) {
	const deathToll = f.properties?.Dead;
	let index = 0;

	switch (true) {
		case deathToll > 0 && deathToll <= 10:
			index = 1;
			break;
		case deathToll > 10 && deathToll <= 50:
			index = 2;
			break;
		case deathToll > 50 && deathToll <= 100:
			index = 3;
			break;
		case deathToll > 100 && deathToll <= 1000:
			index = 4;
			break;
		case deathToll > 1000:
			index = 5;
			break;
	}
	return COLOR_RANGE[index] as Color;
}
export function generateGeojsonLayer({
	data,
	filterValue,
}: {
	data: GeoJSON.FeatureCollection<Geometry, GeoJsonProperties>;
	filterValue: [number, number];
}) {
	return new GeoJsonLayer<PropertiesType>({
		id: 'floods',
		data: data,
		filled: true,
		pickable: true,
		getFillColor: (f: Feature<Geometry, GeoJsonProperties>) =>
			generateFillColor(f),
		getPointRadius: (f: Feature<Geometry, GeoJsonProperties>) =>
			Math.sqrt(f.properties?.Area) * 100,
		// @ts-expect-error: Deck.gl is missing a type for GeoJsonLayer's getFilterValue
		getFilterValue: (f: Feature<Geometry, GeoJsonProperties>) =>
			f.properties?.timestamp,
		filterRange: [filterValue[0], filterValue[1]],
		filterSoftRange: [
			filterValue[0] * 0.9 + filterValue[1] * 0.1,
			filterValue[0] * 0.1 + filterValue[1] * 0.9,
		],
		extensions: [DATA_FILTER],
	});
}
