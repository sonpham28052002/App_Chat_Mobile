import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import 'react-native-get-random-values';
const { v4: uuidv4 } = require('uuid');
import { useSelector, useDispatch } from 'react-redux';

const FriendRequests = () => {
    const [uniqueFriendRequests, setUniqueFriendRequests] = useState({});
    const [receivedFriendRequests, setReceivedFriendRequests] = useState([]);
    const [currentUser, setCurrentUser] = useState(useSelector(state => state.account));
    const stompClient = useRef(null);

    useEffect(() => {
        const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
        stompClient.current = over(socket);
        stompClient.current.connect(
            {},
            () => {
                console.log("Connected to WebSocket");
                stompClient.current.subscribe(`/user/${currentUser.id}/requestAddFriend`, (message) => {
                    const newRequest = JSON.parse(message.body);
                    setUniqueFriendRequests(prevRequests => {
                        const senderId = newRequest.sender.id;
                        if (!prevRequests[senderId]) {
                            return {...prevRequests, [senderId]: newRequest};
                        }
                        return prevRequests;
                    });
                    console.log('New friend request:', newRequest);
                });

            },
            (error) => {
                console.error('Error connecting to WebSocket server:', error);
            }
        );

        fetchFriendRequests();

    }, []);

    const fetchFriendRequests = () => {
        axios.get(`https://deploybackend-production.up.railway.app/users/getFriendRequestListByOwnerId?owner=${currentUser.id}`)
            .then(response => {
                const requests = response.data.reduce((acc, request) => {
                    const senderId = request.sender.id;
                    if (!acc[senderId]) {
                        acc[senderId] = request;
                    }
                    return acc;
                }, {});
                setUniqueFriendRequests(requests);
                setReceivedFriendRequests(response.data);
            })
            .catch(error => {
                console.error('Error fetching friend requests:', error);
            });
    };

const handleAcceptRequest = (item) => {
    stompClient.current.send(`/app/accept-friend-request`, {}, JSON.stringify({item}));
    stompClient.current.subscribe(`/user/${currentUser.id}/acceptAddFriend`, (message) => {
        const acceptedRequest = JSON.parse(message.body);
        console.log('Accepted request:', acceptedRequest);
        const requestId = acceptedRequest.id;
        setUniqueFriendRequests(prevRequests => {
            const updatedRequests = { ...prevRequests };
            delete updatedRequests[requestId];
            return updatedRequests;
        });

        setReceivedFriendRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));

        console.log('Friend request accepted:', acceptedRequest);
    });
};


    const handleRejectRequest = (requestId) => {
        console.log(`Rejecting request ${requestId}`);
    };

    return (
        <SafeAreaView>
            <Text style={styles.heading}>Danh sách yêu cầu kết bạn</Text>
            <FlatList
                data={Object.values(uniqueFriendRequests)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    let isCurrentUserSender = item.sender.id === currentUser.id;
                    let isCurrentUserReceiver = item.receiver.id === currentUser.id;

                    return (
                        <View style={styles.friendRequestContainer}>
                            {isCurrentUserSender ? (
                                <>
                                    <Image source={{ uri: item.receiver.avt }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                    <Text>Đã gửi yêu cầu đến {item.receiver.userName}</Text>
                                    <TouchableOpacity style={styles.buttonReject} onPress={() => handleRejectRequest(item.id)}>
                                        <Text style={styles.buttonText}>Hủy</Text>
                                    </TouchableOpacity>
                                </>
                            ) : isCurrentUserReceiver ? (
                                <>
                                    <Image source={{ uri: item.sender.avt }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                    <Text>{item.sender.userName} muốn kết bạn</Text>
                                    <TouchableOpacity style={styles.buttonAccept} onPress={() => handleAcceptRequest(item)}>
                                        <Text style={styles.buttonText}>Chấp nhận</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonReject} onPress={() => handleRejectRequest(item.id)}>
                                        <Text style={styles.buttonText}>Từ chối</Text>
                                    </TouchableOpacity>
                                </>
                            ) : null}
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
        borderRadius: 5,
    },
    buttonReject: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default FriendRequests;
