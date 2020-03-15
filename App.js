import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import SplashScreen from 'react-native-splash-screen'
import AppNavigator from './src/components/AppNavigator'

// import Login from './src/components/Login';
// import Register from './src/components/Register';
// import TabBar from './src/TabBar';
// import PostsComments from './src/components/PostsComments'


// const Stack = createStackNavigator();

function App() {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator headerMode="none" initialRouteName="login">
    //     <Stack.Screen name="login" component={Login} />
    //     <Stack.Screen name="register" component={Register} />
    //     <Stack.Screen name="TabBar" component={TabBar} />
    //     <Stack.Screen name="postscomments" component={PostsComments} />
    //   </Stack.Navigator>
    // </NavigationContainer>

    <AppNavigator />
  );
}

export default App;