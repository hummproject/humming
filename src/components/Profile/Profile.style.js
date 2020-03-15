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
        width: 130,
        height: 130,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 70
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
});

export { ProfileStyles }