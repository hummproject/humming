import React, { PureComponent } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { styles } from './HomePagePost.style';
import { AppStyle } from '../../App.style';
import LinearGradient from 'react-native-linear-gradient';
import AppConfig from '../../config/constants';
import { ButtonGradientColor1, ButtonGradientColor2 } from '../../config/constants';
import ProgressiveImage from '../../ProgressiveImage'
import { cos } from 'react-native-reanimated';

export default class HomePagePost extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            postDetails: this.props.markerData,
            userData: this.props.userData,
            isMarkerAlreadyLiked: null,
            menuTop: 0,
            likeorUnlikeImgUri: require('../../images/unlike-icon.png'),
            postLikesCount: this.props.markerData.markerlike !== null ? this.props.markerData.markerlike.length : 0
        };
    }

    GotoPostCommentsPage = () => {
        const { navigation } = this.props
        navigation.navigate('postscomments', { postDetails: this.state.postDetails });
    }

    GotoPostUserProfile = () => {
        const { navigation } = this.props
        navigation.navigate('postuserprofile', { postDetails: this.state.postDetails });
    }

    componentDidMount() {
        var isAlreadyLiked = false;
        const { postDetails, userData } = this.state;
        // console.debug("HomePOSTS: DID MOUNT", postDetails.markerlike)
        if (postDetails.markerlike !== null) {
            for (let markerlikeObj of postDetails.markerlike) {
                if (markerlikeObj.userid === userData.userid) {
                    isAlreadyLiked = true;
                }
            }
        }
        this.setState({
            isMarkerAlreadyLiked: isAlreadyLiked,
            likeorUnlikeImgUri: isAlreadyLiked ? require('../../images/like-icon.png') : require('../../images/unlike-icon.png'),
        })
    }

    LikeOrUnlikePost = () => {
        this.makeRequesttoLikeorUnlikethePost();
    };

    makeRequesttoLikeorUnlikethePost = () => {
        const { postDetails, userData, likeorUnlikeImgUri, postLikesCount, isMarkerAlreadyLiked } = this.state
        // console.debug('Like OR Unlike function:Marker Details', postDetails);
        // console.debug('Like OR Unlike function:User Deatils', userData);
        var likeorunlikeImgUri = likeorUnlikeImgUri;
        // var markerlikeArray = postDetails.markerlike !== null ? postDetails.markerlike : []
        var markerLikesCount = postLikesCount;
        var isLiked = "false"
        if (!isMarkerAlreadyLiked) {
            isLiked = "true"
        } else {
            isLiked = "false"
        }
        const url = AppConfig.DOMAIN + AppConfig.LIKE_OR_UNLIKE_MARKER
        console.debug(url);
        this.setState({ loading: true });
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': userData.token
            },
            body: JSON.stringify({
                markerid: postDetails.marker_id,
                isLiked: isLiked
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Home Posts lIKE Response:', responseData)
                this.setState({ loading: false });
                if (responseData.status === 200) {
                    if (!("message" in responseData.data)) {
                        if (!isMarkerAlreadyLiked) {
                            markerLikesCount = markerLikesCount + 1
                            likeorunlikeImgUri = require('../../images/like-icon.png');
                        } else {
                            markerLikesCount = markerLikesCount - 1
                            likeorunlikeImgUri = require('../../images/unlike-icon.png');
                        }
                        console.debug("Total Likes Count", markerLikesCount)
                        console.debug("Image URI ", likeorunlikeImgUri)
                        this.setState({
                            isMarkerAlreadyLiked: !isMarkerAlreadyLiked,
                            likeorUnlikeImgUri: likeorunlikeImgUri,
                            postLikesCount: markerLikesCount
                        })
                    } else {
                        // console.debug("LIKE RESPONSE: ELSE", responseData.data.message)
                    }
                } else {
                    this.refs.toast.show(responseData.message);
                }
            })
            .catch(error => {
                console.debug('Home Posts lIKE response ERROR:', error);
                this.setState({ error, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    showOptions = () => {
        console.log("Menu Options")
        this.props.showMenuOptions();
    };

    render() {
        const postDetails = this.state.postDetails;
        console.debug("Home Post Details", postDetails);
        const likeorUnlikeImgUri = this.state.likeorUnlikeImgUri;
        var tagName = postDetails.username;
        var firstName = postDetails['firstname'];
        var lastName = postDetails['lastname'];
        var userName = firstName + ' ' + lastName
        var category = postDetails.category;
        var postDesc = postDetails.description;
        var userdpUri = postDetails.userdp;
        var postimagesAry = postDetails.media !== null ? postDetails.media : []
        var markercommentArray = postDetails.markercomments !== null ? postDetails.markercomments : []
        var markerLikesCount = this.state.postLikesCount;
        return (
            <View style={styles.container}>
                <View style={styles.TopContainer} ref="topView" onLayout={({ nativeEvent }) => {
                    this.refs.topView.measure((x, y, width, height, pageX, pageY) => {
                        console.log(x, y, width, height, pageX, pageY);
                        this.setState({ menuTop: pageY });
                    })
                }}>
                    <TouchableOpacity onPress={this.GotoPostUserProfile} style={{
                        height: 60,
                        width: 60,
                        borderRadius: 30,
                        marginLeft: 15,
                        backgroundColor: '#F5F5F5',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image source={userdpUri == null ? require('../../images/profile_icon.png') : { uri: userdpUri }} style={{ height: (userdpUri == null ? 25 : 60), width: (userdpUri == null ? 25 : 60), borderRadius: (userdpUri == null ? 0 : 30) }} resizeMode={userdpUri == null ? 'contain' : 'cover'} />
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
                    {/* <TouchableOpacity onPress={() => this.showOptions} style={{ padding: 8 }}>
                        <Image source={require('../../images/horizontal_menu.png')} style={{ width: 15, height: 8, marginRight: 10, marginLeft: 10, alignSelf: 'baseline' }} resizeMode={'contain'} />
                    </TouchableOpacity> */}
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    {postDesc === '' ? null
                        :
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 15, marginLeft: 15, marginRight: 15, marginBottom: (postimagesAry.length === 0 || postimagesAry[0] === null ? 0 : 15) }]}>
                            {postDesc}
                        </Text>
                    }
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
                                        < ProgressiveImage source={{ uri: imageUri }} resizeMode={'cover'} style={{ flex: 1, width: Dimensions.get('window').width - 50, height: 200 }} />
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
                <View style={styles.BottomContainer}>
                    <TouchableOpacity onPress={this.LikeOrUnlikePost} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Image source={likeorUnlikeImgUri}
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
                {
                    this.state.loading ? <ActivityIndicator
                        animating={true}
                        style={AppStyle.activityIndicator}
                        size='large'
                    /> : null
                }
                {/* <Toast ref="toast" style={AppStyle.toast_style} /> */}
            </View>
        )
    };
} 