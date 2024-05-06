import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';

const MessageCustom = ({ currentMessage, isSender, onLongPress, retrieve }) => {
    const { width } = Dimensions.get('window')

    const calcWidthMessage = (message, size) => {
        const length = message.length * size
        if (length < 65) return 85
        if (length < width - 130) return length + 20
        return width - 150
    }

    return (
        <View style={{ flexDirection: 'row', marginBottom: currentMessage.extraData.react?.length > 0 ? 10 : 0 }}>
            <TouchableOpacity style={{
                borderRadius: 5, paddingBottom: 5, paddingTop: 10, paddingHorizontal: 10,
                backgroundColor: !retrieve ? !isSender ? 'white' : '#D5F1FF' : 'white',
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                borderBottomLeftRadius: !isSender ? 0 : 20,
                borderBottomRightRadius: !isSender ? 20 : 0,
                width: retrieve ? 200 : currentMessage.replyMessage ?
                    calcWidthMessage(currentMessage.replyMessage.content, 9) > calcWidthMessage(currentMessage.replyMessage.userName, 9) ?
                        calcWidthMessage(currentMessage.text, 11) > calcWidthMessage(currentMessage.replyMessage.content, 9) ? calcWidthMessage(currentMessage.text, 11) : calcWidthMessage(currentMessage.replyMessage.content, 9)
                        : calcWidthMessage(currentMessage.text, 11) > calcWidthMessage(currentMessage.replyMessage.userName, 9) ? calcWidthMessage(currentMessage.text, 11) : calcWidthMessage(currentMessage.replyMessage.userName, 9)
                    : calcWidthMessage(currentMessage.text, 11)
            }} onLongPress={onLongPress}>
                {!retrieve ? <TouchableOpacity onLongPress={onLongPress}>
                    {currentMessage.replyMessage &&
                        <TouchableOpacity style={{ borderLeftWidth: 4, borderLeftColor: '#70faf3', paddingLeft: 5 }}>
                            <Text style={{ fontSize: 11, fontWeight: 700 }}>{currentMessage.replyMessage.userName}</Text>
                            <Text style={{ color: 'grey', fontSize: 11 }} numberOfLines={1}>{currentMessage.replyMessage.content}</Text>
                        </TouchableOpacity>
                    }
                    <Text style={{ color: 'black' }}>{currentMessage.text}</Text>
                </TouchableOpacity>
                    : <Text style={{ color: 'grey' }}>Tin nhắn đã bị thu hồi</Text>}
                <Text style={{
                    fontSize: 11,
                    color: 'grey',
                    textAlign: !isSender ? 'left' : 'right'
                }}>
                    {currentMessage.createdAt ? new Date(currentMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : 'Sending...'}
                </Text>
                {currentMessage.extraData.react.length > 0 &&
                    <TouchableOpacity style={{
                        borderRadius: 10, flexDirection: 'row', paddingLeft: 2, paddingRight: 5, borderWidth: 1, borderColor: 'grey', backgroundColor: 'white',
                        position: 'absolute', bottom: -10, left: 20
                    }}>
                        {
                            [...new Set(currentMessage.extraData.react.map(item => item.react))].slice(0, 3).map((react, index) => <Text key={index} style={{ fontSize: 9 }}>{
                                react == "HAPPY" ? "😄"
                                    : react == "HEART" ? "❤️"
                                        : react == "SAD" ? "😥"
                                            : react == "ANGRY" ? "😡"
                                                : react == "LIKE" ? "👍"
                                                    : null
                            }</Text>)
                        }
                        <Text style={{ fontSize: 9, marginLeft: 1 }}>{currentMessage.extraData.react.length < 100 ? currentMessage.extraData.react.length : "99+"}</Text>
                    </TouchableOpacity>
                }
            </TouchableOpacity>
            {isSender && <FontAwesome name={currentMessage.pending ? "circle-o" : "check-circle"} size={15} style={{ alignSelf: 'flex-end', marginLeft: 5 }} color="blue" />}
        </View>
    )
}

export default MessageCustom