import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
  ToastAndroid,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {LoginUser} from './Login.service';
import {AppStyle} from '../../App.style';
import LinearGradient from 'react-native-linear-gradient';
import AppConfig from '../../config/constants';
import {
  ButtonGradientColor1,
  ButtonGradientColor2,
} from '../../config/constants';
import NetInfo from '@react-native-community/netinfo';
import {useAuthDispatch} from '../../AuthContext';

const useInternetStatus = () => {
  const [reachable, setReachable] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setReachable(state.isInternetReachable);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return reachable;
};

const Login = props => {
  const dispatch = useAuthDispatch();
  const [loading, setLoading] = useState(false);
  const isInternetReachable = useInternetStatus();
  const [userPwd, setuserPwd] = useState('');
  const [userName, setuserName] = useState('');
  const [error, setError] = useState(null);
  const passwordInput = useRef();

  useEffect(() => {}, [isInternetReachable]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const Userlogin = () => {
    dismissKeyboard();
    if (userName != '') {
      if (userPwd != '') {
        setLoading(true);
        if (!isInternetReachable) {
          setLoading(false);
          notifyMessage('Internet is not connected, Please try again!');
          return;
        }
        LoginUser({
          userName: userName,
          userpassword: userPwd,
        })
          .then(res => {
            setLoading(false);
            console.debug('User Data from Login', res && res.data);
            if (res.status === 200) {
              const userData = res && res.data;
              console.debug('User Data from Login', userData);
              console.debug('isActive: ', userData.isactive);
              if (userData.isactive == '0') {
                // if isactive is '0' then Active User else call service to activate user
                AsyncStorage.setItem('userData', JSON.stringify(userData));
                console.log('User data login', userData);
                dispatch({
                  type: 'SIGN_IN',
                  token: userData.token,
                });
              } else {
                UpdateAccountStatus(userData);
              }
            } else {
              notifyMessage(res.message);
            }
          })
          .catch(error => {
            setLoading(false);
            console.log(error);
            notifyMessage('Something went wrong. Please try again later');
          });
      } else {
        notifyMessage('password cannot be Empty');
      }
    } else {
      notifyMessage('Username cannot be Empty');
    }
  };

  const UpdateAccountStatus = userData => {
    const url = AppConfig.DOMAIN + AppConfig.UPDATE_USER_ACCOUNT_STATUS;
    console.debug('URL:', url);
    setLoading(true);
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
        setLoading(false);
        console.debug('Activate profile:', resJson.data);
        if (
          resJson.status === 200 &&
          resJson.message.toLowerCase() ===
            'account status updated successfully.'
        ) {
          AsyncStorage.setItem('userData', JSON.stringify(userData));
          dispatch({
            type: 'SIGN_IN',
            token: userData.token,
          });
        } else {
          notifyMessage(resJson.message);
        }
      })
      .catch(err => {
        console.debug('Activate Profile response ERROR:', err);
        setLoading(false);
        setError(err);
        notifyMessage('Something went wrong. Please try again later');
      });
  };

  const goToRegister = () => {
    props.navigation.navigate('register');
  };

  const goToForgotPassword = () => {
    props.navigation.navigate('forgotpassword');
  };

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
          value={userName}
          onChangeText={userName => setuserName(userName)}
          onSubmitEditing={() => passwordInput.current.focus()}
        />
        <TextInput
          style={AppStyle.appInput}
          placeholder="Password"
          value={userPwd}
          secureTextEntry={true}
          onChangeText={userPwd => setuserPwd(userPwd)}
          ref={passwordInput}
        />
        <TouchableOpacity onPress={Userlogin}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={[ButtonGradientColor1, ButtonGradientColor2]}
            style={AppStyle.appButton_background}>
            <Text style={AppStyle.appButton_Text}>Sign in</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToForgotPassword}>
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
          style={[AppStyle.light_TextColor, AppStyle.app_font, {fontSize: 14}]}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={goToRegister}>
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
      {loading ? (
        <ActivityIndicator
          animating={true}
          style={AppStyle.activityIndicator}
          size="large"
        />
      ) : null}
    </SafeAreaView>
  );
};

function notifyMessage(errorMessage) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
  } else {
    Alert.alert(
      '',
      errorMessage,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }
}

export default Login;
