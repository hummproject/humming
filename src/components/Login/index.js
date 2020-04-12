import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Keyboard, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { LoginUser } from './Login.service';
import { AppStyle } from '../../App.style';
import Logo from '../Logo';
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

    dismissKeyboard() {
        Keyboard.dismiss();
    }

    login = () => {
        this.dismissKeyboard();
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
                    console.debug("User Data from Login", res && res.data)
                    if (res.status === 200) {
                        const userData = res && res.data;
                        console.debug("User Data from Login", userData)
                        console.debug("isActive: ",userData.isactive);
                        if (userData.isactive == true) {
                            AsyncStorage.setItem("userData", JSON.stringify(userData));
                            this.props.navigation.navigate('TabBar', { isfromLogin: true });
                        } else {
                            this.refs.toast.show("This account is currently deactive");
                        }
                    } else {
                        this.refs.toast.show("username or password are incorrect");
                    }
                }).catch((error) => {
                    this.setState({ loading: false })
                    console.log(error);
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

    goToForgotPassword = () => {
        this.props.navigation.navigate('forgotpassword');
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        Alert.alert(
            '',
            'Are you sure you want to exit the app?',
            [
                { text: 'CANCEL', onPress: () => { }, style: 'cancel' },
                { text: 'YES', onPress: () => { BackHandler.exitApp() } },
            ],
            { cancelable: false }
        )
        return true;
    };

    render() {
        const loading = this.state.loading;
        return (
            <SafeAreaView style={AppStyle.appContainer}>
                <Logo></Logo>
                {/* <Home/> */}
                <TextInput style={AppStyle.appInput} placeholder="Username"
                    onChangeText={userName => this.setState({ userName })}></TextInput>
                <TextInput style={AppStyle.appInput} placeholder="Password" secureTextEntry={true}
                    onChangeText={userPwd => this.setState({ userPwd })}></TextInput>
                <TouchableOpacity onPress={this.login}>
                    <Text style={AppStyle.appButton}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.goToForgotPassword}>
                    <Text style={[AppStyle.app_font, { marginTop: 25, fontSize: 15 }, AppStyle.light_TextColor]}>Forgot your password?</Text>
                </TouchableOpacity>
                <View style={AppStyle.appFooter}>
                    <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 15 }]}>Don't have an account?</Text>
                    <TouchableOpacity onPress={this.goToRegister}>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 15 }]}>&nbsp;&nbsp;Sign up</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.loading ?
                        <ActivityIndicator
                            animating={true}
                            style={AppStyle.activityIndicator}
                            size='large'
                        />
                        : null
                }
                <Toast ref="toast"
                    style={AppStyle.toast_style} />
            </SafeAreaView>
        )
    };
}