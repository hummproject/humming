import React, {Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import BanterPagePosts from '../BanterPagePosts';
import AsyncStorage from '@react-native-community/async-storage';
import {AppStyle} from '../../App.style';
import LinearGradient from 'react-native-linear-gradient';
import AppConfig from '../../config/constants';
import {
  ButtonGradientColor1,
  ButtonGradientColor2,
} from '../../config/constants';
import Toast from 'react-native-easy-toast';
import NetInfo from '@react-native-community/netinfo';

export default class Banter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userListArray: [], //this is the array
      error: null,
      postsData: [],
      userData: {},
      userDp: null,
      isUserSelected: false,
      userSelectedPost: {},
      is_connected: false,
    };
  }

  componentDidMount() {
    this.PrepareData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.netinfoSubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable) {
        this.setState({is_connected: true});
      } else {
        this.setState({is_connected: false});
      }
    });
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      this.PrepareData();
    });
  }

  async PrepareData() {
    await AsyncStorage.getItem('PostsData').then(value => {
      const postsData = JSON.parse(value);
      this.setState({
        postsData: postsData,
        isUserSelected: false,
        userSelectedPost: {},
      });
    });
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      this.setState({
        userData: userData,
        userDp: userData.userdp,
      });
    });
    var postsArray = this.state.postsData;
    postsArray.sort(function(a, b) {
      const objA = a.markercomments === null ? 0 : a.markercomments.length;
      const objB = b.markercomments === null ? 0 : b.markercomments.length;
      let comparison = 0;
      if (objA > objB) {
        comparison = -1;
      } else if (objA < objB) {
        comparison = 1;
      }
      return comparison;
    });
    var uniquePostsArray = postsArray.reduce((unique, o) => {
      if (!unique.some(obj => obj.userid === o.userid)) {
        unique.push(o);
      }
      return unique;
    }, []);
    this.setState({
      userListArray: uniquePostsArray,
    });
    if (this.state.userListArray === 0) {
      this.makeRequesttoFetchPosts();
    }
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

  showPostBasedonUserSelection = (item, index) => {
    console.debug('user selected', item);
    console.debug('user selected index', index);
    this.setState({
      isUserSelected: true,
      userSelectedPost: item,
    });
    // this.flatListRef.scrol
    // scrollToItem({
    //     animated:true, //can also be false
    //     item:item,
    //     viewPosition:0 //this is the first position that is currently attached to the window
    // })
  };

  makeRequesttoFetchPosts = () => {
    const {userData, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS;
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
        location: '78.4373585,17.4337072',
        pageno: '0',
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.debug('Banter Posts response:', responseData);
        this.setState({
          loading: false,
        });
        if (responseData.status === 200) {
          AsyncStorage.setItem('PostsData', JSON.stringify(responseData.data));
          var postsArray = responseData.data;
          postsArray.sort(function(a, b) {
            const objA =
              a.markercomments === null ? 0 : a.markercomments.length;
            const objB =
              b.markercomments === null ? 0 : b.markercomments.length;
            let comparison = 0;
            if (objA > objB) {
              comparison = -1;
            } else if (objA < objB) {
              comparison = 1;
            }
            return comparison;
          });
          // console.debug('sorted Array:', postsArray);
          var uniquePostsArray = postsArray.reduce((unique, o) => {
            if (!unique.some(obj => obj.userid === o.userid)) {
              unique.push(o);
            }
            return unique;
          }, []);
          // console.debug('sorted Array: Unique', uniquePostsArray);
          this.setState({
            userListArray: uniquePostsArray,
          });
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Banter Posts response ERROR:', error);
        this.setState({error, loading: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  navigatetoUserProfile = () => {
    this.props.navigation.navigate('userprofile');
  };

  render() {
    const {
      userListArray,
      userSelectedPost,
      isUserSelected,
      loading,
      userDp,
    } = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
        <View style={styles.headerstyle}>
          <Text
            style={[
              AppStyle.dark_TextColor,
              AppStyle.app_font_heading,
              {fontSize: 20, marginLeft: 20},
            ]}>
            Banter
          </Text>
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
        <View style={{justifyContent: 'space-around'}}>
          <FlatList
            ref={ref => {
              this.flatListRef = ref;
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={userListArray}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 15,
                    backgroundColor: '#ffffff',
                  }}
                  onPress={() =>
                    this.showPostBasedonUserSelection(item, index)
                  }>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                      height: 90,
                      width: 90,
                      borderRadius: 45,
                      borderWidth: 2,
                      borderColor: '#E62469',
                      overflow: 'hidden',
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        height: 80,
                        width: 80,
                        borderRadius: 40,
                        borderWidth: 1,
                        borderColor: '#FC4735',
                        backgroundColor: '#F5F5F5',
                      }}>
                      <Image
                        source={
                          item.userdp == null
                            ? require('../../images/profile_icon.png')
                            : {uri: item.userdp}
                        }
                        style={{
                          height: item.userdp == null ? 35 : 80,
                          width: item.userdp == null ? 35 : 80,
                        }}
                        resizeMode={item.userdp == null ? 'contain' : 'cover'}
                      />
                    </View>
                  </View>
                  <View>
                    <LinearGradient
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      colors={[ButtonGradientColor1, ButtonGradientColor2]}
                      style={styles.categoryContainer}>
                      <Image
                        source={require('../../images/category_marker_icon.png')}
                        style={{height: 13, width: 13}}
                      />
                      <Text
                        style={[
                          AppStyle.dark_TextColor,
                          AppStyle.app_font,
                          {
                            fontSize: 14,
                            marginLeft: 5,
                            color: 'white',
                            textTransform: 'capitalize',
                          },
                        ]}>
                        {item.category}
                      </Text>
                    </LinearGradient>
                  </View>
                  {userSelectedPost.marker_id === item.marker_id ? (
                    <Image
                      source={require('../../images/triangle.png')}
                      style={{height: 18, width: 25, marginTop: 10}}
                    />
                  ) : (
                    <Image
                      source={require('../../images/triangle.png')}
                      style={{
                        height: 18,
                        width: 25,
                        marginTop: 10,
                        tintColor: 'transparent',
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => index + ''}
          />
        </View>
        {isUserSelected ? (
          <View style={{marginBottom: 20}}>
            <FlatList
              data={[userSelectedPost]}
              renderItem={({item}) => (
                <BanterPagePosts
                  key={item.marker_id}
                  postsData={item}
                  navigation={this.props.navigation}
                />
              )}
              keyExtractor={(item, index) => index + ''}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'stretch',
            }}>
            <Text
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font,
                {fontSize: 14},
              ]}>
              Click on any profile to view their post disscussions
            </Text>
          </View>
        )}
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

  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'baseline',
    justifyContent: 'flex-start',
    padding: 3,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 15,
  },
});
