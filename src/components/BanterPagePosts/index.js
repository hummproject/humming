import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../HomePagePost/HomePagePost.style';
import { AppStyle } from '../../App.style'

export default class BanterPagePosts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // postDetails: this.props.userData,
            // likeorUnlikeImgUri: require('../../images/unlike-icon.png'),
            // postLikesCount: this.props.userData.markerlike !== null ? this.props.userData.markerlike.length : 0
        };
    }

    // GotoPostCommentsPage = () => {
    //     const {navigation} = this.props
    //     navigation.navigate('postscomments', { postDetails: this.state.postDetails });
    // };

    // LikeOrUnlikePost = () => {
    //     console.debug('Like OR Unlike function', this.state.postDetails);
    //     var isAlreadyLiked = false;
    //     var likeorUnlikeImgUri = this.state.likeorUnlikeImgUri;
    //     var markerlikeArray = this.state.postDetails.markerlike !== null ? this.state.postDetails.markerlike : []
    //     var markerLikesCount = this.state.postLikesCount;
    //     // for(){

    //     // }
    //     if (!isAlreadyLiked) {
    //         markerLikesCount = markerLikesCount + 1
    //         likeorUnlikeImgUri = require('../../images/like-icon.png');
    //     } else {
    //         markerLikesCount = markerLikesCount - 1
    //         likeorUnlikeImgUri = require('../../images/unlike-icon.png');
    //     }
    //     this.setState({
    //         likeorUnlikeImgUri: likeorUnlikeImgUri,
    //         postLikesCount: markerLikesCount
    //     })
    // };

    render() {
        // const postDetails = this.state.postDetails;
        // const likeorUnlikeImgUri = this.state.likeorUnlikeImgUri;
        // console.debug(postDetails);
        // var tagName = postDetails.username;
        // var firstName = postDetails['firstname'];
        // var lastName = postDetails['lastname'];
        // var userName = firstName + ' ' + lastName
        // var category = postDetails.category;
        // var postDesc = postDetails.description;
        // var userdpUri = postDetails.userdp !== null ? postDetails.userdp : 'https://medium-test1.s3.amazonaws.com/1577551283046'
        // var postimageUri = postDetails.media
        // var markerlikeArray = this.state.postLikesArray
        // var markercommentArray = postDetails.markercomments !== null ? postDetails.markercomments : []
        // var markerLikesCount = this.state.postLikesCount;
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'column' }}>
                    <FlatList
                        horizontal
                        pagingEnabled={true}
                        data={[], []}
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
                                    null
                                )
                            }
                        }}
                        keyExtractor={(item, index) => index + ""}
                    />
                    <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 15, marginLeft: 15, marginRight: 15, marginTop: 15 }]}>
                        {/* {postDesc} */}
                        Lorem epusm loreum epsum
                    </Text>
                </View>
                <View style={styles.BottomContainer}>
                    <TouchableOpacity onPress={this.LikeOrUnlikePost} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Image source={require('../../images/unlike-icon.png')}
                            style={{ width: 32, height: 27, marginLeft: 15 }} resizeMode={'contain'} />
                        <Text style={[AppStyle.dark_TextColor,AppStyle.app_font,{fontSize: 14, marginLeft: 10, marginRight: 25}]}>
                            {/* {markerLikesCount} */}
                            100
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.GotoPostCommentsPage} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Image source={require('../../images/comment-icon.png')} resizeMode={'contain'}
                            style={{ width: 27, height: 27 }} />
                        <Text style={[AppStyle.dark_TextColor,AppStyle.app_font, {fontSize: 14, marginLeft: 10}]}>
                            {/* {markercommentArray.length} */} 100
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };
} 