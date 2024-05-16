import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';

const CallMessage = ({ currentMessage, isSender, nameUser }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{
                borderRadius: 5, paddingBottom: 5, paddingTop: 10, paddingHorizontal: 10,
                backgroundColor: !isSender ? 'white' : '#D5F1FF',
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                borderBottomLeftRadius: !isSender ? 0 : 20,
                borderBottomRightRadius: !isSender ? 20 : 0,
                width: 200
            }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name="call" size={35} color="black" />
                    <Text style={{ color: 'black' }}>{currentMessage.call}<Text style={{ fontWeight: 'bold' }}>{nameUser}</Text></Text>
                </TouchableOpacity>
                <Text style={{
                    fontSize: 11,
                    color: 'grey',
                    textAlign: !isSender ? 'left' : 'right'
                }}>
                    {currentMessage.createdAt ? new Date(currentMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : 'Sending...'}
                </Text>
            </TouchableOpacity>
            {isSender && <FontAwesome name="check-circle" size={15} style={{ alignSelf: 'flex-end', marginLeft: 5 }} color="blue" />}
        </View>
    )
}

export default CallMessage