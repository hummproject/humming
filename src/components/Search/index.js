import React, { Component } from 'react';
import { Text, View, TextInput, SafeAreaView } from 'react-native';
// import { Searchbar} from 'react-native-elements'
import { styles } from './search.styles';

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
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.headerstyle}>
                    <Text style={{ fontSize: 18, marginLeft: 15, }}>Search</Text>
                </View>
            </SafeAreaView>
        );
    }
}