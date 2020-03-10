import React from 'react';
import { StyleSheet } from 'react-native';

const AppStyle = StyleSheet.create({
    appContainer: {
        flexGrow: 1,
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
        fontWeight: "bold",
        color: "#4682B4"
    },
    appInput: {
        width: 300,
        height: 40,
        backgroundColor: '#e2e2e25e',
        borderRadius: 25,
        textAlign: "center",
        marginVertical: 10
    },
    appButton: {
        width: 300,
        borderRadius: 5,
        backgroundColor: '#6454F0',
        color: 'white',
        textAlign: "center",
        padding: 10,
        textTransform: "uppercase",
        marginTop: 15
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: "absolute",
        top: '20%',
        left: '30%'
    }
});

export { AppStyle };