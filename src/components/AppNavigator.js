import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';
import TabBar from '../TabBar';
import PostsComments from './PostsComments'

const Stack = createStackNavigator()

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
            screenOptions={{
                headerShown: false
              }}
            >
                <Stack.Screen name='login' component={Login} />
                <Stack.Screen name='register' component={Register} />
                <Stack.Screen name='TabBar' component={TabBar} />
                <Stack.Screen name='postscomments' component={PostsComments} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator