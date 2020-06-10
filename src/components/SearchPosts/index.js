import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { AppStyle } from '../../App.style'
import LinearGradient from 'react-native-linear-gradient';
import { ButtonGradientColor1, ButtonGradientColor2 } from '../../config/constants';
import ProgressiveImage from '../../ProgressiveImage'

export default class SearchPosts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            postDetails: this.props.postData,
        };
    }

    OpenPostDetails = (postData) => {
        this.props.onPress(postData);
    };

    renderItem = ({ item }) => {
        let imageUri = item.media != null ? item.media[0] : null
        return (
            <TouchableOpacity onPress={this.OpenPostDetails.bind(this, item)} style={{ flex: 1, borderColor: '#F5F5F5', borderWidth: 0.5, borderRadius: 8, marginLeft: 15, marginBottom: 5, width: 130, height: 130, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}>
                < Image source={imageUri == null ? require('../../images/no_image_logo.png') : { uri: imageUri }} resizeMode={imageUri == null ? 'contain' : 'cover'} style={{ width: (imageUri == null ? 40 : 130), height: (imageUri == null ? 40 : 130), borderRadius: 8 }} />
            </TouchableOpacity>
        )
    };

    render() {
        const postDetails = this.state.postDetails;
        let category = postDetails.category;
        let dataAry = postDetails.data;
        return (
            <View style={styles.container}>
                <View style={{ paddingLeft: 15, paddingBottom: 10 }}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[ButtonGradientColor1, ButtonGradientColor2]}
                        style={styles.categoryContainer}>
                        <Image source={require('../../images/category_marker_icon.png')} style={{ height: 13, width: 13 }} />
                        <Text style={[AppStyle.dark_TextColor, AppStyle.app_font, { fontSize: 14, marginLeft: 5, color: 'white', textTransform: 'capitalize' }]}>{category}</Text>
                    </LinearGradient>
                </View>
                <FlatList
                    horizontal
                    contentContainerStyle={{ paddingEnd: 15 }}
                    showsHorizontalScrollIndicator={false}
                    data={dataAry}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index + ""}
                />
            </View>
        )
    };
}

const styles = StyleSheet.create({
    categoryContainer: {
        flexDirection: "row",
        alignItems: 'center',
        alignSelf: 'baseline',
        justifyContent: 'flex-start',
        padding: 3,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 15,
        backgroundColor: '#6454F0',
    },

    container: {
        flexDirection: 'column',
        paddingTop: 10,
        paddingBottom: 10
    },

});