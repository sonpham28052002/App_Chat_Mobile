import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ButtonCustom = (props) => {
  return (
    <TouchableOpacity style={{
        backgroundColor: props.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: props.border? 0 : 1,
        borderRadius: 10,
        width: props.width? props.width : '100%',
        height: props.height? props.height : 50,
        }}
        onPress={props.onPress}
        >
        <Text style={{
            fontSize: 20, 
            fontWeight: 'bold',
            color: props.color? props.color:'black',
            }}>{props.title}</Text>
    </TouchableOpacity>
  )
}

export default ButtonCustom