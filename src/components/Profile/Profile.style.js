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
        height: 60,
        elevation: 2,
        borderBottomColor: '#ECECEC',
        borderBottomWidth: 1,
        alignItems: 'center',
    },

    MenuOptionStyle: {
        zIndex: 1,
        position: 'absolute',
        right: 0,
        flexDirection: 'column',
        flexWrap: 'wrap',
        backgroundColor: '#FFFFFF',
        alignSelf: 'flex-end',
        padding: 10,
        borderBottomLeftRadius: 5,
        elevation: 2,
        borderColor: '#ececec',
        borderWidth: 0.5,
        borderTopWidth: 0,
    },

    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        width: '75%',
        alignItems: 'center',
        elevation: 2,
        borderColor: '#F5F5F5',
        borderWidth: 1,
        shadowColor: '#F5F5F5',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.8
    },
});

export { ProfileStyles }