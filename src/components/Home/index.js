import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  BackHandler,
  Alert,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import HomePagePost from '../HomePagePost';
import {AppStyle} from '../../App.style';
import AppConfig from '../../config/constants';
import Toast from 'react-native-easy-toast';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import {Menu} from 'react-native-paper';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      postsListArray: [], //this is the array
      page: 0,
      latlang: '0.000,0.000',
      error: null,
      userData: {},
      userDp: null,
      showMenuOptions: false,
      menuTop: 60,
      deletePostDetails: {},
      isListEnded: false,
      refreshing: false,
      pullrefreshing: false,
      is_connected: false,
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      this.setState({
        userData: userData,
        userDp: userData.userdp,
        refresh: false,
      });
    });
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      this.fetchLocation();
    } else {
      this.requestLocationPermission();
    }
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      this.setState(
        {
          postsListArray: [],
          page: 0,
          isListEnded: false,
          showMenuOptions: false,
        },
        this.makeRequesttoFetchPosts,
      );
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
        this.makeRequesttoFetchPosts();
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
            postsListArray: [],
            page: 0,
          },
          this.makeRequesttoFetchPosts,
        );
      },
      error => {
        this.setState(
          {
            latlang: '0.000,0.000',
            postsListArray: [],
            page: 0,
          },
          this.makeRequesttoFetchPosts,
        );
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this._unsubscribe();
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

  makeRequesttoFetchPosts = () => {
    const {page, userData, latlang, postsListArray, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS;
    this.setState({loading: true});
    if (!is_connected) {
      this.setState({
        loading: false,
        refreshing: false,
        pullrefreshing: false,
      });
      this.refs.toast.show('Internet is not connected, Please try again!');
      return;
    }
    console.debug(url);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: userData.token,
      },
      body: JSON.stringify({
        location: latlang,
        pageno: page,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.debug('Home Posts response:', responseData);
        this.setState({
          loading: false,
          refreshing: false,
        });
        if (responseData.status === 200) {
          if (responseData.data.length === 0 && page != 0) {
            this.setState({
              isListEnded: true,
              pullrefreshing: false,
            });
            // console.log('List Ended');
          } else {
            var postListAry = postsListArray;
            let postsAry = responseData.data;
            postListAry = postListAry.concat(postsAry);
            this.setState({
              postsListArray: postListAry,
              isListEnded: false,
              pullrefreshing: false,
              error: responseData.error || null,
            });
          }
          AsyncStorage.setItem(
            'PostsData',
            JSON.stringify(this.state.postsListArray),
          );
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Home Posts response ERROR:', error);
        this.setState({error, loading: false, pullrefreshing: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  makeRequesttoDeletePost = () => {
    const {
      userData,
      postsListArray,
      deletePostDetails,
      is_connected,
    } = this.state;
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
        postid: deletePostDetails.marker_id,
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
        postid: deletePostDetails.marker_id,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.debug('Delete Home Posts response:', responseData);
        this.setState({
          loading: false,
          showMenuOptions: !this.state.showMenuOptions,
        });
        if (responseData.status === 200) {
          var responseData = responseData.data;
          if (
            responseData.message.toLowerCase() === 'post deleted successfully'
          ) {
            var newpostsArray = postsListArray;
            newpostsArray = newpostsArray.filter(function(obj) {
              return obj.marker_id !== deletePostDetails.marker_id;
            });
            this.setState({
              postsListArray: newpostsArray,
            });
            AsyncStorage.setItem(
              'PostsData',
              JSON.stringify(this.state.postsListArray),
            );
          }
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Delete Home Posts response ERROR:', error);
        this.setState({error, loading: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  navigatetoUserProfile = () => {
    this.props.navigation.navigate('userprofile');
  };

  showMenuOptions = (menutop, postDetails) => {
    // for Delete Post
    this.setState({
      showMenuOptions: !this.state.showMenuOptions,
      menuTop: menutop,
      deletePostDetails: postDetails,
    });
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 0,
        pullrefreshing: true,
        isListEnded: false,
        postsListArray: [],
      },
      () => {
        this.makeRequesttoFetchPosts();
      },
    );
  };

  render() {
    const {
      postsListArray,
      loading,
      userData,
      userDp,
      pullrefreshing,
    } = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FBFBFB'}}>
        <StatusBar barStyle={'dark-content'} />
        <View style={styles.headerstyle}>
          <Image
            source={require('../../images/home_header_logo.png')}
            style={{marginLeft: 20, height: 45, width: 125}}
            resizeMode={'contain'}
          />
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
        </View>
        <View style={{flex: 1}}>
          <FlatList
            contentContainerStyle={{paddingBottom: 10}}
            data={postsListArray}
            renderItem={({item}) => (
              <HomePagePost
                key={item}
                markerData={item}
                userData={userData}
                navigation={this.props.navigation}
                showMenuOptions={this.showMenuOptions}
              />
            )}
            keyExtractor={(item, index) => item.marker_id + index}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (!this.state.isListEnded) {
                if (this.state.refreshing) {
                  return null;
                }
                this.setState(
                  prevState => {
                    return {refreshing: true, page: prevState.page + 1};
                  },
                  () => {
                    this.makeRequesttoFetchPosts();
                  },
                );
              }
            }}
            refreshing={this.state.pullrefreshing}
            onRefresh={this.handleRefresh}
          />
        </View>
        {this.state.showMenuOptions ? (
          <TouchableHighlight
            underlayColor="#ffffff00"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // backgroundColor: 'rgba(52, 52, 52, 0.5)',
            }}
            onPress={() => {
              this.setState({
                showMenuOptions: !this.state.showMenuOptions,
              });
            }}>
            <View style={[styles.MenuOptionStyle, {top: this.state.menuTop}]}>
              <TouchableOpacity onPress={() => this.makeRequesttoDeletePost()}>
                <Text
                  style={[
                    AppStyle.dark_TextColor,
                    AppStyle.app_font_heading,
                    {fontSize: 14},
                  ]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableHighlight>
        ) : null}
        {loading && !pullrefreshing ? (
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

const styles = StyleSheet.create({
  headerstyle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 70,
    elevation: 2,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  MenuOptionStyle: {
    zIndex: 1,
    position: 'absolute',
    right: 20,
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    borderColor: '#ececec',
    borderWidth: 0.5,
    // borderTopWidth: 0,
  },
});
