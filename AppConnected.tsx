import React from "react";
import {ApplicationProvider, IconRegistry} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { mapping, light, dark } from "@eva-design/eva";
import  AppNavigator  from "./navigation/Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {connect} from 'react-redux';
import { THEME_LIGHT } from "./constants/Constants";
import { default as customtheme } from './customtheme.json';

const AppConnected = ({ theme }) => {

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={theme === THEME_LIGHT ? {...light,...customtheme} : {...dark,...customtheme}}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </ApplicationProvider>
    </>
  );
};

const mapStateToProps = state => state.theme;

export default connect(mapStateToProps, null)(AppConnected);