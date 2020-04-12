import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Picker, SafeAreaView, FlatList, Dimensions, ActivityIndicator, BackHandler, Platform } from 'react-native';
import { AppStyle } from '../../App.style';
import { styles } from './upload.styles';
import Toast from 'react-native-easy-toast';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import AppConfig from '../../config/constants';
import CustomiOSPicker from '../CustomiOSPicker'
// import { cos } from 'react-native-reanimated';

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
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    };

    showiOSPicker = () => {
        console.debug("In show iosPicker function")
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

    upload = async () => {
        const { userData, hummDescription, category, uploadImageArray } = this.state;
        console.debug("upload method", category, hummDescription, uploadImageArray)
        this.setState({
            showtoast: true,
        })
        if (category === '') {
            console.debug('category empty');
            this.refs.toast.show("Category cannot be empty");
            return;
        }
        if (hummDescription === '' && uploadImageArray.length <= 0) {
            console.debug('Humm description empty');
            this.refs.toast.show("Please add something to post");
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
        data.append('location', '78.3915,17.4933');
        console.log(data);
        let url = AppConfig.DOMAIN + AppConfig.SAVE_MARKER
        console.debug('URL: ', url)
        this.setState({
            loading: true,
        })
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
                this.props.navigation.navigate('TabBar');
            } else {
                this.refs.toast.show(res.message);
            }
        }).catch((err) => {
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
            <KeyboardAvoidingView
                behavior="position">
                <SafeAreaView>
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
                            <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 30, paddingTop: 30 }} onPress={this.upload}><Text style={AppStyle.appButton}>HUMM IT </Text></TouchableOpacity>
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
            </KeyboardAvoidingView>
        );
    }
}