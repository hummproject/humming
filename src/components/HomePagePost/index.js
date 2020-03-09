import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from './HomePagePost.style';
// import PostsComments from './src/components/PostsComments'

export default class HomePagePost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            postDetails: this.props.userData,
        };
    }

    GotoPostCommentsPage = () => {
        console.debug('Posts Comments Page', this.state.postDetails);
        this.props.navigation.navigate('postscomments');
    };

    LikeOrUnlikePost = () => {
        console.debug('Like OR Unlike function', this.state.postDetails);
    };

    render() {
        const postDetails = this.state.postDetails;
        console.debug(postDetails);
        var tagName = postDetails.userTag;
        var userName = postDetails.userName;
        var category = postDetails.category;
        return (
            <View style={styles.container}>
                <View style={styles.TopContainer}>
                    <Image source={require('../../images/img.jpg')} style={styles.profile_photo} />
                    <View style={styles.container_text}>
                        <Text style={styles.UserName,{ textTransform: 'capitalize'}}>
                            {userName}
                        </Text>
                        <Text style={styles.userTag}>
                            @{tagName}
                        </Text>
                        <View style={styles.categoryContainer}>
                            <Image source={require('../../images/img.jpg')} style={{ height: 15, width: 15 }} />
                            <Text style={{ marginLeft: 5 }}>{category}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'column' }}>
                    <Image source={require('../../images/img.jpg')} resizeMode={'cover'}
                        style={{ width: '100%', height: 200 }} />
                    <Text style={styles.userTag, { marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                        Lorumn epusm is simply dumy text of thr printing and typesetting. Loreum ipsum has been the industry
                        </Text>
                </View>
                <View style={styles.BottomContainer}>
                    <TouchableOpacity onPress={this.LikeOrUnlikePost} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Image source={require('../../images/unlike-icon.png')} resizeMode={'cover'}
                            style={{ width: 32, height: 27, marginLeft: 15 }} resizeMode={'cover'} />
                        <Text style={styles.userTag, { marginLeft: 10, marginRight: 25 }}>
                            1658
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
                            129
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };
} 