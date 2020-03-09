import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from './PostsCommentsListComponent.style';

export default class PostsCommentsListComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            commentData: this.props.commentData,
        };
    }

    ReplytoComment = () => {
        console.debug('Post comment : ReplytoComment', this.state.commentData);
        // this.props.navigation.navigate('');
    };

    LikeOrUnlikeComment = () => {
        console.debug('Post comment : Like OR Unlike function', this.state.commentData);
    };

    render() {
        const commentDetails = this.state.commentData;
        console.debug(commentDetails);
        var userName = commentDetails.userName;
        // var category = postDetails.category;
        return (
            <View style={styles.container}>
                <View style={styles.TopContainer}>
                    <Image source={require('../../images/img.jpg')} style={styles.profile_photo} />
                    <View style={styles.container_text}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={styles.UserName, { textTransform: 'capitalize' }}>{userName}</Text>
                            <Text style={styles.text_light, { marginRight: 15 }}>6 Days ago</Text>
                        </View>
                        <Text style={styles.text_description, { marginTop: 10, marginBottom: 10, marginRight: 15 }}>
                            Loreum epsum is text Loreum epsum is text Loreum epsum is text Loreum epsum is text Loreum epsum is text
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <TouchableOpacity onPress={this.LikeOrUnlikeComment} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>
                                <Image source={require('../../images/unlike-icon.png')} resizeMode={'cover'}
                                    style={{ width: 32, height: 27 }} resizeMode={'cover'} />
                                <Text style={styles.userTag, { marginLeft: 10, }}>
                                    21
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.ReplytoComment}>
                                <Text style={styles.text_light, { marginLeft: 25 }}>
                                    Reply
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    };
} 