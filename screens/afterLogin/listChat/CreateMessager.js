import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, Platform, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import PhoneInput from "react-native-phone-input";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { save } from "../../../Redux/slice";
import 'react-native-get-random-values';
const { v4: uuidv4 } = require('uuid');

const CreateMessager = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [text, setText] = useState('');
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState('');
    const phoneInput = useRef(null);
    const currentUser = useSelector(state => state.account);
    const dispatch = useDispatch();

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (text.trim() !== '') {
                searchUser();
            }
        }, 1000);
        return () => clearTimeout(timerId);
    }, [text]);

    const searchUser = async () => {
        try {
            const accountRes = await axios.get(`https://deploybackend-production.up.railway.app/account/getAccountByPhone?phone=${text}`);
            console.log(accountRes.data);
            if (accountRes.data) {
                setData([accountRes.data]);
                setError(null);
                const userId = accountRes.data.id;
                const userRes = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${userId}`);
                if (userRes.data) {
                    const newUser = {
                        id: userRes.data.id,
                        userName: userRes.data.userName,
                        avt: userRes.data.avt
                    };
                    setNewUser(newUser);
                }
            } else {
                setData([]);
                setError('Không tìm thấy số điện thoại.');
            }
        } catch (error) {
            console.log(error);
            setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
    };

 const handleAddUser = async () => {
    if (data.length > 0) {
       const existingConversation = currentUser.conversation && currentUser.conversation.find(conv => conv.user && conv.user.id === newUser.id);

        if (existingConversation) {
            setError('Người dùng đã tồn tại trong danh sách cuộc trò chuyện.');
            return;
        }
        const newConversation = {
            updateLast: new Date().toISOString(),
            conversationType: 'single',
            user: {
                id: newUser.id,
                userName: newUser.userName,
                avt: newUser.avt
            },
            lastMessage: {
                id: uuidv4(),
                sender: {
                    id: currentUser.id,
                },
                receiver:{
                    id: newUser.id
                },
                content: "Hãy nhắn tin để hiểu nhau hơn"
            }
        };
        const updatedConversations = [...currentUser.conversation, newConversation];

        const updatedUser = {
            ...currentUser,
            conversation: updatedConversations
        };

        try {
            const updateUserResponse = await axios.put('https://deploybackend-production.up.railway.app/users/updateUser', updatedUser);
            if(updateUserResponse.data) 
            console.log('thêm thành công');
        else console.log('thêm thất bại');
            dispatch(save(updatedUser));
            navigation.navigate('Chat', newUser);
        } catch (error) {
            console.log(error);
            setError('Đã xảy ra lỗi khi thêm người dùng vào cuộc trò chuyện.');
        }
    } else {
        setError('Vui lòng tìm kiếm và chọn một người dùng trước khi thêm.');
    }
}

    return (
        <SafeAreaView>
            {Platform.OS == "android" && <View style={{ height: 30 }} />}
            <View style={{ backgroundColor: '#1fadea' }}>
                <Text style={{
                    textAlign: 'center',
                    fontSize: 40,
                    textAlign: 'center',
                    margin: 10,
                    color: '#fdf8f8'
                }}>Chat together!</Text>
            </View>
            <PhoneInput
                ref={phoneInput}
                initialCountry='vn'
                onChangePhoneNumber={(text) => {
                    const formattedPhoneNumber = text.startsWith('+') ? text.slice(1) : text;
                    setText(formattedPhoneNumber);
                }}
                style={{
                    height: 50,
                    paddingLeft: 10,
                    fontSize: 20,
                    borderColor: 'black',
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderRadius: 5,
                }}
                textStyle={{
                    paddingHorizontal: 10,
                    fontSize: 20,
                    height: 40,
                    borderLeftWidth: 1,
                }}
                cancelText='Hủy'
                cancelTextStyle={{ fontSize: 20, color: 'red' }}
                confirmText='Xác nhận'
                confirmTextStyle={{ fontSize: 20, color: 'green' }}
                pickerItemStyle={{ fontSize: 20 }}
            />
            <View>
                {error ? (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 16, color: 'red' }}>{error}</Text>
                    </View>
                ) : data && data.length > 0 ? (
                    <FlatList
                        data={data}
                        keyExtractor={(item) => `${item.id}_${item.phone}`}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                <Text style={{ flex: 1, fontSize: 20 }}>{item.phone}</Text>
                                <TouchableOpacity style={styles.buttonAdd} onPress={handleAddUser}>
                                    <Text style={styles.buttonText}>THÊM</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                ) : (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 16, color: 'red' }}>
                            {text.trim() !== '' ? 'Không tìm thấy số điện thoại.' : 'Vui lòng nhập số điện thoại.'}
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    buttonAdd: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#1faeeb",
        borderRadius: 20,
        paddingVertical: 5,
        marginBottom: 5,
        marginRight: 5,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 20,
    }
});

export default CreateMessager;
