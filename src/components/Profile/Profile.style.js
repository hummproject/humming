import React from 'react';
import { StyleSheet } from 'react-native';

const ProfileStyles = StyleSheet.create({
    followContent: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    userBio: {
        paddingLeft: 100,
        paddingRight: 50
    },
    userDp: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 60
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
    MenuOptionStyle:{
        zIndex: 1,
        position: 'absolute', 
        top: 55,
        right: 0,
        flexDirection: 'column', 
        flexWrap: 'wrap', 
        backgroundColor: '#FFFFFF', 
        alignSelf: 'flex-end', 
        padding: 10,
        borderBottomLeftRadius: 5, 
        elevation: 2,
        borderColor:'#ececec',
        borderWidth: 0.5,
        borderTopWidth: 0,
    },
});

export { ProfileStyles }