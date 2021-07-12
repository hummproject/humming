import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ToastAndroid,
  Alert,
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
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import {FlatList} from 'react-native-gesture-handler';
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
  }, [reachable]);
  return reachable;
};

const UserIntrests = props => {
  const dispatch = useAuthDispatch();
  const isInternetReachable = useInternetStatus();
  const [showLoader, setshowLoader] = useState(false);
  const [userData, setuserData] = useState(null);
  const [showiosBackButton, setshowiosBackButton] = useState(false);
  const [interestsAry, setinterestsAry] = useState([]);
  // const [interestsSelectedAry, setinterestsSelectedAry] = useState([]);
  const [isfromProfile, setisfromProfile] = useState(
    props.route.params.isfromProfile,
  );
  const [registrationData, setregistrationData] = useState(
    props.route.params.userData,
  );
  const [refresh, setrefresh] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      let uservalue = await AsyncStorage.getItem('userData');
      let userData = JSON.parse(uservalue);
      setuserData(userData);
      makeRequesttoFetchCategories(userData);
    }
    fetchUserData();
  }, [isInternetReachable]);

  const saveIntrestsClicked = () => {
    let interestsSelectedAry = interestsAry.filter(function(e) {
      return e.isselected === true;
    });
    if (interestsSelectedAry.length === 0) {
      notifyMessage('Please choose your interests');
      return;
    }
    if (interestsSelectedAry.length < 3) {
      notifyMessage('Please choose atleast 3 interests');
      return;
    }
    // setinterestsSelectedAry(interestsSelectedAry);
    setshowLoader(true);
    if (isfromProfile) {
      UpdateProfileInterests(interestsSelectedAry);
    } else {
      if (Platform.OS === 'ios') {
        fetchLocation(interestsSelectedAry);
      } else {
        requestLocationPermission(interestsSelectedAry);
      }
    }
  };

  const makeRequesttoFetchCategories = userData => {
    const url = AppConfig.DOMAIN + AppConfig.GET_ALL_AVAILABLE_CATEGORIES;
    setshowLoader(true);
    if (!isInternetReachable) {
      setshowLoader(false);
      // notifyMessage('Internet is not connected, Please try again!');
      return;
    }
    console.debug(url);
    console.debug('User Data', userData);
    fetch(url)
      .then(response => response.json())
      .then(responseData => {
        console.debug('Fetch Categories response:', responseData);
        setshowLoader(false);
        if (responseData.status === 200) {
          let categoriesAry = responseData.data;
          let userPreviousInterestsAry =
            userData === null ? [] : userData.interests;
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
          setinterestsAry(categoriesAry);
        } else {
          notifyMessage(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Fetch Categories response ERROR:', error);
        setshowLoader(false);
        setError(error);
        notifyMessage('Something went wrong. Please try again later');
      });
  };

  const requestLocationPermission = interestsSelectedAry => {
    try {
      (async () => {
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
          fetchLocation(interestsSelectedAry);
        } else {
          console.log('Location Permission Denied');
          callRegisterApi(null, interestsSelectedAry);
        }
      })();
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchLocation = interestsSelectedAry => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        console.log('GeoLocation Position:', position);
        callRegisterApi(position, interestsSelectedAry);
      },
      error => {
        callRegisterApi(null, interestsSelectedAry);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const callRegisterApi = (position, interestsSelectedAry) => {
    console.log(
      'Registartion api',
      position,
      registrationData,
      interestsSelectedAry,
    );
    var registrationdata = registrationData;
    // console.log('Registartion api registration data', registrationdata);
    var locationData = position;
    var latlang = '0.000,0.000';
    if (locationData && locationData.coords) {
      var coords = locationData.coords;
      latlang = coords.latitude + ',' + coords.longitude;
    }

    registrationdata.latlang = latlang;
    registrationdata.interests =
      '{' + interestsSelectedAry.map(e => e.id).join(',') + '}';

    if (!isInternetReachable) {
      setshowLoader(false);
      notifyMessage('Internet is not connected, Please try again!');
      return;
    }
    setshowLoader(true);
    RegisterUser(registrationdata)
      .then(res => {
        console.debug('Registration Response', res);
        if (res.status === 200) {
          const userData = res && res.data;
          AsyncStorage.setItem('userData', JSON.stringify(userData));
          dispatch({
            type: 'SIGN_IN',
            token: userData.token,
          });
        } else if (res.message === 'User already existed, please login.') {
          notifyMessage('Username is already taken. Please try another');
        } else {
          notifyMessage(res.message);
        }
        setTimeout(() => {
          setshowLoader(false);
        }, 1000);
      })
      .catch(err => {
        console.debug('Registration Response Error', err);
        notifyMessage('Something went wrong. Please try again later');
        setTimeout(() => {
          setshowLoader(false);
        }, 1000);
      });
  };

  const UpdateProfileInterests = interestsSelectedAry => {
    const requestData = new FormData();
    requestData.append(
      'interests',
      '{' + interestsSelectedAry.map(e => e.id).join(',') + '}',
    );
    const url = AppConfig.DOMAIN + AppConfig.UPDATE_USER_PROFILE;
    console.debug('URL:', url);
    console.debug('Headers', {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      token: userData.token,
    });
    console.debug('Request', requestData);
    if (!isInternetReachable) {
      setshowLoader(false);
      notifyMessage('Internet is not connected, Please try again!');
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
        setshowLoader(false);
        if (resJson.status === 200) {
          var userdata = userData;
          userdata['userdp'] = resJson.data.userdp;
          userdata['usermobile'] = resJson.data.usermobile;
          userdata['userprofession'] = resJson.data.userprofession;
          userdata['useraddress'] = resJson.data.useraddress;
          userdata['userbio'] = resJson.data.userbio;
          userdata['followers'] = resJson.data.followers;
          userdata['following'] = resJson.data.following;
          userdata['interests'] = resJson.data.interests;
          AsyncStorage.setItem('userData', JSON.stringify(userdata));
          if (Platform.OS === 'android') {
            ToastAndroid.show(
              'Interests updated successfully',
              ToastAndroid.SHORT,
            );
            props.navigation.goBack();
          } else {
            Alert.alert(
              '',
              'Interests updated successfully',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    console.log('OK Pressed');
                    props.navigation.goBack();
                  },
                },
              ],
              {cancelable: false},
            );
          }
        } else {
          notifyMessage(resJson.message);
        }
      })
      .catch(err => {
        console.debug('Update Interests response ERROR:', err);
        setshowLoader(false);
        setError(err);
        notifyMessage('Something went wrong. Please try again later');
      });
  };

  const returnBack = () => {
    props.navigation.goBack();
  };

  const interestItemSelected = item => {
    console.log('Interests selected item', item);
    var selectedItem = item;
    var isselected = selectedItem.isselected;
    selectedItem.isselected = !isselected;
    var intrestsAry = [...interestsAry];
    var index = intrestsAry.indexOf(({id}) => id === selectedItem.id);
    intrestsAry[index] = selectedItem;
    setinterestsAry(intrestsAry);
  };

  const renderinterestItems = ({item}) => {
    if (item.isselected === true) {
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
          onPress={() => interestItemSelected(item)}>
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
            <Text style={[AppStyle.app_font, {fontSize: 14, color: '#FFFFFF'}]}>
              {item.catname}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    } else {
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
          onPress={() => interestItemSelected(item)}>
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
    }
  };

  return (
    <SafeAreaView style={AppStyle.login_appContainer}>
      {showiosBackButton ? (
        <TouchableOpacity
          onPress={returnBack}
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
          data={interestsAry}
          keyExtractor={(item, index) => item.id + index}
          renderItem={renderinterestItems}
        />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 40,
        }}>
        <TouchableOpacity
          onPress={() => {
            console.debug('Save intrests clicked');
            saveIntrestsClicked();
          }}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={[ButtonGradientColor1, ButtonGradientColor2]}
            style={AppStyle.appButton_background}>
            <Text style={AppStyle.appButton_Text}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {showLoader ? (
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

export default UserIntrests;
