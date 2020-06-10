import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';


const ProfileStyles = StyleSheet.create({
    followContent: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    userDp: {
        width: Dimensions.get('window').width - 30,
        height: 200,
        borderRadius: 5,
    },

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

    MenuOptionStyle: {
        zIndex: 1,
        position: 'absolute',
        right: 20,
        flexDirection: 'column',
        flexWrap: 'wrap',
        backgroundColor: '#FFFFFF',
        alignSelf: 'flex-end',
        padding: 10,
        borderRadius: 15,
        elevation: 2,
        borderColor: '#ececec',
        borderWidth: 0.5,
        borderTopWidth: 0,
    },

    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        padding: 15,
        width: '75%',
        alignItems: 'center',
        elevation: 2,
    },
});

export { ProfileStyles }