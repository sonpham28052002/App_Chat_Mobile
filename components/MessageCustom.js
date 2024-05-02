import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'

const MessageCustom = ({ currentMessage, isSender, onLongPress }) => {
    const { width } = Dimensions.get('window')

    const calcWidthMessage = (message, size) => {
        const length = message.length * size
        if(length < 60) return 80
        if (length < width - 130) return length + 20
        return width - 150
    }

    return (
        <View style={{
            borderRadius: 5, paddingBottom: 5, paddingTop: 10, paddingHorizontal: 10,
            backgroundColor: !isSender ? 'white' : '#D5F1FF',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            borderBottomLeftRadius: !isSender ? 0 : 20,
            borderBottomRightRadius: !isSender ? 20 : 0,
            width: currentMessage.replyMessage?
                calcWidthMessage(currentMessage.replyMessage.content, 9) > calcWidthMessage(currentMessage.replyMessage.userName, 9)?
                    calcWidthMessage(currentMessage.text, 10) > calcWidthMessage(currentMessage.replyMessage.content, 9)? calcWidthMessage(currentMessage.text, 10) : calcWidthMessage(currentMessage.replyMessage.content, 9)
                : calcWidthMessage(currentMessage.text, 10) > calcWidthMessage(currentMessage.replyMessage.userName, 9)? calcWidthMessage(currentMessage.text, 10) : calcWidthMessage(currentMessage.replyMessage.userName, 9)
            : calcWidthMessage(currentMessage.text, 10),
        }}>
            <TouchableOpacity onLongPress={onLongPress}>
                { currentMessage.replyMessage &&
                    <TouchableOpacity style={{ borderLeftWidth: 4, borderLeftColor: '#70faf3', paddingLeft: 5}}>
                        <Text style={{ fontSize: 11, fontWeight: 700 }}>{currentMessage.replyMessage.userName}</Text>
                        <Text style={{ color: 'grey', fontSize: 11}} numberOfLines={1}>{currentMessage.replyMessage.content}</Text>
                    </TouchableOpacity>
                }
                    <Text style={{ color: 'black' }}>{currentMessage.text}</Text>
            </TouchableOpacity>
            <Text style={{
                fontSize: 11,
                color: 'grey',
                textAlign: !isSender ? 'left' : 'right'
            }}>
                {new Date(currentMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
            </Text>
        </View>
    )
}

export default MessageCustom