import React, { Component } from 'react';
// import SplashScreen from 'react-native-splash-screen'
import AppNavigator from './src/components/AppNavigator'
import AsyncStorage from '@react-native-community/async-storage';
// import { cos } from 'react-native-reanimated';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      initalScreen: null
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("userData").then(value => {
      const userData = JSON.parse(value);
      this.setState({
        userData: userData
      });
    });
    // console.debug('User Data:', this.state.userData)
    if (this.state.userData === null) {
      this.setState({
        initalScreen: 'login'
      })
    } else {
      this.setState({
        initalScreen: 'TabBar'
      })
    }
  }

  render() {
    console.debug("Inside render", this.state.initalScreen)
    if (this.state.initalScreen !== null) {
      return <AppNavigator initalScreen={this.state.initalScreen} />
    } else {
      return null
    }
  };
}

// function App() {

//   const [userData, setUserData] = useState({});
//   const [initalScreen, setInitalScreen] = useState('');

//   async function fetchUserData() {
//     // await AsyncStorage.getItem("userData").then(value => {
//     //   const userData = JSON.parse(value);
//     //   setUserData(userData)
//     // });

//     try {
//       let value = await AsyncStorage.getItem("userData");
//       const userData = JSON.parse(value);
//       if (userData == null) {
//         //If value is not set or your async storage is empty
//         setInitalScreen('login')
//         setUserData(userData)
//       }
//       else {
//         //Process your data 
//         setInitalScreen('TabBar')
//         setUserData(userData)
//       }
//     }
//     catch (error) {
//       // Error retrieving data
//       setInitalScreen('login')
//       setUserData(userData)
//     }
//     console.debug("state data 1", userData)
//     // if (Object.keys(userData).length === 0) {

//     //   console.debug("if login")
//     // } else {
//     //   setInitalScreen('TabBar')
//     //   console.debug("else TabBar")
//     // }
//     console.debug("state data 1:initial screen", initalScreen)
//   }

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   return (
//     <AppNavigator initalScreen={initalScreen} /> // 
//   );
// }

// export default App;