import React, { Component } from 'react';
import { Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import BanterPagePosts from '../BanterPagePosts';
import AsyncStorage from '@react-native-community/async-storage';
import { AppStyle } from '../../App.style'

export default class Banter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            userListArray: [{ title: 'hi' }, { title: 'hi1' }, { title: 'hi2' }, { title: 'hi3' }, { title: 'hi4' }, { title: 'hi5' }, { title: 'hi6' }], //this is the array
            error: null,
            postsData: [],
            isUserSelected: false,
        };
    }

    async componentDidMount() {
        await AsyncStorage.getItem("PostsData").then(value => {
            const postsData = JSON.parse(value);
            this.setState({
                postsData: postsData
            });
        });
        console.debug('Banter Posts List', this.state.postsData)

        var postsArray = this.state.postsData
        for (var i = 1; i <= postsArray.length; i++) {
            let obj1 = postsArray[i];
            let obj2 = postsArray[i];
            var keyA = 0
            if (Array.isArray(obj1.markercomments)) {
                keyA = obj1.markercomments.length
            }
            var keyB = 0
            if (Array.isArray(obj2.markercomments)) {
                keyB = obj2.markercomments.length
            }
            console.debug('object 1', keyA)
            console.debug('Object 2', keyB)
            // if(keyA < keyB){
            //     postsArray[i] = obj1;
            //     postsArray[i - 1] =  obj2;
            // }
        }

        // postsArray.sort(function (a, b) {
        //     let keyA = a.markercomments === null ? 0 : a.markercomments.length
        //     let keyB = b.markercomments === null ? 0 : b.markercomments.length
        //     return keyA - keyB
        // });

        console.debug('sorted Array:', postsArray);
    }

    showPostsBasedonUserSelection = (item) => {
        console.debug("user selected", item);
        this.setState({
            isUserSelected: true
        })
    };

    render() {
        const { userListArray } = this.state;
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
                            ({ item }) =>
                                <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: '#FFFFFF' }} onPress={() => this.showPostsBasedonUserSelection(item)}>
                                    <Image source={require('../../images/img.jpg')} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />
                                    <View style={styles.categoryContainer}>
                                        <Image source={require('../../images/category_marker_icon.png')} style={{ height: 15, width: 15 }} />
                                        <Text style={[AppStyle.dark_TextColor,AppStyle.app_font,{fontSize: 15, marginLeft: 5, color: 'white' }]}>Art</Text>
                                    </View>
                                </TouchableOpacity>
                        }
                        keyExtractor={(item, index) => index + ""}
                    />
                </View>
                {
                    this.state.isUserSelected ?
                        <FlatList
                            data={[{}, {}, {}, {}, {}]}
                            renderItem={
                                ({ item }) => <BanterPagePosts />
                            }
                            keyExtractor={(item, index) => index + ""}
                        />
                        :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' }}>
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14}]}>Click on any profile to view their post disscussions</Text>
                        </View>
                }
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
    categoryContainer: {
        flexDirection: "row", 
        alignItems: 'center', 
        alignSelf:'baseline',
        justifyContent: 'flex-start', 
        padding:5,
        paddingLeft: 10, 
        paddingRight:10, 
        borderRadius:15,
        backgroundColor:'#4A357A'
    },
});