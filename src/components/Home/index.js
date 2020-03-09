import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import HomePagePost from '../HomePagePost';
import { AppStyle } from '../../App.style'

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

    componentDidMount() {
        // this.makeRequesttoFetchPosts();
    }
    
    makeRequesttoFetchPosts = () => {
        // const { page } = this.state;
        const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
        this.setState({ loading: true });
        fetch(url,{
        method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: userName,
                userpassword: userPwd
            }),
        })
            .then(res => res.json())
            .then(res => {
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
                <ActivityIndicator
                    animating={true}
                    style={AppStyle.activityIndicator}
                    size='large'
                />
                : <FlatList
                    data={postsListArray}
                    renderItem={({ item }) => <HomePagePost />
                    }
                />

        )
    };
}