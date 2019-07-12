import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import reduxThunk from "redux-thunk";
import storage from "redux-persist/lib/storage";

import reducers from "./reducers";

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default () => {
  const store = createStore(persistedReducer, {}, applyMiddleware(reduxThunk));
  let persistor = persistStore(store);
  return { store, persistor };
};
