import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { styles } from './HomePagePost.style';

export default class HomePagePost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            postDetails: this.props.userData,
            likeorUnlikeImgUri: require('../../images/unlike-icon.png'),
            postLikesCount: this.props.userData.markerlike !== null ? this.props.userData.markerlike.length : 0
        };
    }

    GotoPostCommentsPage = () => {
        console.debug('Posts Comments Page', this.state.postDetails);
        this.props.navigation.navigate('postscomments', { postDetails: this.state.postDetails });
    };

    LikeOrUnlikePost = () => {
        console.debug('Like OR Unlike function', this.state.postDetails);
        var isAlreadyLiked = false;
        var likeorUnlikeImgUri = this.state.likeorUnlikeImgUri;
        var markerlikeArray = this.state.postDetails.markerlike !== null ? this.state.postDetails.markerlike : []
        var markerLikesCount = this.state.postLikesCount;
        // for(){

        // }
        if (!isAlreadyLiked) {
            markerLikesCount = markerLikesCount + 1
            likeorUnlikeImgUri = require('../../images/like-icon.png');
        } else {
            markerLikesCount = markerLikesCount - 1
            likeorUnlikeImgUri = require('../../images/unlike-icon.png');
        }
        this.setState({
            likeorUnlikeImgUri: likeorUnlikeImgUri,
            postLikesCount: markerLikesCount
        })
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
        var userdpUri = postDetails.userdp !== null ? postDetails.userdp : 'https://medium-test1.s3.amazonaws.com/1577551283046'
        var postimageUri = postDetails.media
        var markerlikeArray = this.state.postLikesArray
        var markercommentArray = postDetails.markercomments !== null ? postDetails.markercomments : []
        var markerLikesCount = this.state.postLikesCount;
        return (
            <View style={styles.container}>
                <View style={styles.TopContainer}>
                    <Image source={{ uri: userdpUri }} style={styles.profile_photo} />
                    <View style={styles.container_text}>
                        <Text style={styles.UserName, { textTransform: 'capitalize' }}>
                            {userName}
                        </Text>
                        <Text style={styles.userTag}>
                            @{tagName}
                        </Text>
                        <View style={styles.categoryContainer}>
                            <Image source={require('../../images/img.jpg')} style={{ height: 15, width: 15 }} />
                            <Text style={{ marginLeft: 5, color: 'white' }}>{category}</Text>
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
                                    < Image source={{ uri: imageUri }} resizeMode={'cover'} style={{ flex: 1, width: Dimensions.get('window').width, height: 200 }} />
                                )
                            } else {
                                return (
                                    <View></View>
                                )
                            }
                        }}
                        keyExtractor={(item, index) => index + ""}
                    />
                    <Text style={styles.userTag, { marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                        {postDesc}
                    </Text>
                </View>
                <View style={styles.BottomContainer}>
                    <TouchableOpacity onPress={this.LikeOrUnlikePost} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Image source={likeorUnlikeImgUri} resizeMode={'cover'}
                            style={{ width: 32, height: 27, marginLeft: 15 }} resizeMode={'cover'} />
                        <Text style={styles.userTag, { marginLeft: 10, marginRight: 25 }}>
                            {markerLikesCount}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.GotoPostCommentsPage} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Image source={require('../../images/comment-icon.png')} resizeMode={'cover'}
                            style={{ width: 27, height: 27 }} />
                        <Text style={styles.userTag, { marginLeft: 10 }}>
                            {markercommentArray.length}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };
} 