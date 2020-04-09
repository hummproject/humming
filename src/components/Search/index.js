import React, { Component } from 'react';
import { Text, View, TextInput, SafeAreaView, Image, SectionList, ActivityIndicator, TouchableOpacity, Keyboard, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { styles } from './search.styles';
import SearchPosts from '../SearchPosts';
import Toast from 'react-native-easy-toast'
import AppConfig from '../../config/constants'
import { AppStyle } from '../../App.style'

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userData: {},
            dataArray: [], //this is the array
            error: null,
            searchedText: '',
        };
    }

    async componentDidMount() {
        await AsyncStorage.getItem("userData").then(value => {
            const userData = JSON.parse(value);
            this.setState({
                userData: userData
            });
        });
        this.makeRequesttoFetchTopMarkers();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    };

    SearchPosts = (text) => {
        Keyboard.dismiss();
        // if (this.state.searchedText >= 3) {
        console.debug('Search Text is:', text)
        this.makeRequesttoFetchSearchedMarkers();
        // }
    };

    makeRequesttoFetchSearchedMarkers = () => {
        const { userData } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.SEARCH_ALL_MARKERS
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
                searchname: this.state.searchedText,
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Search page Search MARKERS response:', responseData)
                if (responseData.status === 200) {
                    let responseAry = responseData.data;
                    var categoriesAry = new Array();
                    for (let obj of responseAry) {
                        if (categoriesAry.indexOf(obj.category) === -1) {
                            categoriesAry.push(obj.category);
                        }
                    }
                    // console.debug('category array', categoriesAry);
                    var searchResultdataAry = new Array();
                    for (var i = 0; i < categoriesAry.length; i++) {
                        let category = categoriesAry[i];
                        var categorywiseMarkersAry = new Array();
                        for (let object of responseAry) {
                            if (object.category === category) {
                                categorywiseMarkersAry.push(object)
                            }
                            continue;
                        }
                        // console.debug('categorywiseMarkers data Array', categorywiseMarkersAry);
                        searchResultdataAry.push({ 'category': category, 'data': categorywiseMarkersAry });
                    }
                    var dataArray = this.state.dataArray;
                    for (var i = 0; i < dataArray.length; i++) {
                        if (dataArray[i].title && dataArray[i].title === "Search Results") {
                            dataArray.splice(i, 1);
                            break;
                        }
                    }
                    if (searchResultdataAry && searchResultdataAry.length) {
                        // not empty 
                        let dataObj = { 'title': 'Search Results', 'data': searchResultdataAry };
                        dataArray.unshift(dataObj);
                        // console.debug('Data Array Final', dataArray)
                    } else {
                        // empty
                        this.refs.toast.show('No search results found');
                    }
                    this.setState({
                        dataArray: dataArray,
                        error: responseData.error || null,
                        loading: false,
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

    makeRequesttoFetchTopMarkers = () => {
        const { userData } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.SEARCH_TOP_MARKERS
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
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Search page TOP MARKERS response:', responseData)
                if (responseData.status === 200) {
                    let responseAry = responseData.data.markers;
                    // console.debug('Markers Response', responseAry);
                    let categoriesAry = responseData.data.categories
                    var dataAry = new Array();
                    for (var i = 0; i < categoriesAry.length; i++) {
                        let category = categoriesAry[i];
                        var categorywiseMarkersAry = new Array();
                        for (let obj of responseAry) {
                            if (obj['category'] === category) {
                                categorywiseMarkersAry.push(obj)
                            }
                            continue;
                        }
                        dataAry.push({ 'category': category, 'data': categorywiseMarkersAry });
                    }
                    // console.debug('Categories sorted DATA Array', dataAry);
                    let dataObj = { 'title': 'Trending Categories', 'data': dataAry };
                    this.setState({
                        dataArray: [dataObj],
                        error: responseData.error || null,
                        loading: false,
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
        const { dataArray, loading } = this.state
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.headerstyle}>
                    <View style={styles.searchView}>
                        <TextInput
                            style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, marginLeft: 10, marginRight: 0, width: '88%' }]}
                            placeholder="Search anything"
                            value={this.state.searchedText}
                            onChangeText={(text) => this.setState({
                                searchedText: text
                            })} >
                        </TextInput>
                        <TouchableOpacity onPress={() => this.SearchPosts()}>
                            <Image style={{ width: 20, height: 20, marginRight: 10 }} source={require('../../images/TabBar/search-icon-inactive.png')} resizeMode={'contain'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <SectionList
                    sections={dataArray}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <SearchPosts postData={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={{ height: 50, backgroundColor: '#FFFFFF', flex: 1, justifyContent: 'center' }}>
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 16, paddingLeft: 15 }]}>{title}</Text>
                        </View>
                    )}
                />
                {
                    loading ? <ActivityIndicator
                        animating={true}
                        style={AppStyle.activityIndicator}
                        size='large'
                    /> : null
                }
                <Toast ref="toast" style={AppStyle.toast_style} />
            </SafeAreaView>
        );
    }
}