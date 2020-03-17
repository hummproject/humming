import React, { Component } from 'react';
import { Text, View, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import BanterPagePosts from '../BanterPagePosts';

export default class Banter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            userListArray: [{ title: 'hi' }, { title: 'hi1' }, { title: 'hi2' }, { title: 'hi3' }, { title: 'hi4' }, { title: 'hi5' }, { title: 'hi6' }], //this is the array
            error: null,
            userData: {},
            isUserSelected: false,
        };
    }

    showPostsBasedonUserSelection = (item) => {
        console.debug("user selected", item);
        this.setState({
            isUserSelected : true
        })
    };

    render() {
        const { userListArray } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.headerstyle}>
                    <Text style={{ fontSize: 18, marginLeft: 15, }}>Banter</Text>
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
                                        <Text style={{ marginLeft: 5, color: 'white' }}>Art</Text>
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
                            <Text>Click on any profile to view their post disscussions</Text>
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
        alignSelf: 'baseline',
        justifyContent: 'flex-start',
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
        backgroundColor: '#4B0082'
    },
});