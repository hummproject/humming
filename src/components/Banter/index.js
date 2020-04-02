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
            userListArray: [], //this is the array
            error: null,
            postsData: [],
            isUserSelected: false,
            userSelectedPost: {},
            isuserSelectionChanged: false,
        };
    }

    async componentDidMount() {
        await AsyncStorage.getItem("PostsData").then(value => {
            const postsData = JSON.parse(value);
            this.setState({
                postsData: postsData,
                isUserSelected : false,
            });
        });
        console.debug('Banter Posts List', this.state.postsData)
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
    }

    showPostBasedonUserSelection = (item) => {
        console.debug("user selected", item);
        this.setState({
            isUserSelected: true,
            userSelectedPost: item,
            isuserSelectionChanged:!this.state.isuserSelectionChanged
        })
    };

    render() {
        const { userListArray, userSelectedPost, isUserSelected,isuserSelectionChanged } = this.state;
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
                                        <View style={styles.categoryContainer}>
                                            <Image source={require('../../images/category_marker_icon.png')} style={{ height: 15, width: 15 }} />
                                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 15, marginLeft: 5, color: 'white' }]}>{item.category}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        }
                        keyExtractor={(item, index) => index + ""}
                    />
                </View>
                {
                    (isUserSelected && isuserSelectionChanged) ?
                        <FlatList
                            data={[userSelectedPost]}
                            renderItem={
                                ({ item }) => <BanterPagePosts postsData={item} />
                            }
                            keyExtractor={(item, index) => index + ""}
                        />
                        :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' }}>
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>Click on any profile to view their post disscussions</Text>
                        </View>
                }
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
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
        backgroundColor: '#4A357A'
    },
});