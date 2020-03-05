import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { AppStyle } from '../../App.style';
import Logo from '../Logo';

export default class Register extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={AppStyle.appContainer}>
                <Logo></Logo>
                <TextInput style={AppStyle.appInput} placeholder="Firstname"></TextInput>
                <TextInput style={AppStyle.appInput} placeholder="Lastname"></TextInput>
                <TextInput style={AppStyle.appInput} placeholder="Email"></TextInput>
                <TouchableOpacity><Text style={AppStyle.appButton}>Next</Text></TouchableOpacity>

                <View style={AppStyle.appFooter}>
                    <Text>Already had an account?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('login')}>
                        <Text>&nbsp;&nbsp;SignIn</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}