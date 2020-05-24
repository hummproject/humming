import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Image, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { AppStyle } from '../../App.style'
import AppConfig from '../../config/constants';
import AsyncStorage from '@react-native-community/async-storage';
import PostsCommentsListComponent from '../PostsCommentsListComponent';
import Toast from 'react-native-easy-toast'
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from "@react-native-community/netinfo";

export default class PostDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            userData: {},
            is_connected: false,
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
        this.netinfoSubscribe = NetInfo.addEventListener(state => {
            if (state.isInternetReachable) {
                this.setState({ is_connected: true });
            } else {
                this.setState({ is_connected: false });
            }
        });
        // this.fetchCommentsforPosts();
    }

    componentWillUnmount() {
        this.netinfoSubscribe();
    }

    returnBack = () => {
        // console.debug('Go back function', this.props.route.params.postDetails);
        this.props.navigation.goBack();
    };

    dismissKeyboard() {
        Keyboard.dismiss();
    }

    fetchCommentsforPosts = () => {
        // console.debug('post Details : Fetch', this.state.postDetails);
        const { userData, postDetails, is_connected } = this.state;
        const token = userData.token;
        const url = AppConfig.DOMAIN + AppConfig.GET_MARKER_COMMENTS;
        console.debug(url);
        this.setState({ loading: true });
        if (!is_connected) {
            this.setState({ loading: false });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
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
        const { loading, postDetails, userData } = this.state;
        return (
            loading ?
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.headerstyle}>
                        <TouchableOpacity onPress={this.returnBack} >
                            <Image source={require('../../images/back.png')} resizeMode={'contain'} style={{ width: 25, height: 35, marginLeft: 15 }} />
                        </TouchableOpacity>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 20, marginLeft: 20 }]}>Post</Text>
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
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 20, marginLeft: 20 }]}>Post</Text>
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
    }
});