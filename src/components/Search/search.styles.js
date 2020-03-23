import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    up1:{
        flex:4,
        marginVertical:25,
        flexDirection:'row',
        borderRadius:5,
    },
    headerstyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        elevation: 2,
        borderBottomColor: '#ECECEC',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent:'center',
    },

    searchView: {
        flexDirection: 'row',
        height: 40,
        width:'90%',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        alignItems:'center',
        justifyContent:'space-between',
        overflow: 'hidden'
    },
});
   
export{ styles }