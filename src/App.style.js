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
        height: 45,
        backgroundColor: '#F5F5F5',
        borderRadius: 22.5,
        textAlign: "center",
        marginVertical: 10,
        fontFamily: 'Roboto-Regular',
    },

    appButton: {
        width: 150,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#6454F0',
        color: 'white',
        textAlign: "center",
        padding: 10,
        textTransform: "uppercase",
        marginTop: 20,
        fontFamily: 'Roboto-Regular',//'Roboto-Light',
        overflow: "hidden"
    },

    // appButtonIOS: {
    //     width: 150,
    //     height: 40,
    //     borderRadius: 20,
    //     backgroundColor: '#6454F0',
    //     color: 'white',
    //     textAlign: "center",
    //     padding: 10,
    //     textTransform: "uppercase",
    //     marginTop: 20,
    //     fontFamily: 'Roboto-Regular',//'Roboto-Light',
    //     overflow: "hidden"
    // },

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

    light_TextColor: {
        color: "#9B9B9B"
    },

    dark_TextColor: {
        color: "#000000"
    },

    app_font: {
        fontFamily: 'Roboto-Regular'
    }

});

export { AppStyle };