import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { LoginUser } from './Login.service';
import { AppStyle } from '../../App.style';
import Logo from '../Logo';
import axios from 'react-native-axios';
import Home from '../Home';
import Toast from 'react-native-easy-toast';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userPwd: "",
            isLoggedIn: "",
            loading: false,
        };
    }
    login = () => {
        const userName = this.state.userName;
        const userPwd = this.state.userPwd;
        if (userName != "") {
            if (userPwd != "") {
                this.setState({ loading: true })
                LoginUser({
                    userName: userName,
                    userpassword: userPwd,
                }).then((res) => {
                    this.setState({ loading: false })
                    if (res.status === 200) {
                        const userData = res && res.data;
                        AsyncStorage.setItem("userData", JSON.stringify(userData));
                        this.props.navigation.navigate('TabBar', { userData: res.data });
                    } else {
                        this.refs.toast.show("username or password are incorrect");
                    }
                }).catch((err) => {
                    this.setState({ loading: false })
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
        const loading = this.state.loading;
        return (
                <View style={AppStyle.appContainer}>
                    <Logo></Logo>
                    {/* <Home/> */}
                    <TextInput style={AppStyle.appInput} placeholder="Username"
                        onChangeText={userName => this.setState({ userName })}></TextInput>
                    <TextInput style={AppStyle.appInput} placeholder="Password" secureTextEntry={true}
                        onChangeText={userPwd => this.setState({ userPwd })}></TextInput>
                    <TouchableOpacity onPress={this.login}>
                        <Text style={AppStyle.appButton}>Sign in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={AppStyle.appMarginTop}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <View style={AppStyle.appFooter}>
                        <Text>Don't have an account?</Text>
                        <TouchableOpacity onPress={this.goToRegister}>
                            <Text>&nbsp;&nbsp;SignUp</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.loading ?
                            <ActivityIndicator
                                animating={true}
                                style={AppStyle.activityIndicator}
                                size='large'
                            /> : null
                    }
                    <Toast ref="toast"
                        style={{ backgroundColor: 'grey', borderRadius: 20 }} />
                </View>
        )
    };
}