import React, { Component } from 'react';
import { Text, View, TextInput, Image, TouchableOpacity, ActivityIndicator, Keyboard, SafeAreaView, BackHandler } from 'react-native';
import { AppStyle } from '../../App.style';
import AppConfig from '../../config/constants'
import { ButtonGradientColor1, ButtonGradientColor2 } from '../../config/constants';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-easy-toast';
import NetInfo from "@react-native-community/netinfo";

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
            showStepThree: false,
            is_connected: false,
            isEmailInputEnabled: true,
            forgotPasswordText: 'Enter your email to confirm'
        }
    }
    dismissKeyboard() {
        Keyboard.dismiss();
    }

    componentDidMount() {
        // this.setState({isEmailInputEnabled: true})
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
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.netinfoSubscribe();
    }

    handleBackButton = () => {
        const { showStepOne, showStepTwo, showStepThree } = this.state
        if (showStepOne === true && showStepTwo === true) {
            this.setState({ showStepOne: true, isEmailInputEnabled: true, forgotPasswordText: 'Enter your email to confirm', showStepTwo: false, showStepThree: false });
            console.debug('IF');
        } else if (showStepOne === false && showStepTwo === false && showStepThree === true) {
            this.setState({ showStepOne: true, isEmailInputEnabled: false, forgotPasswordText: 'Enter OTP to confirm your identity', showStepTwo: true, showStepThree: false });
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
        const { email, is_connected } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.FORGOT_PASSWORD_GET_OTP
        console.debug(url);
        this.setState({ showLoader: true });
        if (!is_connected) {
            this.setState({
                showLoader: false,
            });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
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
                            isEmailInputEnabled: false,
                            forgotPasswordText: 'Enter OTP to confirm your identity',
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
        const { email, otp, is_connected } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.FORGOT_PASSWORD_VERIFY_OTP
        console.debug(url);
        this.setState({ showLoader: true });
        if (!is_connected) {
            this.setState({
                showLoader: false,
            });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
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
                    const data = responseData.data
                    if (data.validuser === true) {
                        this.setState({
                            showStepOne: false,
                            showStepTwo: false,
                            showStepThree: true,
                            newPassword: '',
                            newConfirmPassword: '',
                            error: responseData.error || null
                        });
                    }
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
        const { email, newPassword, is_connected } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.FORGOT_PASSWORD_UPDATE_PASSWORD
        console.debug(url);
        this.setState({ showLoader: true });
        if (!is_connected) {
            this.setState({
                showLoader: false,
            });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
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
            <SafeAreaView style={AppStyle.login_appContainer}>
                <Image style={AppStyle.Loginlogo} source={require('../../images/logo.png')} />
                {
                    this.state.showStepOne ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 100 }}>
                            <Text style={[AppStyle.app_font_heading, AppStyle.dark_TextColor, { fontSize: 23, marginBottom: 5 }]}>Forgot password</Text>
                            <Text style={[AppStyle.app_font_heading, AppStyle.light_blue_TextColor, { fontSize: 15, marginBottom: 30 }]}>{this.state.forgotPasswordText}</Text>
                            <TextInput style={AppStyle.appInput} placeholder="Email" value={this.state.email}
                                onChangeText={(email) => this.setState({ email })} editable={this.state.isEmailInputEnabled} ></TextInput>
                            {
                                this.state.showStepTwo ?
                                    <TextInput style={AppStyle.appInput} placeholder="Enter OTP" value={this.state.otp} maxLength={4}
                                        keyboardType={'numeric'}
                                        onChangeText={(otp) => this.setState({ otp })}></TextInput>
                                    : null
                            }
                            <TouchableOpacity onPress={() => this.ForgotPasswordStepOne()}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={[ButtonGradientColor1, ButtonGradientColor2]}
                                    style={AppStyle.appButton_background}>
                                    <Text style={AppStyle.appButton_Text}>SUBMIT</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                {
                    this.state.showStepThree ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 100 }} >
                            <Text style={[AppStyle.app_font_heading, AppStyle.dark_TextColor, { fontSize: 23, marginBottom: 5 }]}>Reset password</Text>
                            <Text style={[AppStyle.app_font_heading, AppStyle.light_blue_TextColor, { fontSize: 15, marginBottom: 30 }]}>Create your new password</Text>
                            <TextInput style={AppStyle.appInput} placeholder="New Password" value={this.state.newPassword} secureTextEntry={true}
                                onChangeText={(newPassword) => this.setState({ newPassword })}></TextInput>
                            <TextInput style={AppStyle.appInput} placeholder="Re-enter New Password" value={this.state.newConfirmPassword} secureTextEntry={true}
                                onChangeText={(newConfirmPassword) => this.setState({ newConfirmPassword })}></TextInput>
                            <TouchableOpacity onPress={() => this.ForgotPasswordStepThree()}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={[ButtonGradientColor1, ButtonGradientColor2]}
                                    style={AppStyle.appButton_background}>
                                    <Text style={AppStyle.appButton_Text}>SUBMIT</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginBottom: 50,
                }}>
                    <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 14 }]}>Remember Password?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('login')}>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>&nbsp;Sign in</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.showLoader ?
                        <ActivityIndicator
                            animating={true}
                            style={AppStyle.activityIndicator}
                            size='large'
                        /> : null
                }
                <Toast ref="toast"
                    style={AppStyle.toast_style} />
            </SafeAreaView >
        )
    }
}