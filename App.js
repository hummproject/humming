import React, {Component} from 'react';
import AppNavigator from './src/components/AppNavigator';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthProvider} from './src/AuthContext';
import SplashScreen from 'react-native-splash-screen';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      initalScreen: null,
    };
    this._setup();
  }

  _setup = async () => {
    SplashScreen.hide();
    // await AsyncStorage.getItem('userData').then(value => {
    //   const userData = JSON.parse(value);
    //   this.setState({
    //     userData: userData,
    //   });
    // });
    // if (this.state.userData === null) {
    //   this.setState({
    //     initalScreen: 'login',
    //   });
    // } else {
    //   this.setState({
    //     initalScreen: 'TabBar',
    //   });
    // }
  };

  render() {
    console.debug('Inside render', this.state.initalScreen);
    // if (this.state.initalScreen !== null) {
    //   return <AppNavigator initalScreen={this.state.initalScreen} />;
    // } else {
    //   return null;
    // }
    return (
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    );
  }
}
