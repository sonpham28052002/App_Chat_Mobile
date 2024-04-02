import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions, Animated, TouchableOpacity, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { TextInput } from 'react-native-paper';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import ImagePickerComponent from '../../../components/ImagePickerComponent'; // Import ImagePickerComponent

const Chat = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [uriImage, setUriImage] = useState(null);
    const textInputRef = useRef(null);
    const stompClient = useRef(null);
    const [position, setPosition] = useState({ start: 0, end: 0 });
    const [mess, setMess] = useState('');
    const [colorEmoji, setColorEmoji] = useState('black');
    const { width, height } = Dimensions.get('window');
    const animate = useRef(new Animated.Value(height - 90)).current;

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{
                    width: 160,
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    justifyContent: 'space-between',
                }}>
                    <Entypo name="device-camera-video" size={35} color="white" />
                    <Entypo name="search" size={35} color="white" />
                    <TouchableOpacity style={{ width: 35 }}
                        onPress={() => navigation.navigate('OptionChat')}>
                        <Entypo name="list-unordered" size={35} color="white" />
                    </TouchableOpacity>
                </View>
            )
        });

        setMessages([
            {
                _id: 1,
                text: 'Cường nè chào nhe!!',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ]);

        const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, onConnected, onError); 
    }, []);

    function onConnected() {
        stompClient.current.subscribe('/topic/public', onMessageReceived);
        stompClient.current.send('/app/chat.addUser', {},
            JSON.stringify({ sender: 'son' }));
    }

    function onMessageReceived(payload) {
        const message = JSON.parse(payload.body);
        console.log(message);
    }

    function onError(error) {
        console.log('Could not connect to WebSocket server. Please refresh and try again!');
    }

    function sendMessage(content) {
        if (content && stompClient.current) {
            const chatMessage = {
                sender: 'Phong',
                content: content,
                isSeen: false,
                receiver: 'Toan',
                sendDate: new Date()
            };
            stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        }
    }

    const handleSend = () => {
        if (mess.trim() === '' && !uriImage) {
            Alert.alert("Chưa gửi tin nhắn hoặc chọn ảnh"); 
        } else {
            if (mess.trim() !== '') {
                const newMessage = {
                    _id: Math.random().toString(), // Generate unique ID for the message
                    text: mess.trim(),
                    createdAt: new Date(),
                    user: {
                        _id: 1,
                    },
                };
                sendMessage(mess.trim());
                setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
                setMess(''); // Clear the TextInput value after sending
            } else if (uriImage) {
                handleSendImage();
                setUriImage(null);
            }
        }
    };

    const handleImageSelect = (uri) => {
        setUriImage(uri);
    };

    const handleSendImage = () => {
        const newMessage = {
            _id: Math.random().toString(),
            image: uriImage,
            createdAt: new Date(),
            user: {
                _id: 1,
            },
        };
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
    };

    const handleFocusText = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    return (
        <View style={{ width: width, flex: 1, height: height, justifyContent: 'space-between' }}>
            <Animated.View style={{ height: animate, backgroundColor: 'lightgray', marginBottom: 25 }}>
                <GiftedChat
                    renderInputToolbar={(props) =>
                        <View style={{ flexDirection: 'row', width: width, backgroundColor: 'white', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 10, width: width - 45, height: 80, justifyContent: 'space-between', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (extend) {
                                            Animated.timing(animate, {
                                                toValue: height * 0.5,
                                                duration: 500,
                                            }).start();
                                            setExtend(false);
                                            setColorEmoji('cyan');
                                        } else {
                                            Animated.timing(animate, {
                                                toValue: height - 200,
                                                duration: 500,
                                            }).start();
                                            setExtend(true);
                                            setColorEmoji('black');
                                        }
                                        handleFocusText();
                                    }}
                                >
                                    <Entypo name="emoji-happy" size={35} color={colorEmoji} />
                                </TouchableOpacity>
                                <View style={{ marginHorizontal: 10, width: width - 200 }}>
                                    <TextInput placeholder="Tin nhắn" style={{ backgroundColor: 'white', fontSize: 20, width: '100%' }}
                                        value={mess}
                                        onChangeText={text => {
                                            setMess(text);
                                        }}
                                        selection={position}
                                        ref={textInputRef}
                                        onSelectionChange={event => setPosition(event.nativeEvent.selection)}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', width: 85, justifyContent: 'space-between' }}>
                                    <Entypo name="dots-three-horizontal" size={35} color="black" />
                                    <ImagePickerComponent onSelectImage={handleImageSelect} />
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={handleSend}
                                style={{ width: 45, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}
                            >
                                <MaterialIcons name="send" size={35} color="cyan" />
                            </TouchableOpacity>
                        </View>
                    }
                    messages={messages}
                    onSend={handleSend}
                    user={{ _id: 1 }}
                />
            </Animated.View>

            <View style={{ height: height * 0.5 }}>
                <EmojiSelector
                    style={{ width: width }}
                    category={Categories.symbols}
                    onEmojiSelected={emoji => {
                        if (mess !== '')
                            setMess(mess.substring(0, position.start) + emoji + mess.substring(position.end))
                        else
                            setMess(emoji)
                    }}
                />
            </View>
        </View>
    );
}

export default Chat;
