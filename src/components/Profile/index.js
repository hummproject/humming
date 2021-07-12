import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
  ToastAndroid,
  Modal,
  TouchableHighlight,
  Keyboard,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AppStyle} from '../../App.style';
import {ProfileStyles} from './Profile.style';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import AppConfig from '../../config/constants';
import {
  ButtonGradientColor1,
  ButtonGradientColor2,
} from '../../config/constants';
import {TextInput} from 'react-native-paper';
import ProgressiveImage from '../../ProgressiveImage';
import NetInfo from '@react-native-community/netinfo';
import ActionSheet from 'react-native-action-sheet';
import PostDetailsModal from '../PostDetailsModal';
import {useAuthDispatch} from '../../AuthContext';

// const options = {
//   title: 'Select Option',
//   customButtons: [],
//   storageOptions: {
//     skipBackup: true,
//     path: 'images',
//   },
// };

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

var BUTTONSiOS = ['Camera', 'Gallery', 'Cancel'];

var BUTTONSandroid = ['Camera', 'Gallery'];

var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 2;

const Profile = props => {
  const dispatch = useAuthDispatch();
  const isInternetReachable = useInternetStatus();
  const [loading, setloading] = useState(false);
  const [showMenuOptions, setshowMenuOptions] = useState(false);
  const [showUploadModal, setshowUploadModal] = useState(false);
  const [userData, setuserData] = useState({});
  const [error, seterror] = useState(null);
  const [showToast, setshowToast] = useState(false);
  const [userPostsAry, setuserPostsAry] = useState([]);
  const [username, setusername] = useState('');
  const [userdp, setuserdp] = useState('');
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [userprofession, setuserprofession] = useState('');
  const [followers, setfollowers] = useState('');
  const [following, setfollowing] = useState('');
  const [userbio, setuserbio] = useState('');
  const [usermobile, setusermobile] = useState('');
  const [useremail, setuseremail] = useState('');
  const [useraddress, setuseraddress] = useState('');
  const [professionInputText, setprofessionInputText] = useState('');
  const [phoneInputText, setphoneInputText] = useState('');
  const [addressInputText, setaddressInputText] = useState('');
  const [bioInputText, setbioInputText] = useState('');
  const [postDetails, setpostDetails] = useState({});
  const [showPostModal, setshowPostModal] = useState(false);
  const [showModalLoader, setshowModalLoader] = useState(false);
  const [menuTop, setmenuTop] = useState(60);

  async function fetchUserData() {
    let uservalue = await AsyncStorage.getItem('userData');
    let userData = JSON.parse(uservalue);
    setuserData(userData);
    setuserdp(userData.userdp);
    setusername(userData.username);
    setfirstname(userData.firstname);
    setlastname(userData.lastname);
    setuserprofession(
      userData.userprofession === undefined ? '' : userData.userprofession,
    );
    setfollowing(userData.following === undefined ? [] : userData.following);
    setfollowers(userData.followers === undefined ? [] : userData.followers);
    setuserbio(userData.userbio);
    setusermobile(userData.usermobile);
    setuseremail(userData.useremail);
    setuseraddress(userData.useraddress);
    setprofessionInputText(
      userData.userprofession === null ? '' : userData.userprofession,
    );
    setphoneInputText(userData.usermobile === null ? '' : userData.usermobile);
    setaddressInputText(
      userData.useraddress === null ? '' : userData.useraddress,
    );
    setbioInputText(userData.userbio === null ? '' : userData.userbio);
    makeRequesttoFetchUserMarkers(userData);
  }

  useEffect(() => {
    fetchUserData();
    const backAction = () => {
      props.navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [isInternetReachable]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      fetchUserData();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [isInternetReachable, props.navigation]);

  const makeRequesttoFetchUserMarkers = userData => {
    console.log('Fetch markers');
    const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS_BY_USER;
    console.debug('URL:', url);
    console.debug('Headers:', {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token: userData.token,
    });
    console.debug('Request:', {
      userid: userData.userid,
    });
    setloading(true);
    if (!isInternetReachable) {
      setloading(false);
      notifyMessage('Internet is not connected, Please try again!');
      return;
    }
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: userData.token,
      },
      body: JSON.stringify({
        userid: userData.userid,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.debug('Profile Page response:', responseData);
        setloading(false);
        if (responseData.status === 200) {
          if (Array.isArray(responseData.data)) {
            setuserPostsAry(responseData.data);
            seterror(responseData.error || null);
          } else {
            setuserPostsAry([]);
            seterror(responseData.error || null);
          }
        } else {
          notifyMessage(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Profile Page response ERROR:', error);
        seterror(error);
        setloading(false);
        notifyMessage('Something went wrong. Please try again later');
      });
  };

  const makeRequesttoDeletePost = postDetails => {
    console.debug('Delete post', postDetails);
    const url = AppConfig.DOMAIN + AppConfig.DELETE_MARKER;
    setloading(true);
    if (!isInternetReachable) {
      setloading(false);
      notifyMessage('Internet is not connected, Please try again!');
      return;
    }
    console.debug('Delete Post URL:', url);
    console.debug(
      'Delete Post Request:',
      JSON.stringify({
        postid: postDetails.marker_id,
      }),
    );
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: userData.token,
      },
      body: JSON.stringify({
        postid: postDetails.marker_id,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.debug('Delete Profile Posts response:', responseData);
        setloading(false);
        setshowPostModal(!showPostModal);
        if (responseData.status === 200) {
          var responseData = responseData.data;
          if (
            responseData.message.toLowerCase() === 'post deleted successfully'
          ) {
            var newpostsArray = [...userPostsAry];
            newpostsArray = newpostsArray.filter(function(obj) {
              return obj.marker_id !== postDetails.marker_id;
            });
            setuserPostsAry(newpostsArray);
            notifyMessage('Post deleted successfully');
          }
        } else {
          notifyMessage(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Delete Profile Posts response ERROR:', error);
        setloading(false);
        notifyMessage('Something went wrong. Please try again later');
      });
  };

  const ShowPostsDetails = postData => {
    console.log('show post details', postData);
    setpostDetails(postData);
    setshowPostModal(!showPostModal);
  };

  const closePostDetailsModal = () => {
    setshowPostModal(!showPostModal);
    setpostDetails({});
  };

  const uploadImage = () => {
    console.log('Upload Image clicked');
    ActionSheet.showActionSheetWithOptions(
      {
        options: Platform.OS == 'ios' ? BUTTONSiOS : BUTTONSandroid,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        tintColor: '#9B9B9B',
        title: 'Select Option',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // Camera
          ImagePicker.openCamera({
            width: Dimensions.get('window').width,
            height: 250,
            cropping: true,
          }).then(image => {
            console.log(image);
            const uri = Platform.OS == 'ios' ? image.path : image.path;
            var name = image.modificationDate + 'image/jpeg';
            const data = new FormData();
            data.append('userdp', {
              uri: uri,
              type: image.mime,
              name: name,
            });
            data.append('firstname', userData.firstname);
            console.log('Image data', data);
            UpdateProfile(data, false);
          });
        } else if (buttonIndex === 1) {
          // Gallery
          ImagePicker.openPicker({
            width: Dimensions.get('window').width,
            height: 250,
            cropping: true,
          }).then(image => {
            console.log(image);
            const uri = Platform.OS == 'ios' ? image.path : image.path;
            var name = image.modificationDate + 'image/jpeg';
            const data = new FormData();
            data.append('userdp', {
              uri: uri,
              type: image.mime,
              name: name,
            });
            console.log('Image userdp  data', {
              uri: uri,
              type: image.mime,
              name: name,
            });
            data.append('firstname', userData.firstname);
            UpdateProfile(data, false);
          });
        }
      },
    );
  };

  const showMenu = () => {
    setshowMenuOptions(!showMenuOptions);
  };

  const showUpdateProfile = () => {
    setshowUploadModal(!showUploadModal);
    setshowMenuOptions(!showMenuOptions);
  };

  const showEditInterests = () => {
    setshowMenuOptions(!showMenuOptions);
    props.navigation.navigate('userinterest', {
      userData: {},
      isfromProfile: true,
    });
  };

  const showPrivacyPolicy = () => {};

  const signOutfromApp = () => {
    setshowMenuOptions(!showMenuOptions);
    try {
      (async () => {
        await AsyncStorage.removeItem('userData');
        dispatch({type: 'SIGN_OUT'});
      })();
    } catch (err) {
      console.log(`signOutfromApp:The error is: ${err}`);
    }
  };

  const DeactivateProfile = () => {
    setshowMenuOptions(!showMenuOptions);
    Alert.alert(
      'Account Deactivation',
      'Do you want to deactivate your account? You can always re-activate your account by logging into app within 2 weeks, after that account is deleted permanently.',
      [
        {text: 'CANCEL', onPress: () => {}, style: 'cancel'},
        {
          text: 'DEACTIVATE',
          onPress: () => {
            UpdateAccountStatus();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const UpdateAccountStatus = () => {
    const url = AppConfig.DOMAIN + AppConfig.UPDATE_USER_ACCOUNT_STATUS;
    console.debug('URL:', url);
    setloading(true);
    if (!isInternetReachable) {
      setloading(false);
      notifyMessage('Internet is not connected, Please try again!');
      return;
    }
    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: userData.token,
      },
      body: JSON.stringify({
        statusType: 'deactivate',
      }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.debug('Deactivate profile response', resJson);
        setloading(false);
        if (
          resJson.status === 200 &&
          resJson.message.toLowerCase() ===
            'account status updated successfully.'
        ) {
          (async () => {
            try {
              await AsyncStorage.removeItem('userData');
              dispatch({type: 'SIGN_OUT'});
              notifyMessage('Profile deactivated successfully');
            } catch (err) {
              console.log(`RemoveUserDatafromApp:The error is: ${err}`);
            }
          })();
        } else {
          notifyMessage(resJson.message);
        }
      })
      .catch(err => {
        console.debug('Deactivate Profile response ERROR:', err);
        setloading(false);
        notifyMessage('Something went wrong. Please try again later');
      });
  };

  const UpdateProfile = (data, isfromModal) => {
    const url = AppConfig.DOMAIN + AppConfig.UPDATE_USER_PROFILE;
    console.debug('URL:', url);
    console.debug('Headers', {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      token: userData.token,
    });
    console.debug('Request', data);
    if (!isfromModal) {
      setloading(true);
    } else {
      setshowModalLoader(true);
    }
    if (!isInternetReachable) {
      if (!isfromModal) {
        setloading(false);
      } else {
        setshowModalLoader(false);
      }
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
      body: data,
    })
      .then(res => res.json())
      .then(resJson => {
        console.debug('Update profile response', resJson);
        if (!isfromModal) {
          setloading(false);
        } else {
          setshowModalLoader(false);
        }
        if (resJson.status === 200) {
          if (isfromModal) {
            setshowUploadModal(!showUploadModal);
          }
          seterror(resJson.error || null);
          setusername(resJson.data.username);
          setuserdp(resJson.data.userdp);
          setfirstname(resJson.data.firstname);
          setlastname(resJson.data.lastname);
          setuserprofession(resJson.data.userprofession);
          setfollowers(resJson.data.followers);
          setfollowing(resJson.data.following);
          setuserbio(resJson.data.userbio);
          setusermobile(resJson.data.usermobile);
          setuseraddress(resJson.data.useraddress);
          setuseremail(resJson.data.useremail);
          setprofessionInputText(
            resJson.data.userprofession === null
              ? ''
              : resJson.data.userprofession,
          );
          setaddressInputText(
            resJson.data.useraddress === null ? '' : resJson.data.useraddress,
          );
          setphoneInputText(
            resJson.data.usermobile === null ? '' : resJson.data.usermobile,
          );
          setbioInputText(
            resJson.data.userbio === null ? '' : resJson.data.userbio,
          );

          var userdata = userData;
          userdata['userdp'] = resJson.data.userdp;
          userdata['usermobile'] = resJson.data.usermobile;
          userdata['userprofession'] = resJson.data.userprofession;
          userdata['useraddress'] = resJson.data.useraddress;
          userdata['userbio'] = resJson.data.userbio;

          AsyncStorage.setItem('userData', JSON.stringify(userdata));
          notifyMessage('Profile updated successfully');
        } else {
          notifyMessage(resJson.message);
        }
      })
      .catch(err => {
        console.debug('Update Profile response ERROR:', err);
        setloading(false);
        setshowModalLoader(false);
        notifyMessage('Something went wrong. Please try again later');
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={ProfileStyles.headerstyle}
        onLayout={({nativeEvent}) => {
          var {x, y, width, height} = nativeEvent.layout;
          console.log('View Height', x, y, width, height);
          setmenuTop(y + height);
        }}>
        <Text
          style={[
            AppStyle.dark_TextColor,
            AppStyle.app_font_heading,
            {fontSize: 18, marginLeft: 20},
          ]}>
          @{username}
        </Text>
        <TouchableOpacity
          onPress={showMenu}
          style={{padding: 8, marginRight: 10}}>
          <Image
            source={require('../../images/profile_menu.png')}
            style={{width: 8, height: 20, marginLeft: 10}}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
      {showMenuOptions ? (
        <View style={[ProfileStyles.MenuOptionStyle, {top: menuTop - 10}]}>
          <TouchableOpacity onPress={() => showUpdateProfile()}>
            <Text
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font_heading,
                {fontSize: 14, padding: 8, paddingTop: 0},
              ]}>
              Update Profile
            </Text>
          </TouchableOpacity>
          <View
            style={{borderBottomColor: '#ececec', borderBottomWidth: 0.5}}
          />
          <TouchableOpacity onPress={() => showEditInterests()}>
            <Text
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font_heading,
                {fontSize: 14, padding: 8},
              ]}>
              Edit interests
            </Text>
          </TouchableOpacity>
          <View
            style={{borderBottomColor: '#ececec', borderBottomWidth: 0.5}}
          />
          <TouchableOpacity onPress={() => DeactivateProfile()}>
            <Text
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font_heading,
                {fontSize: 14, padding: 8},
              ]}>
              Deactivate Account
            </Text>
          </TouchableOpacity>
          <View
            style={{borderBottomColor: '#ececec', borderBottomWidth: 0.5}}
          />
          <TouchableOpacity onPress={() => showPrivacyPolicy()}>
            <Text
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font_heading,
                {fontSize: 14, padding: 8},
              ]}>
              Terms & Conditions
            </Text>
          </TouchableOpacity>
          <View
            style={{borderBottomColor: '#ececec', borderBottomWidth: 0.5}}
          />
          <TouchableOpacity onPress={() => signOutfromApp()}>
            <Text
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font_heading,
                {fontSize: 14, padding: 8, paddingBottom: 0},
              ]}>
              Sign out
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <ScrollView style={{backgroundColor: 'white'}}>
        <View
          style={[
            ProfileStyles.userDp,
            {
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F5F5F5',
              marginTop: 10,
            },
          ]}>
          {userdp == null || userdp == '' ? (
            <TouchableOpacity
              onPress={() => uploadImage()}
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={require('../../images/take_photo.png')}
                resizeMode="contain"
                style={{width: 75, height: 40, marginBottom: 10}}
              />
              <Text
                style={[
                  AppStyle.light_TextColor,
                  AppStyle.app_font,
                  {fontSize: 14},
                ]}>
                Upload profile photo
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              <ProgressiveImage
                style={ProfileStyles.userDp}
                source={
                  userdp == null || userdp == ''
                    ? require('../../images/logo.png')
                    : {uri: userdp}
                }
                resizeMode={
                  userdp == null || userdp == '' ? 'contain' : 'cover'
                }
              />
              <TouchableOpacity
                onPress={() => uploadImage()}
                style={{position: 'absolute', bottom: 10, right: 10}}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={[ButtonGradientColor1, ButtonGradientColor2]}
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{height: 12, width: 12}}
                    source={require('../../images/edit-icon.png')}
                    resizeMode={'contain'}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
          <Text
            style={[
              AppStyle.dark_TextColor,
              AppStyle.app_font,
              {fontSize: 18, textTransform: 'capitalize'},
            ]}>
            {firstname + ' ' + lastname}
          </Text>
        </View>
        <View style={[AppStyle.appAlignItemsCenter, {marginBottom: 20}]}>
          <Text
            style={[
              AppStyle.dark_TextColor,
              AppStyle.app_font,
              {fontSize: 14},
            ]}>
            {userprofession == null || userprofession == '' ? (
              <Text>Profession : Not Available</Text>
            ) : (
              <Text>{userprofession}</Text>
            )}
          </Text>
        </View>
        <View
          style={[
            {flex: 1, alignItems: 'center'},
            ProfileStyles.followContent,
          ]}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={[AppStyle.appLabel]}>FOLLOWERS</Text>
            <Text
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font,
                {fontSize: 14},
              ]}>
              {followers === null ? 0 : followers.length}
            </Text>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={[AppStyle.appLabel]}>FOLLOWING</Text>
            <Text
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font,
                {fontSize: 14},
              ]}>
              {following === null ? 0 : following.length}
            </Text>
          </View>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text
            style={[
              AppStyle.dark_TextColor,
              AppStyle.app_font,
              {
                fontSize: 14,
                textAlign: 'center',
                marginLeft: 15,
                marginRight: 15,
                marginTop: 20,
              },
            ]}>
            {userbio == null || userbio == '' ? (
              <Text>Bio : Not Available</Text>
            ) : (
              <Text>{userbio}</Text>
            )}
          </Text>
        </View>
        {userPostsAry.length === 0 ? null : (
          <View
            style={[
              {
                flexDirection: 'column',
                marginTop: 20,
              },
            ]}>
            <Text
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font,
                {fontSize: 14, paddingLeft: 15, paddingBottom: 10},
              ]}>
              Previous Posts
            </Text>
            <FlatList
              horizontal
              contentContainerStyle={{paddingEnd: 15}}
              showsHorizontalScrollIndicator={false}
              data={userPostsAry}
              renderItem={({item}) => {
                // console.debug(item.media);
                let imageUri = item.media != null ? item.media[0] : null;
                // console.debug('iMAGE uRL', imageUri);
                if (imageUri != '') {
                  return (
                    <TouchableOpacity
                      onPress={() => ShowPostsDetails(item)}
                      style={{
                        flex: 1,
                        borderColor: '#F5F5F5',
                        borderWidth: 0.5,
                        borderRadius: 8,
                        marginLeft: 15,
                        width: 130,
                        height: 130,
                        backgroundColor: '#ffffff',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={
                          imageUri == null
                            ? require('../../images/no_image_logo.png')
                            : {uri: imageUri}
                        }
                        resizeMode={imageUri == null ? 'contain' : 'cover'}
                        style={{
                          width: imageUri == null ? 40 : 130,
                          height: imageUri == null ? 40 : 130,
                          borderRadius: 8,
                        }}
                      />
                    </TouchableOpacity>
                  );
                } else {
                  return null;
                }
              }}
              keyExtractor={(item, index) => index + ''}
            />
          </View>
        )}
        {/* <View style={[AppStyle.appAlignItemsCenter, {marginTop: 20}]}>
            <Text
              style={[
                AppStyle.light_TextColor,
                AppStyle.app_font,
                {fontSize: 14},
              ]}>
              PHONE NUMBER
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{width: 18, height: 15, marginRight: 5}}
                source={require('../../images/phone_filled.png')}
                resizeMode={'contain'}
              />
              <Text
                style={[
                  AppStyle.dark_TextColor,
                  AppStyle.app_font,
                  {fontSize: 14},
                ]}>
                {usermobile == null || usermobile == '' ? (
                  <Text>Not Available</Text>
                ) : (
                  <Text>+91 {usermobile}</Text>
                )}
              </Text>
            </View>
          </View>
          <View
            style={[
              AppStyle.appAlignItemsCenter,
              {paddingTop: 20, paddingBottom: 20},
            ]}>
            <Text
              style={[
                AppStyle.light_TextColor,
                AppStyle.app_font,
                {fontSize: 14},
              ]}>
              EMAIL
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{width: 18, height: 18, marginRight: 4}}
                source={require('../../images/email_filled.png')}
                resizeMode={'contain'}
              />
              <Text
                style={[
                  AppStyle.dark_TextColor,
                  AppStyle.app_font,
                  {fontSize: 14},
                ]}>
                {useremail == null || useremail == '' ? (
                  <Text>Not Available</Text>
                ) : (
                  <Text>{useremail}</Text>
                )}
              </Text>
            </View>
          </View>
          <View style={[AppStyle.appAlignItemsCenter, {paddingBottom: 20}]}>
            <Text
              style={[
                AppStyle.light_TextColor,
                AppStyle.app_font,
                {fontSize: 14},
              ]}>
              ADDRESS
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{width: 18, height: 18}}
                source={require('../../images/location.png')}
                resizeMode={'contain'}
              />
              <Text
                style={[
                  AppStyle.dark_TextColor,
                  AppStyle.app_font,
                  {fontSize: 14},
                ]}>
                {useraddress == null || useraddress == '' ? (
                  <Text>Not Available</Text>
                ) : (
                  <Text>{useraddress}</Text>
                )}
              </Text>
            </View>
          </View> */}
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showUploadModal}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setshowUploadModal(!showUploadModal);
        }}>
        <TouchableHighlight
          style={{flex: 1}}
          onPress={() => {
            setshowUploadModal(!showUploadModal);
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(52, 52, 52, 0.5)',
            }}>
            <TouchableWithoutFeedback>
              <View style={ProfileStyles.modalView}>
                <Text
                  style={[
                    AppStyle.dark_TextColor,
                    AppStyle.app_font_heading,
                    {fontSize: 20},
                  ]}>
                  Update Profile
                </Text>
                <View
                  style={{
                    borderRadius: 10,
                    width: '100%',
                    height: 45,
                    marginTop: 15,
                    backgroundColor: '#F5F5F5',
                  }}>
                  <TextInput
                    style={[
                      AppStyle.dark_TextColor,
                      AppStyle.app_font,
                      {
                        fontSize: 14,
                        height: 45,
                        backgroundColor: 'transparent',
                      },
                    ]}
                    placeholder="Profession"
                    underlineColor="transparent"
                    theme={{colors: {primary: 'transparent'}}}
                    value={professionInputText}
                    onChangeText={text => setprofessionInputText(text)}
                  />
                </View>
                <View
                  style={{
                    borderRadius: 10,
                    width: '100%',
                    height: 45,
                    marginTop: 15,
                    backgroundColor: '#F5F5F5',
                  }}>
                  <TextInput
                    style={[
                      AppStyle.dark_TextColor,
                      AppStyle.app_font,
                      {
                        fontSize: 14,
                        height: 45,
                        backgroundColor: 'transparent',
                      },
                    ]}
                    placeholder="Phone"
                    underlineColor="transparent"
                    theme={{colors: {primary: 'transparent'}}}
                    value={phoneInputText}
                    onChangeText={text => setphoneInputText(text)}
                  />
                </View>
                <View
                  style={{
                    borderRadius: 10,
                    width: '100%',
                    height: 45,
                    marginTop: 15,
                    backgroundColor: '#F5F5F5',
                  }}>
                  <TextInput
                    style={[
                      AppStyle.dark_TextColor,
                      AppStyle.app_font,
                      {
                        fontSize: 14,
                        height: 45,
                        backgroundColor: 'transparent',
                      },
                    ]}
                    placeholder="Address"
                    underlineColor="transparent"
                    theme={{colors: {primary: 'transparent'}}}
                    value={addressInputText}
                    onChangeText={text => setaddressInputText(text)}
                  />
                </View>
                <View
                  style={{
                    borderRadius: 10,
                    width: '100%',
                    height: 60,
                    marginTop: 15,
                    backgroundColor: '#F5F5F5',
                  }}>
                  <TextInput
                    style={[
                      AppStyle.dark_TextColor,
                      AppStyle.app_font,
                      {
                        fontSize: 14,
                        height: 60,
                        backgroundColor: 'transparent',
                      },
                    ]}
                    placeholder="Bio"
                    underlineColor="transparent"
                    theme={{colors: {primary: 'transparent'}}}
                    value={bioInputText}
                    onChangeText={text => setbioInputText(text)}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                  onPress={() => {
                    const data = new FormData();
                    setshowToast(true);
                    if (professionInputText === '') {
                      notifyMessage('Profession cannot be empty');
                      return;
                    }
                    if (phoneInputText === '') {
                      notifyMessage('Mobile number cannot be empty');
                      return;
                    }
                    if (addressInputText === '') {
                      notifyMessage('Address cannot be empty');
                      return;
                    }
                    if (bioInputText === '') {
                      notifyMessage('Bio cannot be empty');
                      return;
                    }
                    data.append('userprofession', professionInputText);
                    data.append('usermobile', phoneInputText);
                    data.append('useraddress', addressInputText);
                    data.append('userbio', bioInputText);

                    Keyboard.dismiss();
                    UpdateProfile(data, true);
                  }}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={[ButtonGradientColor1, ButtonGradientColor2]}
                    style={AppStyle.appButton_background}>
                    <Text style={AppStyle.appButton_Text}>Update</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableHighlight>
        {showModalLoader ? (
          <ActivityIndicator
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#F5FCFF88',
              borderRadius: 20,
            }}
            animating={true}
            size="large"
          />
        ) : null}
      </Modal>
      {showPostModal ? (
        <PostDetailsModal
          isfromUserProfile={true}
          isfromProfile={true}
          postDetails={postDetails}
          onClose={closePostDetailsModal}
          navigation={props.navigation}
          deletePost={makeRequesttoDeletePost}
        />
      ) : null}
      {loading ? (
        <ActivityIndicator
          animating={true}
          style={AppStyle.activityIndicator}
          size="large"
        />
      ) : null}
    </SafeAreaView>
  );

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
};

export default Profile;
