import * as React from 'react';
import { Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert, Modal, TouchableHighlight, Keyboard, Platform, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AppStyle } from '../../App.style';
import { ProfileStyles } from './Profile.style';
import ImagePicker from 'react-native-image-picker';
import AppConfig from '../../config/constants';
import Toast from 'react-native-easy-toast'
import { TextInput } from 'react-native-paper';
import ProgressiveImage from '../../ProgressiveImage'
import { NavigationActions } from '@react-navigation/native';

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
            showUploadModal: false,
            userData: {},
            error: null,
            showToast: false,
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
            professionInputText: '',
            phoneInputText: '',
            addressInputText: '',
            bioInputText: '',
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
                professionInputText: userData.userprofession === null ? '' : userData.userprofession,
                phoneInputText: userData.usermobile === null ? '' : userData.usermobile,
                addressInputText: userData.useraddress === null ? '' : userData.useraddress,
                bioInputText: userData.userbio === null ? '' : userData.userbio
            });
        });
        this.makeRequesttoFetchUserMarkers();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    };

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
                this.setState({ loading: false });
                if (responseData.status === 200) {
                    if (Array.isArray(responseData.data)) {
                        this.setState({
                            userPostsAry: responseData.data,
                            error: responseData.error || null,
                        });
                    } else {
                        this.setState({
                            userPostsAry: [],
                            error: responseData.error || null,
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
                    <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 20, marginLeft: 15 }]}>@{username}</Text>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginRight: 15,
                    }}>
                        <TouchableOpacity onPress={() => this.showMenu()}>
                            <Image source={require('../../images/profile_menu.png')} style={{ width: 8, height: 35, marginLeft: 25 }} resizeMode={'center'} />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.showMenuOptions ?
                        <View style={Platform.OS === 'ios' ? ProfileStyles.MenuOptionStyleIOS : ProfileStyles.MenuOptionStyle}>
                            <TouchableOpacity onPress={() => this.showUpdateProfile()}>
                                <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, padding: 8 }]}>Update Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.signOutfromApp()}>
                                <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, padding: 8 }]}>Sign out</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.DeactivateProfile()}>
                                <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, padding: 8 }]}>Deactivate Account</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                <ScrollView style={{ backgroundColor: 'white' }}>
                    <View style={[ProfileStyles.userDp, { alignSelf: 'center', borderColor: '#F5F5F5', borderWidth: 0.5, marginTop: 10 }]}>
                        <ProgressiveImage style={ProfileStyles.userDp} source={(userdp == null) || (userdp == '') ? require('../../images/logo.png') : { uri: userdp }} resizeMode={userdp == null ? 'contain' : 'cover'} />
                        <TouchableOpacity onPress={() => this.uploadImage()} style={{ position: "absolute", bottom: 0, right: 0, margin: 10 }}>
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>EDIT</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, alignItems: "center", marginTop: 20, }}>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 18, textTransform: 'capitalize' }]}>{firstname + ' ' + lastname}</Text>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter, { marginBottom: 20 }]}>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>
                            {(userprofession == null) || (userprofession == '') ? <Text>Profession : Not Available</Text> : <Text>{userprofession}</Text>}
                        </Text>
                    </View>
                    <View style={[{ flex: 1, alignItems: "center", }, ProfileStyles.followContent]}>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={[AppStyle.appLabel]}>FOLLOWERS</Text>
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>{followers || 0}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={[AppStyle.appLabel]}>FOLLOWING</Text>
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>{following || 0}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: "center", }}>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, textAlign: 'center', marginLeft: 15, marginRight: 15, marginTop: 20 }]}>
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
                                <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, paddingLeft: 15, paddingBottom: 10 }]}>Previous Posts</Text>
                                <FlatList
                                    horizontal
                                    contentContainerStyle={{ paddingEnd: 15 }}
                                    showsHorizontalScrollIndicator={false}
                                    data={userPostsAry}
                                    renderItem={({ item }) => {
                                        // console.debug(item.media);
                                        let imageUri = item.media != null ? item.media[0] : null
                                        // console.debug('iMAGE uRL', imageUri);
                                        if (imageUri != '') {
                                            return (
                                                <TouchableOpacity onPress={this.OpenPost}>
                                                    <View style={{ flex: 1, borderColor: '#F5F5F5', borderWidth: 0.5, borderRadius: 8, marginLeft: 15, width: 130, height: 130 }}>
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
                        <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 14 }]}>PHONE NUMBER</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../images/phone_filled.png')} resizeMode={'center'} />
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>
                                {(usermobile == null) || (usermobile == '') ? <Text>Not Available</Text> : <Text>+91 {usermobile}</Text>}
                            </Text>
                        </View>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter, { paddingTop: 20, paddingBottom: 20 }]}>
                        <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 14 }]}>EMAIL</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../images/email_filled.png')} resizeMode={'center'} />
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>
                                {(useremail == null) || (useremail == '') ? <Text>Not Available</Text> : <Text>{useremail}</Text>}
                            </Text>
                        </View>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter, { paddingBottom: 20 }]}>
                        <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 14 }]}>ADDRESS</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../images/location.png')} resizeMode={'center'} />
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>
                                {(useraddress == null) || (useraddress == '') ? <Text>Not Available</Text> : <Text>{useraddress}</Text>}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.showUploadModal}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                        this.setState({
                            showUploadModal: !this.state.showUploadModal,
                        })
                    }}
                >
                    <TouchableHighlight style={{ flex: 1, }} onPress={() => {
                        this.setState({
                            showUploadModal: !this.state.showUploadModal,
                        })
                        console.debug("pressed on TouchableFeedback")
                    }} >
                        <View />
                    </TouchableHighlight>
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}>
                        <View style={ProfileStyles.modalView}>
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 18 }]}>Update Profile</Text>
                            <View style={{ borderRadius: 10, width: '100%', height: 45, marginTop: 15, backgroundColor: '#F5F5F5', }}>
                                <TextInput
                                    style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, height: 45, backgroundColor: 'transparent' }]}
                                    placeholder="Profession"
                                    underlineColor='transparent'
                                    theme={{ colors: { primary: 'transparent' } }}
                                    value={this.state.professionInputText}
                                    onChangeText={(text) => this.setState({
                                        professionInputText: text
                                    })} />
                            </View>
                            <View style={{ borderRadius: 10, width: '100%', height: 45, marginTop: 15, backgroundColor: '#F5F5F5', }}>
                                <TextInput
                                    style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, height: 45, backgroundColor: 'transparent' }]}
                                    placeholder="Phone"
                                    underlineColor='transparent'
                                    theme={{ colors: { primary: 'transparent' } }}
                                    value={this.state.phoneInputText}
                                    onChangeText={(text) => this.setState({
                                        phoneInputText: text
                                    })} />
                            </View>
                            <View style={{ borderRadius: 10, width: '100%', height: 45, marginTop: 15, backgroundColor: '#F5F5F5', }}>
                                <TextInput
                                    style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, height: 45, backgroundColor: 'transparent' }]}
                                    placeholder="Address"
                                    underlineColor='transparent'
                                    theme={{ colors: { primary: 'transparent' } }}
                                    value={this.state.addressInputText}
                                    onChangeText={(text) => this.setState({
                                        addressInputText: text
                                    })} />
                            </View>
                            <View style={{ borderRadius: 10, width: '100%', height: 60, marginTop: 15, backgroundColor: '#F5F5F5', }}>
                                <TextInput
                                    style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, height: 60, backgroundColor: 'transparent' }]}
                                    placeholder="Bio"
                                    underlineColor='transparent'
                                    theme={{ colors: { primary: 'transparent' } }}
                                    value={this.state.bioInputText}
                                    onChangeText={(text) => this.setState({
                                        bioInputText: text
                                    })} />
                            </View>
                            <TouchableOpacity style={{ alignSelf: 'center', paddingTop: 10, paddingBottom: 10 }} onPress={() => {
                                const data = new FormData();
                                this.setState({
                                    showToast: true,
                                })
                                if (this.state.professionInputText === '') {
                                    this.refs.toast.show("Profession cannot be empty");
                                    return;
                                }
                                if (this.state.phoneInputText === '') {
                                    this.refs.toast.show("Mobile number cannot be empty");
                                    return;
                                }
                                if (this.state.addressInputText === '') {
                                    this.refs.toast.show("Address cannot be empty");
                                    return;
                                }
                                if (this.state.bioInputText === '') {
                                    this.refs.toast.show("Bio cannot be empty");
                                    return;
                                }
                                data.append('userprofession', this.state.professionInputText);
                                data.append('usermobile', this.state.phoneInputText);
                                data.append('useraddress', this.state.addressInputText);
                                data.append('userbio', this.state.bioInputText);
                                Keyboard.dismiss();
                                this.UpdateProfile(data, true);
                            }}><Text style={AppStyle.appButton}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {
                    loading ?
                        <ActivityIndicator
                            animating={true}
                            style={AppStyle.activityIndicator}
                            size='large'
                        /> : null
                }
                <Toast ref="toast" style={AppStyle.toast_style} />
            </SafeAreaView >
        )
    }

    showMenu = () => {
        this.setState({
            showMenuOptions: !this.state.showMenuOptions
        })
    }

    showUpdateProfile = () => {
        this.setState({
            showUploadModal: !this.state.showUploadModal,
            showMenuOptions: !this.state.showMenuOptions
        })
    }

    async signOutfromApp() {
        this.setState({
            showMenuOptions: !this.state.showMenuOptions
        })
        try {
            await AsyncStorage.removeItem("userData")
            // console.debug('signOutfromApp: data removed');
            this.props.navigation.navigate('login')
        } catch (err) {
            console.log(`signOutfromApp:The error is: ${err}`)
        }
    }

    async DeactivateProfile() {
        this.setState({
            showMenuOptions: !this.state.showMenuOptions
        })
        Alert.alert(
            'Account Deactivation',
            'Do you want to deactivate your account? You can always re-activate your account by logging into app within 2 weeks, after that account is deleted permanently.',
            [
                { text: 'CANCEL', onPress: () => { }, style: 'cancel' },
                {
                    text: 'DEACTIVATE', onPress: () => {
                        this.UpdateAccountStatus();
                    }
                },
            ],
            { cancelable: false }
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
                // const source = response.uri;
                const { userData } = this.state;
                const data = new FormData();
                data.append('userdp', {
                    uri: response.uri,
                    type: response.type,
                    name: response.fileName
                });
                data.append('firstname', userData.firstname);
                this.UpdateProfile(data, false);
            }
        });
    }

    UpdateAccountStatus() {
        const { userData } = this.state;
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
                statusType: 'deactivate',
            })
        }).then((res) => res.json())
            .then(resJson => {
                console.debug('Deactivate profile response', resJson);
                this.setState({
                    loading: false,
                })
                if (resJson.status === 200 && resJson.message.toLowerCase() === 'account status updated successfully.') {
                    (async () => {
                        try {
                            await AsyncStorage.removeItem("userData")
                        } catch (err) {
                            console.log(`RemoveUserDatafromApp:The error is: ${err}`)
                        }
                    })();
                    this.refs.toast.show("Profile deactivated successfully");
                    this.props.navigation.navigate('login')
                } else {
                    this.refs.toast.show(resJson.message);
                }
            }).catch((err) => {
                console.debug('Deactivate Profile response ERROR:', err);
                this.setState({ error: err, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    UpdateProfile = (data, isfromModal) => {
        const { userData } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.UPDATE_USER_PROFILE
        console.debug('URL:', url);
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
                this.setState({
                    loading: false,
                })
                if (resJson.status === 200) {
                    if (isfromModal) {
                        this.setState({
                            showUploadModal: !this.state.showUploadModal,
                        })
                    }
                    this.setState({
                        error: resJson.error || null,
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
                        useraddress: resJson.data.useraddress,
                        professionInputText: resJson.data.userprofession === null ? '' : resJson.data.userprofession,
                        phoneInputText: resJson.data.usermobile === null ? '' : resJson.data.usermobile,
                        addressInputText: resJson.data.useraddress === null ? '' : resJson.data.useraddress,
                        bioInputText: resJson.data.userbio === null ? '' : resJson.data.userbio
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
}