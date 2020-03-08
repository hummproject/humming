import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Image, Text } from 'react-native';
import HomePagePost from '../HomePagePost';
import { AppStyle } from '../../App.style'
import AppConfig from '../../config/constants';

export default class Home extends Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            postsListArray: [{}, {}, {}, {}, {}, {}, {}, {}, {}], //this is the array
            page: 1,
            error: null,
            refreshing: false,
        };
    }

    componentWillMount() {
        this.makeRequesttoFetchPosts();
    }

    makeRequesttoFetchPosts = () => {
        const { page } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS;
        this.setState({ loading: true });
        fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTIiLCJpYXQiOjE1ODM2OTI4MDksImV4cCI6MTU4NDI5NzYwOX0.5hCVFH22B6GQcXT1ztCZVqjjVfm1j0FyNdaoeAuF1_M',
            },
            body: JSON.stringify({
                location:'78.4373585,17.4337072',
                pageno:0
            }),
        })
            .then(res => res.json())
            .then(res => {
                debugger;
                console.log(res.data)
                this.setState({
                    postsListArray: res.results,
                    error: res.error || null,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    };

    render() {
        const { postsListArray, loading } = this.state;
        return (
            loading ?
                <View>
                    <View style={styles.headerstyle}>
                        <Image source={require('../../images/logo.png')} style={{ width: 30, height: 40, marginLeft:15 }} />
                        <Text style={{ fontSize: 18, marginLeft: 10, }}>HUMMING</Text>
                    </View>
                    <ActivityIndicator
                        animating={true}
                        style={AppStyle.activityIndicator}
                        size='large'
                    />
                </View>
                :
                <View>
                    <View style={styles.headerstyle}>
                        <Image source={require('../../images/logo.png')} style={{ width: 30, height: 40, marginLeft:15 }} />
                        <Text style={{ fontSize: 18, marginLeft: 10, }}>HUMMING</Text>
                    </View>
                    <FlatList
                        data={postsListArray}
                        renderItem={({ item }) => <HomePagePost />
                        }
                    />
                </View>
        )
    };
}

const styles = StyleSheet.create({
    headerstyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        elevation:2,
        borderBottomColor:'#ECECEC',
        borderBottomWidth:1,
        alignItems:'center',
    }
});