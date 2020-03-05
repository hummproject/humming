import React, { Component } from 'react';
import { View, Image } from 'react-native';

export default class Logo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                marginVertical: 25
            }}>
                <Image style={{
                    width: 80,
                    height: 80,
                    resizeMode: 'contain',
                }} source={require('../../images/logo.png')} />
            </View>
        );
    }
}