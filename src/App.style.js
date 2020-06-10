import React from 'react';
import { StyleSheet } from 'react-native';

const AppStyle = StyleSheet.create({
    appContainer: {
        flexGrow: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    login_appContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    appAlignItemsCenter: {
        flex: 1,
        alignItems: "center",
        marginTop: 3,
        marginBottom: 5
    },

    appLabel: {
        fontSize: 17,
        color: "#9B9B9B",
        fontFamily: 'Roboto-Regular',
    },

    appInput: {
        width: 300,
        height: 50,
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        textAlign: "center",
        marginVertical: 10,
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
    },

    Loginlogo: {
        width: 60,
        height: 60,
        marginTop: 50,
        resizeMode: 'contain',
    },

    appButton_background: {
        width: 150,
        height: 40,
        borderRadius: 20,
        padding: 10,
        marginTop: 20,
        overflow: "hidden"
    },

    appButton_Text: {
        color: 'white',
        textAlign: "center",
        textTransform: "uppercase",
        fontFamily: 'Roboto-Regular',
    },

    appMarginTop: {
        marginTop: 20
    },

    appFooter: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0, left: 0,
        right: 0, bottom: 0,
        backgroundColor: '#F5FCFF88'
    },

    toast_style: {
        backgroundColor: 'grey',
        borderRadius: 20,
    },

    header_profile_photo: {
        height: 35,
        width: 35,
        borderRadius: 17.5,
    },

    light_TextColor: {
        color: "#9B9B9B"
    },

    light_gray_TextColor: {
        color: "#D8D8D8"
    },

    light_blue_TextColor: {
        color: "#ACB1C0"
    },

    dark_TextColor: {
        color: "#1E2432"
    },

    app_font: {
        fontFamily: 'Roboto-Regular'
    },

    app_font_heading: {
        fontFamily: 'SFUIText-Regular'
    },

    app_font_heading_Bold: {
        fontFamily: 'SFUIText-Bold'
    }

});

export { AppStyle };