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
    }
});

export { ProfileStyles }