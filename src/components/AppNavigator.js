import React, {useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
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
import AsyncStorage from '@react-native-community/async-storage';
import {useAuthState, useAuthDispatch} from '../AuthContext';
import {AppStyle} from '../App.style';

const AuthStack = createStackNavigator();
const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="login" component={Login} />
      <AuthStack.Screen name="register" component={Register} />
      <AuthStack.Screen name="forgotpassword" component={ForgotPassword} />
      <AuthStack.Screen name="userinterests" component={UserIntrests} />
    </AuthStack.Navigator>
  );
};

const MainStack = createStackNavigator();
const MainStackScreen = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <MainStack.Screen name="TabBar" component={TabBar} />
      <MainStack.Screen name="postscomments" component={PostsComments} />
      <MainStack.Screen name="postuserprofile" component={PostUserProfile} />
      <MainStack.Screen name="userprofile" component={UserProfile} />
      <MainStack.Screen name="userinterest" component={UserIntrests} />
    </MainStack.Navigator>
  );
};

const AppNavigator = () => {
  const {isLoading, isSignout, userToken} = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    setTimeout(() => {
      const bootstrapAsync = async () => {
        let token = null;
        try {
          let value = await AsyncStorage.getItem('userData'); // checking Token fetched from AsyncData
          let userData = JSON.parse(value);
          token = userData == null ? null : userData.token;
        } catch (error) {
          console.log('error', error);
        }
        dispatch({type: 'RESTORE_TOKEN', token});
      };
      bootstrapAsync();
    }, 2000);
  }, [dispatch]);

  return (
    <NavigationContainer>
      {// We haven't finished checking for the token yet
      isLoading === true ? (
        <ActivityIndicator
          animating={true}
          style={AppStyle.activityIndicator}
          size="large"
        />
      ) : userToken === null ? (
        // No token found, user isn't signed in
        <AuthStackScreen />
      ) : (
        // User is signed in
        <MainStackScreen />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
