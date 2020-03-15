import * as React from 'react';
import { Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AppStyle } from '../../App.style';
import { UpdateUserDp } from './Profile.service';
import { ProfileStyles } from './Profile.style';
import ImagePicker from 'react-native-image-picker';
import AppConfig from '../../config/constants';

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
};
export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            userid: '',
            useremail: '',
            username: '',
            usermobile: '',
            userprofession: '',
            userbio: '',
            userdp: '',
            following: 0,
            followers: 0,
            isactive: '',
            useraddress: '',
            token: ''
        };

        AsyncStorage.getItem("userData").then(value => {
            const userData = JSON.parse(value);

            this.setState({
                firstname: userData.firstname,
                lastname: userData.lastname,
                userid: userData.userid,
                useremail: userData.useremail,
                username: userData.username,
                usermobile: userData.usermobile,
                userprofession: userData.userprofession,
                userbio: userData.userbio,
                userdp: userData.userdp,
                following: userData.following || 0,
                followers: userData.followers || 0,
                isactive: userData.isactive,
                useraddress: userData.useraddress,
                token: userData.token
            });
        });
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={ProfileStyles.headerstyle}>
                <Text style={{ marginLeft: 15 }}>@{this.state.username}</Text>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginRight: 15,
                    }}>
                        <Text>Menu</Text>
                    </View>
                </View>
                <ScrollView style={{ marginHorizontal: 10 }}>
                    {/* {this.renderLogo()} */}
                    <View style={{ flex: 1, alignItems: "center", margin: 15, position: "relative" }}>
                        <TouchableOpacity onPress={() => this.uploadImage()} >
                            <Image style={ProfileStyles.userDp} source={this.state.userdp == null ? require('../../images/logo.png') : { uri: this.state.userdp }} />
                        </TouchableOpacity>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={{
                            fontSize: 18
                        }}>{this.state.firstname + ' ' + this.state.lastname}</Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={[AppStyle.appLabel]}>Works at:</Text>
                        <Text>
                            {(this.state.userprofession == null) || (this.state.userprofession == '') ? <Text>not available</Text> : <Text>{this.state.userprofession}</Text>}
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={[AppStyle.appLabel]}>Bio:</Text>
                        <Text style={[ProfileStyles.userBio]}>
                            {(this.state.userbio == null) || (this.state.userbio == '') ? <Text>not available</Text> : <Text>{this.state.userbio}</Text>}
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter, ProfileStyles.followContent]}>
                        <Text>
                            <Text style={[AppStyle.appLabel]}>Followers:</Text>
                            <Text>{this.state.followers}</Text>
                        </Text>
                        <Text>
                            <Text style={[AppStyle.appLabel]}>Following:</Text>
                            <Text>{this.state.following}</Text>
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={[AppStyle.appLabel]}>Mobile:</Text>
                        <Text>
                            {(this.state.usermobile == null) || (this.state.usermobile == '') ? <Text>not available</Text> : <Text>{this.state.usermobile}</Text>}
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={[AppStyle.appLabel]}>Email:</Text>
                        <Text>
                            {(this.state.useremail == null) || (this.state.useremail == '') ? <Text>not available</Text> : <Text>{this.state.useremail}</Text>}
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={[AppStyle.appLabel]}>Address:</Text>
                        <Text>
                            {(this.state.useraddress == null) || (this.state.useraddress == '') ? <Text>not available</Text> : <Text>{this.state.useraddress}</Text>}
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView >
        )
    }

    uploadImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = response.uri;

                this.setState({
                    userdp: source
                });

                const data = new FormData();
                data.append('userdp', {
                    uri: response.uri,
                    type: response.type,
                    name: response.fileName
                });
                data.append('firstname', 'karsudha');

                fetch(AppConfig.DOMAIN + '/api/v1/awsupdate', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                        'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNjgiLCJpYXQiOjE1ODM4MjY5MDMsImV4cCI6MTU4NDQzMTcwM30.pOS3aMhTAqcveMmMVb4i1FdiwN4lnltcmmZSTlFJWOQ'
                    },
                    body: data
                }).then((res) => res.json())
                    .then(resJson => {
                        console.log(resJson);
                    }).catch((err) => {
                        console.log(err)
                    });
            }
        });
    }

    renderLogo() {
        return (
            <View style={{ flex: 1, alignItems: "center", margin: 15, position: "relative" }}>
                <TouchableOpacity onPress={() => this.uploadImage()} >
                    <Image style={ProfileStyles.userDp} source={this.state.userdp == null ? require('../../images/logo.png') : { uri: this.state.userdp }} />
                </TouchableOpacity>
            </View>
        )
    }
}