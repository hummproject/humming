import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './src/components/Login';
import Register from './src/components/Register';
import Profile from './src/components/Profile';
import TabBar from './src/TabBar';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="TabBar">
        {/* <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="register" component={Register} /> */}
        <Stack.Screen name="TabBar" component={TabBar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;