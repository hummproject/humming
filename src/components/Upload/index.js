import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Picker, SafeAreaView } from 'react-native';
import { AppStyle } from '../../App.style';
import { styles } from './upload.styles';
import { UploadPost } from './upload.service';
import Toast from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-picker';
import AppConfig from '../../config/constants';

const options = {
    title: 'Select Option',
    customButtons: [],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
};

const data = new FormData();

export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choosenIndex: 0,
            hummDescription: "",
            category: "",
            gallery: ""
        };
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
                const source = response.uri;
                console.log("string checking" + JSON.stringify(response));
                data.append('markermedia', {
                    uri: response.uri,
                    type: response.type,
                    name: response.fileName
                });
                

                console.log(data);
                this.setState({
                    gallery: source
                });
            }
        });
    }

    upload = async () => {
        const hummDescription = this.state.hummDescription;
        const category = this.state.category;
        data.append('description', hummDescription);
        data.append('category', category);
        data.append('latitude', '0');
        data.append('longitude', '0');
        data.append('location', '78.3915,17.4933');
        console.log(data);
        fetch(AppConfig.DOMAIN + '/api/v1/savemarker', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNjgiLCJpYXQiOjE1ODM4MzczMTksImV4cCI6MTU4NDQ0MjExOX0.HzFp43qpD61IAS05CY__zmvROj0B7uVydfblaxm_ODE'
            },
            body: data
        }).then((res) => {
            if (res.status === 200) {
                this.refs.toast.show("Done");
                this.props.navigation.navigate('TabBar', { userData: res.data });
            } else {
                this.refs.toast.show("Something went wrong" + res.message);

            }
        }).catch((err) => {
            console.log('some info message to user using Toast Android');
            this.refs.toast.show("Something went wrong. Please try again later");
        });

    }
    render() {
        return (
            <KeyboardAvoidingView
                behavior="position">
                <SafeAreaView>
                    <View style={styles.headerstyle}>
                        <Text style={{ fontSize: 18, marginLeft: 15 }}>Say Something</Text>
                    </View>
                    <ScrollView>
                        <View style={styles.up1}>
                            <View style={styles.up3}>
                                <TouchableOpacity onPress={() => this.uploadImage()}>
                                    <Text>UPLOAD IMAGE</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={styles.up4} onPress={() => this.uploadImage()}>
                                <Text style={styles.up4_1}>Hi</Text>
                            </TouchableOpacity> */}
                            </View>
                            <View style={styles.up5}></View>
                            <View style={{ flex: 3 }} >
                                <TextInput multiline={true} style={styles.up6} placeholder="Write Something"
                                    onChangeText={hummDescription => this.setState({ hummDescription })}></TextInput>
                                <View style={styles.up7} >
                                    <Picker style={styles.pickerStyle} itemStyle={{ alignItems: 'center', }}
                                        selectedValue={this.state.category}
                                        onValueChange={(itemValue, itemPosition) =>
                                            this.setState({ category: itemValue, choosenIndex: itemPosition })}
                                    >
                                        <Picker.Item label="Movies" value="Movies" />
                                        <Picker.Item label="Music" value="Music" />
                                        <Picker.Item label="Sports" value="Sports" />
                                        <Picker.Item label="Travel" value="Travel" />
                                        <Picker.Item label="Politics" value="Politics" />
                                        <Picker.Item label="Art" value="Art" />
                                        <Picker.Item label="Entertainment" value="Entertainment" />
                                        <Picker.Item label="Technology" value="Technology" />
                                        <Picker.Item label="Fashion" value="Fashion" />
                                        <Picker.Item label="Food" value="Food" />
                                    </Picker>
                                </View>
                                <TouchableOpacity style={styles.up8} onPress={this.upload}><Text style={AppStyle.appButton}>HUMM IT </Text></TouchableOpacity>
                            </View>
                        </View>
                        <Toast ref="toast"
                            style={{ backgroundColor: 'grey', borderRadius: 20 }} />
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}