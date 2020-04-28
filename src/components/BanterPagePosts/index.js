import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { styles } from '../HomePagePost/HomePagePost.style';
import { AppStyle } from '../../App.style'
import ProgressiveImage from '../../ProgressiveImage'
import AppConfig from '../../config/constants';
import AsyncStorage from '@react-native-community/async-storage';

export default class BanterPagePosts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            postDetails: this.props.postsData,
            userData: {},
            isMarkerAlreadyLiked: null,
            likeorUnlikeImgUri: require('../../images/unlike-icon.png'),
            postLikesCount: this.props.postsData.markerlike !== null ? this.props.postsData.markerlike.length : 0
        };
    }

    async componentDidMount() {
        await AsyncStorage.getItem("userData").then(value => {
            const userData = JSON.parse(value);
            this.setState({
                userData: userData
            });
        });
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

    GotoPostCommentsPage = () => {
        const { navigation } = this.props
        navigation.navigate('postscomments', { postDetails: this.state.postDetails });
    };

    LikeOrUnlikePost = () => {
        this.makeRequesttoLikeorUnlikethePost();
    };

    makeRequesttoLikeorUnlikethePost = () => {
        const { postDetails, userData, likeorUnlikeImgUri, postLikesCount, isMarkerAlreadyLiked } = this.state
        console.debug('Like OR Unlike function:Marker Details', postDetails);
        console.debug('Like OR Unlike function:User Deatils', userData);
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

    render() {
        const { postDetails, likeorUnlikeImgUri, postLikesCount, loading } = this.state
        // console.debug(postDetails);
        var postDesc = postDetails.description;
        var postimageUri = postDetails.media;
        var markercommentArray = postDetails.markercomments !== null ? postDetails.markercomments : []
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'column' }}>
                    <FlatList
                        horizontal
                        pagingEnabled={true}
                        data={postimageUri}
                        renderItem={({ item }) => {
                            // console.debug(item);
                            let imageUri = item != null ? item : ''
                            // console.debug(imageUri);
                            if (imageUri != '') {
                                return (
                                    < ProgressiveImage source={{ uri: imageUri }} resizeMode={'cover'} style={{ flex: 1, width: Dimensions.get('window').width, height: 250 }} />
                                )
                            } else {
                                return (
                                    null
                                )
                            }
                        }}
                        keyExtractor={(item, index) => index + ""}
                    />
                    <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 15, marginLeft: 15, marginRight: 15, marginTop: 15 }]}>
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
                            {postLikesCount}
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
                    loading ? <ActivityIndicator
                        animating={true}
                        style={AppStyle.activityIndicator}
                        size='large'
                    /> : null
                }
            </View>
        )
    };
} 