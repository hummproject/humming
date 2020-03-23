import React from 'react';
import { StyleSheet } from 'react-native';

const AppStyle = StyleSheet.create({
    appContainer: {
        flexGrow: 1,
        flexDirection:'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    appAlignItemsCenter: {
        flex: 1,
        alignItems: "center",
        marginTop: 3,
        marginBottom: 5
    },
    appLabel: {
        fontSize:17,
        color: "#9B9B9B"
    },
    appInput: {
        width: 300,
        height: 45,
        backgroundColor: '#F5F5F5',
        borderRadius: 22.5,
        textAlign: "center",
        marginVertical: 10
    },
    
    appButton: {
        width: 150,
        height:40,
        borderRadius: 20,
        backgroundColor: '#6454F0',
        color: 'white',
        textAlign: "center",
        padding: 10,
        textTransform: "uppercase",
        marginTop: 20
    },

    appMarginTop: {
        marginTop: 20
    },

    appFooter: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // width: '100%',
        // height: 50,
        // justifyContent: 'center',
        // alignItems: 'center',
        // position: 'absolute',
        // bottom: 0
    },
    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute', 
        top: 0, left: 0, 
        right: 0, bottom: 0,
        backgroundColor :'#F5FCFF88'
    },

    light_TextColor:{
        color:"#9B9B9B"
    },

    dark_TextColor:{
        color:"#000000"
    },

});

export { AppStyle };