import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Image, Platform, Dimensions } from 'react-native';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import 'react-native-get-random-values';
const { v4: uuidv4 } = require('uuid');
import { addToFriendList, save } from '../../../Redux/slice';
import { useSelector, useDispatch } from 'react-redux';

const FriendRequests = () => {
    // const [uniqueFriendRequests, setUniqueFriendRequests] = useState({});
    // const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);
    const { width, height } = Dimensions.get('window');
    const [data, setData] = useState([]);
    const currentUser = useSelector(state => state.account);
    const stompClient = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
        stompClient.current = over(socket);
        stompClient.current.connect({},onConnected,(error) => { console.error('Error connecting to WebSocket server:', error); }
        );

        fetchFriendRequests();

    }, []);

    const onConnected = () => {
        stompClient.current.subscribe(`/user/${currentUser.id}/declineAddFriend`, (payload) => {
            // const message = JSON.parse(payload.body);
            // let newData = data.filter(item => item.sender.id !== message.sender.id && item.receiver.id !== message.receiver.id);
            // console.log('New data:', newData);
            // setData(newData);
            fetchFriendRequests()
        })
        stompClient.current.subscribe(`/user/${currentUser.id}/acceptAddFriend`, (payload) => {
            // const message = JSON.parse(payload.body);
            // let newData = data.filter(item => item.sender.id !== message.sender.id && item.receiver.id !== message.receiver.id);
            // console.log('New data:', newData);
            // setData(newData);
            fetchFriendRequests()
            loadUser()
        })
    }

    const loadUser = async () => {
        let result = await axios.get(`https://deploybackend-production.up.railway.app/account/getAccountById?id=${currentUser.id}`);
        try {
            if (result.data) {
              dispatch(save(result.data));
            }
          } catch (error) {
            console.log(error);
          }
    }

    const fetchFriendRequests = () => {
        axios.get(`https://deploybackend-production.up.railway.app/users/getFriendRequestListByOwnerId?owner=${currentUser.id}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching friend requests:', error);
            });
    };

const handleAcceptRequest = (senderId, receiverId) => {
    stompClient.current.send(`/app/accept-friend-request`, {}, JSON.stringify({
        sender: { id: senderId },
        receiver: { id: receiverId }
    }));

    // stompClient.current.subscribe(`/user/${currentUser.id}/acceptAddFriend`, (message) => {
    //     const acceptedRequest = JSON.parse(message.body);
    //     console.log('Accepted request:', acceptedRequest);
    //     const requestId = acceptedRequest.id;
    //     setUniqueFriendRequests(prevRequests => {
    //         const updatedRequests = { ...prevRequests };
    //         delete updatedRequests[requestId];
    //         return updatedRequests;
    //     });

    //     // setReceivedFriendRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));

    //     console.log('Friend request accepted:', acceptedRequest);
    // });
};


    const handleRejectRequest = (senderId, receiverId) => {
        stompClient.current.send(`/app/decline-friend-request`, {}, JSON.stringify(
            { sender:{id: senderId}, receiver:{id: receiverId} }));
    };

    return (
        <SafeAreaView>
            {Platform.OS == "android" && <View style={{ height: 30 }} />}
            <Text style={styles.heading}>Danh sách yêu cầu kết bạn</Text>
            <FlatList
                data={data}
                keyExtractor={(item) => item.sendDate}
                renderItem={({ item }) => {
                    // let isCurrentUserSender = item.sender.id === currentUser.id;
                    // let isCurrentUserReceiver = item.receiver.id === currentUser.id;
                    return (
                        <View style={styles.friendRequestContainer}>
                            { item.sender.id == currentUser.id ? (
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={{ uri: item.receiver.avt }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                    <Text style={{ fontSize: 20, width: width - 170, marginHorizontal: 10 }}>
                                        Đã gửi yêu cầu đến <Text style={{ fontWeight: 'bold', color: 'blue'}}>
                                            {item.receiver.userName}
                                            </Text></Text>
                                    <TouchableOpacity style={styles.buttonReject} onPress={() => handleRejectRequest(item.sender.id, item.receiver.id)}>
                                        <Text style={styles.buttonText}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={{ uri: item.sender.avt }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                    <Text style={{ fontWeight: 'bold', color: 'blue', fontSize: 20, width: width - 170, marginHorizontal: 10 }}>
                                        {item.sender.userName} <Text style={{ fontWeight: 'normal', color: 'black'}}>muốn kết bạn</Text></Text>
                                    <View>
                                    <TouchableOpacity style={styles.buttonAccept} onPress={() => handleAcceptRequest(item.sender.id, item.receiver.id)}>
                                        <Text style={styles.buttonText}>OK</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonReject} onPress={() => handleRejectRequest(item.sender.id, item.receiver.id)}>
                                        <Text style={styles.buttonText}>Từ chối</Text>
                                    </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    friendRequestContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttonAccept: {
        backgroundColor: 'green',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonReject: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default FriendRequests;
