import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image } from 'react-native';
import { AppStyle } from '../../App.style'

export default class Notifications extends Component {
    constructor(props) {
        super(props);

    }

    async componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FBFBFB' }}>
                <View style={styles.headerstyle}>
                    <Text style={[AppStyle.dark_TextColor, AppStyle.app_font_heading, { fontSize: 20, marginLeft: 20 }]}>Notifications</Text>
                    {/* <Image source={userDp == null ? require('../../images/logo.png') : { uri: userDp }} style={[styles.profile_photo, { marginRight: 20 }]} resizeMode={userDp == null ? 'contain' : 'cover'} /> */}
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>Coming Soon</Text>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    headerstyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 70,
        elevation: 2,
        borderBottomColor: '#ECECEC',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },

});