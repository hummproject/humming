import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { AppStyle } from '../../App.style';
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
            showStepOne: true,
            showStepTwo: false,
            showStepThree: false
        }
    }
    registerStepOne() {
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
            this.refs.toast.show("Password must confirm password should be same");
            return;
        }

        this.setState({ showStepOne: false, showStepTwo: false, showStepThree: true });
    }
    registerStepThree() {
        var username = this.state.username;

        if (!username) {
            this.refs.toast.show("Username is required");
            return;
        }

        // TO DO: show ActivityIndicator & Check with Datebase that the existance of the USERNAME

        var registrationData = {
            firstName: this.state.firstname,
            lastName: this.state.lastname,
            email: this.state.email,
            pwd: this.state.password,
            userName: this.state.username
        };

        Geolocation.getCurrentPosition((position) => {
            // {"mocked":false,"timestamp":1583691650000,"coords":{"speed":0,"heading":0,"accuracy":20,"altitude":5,"longitude":-122.084,"latitude":37.4219983}}
            console.log(JSON.stringify(position));
            // latlang --> should be added to registrationData to Register API
        }, (error) => {
            console.log(error.code, error.message);
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });

        alert(JSON.stringify(registrationData));
    }
    render() {
        return (
            <View style={AppStyle.appContainer}>
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
                        </View>
                        : null
                }
                {
                    this.state.showStepTwo ?
                        <View>
                            <TextInput style={AppStyle.appInput} placeholder="Password"
                                onChangeText={(password) => this.setState({ password })}></TextInput>
                            <TextInput style={AppStyle.appInput} placeholder="Confirm password"
                                onChangeText={(confirmpassword) => this.setState({ confirmpassword })}></TextInput>
                            <TouchableOpacity onPress={() => this.registerStepTwo()}>
                                <Text style={AppStyle.appButton}>Next</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                {
                    this.state.showStepThree ?
                        <View>
                            <Text>Create Unique Username</Text>
                            <TextInput style={AppStyle.appInput} placeholder="Username"
                                onChangeText={(username) => this.setState({ username })}></TextInput>
                            <TouchableOpacity onPress={() => this.registerStepThree()}>
                                <Text style={AppStyle.appButton}>Enter Humming</Text>
                            </TouchableOpacity>
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
            </View>
        )
    }
}