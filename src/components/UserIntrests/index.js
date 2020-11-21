import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  BackHandler,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AppStyle} from '../../App.style';
import {RegisterUser} from '../Register/Register.service';
import AppConfig from '../../config/constants';
import {
  ButtonGradientColor1,
  ButtonGradientColor2,
} from '../../config/constants';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-easy-toast';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import {StackActions, NavigationActions} from 'react-navigation';
import {FlatList} from 'react-native-gesture-handler';

export default class UserIntrests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      userData: {},
      is_connected: false,
      showiosBackButton: false,
      interestsAry: [],
      interestsSelectedAry: [],
      registrationData: this.props.route.params.userData,
      isfromProfile: this.props.route.params.isfromProfile,
      error: null,
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      this.setState({
        userData: userData,
      });
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.netinfoSubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable) {
        this.setState({is_connected: true});
      } else {
        this.setState({is_connected: false});
      }
    });
    this.makeRequesttoFetchCategories();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.netinfoSubscribe();
  }

  handleBackButton = () => {
    if (this.state.isfromProfile) {
      this.props.navigation.goBack();
    } else {
      return true;
    }
  };

  saveIntrestsClicked() {
    const {interestsAry, isfromProfile} = this.state;
    let interestsSelectedAry = interestsAry.filter(function(e) {
      return e.isselected === true;
    });
    console.log('interestsSelectedAry ', interestsSelectedAry);
    console.log(
      'interestsSelectedAry ',
      '{' + interestsSelectedAry.map(e => e.id).join(',') + '}',
    );
    if (interestsSelectedAry.length === 0) {
      this.refs.toast.show('Please choose your interests');
      return;
    }
    if (interestsSelectedAry.length < 3) {
      this.refs.toast.show('Please choose atleast 3 interests');
      return;
    }
    this.setState({
      interestsSelectedAry: interestsSelectedAry,
      showLoader: true,
    });
    if (isfromProfile) {
      this.UpdateProfileInterests(interestsSelectedAry);
    } else {
      if (Platform.OS === 'ios') {
        this.fetchLocation();
      } else {
        this.requestLocationPermission();
      }
    }
  }

  makeRequesttoFetchCategories = () => {
    const {is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.GET_ALL_AVAILABLE_CATEGORIES;
    this.setState({showLoader: true});
    if (!is_connected) {
      this.setState({
        showLoader: false,
      });
      this.refs.toast.show('Internet is not connected, Please try again!');
      return;
    }
    console.debug(url);
    fetch(url)
      .then(response => response.json())
      .then(responseData => {
        console.debug('Fetch Categories response:', responseData);
        this.setState({
          showLoader: false,
        });
        if (responseData.status === 200) {
          let categoriesAry = responseData.data;
          let userPreviousInterestsAry = this.state.userData.interests;
          for (var i = 0; i < categoriesAry.length; i++) {
            var obj1 = categoriesAry[i];
            obj1.isselected = false;
            for (var j = 0; j < userPreviousInterestsAry.length; j++) {
              var obj2 = userPreviousInterestsAry[j];
              if (obj1.id == obj2) {
                obj1.isselected = true;
              }
            }
            categoriesAry[i] = obj1;
          }
          console.log('Categories array modified', categoriesAry);
          this.setState({interestsAry: categoriesAry});
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Fetch Categories response ERROR:', error);
        this.setState({error, showLoader: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message:
            'This app requires access to your location to show you relevant posts based on location.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //To Check, If Permission is granted
        this.fetchLocation();
      } else {
        console.log('Location Permission Denied');
        this.callRegisterApi();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  fetchLocation() {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        console.log('GeoLocation Position:', position);
        this.callRegisterApi(position);
      },
      error => {
        this.callRegisterApi();
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  callRegisterApi(position) {
    const {interestsSelectedAry, is_connected} = this.state;
    var registrationData = this.state.registrationData;
    var locationData = position;
    var latlang = '0.000,0.000';
    if (locationData && locationData.coords) {
      var coords = locationData.coords;
      latlang = coords.latitude + ',' + coords.longitude;
    }

    registrationData.latlang = latlang;
    registrationData.interests =
      '{' + interestsSelectedAry.map(e => e.id).join(',') + '}';

    if (!is_connected) {
      this.setState({showLoader: false});
      this.refs.toast.show('Internet is not connected, Please try again!');
      return;
    }

    RegisterUser(registrationData)
      .then(res => {
        console.debug('Registration Response', res);
        if (res.status === 200) {
          const userData = res && res.data;
          AsyncStorage.setItem('userData', JSON.stringify(userData));
          let resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({routeName: 'TabBar'})],
          });
          this.props.navigation.dispatch(resetAction);
          this.props.navigation.navigate('TabBar');
          // this.props.navigation.navigate('TabBar', {userData: res.data});
        } else if (res.message === 'User already existed, please login.') {
          this.refs.toast.show('Username is already taken. Please try another');
        } else {
          this.refs.toast.show(res.message);
        }
        setTimeout(() => {
          this.setState({showLoader: false});
        }, 1000);
      })
      .catch(err => {
        console.debug('error', err);
        this.refs.toast.show('Something went wrong. Please try again later');
        setTimeout(() => {
          this.setState({showLoader: false});
        }, 1000);
      });
  }

  UpdateProfileInterests = interestsSelectedAry => {
    const requestData = new FormData();
    requestData.append(
      'interests',
      '{' + interestsSelectedAry.map(e => e.id).join(',') + '}',
    );
    const {userData, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.UPDATE_USER_PROFILE;
    console.debug('URL:', url);
    console.debug('Headers', {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      token: userData.token,
    });
    console.debug('Request', requestData);
    this.setState({showLoader: true});
    if (!is_connected) {
      this.setState({showLoader: false});
      this.refs.toast.show('Internet is not connected, Please try again!');
      return;
    }

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        token: userData.token,
      },
      body: requestData,
    })
      .then(res => res.json())
      .then(resJson => {
        console.debug('Update Interests response', resJson);
        this.setState({showLoader: false});
        if (resJson.status === 200) {
          var userdata = this.state.userData;
          userdata['userdp'] = resJson.data.userdp;
          userdata['usermobile'] = resJson.data.usermobile;
          userdata['userprofession'] = resJson.data.userprofession;
          userdata['useraddress'] = resJson.data.useraddress;
          userdata['userbio'] = resJson.data.userbio;
          userdata['followers'] = resJson.data.followers;
          userdata['following'] = resJson.data.following;
          userdata['interests'] = resJson.data.interests;
          AsyncStorage.setItem('userData', JSON.stringify(userdata));
          this.refs.toast.show('Interests updated successfully');
          this.props.navigation.goBack();
        } else {
          this.refs.toast.show(resJson.message);
        }
      })
      .catch(err => {
        console.debug('Update Interests response ERROR:', err);
        this.setState({error: err, showLoader: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  returnBack = () => {
    this.props.navigation.goBack();
  };

  interestItemSelected = item => {
    var selectedItem = item;
    var isselected = selectedItem.isselected;
    selectedItem.isselected = !isselected;
    var intrestsAry = this.state.interestsAry;
    var index = intrestsAry.indexOf(({id}) => id === selectedItem.id);
    intrestsAry[index] = selectedItem;
    this.setState({interestsAry: intrestsAry});
  };

  render() {
    return (
      <SafeAreaView style={AppStyle.login_appContainer}>
        {this.state.showiosBackButton ? (
          <TouchableOpacity
            onPress={this.returnBack}
            style={{
              padding: 8,
              marginLeft: 10,
              marginTop: 45,
              position: 'absolute',
              alignSelf: 'flex-start',
            }}>
            <Image
              source={require('../../images/back.png')}
              resizeMode={'contain'}
              style={{width: 13, height: 20, marginLeft: 10}}
            />
          </TouchableOpacity>
        ) : null}
        <Image
          style={AppStyle.Loginlogo}
          source={require('../../images/logo.png')}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
            marginTop: 40,
          }}>
          <Text
            style={[
              AppStyle.app_font_heading,
              AppStyle.dark_TextColor,
              {fontSize: 23, marginBottom: 5},
            ]}>
            Interests
          </Text>
          <Text
            style={[
              AppStyle.app_font_heading,
              AppStyle.light_blue_TextColor,
              {fontSize: 15, marginBottom: 20},
            ]}>
            Select minimum three interests
          </Text>
          <FlatList
            contentContainerStyle={{
              paddingBottom: 10,
              paddingRight: 10,
            }}
            numColumns={2}
            data={this.state.interestsAry}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({item}) => {
              if (item.isselected === false) {
                return (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#F2F2F2',
                      marginLeft: 10,
                      marginTop: 10,
                      height: 50,
                      borderRadius: 8,
                      width: (Dimensions.get('window').width - 70) / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={this.interestItemSelected.bind(this, item)}>
                    <Text
                      style={[
                        AppStyle.app_font,
                        AppStyle.light_TextColor,
                        {fontSize: 14},
                      ]}>
                      {item.catname}
                    </Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      marginTop: 10,
                      height: 50,
                      borderRadius: 8,
                      width: (Dimensions.get('window').width - 70) / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={this.interestItemSelected.bind(this, item)}>
                    <LinearGradient
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      colors={[ButtonGradientColor1, ButtonGradientColor2]}
                      style={{
                        height: 50,
                        borderRadius: 8,
                        width: (Dimensions.get('window').width - 70) / 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={[
                          AppStyle.app_font,
                          {fontSize: 14, color: '#FFFFFF'},
                        ]}>
                        {item.catname}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }
            }}
          />
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}>
          <TouchableOpacity onPress={() => this.saveIntrestsClicked()}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={[ButtonGradientColor1, ButtonGradientColor2]}
              style={AppStyle.appButton_background}>
              <Text style={AppStyle.appButton_Text}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {this.state.showLoader ? (
          <ActivityIndicator
            animating={true}
            style={AppStyle.activityIndicator}
            size="large"
          />
        ) : null}
        <Toast ref="toast" style={AppStyle.toast_style} />
      </SafeAreaView>
    );
  }
}
