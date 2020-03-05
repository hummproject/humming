/**
 * @format
 */
// import 'react-native-gesture-handler'; should be at top only;
import 'react-native-gesture-handler';

// To remove warning box in android emulator
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
