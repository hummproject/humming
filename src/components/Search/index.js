import React, { Component } from 'react';
import { Text, View, TextInput, SafeAreaView, Image, SectionList, FlatList, ActivityIndicator, TouchableHighlight, Dimensions, TouchableWithoutFeedback, Modal, TouchableOpacity, Keyboard, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { styles } from './search.styles';
import SearchPosts from '../SearchPosts';
import Toast from 'react-native-easy-toast'
import { AppStyle } from '../../App.style'
import NetInfo from "@react-native-community/netinfo";
import LinearGradient from 'react-native-linear-gradient';
import { ButtonGradientColor1, ButtonGradientColor2 } from '../../config/constants';
import AppConfig from '../../config/constants';
import ProgressiveImage from '../../ProgressiveImage'
import { ScrollView } from 'react-native-gesture-handler';

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
        await AsyncStorage.getItem("userData").then(value => {
            const userData = JSON.parse(value);
            this.setState({
                userData: userData,
                userDp: userData.userdp
            });
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.netinfoSubscribe = NetInfo.addEventListener(state => {
            if (state.isInternetReachable) {
                this.setState({ is_connected: true });
            } else {
                this.setState({ is_connected: false });
            }
        });
        this.makeRequesttoFetchTopMarkers();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.netinfoSubscribe();
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    };

    SearchPosts = () => {
        Keyboard.dismiss();
        console.debug('Search Text is:', this.state.searchedText.trim())
        if (this.state.searchedText.trim() !== '') {
            this.makeRequesttoFetchSearchedMarkers();
        }
    };

    makeRequesttoFetchSearchedMarkers = () => {
        const { userData, is_connected } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.SEARCH_ALL_MARKERS
        console.debug(url);
        console.debug(JSON.stringify({
            searchname: this.state.searchedText.trim(),
        }));
        this.setState({ loading: true });
        if (!is_connected) {
            this.setState({ loading: false });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': userData.token
            },
            body: JSON.stringify({
                searchname: this.state.searchedText.trim(),
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Search page Search MARKERS response:', responseData)
                if (responseData.status === 200) {
                    let responseAry = responseData.data;
                    var categoriesAry = new Array();
                    for (let obj of responseAry) {
                        if (categoriesAry.indexOf(obj.category) === -1) {
                            categoriesAry.push(obj.category);
                        }
                    }
                    // console.debug('category array', categoriesAry);
                    var searchResultdataAry = new Array();
                    for (var i = 0; i < categoriesAry.length; i++) {
                        let category = categoriesAry[i];
                        var categorywiseMarkersAry = new Array();
                        for (let object of responseAry) {
                            if (object.category === category) {
                                categorywiseMarkersAry.push(object)
                            }
                            continue;
                        }
                        // console.debug('categorywiseMarkers data Array', categorywiseMarkersAry);
                        searchResultdataAry.push({ 'category': category, 'data': categorywiseMarkersAry });
                    }
                    var dataArray = this.state.dataArray;
                    for (var i = 0; i < dataArray.length; i++) {
                        if (dataArray[i].title && dataArray[i].title === "Search Results") {
                            dataArray.splice(i, 1);
                            break;
                        }
                    }
                    if (searchResultdataAry && searchResultdataAry.length) {
                        // not empty 
                        let dataObj = { 'title': 'Search Results', 'data': searchResultdataAry };
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
                this.setState({ error, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    makeRequesttoFetchTopMarkers = () => {
        const { userData, is_connected } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.SEARCH_TOP_MARKERS
        console.debug(url);
        this.setState({ loading: true });
        if (!is_connected) {
            this.setState({ loading: false });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': userData.token
            },
            body: JSON.stringify({
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Search page TOP MARKERS response:', responseData)
                if (responseData.status === 200) {
                    let responseAry = responseData.data.markers;
                    // console.debug('Markers Response', responseAry);
                    let categoriesAry = responseData.data.categories
                    var dataAry = new Array();
                    for (var i = 0; i < categoriesAry.length; i++) {
                        let category = categoriesAry[i];
                        var categorywiseMarkersAry = new Array();
                        for (let obj of responseAry) {
                            if (obj['category'] === category) {
                                categorywiseMarkersAry.push(obj)
                            }
                            continue;
                        }
                        dataAry.push({ 'category': category, 'data': categorywiseMarkersAry });
                    }
                    // console.debug('Categories sorted DATA Array', dataAry);
                    let dataObj = { 'title': 'Trending Categories', 'data': dataAry };
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
                this.setState({ error, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    ShowSearchPosts = postData => {
        var isAlreadyLiked = false;
        const { userData } = this.state;
        console.debug("IN SEARCH PAGE", postData)
        if (postData.markerlike !== null) {
            for (let markerlikeObj of postData.markerlike) {
                if (markerlikeObj.userid === userData.userid) {
                    isAlreadyLiked = true;
                }
            }
        }
        this.setState({
            postDetails: postData,
            postLikesCount: postData.markerlike !== null ? postData.markerlike.length : 0,
            isMarkerAlreadyLiked: isAlreadyLiked,
            PostlikeorUnlikeImgUri: isAlreadyLiked ? require('../../images/like-icon.png') : require('../../images/unlike-icon.png'),
            showPostModal: !this.state.showPostModal,
        })
    };

    navigatetoUserProfile = () => {
        this.props.navigation.navigate('userprofile');
    }

    render() {
        const { dataArray, loading, PostlikeorUnlikeImgUri, userDp, postDetails } = this.state
        var tagName = postDetails.username !== undefined ? postDetails.username : '';
        var firstName = postDetails['firstname'] !== undefined ? postDetails['firstname'] : '';
        var lastName = postDetails['lastname'] !== undefined ? postDetails['lastname'] : '';
        var userName = firstName + ' ' + lastName
        var category = postDetails.category !== undefined ? postDetails.category : '';
        var postDesc = postDetails.description !== undefined ? postDetails.description : '';;
        var userdpUri = postDetails.userdp !== undefined ? postDetails.userdp : null;
        var postimagesAry = postDetails.media !== undefined ? (postDetails.media !== null ? postDetails.media : []) : []
        var markercommentArray = postDetails.markercomments !== undefined ? (postDetails.markercomments !== null ? postDetails.markercomments : []) : []
        var markerLikesCount = this.state.postLikesCount;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FBFBFB' }}>
                <View style={styles.headerstyle}>
                    <View style={styles.searchView}>
                        <Image style={{ width: 25, height: 25, marginLeft: 10 }} source={require('../../images/search.png')} resizeMode={'contain'} />
                        <TextInput
                            style={[AppStyle.dark_TextColor, AppStyle.app_font_heading, { flex: 1, fontSize: 14, marginLeft: 5, marginRight: 10 }]}
                            placeholder="Search anything"
                            value={this.state.searchedText}
                            onChangeText={(text) => this.setState({
                                searchedText: text
                            })}
                            onSubmitEditing={(event) => (this.SearchPosts())} >
                        </TextInput>
                    </View>
                    <TouchableOpacity onPress={this.navigatetoUserProfile} style={{ padding: 5, marginRight: 15 }}>
                        <View style={[AppStyle.header_profile_photo, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }]}>
                            <Image source={(userDp == null || userDp == '') ? require('../../images/profile_icon.png') : { uri: userDp }} style={(userDp == null || userDp == '') ? { height: 15, width: 15 } : AppStyle.header_profile_photo} resizeMode={(userDp == null || userDp == '') ? 'contain' : 'cover'} />
                        </View>
                    </TouchableOpacity>
                </View>
                <SectionList
                    sections={dataArray}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <SearchPosts postData={item} onPress={this.ShowSearchPosts} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={{ height: 50, flex: 1, paddingTop: 20 }}>
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font_heading, { fontSize: 16, paddingLeft: 15 }]}>{title}</Text>
                        </View>
                    )}
                />
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.showPostModal}
                    onRequestClose={() => {
                        this.setState({
                            showPostModal: !this.state.showPostModal,
                        })
                    }}
                >
                    <TouchableHighlight style={{ flex: 1, }} onPress={() => {
                        this.setState({
                            showPostModal: !this.state.showPostModal,
                        })
                    }} >
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(52, 52, 52, 0.5)',
                        }}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalView}>
                                    <View style={styles.TopContainer} >
                                        <TouchableOpacity onPress={this.GotoPostUserProfile} style={{
                                            height: 60,
                                            width: 60,
                                            borderRadius: 30,
                                            marginLeft: 15,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#F5F5F5'
                                        }}>
                                            <Image source={userdpUri == null ? require('../../images/profile_icon.png') : { uri: userdpUri }} style={{
                                                height: (userdpUri == null ? 25 : 60),
                                                width: (userdpUri == null ? 25 : 60),
                                                borderRadius: (userdpUri == null ? 0 : 30),
                                            }} resizeMode={userdpUri == null ? 'contain' : 'cover'} />
                                        </TouchableOpacity>

                                        <View style={styles.container_text}>
                                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 16, paddingBottom: 0, textTransform: 'capitalize' }]}>
                                                {userName}
                                            </Text>
                                            <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 14, paddingBottom: 5 }]}>
                                                @{tagName}
                                            </Text>
                                            <LinearGradient
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                colors={[ButtonGradientColor1, ButtonGradientColor2]}
                                                style={styles.categoryContainer}>
                                                <Image source={require('../../images/category_marker_icon.png')} style={{ height: 13, width: 13 }} />
                                                <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, marginLeft: 5, color: 'white', textTransform: 'capitalize' }]}>{category}</Text>
                                            </LinearGradient>
                                        </View>
                                        {/* <TouchableOpacity onPress={this.showMenuOptions}>
                                            <Text style={{ marginRight: 15, marginLeft: 10, alignSelf: 'baseline' }}>...</Text>
                                        </TouchableOpacity> */}
                                    </View>
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        {postDesc === '' ? null
                                            :
                                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 15, marginLeft: 15, marginRight: 15, marginBottom: (postimagesAry.length === 0 || postimagesAry[0] === null ? 0 : 15) }]}>
                                                {postDesc}
                                            </Text>
                                        }
                                        <ScrollView>
                                            <View onStartShouldSetResponder={(boolean) => true}>
                                                <FlatList
                                                    horizontal
                                                    contentContainerStyle={{ paddingRight: 15 }}
                                                    pagingEnabled={false}
                                                    data={postimagesAry}
                                                    renderItem={({ item }) => {
                                                        let imageUri = item != null ? item : ''
                                                        if (imageUri != '') {
                                                            return (
                                                                <View style={{ marginLeft: 15 }}>
                                                                    < ProgressiveImage source={{ uri: imageUri }} resizeMode={'cover'} style={{ width: ((Dimensions.get('window').width) * .90) - 30, height: 200 }} />
                                                                </View>
                                                            )
                                                        } else {
                                                            return (
                                                                null
                                                            )
                                                        }
                                                    }}
                                                    keyExtractor={(item, index) => index + ""}
                                                />
                                            </View>
                                        </ScrollView>
                                    </View>
                                    <View style={styles.BottomContainer}>
                                        <TouchableOpacity onPress={this.LikeOrUnlikePost} style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start'
                                        }}>
                                            <Image source={PostlikeorUnlikeImgUri}
                                                style={{ width: 30, height: 25, marginLeft: 15 }} resizeMode={'contain'} />
                                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, marginLeft: 10, marginRight: 25 }]}>
                                                {markerLikesCount}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.GotoPostCommentsPage} style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start'
                                        }}>
                                            <Image source={require('../../images/comment-icon.png')} resizeMode={'contain'}
                                                style={{ width: 25, height: 25 }} />
                                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, marginLeft: 10 }]}>
                                                {markercommentArray.length}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableHighlight>
                </Modal>
                {
                    loading ? <ActivityIndicator
                        animating={true}
                        style={AppStyle.activityIndicator}
                        size='large'
                    /> : null
                }
                <Toast ref="toast" style={AppStyle.toast_style} />
            </SafeAreaView >
        );
    }
}