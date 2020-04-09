import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Image, Text, BackHandler, Alert } from 'react-native';
import HomePagePost from '../HomePagePost';
import { AppStyle } from '../../App.style'
import AppConfig from '../../config/constants';
import Toast from 'react-native-easy-toast'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            postsListArray: [], //this is the array
            page: 1,
            error: null,
            refreshing: false,
            userData: {},
        };
    }

    async componentDidMount() {
        await AsyncStorage.getItem("userData").then(value => {
            const userData = JSON.parse(value);
            this.setState({
                userData: userData
            });
        });
        // this._componentFocused();
        // this._sub = this.props.navigation.addListener(
        //     'didFocus',
        //     this._componentFocused
        // );
        this.makeRequesttoFetchPosts();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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

    // componentWillUnmount() {
    //     this._sub.remove();
    // }

    // _componentFocused = () => {
    //     console.debug('Screen focused')
    // }

    makeRequesttoFetchPosts = () => {
        const { page, userData } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS
        console.debug(url);
        this.setState({ loading: true });
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
                console.debug('Home Posts response:', responseData)
                AsyncStorage.setItem("PostsData", JSON.stringify(responseData.data));
                this.setState({
                    loading: false,
                })
                if (responseData.status === 200) {
                    this.setState({
                        postsListArray: responseData.data,
                        error: responseData.error || null,
                        refreshing: false
                    });
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
                <View style={{ flex: 1 }}>
                    <View style={styles.headerstyle}>
                        <Image source={require('../../images/home_header_logo.png')} style={{ width: 110, height: 50, marginLeft: 15 }} resizeMode={'center'} />
                        {/* <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 20, marginLeft: 20 }]}>HUMMING</Text> */}
                    </View>
                    <FlatList
                        contentInset={{ top: 0, bottom: -20, left: 0, right: 0 }}
                        contentInsetAdjustmentBehavior="automatic"
                        data={postsListArray}
                        renderItem={
                            ({ item }) => <HomePagePost markerData={item} userData={userData} navigation={this.props.navigation} />
                        }
                        keyExtractor={(item, index) => index + ""}
                    />
                    {
                        loading ? <ActivityIndicator
                            animating={true}
                            style={AppStyle.activityIndicator}
                            size='large'
                        /> : null
                    }
                    <Toast ref="toast" style={AppStyle.toast_style} />
                </View>
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