import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';
import TabBar from '../TabBar';
import PostsComments from './PostsComments'
import PostUserProfile from './PostUserProfile'
import ForgotPassword from './ForgotPassword'

const Stack = createStackNavigator()

function AppNavigator(props) {
    console.debug("Props im Navigator",props.initalScreen)
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={props.initalScreen}
            >
                <Stack.Screen name='login' component={Login} />
                <Stack.Screen name='register' component={Register} />
                <Stack.Screen name='forgotpassword' component={ForgotPassword} />
                <Stack.Screen name='TabBar' component={TabBar} />
                <Stack.Screen name='postscomments' component={PostsComments} />
                <Stack.Screen name='postuserprofile' component={PostUserProfile} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator