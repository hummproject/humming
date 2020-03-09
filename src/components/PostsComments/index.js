import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Image, Text, TextInput } from 'react-native';
import { AppStyle } from '../../App.style'
import AppConfig from '../../config/constants';
import PostsCommentsListComponent from '../PostsCommentsListComponent';

export default class PostsComments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            commentsListArray: [{ userName: 'Veerender shivannagari', userTag: 'Veeru', category: 'Food' },
            { userName: 'RAkesh nagula', userTag: 'Nagula', category: 'Love' },
            { userName: 'P saiteja', userTag: 'sai', category: 'Movie' },
            { userName: 'veeru', userTag: 'Veeru12', category: 'Food' },
            { userName: 'PavaN', userTag: 'Bakku', category: 'Love' },
            { userName: 'VeerendER45', userTag: 'Veeru', category: 'Movie' },
            { userName: 'VeerendeR12', userTag: 'Veeru', category: 'Love' }], //this is the array
            error: null,
            userCommentedText :'',
            refreshing: false,
        };
    }

    componentWillMount() {
        // this.fetchCommentsforPosts();
    }

    fetchCommentsforPosts = () => {
        const { route } = this.props;
        const userData = route.params.params.userData;
        const token = userData.token;
        console.debug('Props in PostsComments', userData)
        console.debug('Token:', token)
        const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS;
        this.setState({ loading: true });
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': token,
            },
            body: JSON.stringify({
                location: '78.4373585,17.4337072',
                pageno: 0,
            }),
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Home Posts response:', responseData.data, responseData.error, responseData.results)
                this.setState({
                    postsListArray: responseData.results,
                    error: responseData.error || null,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => {
                console.debug('Home Posts response ERROR:', error);
                this.setState({ error, loading: false });
            });
    };

    render() {
        const { commentsListArray, loading , userCommentedText} = this.state;
        return (
            loading ?
                <View style={{ flex: 1 }}>
                    <View style={styles.headerstyle}>
                        <Image source={require('../../images/logo.png')} style={{ width: 30, height: 40, marginLeft: 15 }} />
                        <Text style={{ fontSize: 18, marginLeft: 10, }}>Comments</Text>
                        <View style={styles.commentsCountcontainer}>
                            <Image source={require('../../images/comment-icon.png')} resizeMode={'cover'}
                                style={{ width: 27, height: 27 }} />
                            <Text style={styles.userTag, { marginLeft: 10 }}>
                                129
                        </Text>
                        </View>
                    </View>
                    <ActivityIndicator
                        animating={true}
                        style={AppStyle.activityIndicator}
                        size='large'
                    />
                </View>
                :
                <View style={{ flex: 1 }}>
                    <View style={styles.headerstyle}>
                        <Image source={require('../../images/logo.png')} style={{ width: 30, height: 40, marginLeft: 15 }} />
                        <Text style={{ fontSize: 18, marginLeft: 10, }}>Comments</Text>
                        <View style={styles.commentsCountcontainer}>
                            <Image source={require('../../images/comment-icon.png')} resizeMode={'cover'}
                                style={{ width: 27, height: 27 }} />
                            <Text style={styles.userTag, { marginLeft: 10 }}>
                                129
                            </Text>
                        </View>
                    </View>
                    <FlatList
                        data={commentsListArray}
                        renderItem={
                            ({ item }) => <PostsCommentsListComponent commentData={item} />
                        }
                        keyExtractor={(item, index) => index + ""}
                    />
                    <View style={styles.footerstyle}>
                        <Image source={require('../../images/img.jpg')} style={{ width: 35, height: 35, marginLeft: 15 , borderRadius: 17.5, flex:1}} />
                        <TextInput
                            style={{ height: 40 , flex:3}}
                            placeholder="Post a Comment"
                            onChangeText={(text) => this.state.userCommentedText}
                            value={this.state.userCommentedText}
                        />
                        <Text style={{ fontSize: 18, marginLeft: 10, flex:1}}>Post</Text>
                    </View>
                </View>
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