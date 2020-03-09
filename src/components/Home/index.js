import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Image, Text } from 'react-native';
import HomePagePost from '../HomePagePost';
import { AppStyle } from '../../App.style'
import AppConfig from '../../config/constants';
// import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            postsListArray: [{userName:'Veerender shivannagari', userTag:'Veeru',category:'Food'}, 
            {userName:'RAkesh nagula', userTag:'Nagula',category:'Love'},
            {userName:'P saiteja', userTag:'sai',category:'Movie'},
            {userName:'veeru', userTag:'Veeru12',category:'Food'},
            {userName:'PavaN', userTag:'Bakku',category:'Love'},
            {userName:'VeerendER45', userTag:'Veeru',category:'Movie'},
            {userName:'VeerendeR12', userTag:'Veeru',category:'Love'}], //this is the array
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
        const { navigation, route } = this.props;
        const userData = route.params.params.userData;
        const token = userData.token;
        console.debug('Props in HomeScreen',userData)
        console.debug('Token:',token)
        const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS
        console.debug(url);
        this.setState({ loading: true });
        fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'token':token
            },
            body: JSON.stringify({
                location:'78.4373585,17.4337072',
                pageno:0
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Home Posts response:',responseData.data,responseData.error,responseData.results)
                this.setState({
                    postsListArray: responseData.results,
                    error: responseData.error || null,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => {
                console.debug('Home Posts response ERROR:',error);
                this.setState({ error, loading: false });
            });
    };

    render() {
        const { postsListArray, loading } = this.state;
        return (
            loading ?
                <View style ={{flex:1}}>
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
                <View style ={{flex:1}}>
                    <View style={styles.headerstyle}>
                        <Image source={require('../../images/logo.png')} style={{ width: 30, height: 40, marginLeft:15 }} />
                        <Text style={{ fontSize: 18, marginLeft: 10, }}>HUMMING</Text>
                    </View>
                    <FlatList
                        data={postsListArray} 
                        renderItem={
                          ({item}) => <HomePagePost userData= {item}/>
                        } 
                        keyExtractor={(item, index) => index+""}
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