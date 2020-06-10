import * as React from 'react';
import { Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AppStyle } from '../../App.style';
import { ProfileStyles } from '../Profile/Profile.style';
import AppConfig from '../../config/constants';
import { ButtonGradientColor1, ButtonGradientColor2 } from '../../config/constants';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-easy-toast'
import NetInfo from "@react-native-community/netinfo";

export default class PostUserProfile extends React.Component {
    constructor(props) {
        super(props);
        const postDetails = this.props.route.params.postDetails
        console.debug("POST Details: Profile", postDetails)
        this.state = {
            loading: false,
            showMenuOptions: false,
            userData: {},
            postDetails: postDetails,
            error: null,
            isUserAlreadyFollowing: false,
            showFolloworUnfollowButton: false,
            userPostsAry: [],
            userdp: postDetails.userdp,
            username: postDetails.username,
            firstname: postDetails.firstname,
            lastname: postDetails.lastname,
            userprofession: postDetails.userprofession,
            followers: null,
            following: null,
            userbio: '',
            usermobile: '',
            useremail: '',
            useraddress: '',
            is_connected: false,
            menuTop: 60
        };
    }

    async componentDidMount() {
        await AsyncStorage.getItem("userData").then(value => {
            const userData = JSON.parse(value);
            const { postDetails } = this.state;
            console.debug("userdetails: post user profile", userData);
            if (userData.userid === postDetails.userid) {
                this.setState({
                    showFolloworUnfollowButton: false,
                    userData: userData,
                })
            } else {
                this.setState({
                    showFolloworUnfollowButton: true,
                    userData: userData,
                })
            }
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.netinfoSubscribe = NetInfo.addEventListener(state => {
            if (state.isInternetReachable) {
                this.setState({ is_connected: true });
            } else {
                this.setState({ is_connected: false });
            }
        });
        this.makeRequesttoFetchPostUserDetails()
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.netinfoSubscribe();
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    };

    makeRequesttoFetchUserMarkers = () => {
        const { userData, postDetails, is_connected } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.GET_MARKERS_BY_USER
        console.debug(url);
        this.setState({ loading: true });
        if (!is_connected) {
            this.setState({ loading: false });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': userData.token
            },
            body: JSON.stringify({
                userid: postDetails.userid,
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('PostUser ProfilePage Markers response:', responseData)
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
                console.debug('PostUser ProfilePage Markers response ERROR:', error);
                this.setState({ error: error, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    makeRequesttoFetchPostUserDetails = () => {
        const { userData, postDetails, is_connected } = this.state;
        const url = AppConfig.DOMAIN + AppConfig.GET_POST_USER_PROFILE
        console.debug(url);
        this.setState({ loading: true });
        if (!is_connected) {
            this.setState({ loading: false });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': userData.token
            },
            body: JSON.stringify({
                userid: postDetails.userid,
            })
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Post USER Profile Page response:', responseData)
                this.setState({ loading: false });
                if (responseData.status === 200) {
                    var isAlreadyFollowing = false;
                    for (let obj of responseData.data.followers) {
                        if (obj === userData.userid) {
                            isAlreadyFollowing = true;
                            break;
                        }
                    }
                    this.setState({
                        error: responseData.error || null,
                        username: responseData.data.username,
                        userdp: responseData.data.userdp,
                        firstname: responseData.data.firstname,
                        lastname: responseData.data.lastname,
                        userprofession: responseData.data.userprofession,
                        followers: responseData.data.followers,
                        following: responseData.data.following,
                        userbio: responseData.data.userbio,
                        usermobile: responseData.data.usermobile,
                        useremail: responseData.data.useremail,
                        useraddress: responseData.data.useraddress,
                        isUserAlreadyFollowing: isAlreadyFollowing
                    });
                } else {
                    this.refs.toast.show(responseData.message);
                }
                this.makeRequesttoFetchUserMarkers();
            })
            .catch(error => {
                console.debug('Postuser Profile Page response ERROR:', error);
                this.setState({ error: error, loading: false });
                this.refs.toast.show("Something went wrong. Please try again later");
            });
    };

    makeRequesttoFollowOrUnFollowPostUser = () => {
        const { userData, isUserAlreadyFollowing, postDetails, is_connected } = this.state;
        var data;
        var url;
        if (isUserAlreadyFollowing) { // Unfollow
            url = AppConfig.DOMAIN + AppConfig.UN_FOLLOW_USER
            data = {
                unFollowerId: postDetails.userid,
            }
        } else { // follow
            url = AppConfig.DOMAIN + AppConfig.FOLLOW_USER
            data = {
                followerId: postDetails.userid,
            }
        }
        console.debug("URL:", url);
        console.debug("Request:", data);
        this.setState({ loading: true });
        if (!is_connected) {
            this.setState({ loading: false });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': userData.token
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(responseData => {
                console.debug('Post USER Profile Page follow or unfollow response:', responseData)
                this.setState({ loading: false });
                if (responseData.status === 200) {
                    this.setState({
                        isUserAlreadyFollowing: !this.state.isUserAlreadyFollowing
                    });
                    this.makeRequesttoFetchPostUserDetails();
                } else {
                    this.refs.toast.show(responseData.message);
                }
            })
            .catch(error => {
                console.debug('Postuser Profile Page follow or unfollow response ERROR:', error);
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
            useraddress,
            isUserAlreadyFollowing,
            showFolloworUnfollowButton,
            menuTop
        } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={ProfileStyles.headerstyle} ref="Header" onLayout={({ nativeEvent }) => {
                    this.refs.Header.measure((x, y, width, height, pageX, pageY) => {
                        // console.log(x, y, width, height, pageX, pageY);
                        this.setState({ menuTop: y + height });
                    })
                }}>
                    <TouchableOpacity onPress={this.returnBack} style={{ padding: 8, marginLeft: 10 }}>
                        <Image source={require('../../images/back.png')} resizeMode={'contain'} style={{ width: 13, height: 20, marginLeft: 10 }} />
                    </TouchableOpacity>
                    <Text style={[AppStyle.dark_TextColor, AppStyle.app_font_heading, { fontSize: 18 }]}>@{username}</Text>
                    <TouchableOpacity onPress={() => this.showMenu()} style={{ padding: 8, marginRight: 10 }}>
                        <Image source={require('../../images/profile_menu.png')} style={{ width: 8, height: 20, marginLeft: 10 }} resizeMode={'contain'} />
                    </TouchableOpacity>
                </View>
                {
                    this.state.showMenuOptions ?
                        <View style={[ProfileStyles.MenuOptionStyle, { top: menuTop - 10 }]}>
                            <TouchableOpacity onPress={() => this.BlockUserProfile()}>
                                <Text style={[AppStyle.dark_TextColor, AppStyle.app_font_heading, { fontSize: 14, padding: 8 }]}>Block</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                <ScrollView style={{ backgroundColor: 'white' }}>
                    <View style={[ProfileStyles.userDp, { alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', marginTop: 10 }]}>
                        {
                            (userdp == null) || (userdp == '') ?
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={require('../../images/no_profile.png')} resizeMode='contain' style={{ width: 75, height: 75, marginBottom: 10 }} />
                                </View>
                                :
                                <Image style={ProfileStyles.userDp} source={{ uri: userdp }} resizeMode={(userdp == null) || (userdp == '') ? 'contain' : 'cover'} />
                        }
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
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>{followers === null ? 0 : followers.length}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={[AppStyle.appLabel]}>FOLLOWING</Text>
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>{following === null ? 0 : following.length}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: "center", }}>
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, textAlign: 'center', marginLeft: 15, marginRight: 15, marginTop: 20 }]}>
                            {(userbio == null) || (userbio == '') ? <Text>Bio : Not Available</Text> : <Text>{userbio}</Text>}
                        </Text>
                    </View>
                    {
                        showFolloworUnfollowButton ?
                            <TouchableOpacity style={{ alignSelf: 'center', paddingTop: 10, paddingBottom: 10 }} onPress={() => { this.makeRequesttoFollowOrUnFollowPostUser() }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={[ButtonGradientColor1, ButtonGradientColor2]}
                                    style={AppStyle.appButton_background}>
                                    <Text style={AppStyle.appButton_Text}>{isUserAlreadyFollowing ? "UN FOLLOW" : "FOLLOW"}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            : null
                    }
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
                                                <TouchableOpacity onPress={this.OpenPost} style={{ flex: 1, borderColor: '#F5F5F5', borderWidth: 0.5, borderRadius: 8, marginLeft: 15, width: 130, height: 130, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}>
                                                    < Image source={imageUri == null ? require('../../images/no_image_logo.png') : { uri: imageUri }} resizeMode={imageUri == null ? 'contain' : 'cover'} style={{ width: (imageUri == null ? 40 : 130), height: (imageUri == null ? 40 : 130), borderRadius: 8 }} />
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
                            <Image style={{ width: 18, height: 15, marginRight: 5 }} source={require('../../images/phone_filled.png')} resizeMode={'contain'} />
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>
                                {(usermobile == null) || (usermobile == '') ? <Text>Not Available</Text> : <Text>{usermobile}</Text>}
                            </Text>
                        </View>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter, { paddingTop: 20, paddingBottom: 20 }]}>
                        <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 14 }]}>EMAIL</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 18, height: 18, marginRight: 4 }} source={require('../../images/email_filled.png')} resizeMode={'contain'} />
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>
                                {(useremail == null) || (useremail == '') ? <Text>Not Available</Text> : <Text>{useremail}</Text>}
                            </Text>
                        </View>
                    </View>
                    <View style={[AppStyle.appAlignItemsCenter, { paddingBottom: 20 }]}>
                        <Text style={[AppStyle.light_TextColor, AppStyle.app_font, { fontSize: 14 }]}>ADDRESS</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 18, height: 18 }} source={require('../../images/location.png')} resizeMode={'contain'} />
                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>
                                {(useraddress == null) || (useraddress == '') ? <Text>Not Available</Text> : <Text>{useraddress}</Text>}
                            </Text>
                        </View>
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
                <Toast ref="toast" style={AppStyle.toast_style} />
            </SafeAreaView >
        )
    }

    showMenu = () => {
        this.setState({
            showMenuOptions: !this.state.showMenuOptions
        })
    }

    BlockUserProfile = () => {
        this.setState({
            showMenuOptions: !this.state.showMenuOptions
        })
        Alert.alert(
            '',
            'Do you really want to block this user? You can no longer view his activity',
            [
                { text: 'CANCEL', onPress: () => { }, style: 'cancel' },
                { text: 'YES', onPress: () => { console.log('BLOCK USER Pressed') } },
            ],
            { cancelable: false }
        )
    }

    returnBack = () => {
        this.props.navigation.goBack();
    };

}