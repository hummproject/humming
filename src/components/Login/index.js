import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { AppStyle } from '../../App.style';
import Logo from '../Logo';
import axios from 'react-native-axios';
import Home from '../Home';
import Toast, {DURATION} from 'react-native-easy-toast'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userPwd: "",
            isLoggedIn: ""
        };
    }
    login = () => {
        const userName = this.state.userName;
        const userPwd = this.state.userPwd;

        if(userName != "")
        {
            if(userPwd != "")
            {
            fetch('https://humming-psql.herokuapp.com/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: userName,
                userpassword: userPwd
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status != 200)
                {
                    this.refs.toast.show("username or password is incorrect");
                }
                else{
                this.props.navigation.navigate('TabBar', { userData: responseJson.data });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    else{
        this.refs.toast.show("Password cannot be empty",500);
    }
}
else{
    this.refs.toast.show("username cannot be empty",500);
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
                style={{backgroundColor:'grey',borderRadius: 20}}/>
            </View>
        )
    };
}