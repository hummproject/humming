import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    up1: {
        flex: 4,
        marginVertical: 25,
        flexDirection: 'row',
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
        justifyContent: 'flex-start',
    },

    searchView: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        marginLeft: 20,
        marginRight: 10,
        backgroundColor: '#F1F2F6',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden'
    },

    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        width: '90%',
        alignItems: 'center',
        elevation: 2,
    },

    container: {
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        shadowColor: '#ECECEC',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.5,
        elevation: 3,
    },

    TopContainer: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    BottomContainer: {
        width: '100%',
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

});

export { styles }