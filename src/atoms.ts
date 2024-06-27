import { atom } from 'jotai';
import { AREAS } from './constants';

const INITIAL_VIEW_STATE = {
	longitude: 0.0098,
	latitude: 20.4934,
	zoom: 2,
};

type ViewStateType = {
	longitude: number;
	latitude: number;
	zoom: number;
	transitionInterpolator?: any;
	transitionDuration?: string;
};

export const initialViewAtom = atom<ViewStateType>(INITIAL_VIEW_STATE);
export const initialBoundsAtom = atom(AREAS.all.boundary);
