import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './src/components/Login';
import Register from './src/components/Register';
import Profile from './src/components/Profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Profile} />
        <Tab.Screen name="Search" component={Login} />
        <Tab.Screen name="Upload" component={Profile} />
        <Tab.Screen name="Banter" component={Profile} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    )
  }
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="login">
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

// Functional Component
// function HomeScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}></TextInput>
//       <Button title="show">Hello</Button>
//     </View>
//   );
// }