import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  BackHandler,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AppStyle} from '../../App.style';
import {RegisterUser} from './Register.service';
import {
  ButtonGradientColor1,
  ButtonGradientColor2,
} from '../../config/constants';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-easy-toast';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import AppConfig from '../../config/constants';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      otp: '',
      password: '',
      confirmpassword: '',
      username: '',
      showLoader: false,
      showStepOne: true,
      showStepTwo: false,
      showStepThree: false,
      showVerifyOTP: false,
      is_connected: false,
      showiosBackButton: false,
      error: null,
    };
  }

  dismissKeyboard() {
    Keyboard.dismiss();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.netinfoSubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable) {
        this.setState({is_connected: true});
      } else {
        this.setState({is_connected: false});
      }
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.netinfoSubscribe();
  }

  validateEmail = text => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  handleBackButton = () => {
    const {showStepOne, showStepTwo, showStepThree, showVerifyOTP} = this.state;
    if (
      showStepOne === false &&
      showVerifyOTP === false &&
      showStepTwo === true
    ) {
      this.setState({
        showStepOne: false,
        showVerifyOTP: true,
        showStepTwo: false,
        showStepThree: false,
        password: '',
        confirmpassword: '',
      });
      console.debug('IF');
    } else if (
      showStepOne === false &&
      showVerifyOTP === true &&
      showStepTwo === false
    ) {
      this.setState({
        showStepOne: true,
        showStepTwo: false,
        showVerifyOTP: false,
        showStepThree: false,
        otp: '',
      });
      console.debug(' ELSE IF 1');
    } else if (
      showStepOne === false &&
      showStepTwo === false &&
      showStepThree === true
    ) {
      this.setState({
        showStepOne: false,
        showVerifyOTP: false,
        showStepTwo: true,
        showStepThree: false,
        username: '',
      });
      console.debug('ELSE IF 2');
    } else {
      console.debug('ELSE');
      this.props.navigation.goBack();
    }
    return true;
  };

  registerStepOne() {
    this.dismissKeyboard();

    var firstname = this.state.firstname;
    var lastname = this.state.lastname;
    var email = this.state.email;

    if (firstname === '') {
      this.refs.toast.show('Firstname is required');
      return;
    }
    if (lastname === '') {
      this.refs.toast.show('Lastname is required');
      return;
    }
    if (email === '') {
      this.refs.toast.show('Email is required');
      return;
    }
    if (this.validateEmail(email) === false) {
      this.refs.toast.show('Email is not valid');
      return;
    }
    this.makeRequesttoGetOTP();
  }

  registerStepTwo() {
    this.dismissKeyboard();

    var password = this.state.password;
    var confirmpassword = this.state.confirmpassword;

    if (password === '') {
      this.refs.toast.show('Password is required');
      return;
    }
    if (confirmpassword === '') {
      this.refs.toast.show('Confirm password is required');
      return;
    }
    if (password !== confirmpassword) {
      this.refs.toast.show('Password and confirm-password should be same');
      return;
    }
    this.setState({
      showStepOne: false,
      showStepTwo: false,
      showStepThree: true,
    });
  }

  registerStepThree() {
    this.dismissKeyboard();
    var username = this.state.username;

    if (!username) {
      this.refs.toast.show('Username is required');
      return;
    }
    this.setState({showLoader: true});
    if (Platform.OS === 'ios') {
      this.fetchLocation();
    } else {
      this.requestLocationPermission();
    }
  }

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

  makeRequesttoGetOTP = () => {
    const {email, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.REGISTRATION_GET_EMAIL_OTP;
    console.debug('URL: ', url);
    console.debug(
      'Request : ',
      JSON.stringify({
        useremail: email,
        isregistration: true,
      }),
    );
    this.setState({showLoader: true});
    if (!is_connected) {
      this.setState({
        showLoader: false,
      });
      this.refs.toast.show('Internet is not connected, Please try again!');
      return;
    }
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        useremail: email,
        isregistration: true,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.debug('Get OTP response:', responseData);
        this.setState({
          showLoader: false,
        });
        if (responseData.status === 200) {
          const data = responseData.data;
          console.log('DATA:', data);
          if (data.success === true) {
            this.setState({
              showStepOne: false,
              showVerifyOTP: true,
              showStepTwo: false,
              showiosBackButton: Platform.OS == 'ios' ? true : false,
              showStepThree: false,
              otp: '',
              error: responseData.error || null,
            });
          } else {
            this.refs.toast.show(data.message);
          }
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Get OTP response error:', error);
        this.setState({error, showLoader: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  makeRequesttoVerifyOTP = () => {
    this.dismissKeyboard();
    const {email, otp, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.FORGOT_PASSWORD_VERIFY_OTP;
    console.debug('URL: ', url);
    console.debug('RESPONSE:', {
      useremail: email,
      verifycode: otp,
    });
    this.setState({showLoader: true});
    if (!is_connected) {
      this.setState({
        showLoader: false,
      });
      this.refs.toast.show('Internet is not connected, Please try again!');
      return;
    }
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        useremail: email,
        verifycode: otp,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.debug('Verify OTP response:', responseData);
        this.setState({
          showLoader: false,
        });
        if (responseData.status === 200) {
          const data = responseData.data;
          if (data.validuser === true) {
            this.setState({
              showStepOne: false,
              showStepTwo: true,
              showVerifyOTP: false,
              showStepThree: false,
              newPassword: '',
              newConfirmPassword: '',
              error: responseData.error || null,
            });
          }
        } else {
          const error = responseData.error;
          if (error.validuser === false) {
            this.refs.toast.show('OTP entered is not valid');
          } else {
            this.refs.toast.show(responseData.message);
          }
        }
      })
      .catch(error => {
        console.debug('Verify OTP response error:', error);
        this.setState({error, showLoader: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  callRegisterApi(position) {
    var locationData = position;
    var registrationData = {
      firstName: this.state.firstname,
      lastName: this.state.lastname,
      email: this.state.email,
      pwd: this.state.password,
      userName: this.state.username,
    };
    var latlang = '0.000,0.000';

    if (locationData && locationData.coords) {
      var coords = locationData.coords;
      latlang = coords.latitude + ',' + coords.longitude;
    }

    registrationData.latlang = latlang;
    if (!this.state.is_connected) {
      this.setState({showLoader: false});
      this.refs.toast.show('Internet is not connected, Please try again!');
      return;
    }
    RegisterUser(registrationData)
      .then(res => {
        console.log(res);
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
          this.refs.toast.show('Username already exists. Please try another');
        } else {
          this.refs.toast.show(res.message);
        }
        setTimeout(() => {
          this.setState({showLoader: false});
        }, 1000);
      })
      .catch(err => {
        this.refs.toast.show('Something went wrong. Please try again later');
        setTimeout(() => {
          this.setState({showLoader: false});
        }, 1000);
      });
  }

  returnBack = () => {
    const {showStepOne, showStepTwo, showStepThree, showVerifyOTP} = this.state;
    if (
      showStepOne === false &&
      showVerifyOTP === false &&
      showStepTwo === true
    ) {
      this.setState({
        showStepOne: false,
        showVerifyOTP: true,
        showStepTwo: false,
        showStepThree: false,
        password: '',
        confirmpassword: '',
      });
    } else if (
      showStepOne === false &&
      showVerifyOTP === true &&
      showStepTwo === false
    ) {
      this.setState({
        showStepOne: true,
        showiosBackButton: false,
        showStepTwo: false,
        showVerifyOTP: false,
        showStepThree: false,
        otp: '',
      });
    } else if (
      showStepOne === false &&
      showStepTwo === false &&
      showStepThree === true
    ) {
      this.setState({
        showStepOne: false,
        showVerifyOTP: false,
        showStepTwo: true,
        showStepThree: false,
        username: '',
      });
    } else {
      this.props.navigation.goBack();
    }
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
        {this.state.showStepOne ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
            }}>
            <Text
              style={[
                AppStyle.app_font_heading,
                AppStyle.dark_TextColor,
                {fontSize: 23, marginBottom: 5},
              ]}>
              Create an account
            </Text>
            <Text
              style={[
                AppStyle.app_font_heading,
                AppStyle.light_blue_TextColor,
                {fontSize: 15, marginBottom: 30},
              ]}>
              Its simple and easy
            </Text>
            <TextInput
              style={AppStyle.appInput}
              placeholder="First name"
              value={this.state.firstname}
              onChangeText={firstname => this.setState({firstname})}
            />
            <TextInput
              style={AppStyle.appInput}
              placeholder="Last name"
              value={this.state.lastname}
              onChangeText={lastname => this.setState({lastname})}
            />
            <TextInput
              style={AppStyle.appInput}
              placeholder="Email"
              value={this.state.email}
              onChangeText={email => this.setState({email})}
            />
            <TouchableOpacity onPress={() => this.registerStepOne()}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[ButtonGradientColor1, ButtonGradientColor2]}
                style={AppStyle.appButton_background}>
                <Text style={AppStyle.appButton_Text}>Next</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}
        {this.state.showVerifyOTP || this.state.showStepTwo ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 100,
            }}>
            <Text
              style={[
                AppStyle.app_font_heading,
                AppStyle.dark_TextColor,
                {fontSize: 23, marginBottom: 5},
              ]}>
              Create an account
            </Text>
            <Text
              style={[
                AppStyle.app_font_heading,
                AppStyle.light_blue_TextColor,
                {fontSize: 15, marginBottom: 30},
              ]}>
              Its simple and easy
            </Text>
            <TextInput
              style={AppStyle.appInput}
              placeholder="Enter OTP"
              value={this.state.otp}
              maxLength={6}
              keyboardType={'numeric'}
              editable={this.state.showVerifyOTP ? true : false}
              onChangeText={otp => this.setState({otp})}
            />
            {this.state.showStepTwo ? (
              <View>
                <TextInput
                  style={AppStyle.appInput}
                  placeholder="Password"
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={password => this.setState({password})}
                />
                <TextInput
                  style={AppStyle.appInput}
                  placeholder="Re-enter password"
                  value={this.state.confirmpassword}
                  secureTextEntry={true}
                  onChangeText={confirmpassword =>
                    this.setState({confirmpassword})
                  }
                />
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() =>
                this.state.showStepTwo
                  ? this.registerStepTwo()
                  : this.makeRequesttoVerifyOTP(1243)
              }>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[ButtonGradientColor1, ButtonGradientColor2]}
                style={AppStyle.appButton_background}>
                <Text style={AppStyle.appButton_Text}>Next</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}
        {this.state.showStepThree ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 170,
            }}>
            <Text
              style={[
                AppStyle.app_font_heading,
                AppStyle.dark_TextColor,
                {fontSize: 23, marginBottom: 5},
              ]}>
              You're done
            </Text>
            <Text
              style={[
                AppStyle.app_font_heading,
                AppStyle.light_blue_TextColor,
                {fontSize: 15, marginBottom: 30},
              ]}>
              Give a username to your profile
            </Text>
            <TextInput
              style={AppStyle.appInput}
              placeholder="Give Username"
              onChangeText={username => this.setState({username})}
            />
            <TouchableOpacity onPress={() => this.registerStepThree()}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[ButtonGradientColor1, ButtonGradientColor2]}
                style={AppStyle.appButton_background}>
                <Text style={AppStyle.appButton_Text}>Enter Humming</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 50,
          }}>
          <Text
            style={[
              AppStyle.light_TextColor,
              AppStyle.app_font,
              {fontSize: 14},
            ]}>
            Existing User?
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('login')}>
            <Text
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font,
                {fontSize: 14},
              ]}>
              &nbsp;Sign in
            </Text>
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
