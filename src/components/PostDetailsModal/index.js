import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {AppStyle} from '../../App.style';
import LinearGradient from 'react-native-linear-gradient';
import {
  ButtonGradientColor1,
  ButtonGradientColor2,
} from '../../config/constants';
import AppConfig from '../../config/constants';
import ProgressiveImage from '../../ProgressiveImage';
import {ScrollView} from 'react-native-gesture-handler';
import Toast from 'react-native-easy-toast';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default class PostDetailsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isfromUserProfile: this.props.isfromUserProfile,
      isfromProfile: this.props.isfromProfile,
      userData: {},
      error: null,
      isModalVisible: true,
      postDetails: this.props.postDetails,
      isMarkerAlreadyLiked: null,
      postLikesCount:
        this.props.postDetails.markerlike !== null
          ? this.props.postDetails.markerlike.length
          : 0,
      PostlikeorUnlikeImgUri: require('../../images/unlike-icon.png'),
      is_connected: false,
      menuTop: 0,
      showPostMenuOptions: false,
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      var isAlreadyLiked = false;
      const {postDetails} = this.state;
      if (postDetails.markerlike !== null) {
        for (let markerlikeObj of postDetails.markerlike) {
          if (markerlikeObj.userid === userData.userid) {
            isAlreadyLiked = true;
          }
        }
      }
      this.setState({
        userData: userData,
        isMarkerAlreadyLiked: isAlreadyLiked,
        PostlikeorUnlikeImgUri: isAlreadyLiked
          ? require('../../images/like-icon.png')
          : require('../../images/unlike-icon.png'),
      });
    });
    this.netinfoSubscribe = NetInfo.addEventListener(state => {
      if (state.isInternetReachable) {
        this.setState({is_connected: true});
      } else {
        this.setState({is_connected: false});
      }
    });
    const {postDetails} = this.state;
    if (!('username' in postDetails)) {
      this.makeRequesttoFetchPostUserDetails();
    }
  }

  componentWillUnmount() {
    this.netinfoSubscribe();
  }

  GotoPostCommentsPage = () => {
    const {navigation} = this.props;
    this.props.onClose();
    navigation.navigate('postscomments', {
      postDetails: this.state.postDetails,
    });
  };

  GotoPostUserProfile = () => {
    const {navigation} = this.props;
    if (this.state.isfromProfile) {
      return;
    }
    this.props.onClose();
    navigation.navigate('postuserprofile', {
      postDetails: this.state.postDetails,
    });
  };

  LikeOrUnlikePost = () => {
    this.makeRequesttoLikeorUnlikethePost();
  };

  makeRequesttoFetchPostUserDetails = () => {
    const {userData, postDetails, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.GET_POST_USER_PROFILE;
    console.debug('URL:', url);
    console.debug(
      'Request:',
      JSON.stringify({
        userid: postDetails.user_id,
      }),
    );
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
        userid: postDetails.user_id,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.debug('Post USER Profile Page response:', responseData);
        this.setState({loading: false});
        if (responseData.status === 200) {
          var postDetailsTemp = postDetails;
          postDetailsTemp['userid'] = postDetails.user_id;
          postDetailsTemp['userdp'] = responseData.data.userdp;
          postDetailsTemp['firstname'] = responseData.data.firstname;
          postDetailsTemp['lastname'] = responseData.data.lastname;
          postDetailsTemp['username'] = responseData.data.username;
          console.log('Profile PostDetails', postDetailsTemp);
          this.setState({postDetails: postDetailsTemp});
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Postuser Profile Page response ERROR:', error);
        this.setState({error: error, loading: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  makeRequesttoLikeorUnlikethePost = () => {
    const {
      postDetails,
      userData,
      PostlikeorUnlikeImgUri,
      postLikesCount,
      isMarkerAlreadyLiked,
      is_connected,
    } = this.state;
    var likeorunlikeImgUri = PostlikeorUnlikeImgUri;
    var markerLikesCount = postLikesCount;
    var isLiked = 'false';
    if (!isMarkerAlreadyLiked) {
      isLiked = 'true';
    } else {
      isLiked = 'false';
    }
    const url = AppConfig.DOMAIN + AppConfig.LIKE_OR_UNLIKE_MARKER;
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
        markerid: postDetails.marker_id,
        isLiked: isLiked,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.debug('Posts Details lIKE Response:', responseData);
        this.setState({loading: false});
        if (responseData.status === 200) {
          if (!('message' in responseData.data)) {
            if (!isMarkerAlreadyLiked) {
              markerLikesCount = markerLikesCount + 1;
              likeorunlikeImgUri = require('../../images/like-icon.png');
            } else {
              markerLikesCount = markerLikesCount - 1;
              likeorunlikeImgUri = require('../../images/unlike-icon.png');
            }
            this.setState({
              isMarkerAlreadyLiked: !isMarkerAlreadyLiked,
              PostlikeorUnlikeImgUri: likeorunlikeImgUri,
              postLikesCount: markerLikesCount,
            });
          } else {
            // console.debug("LIKE RESPONSE: ELSE", responseData.data.message)
          }
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Posts Details lIKE response ERROR:', error);
        this.setState({error, loading: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  deletePostOption = () => {
    this.props.deletePost(this.state.postDetails);
    this.props.onClose();
  };

  showPostMenuOptions = () => {
    this.setState({
      showPostMenuOptions: !this.state.showPostMenuOptions,
    });
  };

  render() {
    const {
      loading,
      PostlikeorUnlikeImgUri,
      postDetails,
      isModalVisible,
      isfromUserProfile,
    } = this.state;
    var tagName =
      postDetails.username !== undefined ? postDetails.username : ' ---';
    var firstName =
      postDetails['firstname'] !== undefined ? postDetails['firstname'] : '---';
    var lastName =
      postDetails['lastname'] !== undefined ? postDetails['lastname'] : '';
    var userName = firstName + ' ' + lastName;
    var category =
      postDetails.category !== undefined ? postDetails.category : '---';
    var postDesc =
      postDetails.description !== undefined ? postDetails.description : '---';
    var userdpUri =
      postDetails.userdp !== undefined ? postDetails.userdp : null;
    var postimagesAry =
      postDetails.media !== undefined
        ? postDetails.media !== null
          ? postDetails.media
          : []
        : [];
    var markercommentArray =
      postDetails.markercomments !== undefined
        ? postDetails.markercomments !== null
          ? postDetails.markercomments
          : []
        : [];
    var markerLikesCount = this.state.postLikesCount;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          this.props.onClose();
        }}>
        <TouchableHighlight
          style={{flex: 1}}
          onPress={() => {
            this.props.onClose();
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
              <View style={styles.modalView}>
                <View
                  style={styles.TopContainer}
                  onTouchStart={e => {
                    // console.log('touchMove', e.nativeEvent);
                    this.setState({menuTop: e.nativeEvent.locationY + 20});
                  }}>
                  <TouchableOpacity
                    onPress={this.GotoPostUserProfile}
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 30,
                      marginLeft: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#F5F5F5',
                    }}>
                    <Image
                      source={
                        userdpUri == null
                          ? require('../../images/profile_icon.png')
                          : {uri: userdpUri}
                      }
                      style={{
                        height: userdpUri == null ? 25 : 60,
                        width: userdpUri == null ? 25 : 60,
                        borderRadius: userdpUri == null ? 0 : 30,
                      }}
                      resizeMode={userdpUri == null ? 'contain' : 'cover'}
                    />
                  </TouchableOpacity>
                  <View style={styles.container_text}>
                    <Text
                      style={[
                        AppStyle.dark_TextColor,
                        AppStyle.app_font,
                        {
                          fontSize: 16,
                          paddingBottom: 0,
                          textTransform: 'capitalize',
                        },
                      ]}>
                      {userName}
                    </Text>
                    <Text
                      style={[
                        AppStyle.light_TextColor,
                        AppStyle.app_font,
                        {fontSize: 14, paddingBottom: 5},
                      ]}>
                      @{tagName}
                    </Text>
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
                        {category}
                      </Text>
                    </LinearGradient>
                  </View>
                  {isfromUserProfile ? (
                    <TouchableOpacity
                      onPress={this.showPostMenuOptions}
                      style={{padding: 8}}>
                      <Image
                        source={require('../../images/horizontal_menu.png')}
                        style={{
                          width: 15,
                          height: 8,
                          marginRight: 10,
                          marginLeft: 10,
                          alignSelf: 'baseline',
                        }}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={{width: '100%', justifyContent: 'center'}}>
                  {postDesc === '' ? null : (
                    <Text
                      style={[
                        AppStyle.dark_TextColor,
                        AppStyle.app_font,
                        {
                          fontSize: 15,
                          marginLeft: 15,
                          marginRight: 15,
                          marginBottom:
                            postimagesAry.length === 0 ||
                            postimagesAry[0] === null
                              ? 0
                              : 15,
                        },
                      ]}>
                      {postDesc}
                    </Text>
                  )}
                  <ScrollView>
                    <View onStartShouldSetResponder={boolean => true}>
                      <FlatList
                        horizontal
                        contentContainerStyle={{paddingRight: 15}}
                        pagingEnabled={false}
                        data={postimagesAry}
                        renderItem={({item}) => {
                          let imageUri = item != null ? item : '';
                          if (imageUri != '') {
                            return (
                              <View style={{marginLeft: 15}}>
                                <ProgressiveImage
                                  source={{uri: imageUri}}
                                  resizeMode={'cover'}
                                  style={{
                                    width:
                                      Dimensions.get('window').width * 0.9 - 30,
                                    height: 200,
                                  }}
                                />
                              </View>
                            );
                          } else {
                            return null;
                          }
                        }}
                        keyExtractor={(item, index) => index + ''}
                      />
                    </View>
                  </ScrollView>
                </View>
                <View style={styles.BottomContainer}>
                  <TouchableOpacity
                    onPress={this.LikeOrUnlikePost}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <Image
                      source={PostlikeorUnlikeImgUri}
                      style={{width: 30, height: 25, marginLeft: 15}}
                      resizeMode={'contain'}
                    />
                    <Text
                      style={[
                        AppStyle.dark_TextColor,
                        AppStyle.app_font,
                        {fontSize: 14, marginLeft: 10, marginRight: 25},
                      ]}>
                      {markerLikesCount}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.GotoPostCommentsPage}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <Image
                      source={require('../../images/comment-icon.png')}
                      resizeMode={'contain'}
                      style={{width: 25, height: 25}}
                    />
                    <Text
                      style={[
                        AppStyle.dark_TextColor,
                        AppStyle.app_font,
                        {fontSize: 14, marginLeft: 10},
                      ]}>
                      {markercommentArray.length}
                    </Text>
                  </TouchableOpacity>
                </View>
                {this.state.showPostMenuOptions ? (
                  <TouchableHighlight
                    underlayColor="#ffffff00"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                    onPress={() => {
                      this.setState({
                        showPostMenuOptions: !this.state.showPostMenuOptions,
                      });
                    }}>
                    <View
                      style={[
                        styles.postMenuOptionStyle,
                        {top: this.state.menuTop},
                      ]}>
                      <TouchableOpacity onPress={this.deletePostOption}>
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
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableHighlight>
        {loading ? (
          <ActivityIndicator
            animating={true}
            style={AppStyle.activityIndicator}
            size="large"
          />
        ) : null}
        <Toast ref="toast" style={AppStyle.toast_style} />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
    elevation: 2,
  },

  TopContainer: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  BottomContainer: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingBottom: 15,
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 15,
    justifyContent: 'flex-start',
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

  postMenuOptionStyle: {
    zIndex: 1,
    position: 'absolute',
    right: 15,
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    borderColor: '#ececec',
    borderWidth: 0.5,
  },
});
