import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  headerstyle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 60,
    elevation: 2,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 1,
    alignItems: 'center',
  },

  up1: {
    flex: 3,
  },

  up2: {
    height: 40,
    fontSize: 25,
    marginVertical: 10,
    marginLeft: 20
  },

  up3: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    marginVertical: 130,
  },

  up4_1: {
    width: '50%',
    fontSize: 20,
  },

  up5: {
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 1,
  },
  
  up6: {
    marginVertical: 25,
    fontSize: 20,
    marginLeft: 10,
    width: '100%'

  },

  pickerStyle: {
    color: '#9E9E9E',
    justifyContent: 'center',
    backgroundColor: '#ECECEC',
    alignItems: 'center'

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
  up8: {
    marginVertical: 15,
    alignItems: 'center',
    height: 50,
  }


});

export { styles, }