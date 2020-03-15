import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AppStyle } from '../../App.style';
import { RegisterUser } from './Register.service';
import Logo from '../Logo';
import Toast from 'react-native-easy-toast';
import Geolocation from 'react-native-geolocation-service';

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
            showStepThree: false
        }
    }
    dismissKeyboard() {
        Keyboard.dismiss();
    }
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
        this.setState({ showLoader: true });
        this.dismissKeyboard();
        var username = this.state.username;

        if (!username) {
            this.refs.toast.show("Username is required");
            return;
        }

        Geolocation.getCurrentPosition((position) => {
            this.callRegisterApi(position);
        }, (error) => {
            console.log(error.code, error.message);
            this.callRegisterApi();
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
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

        RegisterUser(registrationData).then((res) => {
            if (res.status === 200) {
                const userData = res && res.data;

                AsyncStorage.setItem("userData", JSON.stringify(userData));
                this.props.navigation.navigate('TabBar', { userData: res.data });
            } if (res.message === "User already existed, please login.") {
                this.refs.toast.show("Username already existed. Please choose another.");
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
            <SafeAreaView style={AppStyle.appContainer}>
                <Logo></Logo>
                {
                    this.state.showStepOne ?
                        <View>
                            <TextInput style={AppStyle.appInput} placeholder="Firstname"
                                onChangeText={(firstname) => this.setState({ firstname })}></TextInput>
                            <TextInput style={AppStyle.appInput} placeholder="Lastname"
                                onChangeText={(lastname) => this.setState({ lastname })}></TextInput>
                            <TextInput style={AppStyle.appInput} placeholder="Email"
                                onChangeText={(email) => this.setState({ email })}></TextInput>
                            <TouchableOpacity onPress={() => this.registerStepOne()}>
                                <Text style={AppStyle.appButton}>Next</Text>
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
                    this.state.showStepTwo ?
                        <View>
                            <TextInput style={AppStyle.appInput} placeholder="Password" secureTextEntry={true}
                                onChangeText={(password) => this.setState({ password })}></TextInput>
                            <TextInput style={AppStyle.appInput} placeholder="Confirm password" secureTextEntry={true}
                                onChangeText={(confirmpassword) => this.setState({ confirmpassword })}></TextInput>
                            <TouchableOpacity onPress={() => this.registerStepTwo()}>
                                <Text style={AppStyle.appButton}>Next</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                {
                    this.state.showStepThree ?
                        <View style = {{flex:1}}>
                            <Text>Create Unique Username</Text>
                            <TextInput style={AppStyle.appInput} placeholder="Username"
                                onChangeText={(username) => this.setState({ username })}></TextInput>
                            <TouchableOpacity onPress={() => this.registerStepThree()}>
                                <Text style={AppStyle.appButton}>Enter Humming</Text>
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
                    <Text>Already had an account?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('login')}>
                        <Text>&nbsp;&nbsp;SignIn</Text>
                    </TouchableOpacity>
                </View>
                <Toast ref="toast"
                    style={{ backgroundColor: 'grey', borderRadius: 20 }} />
            </SafeAreaView>
        )
    }
}