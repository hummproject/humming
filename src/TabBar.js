import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';

import Home from './components/Home';
import Search from './components/Search';
import Upload from './components/Upload';
import Banter from './components/Banter';
// import Notifications from './components/Notifications';
import Profile from './components/Profile';

const Tab = createBottomTabNavigator();

export default class TabBar extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //     routeName: null
    // }
    // console.debug("Tabbar Props", this.props)
    // console.debug("Tabbar Props: Route", this.props.route.params)
  }

  componentDidMount() {
    // console.debug("TabBar Props: route: Did Mount", this.props.route.params);
    // var route = 'Home'
    // if (this.props.route.params) {
    //     route = this.props.route.params.routeName
    // }
    // this.setState({
    //     routeName: route
    // })
    // this._unsubscribe = this.props.navigation.addListener('focus', () => {
    //     // do something
    //     console.debug("TabBar Props: route: Did Mount: didfocus", this.props.route.params);
    //     console.debug("TabBar Props: route: Did Mount: didfocus: state", this.state.routeName);
    //     var route = 'Home'
    //     if (this.props.route.params) {
    //         route = this.props.route.params.routeName
    //     }
    //     this.setState({
    //         routeName: route
    //     })
    // });
  }

  componentWillUnmount() {
    // this._unsubscribe();
  }

  render() {
    // const { routeName } = this.state;
    // console.debug("Inital Route name in render: Tabbar:", routeName)
    return (
      <Tab.Navigator
        initialRouteName={'Home'}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, tintColor}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? require('./images/TabBar/home-icon-active.png')
                : require('./images/TabBar/home-icon-inactive.png');
            } else if (route.name === 'search') {
              iconName = focused
                ? require('./images/TabBar/search-icon-active.png')
                : require('./images/TabBar/search-icon-inactive.png');
            } else if (route.name === 'Upload') {
              iconName = focused
                ? require('./images/TabBar/upload-icon-active.png')
                : require('./images/TabBar/upload-icon-inactive.png');
            } else if (route.name === 'Banter') {
              iconName = focused
                ? require('./images/TabBar/banter-icon-active.png')
                : require('./images/TabBar/banter-icon-inactive.png');
            } else if (route.name === 'Profile') {
              iconName = focused
                ? require('./images/TabBar/profile-icon-active.png')
                : require('./images/TabBar/profile-icon-inactive.png');
            }
            // You can return any component that you like here!
            return (
              <Image
                style={{
                  width: 25,
                  height: 25,
                }}
                source={iconName}
                resizeMode={'contain'}
              />
            );
          },
        })}
        // tabBarOptions={{
        //     activeTintColor: '#8B0000',
        //     inactiveTintColor: '#D3D3D3',
        // }}
        tabBarOptions={{
          showLabel: false,
        }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="search" component={Search} />
        <Tab.Screen name="Upload" component={Upload} />
        <Tab.Screen name="Banter" component={Banter} />
        <Tab.Screen name="Profile" component={Profile} />
        {/* <Tab.Screen name="Notifications" component={Notifications} /> */}
      </Tab.Navigator>
    );
  }
}
