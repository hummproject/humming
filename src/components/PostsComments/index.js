import React, {Component} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  BackHandler,
} from 'react-native';
import {AppStyle} from '../../App.style';
import AppConfig from '../../config/constants';
import AsyncStorage from '@react-native-community/async-storage';
import PostsCommentsListComponent from '../PostsCommentsListComponent';
import Toast from 'react-native-easy-toast';
import {SafeAreaView} from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

export default class PostsComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      commentsListArray: [], //this is the array
      error: null,
      userCommentedText: '',
      clearInput: false,
      showtoast: false,
      userData: {},
      is_connected: false,
      postDetails: this.props.route.params.postDetails,
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      this.setState({
        userData: userData,
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
    this.fetchCommentsforPosts();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    this.netinfoSubscribe();
  }

  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  };

  PostComment = () => {
    this.PostCommentOfUser();
  };

  returnBack = () => {
    this.props.navigation.goBack();
  };

  dismissKeyboard() {
    Keyboard.dismiss();
  }

  PostCommentOfUser = () => {
    this.dismissKeyboard();
    // console.debug('post Details : Fetch', this.state.postDetails);
    const {
      userData,
      userCommentedText,
      postDetails,
      commentsListArray,
      is_connected,
    } = this.state;
    this.setState({
      showtoast: true,
    });
    if (userCommentedText !== '') {
      const token = userData.token;
      const url = AppConfig.DOMAIN + AppConfig.ADD_COMMENTS_TO_MARKER;
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
          token: token,
        },
        body: JSON.stringify({
          markerid: postDetails.marker_id,
          content: userCommentedText,
        }),
      })
        .then(response => response.json())
        .then(responseData => {
          // console.debug('comments Page comment response:', responseData)
          this.setState({
            loading: false,
          });
          if (responseData.status === 200) {
            var data = responseData.data;
            data['firstname'] = userData.firstname;
            data['lastname'] = userData.lastname;
            data['userdp'] = userData.userdp;
            var commentListAry = commentsListArray;
            commentListAry.unshift(data);
            console.debug('', commentListAry);
            this.setState({
              commentsListArray: commentListAry,
              error: responseData.error || null,
              clearInput: true,
              userCommentedText: '',
            });
          } else {
            this.refs.toast.show(responseData.message);
          }
        })
        .catch(error => {
          console.debug('comments Page response ERROR:', error);
          this.setState({error, loading: false});
          this.refs.toast.show('Something went wrong. Please try again later');
        });
    } else {
      this.refs.toast.show('Please write someting to post');
    }
  };

  fetchCommentsforPosts = () => {
    // console.debug('post Details : Fetch', this.state.postDetails);
    const {userData, postDetails, is_connected} = this.state;
    const token = userData.token;
    const url = AppConfig.DOMAIN + AppConfig.GET_MARKER_COMMENTS;
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
        token: token,
      },
      body: JSON.stringify({
        markerid: postDetails.marker_id,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        // console.debug('comments Page response:', responseData)
        this.setState({
          loading: false,
        });
        if (responseData.status === 200) {
          if (Array.isArray(responseData.data)) {
            this.setState({
              commentsListArray: responseData.data,
              error: responseData.error || null,
            });
          } else {
            this.setState({
              commentsListArray: [],
              error: responseData.error || null,
            });
          }
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('comments Page response ERROR:', error);
        this.setState({error, loading: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  render() {
    const {
      commentsListArray,
      loading,
      userCommentedText,
      postDetails,
      userData,
    } = this.state;
    // console.debug("user details : post comments", userData)
    console.debug('Post comments : List Ary', commentsListArray);
    let userdp = userData.userdp;
    var markercommentArray;
    if (commentsListArray.length === 0) {
      markercommentArray =
        postDetails.markercomments !== null ? postDetails.markercomments : [];
    } else {
      markercommentArray = commentsListArray;
    }
    return loading ? (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.headerstyle}>
          <TouchableOpacity
            onPress={this.returnBack}
            style={{padding: 8, marginLeft: 10}}>
            <Image
              source={require('../../images/back.png')}
              resizeMode={'contain'}
              style={{width: 13, height: 20, marginLeft: 10}}
            />
          </TouchableOpacity>
          <Text
            style={[
              AppStyle.dark_TextColor,
              AppStyle.app_font_heading,
              {fontSize: 20},
            ]}>
            Comments
          </Text>
          <View style={styles.commentsCountcontainer}>
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
          </View>
        </View>
        <ActivityIndicator
          animating={true}
          style={AppStyle.activityIndicator}
          size="large"
        />
      </SafeAreaView>
    ) : (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.headerstyle}>
          <TouchableOpacity
            onPress={this.returnBack}
            style={{padding: 8, marginLeft: 10}}>
            <Image
              source={require('../../images/back.png')}
              resizeMode={'contain'}
              style={{width: 13, height: 20, marginLeft: 10}}
            />
          </TouchableOpacity>
          <Text
            style={[
              AppStyle.dark_TextColor,
              AppStyle.app_font_heading,
              {fontSize: 20},
            ]}>
            Comments
          </Text>
          <View style={styles.commentsCountcontainer}>
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
          </View>
        </View>
        <FlatList
          data={commentsListArray}
          renderItem={({item}) => (
            <PostsCommentsListComponent
              key={item.commentid}
              commentData={item}
            />
          )}
          keyExtractor={(item, index) => item + index}
        />
        <View style={styles.footerstyle}>
          <View
            style={[
              {
                width: 35,
                height: 35,
                marginLeft: 20,
                borderRadius: 17.5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F5F5F5',
              },
            ]}>
            <Image
              source={
                userdp == null || userdp == ''
                  ? require('../../images/profile_icon.png')
                  : {uri: userdp}
              }
              style={
                userdp == null || userdp == ''
                  ? {height: 15, width: 15}
                  : {width: 35, height: 35, borderRadius: 17.5}
              }
              resizeMode={userdp == null || userdp == '' ? 'contain' : 'cover'}
            />
          </View>
          <TextInput
            style={[
              AppStyle.dark_TextColor,
              AppStyle.app_font,
              {fontSize: 14, height: 40, flex: 2, marginLeft: 15},
            ]}
            placeholder="Post a Comment"
            value={!this.state.clearInput ? userCommentedText : null}
            onChangeText={text =>
              this.setState({
                userCommentedText: text,
              })
            }
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginRight: 15,
              marginLeft: 10,
            }}>
            <TouchableOpacity onPress={this.PostComment}>
              <Text
                style={[
                  AppStyle.dark_TextColor,
                  AppStyle.app_font,
                  {fontSize: 14},
                ]}>
                Post
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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

  footerstyle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 55,
    elevation: 2,
    borderTopColor: '#ECECEC',
    borderTopWidth: 1,
    alignItems: 'center',
  },

  commentsCountcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 20,
  },
});
