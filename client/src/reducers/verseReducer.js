import { FETCH_VERSE } from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_VERSE:
      return action.payload || false;
    default:
      return state;
  }
}
