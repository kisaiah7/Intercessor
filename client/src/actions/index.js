import axios from "axios";
import {
  FETCH_USER,
  FETCH_GROUPS,
  FETCH_FAVGROUPS,
  FETCH_VERSE
} from "./types";

export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchGroups = group_acronyms => async dispatch => {
  const res = await axios.post("/api/listed_group_details", { group_acronyms });
  dispatch({ type: FETCH_GROUPS, payload: res.data.groups });
};

export const fetchFavGroups = group_acronyms => async dispatch => {
  const res = await axios.post("/api/listed_group_details", { group_acronyms });
  dispatch({ type: FETCH_FAVGROUPS, payload: res.data.groups });
};

export const fetchVerse = () => async dispatch => {
  const res = await axios.get("/api/get_verse");
  dispatch({ type: FETCH_VERSE, payload: res.data });
};
