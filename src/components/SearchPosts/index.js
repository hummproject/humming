import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { AppStyle } from '../../App.style'
import ProgressiveImage from '../../ProgressiveImage'

export default class SearchPosts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            postDetails: this.props.postData,
        };
    }

    OpenPost = () => {
        console.debug('open post',this.state.postDetails)
        const {navigation} = this.props
        // navigation.navigate('postscomments', { postDetails: this.state.postDetails });
    };

    render() {
        const postDetails = this.state.postDetails;
        console.debug('In SearchPosts ',postDetails)
        let category = postDetails.category;
        let dataAry = postDetails.data;
        return (
            <View style={styles.container}>
                <View style = {{paddingLeft: 15, paddingBottom: 10}}>
                <View style={styles.categoryContainer}>
                    <Image source={require('../../images/category_marker_icon.png')} style={{ height: 13, width: 13 }} />
                    <Text style={[AppStyle.dark_TextColor,AppStyle.app_font,{fontSize: 14, marginLeft: 5, color: 'white' , textTransform: 'capitalize' }]}>{category}</Text>
                    </View>
                </View>
                    <FlatList
                        horizontal
                        pagingEnabled={true}
                        data={dataAry}
                        renderItem={({ item }) => {
                            console.debug(item.media);
                            let imageUri = item.media != null ? item.media[0] : null
                            console.debug('iMAGE uRL',imageUri);
                            if (imageUri != '') {
                                return (
                                    <TouchableOpacity onPress={this.OpenPost}>
                                        <View style={{flex: 1, borderColor:'#F5F5F5',borderWidth:0.5,borderRadius: 8,marginLeft: 15, paddingBottom: 5,width: 130, height: 130,}}>
                                        < Image source={imageUri == null ? require('../../images/logo.png') : { uri: imageUri }} resizeMode={imageUri == null ? 'contain' : 'cover'} style={{width: 130, height: 130,borderRadius: 8}} />
                                        </View>
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
        paddingBottom: 10,
        backgroundColor: '#FFFFFF',
    },

});