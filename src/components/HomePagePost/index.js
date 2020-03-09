import React, { Component } from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import { styles } from './HomePagePost.style';
import StickyHeaderFooterScrollView from 'react-native-sticky-header-footer-scroll-view';

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
                        <View style={{ flexDirection: "row", alignItems: 'center', alignSelf: 'baseline', justifyContent: 'flex-start', backgroundColor: '#dedede', padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: Dimensions.get('window').width }}>
                            <Image source={require('../../images/img.jpg')} style={{ height: 15, width: 15 }} />
                            <Text style={{ marginLeft: 5 }}>food</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'column' }}>
                    <Image source={require('../../images/img.jpg')} resizeMode={'cover'}
                        style={{ width: '100%', height: 200 }} />
                    <Text style={styles.userTag, { marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                        Lorumn epusm is simply dumy text of thr printing and typesetting. Loreum ipsum has been the industry
                        </Text>
                </View>
                <View style={styles.BottomContainer}>
                    <Image source={require('../../images/unlike-icon.png')} resizeMode={'cover'}
                        style={{ width: 15, height: 15, marginLeft: 15 }} />
                    <Text style={styles.userTag, { marginLeft: 10, marginRight: 25 }}>
                        1658
                        </Text>
                    <Image source={require('../../images/comment-icon.png')} resizeMode={'cover'}
                        style={{ width: 15, height: 15 }} />
                    <Text style={styles.userTag, { marginLeft: 10 }}>
                        129
                        </Text>
                </View>
            </View>
        )
    };
}