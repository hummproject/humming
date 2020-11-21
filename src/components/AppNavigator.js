import React from 'react';
import {AppRegistry} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';
import TabBar from '../TabBar';
import PostsComments from './PostsComments';
import PostUserProfile from './PostUserProfile';
import UserProfile from './Profile';
import ForgotPassword from './ForgotPassword';
// import ImageDetails from './ImageDetails';
import UserIntrests from './UserIntrests';

const Stack = createStackNavigator();
// const AuthStack = createStackNavigator();

// const AuthStackScreens = () => {
//   <AuthStack.Navigator>
//     <AuthStack.Screen name="login" component={Login} />
//     <AuthStack.Screen name="register" component={Register} />
//     <AuthStack.Screen name="forgotpassword" component={ForgotPassword} />
//   </AuthStack.Navigator>;
// };

// const MainStackScreens = () => {
//   <Stack.Navigator>
//     <Stack.Screen name="TabBar" component={TabBar} />
//     <Stack.Screen name="postscomments" component={PostsComments} />
//     <Stack.Screen name="postuserprofile" component={PostUserProfile} />
//     <Stack.Screen name="userprofile" component={UserProfile} />
//   </Stack.Navigator>;
// };

class AppNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initalScreen: props.initalScreen,
    };
  }

  render() {
    console.log('iNITAIL sCREEN', this.state.initalScreen);
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={this.state.initalScreen}>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Register} />
          <Stack.Screen name="userinterests" component={UserIntrests} />
          <Stack.Screen name="forgotpassword" component={ForgotPassword} />
          <Stack.Screen name="TabBar" component={TabBar} />
          <Stack.Screen name="postscomments" component={PostsComments} />
          <Stack.Screen name="postuserprofile" component={PostUserProfile} />
          <Stack.Screen name="userprofile" component={UserProfile} />
          {/* <Stack.Screen name="imagedetails" component={ImageDetails} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default AppNavigator;

AppRegistry.registerComponent('AppNavigator', () => AppNavigator);
