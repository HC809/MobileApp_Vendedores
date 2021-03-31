import React, {useEffect} from "react";
import { Provider } from "react-redux";

import AppConnected from "./AppConnected";
import cfgs from "./configureStore";
import { PersistGate } from "redux-persist/integration/react";

import { LogBox } from 'react-native';

const App = (): React.ReactFragment => {

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
}, [])

  return (
    <>
      <Provider store={cfgs.store}>
        <PersistGate loading={null} persistor={cfgs.persistor}>
          <AppConnected />
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
