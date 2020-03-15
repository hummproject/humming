import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
// import { Searchbar} from 'react-native-elements'
// import { styles } from './search.styles';

export default class Search extends Component {
    // state = {
    //     searchQuery: '',
    // };
    render() {
        // const { searchQuery } = this.state;
        return (
            // <View style={styles.up1}>
            //     <Searchbar
            //         placeholder="Search"
            //         onChangeText={query => { this.setState({ searchQuery: query }); }}
            //         value={searchQuery}
            //         style={{ borderRadius: 20, width: '85%', marginLeft: 30, }}

            //     />

            // </View>
            <View style={{flex:1, alignItems: 'center',justifyContent:'center'}}>
                <Text>Search Screen</Text>
            </View>
        );
    }
}