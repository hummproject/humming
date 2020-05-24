import React, { Component } from 'react';
import { Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Image, BackHandler } from 'react-native';
import BanterPagePosts from '../BanterPagePosts';
import AsyncStorage from '@react-native-community/async-storage';
import { AppStyle } from '../../App.style'
import AppConfig from '../../config/constants';
import Toast from 'react-native-easy-toast'
import NetInfo from "@react-native-community/netinfo";

export default class Banter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            userListArray: [], //this is the array
            error: null,
            postsData: [],
            isUserSelected: false,
            userSelectedPost: {},
            is_connected: false,
        };
    }

    async componentDidMount() {
        await AsyncStorage.getItem("PostsData").then(value => {
            const postsData = JSON.parse(value);
            this.setState({
                postsData: postsData,
                isUserSelected: false,
            });
        });
        var postsArray = this.state.postsData
        postsArray.sort(function (a, b) {
            const objA = a.markercomments === null ? 0 : a.markercomments.length
            const objB = b.markercomments === null ? 0 : b.markercomments.length
            let comparison = 0;
            if (objA > objB) {
                comparison = -1;
            } else if (objA < objB) {
                comparison = 1;
            }
            return comparison;
        });
        // console.debug('sorted Array:', postsArray);
        var uniquePostsArray = postsArray.reduce((unique, o) => {
            if (!unique.some(obj => obj.userid === o.userid)) {
                unique.push(o);
            }
            return unique;
        }, []);
        // console.debug('sorted Array: Unique', uniquePostsArray);
        this.setState({
            userListArray: uniquePostsArray
        })
        if (this.state.userListArray === 0) {
            this.makeRequesttoFetchPosts();
        }
        // this._unsubscribe = this.props.navigation.addListener('focus', () => {
        //     // do something
        //     // this.makeRequesttoFetchPosts();
        // });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.netinfoSubscribe = NetInfo.addEventListener(state => {
            if (state.isInternetReachable) {
                this.setState({ is_connected: true });
            } else {
                this.setState({ is_connected: false });
            }
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.netinfoSubscribe();
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    };

    showPostBasedonUserSelection = (item) => {
        console.debug("user selected", item);
        this.setState({
            isUserSelected: true,
            userSelectedPost: item,
        })
    };

    makeRequesttoFetchPosts = () => {
        const { userData, is_connected } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS
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
                'token': userData.token
            },
            body: JSON.stringify({
                location: '78.4373585,17.4337072',
                pageno: '0'
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Banter Posts response:', responseData)
                this.setState({
                    loading: false,
                })
                if (responseData.status === 200) {
                    AsyncStorage.setItem("PostsData", JSON.stringify(responseData.data));
                    var postsArray = responseData.data
                    postsArray.sort(function (a, b) {
                        const objA = a.markercomments === null ? 0 : a.markercomments.length
                        const objB = b.markercomments === null ? 0 : b.markercomments.length
                        let comparison = 0;
                        if (objA > objB) {
                            comparison = -1;
                        } else if (objA < objB) {
                            comparison = 1;
                        }
                        return comparison;
                    });
                    // console.debug('sorted Array:', postsArray);
                    var uniquePostsArray = postsArray.reduce((unique, o) => {
                        if (!unique.some(obj => obj.userid === o.userid)) {
                            unique.push(o);
                        }
                        return unique;
                    }, []);
                    // console.debug('sorted Array: Unique', uniquePostsArray);
                    this.setState({
                        userListArray: uniquePostsArray
                    })
                } else {
                    this.refs.toast.show(responseData.message);
                }
            })
            .catch(error => {
                console.debug('Banter Posts response ERROR:', error);
                this.setState({ error, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    render() {
        const { userListArray, userSelectedPost, isUserSelected, loading } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.headerstyle}>
                    <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 20, marginLeft: 15 }]}>Banter</Text>
                </View>
                <View style={{ justifyContent: 'space-around' }}>
                    <FlatList
                        horizontal
                        data={userListArray}
                        renderItem={
                            ({ item }) => {
                                return (
                                    <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: '#FFFFFF' }} onPress={() => this.showPostBasedonUserSelection(item)}>
                                        <Image source={item.userdp == null ? require('../../images/logo.png') : { uri: item.userdp }} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} resizeMode={item.userdp == null ? 'contain' : 'cover'} />
                                        <View>
                                            <View style={styles.categoryContainer}>
                                                <Image source={require('../../images/category_marker_icon.png')} style={{ height: 13, width: 13 }} />
                                                <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, marginLeft: 5, color: 'white', textTransform: 'capitalize' }]}>{item.category}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        }
                        keyExtractor={(item, index) => index + ""}
                    />
                </View>
                {
                    isUserSelected ?
                        <FlatList
                            data={[userSelectedPost]}
                            renderItem={
                                ({ item }) => <BanterPagePosts key={item.marker_id} postsData={item} navigation={this.props.navigation} />
                            }
                            keyExtractor={(item, index) => index + ""}
                        />
                        :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' }}>
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>Click on any profile to view their post disscussions</Text>
                        </View>
                }
                {
                    loading ? <ActivityIndicator
                        animating={true}
                        style={AppStyle.activityIndicator}
                        size='large'
                    /> : null
                }
                <Toast ref="toast" style={AppStyle.toast_style} />
            </SafeAreaView >
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
    categoryContainer: {
        flexDirection: "row",
        alignItems: 'center',
        alignSelf: 'baseline',
        justifyContent: 'flex-start',
        padding: 3,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 15,
        backgroundColor: '#6454F0'
    },
});