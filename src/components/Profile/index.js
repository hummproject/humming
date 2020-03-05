import * as React from 'react';
import { Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { AppStyle } from '../../App.style';
import { ProfileStyles } from './Profile.style';
import { Logo } from '../Logo';
import { RNCamera } from 'react-native-camera';


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const userData = {
            "userid": "268",
            "firstname": "sudhakar",
            "lastname": "chandana",
            "useremail": "sudhaece470@gmail.com",
            "username": "kukkasudha",
            "usermobile": null,
            "userprofession": null,
            "userbio": null,
            "userdp": null,
            "following": null,
            "followers": null,
            "isactive": 1,
            "useraddress": null,
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNjgiLCJpYXQiOjE1ODMzNzI4MzMsImV4cCI6MTU4Mzk3NzYzM30.SkJSJnTwEXvpadmcYBi06DMAzfjJZEQgNF6T5zxdUYA"
        };
        const firstname = userData.firstname;
        const lastname = userData.lastname;
        const userid = userData.userid;
        const useremail = userData.useremail;
        const username = userData.username;
        const usermobile = userData.usermobile;
        const userprofession = userData.userprofession;
        const userbio = "I am from bakkupeta and works as Software Engineer at NCR Hyderabad";
        const userdp = userData.userdp || "https://medium-test1.s3.amazonaws.com/1574722200000";
        const following = userData.following || 0;
        const followers = userData.followers || 0;
        const isactive = userData.isactive;
        const useraddress = userData.useraddress;
        const token = userData.token;

        return (
            <SafeAreaView style={{ flex: 1, marginVertical: 20 }}>
                <ScrollView style={{ marginHorizontal: 10 }}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                        <Text>@{username}</Text>
                        <Text>Menu</Text>
                    </View>
                    {/* <RNCamera style={{position: "absolute", top: 0, right: 0, bottom: 0, left: 0}}></RNCamera> */}
                    {this.renderLogo(userdp)}
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={{
                            fontSize: 18
                        }}>{firstname + ' ' + lastname}</Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={[AppStyle.appLabel]}>Works at:</Text>
                        <Text>
                            {(userprofession == null) || (userprofession == '') ? <Text>not available</Text> : <Text>{userprofession}</Text>}
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={[AppStyle.appLabel]}>Bio:</Text>
                        <Text style={[ProfileStyles.userBio]}>
                            {(userbio == null) || (userbio == '') ? <Text>not available</Text> : <Text>{userbio}</Text>}
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter, ProfileStyles.followContent]}>
                        <Text>
                            <Text style={[AppStyle.appLabel]}>Followers:</Text>
                            <Text>{followers}</Text>
                        </Text>
                        <Text>
                            <Text style={[AppStyle.appLabel]}>Following:</Text>
                            <Text>{following}</Text>
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={[AppStyle.appLabel]}>Mobile:</Text>
                        <Text>
                            {(usermobile == null) || (usermobile == '') ? <Text>not available</Text> : <Text>{usermobile}</Text>}
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={[AppStyle.appLabel]}>Email:</Text>
                        <Text>
                            {(useremail == null) || (useremail == '') ? <Text>not available</Text> : <Text>{useremail}</Text>}
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter]}>
                        <Text style={[AppStyle.appLabel]}>Address:</Text>
                        <Text>
                            {(useraddress == null) || (useraddress == '') ? <Text>not available</Text> : <Text>{useraddress}</Text>}
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView >
        )
    }

    renderLogo(userdp) {
        if (userdp) {
            return (
                <View style={{ flex: 1, alignItems: "center", margin: 15, position: "relative" }}>
                    <Image source={{ uri: userdp }}
                        style={{ width: 100, height: 100, borderRadius: 100 }} />
                    <TouchableOpacity style={{
                        position: "absolute",
                        bottom: 0,
                        backgroundColor: "yellow",
                        color: "red",
                        padding: 5,
                        fontWeight: "bold"
                    }}>
                        <Text>Edit</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, alignItems: "center", margin: 15, position: "relative" }}>
                    <Image style={{
                        width: 120,
                        height: 120,
                        resizeMode: 'contain',
                    }} source={require('../../images/logo.png')} />
                    <TouchableOpacity style={{
                        position: "absolute",
                        bottom: 0,
                        backgroundColor: "yellow",
                        color: "red",
                        padding: 5,
                        fontWeight: "bold"
                    }}>
                        <Text>Upload</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}