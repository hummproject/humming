import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    up1:{
        flex:3,
        marginVertical:30,
      },
      up2:{
        height:40,
        fontSize:25,
        marginVertical:10,
        marginLeft:20
      },
      up3:{
        width:'100%',
        flexDirection:'row',
        alignItems: 'center',
        marginVertical:130,
      },
      up4:{
        width:'50%',
        fontSize:20,
        paddingLeft:50,
      },
      up4_1:{
        width:'50%',
        fontSize:20,
      },
      up5:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
      },
      up6:{
         marginVertical:25,
         fontSize:20,
         marginLeft:10, 
         width:'100%'
         
      },
      
    pickerStyle:{  
         color: 'white',  
        justifyContent: 'center',
        backgroundColor:'rgba(0,0,0,0.4)',
        alignItems:'center'
          
    } ,
    
    up7:{
      marginVertical:20,
      borderRadius: 20,
      borderColor: '#bdc3c7', 
      overflow: 'hidden',
      width:"80%",
      marginLeft:"10%",
      backgroundColor:'rgba(0,0,0,0.4)',   
    },
    up8:{
      marginVertical:15,
      alignItems: 'center',
      height:50,
    }
  
    
      });
   
      export{ styles, }