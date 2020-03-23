import * as React from 'react';
import { Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AppStyle } from '../../App.style';
import { ProfileStyles } from './Profile.style';
import ImagePicker from 'react-native-image-picker';
import AppConfig from '../../config/constants';
import Toast from 'react-native-easy-toast'

const options = {
    title: 'Select Option',
    customButtons: [],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
};

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showMenuOptions: false,
            userData: {},
            error: null,
            userPostsAry: [],
            username: '',
            userdp: '',
            firstname: '',
            lastname: '',
            userprofession: '',
            followers: '',
            following: '',
            userbio: '',
            usermobile: '',
            useremail: '',
            useraddress: '',
        };
    }

    async componentDidMount() {
        await AsyncStorage.getItem("userData").then(value => {
            const userData = JSON.parse(value);
            this.setState({
                userData: userData,
                userdp: userData.userdp,
                username: userData.username,
                firstname: userData.firstname,
                lastname: userData.lastname,
                userprofession: userData.userprofession,
                followers: userData.followers,
                following: userData.following,
                userbio: userData.userbio,
                usermobile: userData.usermobile,
                useremail: userData.useremail,
                useraddress: userData.useraddress,
            });
        });
        this.makeRequesttoFetchUserMarkers();
    }

    makeRequesttoFetchUserMarkers = () => {
        const { userData } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS_BY_USER
        console.debug(url);
        this.setState({ loading: true });
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': userData.token
            },
            body: JSON.stringify({
                userid: userData.userid,
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Profile Page response:', responseData)
                if (responseData.status === 200) {
                    if (Array.isArray(responseData.data)) {
                        this.setState({
                            userPostsAry: responseData.data,
                            error: responseData.error || null,
                            loading: false
                        });
                    } else {
                        this.setState({
                            userPostsAry: [],
                            error: responseData.error || null,
                            loading: false
                        });
                    }
                } else {
                    this.refs.toast.show(responseData.message);
                }
            })
            .catch(error => {
                console.debug('Profile Page response ERROR:', error);
                this.setState({ error: error, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };


    render() {
        const { userPostsAry,
            loading,
            username,
            userdp,
            firstname,
            lastname,
            userprofession,
            followers,
            following,
            userbio,
            usermobile,
            useremail,
            useraddress
        } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={ProfileStyles.headerstyle}>
                    <Text style={{ fontSize: 18, marginLeft: 15 }}>@{username}</Text>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginRight: 15,
                    }}>
                        <TouchableOpacity onPress={() => this.showMenu()}>
                            <Image source={require('../../images/profile_menu.png')} style={{ width: 8, height: 30, marginLeft: 25 }} resizeMode={'contain'} />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.showMenuOptions ?
                        <View style={ProfileStyles.MenuOptionStyle}>
                            <TouchableOpacity onPress={() => this.showUpdateProfile()}>
                                <Text style={{ padding: 8 }}>Update Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.signOutfromApp()}>
                                <Text style={{ padding: 8 }}>Sign out</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.DeactivateProfile()}>
                                <Text style={{ padding: 8 }}>Deactivate Account</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                <ScrollView style={{ backgroundColor: 'white' }}>
                    <View style={[ProfileStyles.userDp, { alignSelf: 'center', borderColor: '#F5F5F5', borderWidth: 0.5, marginTop: 10 }]}>
                        <TouchableOpacity onPress={() => this.uploadImage()}>
                            <Image style={ProfileStyles.userDp} source={(userdp == null) || (userdp == '') ? require('../../images/logo.png') : { uri: userdp }} resizeMode={userdp == null ? 'contain' : 'cover'} />
                            <Text style={{ position: "absolute", bottom: 0, right: 0, margin: 15, }}>EDIT</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, alignItems: "center", marginTop: 20, }}>
                        <Text style={{ fontSize: 18, textTransform: 'capitalize' }}>{firstname + ' ' + lastname}</Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter, { marginBottom: 20 }]}>
                        <Text>
                            {(userprofession == null) || (userprofession == '') ? <Text>Profession : Not Available</Text> : <Text>{userprofession}</Text>}
                        </Text>
                    </View>
                    <View style={[{ flex: 1, alignItems: "center", }, ProfileStyles.followContent]}>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={[AppStyle.appLabel]}>FOLLOWERS</Text>
                            <Text>{followers || 0}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={[AppStyle.appLabel]}>FOLLOWING</Text>
                            <Text>{following || 0}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: "center", }}>
                        <Text style={{ textAlign: 'center', marginLeft: 15, marginRight: 15, marginTop: 20 }}>
                            {(userbio == null) || (userbio == '') ? <Text>Bio : Not Available</Text> : <Text>{userbio}</Text>}
                        </Text>
                    </View>
                    {
                        userPostsAry.length === 0 ? null
                            :
                            <View style={[{
                                flexDirection: 'column',
                                marginTop: 20,
                            }]}>
                                <Text style={{ paddingLeft: 15, paddingBottom: 10 }}>Previous Posts</Text>
                                <FlatList
                                    horizontal
                                    pagingEnabled={true}
                                    data={userPostsAry}
                                    renderItem={({ item }) => {
                                        // console.debug(item.media);
                                        let imageUri = item.media != null ? item.media[0] : null
                                        // console.debug('iMAGE uRL', imageUri);
                                        if (imageUri != '') {
                                            return (
                                                <TouchableOpacity onPress={this.OpenPost}>
                                                    <View style={{ flex: 1, borderColor: '#F5F5F5', borderWidth: 0.5, borderRadius: 8, marginLeft: 15, width: 130, height: 130, marginRight: 15 }}>
                                                        < Image source={imageUri == null ? require('../../images/logo.png') : { uri: imageUri }} resizeMode={imageUri == null ? 'contain' : 'cover'} style={{ width: 130, height: 130, borderRadius: 8 }} />
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        } else {
                                            return (
                                                null
                                            )
                                        }
                                    }}
                                    keyExtractor={(item, index) => index + ""}
                                />
                            </View>
                    }
                    <View style={[AppStyle.appAlignItemsCenter, { marginTop: 20 }]}>
                        <Text style={{ fontSize: 16, color: "#9B9B9B" }}>PHONE NUMBER</Text>
                        <Text>
                            {(usermobile == null) || (usermobile == '') ? <Text>Not Available</Text> : <Text>{usermobile}</Text>}
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter, { paddingTop: 20, paddingBottom: 20 }]}>
                        <Text style={{ fontSize: 16, color: "#9B9B9B" }}>EMAIL</Text>
                        <Text>
                            {(useremail == null) || (useremail == '') ? <Text>Not Available</Text> : <Text>{useremail}</Text>}
                        </Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter, { paddingBottom: 20 }]}>
                        <Text style={{ fontSize: 16, color: "#9B9B9B" }}>ADDRESS</Text>
                        <Text>
                            {(useraddress == null) || (useraddress == '') ? <Text>Not Available</Text> : <Text>{useraddress}</Text>}
                        </Text>
                    </View>
                </ScrollView>
                {
                    loading ?
                        <ActivityIndicator
                            animating={true}
                            style={AppStyle.activityIndicator}
                            size='large'
                        /> : null
                }
                <Toast ref="toast" />
            </SafeAreaView >
        )
    }

    showMenu = () => {
        this.setState({
            showMenuOptions: !this.state.showMenuOptions
        })
    }

    showUpdateProfile = () => {
        console.debug('showUpdateProfile');
    }

    signOutfromApp = () => {
        console.debug('signOutfromApp');
        this.props.navigation.navigate('login')
    }

    DeactivateProfile = () => {
        console.debug('DeactivateProfile');
        this.props.navigation.navigate('login')
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
                // const source = response.uri;
                const { userData } = this.state;
                const data = new FormData();
                data.append('userdp', {
                    uri: response.uri,
                    type: response.type,
                    name: response.fileName
                });
                data.append('firstname', userData.firstname);
                this.UpdateProfile(data, userData);
            }
        });
    }

    UpdateProfile = (data, userData) => {
        const url = AppConfig.DOMAIN + AppConfig.UPDATE_USER_PROFILE
        this.setState({ loading: true });
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'token': userData.token,
            },
            body: data,
        }).then((res) => res.json())
            .then(resJson => {
                console.debug('Update profile response', resJson);
                if (resJson.status === 200) {
                    this.setState({
                        error: resJson.error || null,
                        loading: false,
                        username: resJson.data.username,
                        userdp: resJson.data.userdp,
                        firstname: resJson.data.firstname,
                        lastname: resJson.data.lastname,
                        userprofession: resJson.data.userprofession,
                        followers: resJson.data.followers,
                        following: resJson.data.following,
                        userbio: resJson.data.userbio,
                        usermobile: resJson.data.usermobile,
                        useremail: resJson.data.useremail,
                        useraddress: resJson.data.useraddress
                    });
                    this.refs.toast.show("Profile updated successfully");
                } else {
                    this.refs.toast.show(resJson.message);
                }
            }).catch((err) => {
                console.debug('Update Profile response ERROR:', err);
                this.setState({ error: err, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };
    // renderLogo() {
    //     return (
    //         <View style={{ flex: 1, alignItems: "center", margin: 15, position: "relative" }}>
    //             <TouchableOpacity onPress={() => this.uploadImage()} >
    //                 <Image style={ProfileStyles.userDp} source={this.state.userdp == null ? require('../../images/logo.png') : { uri: this.state.userdp }} />
    //             </TouchableOpacity>
    //         </View>
    //     )
    // }
}