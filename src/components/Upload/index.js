import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Picker } from 'react-native';
import { AppStyle } from '../../App.style';
import { styles } from './upload.styles';

export default class Upload extends Component {
    state = {
        choosenIndex: 0
    };
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
                            <TextInput multiline={true} style={styles.up6} placeholder="Write Something" ></TextInput>
                            <View style={styles.up7} >
                                <Picker style={styles.pickerStyle} itemStyle={{ alignItems: 'center' , }}
                                    selectedValue={this.state.language}
                                    onValueChange={(itemValue, itemPosition) =>
                                        this.setState({ language: itemValue, choosenIndex: itemPosition })}
                                >
                                    <Picker.Item label="Java" value="java" />
                                    <Picker.Item label="JavaScript" value="js" />
                                    <Picker.Item label="React Native" value="rn" />
                                </Picker>
                            </View>
                            <TouchableOpacity style={styles.up8}><Text style={AppStyle.appButton}>HUMM IT </Text></TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}