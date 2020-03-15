import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Image, Text } from 'react-native';
import HomePagePost from '../HomePagePost';
import { AppStyle } from '../../App.style'
import AppConfig from '../../config/constants';
import Toast from 'react-native-easy-toast'
import { SafeAreaView } from 'react-native-safe-area-context';

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            postsListArray: [], //this is the array
            page: 1,
            error: null,
            refreshing: false,
        };
    }

    componentDidMount() {
        this.makeRequesttoFetchPosts();
    }

    makeRequesttoFetchPosts = () => {
        const { page } = this.state;
        const { route } = this.props;
        const userData = route.params.params.userData;
        const token = userData.token;
        console.debug('Props in HomeScreen', userData)
        console.debug('Token:', token)
        const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS
        console.debug(url);
        this.setState({ loading: true });
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                location: '78.4373585,17.4337072',
                pageno: '0'
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Home Posts response:', responseData)
                console.debug('Home Posts response:', responseData.message)
                if (responseData.status === 200) {
                    this.setState({
                        postsListArray: responseData.data,
                        error: responseData.error || null,
                        loading: false,
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
        const { postsListArray, loading } = this.state;
        return (
            loading ?
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.headerstyle}>
                            <Image source={require('../../images/logo.png')} style={{ width: 30, height: 40, marginLeft: 15 }} />
                            <Text style={{ fontSize: 18, marginLeft: 10, }}>HUMMING</Text>
                        </View>
                        <ActivityIndicator
                            animating={true}
                            style={AppStyle.activityIndicator}
                            size='large'
                        />
                        <Toast ref="toast" />
                    </View>
                </SafeAreaView>
                :
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.headerstyle}>
                            <Image source={require('../../images/logo.png')} style={{ width: 30, height: 40, marginLeft: 15 }} />
                            <Text style={{ fontSize: 18, marginLeft: 10, }}>HUMMING</Text>
                        </View>
                        <FlatList
                            data={postsListArray}
                            renderItem={
                                ({ item }) => <HomePagePost userData={item} />
                            }
                            keyExtractor={(item, index) => index + ""}
                        />
                        <Toast ref="toast" />
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