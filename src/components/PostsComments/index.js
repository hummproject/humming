import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Image, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { AppStyle } from '../../App.style'
import AppConfig from '../../config/constants';
import AsyncStorage from '@react-native-community/async-storage';
import PostsCommentsListComponent from '../PostsCommentsListComponent';
import Toast from 'react-native-easy-toast'
import { SafeAreaView } from 'react-native-safe-area-context';

export default class PostsComments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            commentsListArray: [], //this is the array
            error: null,
            userCommentedText: '',
            clearInput: false,
            showtoast: false,
            userData: {},
            postDetails: this.props.route.params.postDetails
        };
    }

    async componentDidMount() {
        await AsyncStorage.getItem("userData").then(value => {
            const userData = JSON.parse(value);
            this.setState({
                userData: userData,
            });
        });
        this.fetchCommentsforPosts();
    }

    PostComment = () => {
        this.PostCommentOfUser();
    };

    returnBack = () => {
        // console.debug('Go back function', this.props.route.params.postDetails);
        this.props.navigation.goBack();
    };

    dismissKeyboard() {
        Keyboard.dismiss();
    }

    PostCommentOfUser = () => {
        this.dismissKeyboard();
        // console.debug('post Details : Fetch', this.state.postDetails);
        const { userData, userCommentedText, postDetails, commentsListArray } = this.state;
        this.setState({
            showtoast : true
        })
        if (userCommentedText !== "") {
            const token = userData.token;
            const url = AppConfig.DOMAIN + AppConfig.ADD_COMMENTS_TO_MARKER;
            console.debug(url);
            this.setState({ loading: true });
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': token,
                },
                body: JSON.stringify({
                    markerid: postDetails.marker_id,
                    content: userCommentedText,
                }),
            })
                .then(response => response.json())
                .then(responseData => {
                    // console.debug('comments Page comment response:', responseData)
                    this.setState({
                        loading: false,
                    })
                    if (responseData.status === 200) {
                        var data = responseData.data
                        data["firstname"] = userData.firstname;
                        data["lastname"] = userData.lastname;
                        data["userdp"] = userData.userdp;
                        var commentListAry = commentsListArray;
                        commentListAry.unshift(data);
                        console.debug("",commentListAry);
                        this.setState({
                            commentsListArray: commentListAry,
                            error: responseData.error || null,
                            clearInput: true,
                            userCommentedText: '',
                        });
                    } else {
                        this.refs.toast.show(responseData.message);
                    }
                })
                .catch(error => {
                    console.debug('comments Page response ERROR:', error);
                    this.setState({ error, loading: false });
                    this.refs.toast.show("Something went wrong. Please try again later");
                });
        }else{
            this.refs.toast.show("Please write someting to post"); 
        }
    };

    fetchCommentsforPosts = () => {
        // console.debug('post Details : Fetch', this.state.postDetails);
        const { userData, postDetails } = this.state;
        const token = userData.token;
        const url = AppConfig.DOMAIN + AppConfig.GET_MARKER_COMMENTS;
        console.debug(url);
        this.setState({ loading: true });
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token,
            },
            body: JSON.stringify({
                markerid: postDetails.marker_id,
            }),
        })
            .then(response => response.json())
            .then(responseData => {
                // console.debug('comments Page response:', responseData)
                this.setState({
                    loading: false,
                })
                if (responseData.status === 200) {
                    if (Array.isArray(responseData.data)) {
                        this.setState({
                            commentsListArray: responseData.data,
                            error: responseData.error || null,
                        });
                    } else {
                        this.setState({
                            commentsListArray: [],
                            error: responseData.error || null,
                        });
                    }
                } else {
                    this.refs.toast.show(responseData.message);
                }
            })
            .catch(error => {
                console.debug('comments Page response ERROR:', error);
                this.setState({ error, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    render() {
        const { commentsListArray, loading, userCommentedText, postDetails, userData } = this.state;
        // console.debug("user details : post comments", userData)
        console.debug("Post comments : List Ary", commentsListArray)
        let userdp = userData.userdp
        var markercommentArray;
        if (commentsListArray.length === 0) {
            markercommentArray = postDetails.markercomments !== null ? postDetails.markercomments : []
        } else {
            markercommentArray = commentsListArray;
        }
        return (
            loading ?
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.headerstyle}>
                        <TouchableOpacity onPress={this.returnBack} >
                            <Image source={require('../../images/back.png')} resizeMode={'contain'} style={{ width: 25, height: 35, marginLeft: 15 }} />
                        </TouchableOpacity>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 20, marginLeft: 20 }]}>Comments</Text>
                        <View style={styles.commentsCountcontainer}>
                            <Image source={require('../../images/comment-icon.png')} resizeMode={'cover'}
                                style={{ width: 27, height: 27 }} />
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, marginLeft: 10 }]}>
                                {markercommentArray.length}
                            </Text>
                        </View>
                    </View>
                    <ActivityIndicator
                        animating={true}
                        style={AppStyle.activityIndicator}
                        size='large'
                    />
                </SafeAreaView>
                :
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.headerstyle}>
                        <TouchableOpacity onPress={this.returnBack} >
                            <Image source={require('../../images/back.png')} resizeMode={'contain'} style={{ width: 25, height: 35, marginLeft: 15 }} />
                        </TouchableOpacity>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 20, marginLeft: 20 }]}>Comments</Text>
                        <View style={styles.commentsCountcontainer}>
                            <Image source={require('../../images/comment-icon.png')} resizeMode={'cover'}
                                style={{ width: 27, height: 27 }} />
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, marginLeft: 10 }]}>
                                {markercommentArray.length}
                            </Text>
                        </View>
                    </View>
                    <FlatList
                        data={commentsListArray}
                        renderItem={
                            ({ item }) => <PostsCommentsListComponent key={item.commentid} commentData={item} />
                        }
                        keyExtractor={(item, index) => item + index}
                    />
                    <View style={styles.footerstyle}>
                        <Image source={userdp == null ? require('../../images/logo.png') : { uri: userdp }} resizeMode={'contain'} style={{ width: 35, height: 35, marginLeft: 22, borderRadius: 17.5, }} />
                        <TextInput
                            style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, height: 40, flex: 2, marginLeft: 15 }]}
                            placeholder="Post a Comment"
                            value={!this.state.clearInput ? userCommentedText : null}
                            onChangeText={(text) => this.setState({
                                userCommentedText: text,
                            })}
                        />
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            marginRight: 15,
                            marginLeft: 10,
                        }}>
                            <TouchableOpacity onPress={this.PostComment}>
                                <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Toast ref="toast" style={AppStyle.toast_style} />
                </SafeAreaView>
        )
    };
}

const styles = StyleSheet.create({
    headerstyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        elevation: 2,
        borderBottomColor: '#ECECEC',
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    footerstyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 55,
        elevation: 2,
        borderTopColor: '#ECECEC',
        borderTopWidth: 1,
        alignItems: 'center',
    },
    commentsCountcontainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 15,
    },
});