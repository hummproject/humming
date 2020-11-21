import * as React from 'react';
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
  Modal,
  TouchableHighlight,
  Keyboard,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AppStyle} from '../../App.style';
import {ProfileStyles} from './Profile.style';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import AppConfig from '../../config/constants';
import {
  ButtonGradientColor1,
  ButtonGradientColor2,
} from '../../config/constants';
import Toast from 'react-native-easy-toast';
import {TextInput} from 'react-native-paper';
import ProgressiveImage from '../../ProgressiveImage';
import NetInfo from '@react-native-community/netinfo';
import {StackActions, NavigationActions} from 'react-navigation';
import ActionSheet from 'react-native-action-sheet';
import PostDetailsModal from '../PostDetailsModal';

// const options = {
//   title: 'Select Option',
//   customButtons: [],
//   storageOptions: {
//     skipBackup: true,
//     path: 'images',
//   },
// };

var BUTTONSiOS = ['Camera', 'Gallery', 'Cancel'];

var BUTTONSandroid = ['Camera', 'Gallery'];

var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 2;

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showMenuOptions: false,
      showUploadModal: false,
      userData: {},
      error: null,
      showToast: false,
      userPostsAry: [],
      username: '',
      userdp: '',
      firstname: '',
      lastname: '',
      userprofession: '',
      followers: '',
      following: '',
      userbio: '',
      usermobile: '',
      useremail: '',
      useraddress: '',
      professionInputText: '',
      phoneInputText: '',
      addressInputText: '',
      bioInputText: '',
      postDetails: {},
      showPostModal: false,
      showModalLoader: false,
      is_connected: false,
      menuTop: 60,
    };
    this.makeRequesttoDeletePost = this.makeRequesttoDeletePost.bind(this);
    this.closePostDetailsModal = this.closePostDetailsModal.bind(this);
  }

  async componentDidMount() {
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      this.setState({
        userData: userData,
        userdp: userData.userdp,
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        userprofession: userData.userprofession,
        followers: userData.followers,
        following: userData.following,
        userbio: userData.userbio,
        usermobile: userData.usermobile,
        useremail: userData.useremail,
        useraddress: userData.useraddress,
        professionInputText:
          userData.userprofession === null ? '' : userData.userprofession,
        phoneInputText: userData.usermobile === null ? '' : userData.usermobile,
        addressInputText:
          userData.useraddress === null ? '' : userData.useraddress,
        bioInputText: userData.userbio === null ? '' : userData.userbio,
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
    this.makeRequesttoFetchUserMarkers();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      this.makeRequesttoFetchUserMarkers();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this._unsubscribe();
    this.netinfoSubscribe();
  }

  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  };

  makeRequesttoFetchUserMarkers = () => {
    const {userData, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS_BY_USER;
    console.debug(url);
    this.setState({loading: true});
    if (!is_connected) {
      this.setState({loading: false});
      this.refs.toast.show('Internet is not connected, Please try again!');
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
        this.setState({loading: false});
        if (responseData.status === 200) {
          if (Array.isArray(responseData.data)) {
            this.setState({
              userPostsAry: responseData.data,
              error: responseData.error || null,
            });
          } else {
            this.setState({
              userPostsAry: [],
              error: responseData.error || null,
            });
          }
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Profile Page response ERROR:', error);
        this.setState({error: error, loading: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  makeRequesttoDeletePost = postDetails => {
    // console.debug('Delete post', postDetails);
    const {userData, userPostsAry, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.DELETE_MARKER;
    this.setState({loading: true});
    if (!is_connected) {
      this.setState({
        loading: false,
      });
      this.refs.toast.show('Internet is not connected, Please try again!');
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
        this.setState({
          loading: false,
          showPostMenuOptions: !this.state.showPostMenuOptions,
        });
        if (responseData.status === 200) {
          var responseData = responseData.data;
          if (
            responseData.message.toLowerCase() === 'post deleted successfully'
          ) {
            var newpostsArray = userPostsAry;
            newpostsArray = newpostsArray.filter(function(obj) {
              return obj.marker_id !== postDetails.marker_id;
            });
            this.setState({
              userPostsAry: newpostsArray,
            });
            this.refs.toast.show('Post deleted successfully');
          }
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Delete Profile Posts response ERROR:', error);
        this.setState({error, loading: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  ShowPostsDetails = postData => {
    this.setState({
      postDetails: postData,
      showPostModal: !this.state.showPostModal,
    });
  };

  closePostDetailsModal = () => {
    this.setState({
      showPostModal: !this.state.showPostModal,
      postDetails: {},
    });
  };

  returnBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {
      userPostsAry,
      loading,
      username,
      userdp,
      firstname,
      lastname,
      userprofession,
      followers,
      following,
      userbio,
      usermobile,
      useremail,
      useraddress,
      menuTop,
      showPostModal,
    } = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={ProfileStyles.headerstyle}
          ref="Header"
          onLayout={({nativeEvent}) => {
            this.refs.Header.measure((x, y, width, height, pageX, pageY) => {
              // console.log(x, y, width, height, pageX, pageY);
              this.setState({menuTop: y + height});
            });
          }}>
          {/* <TouchableOpacity
            onPress={this.returnBack}
            style={{padding: 8, marginLeft: 10}}>
            <Image
              source={require('../../images/back.png')}
              resizeMode={'contain'}

              style={{width: 13, height: 20, marginLeft: 10}}
            />
          </TouchableOpacity> */}
          <Text
            style={[
              AppStyle.dark_TextColor,
              AppStyle.app_font_heading,
              {fontSize: 18, marginLeft: 20},
            ]}>
            @{username}
          </Text>
          <TouchableOpacity
            onPress={() => this.showMenu()}
            style={{padding: 8, marginRight: 10}}>
            <Image
              source={require('../../images/profile_menu.png')}
              style={{width: 8, height: 20, marginLeft: 10}}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        {this.state.showMenuOptions ? (
          <View style={[ProfileStyles.MenuOptionStyle, {top: menuTop - 10}]}>
            <TouchableOpacity onPress={() => this.showUpdateProfile()}>
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
            <TouchableOpacity onPress={() => this.showEditInterests()}>
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
            <TouchableOpacity onPress={() => this.DeactivateProfile()}>
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
            <TouchableOpacity onPress={() => this.showPrivacyPolicy()}>
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
            <TouchableOpacity onPress={() => this.signOutfromApp()}>
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
                onPress={() => this.uploadImage()}
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
                  onPress={() => this.uploadImage()}
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
                        onPress={this.ShowPostsDetails.bind(this, item)}
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
          visible={this.state.showUploadModal}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            this.setState({
              showUploadModal: !this.state.showUploadModal,
            });
          }}>
          <TouchableHighlight
            style={{flex: 1}}
            onPress={() => {
              this.setState({
                showUploadModal: !this.state.showUploadModal,
              });
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
                      value={this.state.professionInputText}
                      onChangeText={text =>
                        this.setState({
                          professionInputText: text,
                        })
                      }
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
                      value={this.state.phoneInputText}
                      onChangeText={text =>
                        this.setState({
                          phoneInputText: text,
                        })
                      }
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
                      value={this.state.addressInputText}
                      onChangeText={text =>
                        this.setState({
                          addressInputText: text,
                        })
                      }
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
                      value={this.state.bioInputText}
                      onChangeText={text =>
                        this.setState({
                          bioInputText: text,
                        })
                      }
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
                      this.setState({
                        showToast: true,
                      });
                      if (this.state.professionInputText === '') {
                        this.refs.toast.show('Profession cannot be empty');
                        return;
                      }
                      if (this.state.phoneInputText === '') {
                        this.refs.toast.show('Mobile number cannot be empty');
                        return;
                      }
                      if (this.state.addressInputText === '') {
                        this.refs.toast.show('Address cannot be empty');
                        return;
                      }
                      if (this.state.bioInputText === '') {
                        this.refs.toast.show('Bio cannot be empty');
                        return;
                      }
                      data.append(
                        'userprofession',
                        this.state.professionInputText,
                      );
                      data.append('usermobile', this.state.phoneInputText);
                      data.append('useraddress', this.state.addressInputText);
                      data.append('userbio', this.state.bioInputText);
                      Keyboard.dismiss();
                      this.UpdateProfile(data, true);
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
          {this.state.showModalLoader ? (
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
            postDetails={this.state.postDetails}
            onClose={this.closePostDetailsModal}
            navigation={this.props.navigation}
            deletePost={this.makeRequesttoDeletePost}
          />
        ) : null}
        {loading ? (
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

  showMenu = () => {
    this.setState({
      showMenuOptions: !this.state.showMenuOptions,
    });
  };

  showUpdateProfile = () => {
    this.setState({
      showUploadModal: !this.state.showUploadModal,
      showMenuOptions: !this.state.showMenuOptions,
    });
  };

  showEditInterests = () => {
    this.setState({
      showMenuOptions: !this.state.showMenuOptions,
    });
    this.props.navigation.navigate('userinterests', {
      userData: {},
      isfromProfile: true,
    });
  };

  showPrivacyPolicy = () => {};

  async signOutfromApp() {
    this.setState({
      showMenuOptions: !this.state.showMenuOptions,
    });
    try {
      await AsyncStorage.removeItem('userData');
      // this.props.navigation.navigate('login')
      let resetAction = StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({routeName: 'login'})],
      });
      this.props.navigation.dispatch(resetAction);
      this.props.navigation.navigate('login');
    } catch (err) {
      console.log(`signOutfromApp:The error is: ${err}`);
    }
  }

  async DeactivateProfile() {
    this.setState({
      showMenuOptions: !this.state.showMenuOptions,
    });
    Alert.alert(
      'Account Deactivation',
      'Do you want to deactivate your account? You can always re-activate your account by logging into app within 2 weeks, after that account is deleted permanently.',
      [
        {text: 'CANCEL', onPress: () => {}, style: 'cancel'},
        {
          text: 'DEACTIVATE',
          onPress: () => {
            this.UpdateAccountStatus();
          },
        },
      ],
      {cancelable: false},
    );
  }

  uploadImage = () => {
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
            const {userData} = this.state;
            const data = new FormData();
            data.append('userdp', {
              uri: uri,
              type: image.mime,
              name: name,
            });
            data.append('firstname', userData.firstname);
            this.UpdateProfile(data, false);
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
            const {userData} = this.state;
            const data = new FormData();
            data.append('userdp', {
              uri: uri,
              type: image.mime,
              name: name,
            });
            data.append('firstname', userData.firstname);
            this.UpdateProfile(data, false);
          });
        }
      },
    );
    // ImagePicker.showImagePicker(options, response => {
    //   console.log('Response = ', response);
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton);
    // }
    //   else {
    //     // const source = response.uri;
    //     const {userData} = this.state;
    //     const data = new FormData();
    //     data.append('userdp', {
    //       uri: response.uri,
    //       type: response.type,
    //       name: response.fileName,
    //     });
    //     data.append('firstname', userData.firstname);
    //     this.UpdateProfile(data, false);
    //   }
    // });
  };

  UpdateAccountStatus() {
    const {userData, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.UPDATE_USER_ACCOUNT_STATUS;
    console.debug('URL:', url);
    this.setState({loading: true});
    if (!is_connected) {
      this.setState({loading: false});
      this.refs.toast.show('Internet is not connected, Please try again!');
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
        this.setState({
          loading: false,
        });
        if (
          resJson.status === 200 &&
          resJson.message.toLowerCase() ===
            'account status updated successfully.'
        ) {
          (async () => {
            try {
              await AsyncStorage.removeItem('userData');
            } catch (err) {
              console.log(`RemoveUserDatafromApp:The error is: ${err}`);
            }
          })();
          this.refs.toast.show('Profile deactivated successfully');
          this.props.navigation.navigate('login');
        } else {
          this.refs.toast.show(resJson.message);
        }
      })
      .catch(err => {
        console.debug('Deactivate Profile response ERROR:', err);
        this.setState({error: err, loading: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  }

  UpdateProfile = (data, isfromModal) => {
    const {userData, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.UPDATE_USER_PROFILE;
    console.debug('URL:', url);
    console.debug('Headers', {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      token: userData.token,
    });
    console.debug('Request', data);
    if (!isfromModal) {
      this.setState({loading: true});
    } else {
      this.setState({showModalLoader: true});
    }
    if (!is_connected) {
      if (!isfromModal) {
        this.setState({loading: false});
      } else {
        this.setState({showModalLoader: false});
      }
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
      body: data,
    })
      .then(res => res.json())
      .then(resJson => {
        console.debug('Update profile response', resJson);
        if (!isfromModal) {
          this.setState({
            loading: false,
          });
        } else {
          this.setState({showModalLoader: false});
        }
        if (resJson.status === 200) {
          if (isfromModal) {
            this.setState({
              showUploadModal: !this.state.showUploadModal,
            });
          }
          this.setState({
            error: resJson.error || null,
            username: resJson.data.username,
            userdp: resJson.data.userdp,
            firstname: resJson.data.firstname,
            lastname: resJson.data.lastname,
            userprofession: resJson.data.userprofession,
            followers: resJson.data.followers,
            following: resJson.data.following,
            userbio: resJson.data.userbio,
            usermobile: resJson.data.usermobile,
            useremail: resJson.data.useremail,
            useraddress: resJson.data.useraddress,
            professionInputText:
              resJson.data.userprofession === null
                ? ''
                : resJson.data.userprofession,
            phoneInputText:
              resJson.data.usermobile === null ? '' : resJson.data.usermobile,
            addressInputText:
              resJson.data.useraddress === null ? '' : resJson.data.useraddress,
            bioInputText:
              resJson.data.userbio === null ? '' : resJson.data.userbio,
          });
          var userdata = this.state.userData;
          userdata['userdp'] = resJson.data.userdp;
          userdata['usermobile'] = resJson.data.usermobile;
          userdata['userprofession'] = resJson.data.userprofession;
          userdata['useraddress'] = resJson.data.useraddress;
          userdata['userbio'] = resJson.data.userbio;
          //
          AsyncStorage.setItem('userData', JSON.stringify(userdata));
          this.refs.toast.show('Profile updated successfully');
        } else {
          this.refs.toast.show(resJson.message);
        }
      })
      .catch(err => {
        console.debug('Update Profile response ERROR:', err);
        this.setState({error: err, loading: false, showModalLoader: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };
}
