import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen'
import AppNavigator from './src/components/AppNavigator'
import { create } from 'react-test-renderer';

function App() {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <AppNavigator />
  );
}

export default App;