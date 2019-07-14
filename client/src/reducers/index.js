import { combineReducers } from "redux";
import authReducer from "./authReducer";
import groupsReducer from "./groupsReducer";
import favgroupsReducer from "./favgroupsReducer";
import verseReducer from "./verseReducer";

export default combineReducers({
  auth: authReducer,
  groups: groupsReducer,
  fav: favgroupsReducer,
  verse: verseReducer
});
