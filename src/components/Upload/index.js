import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Picker } from 'react-native';
import { AppStyle } from '../../App.style';
import { styles } from './upload.styles';
import { UploadPost } from './upload.service';
import Toast from 'react-native-easy-toast'

export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choosenIndex: 0,
            hummDescription: "",
            category: ""
        };
    }
    upload = async () => {
        const hummDescription = this.state.hummDescription;
        const category = this.state.category;
        UploadPost({
            description: hummDescription,
            category: category,
            latitude: "0",
            longitude: "0",
            location: "78.3915,17.4933"
        }).then((res) => {
            if (res.status === 200) {
                this.props.navigation.navigate('TabBar', { userData: res.data });
            } else {
                this.refs.toast.show("Something went wrong");
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
                <ScrollView>
                    <View style={styles.up1}>
                        <Text style={styles.up2}> Say Something</Text>
                        <View style={styles.up3}>
                            <Text style={styles.up4}>Hii</Text>
                            <Text style={styles.up4_1}>Hii</Text>
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
                                    <Picker.Item label="Java" value="Java" />
                                    <Picker.Item label="JavaScript" value="JavaScript" />
                                    <Picker.Item label="React Native" value="React Native" />
                                </Picker>
                            </View>
                            <TouchableOpacity style={styles.up8} onPress={this.upload}><Text style={AppStyle.appButton}>HUMM IT </Text></TouchableOpacity>
                        </View>
                    </View>
                    <Toast ref="toast"
                        style={{ backgroundColor: 'grey', borderRadius: 20 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}