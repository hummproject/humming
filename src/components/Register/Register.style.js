import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        alignItems: 'center'
    },
    inputtextfield: {
        width: 250,
        backgroundColor: '#E2E2E2',
        borderRadius: 25,
        height: 40,
        textAlign: "center",
        marginVertical: 10,
    },
    buttonCss: {
        borderRadius: 25,
        width: 220,
        height: 30,
        marginVertical: 15,
        backgroundColor: 'blue',
        color: 'white',
        textAlign: "center",
        paddingTop: 4,
    },
    signup: {
        marginVertical: 30,
        flexDirection: 'row',
    },
    up1: {
        flex: 3,
        marginVertical: 50,
    },
    up2: {
        height: 40,
        fontSize: 25,
        marginVertical: 10,
        marginLeft: 20
    },
    up3: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 130,
    },
    up4: {
        width: '50%',
        fontSize: 20,
    },
    up5: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    up6: {
        marginVertical: 15,
        fontSize: 20,
        marginLeft: 10,
        width: '100%'
    }
});

export { styles }