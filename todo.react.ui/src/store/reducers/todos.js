import { TODO_ADD, TODO_DELETE, TODO_GET, TODO_LIST, TODO_UPDATE } from "../actions/types";

const INITIAL_STATE = {
  errorMessage: '',
  items: [],
  selectedItem: null
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TODO_ADD:
      break;

    case TODO_GET:
      return {
        ...state,
        items: [...state.items],
        selectedItem: action.payload
      }

    case TODO_UPDATE:
      return {
        ...state,
        items: [...state.items],
        selectedItem: action.payload
      }

    case TODO_DELETE:
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload.id)
      }
      break;

    case TODO_LIST:
      return {
        ...state,
        errorMessage: '',
        items: [
          ...action.payload
        ]
      }

    default:
      return state;
  }
}