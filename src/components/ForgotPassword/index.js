import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, SafeAreaView, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AppStyle } from '../../App.style';
import AppConfig from '../../config/constants';
import Logo from '../Logo';
import Toast from 'react-native-easy-toast';
// import Geolocation from 'react-native-geolocation-service';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            newPassword: "",
            newConfirmPassword: "",
            otp: "",
            error: null,
            showLoader: false,
            showStepOne: true,
            showStepTwo: false,
            showStepThree: false
        }
    }
    dismissKeyboard() {
        Keyboard.dismiss();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        const { showStepOne, showStepTwo, showStepThree } = this.state
        if (showStepOne === true && showStepTwo === true) {
            this.setState({ showStepOne: true, showStepTwo: false, showStepThree: false });
            console.debug('IF');
        } else if (showStepOne === false && showStepTwo === false && showStepThree === true) {
            this.setState({ showStepOne: true, showStepTwo: true, showStepThree: false });
            console.debug('ELSE IF');
        } else {
            console.debug('ELSE');
            this.props.navigation.goBack();
        }
        return true;
    };

    validateEmail = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            console.log("Email is not correct");
            return false;
        }
        else {
            console.log("Email is correct");
            return true;
        }
    }

    ForgotPasswordStepOne() {
        this.dismissKeyboard();
        const { email, showStepOne, showStepTwo, otp } = this.state
        if (email === '') {
            this.refs.toast.show("Email is required");
            return;
        }
        if (this.validateEmail(email) === false) {
            this.refs.toast.show("Email is not valid");
            return;
        }
        if (showStepOne === true && showStepTwo === false) {
            this.makeRequesttoGetOTP();
        } else {
            if (otp == '') {
                this.refs.toast.show("OTP is required");
                return;
            }
            this.makeRequesttoVerifyOTP();
        }
    }

    ForgotPasswordStepThree() {
        this.dismissKeyboard();
        const { newPassword, newConfirmPassword } = this.state

        if (newPassword === '') {
            this.refs.toast.show("Password is required");
            return;
        }

        if (newConfirmPassword === '') {
            this.refs.toast.show("Re-enter Password is required");
            return;
        }

        if (newPassword !== newConfirmPassword) {
            this.refs.toast.show("Password and confirm-password should be same");
            return;
        }

        this.makeRequesttoUpdatePassword();
    }

    makeRequesttoGetOTP = () => {
        const { email } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.FORGOT_PASSWORD_GET_OTP
        console.debug(url);
        this.setState({ showLoader: true });
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                useremail: email,
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Get OTP response:', responseData)
                this.setState({
                    showLoader: false,
                })
                if (responseData.status === 200) {
                    const data = responseData.data
                    if (data.validuser === true) {
                        this.setState({
                            showStepOne: true,
                            showStepTwo: true,
                            otp: '',
                            error: responseData.error || null
                        });
                    } else {
                        this.refs.toast.show("This email is not registered with us");
                    }
                } else {
                    const error = responseData.error
                    if (error.validuser === false) {
                        this.refs.toast.show("This email is not registered with us");
                    } else {
                        this.refs.toast.show(responseData.message);
                    }
                }
            })
            .catch(error => {
                console.debug('Get OTP response error:', error);
                this.setState({ error, showLoader: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    makeRequesttoVerifyOTP = () => {
        const { email, otp } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.FORGOT_PASSWORD_VERIFY_OTP
        console.debug(url);
        this.setState({ showLoader: true });
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                useremail: email,
                verifycode: otp
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Verify OTP response:', responseData)
                this.setState({
                    showLoader: false,
                })
                if (responseData.status === 200) {
                    this.setState({
                        showStepOne: false,
                        showStepTwo: false,
                        showStepThree: true,
                        newPassword: '',
                        newConfirmPassword: '',
                        error: responseData.error || null
                    });
                } else {
                    const error = responseData.error
                    if (error.validuser === false) {
                        this.refs.toast.show("OTP entered is not valid");
                    } else {
                        this.refs.toast.show(responseData.message);
                    }
                }
            })
            .catch(error => {
                console.debug('Verify OTP response error:', error);
                this.setState({ error, showLoader: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    makeRequesttoUpdatePassword = () => {
        const { email, newPassword } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.FORGOT_PASSWORD_UPDATE_PASSWORD
        console.debug(url);
        this.setState({ showLoader: true });
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                useremail: email,
                userpassword: newPassword
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Update Password response:', responseData)
                // AsyncStorage.setItem("PostsData", JSON.stringify(responseData.data));
                this.setState({
                    showLoader: false,
                })
                if (responseData.status === 200) {
                    // this.setState({
                    //     showStepOne: true,
                    //     showStepTwo: true,
                    //     otp: '',
                    //     error: responseData.error || null
                    // });
                    this.refs.toast.show("Password updated successfully, login to continue");
                    this.props.navigation.goBack();
                } else {
                    this.refs.toast.show(responseData.message);
                }
            })
            .catch(error => {
                console.debug('Update Password response error:', error);
                this.setState({ error, showLoader: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    render() {
        return (
            <SafeAreaView style={AppStyle.appContainer}>
                <Logo></Logo>
                <Text>Forgot Password</Text>
                {
                    this.state.showStepOne ?
                        <View style={{ alignItems: 'center' }}>
                            <TextInput style={AppStyle.appInput} placeholder="Email" value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}></TextInput>
                            {
                                this.state.showStepTwo ?
                                    <TextInput style={AppStyle.appInput} placeholder="OTP" value={this.state.otp}
                                        onChangeText={(otp) => this.setState({ otp })}></TextInput>
                                    : null
                            }
                            <TouchableOpacity onPress={() => this.ForgotPasswordStepOne()}>
                                <Text style={AppStyle.appButton}>SUBMIT</Text>
                            </TouchableOpacity>
                            {
                                this.state.showLoader ?
                                    <ActivityIndicator
                                        animating={true}
                                        style={AppStyle.activityIndicator}
                                        size='large'
                                    /> : null
                            }
                        </View>
                        : null
                }
                {
                    this.state.showStepThree ?
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <TextInput style={AppStyle.appInput} placeholder="New Password" value={this.state.newPassword}
                                onChangeText={(newPassword) => this.setState({ newPassword })}></TextInput>
                            <TextInput style={AppStyle.appInput} placeholder="Re-enter New Password" value={this.state.newConfirmPassword}
                                onChangeText={(newConfirmPassword) => this.setState({ newConfirmPassword })}></TextInput>
                            <TouchableOpacity onPress={() => this.ForgotPasswordStepThree()}>
                                <Text style={AppStyle.appButton}>SUBMIT</Text>
                            </TouchableOpacity>
                            {
                                this.state.showLoader ?
                                    <ActivityIndicator
                                        animating={true}
                                        style={AppStyle.activityIndicator}
                                        size='large'
                                    /> : null
                            }
                        </View>
                        : null
                }
                <View style={AppStyle.appFooter}>
                    <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 15 }]}>Remember Password?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('login')}>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 15 }]}>&nbsp;&nbsp;Sign in</Text>
                    </TouchableOpacity>
                </View>
                <Toast ref="toast"
                    style={AppStyle.toast_style} />
            </SafeAreaView>
        )
    }
}