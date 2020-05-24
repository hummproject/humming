import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Keyboard, BackHandler, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { LoginUser } from './Login.service';
import { AppStyle } from '../../App.style';
import Logo from '../Logo';
import Toast from 'react-native-easy-toast';
import AppConfig from '../../config/constants';
import NetInfo from "@react-native-community/netinfo";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userPwd: "",
            loading: false,
            is_connected: false,
        };
    }

    dismissKeyboard() {
        Keyboard.dismiss();
    }

    login = () => {
        this.dismissKeyboard();
        const { userPwd, userName, is_connected } = this.state;
        if (userName != "") {
            if (userPwd != "") {
                this.setState({ loading: true })
                if (!is_connected) {
                    this.setState({
                        loading: false,
                        refreshing: false,
                    });
                    this.refs.toast.show("Internet is not connected, Please try again!");
                    return;
                }
                LoginUser({
                    userName: userName,
                    userpassword: userPwd,
                }).then((res) => {
                    this.setState({ loading: false })
                    console.debug("User Data from Login", res && res.data)
                    if (res.status === 200) {
                        const userData = res && res.data;
                        console.debug("User Data from Login", userData)
                        console.debug("isActive: ", userData.isactive);
                        if (userData.isactive == '0') { // if isactive is '0' then Active User else call service to activate user
                            AsyncStorage.setItem("userData", JSON.stringify(userData));
                            this.props.navigation.navigate('TabBar', { routeName: 'Home' });
                        } else {
                            this.UpdateAccountStatus(userData);
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

    UpdateAccountStatus = (userData) => {
        const url = AppConfig.DOMAIN + AppConfig.UPDATE_USER_ACCOUNT_STATUS
        console.debug('URL:', url);
        this.setState({ loading: true });
        fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': userData.token,
            },
            body: JSON.stringify({
                statusType: 'activate',
            })
        }).then((res) => res.json())
            .then(resJson => {
                console.debug('Activate profile response', resJson);
                this.setState({
                    loading: false,
                })
                console.debug("Activate profile:", resJson.data)
                if (resJson.status === 200 && resJson.message.toLowerCase() === 'account status updated successfully.') {
                    AsyncStorage.setItem("userData", JSON.stringify(userData));
                    this.props.navigation.navigate('TabBar', { routeName: 'Home' });
                } else {
                    this.refs.toast.show(resJson.message);
                }
            }).catch((err) => {
                console.debug('Activate Profile response ERROR:', err);
                this.setState({ error: err, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    goToRegister = () => {
        this.props.navigation.navigate('register');
    }

    goToForgotPassword = () => {
        this.props.navigation.navigate('forgotpassword');
    }

    componentDidMount() {
        this.setState({
            userName: "",
            userPwd: "",
        })
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // do something
            this.setState({
                userName: "",
                userPwd: "",
            })
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.netinfoSubscribe = NetInfo.addEventListener(state => {
            if (state.isInternetReachable) {
                this.setState({ is_connected: true });
            } else {
                this.setState({ is_connected: false });
            }
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.netinfoSubscribe();
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
        return (
            <SafeAreaView style={AppStyle.appContainer}>
                <StatusBar barStyle={'dark-content'} />
                <Logo></Logo>
                {/* <Home/> */}
                <TextInput style={AppStyle.appInput} placeholder="Username" value={this.state.userName}
                    onChangeText={userName => this.setState({ userName })}></TextInput>
                <TextInput style={AppStyle.appInput} placeholder="Password" value={this.state.userPwd} secureTextEntry={true}
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