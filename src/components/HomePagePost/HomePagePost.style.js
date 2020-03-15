import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderBottomColor: '#ECECEC',
        borderBottomWidth: 1,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        elevation: 2,
    },

    categoryContainer: {
        flexDirection: "row", 
        alignItems: 'center', 
        alignSelf:'baseline',
        justifyContent: 'flex-start', 
        padding:5,
        paddingLeft: 10, 
        paddingRight:10, 
        borderRadius:15,
        backgroundColor:'#4B0082'
    },

    TopContainer: {
        flex: 1,
        flexDirection: 'row-reverse',
        paddingTop: 15,
        paddingBottom: 15,
        alignItems:'center'
    },

    BottomContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    UserName: {
        fontSize: 16,
        color: '#000000',
        paddingBottom:0
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 15,
        justifyContent: 'flex-start',
    },
    userTag: {
        fontSize: 14,
        fontStyle: 'normal',
        paddingBottom:5
    },
    profile_photo: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginRight: 15,
        backgroundColor:'#FEFEFE'
    },
});

export { styles }