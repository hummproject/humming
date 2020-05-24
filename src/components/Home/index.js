import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Image, Text, BackHandler, Alert, PermissionsAndroid, StatusBar } from 'react-native';
import HomePagePost from '../HomePagePost';
import { AppStyle } from '../../App.style'
import AppConfig from '../../config/constants';
import Toast from 'react-native-easy-toast'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from "@react-native-community/netinfo";

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            postsListArray: [], //this is the array
            page: 0,
            latlang: "0.000,0.000",
            error: null,
            userData: {},
            isListEnded: false,
            refreshing: false,
            is_connected: false,
        };
    }

    async componentDidMount() {
        await AsyncStorage.getItem("userData").then(value => {
            const userData = JSON.parse(value);
            this.setState({
                userData: userData,
                refresh: false
            });
        });
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization()
            this.fetchLocation();
        } else {
            this.requestLocationPermission();
        }
        // const { navigation } = ;
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // do something
            this.setState(
                {
                    postsListArray: [],
                    page: 0,
                    isListEnded: false,
                },
                this.makeRequesttoFetchPosts
            )
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.netinfoSubscribe = NetInfo.addEventListener(state => {
            if (state.isInternetReachable) {
                this.setState({ is_connected: true });
            } else {
                this.setState({ is_connected: false });
            }
        });
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                'title': 'Location Access Required',
                'message': "This app requires access to your location to show you relevant posts based on location.",
                buttonPositive: "OK"
            }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //To Check, If Permission is granted
                this.fetchLocation();
            } else {
                console.log("Location Permission Denied");
                this.makeRequesttoFetchPosts();
            }
        } catch (err) {
            console.warn(err)
        }
    }

    fetchLocation() {
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                console.log("GeoLocation Position:", position);
                var locationData = position;
                var latlang = "0.000,0.000";
                if (locationData && locationData.coords) {
                    var coords = locationData.coords;
                    latlang = coords.latitude + "," + coords.longitude;
                }
                this.setState({
                    latlang: latlang,
                    postsListArray: [],
                    page: 0
                }, this.makeRequesttoFetchPosts)

            },
            (error) => {
                this.setState({
                    latlang: "0.000,0.000",
                    postsListArray: [],
                    page: 0
                }, this.makeRequesttoFetchPosts)
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this._unsubscribe();
        this.netinfoSubscribe();
    }

    handleBackButton = () => {
        Alert.alert(
            '',
            'Are you sure you want to exit the app?',
            [
                { text: 'CANCEL', onPress: () => { }, style: 'cancel' },
                { text: 'YES', onPress: () => { BackHandler.exitApp() } },
            ],
            { cancelable: false }
        )
        return true;
    };

    makeRequesttoFetchPosts = () => {
        const { page, userData, latlang, postsListArray, is_connected } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS
        this.setState({ loading: true });
        if (!is_connected) {
            this.setState({
                loading: false,
                refreshing: false,
            });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
        console.debug(url);
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': userData.token
            },
            body: JSON.stringify({
                location: latlang,
                pageno: page
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Home Posts response:', responseData)
                this.setState({
                    loading: false,
                    refreshing: false,
                })
                if (responseData.status === 200) {
                    if (responseData.data.length === 0 && page != 0) {
                        this.setState({
                            isListEnded: true,
                        });
                        console.log("List Ended")
                    } else {
                        var postListAry = postsListArray;
                        let postsAry = responseData.data
                        postListAry = postListAry.concat(postsAry);
                        this.setState({
                            postsListArray: postListAry,
                            isListEnded: false,
                            error: responseData.error || null,
                        });
                    }
                    AsyncStorage.setItem("PostsData", JSON.stringify(this.state.postsListArray));
                } else {
                    this.refs.toast.show(responseData.message);
                }
            })
            .catch(error => {
                console.debug('Home Posts response ERROR:', error);
                this.setState({ error, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    render() {
        const { postsListArray, loading, userData } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle={'dark-content'} />
                {/* <View style={{ flex: 1 }}> */}
                <View style={styles.headerstyle}>
                    <Image source={require('../../images/home_header_logo.png')} style={{ width: 110, height: 50, marginLeft: 15 }} resizeMode={'contain'} />
                    {/* <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 20, marginLeft: 20 }]}>HUMMING</Text> */}
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={(ref) => { this.flatListRef = ref; }}
                        data={postsListArray}
                        renderItem={
                            ({ item }) => <HomePagePost key={item.marker_id} markerData={item} userData={userData} navigation={this.props.navigation} />
                        }
                        keyExtractor={(item, index) => item + index}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            if (!this.state.isListEnded) {
                                if (this.state.refreshing) {
                                    return null;
                                }
                                this.setState(
                                    (prevState) => {
                                        return { refreshing: true, page: prevState.page + 1 };
                                    },
                                    () => {
                                        this.makeRequesttoFetchPosts()
                                    }
                                );
                            }
                        }}
                    />
                </View>
                {
                    loading ? <ActivityIndicator
                        animating={true}
                        style={AppStyle.activityIndicator}
                        size='large'
                    /> : null
                }
                <Toast ref="toast" style={AppStyle.toast_style} />
                {/* </View> */}
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
    }
});