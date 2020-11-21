import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
  BackHandler,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {LoginUser} from './Login.service';
import {AppStyle} from '../../App.style';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-easy-toast';
import AppConfig from '../../config/constants';
import {
  ButtonGradientColor1,
  ButtonGradientColor2,
} from '../../config/constants';
import NetInfo from '@react-native-community/netinfo';
import {StackActions, NavigationActions} from 'react-navigation';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userPwd: '',
      loading: false,
      is_connected: false,
    };
  }

  dismissKeyboard() {
    Keyboard.dismiss();
  }

  login = () => {
    this.dismissKeyboard();
    const {userPwd, userName, is_connected} = this.state;
    if (userName != '') {
      if (userPwd != '') {
        this.setState({loading: true});
        if (!is_connected) {
          this.setState({
            loading: false,
            refreshing: false,
          });
          this.refs.toast.show('Internet is not connected, Please try again!');
          return;
        }
        LoginUser({
          userName: userName,
          userpassword: userPwd,
        })
          .then(res => {
            this.setState({loading: false});
            console.debug('User Data from Login', res && res.data);
            if (res.status === 200) {
              const userData = res && res.data;
              console.debug('User Data from Login', userData);
              console.debug('isActive: ', userData.isactive);
              if (userData.isactive == '0') {
                // if isactive is '0' then Active User else call service to activate user
                AsyncStorage.setItem('userData', JSON.stringify(userData));
                let resetAction = StackActions.reset({
                  index: 0,
                  key: null,
                  actions: [NavigationActions.navigate({routeName: 'TabBar'})],
                });
                this.props.navigation.dispatch(resetAction);
                this.props.navigation.navigate('TabBar');
                // this.props.navigation.navigate('TabBar');
              } else {
                this.UpdateAccountStatus(userData);
              }
            } else {
              this.refs.toast.show(res.message);
            }
          })
          .catch(error => {
            this.setState({loading: false});
            console.log(error);
            this.refs.toast.show(
              'Something went wrong. Please try again later',
            );
          });
      } else {
        this.refs.toast.show('password cannot be Empty');
      }
    } else {
      this.refs.toast.show('Username cannot be Empty');
    }
  };

  UpdateAccountStatus = userData => {
    const url = AppConfig.DOMAIN + AppConfig.UPDATE_USER_ACCOUNT_STATUS;
    console.debug('URL:', url);
    this.setState({loading: true});
    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: userData.token,
      },
      body: JSON.stringify({
        statusType: 'activate',
      }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.debug('Activate profile response', resJson);
        this.setState({
          loading: false,
        });
        console.debug('Activate profile:', resJson.data);
        if (
          resJson.status === 200 &&
          resJson.message.toLowerCase() ===
            'account status updated successfully.'
        ) {
          AsyncStorage.setItem('userData', JSON.stringify(userData));
          this.props.navigation.navigate('TabBar');
        } else {
          this.refs.toast.show(resJson.message);
        }
      })
      .catch(err => {
        console.debug('Activate Profile response ERROR:', err);
        this.setState({error: err, loading: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  goToRegister = () => {
    this.props.navigation.navigate('register');
  };

  goToForgotPassword = () => {
    this.props.navigation.navigate('forgotpassword');
  };

  componentDidMount() {
    this.setState({
      userName: '',
      userPwd: '',
    });
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      this.setState({
        userName: '',
        userPwd: '',
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
  }

  componentWillUnmount() {
    this._unsubscribe();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.netinfoSubscribe();
  }

  handleBackButton = () => {
    Alert.alert(
      '',
      'Are you sure you want to exit the app?',
      [
        {text: 'CANCEL', onPress: () => {}, style: 'cancel'},
        {
          text: 'YES',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ],
      {cancelable: false},
    );
    return true;
  };

  render() {
    return (
      <SafeAreaView style={AppStyle.login_appContainer}>
        <StatusBar barStyle={'dark-content'} />
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
          }}>
          <Text
            style={[
              AppStyle.app_font_heading,
              AppStyle.dark_TextColor,
              {fontSize: 23, marginBottom: 5},
            ]}>
            Welcome to Humming
          </Text>
          <Text
            style={[
              AppStyle.app_font_heading,
              AppStyle.light_blue_TextColor,
              {fontSize: 15, marginBottom: 30},
            ]}>
            Login to your account
          </Text>
          <TextInput
            style={AppStyle.appInput}
            placeholder="User name"
            value={this.state.userName}
            onChangeText={userName => this.setState({userName})}
            onSubmitEditing={() => this.passwordInput.focus()}
          />
          <TextInput
            style={AppStyle.appInput}
            placeholder="Password"
            value={this.state.userPwd}
            secureTextEntry={true}
            onChangeText={userPwd => this.setState({userPwd})}
            ref={ref => {
              this.passwordInput = ref;
            }}
          />
          <TouchableOpacity onPress={this.login}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={[ButtonGradientColor1, ButtonGradientColor2]}
              style={AppStyle.appButton_background}>
              <Text style={AppStyle.appButton_Text}>Sign in</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goToForgotPassword}>
            <Text
              style={[
                AppStyle.app_font,
                {marginTop: 30, fontSize: 14},
                AppStyle.light_gray_TextColor,
              ]}>
              Forgot your password?
            </Text>
          </TouchableOpacity>
        </View>
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
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={this.goToRegister}>
            <Text
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font,
                {fontSize: 14},
              ]}>
              &nbsp;Sign up
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.loading ? (
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
