import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, SafeAreaView, BackHandler, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AppStyle } from '../../App.style';
import { RegisterUser } from './Register.service';
import { ButtonGradientColor1, ButtonGradientColor2 } from '../../config/constants';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-easy-toast';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from "@react-native-community/netinfo";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmpassword: "",
            username: "",
            showLoader: false,
            showStepOne: true,
            showStepTwo: false,
            showStepThree: false,
            is_connected: false,
        }
    }

    dismissKeyboard() {
        Keyboard.dismiss();
    }

    componentDidMount() {
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

    validateEmail = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            return false;
        }
        else {
            return true;
        }
    }

    handleBackButton = () => {
        const { showStepOne, showStepTwo, showStepThree } = this.state
        if (showStepOne === false && showStepTwo === true) {
            this.setState({
                showStepOne: true,
                showStepTwo: false,
                showStepThree: false,
                password: '',
                confirmpassword: '',
            });
            console.debug('IF');
        } else if (showStepOne === false && showStepTwo === false && showStepThree === true) {
            this.setState({
                showStepOne: false,
                showStepTwo: true,
                showStepThree: false,
                username: ''
            });
            console.debug('ELSE IF');
        } else {
            console.debug('ELSE');
            this.props.navigation.goBack();
        }
        return true;
    };

    registerStepOne() {
        this.dismissKeyboard();

        var firstname = this.state.firstname;
        var lastname = this.state.lastname;
        var email = this.state.email;

        if (firstname === '') {
            this.refs.toast.show("Firstname is required");
            return;
        }
        if (lastname === '') {
            this.refs.toast.show("Lastname is required");
            return;
        }
        if (email === '') {
            this.refs.toast.show("Email is required");
            return;
        }
        if (this.validateEmail(email) === false) {
            this.refs.toast.show("Email is not valid");
            return;
        }
        this.setState({ showStepOne: false, showStepTwo: true });
    }

    registerStepTwo() {
        this.dismissKeyboard();

        var password = this.state.password;
        var confirmpassword = this.state.confirmpassword;

        if (password === '') {
            this.refs.toast.show("Password is required");
            return;
        }
        if (confirmpassword === '') {
            this.refs.toast.show("Confirm password is required");
            return;
        }
        if (password !== confirmpassword) {
            this.refs.toast.show("Password and confirm-password should be same");
            return;
        }
        this.setState({ showStepOne: false, showStepTwo: false, showStepThree: true });
    }

    registerStepThree() {

        this.dismissKeyboard();
        var username = this.state.username;

        if (!username) {
            this.refs.toast.show("Username is required");
            return;
        }
        this.setState({ showLoader: true });
        if (Platform.OS === 'ios') {
            this.fetchLocation();
        } else {
            this.requestLocationPermission();
        }
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                'title': 'Location Access Required',
                'message': "This app requires access to your location to show you relevant posts based on location.",
                buttonPositive: "OK"
            }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //To Check, If Permission is granted
                this.fetchLocation();
            } else {
                console.log("Location Permission Denied");
                this.callRegisterApi();
            }
        } catch (err) {
            console.warn(err)
        }
    }

    fetchLocation() {
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                console.log("GeoLocation Position:", position);
                this.callRegisterApi(position)
            },
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    callRegisterApi(position) {
        var locationData = position;
        var registrationData = {
            firstName: this.state.firstname,
            lastName: this.state.lastname,
            email: this.state.email,
            pwd: this.state.password,
            userName: this.state.username
        };
        var latlang = "0.000,0.000";

        if (locationData && locationData.coords) {
            var coords = locationData.coords;
            latlang = coords.latitude + "," + coords.longitude;
        }

        registrationData.latlang = latlang;
        if (!this.state.is_connected) {
            this.setState({ showLoader: false });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
        RegisterUser(registrationData).then((res) => {
            console.log(res);
            if (res.status === 200) {
                const userData = res && res.data;
                AsyncStorage.setItem("userData", JSON.stringify(userData));
                this.props.navigation.navigate('TabBar', { userData: res.data });
            } if (res.message === "User already existed, please login.") {
                this.refs.toast.show("Username already exists. Please try another");
            } else {
                this.refs.toast.show("Something went wrong. Please try again later");
            }
            setTimeout(() => {
                this.setState({ showLoader: false });
            }, 1000);
        }).catch((err) => {
            this.refs.toast.show("Something went wrong. Please try again later");
            setTimeout(() => {
                this.setState({ showLoader: false });
            }, 1000);
        });
    }

    render() {
        return (
            <SafeAreaView style={AppStyle.login_appContainer}>
                <Image style={AppStyle.Loginlogo} source={require('../../images/logo.png')} />
                {
                    this.state.showStepOne ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
                            <Text style={[AppStyle.app_font_heading, AppStyle.dark_TextColor, { fontSize: 23, marginBottom: 5 }]}>Create an account</Text>
                            <Text style={[AppStyle.app_font_heading, AppStyle.light_blue_TextColor, { fontSize: 15, marginBottom: 30 }]}>Its simple and easy</Text>
                            <TextInput style={AppStyle.appInput} placeholder="First name" value={this.state.firstname}
                                onChangeText={(firstname) => this.setState({ firstname })}></TextInput>
                            <TextInput style={AppStyle.appInput} placeholder="Last name" value={this.state.lastname}
                                onChangeText={(lastname) => this.setState({ lastname })}></TextInput>
                            <TextInput style={AppStyle.appInput} placeholder="Email" value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}></TextInput>
                            <TouchableOpacity onPress={() => this.registerStepOne()}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={[ButtonGradientColor1, ButtonGradientColor2]}
                                    style={AppStyle.appButton_background}>
                                    <Text style={AppStyle.appButton_Text}>Next</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                {
                    this.state.showStepTwo ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 100 }}>
                            <Text style={[AppStyle.app_font_heading, AppStyle.dark_TextColor, { fontSize: 23, marginBottom: 5 }]}>Create an account</Text>
                            <Text style={[AppStyle.app_font_heading, AppStyle.light_blue_TextColor, { fontSize: 15, marginBottom: 30 }]}>Its simple and easy</Text>
                            <TextInput style={AppStyle.appInput} placeholder="Password" value={this.state.password} secureTextEntry={true}
                                onChangeText={(password) => this.setState({ password })}></TextInput>
                            <TextInput style={AppStyle.appInput} placeholder="Re-enter password" value={this.state.confirmpassword} secureTextEntry={true}
                                onChangeText={(confirmpassword) => this.setState({ confirmpassword })}></TextInput>
                            <TouchableOpacity onPress={() => this.registerStepTwo()}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={[ButtonGradientColor1, ButtonGradientColor2]}
                                    style={AppStyle.appButton_background}>
                                    <Text style={AppStyle.appButton_Text}>Next</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                {
                    this.state.showStepThree ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 170 }}>
                            <Text style={[AppStyle.app_font_heading, AppStyle.dark_TextColor, { fontSize: 23, marginBottom: 5 }]}>You're done</Text>
                            <Text style={[AppStyle.app_font_heading, AppStyle.light_blue_TextColor, { fontSize: 15, marginBottom: 30 }]}>Give a username to your profile</Text>
                            <TextInput style={AppStyle.appInput} placeholder="Give Username"
                                onChangeText={(username) => this.setState({ username })}></TextInput>
                            <TouchableOpacity onPress={() => this.registerStepThree()}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={[ButtonGradientColor1, ButtonGradientColor2]}
                                    style={AppStyle.appButton_background}>
                                    <Text style={AppStyle.appButton_Text}>Enter Humming</Text>
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
                    <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 14 }]}>Existing User?</Text>
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