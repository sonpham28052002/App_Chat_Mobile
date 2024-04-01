import { View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';

const InputPassword = (props) => {
    var [eye, setEye] = useState('eye-with-line')
    var [secureTextEntry, setSecureTextEntry] = useState(true)
    return (
        <View style={{ flexDirection: 'row', width: '100%', backgroundColor: 'white',
        borderWidth: 2, borderColor: 'black', borderRadius: 5 }}>
            <View style={{ width: '88%'}}>
                <TextInput style={{
                    height: 40,
                    fontSize: 20,
                    backgroundColor: 'white',
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