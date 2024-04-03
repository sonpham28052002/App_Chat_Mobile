import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions, Animated, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { TextInput } from 'react-native-paper';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
// import EmojiSelector, { Categories } from "react-native-emoji-selector";
import EmojiPicker from 'rn-emoji-keyboard'
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useSelector } from 'react-redux';
import ImagePickerComponent from '../../../components/ImagePickerComponent'; // Import ImagePickerComponent
import 'react-native-get-random-values';
const { v4: uuidv4 } = require('uuid');
const Chat = ({ navigation, route }) => {
    console.log('Receive:', route.params);
    const sender = useSelector((state) => state.account);
    const [messages, setMessages] = useState([])
    var stompClient = useRef(null);
    const [uriImage, setUriImage] = useState(null);
    const textInputRef = useRef(null);
    const [position, setPosition] = useState({ start: 0, end: 0 });
    const [mess, setMess] = useState('');
    const [colorEmoji, setColorEmoji] = useState('black');
    const { width, height } = Dimensions.get('window');
    const animate = useRef(new Animated.Value(height - 50)).current;
    // const [extend, setExtend] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{
                    width: 120,
                    height: 50,
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Entypo name="device-camera-video" size={35} color="white" /> */}
                    <FontAwesome name="search" size={35} color="white" />
                    <TouchableOpacity style={{ width: 35 }}
                        onPress={() => navigation.navigate('OptionChat')}>
                        <Entypo name="menu" size={40} color="white" />
                    </TouchableOpacity>
                </View>
            )
        });

        const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, onConnected, onError); 
    }, []);

    function onConnected() {
        stompClient.current.subscribe('/user/'+sender.id+'/singleChat', onMessageReceived)
    }

    function onMessageReceived(payload) {
        const message = JSON.parse(payload.body);
        console.log(message);
        if(message.sender.id === sender.id) return;
        const newMessage = {
            _id: message.id,
            createdAt: message.senderDate,
            user: {
                _id: route.params,
                name: sender.userName,
                avatar: sender.avt,
            }
        };
        if(message.content)
            newMessage.text = message.content;
        else{
            newMessage.image = message.url;
        }
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
    }

    function onError(error) {
        console.log('Could not connect to WebSocket server. Please refresh and try again!');
    }

    function sendMessage(id, type) {
        if(stompClient.current){
            var chatMessage = {
                id: id,
                messageType: type,
                sender: {id: sender.id},
                receiver: {id: route.params},
            };
            if(mess && type === 'Text')
                chatMessage.content = mess;
            else{
                
            }
            stompClient.current.send("/app/private-single-message", {}, JSON.stringify(chatMessage));
        }
    }

    const handleSend = () => {
        if (mess.trim() === '' && !uriImage) {
            Alert.alert("Chưa gửi tin nhắn hoặc chọn ảnh"); 
        } else {
            if (mess.trim() !== '') {
                const id = uuidv4();
                const newMessage = {
                    _id: id, // Generate unique ID for the message
                    text: mess.trim(),
                    createdAt: new Date(),
                    user: {
                        _id: sender.id,
                        name: sender.userName,
                        avatar: sender.avt,
                    },
                };
                sendMessage(id, 'Text');
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
        const id = uuidv4();
        const newMessage = {
            _id: id,
            image: uriImage,
            createdAt: new Date(),
            user: {
                _id: sender.id,
                name: sender.userName,
                avatar: sender.avt,
            },
        };
        sendMessage(id, "PNG")
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
    };

    const handleFocusText = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    return (
        <View style={{ width: width, flex: 1, height: height - 80, justifyContent: 'space-between' }}>
            <KeyboardAvoidingView style={{flex: 1}}
                keyboardVerticalOffset={50}
                behavior={undefined}
            >
            <Animated.View style={{ height: height - 80, backgroundColor: 'lightgray', marginBottom: 25 }}>
                <GiftedChat
                    renderInputToolbar={(props) =>
                        <View style={{ flexDirection: 'row', width: width, backgroundColor: 'white', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', paddingHorizontal: 10, width: width - 45, height: 80, justifyContent: 'space-between', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // if (extend) {
                                        //     Animated.timing(animate, {
                                        //         toValue: height - 90,
                                        //         duration: 500,
                                        //         useNativeDriver: false
                                        //     }).start();
                                        //     setExtend(false);
                                        //     setColorEmoji('cyan');
                                        // } else {
                                        //     Animated.timing(animate, {
                                        //         toValue: height * 0.5,
                                        //         duration: 500,
                                        //         useNativeDriver: false
                                        //     }).start();
                                        //     setExtend(true);
                                        //     setColorEmoji('black');
                                        // }
                                        setShowEmoji(!showEmoji);
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
                    user={{
                        _id: sender.id,
                        name: sender.userName,
                        avatar: sender.avt
                    }}
                />
            </Animated.View>
            </KeyboardAvoidingView>
            {/* <View style={{ height: height * 0.5 }}>
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
            </View> */}
            {showEmoji && 
                <EmojiPicker onEmojiSelected={(emoji) => console.log(emoji)}
                    open={showEmoji} onClose={() => setShowEmoji(false)}
                />}
        </View>
    );
}

export default Chat;
