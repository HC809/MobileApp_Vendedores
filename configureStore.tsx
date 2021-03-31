import { createStore, applyMiddleware } from "redux";
import Reducers from "./store/reducers";
import thunk from "redux-thunk";
//import { composeWithDevTools } from "redux-devtools-extension";
import { composeWithDevTools } from "remote-redux-devtools";

import { persistStore } from "redux-persist";

const composeEnhancers = composeWithDevTools({
  realtime: true,
  port: 8000,
  hostname: "192.168.0.10", //add your computer's IP
});

const store = createStore(Reducers, composeEnhancers(applyMiddleware(thunk)));
const persistor = persistStore(store);

export default { store, persistor };
