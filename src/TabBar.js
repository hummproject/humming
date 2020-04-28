import 'react-native-gesture-handler';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    Image,
    BackHandler, 
    Alert
} from 'react-native';

import Home from './components/Home'
import Search from './components/Search'
import Upload from './components/Upload'
import Banter from './components/Banter'
import Profile from './components/Profile'

const Tab = createBottomTabNavigator();

export default class TabBar extends React.Component {
    constructor(props) {
        super(props);
        console.debug("Tabbar Props",this.props)
    }

    render() {
        // const { navigation, route } = this.props;
        return (
            <Tab.Navigator
                initialRouteName = 'Home'
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, tintColor }) => {
                        let iconName;
                        if (route.name === 'Home') {
                            iconName = focused
                                ? require('./images/TabBar/home-icon-active.png')
                                : require('./images/TabBar/home-icon-inactive.png')
                        } else if (route.name === 'search') {
                            iconName = focused
                                ? require('./images/TabBar/search-icon-active.png')
                                : require('./images/TabBar/search-icon-inactive.png')
                        } else if (route.name === 'Upload') {
                            iconName = focused
                                ? require('./images/TabBar/upload-icon-active.png')
                                : require('./images/TabBar/upload-icon-inactive.png')
                        } else if (route.name === 'Banter') {
                            iconName = focused
                                ? require('./images/TabBar/banter-icon-active.png')
                                : require('./images/TabBar/banter-icon-inactive.png')
                        } else if (route.name === 'Profile') {
                            iconName = focused
                                ? require('./images/TabBar/profile-icon-active.png')
                                : require('./images/TabBar/profile-icon-inactive.png')
                        }
                        // You can return any component that you like here!
                        return (
                            <Image
                                style={{
                                    width: 25, height: 25
                                }}
                                source={iconName} resizeMode = {'contain'}/>
                        );
                    },
                })}
                // tabBarOptions={{
                //     activeTintColor: '#8B0000',
                //     inactiveTintColor: '#D3D3D3',
                // }}
                tabBarOptions={{
                    showLabel: false
                }}
            >
                <Tab.Screen name="Home"  component={Home} />
                <Tab.Screen name="search" component={Search} />
                <Tab.Screen name="Upload" component={Upload} />
                <Tab.Screen name="Banter" component={Banter} />
                <Tab.Screen name="Profile" component={Profile} />
            </Tab.Navigator>
        );
    };
}