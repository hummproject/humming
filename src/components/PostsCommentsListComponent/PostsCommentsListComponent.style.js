import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderBottomColor: '#ECECEC',
        borderBottomWidth: 0.5,
        backgroundColor: '#FFFFFF',
        elevation: 2,
    },

    TopContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
    },

    BottomContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    UserName: {
        fontSize: 16,
        color: '#000000',
    },

    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 15,
        justifyContent: 'flex-start',
    },

    text_description: {
        fontSize: 13,
        fontStyle: 'normal',
        color: '#000000',
    },

    text_light: {
        fontSize: 12,
        fontStyle: 'normal',
        color: '#808080',
    },

    profile_photo: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginLeft: 15
    },
});

export { styles }