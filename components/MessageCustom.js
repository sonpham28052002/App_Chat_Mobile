import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState} from 'react'

const MessageCustom = ({ currentMessage, isSender, onLongPress }) => {
    const { width } = Dimensions.get('window')

    const calcWidthMessage = () => {
        const length = currentMessage.text.length * 10
        if(length < 55) return 75
        if (length < width - 130) return length + 20
        return width - 150
    }

    return (
        <View style={{
            borderRadius: 5, paddingVertical: 10, paddingHorizontal: 10,
            marginLeft: !isSender ? 0 : width - 252,
            backgroundColor: !isSender ? 'white' : '#1E90FF',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            borderBottomLeftRadius: !isSender ? 0 : 20,
            borderBottomRightRadius: !isSender ? 20 : 0,
            width: calcWidthMessage()
        }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center'}}
                onLongPress={onLongPress}
            >
                <Text style={{ color: !isSender ? 'black' : 'white' }}>{currentMessage.text}</Text>
            </TouchableOpacity>
            <Text style={{
                fontSize: 11,
                color: !isSender ? 'grey' : 'white',
                textAlign: !isSender ? 'left' : 'right'
            }}>
                {new Date(currentMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
            </Text>
        </View>
    )
}

export default MessageCustom