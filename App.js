import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, YellowBox } from 'react-native';
import * as Sentry from 'sentry-expo';
import { Ionicons } from '@expo/vector-icons';
import NavigationService from './NavigationService.js';

import AppNavigator from './src/navigation/AppNavigator';

export default function App(props) {
  console.ignoredYellowBox = ['Remote debugger'];
  console.ignoredYellowBox = true;
  console.disableYellowBox = true;

  YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, ' +
      '`cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
  ]);

  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  }
  return (
    <View style={styles.container}>
      {Platform.OS == 'ios' && <StatusBar barStyle="default" />}
      <AppNavigator
        ref={(navigatoRef) => {
          NavigationService.setTopLevelNavigator(navigatoRef);
        }}
      />
    </View>
  );
}

// Sentry.init({
//   dsn: 'https://2679a5d414c3489b921ec4f0d2e28f55@sentry.io/1774707',
//   enableInExpoDevelopment: true,
//   debug: true,
// });

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      ...Ionicons.font,
      muli: require('./assets/fonts/Muli-Regular.ttf'),
      muliBold: require('./assets/fonts/Muli-Bold.ttf'),
      muliSemiBold: require('./assets/fonts/Muli-SemiBold.ttf'),
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
