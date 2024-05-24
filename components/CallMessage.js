import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';

const CallMessage = ({ currentMessage, isSender, nameUser, receiverName, joinCall }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{
                borderRadius: 5, paddingBottom: 5, paddingTop: 10, paddingHorizontal: 10,
                backgroundColor: !isSender ? 'white' : '#D5F1FF',
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                borderBottomLeftRadius: !isSender ? 0 : 20,
                borderBottomRightRadius: !isSender ? 20 : 0,
                width: 270
            }}>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                    {currentMessage.call.startsWith('Cuộc gọi') ?  // cuộc gọi video/thoại từ...
                        <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                            {currentMessage.call.includes('video') ?
                                <Entypo name="video-camera" size={35} color="black" /> 
                                : <MaterialIcons name="call" size={35} color="black" />}
                            <Text style={{ color: 'black', width: 210, marginLeft: 10 }}>{currentMessage.call}
                                <Text style={{ fontWeight: isSender ? 'normal' : 'bold' }}> {isSender ? 'bạn' : receiverName}</Text>
                            </Text>
                        </View>
                        : currentMessage.call.startsWith('đã kết thúc cuộc gọi.')? 
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Entypo name="video-camera" size={35} color="black" />
                            <Text style={{ color: 'black', width: 200, marginLeft: 10 }}>Cuộc gọi đã kết thúc</Text>
                        </View>
                        : currentMessage.call.startsWith('Bắt đầu cuộc gọi nhóm')? 
                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5 }}>
                                <Entypo name="video-camera" size={35} color="black" />
                                <Text style={{ color: 'black', marginLeft: 5 }}>Cuộc gọi nhóm</Text>
                            </View>
                            <TouchableOpacity style={{ backgroundColor: 'green', padding: 5, borderRadius: 10 }}
                                onPress={() => joinCall()}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Tham gia</Text>
                            </TouchableOpacity>
                        </View>
                        : // bị nhỡ cuộc gọi video/thoại từ...
                        isSender ?
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                {currentMessage.call.includes('video') ?
                                    <Entypo name="video-camera" size={35} color="red" />
                                    : <MaterialIcons name="call" size={35} color="red" />}
                                <Text style={{ color: 'red', fontWeight: 'bold', width: 210, marginLeft: 10 }}>{receiverName}<Text style={{ fontWeight: 'normal' }}> {currentMessage.call}bạn</Text></Text>
                            </View>
                        : 
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                {currentMessage.call.includes('video') ?
                                    <Entypo name="video-camera" size={35} color="red" />
                                    : <MaterialIcons name="call" size={35} color="red" />}
                                <Text style={{ color: 'red', width: 210, marginLeft: 10 }}>Bạn {currentMessage.call}
                                    <Text style={{ fontWeight: 'bold' }}>{nameUser}</Text>
                                </Text>
                            </View>
                    }
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