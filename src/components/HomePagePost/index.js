import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { styles } from './HomePagePost.style';
import { AppStyle } from '../../App.style';
import AppConfig from '../../config/constants';
import Toast from 'react-native-easy-toast'
import ProgressiveImage from '../../ProgressiveImage'

export default class HomePagePost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            postDetails: this.props.markerData,
            userData: this.props.userData,
            isMarkerAlreadyLiked: null,
            likeorUnlikeImgUri: require('../../images/unlike-icon.png'),
            postLikesCount: this.props.markerData.markerlike !== null ? this.props.markerData.markerlike.length : 0
        };
    }

    GotoPostCommentsPage = () => {
        const { navigation } = this.props
        navigation.navigate('postscomments', { postDetails: this.state.postDetails });
    };

    GotoPostUserProfile = () => {
        const { navigation } = this.props
        console.debug('go to post user profile');
        navigation.navigate('postuserprofile', { postDetails: this.state.postDetails });
    }

    componentDidMount() {
        var isAlreadyLiked = false;
        const { postDetails, userData } = this.state;
        // console.debug("constructor markerlike array OBJ", postDetails.markerlike)
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
        // this.makeRequesttoLikeorUnlikethePost();
    };


    makeRequesttoLikeorUnlikethePost = () => {
        const { postDetails, userData, likeorUnlikeImgUri, postLikesCount, isMarkerAlreadyLiked } = this.state
        console.debug('Like OR Unlike function:Marker Details', postDetails);
        console.debug('Like OR Unlike function:User Deatils', userData);
        // var likeorunlikeImgUri = likeorUnlikeImgUri;
        // var markerlikeArray = postDetails.markerlike !== null ? postDetails.markerlike : []
        // var markerLikesCount = postLikesCount;

        const url = AppConfig.DOMAIN + AppConfig.LIKE_OR_UNLIKE_MARKER
        console.debug(url);
        console.debug("is Already liked", isMarkerAlreadyLiked);
        console.debug("Request for like", {
            markerid: postDetails.marker_id,
            isLiked: !isMarkerAlreadyLiked
        });
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
                isLiked: !isMarkerAlreadyLiked
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Home Posts lIKE Response:', responseData)
                if (responseData.status === 200) {
                    // if (!isAlreadyLiked) {
                    //     markerLikesCount = markerLikesCount + 1
                    //     likeorunlikeImgUri = require('../../images/like-icon.png');
                    // } else {
                    //     markerLikesCount = markerLikesCount - 1
                    //     likeorunlikeImgUri = require('../../images/unlike-icon.png');
                    // }
                    // this.setState({
                    //     likeorUnlikeImgUri: likeorunlikeImgUri,
                    //     postLikesCount: markerLikesCount
                    // })
                    // this.setState({
                    //     postsListArray: responseData.data,
                    //     error: responseData.error || null,
                    //     loading: false,
                    //     refreshing: false
                    // });
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

    render() {
        const postDetails = this.state.postDetails;
        const likeorUnlikeImgUri = this.state.likeorUnlikeImgUri;
        console.debug(postDetails);
        var tagName = postDetails.username;
        var firstName = postDetails['firstname'];
        var lastName = postDetails['lastname'];
        var userName = firstName + ' ' + lastName
        var category = postDetails.category;
        var postDesc = postDetails.description;
        var userdpUri = postDetails.userdp;
        var postimageUri = postDetails.media
        var markerlikeArray = this.state.postLikesArray
        var markercommentArray = postDetails.markercomments !== null ? postDetails.markercomments : []
        var markerLikesCount = this.state.postLikesCount;
        return (
            <View style={styles.container}>
                <View style={styles.TopContainer}>
                    <TouchableOpacity onPress={this.GotoPostUserProfile} style={styles.profile_photo}>
                        <Image source={userdpUri == null ? require('../../images/logo.png') : { uri: userdpUri }} style={styles.profile_photo} resizeMode={userdpUri == null ? 'contain' : 'cover'} />
                    </TouchableOpacity>
                    <View style={styles.container_text}>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 16, paddingBottom: 0, textTransform: 'capitalize' }]}>
                            {userName}
                        </Text>
                        <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 14, paddingBottom: 5 }]}>
                            @{tagName}
                        </Text>
                        <View style={styles.categoryContainer}>
                            <Image source={require('../../images/category_marker_icon.png')} style={{ height: 13, width: 13 }} />
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, marginLeft: 5, color: 'white' }]}>{category}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'column' }}>
                    <FlatList
                        horizontal
                        pagingEnabled={true}
                        data={postimageUri}
                        renderItem={({ item }) => {
                            console.debug(item);
                            let imageUri = item != null ? item : ''
                            console.debug(imageUri);
                            if (imageUri != '') {
                                return (
                                    < ProgressiveImage source={{ uri: imageUri }} resizeMode={'cover'} style={{ flex: 1, width: Dimensions.get('window').width, height: 200 }} />
                                )
                            } else {
                                return (
                                    null//<View></View>
                                )
                            }
                        }}
                        keyExtractor={(item, index) => index + ""}
                    />
                    <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 15, marginLeft: 14, marginRight: 15, marginTop: 15 }]}>
                        {postDesc}
                    </Text>
                </View>
                <View style={styles.BottomContainer}>
                    <TouchableOpacity onPress={this.LikeOrUnlikePost} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Image source={likeorUnlikeImgUri}
                            style={{ width: 32, height: 27, marginLeft: 15 }} resizeMode={'contain'} />
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
                            style={{ width: 27, height: 27 }} />
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
                <Toast ref="toast" style={AppStyle.toast_style} />
            </View>
        )
    };
} 