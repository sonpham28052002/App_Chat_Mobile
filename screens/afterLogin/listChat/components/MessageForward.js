import { View, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CheckBox } from '@rneui/themed';
import { TextInput, Modal } from 'react-native-paper'

const MessageForward = ({ visible, onDismiss, senderId, onSend }) => {

    const [data, setData] = useState([])
    const { width, height } = Dimensions.get('window')

    useEffect(() => {
        getUsersInConversation()
    }, [])

    const getUsersInConversation = async () => {
        const res = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${senderId}`)
        try {
            if (res.data) {
                let dataConversation = res.data.conversation
                    .filter(item => item.hasOwnProperty('user'))
                    .map(item => item.user);
                let set = new Set(dataConversation.map(item => item.id))
                let dataFriend = res.data.friendList
                    .filter(item => !set.has(item.user.id))
                    .map(item => item.user)
                setData([...dataConversation, ...dataFriend].map(item => ({ ...item, checked: false })))
            }
        } catch (error) {
            console.log(error)
        }
        return res.data
    }

    return (
        <Modal visible={visible} onDismiss={onDismiss}
            contentContainerStyle={{
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: width * 0.05,
                height: height * 0.7,
                width: width * 0.9
            }}>
            <View style={{ height: 130, paddingVertical: 10, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 25 }}>Chuyển tiếp tin nhắn</Text>
                <TextInput style={{ fontSize: 20, backgroundColor: 'white' }} placeholder="Nhập tên người nhận" />
            </View>
            <View style={{ height: height * 0.7 - 180 }}>
                <FlatList data={data}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                            <CheckBox
                                checked={item.checked}
                                onPress={() => {
                                    setData(data.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i))
                                }}
                            />
                            <Image source={{ uri: item.avt }} style={{ width: 50, height: 50 }} />
                            <Text style={{ fontSize: 20, marginHorizontal: 10 }}>{item.userName}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <TouchableOpacity style={{
                backgroundColor: 'cyan',
                height: 50,
                width: width * 0.6,
                borderRadius: 20,
                marginBottom: 5,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            onPress={() => {
                onSend(data)
            }}
            ><Text style={{ fontSize: 25 }}>Gửi</Text></TouchableOpacity>
        </Modal>
    )
}

export default MessageForward