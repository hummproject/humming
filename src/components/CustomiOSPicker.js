import React from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, Picker
} from 'react-native';
import { AppStyle } from '../App.style'

const styles = StyleSheet.create({
    backgroundcontainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0, left: 0,
        right: 0, bottom: 0,
        backgroundColor: '#F5FCFF88'
    },
    containerview: {
        width: '100%',
        height: 200,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    }
});

export default class CustomiOSPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pickerData: this.props.pickerData,
            pickerValue: this.props.pickerData[0],
            pickerindex: 0
        }
    }

    SendSelectedPickerData = () => {
        this.props.callbackFromiOSPickerData(this.state.pickerValue, this.state.pickerindex);
    }

    DismissPicker = () => {
        this.props.callbackFromiOSPickerData();
    }

    render() {
        return (
            <View style={styles.backgroundcontainer}>
                <View style={[styles.containerview, { flexDirection: 'column' }]}>
                    <View style={{ height: 35, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: '#ECECEC', borderTopWidth: 1, backgroundColor: '#FFFFFF' }}>
                        <TouchableOpacity onPress={() => this.DismissPicker()}>
                            <Text style={[AppStyle.app_font, { color: '#007AFF', fontSize: 16, marginLeft: 15 }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.SendSelectedPickerData()}>
                            <Text style={[AppStyle.app_font, { color: '#007AFF', fontSize: 16, marginRight: 15 }]}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ width: '100%', height: 165, marginBottom: 100, }}> */}
                    <Picker
                        style={{ width: '100%', height: 165, marginBottom: 100 }}
                        itemStyle={[AppStyle.app_font, { fontSize: 15, alignItems: 'center', textAlign: 'center', color: '#9B9B9B' }]}
                        selectedValue={this.state.pickerValue}
                        onValueChange={(itemValue, itemIndex) => this.setState({ pickerValue: itemValue, pickerindex: itemIndex })} >
                        {this.state.pickerData.map((item) => (
                            <Picker.Item label={item} value={item} keyExtractor={(item, index) => index + item} />)
                        )}
                    </Picker>
                    {/* </View> */}
                </View>
            </View>
        );
    }
}