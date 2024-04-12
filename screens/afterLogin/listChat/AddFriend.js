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
const AddFriend = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [text, setText] = useState('');
    const [error, setError] = useState(null);
    const phoneInput = useRef(null);
    // const currentUser = useSelector(state => state.account);
    const [currentUser, setCurrentUser] = useState(useSelector(state => state.account));
    const qrContent = currentUser.id;
     const [newUser, setNewUser] = useState('');
    const dispatch = useDispatch();
  const [test, setTest] = useState(true);
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
                console.log(userId);
                const userRes = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${userId}`);
                console.log(userRes.data);
                if (userRes.data) {
                    const newUser = {
                        id: userRes.data.id,
                        userName: userRes.data.userName,
                        avt: userRes.data.avt
                    };
                    console.log("newUser", newUser);
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
    if (test) {
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

            // Tạo danh sách bạn mới
            const newFriendList = [
                ...currentUser.friendList,
                {
                    user: {
                        id: newUser.id,
                        userName: newUser.userName,
                        avt: newUser.avt,
                    },
                    tag: "",
                    nickName: ""
                }
            ];
            const updatedCurrentUser = {
                ...currentUser,
                friendList: newFriendList
            };
        console.log("updatedCurrentUser", updatedCurrentUser);
            const updateUserResponse = await axios.put('https://deploybackend-production.up.railway.app/users/updateUser', updatedCurrentUser);
            if (updateUserResponse.data) {
                console.log(updateUserResponse.data);
                dispatch(save(updatedCurrentUser));
                console.log('Kết bạn thành công');
                setCurrentUser(updatedCurrentUser);
                // navigation.navigate("Contact")
            }
        } catch (error) {
            console.log(error);
            setError('Đã xảy ra lỗi khi thêm người dùng vào danh sách bạn bè.');
        }
    } else {
        setError('Không thể kết bạn với người dùng này.');
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
                }}>KẾT BẠN</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 20 ,marginBottom:20}}>
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
