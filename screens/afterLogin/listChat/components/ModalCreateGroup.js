import { Dimensions, Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { CheckBox } from '@rneui/themed';
import { Modal, TextInput } from 'react-native-paper';
import ButtonCustom from '../../../../components/button';
import axios from 'axios';
import 'react-native-get-random-values';
const { v4: uuidv4 } = require('uuid');
import ImagePickerComponent from '../../../../components/ImagePickerComponent'
const ModalCreateGroup = ({visible, onDismiss, senderId, onPress}) => {
    const { width, height } = Dimensions.get('window')
    const [groupName, setGroupName] = useState('')
     const [avtGroup, setAvtGroupName] = useState('')
    const [data, setData] = useState([])

    useEffect(() => {
        getUsersInConversation()
    }, [])

    const getUsersInConversation = async () => {
        const res = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${senderId}`)
        try {
            if (res.data) {
                console.log('res.data', res.data);
                setData([...res.data.friendList.map(item => item.user)])
            }
        } catch (error) {
            console.log(error)
        }
        return res.data
    }
 const handleImageSelect = (uri, type, fileSize) => {
    setAvtGroupName(uri)
    };
    return (
        <Modal visible={visible} onDismiss={onDismiss}
            contentContainerStyle={{
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                width: width * 0.9,
                marginHorizontal: width * 0.05,
                padding: 10,
                height: height * 0.8
                // height: 200,
                // marginLeft: width - width * 0.4,
                // marginBottom: height * 0.5 + 150
            }}
        >
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', 
                            borderBottomWidth: 1, marginBottom: 10, paddingVertical: 10 }}>
                <Text style={{ fontSize: 25 }}>Tạo nhóm để trò chuyện cùng nhau</Text>
            </View>
            <TextInput style={{ backgroundColor: 'white', width: '100%' }} 
                placeholder='Nhập tên group' placeholderTextColor={'gray'}
                value={groupName} onChangeText={setGroupName}
            />
            <View style={{ marginVertical: 10, width: '100%',alignItems:'center'}}>
            {/* <ButtonCustom title="Chọn avatar group" backgroundColor="white" /> */}
            <TouchableOpacity style={{borderRadius:10,borderWidth:1,width:'80%',justifyContent:'center',alignItems:'center'}}>
             <ImagePickerComponent onSelectImage={handleImageSelect} buttonText="Chọn avatar group" />
            </TouchableOpacity>
            </View>
            <TextInput style={{ backgroundColor: 'white', width: '100%' }} 
                placeholder='Tìm kiếm' placeholderTextColor={'gray'}
            />
                <View style={{ height: height * 0.8 - 350 }}>
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
            <ButtonCustom title='Tạo group' backgroundColor='cyan' border={true} onPress={()=> {
                let dataSelect = data.filter(item => item.checked)
                let arr = []
                for (let i = 0; i < dataSelect.length; i++) {
                    arr.push({member: { id: dataSelect[i].id }, memberType: "MEMBER"})
                }
                arr.push({member: { id: senderId }, memberType: "GROUP_LEADER"})
                let dataSend = {
                    idGroup: uuidv4(),
                    avtGroup: avtGroup,
                    conversationType: "group",
                    nameGroup: groupName,
                    status: "READ_ONLY",
                    members: arr
                }
                onPress(dataSend)
            }}/>
        </Modal>
    )
}

export default ModalCreateGroup