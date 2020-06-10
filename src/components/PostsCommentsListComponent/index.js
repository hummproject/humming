import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from './PostsCommentsListComponent.style';
import { AppStyle } from '../../App.style'

export default class PostsCommentsListComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            commentData: this.props.commentData,
        };
    }

    ReplytoComment = () => {
        console.debug('Post comment : ReplytoComment', this.state.commentData);
    };

    LikeOrUnlikeComment = () => {
        console.debug('Post comment : Like OR Unlike function', this.state.commentData);
    };

    render() {
        const commentDetails = this.state.commentData;
        // console.debug(commentDetails);
        let userName = commentDetails.firstname + ' ' + commentDetails.lastname
        let commntedUserdp = commentDetails.userdp;
        let comment = commentDetails.comment;
        var today = new Date();
        var commentedDate = new Date(commentDetails.date_created);
        const timeDiffinSeconds = (Math.abs(today - commentedDate)) / 1000;
        // console.debug('time diff in seconds', timeDiffinSeconds);
        var commentedTime = '';
        if (timeDiffinSeconds < 60) {
            commentedTime = Math.trunc(timeDiffinSeconds) + ' seconds ago';
        } else if (timeDiffinSeconds >= 60 && timeDiffinSeconds < 3600) {
            commentedTime = Math.trunc((timeDiffinSeconds / 60)) + ' minutes ago';
        } else if (timeDiffinSeconds >= 3600 && timeDiffinSeconds < 86400) {
            commentedTime = Math.trunc((timeDiffinSeconds / (60 * 60))) + ' hours ago';
        } else {
            commentedTime = Math.trunc((timeDiffinSeconds / (60 * 60 * 24))) + ' days ago';
        }
        // console.debug('Commented Date value:',commentedTime);
        return (
            <View style={styles.container}>
                <View style={styles.TopContainer}>
                    <View style={[styles.profile_photo, { marginLeft: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }]}>
                        <Image source={(commntedUserdp == null || commntedUserdp == '') ? require('../../images/profile_icon.png') : { uri: commntedUserdp }} style={(commntedUserdp == null || commntedUserdp == '') ? { height: 20, width: 20 } : styles.profile_photo} resizeMode={(commntedUserdp == null || commntedUserdp == '') ? 'contain' : 'cover'} />
                    </View>
                    <View style={styles.container_text}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 16, textTransform: 'capitalize' }]}>{userName}</Text>
                            <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 14, marginRight: 15 }]}>{commentedTime}</Text>
                        </View>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 15, marginTop: 10, marginBottom: 10, marginRight: 15 }]}>
                            {comment}
                        </Text>
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
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
                        </View> */}
                    </View>
                </View>
            </View>
        )
    };
} 