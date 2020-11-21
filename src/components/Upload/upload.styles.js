import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  headerstyle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 70,
    elevation: 2,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  upload_container: {
    margin: 10, 
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#ECECEC',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 2,
    borderColor: '#ECECEC',
    borderWidth: (Platform.OS === 'ios') ? 0.5 : 0,
},

  up2: {
    height: 40,
    fontSize: 25,
    // marginVertical: 10,
    marginLeft: 20
  },


  up4_1: {
    width: '50%',
    fontSize: 20,
  },

  up5: {
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 1,
  },

  up7: {
    marginVertical: 20,
    borderRadius: 20,
    borderColor: '#bdc3c7',
    overflow: 'hidden',
    width: "80%",
    marginLeft: "10%",
    backgroundColor: '#D3D3D3',
  },

});

export { styles, }