import { LOADED, NOT_LOADED } from '../actions/types';

export default function(state = false, action){
  if (action.type === LOADED) {
    return true;
  }

  if (action.type === NOT_LOADED){
    return false;
  }

  return state;
}