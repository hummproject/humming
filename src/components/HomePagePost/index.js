import React, { Component } from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import { styles } from './HomePagePost.style';

export default class HomePagePost extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.TopContainer}>
                    <Image source={require('../../images/img.jpg')} style={styles.profile_photo} />
                    <View style={styles.container_text}>
                        <Text style={styles.UserName}>
                            Veerender Shivannagari
                    </Text>
                        <Text style={styles.userTag}>
                            @veeru_s
                    </Text>
                        <View style={styles.categoryContainer}>
                            <Image source={require('../../images/img.jpg')} style={{ height: 15, width: 15 }} />
                            <Text style={{marginLeft:5}}>food</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'column' }}>
                    <Image source={require('../../images/img.jpg')} resizeMode={'cover'}
                        style={{ width: '100%', height: 200 }} />
                    <Text style={styles.userTag, { marginLeft: 15, marginRight: 15, marginTop:15 }}>
                        Lorumn epusm is simply dumy text of thr printing and typesetting. Loreum ipsum has been the industry
                        </Text>
                </View>
                <View style={styles.BottomContainer}>
                    <Image source={require('../../images/img.jpg')} resizeMode={'cover'}
                        style={{ width: 25, height: 25, marginLeft:15}} />
                    <Text style={styles.userTag, { marginLeft: 10, marginRight: 25 }}>
                        1658
                        </Text>
                    <Image source={require('../../images/img.jpg')} resizeMode={'cover'}
                        style={{ width: 25, height: 25 }} />
                    <Text style={styles.userTag, { marginLeft: 10 }}>
                        129
                        </Text>
                </View>
            </View>
        )
    };
}