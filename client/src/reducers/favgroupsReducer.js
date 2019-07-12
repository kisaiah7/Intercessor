import { FETCH_FAVGROUPS } from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_FAVGROUPS:
      return action.payload || false;
    default:
      return state;
  }
}
