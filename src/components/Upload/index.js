import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Picker,
  SafeAreaView,
  FlatList,
  Dimensions,
  ActivityIndicator,
  BackHandler,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {AppStyle} from '../../App.style';
import {styles} from './upload.styles';
import Toast from 'react-native-easy-toast';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import AppConfig from '../../config/constants';
import {
  ButtonGradientColor1,
  ButtonGradientColor2,
} from '../../config/constants';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import CustomiOSPicker from '../CustomiOSPicker';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import ActionSheet from 'react-native-action-sheet';

const options = {
  title: 'Select Option',
  allowsEditing: true,
  customButtons: [],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

var BUTTONSiOS = ['Camera', 'Gallery', 'Cancel'];

var BUTTONSandroid = ['Camera', 'Gallery'];

var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 2;

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choosenIndex: 0,
      hummDescription: '',
      category: '',
      isImageUploaded: false,
      uploadImageArray: [],
      userData: {},
      userDp: null,
      loading: false,
      showtoast: false,
      showiOSPicker: false,
      latlang: '0.000,0.000',
      is_connected: false,
      pickerData: [
        'Add marker',
        'Movies',
        'Music',
        'Sports',
        'Travel',
        'Politics',
        'Art',
        'Entertainment',
        'Technology',
        'Fashion',
        'Food',
      ],
    };
    this.uploadImage = this.uploadImage.bind(this);
  }

  async componentDidMount() {
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      this.setState({
        userData: userData,
        userDp: userData.userdp,
      });
    });
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      this.setState({
        choosenIndex: 0,
        hummDescription: '',
        category: '',
        isImageUploaded: false,
        uploadImageArray: [],
        loading: false,
        showtoast: false,
        showiOSPicker: false,
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
    this.props.navigation.goBack();
    return true;
  };

  showiOSPicker = () => {
    this.setState({
      showiOSPicker: true,
    });
  };

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
            let imagesAry = this.state.uploadImageArray;
            imagesAry.push(image);
            this.setState({
              isImageUploaded: true,
              uploadImageArray: imagesAry,
            });
          });
        } else if (buttonIndex === 1) {
          // Gallery
          ImagePicker.openPicker({
            width: Dimensions.get('window').width,
            height: 250,
            cropping: true,
          }).then(image => {
            console.log(image);
            let imagesAry = this.state.uploadImageArray;
            imagesAry.push(image);
            this.setState({
              isImageUploaded: true,
              uploadImageArray: imagesAry,
            });
          });
        }
      },
    );

    // ImagePicker.showImagePicker(options, response => {
    //   console.log('Response = ', response);
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker', response);
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton);
    //   } else {
    //     // const source = response.uri;
    //     console.log('string checking' + JSON.stringify(response));
    //     let imagesAry = this.state.uploadImageArray;
    //     imagesAry.push(response);
    //     this.setState({
    //       isImageUploaded: true,
    //       uploadImageArray: imagesAry,
    //     });
    //   }
    // });
  };

  UploadMarker = () => {
    this.setState({
      loading: true,
    });
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      this.fetchLocation();
    } else {
      this.requestLocationPermission();
    }
  };

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message:
            'This app requires access to your location to tag location to your posts.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //To Check, If Permission is granted
        this.fetchLocation();
      } else {
        console.log('Location Permission Denied');
        this.upload();
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
        var locationData = position;
        var latlang = '0.000,0.000';
        if (locationData && locationData.coords) {
          var coords = locationData.coords;
          latlang = coords.latitude + ',' + coords.longitude;
        }
        this.setState(
          {
            latlang: latlang,
            loading: false,
          },
          this.upload,
        );
      },
      error => {
        this.setState(
          {
            latlang: '0.000,0.000',
            loading: false,
          },
          this.upload,
        );
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  validateText = text => {
    let reg = /.*\S.*/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  upload = () => {
    const {
      userData,
      category,
      uploadImageArray,
      hummDescription,
      latlang,
      is_connected,
    } = this.state;
    this.setState({
      showtoast: true,
    });
    if (category === '') {
      this.refs.toast.show('Please add marker');
      return;
    }
    if (hummDescription === '' && uploadImageArray.length <= 0) {
      this.refs.toast.show('Please add something to post');
      return;
    }
    if (!this.validateText(hummDescription) && hummDescription !== '') {
      this.refs.toast.show('Please write something valid');
      return;
    }
    const data = new FormData();
    for (let obj of uploadImageArray) {
      const uri = Platform.OS == 'ios' ? obj.path : obj.path;
      var name = obj.modificationDate + 'image/jpeg';
      data.append('markermedia', {
        uri: uri,
        type: obj.mime,
        name: name,
      });
    }
    data.append('description', hummDescription);
    data.append('category', category);
    data.append('latitude', '0');
    data.append('longitude', '0');
    data.append('location', latlang); // latlang
    let url = AppConfig.DOMAIN + AppConfig.SAVE_MARKER;
    console.debug('URL:', url);
    console.debug('Upload Request', data);
    this.setState({
      loading: true,
    });
    if (!is_connected) {
      this.setState({
        loading: false,
      });
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
      .then(res => {
        this.setState({
          loading: false,
        });
        console.debug('Upload Post marker response', res);
        if (res.status === 200) {
          this.setState({
            isImageUploaded: false,
            uploadImageArray: [],
            hummDescription: '',
            category: '',
          });
          this.refs.toast.show('Marker uploaded successfully');
          this.props.navigation.navigate('Home');
        } else {
          this.refs.toast.show(res.message);
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
        });
        console.log('Post marker response error', err);
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  callbackfromPicker = (data, index) => {
    // console.debug('picker data', data);
    if (data !== 'Add marker') {
      this.setState({
        category: data,
        choosenIndex: index,
        showiOSPicker: false,
      });
    } else {
      this.setState({
        category: '',
        choosenIndex: 0,
        showiOSPicker: false,
      });
    }
  };

  navigatetoUserProfile = () => {
    this.props.navigation.navigate('userprofile');
  };

  render() {
    const {
      isImageUploaded,
      uploadImageArray,
      loading,
      hummDescription,
      userDp,
    } = this.state;
    return (
      // <KeyboardAvoidingView behavior="position">
      <SafeAreaView style={{flex: 1, backgroundColor: '#FBFBFB'}}>
        <View style={styles.headerstyle}>
          <Text
            style={[
              AppStyle.dark_TextColor,
              AppStyle.app_font_heading,
              {fontSize: 20, marginLeft: 20},
            ]}>
            Hum here
          </Text>
          <TouchableOpacity
            onPress={this.navigatetoUserProfile}
            style={{padding: 5, marginRight: 15}}>
            <View
              style={[
                AppStyle.header_profile_photo,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#F5F5F5',
                },
              ]}>
              <Image
                source={
                  userDp == null || userDp == ''
                    ? require('../../images/profile_icon.png')
                    : {uri: userDp}
                }
                style={
                  userDp == null || userDp == ''
                    ? {height: 15, width: 15}
                    : AppStyle.header_profile_photo
                }
                resizeMode={
                  userDp == null || userDp == '' ? 'contain' : 'cover'
                }
              />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.upload_container}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F5F5F5',
                height: 225,
                width: '92%',
                marginTop: 15,
                borderRadius: 5,
              }}>
              {isImageUploaded ? (
                <View style={{height: 225, width: '100%'}}>
                  <FlatList
                    horizontal
                    pagingEnabled={true}
                    data={uploadImageArray}
                    renderItem={({item}) => {
                      // const uri = Platform.OS == 'ios' ? item.path : item.path;
                      return (
                        <Image
                          source={{uri: item.path}}
                          resizeMode="cover"
                          style={{
                            width: Dimensions.get('window').width * 0.876,
                            height: 225,
                            borderRadius: 5,
                          }}
                        />
                      );
                    }}
                    keyExtractor={(item, index) => index + ''}
                  />
                  <TouchableOpacity
                    onPress={() => this.uploadImage()}
                    style={{
                      zIndex: 1,
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      padding: 5,
                    }}>
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
                        style={{height: 13, width: 13}}
                        source={require('../../images/add.png')}
                        resizeMode={'contain'}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
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
                    Select photos or videos
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              multiline={true}
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font,
                {
                  fontSize: 14,
                  minHeight: 70,
                  textAlign: 'center',
                  overflow: 'hidden',
                  width: '92%',
                  marginBottom: 15,
                  marginTop: 10,
                },
              ]}
              placeholder="Write something here"
              onChangeText={hummDescription => this.setState({hummDescription})}
              value={hummDescription}
            />
          </View>
          <View style={{paddingTop: 15}}>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'ios') {
                  this.showiOSPicker();
                }
              }}
              style={{paddingTop: 20}}>
              <View
                style={{
                  width: '85%',
                  alignSelf: 'center',
                  borderRadius: 15,
                  backgroundColor: '#F5F5F5',
                  height: 50,
                }}>
                {Platform.OS === 'android' ? (
                  <Picker
                    style={[
                      AppStyle.dark_TextColor,
                      AppStyle.app_font,
                      {
                        width: '100%',
                        fontSize: 14,
                        height: 50,
                        backgroundColor: 'transparent',
                      },
                    ]}
                    mode={'dialog'}
                    itemStyle={[
                      AppStyle.app_font,
                      {fontSize: 14, textAlign: 'center', color: '#9B9B9B'},
                    ]}
                    selectedValue={this.state.category}
                    onValueChange={(itemValue, itemPosition) => {
                      if (itemValue !== 'Add marker') {
                        this.setState({
                          category: itemValue,
                          choosenIndex: itemPosition,
                        });
                      } else {
                        this.setState({category: '', choosenIndex: 0});
                      }
                    }}>
                    {this.state.pickerData.map((item, index) => (
                      <Picker.Item label={item} value={item} key={index} />
                    ))}
                  </Picker>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        AppStyle.dark_TextColor,
                        AppStyle.app_font,
                        {fontSize: 14},
                      ]}>
                      {' '}
                      {this.state.category === ''
                        ? 'Add marker'
                        : this.state.category}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: 'center', marginBottom: 30, paddingTop: 20}}
              onPress={this.UploadMarker}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[ButtonGradientColor1, ButtonGradientColor2]}
                style={AppStyle.appButton_background}>
                <Text style={AppStyle.appButton_Text}>HUM IT</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this.state.showiOSPicker ? (
          <CustomiOSPicker
            pickerData={this.state.pickerData}
            callbackFromiOSPickerData={this.callbackfromPicker}
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
      // </KeyboardAvoidingView>
    );
  }
}
