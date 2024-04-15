import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import PhoneInput from "react-native-phone-input";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import 'react-native-get-random-values';
import QRCode from 'react-native-qrcode-svg';

const AddFriend = ({ onPress }) => {
    // const [data, setData] = useState();
    const { width, height } = Dimensions.get('window');
    const [text, setText] = useState('');
    const [error, setError] = useState("Không tìm thấy số điện thoại.");
    const phoneInput = useRef(null);
    const [phone, setPhone] = useState('');
    const id = useSelector(state => state.account.id);
    const qrContent = id;
    let receiverId = useRef('');

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
                receiverId.current = accountRes.data.id;
                setPhone(accountRes.data.phone);
                // setData(accountRes.data);
                setError(null);
            } else {
                // setData([]);
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
                id: id,
                receiverId: receiverId.current
            };
            onPress(request);
            // stompClient.send("/app/request-add-friend", {}, JSON.stringify(request));
            Alert.alert('Kết bạn', 'Yêu cầu kết bạn đã được gửi.');
            // navigation.navigate("Contact")
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    return (
        <View>
            {/* {Platform.OS == "android" && <View style={{ height: 30 }} />} */}
            <View style={{ backgroundColor: '#1fadea', height: 50 }}>
                <Text style={{
                    fontSize: 20,
                    textAlign: 'center',
                    margin: 10,
                    color: '#fdf8f8'
                }}>KẾT BẠN</Text>
            </View>
            <View style={{ alignItems: 'center'}}>
                <Text style={{ fontSize: 20, marginVertical: 10}}>Mã QR của bạn:</Text>
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
                    marginVertical: 10
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
            <View style={{ height: height*0.8 - 380 }}>
                {error ? (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 16, color: 'red' }}>{error}</Text>
                    </View>
                ) :
                // data && data.length > 0 ? (
                    // <FlatList
                        // data={data}
                        // keyExtractor={(item) => `${item.id}_${item.phone}`}
                        // renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                <Text style={{ flex: 1, fontSize: 20 }}>{phone}</Text>
                                <TouchableOpacity style={styles.buttonAdd} onPress={handleAddFriend}>
                                    <Text style={styles.buttonText}>KẾT BẠN</Text>
                                </TouchableOpacity>
                            </View>
                        // )}
                    // />
                // ) : (
                //     <View style={{ alignItems: 'center', marginTop: 20 }}>
                //         <Text style={{ fontSize: 16, color: 'red' }}>
                //             {text.trim() !== '' ? 'Không tìm thấy số điện thoại.' : 'Vui lòng nhập số điện thoại.'}
                //         </Text>
                //     </View>
                // )
                }
            </View>
        </View>
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
