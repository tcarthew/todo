import {
  LOADED,
  NOT_LOADED
} from './types';

export const loaded = () => ({ type: LOADED });

export const notLoaded = () => ({ type: NOT_LOADED });
