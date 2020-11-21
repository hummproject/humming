import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  Image,
  SectionList,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  Keyboard,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from './search.styles';
import SearchPosts from '../SearchPosts';
import Toast from 'react-native-easy-toast';
import {AppStyle} from '../../App.style';
import NetInfo from '@react-native-community/netinfo';
import AppConfig from '../../config/constants';
import PostDetailsModal from '../PostDetailsModal';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userData: {},
      userDp: null,
      dataArray: [], //this is the array
      error: null,
      searchedText: '',
      postDetails: {},
      isMarkerAlreadyLiked: null,
      showPostModal: false,
      postLikesCount: 0,
      PostlikeorUnlikeImgUri: require('../../images/unlike-icon.png'),
      is_connected: false,
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      this.setState({
        userData: userData,
        userDp: userData.userdp,
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
    this.makeRequesttoFetchTopMarkers();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      var dataAry = this.state.dataArray;
      if (dataAry.length > 1) {
        dataAry.shift();
      }
      this.setState({
        searchedText: '',
        dataArray: dataAry,
      });
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

  SearchPosts = () => {
    Keyboard.dismiss();
    console.debug('Search Text is:', this.state.searchedText.trim());
    if (this.state.searchedText.trim() !== '') {
      this.makeRequesttoFetchSearchedMarkers();
    }
  };

  makeRequesttoFetchSearchedMarkers = () => {
    const {userData, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.SEARCH_ALL_MARKERS;
    console.debug(url);
    console.debug(
      JSON.stringify({
        searchname: this.state.searchedText.trim(),
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
        searchname: this.state.searchedText.trim(),
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.debug('Search page Search MARKERS response:', responseData);
        if (responseData.status === 200) {
          let responseAry = responseData.data;
          var categoriesAry = new Array();
          for (let obj of responseAry) {
            if (categoriesAry.indexOf(obj.category) === -1) {
              categoriesAry.push(obj.category);
            }
          }
          //   console.debug('category array', categoriesAry);
          var searchResultdataAry = new Array();
          for (var i = 0; i < categoriesAry.length; i++) {
            let category = categoriesAry[i];
            var categorywiseMarkersAry = new Array();
            for (let object of responseAry) {
              if (object.category === category) {
                categorywiseMarkersAry.push(object);
              }
              continue;
            }
            // console.debug(
            //   'categorywiseMarkers data Array',
            //   categorywiseMarkersAry,
            // );
            searchResultdataAry.push({
              category: category,
              data: categorywiseMarkersAry,
            });
          }
          var dataArray = this.state.dataArray;
          for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].title && dataArray[i].title === 'Search Results') {
              dataArray.splice(i, 1);
              break;
            }
          }
          if (searchResultdataAry && searchResultdataAry.length) {
            // not empty
            let dataObj = {title: 'Search Results', data: searchResultdataAry};
            dataArray.unshift(dataObj);
            // console.debug('Data Array Final', dataArray)
          } else {
            // empty
            this.refs.toast.show('No search results found');
          }
          this.setState({
            dataArray: dataArray,
            error: responseData.error || null,
            loading: false,
          });
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Home Posts response ERROR:', error);
        this.setState({error, loading: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  makeRequesttoFetchTopMarkers = () => {
    const {userData, is_connected} = this.state;
    const url = AppConfig.DOMAIN + AppConfig.SEARCH_TOP_MARKERS;
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
      body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then(responseData => {
        console.debug('Search page TOP MARKERS response:', responseData);
        if (responseData.status === 200) {
          let responseAry = responseData.data.markers;
          // console.debug('Markers Response', responseAry);
          let categoriesAry = responseData.data.categories;
          var dataAry = new Array();
          for (var i = 0; i < categoriesAry.length; i++) {
            let category = categoriesAry[i];
            var categorywiseMarkersAry = new Array();
            for (let obj of responseAry) {
              if (obj['category'] === category) {
                categorywiseMarkersAry.push(obj);
              }
              continue;
            }
            dataAry.push({category: category, data: categorywiseMarkersAry});
          }
          // console.debug('Categories sorted DATA Array', dataAry);
          let dataObj = {title: 'Trending Categories', data: dataAry};
          this.setState({
            dataArray: [dataObj],
            error: responseData.error || null,
            loading: false,
          });
        } else {
          this.refs.toast.show(responseData.message);
        }
      })
      .catch(error => {
        console.debug('Home Posts response ERROR:', error);
        this.setState({error, loading: false});
        this.refs.toast.show('Something went wrong. Please try again later');
      });
  };

  ShowSearchPosts = postData => {
    console.log('Post Details', postData);
    this.setState({
      postDetails: postData,
      showPostModal: !this.state.showPostModal,
    });
  };

  navigatetoUserProfile = () => {
    this.props.navigation.navigate('userprofile');
  };

  closePostDetailsModal = () => {
    this.setState({
      showPostModal: !this.state.showPostModal,
      postDetails: {},
    });
  };

  render() {
    const {dataArray, loading, userDp, postDetails} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FBFBFB'}}>
        <View style={styles.headerstyle}>
          <View style={styles.searchView}>
            <Image
              style={{width: 25, height: 25, marginLeft: 10}}
              source={require('../../images/search.png')}
              resizeMode={'contain'}
            />
            <TextInput
              style={[
                AppStyle.dark_TextColor,
                AppStyle.app_font_heading,
                {flex: 1, fontSize: 14, marginLeft: 5, marginRight: 10},
              ]}
              clearButtonMode="always"
              placeholder="Search anything"
              value={this.state.searchedText}
              onChangeText={text =>
                this.setState({
                  searchedText: text,
                })
              }
              onSubmitEditing={event => this.SearchPosts()}
            />
          </View>
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
        <SectionList
          sections={dataArray}
          keyExtractor={(item, index) => item + index}
          renderItem={({index, item}) => (
            <SearchPosts
              key={item.category}
              postData={item}
              onPress={this.ShowSearchPosts}
            />
          )}
          extraData={this.state}
          renderSectionHeader={({section: {title}}) => (
            <View style={{height: 50, flex: 1, paddingTop: 20}}>
              <Text
                style={[
                  AppStyle.dark_TextColor,
                  AppStyle.app_font_heading,
                  {fontSize: 16, paddingLeft: 15},
                ]}>
                {title}
              </Text>
            </View>
          )}
        />
        {this.state.showPostModal ? (
          <PostDetailsModal
            postDetails={postDetails}
            onClose={this.closePostDetailsModal}
            navigation={this.props.navigation}
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
}
