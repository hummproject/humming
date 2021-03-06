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

    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 15,
        marginTop: 5,
        justifyContent: 'flex-start',
    },

    text_light: {
        fontSize: 12,
        fontStyle: 'normal',
        color: '#9E9E9E',
    },

    profile_photo: {
        height: 50,
        width: 50,
        borderRadius: 25,
        
    },
});

export { styles }