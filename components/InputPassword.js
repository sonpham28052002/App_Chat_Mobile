import { View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';

const InputPassword = (props) => {
    var [eye, setEye] = useState('eye-with-line')
    var [secureTextEntry, setSecureTextEntry] = useState(true)
    return (
        <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ width: '88%' }}>
                <TextInput style={{
                    padding: 10,
                    height: 40,
                    fontSize: 20,
                    borderColor: 'black',
                    borderWidth: 2,
                    borderRadius: 5
                }}
                    onChangeText={props.setPassword}
                    secureTextEntry={secureTextEntry}
                    placeholder={props.placeholder}
                    placeholderTextColor={'gray'}
                />
            </View>
            <View style={{ width: '12%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => {
                    if (eye == 'eye') {
                        setEye('eye-with-line')
                        setSecureTextEntry(!secureTextEntry)
                    }
                    else {
                        setEye('eye')
                        setSecureTextEntry(!secureTextEntry)
                    }
                }}>
                    <Entypo name={eye} size={30} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default InputPassword