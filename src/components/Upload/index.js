import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Picker, SafeAreaView, FlatList, Dimensions, ActivityIndicator, BackHandler, Platform, PermissionsAndroid } from 'react-native';
import { AppStyle } from '../../App.style';
import { styles } from './upload.styles';
import Toast from 'react-native-easy-toast';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import AppConfig from '../../config/constants';
import CustomiOSPicker from '../CustomiOSPicker'
import Geolocation from '@react-native-community/geolocation';
import NetInfo from "@react-native-community/netinfo";

const options = {
    title: 'Select Option',
    customButtons: [],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
};

export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choosenIndex: 0,
            hummDescription: '',
            category: '',
            isImageUploaded: false,
            uploadImageArray: [],
            userData: {},
            loading: false,
            showtoast: false,
            showiOSPicker: false,
            latlang: "0.000,0.000",
            is_connected: false,
            pickerData: ["Choose category", "Movies", "Music", "Sports", "Travel", "Politics", "Art", "Entertainment", "Technology", "Fashion", "Food"],
        };
    }

    async componentDidMount() {
        await AsyncStorage.getItem("userData").then(value => {
            const userData = JSON.parse(value);
            this.setState({
                userData: userData,
            });
        });
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // do something
            this.setState({
                choosenIndex: 0,
                hummDescription: '',
                category: '',
                isImageUploaded: false,
                uploadImageArray: [],
                loading: false,
                showtoast: false,
                showiOSPicker: false,
            })
        });
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
        this._unsubscribe();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        this.netinfoSubscribe();
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    };

    showiOSPicker = () => {
        this.setState({
            showiOSPicker: true
        })
    }

    uploadImage = () => {
        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // const source = response.uri;
                console.log("string checking" + JSON.stringify(response));
                let imagesAry = this.state.uploadImageArray;
                imagesAry.push(response)
                this.setState({
                    isImageUploaded: true,
                    uploadImageArray: imagesAry,
                });
            }
        });
    }

    UploadMarker = () => {
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization()
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
                'message': "This app requires access to your location to tag location to your posts.",
                buttonPositive: "OK"
            }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //To Check, If Permission is granted
                this.fetchLocation();
            } else {
                console.log("Location Permission Denied");
                this.upload();
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
                var locationData = position;
                var latlang = "0.000,0.000";
                if (locationData && locationData.coords) {
                    var coords = locationData.coords;
                    latlang = coords.latitude + "," + coords.longitude;
                }
                this.setState({
                    latlang: latlang,
                }, this.upload)
            },
            (error) => {
                this.setState({
                    latlang: "0.000,0.000",
                }, this.upload)
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    validateText = (text) => {
        let reg = /.*\S.*/;
        if (reg.test(text) === false) {
            return false;
        }
        else {
            return true;
        }
    }

    upload = () => {
        const { userData, category, uploadImageArray, hummDescription, latlang, is_connected } = this.state;
        console.debug("upload method", category, hummDescription, uploadImageArray, latlang)
        this.setState({
            showtoast: true,
        })
        if (category === '') {
            this.refs.toast.show("Category cannot be empty");
            return;
        }
        if (hummDescription === '' && uploadImageArray.length <= 0) {
            this.refs.toast.show("Please add something to post");
            return;
        }
        if (!this.validateText(hummDescription) && hummDescription !== '') {
            this.refs.toast.show("Please write something valid");
            return;
        }

        const data = new FormData();
        for (let obj of uploadImageArray) {
            data.append('markermedia', {
                uri: obj.uri,
                type: obj.type,
                name: obj.fileName
            });
        }
        console.log(data);
        data.append('description', hummDescription);
        data.append('category', category);
        data.append('latitude', '0');
        data.append('longitude', '0');
        data.append('location', '78.3915,17.4933'); // latlang
        console.log(data);
        let url = AppConfig.DOMAIN + AppConfig.SAVE_MARKER
        console.debug('URL: ', url)
        this.setState({
            loading: true,
        })
        if (!is_connected) {
            this.setState({
                loading: false,
            });
            this.refs.toast.show("Internet is not connected, Please try again!");
            return;
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'token': userData.token
            },
            body: data
        }).then((res) => {
            this.setState({
                loading: false,
            })
            console.debug('Post marker response', res)
            if (res.status === 200) {
                this.setState({
                    isImageUploaded: false,
                    uploadImageArray: [],
                    hummDescription: '',
                    category: '',
                })
                this.refs.toast.show("Marker uploaded successfully");
                // this.props.navigation.navigate('TabBar');
            } else {
                this.refs.toast.show(res.message);
            }
        }).catch((err) => {
            this.setState({
                loading: false,
            })
            console.log('Post marker response error', err);
            this.refs.toast.show("Something went wrong. Please try again later");
        });
    }

    callbackfromPicker = (data, index) => {
        console.debug("picker data", data);
        if (data !== 'Choose category') {
            this.setState({
                category: data,
                choosenIndex: index,
                showiOSPicker: false
            })
        } else {
            this.setState({
                category: '',
                choosenIndex: 0,
                showiOSPicker: false
            })
        }
    }

    render() {
        const { isImageUploaded, uploadImageArray, loading, hummDescription } = this.state;
        return (
            // <KeyboardAvoidingView behavior="position">
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.headerstyle}>
                    <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 20, marginLeft: 15 }]}>Say Something</Text>
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomColor: '#f5f5f5', borderBottomWidth: 1, height: 250, width: Dimensions.get("window").width }}>
                        {
                            isImageUploaded ?
                                <View>
                                    <FlatList
                                        horizontal
                                        pagingEnabled={true}
                                        data={uploadImageArray}
                                        renderItem={({ item }) => {
                                            return (
                                                <Image source={{ uri: item.uri }} resizeMode='cover' style={{ width: Dimensions.get("window").width, height: 250 }} />
                                            )
                                        }}
                                        keyExtractor={(item, index) => index + ""}
                                    />
                                    <TouchableOpacity onPress={() => this.uploadImage()} style={{ zIndex: 1, position: 'absolute', bottom: 8, right: 8, padding: 8, backgroundColor: 'white', borderRadius: 20 }} >
                                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>Upload More</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity onPress={() => this.uploadImage()} style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={require('../../images/logo.png')} resizeMode='contain' style={{ width: 80, height: 80 }} />
                                    <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}>Click here to Upload</Text>
                                </TouchableOpacity>
                        }
                    </View>
                    <View style={{ paddingTop: 20 }}>
                        <TextInput multiline={true} style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, minHeight: 50, overflow: 'hidden', marginLeft: 15, marginRight: 15 }]} placeholder="Write Something"
                            onChangeText={hummDescription => this.setState({ hummDescription })} value={hummDescription}></TextInput>
                        <TouchableOpacity onPress={() => {
                            if (Platform.OS === 'ios') {
                                this.showiOSPicker();
                            }
                        }} style={{ paddingTop: 30 }}>
                            <View style={{ width: '90%', alignSelf: 'center', borderRadius: 25, backgroundColor: '#ECECEC', height: 50 }} >
                                {
                                    Platform.OS === 'android' ?
                                        <Picker style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, width: '100%', height: 50, }]} itemStyle={{ alignItems: 'center', textAlign: 'center', color: '#9B9B9B' }}
                                            selectedValue={this.state.category}
                                            onValueChange={(itemValue, itemPosition) => {
                                                console.debug('itemValue:', itemValue)
                                                if (itemValue !== 'Choose category') {
                                                    this.setState({ category: itemValue, choosenIndex: itemPosition })
                                                } else {
                                                    this.setState({ category: '', choosenIndex: 0 })
                                                }
                                            }
                                            }
                                        >
                                            {this.state.pickerData.map((item, index) => (
                                                <Picker.Item label={item} value={item} key={index} />)
                                            )}
                                        </Picker>
                                        :
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14 }]}> {this.state.category === '' ? "Choose Category" : this.state.category}</Text>
                                        </View>
                                }
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 30, paddingTop: 30 }} onPress={this.UploadMarker}><Text style={AppStyle.appButton}>HUMM IT </Text></TouchableOpacity>
                    </View>
                </ScrollView>
                {
                    this.state.showiOSPicker ? <CustomiOSPicker pickerData={this.state.pickerData} callbackFromiOSPickerData={this.callbackfromPicker} /> : null
                }
                {
                    loading ? <ActivityIndicator
                        animating={true}
                        style={AppStyle.activityIndicator}
                        size='large'
                    /> : null
                }
                <Toast ref="toast"
                    style={AppStyle.toast_style} />
            </SafeAreaView>
            // </KeyboardAvoidingView>
        );
    }
}