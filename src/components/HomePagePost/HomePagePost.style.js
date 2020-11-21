import React from 'react';
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        shadowColor: '#ECECEC',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 2,
        borderColor: '#ECECEC',
        borderWidth: (Platform.OS === 'ios') ? 0.5 : 0,
    },

    categoryContainer: {
        flexDirection: "row",
        alignItems: 'center',
        alignSelf: 'baseline',
        justifyContent: 'flex-start',
        padding: 3,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 15,
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

    TopContainer: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    BottomContainer: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingBottom: 15,
        paddingTop: 15,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 15,
        justifyContent: 'flex-start',
    },

    profile_photo: {
        flex: 1,
        height: 60,
        width: 60,
        borderRadius: 30,
    },
});

export { styles }