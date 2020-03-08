import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { LoginUser } from './Login.service';
import { AppStyle } from '../../App.style';
import Logo from '../Logo';
import axios from 'react-native-axios';
import Home from '../Home';
import Toast from 'react-native-easy-toast'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userPwd: "",
            isLoggedIn: ""
        };
    }
    login = async () => {
        const userName = this.state.userName;
        const userPwd = this.state.userPwd;
        if (userName != "") {
            if (userPwd != "") {
                LoginUser({
                    userName: userName,
                    userpassword: userPwd,
                }).then((res) => {
                    if (res.status === 200) {
                        this.props.navigation.navigate('TabBar', { userData: res.data });
                    } else {
                        this.refs.toast.show("username or password are incorrect");
                    }
                }).catch((err) => {
                    console.log('some info message to user using Toast Android');
                    this.refs.toast.show("Something went wrong. Please try again later");
                });
            }
            else {
                this.refs.toast.show("password cannot be Empty");
            }
        }
        else {
            this.refs.toast.show("Username cannot be Empty");
        }
    }

    goToRegister = () => {
        this.props.navigation.navigate('register');
    }
    render() {
        return (
            <View style={AppStyle.appContainer}>
                <Logo></Logo>
                {/* <Home/> */}
                <TextInput style={AppStyle.appInput} placeholder="Username12"
                    onChangeText={userName => this.setState({ userName })}></TextInput>
                <TextInput style={AppStyle.appInput} placeholder="Password" secureTextEntry={true}
                    onChangeText={userPwd => this.setState({ userPwd })}></TextInput>
                <TouchableOpacity onPress={this.login}>
                    <Text style={AppStyle.appButton}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={AppStyle.appMarginTop}>Forgotten Password?</Text>
                </TouchableOpacity>
                <View style={AppStyle.appFooter}>
                    <Text>Don't you have an account?</Text>
                    <TouchableOpacity onPress={this.goToRegister}>
                        <Text>&nbsp;&nbsp;SignUp</Text>
                    </TouchableOpacity>
                </View>
                <Toast ref="toast"
                    style={{ backgroundColor: 'grey', borderRadius: 20 }} />
            </View>
        )
    };
}