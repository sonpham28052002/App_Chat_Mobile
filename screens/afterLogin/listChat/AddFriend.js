import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, Platform, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import PhoneInput from "react-native-phone-input";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { save } from "../../../Redux/slice";
import 'react-native-get-random-values';
const { v4: uuidv4 } = require('uuid');
import QRCode from 'react-native-qrcode-svg';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
const stompClient = over(socket);

const AddFriend = ({ route, navigation }) => {
    const [data, setData] = useState([]);
    const [text, setText] = useState('');
    const [error, setError] = useState(null);
    const phoneInput = useRef(null);
    const [currentUser, setCurrentUser] = useState(useSelector(state => state.account));
    const qrContent = currentUser.id;
    const [newUser, setNewUser] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (route.params && route.params.phoneNumber) {
            setText(route.params.phoneNumber);
        }
    }, [route.params]);

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

    const handleAddFriend = async () => {
        try {
            const request = {
                id: currentUser.id,
                userName: currentUser.userName,
                avt: currentUser.avt,
                receiverId: newUser.id,
            };
            stompClient.send("/app/request-add-friend", {}, JSON.stringify(request));
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    useEffect(() => {
        stompClient.connect(
            {},
            () => {
                console.log("Running");
                stompClient.subscribe("/user/" + currentUser.id + "/requestAddFriend", (message) => {
                    let mess = JSON.parse(message.body);
                    if (mess.sender.id === currentUser.id) {
                        // Xử lý phản hồi ở đây, ví dụ: hiển thị thông báo thành công
                        console.log("Friend request sent successfully");
                    }
                });
            },
            (error) => {
                console.error('Error connecting to WebSocket server:', error);
            }
        );
    }, []);

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
                }}>KẾT BẠN</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                <Text style={{ fontSize: 20, marginBottom: 10 }}>Mã QR của bạn:</Text>
                <QRCode
                    value={qrContent}
                    size={200}
                />
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
                                <TouchableOpacity style={styles.buttonAdd} onPress={handleAddFriend}>
                                    <Text style={styles.buttonText}>KẾT BẠN</Text>
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

export default AddFriend;
