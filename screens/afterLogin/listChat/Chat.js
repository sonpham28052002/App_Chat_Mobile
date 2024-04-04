import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { TextInput, Modal, Portal, PaperProvider } from 'react-native-paper';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
// import EmojiSelector, { Categories } from "react-native-emoji-selector";
import EmojiPicker from 'rn-emoji-keyboard'
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { save } from '../../../Redux/slice';
import axios from 'axios';
import ImagePickerComponent from '../../../components/ImagePickerComponent'; // Import ImagePickerComponent
import 'react-native-get-random-values';
const { v4: uuidv4 } = require('uuid');
const Chat = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const sender = useSelector((state) => state.account);
    const [messages, setMessages] = useState([])
    var stompClient = useRef(null);
    const [uriImage, setUriImage] = useState(null);
    const textInputRef = useRef(null);
    const [position, setPosition] = useState({ start: 0, end: 0 });
    const [mess, setMess] = useState('');
    const [colorEmoji, setColorEmoji] = useState('black');
    const { width, height } = Dimensions.get('window');
    // const animate = useRef(new Animated.Value(height - 50)).current;
    // const [extend, setExtend] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: route.params.userName,
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

        loadMessage();
    }, []);


    const updateMess = async () => {
        const result = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${sender.id}`)
        try {
            if (result.data) {
                dispatch(save(result.data));
            }
        } catch (error) {
            console.log(error);
        }
    }
    const loadMessage = async () => {

        const response = await axios.get(`https://deploybackend-production.up.railway.app/users/getMessageByIdSenderAndIsReceiver?idSender=${sender.id}&idReceiver=${route.params.id}`);
        const messages = response.data.slice(-20).map(message => {
            let date = new Date(message.senderDate);
            return {
                _id: message.id,
                text: message.content,
                createdAt: date.setUTCHours(date.getUTCHours() + 7),
                user: {
                    _id: message.sender.id,
                    name: message.sender.id == sender.id ? sender.userName : route.params.userName,
                    avatar: message.sender.id == sender.id ? sender.avt : route.params.avt,
                }
            }
        });
        messages.forEach(function (newMessage) {
            setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
        });
    }

    function onConnected() {
        stompClient.current.subscribe('/user/' + sender.id + '/singleChat', onMessageReceived)
    }

    function onMessageReceived(payload) {
        const message = JSON.parse(payload.body);
        updateMess();
        if (message.sender.id === sender.id || message.sender.id !== route.params.id) return;
        let date = new Date(message.senderDate);
        const newMessage = {
            _id: message.id,
            createdAt: date.setUTCHours(date.getUTCHours() + 7),
            user: {
                _id: route.params.id,
                name: route.params.userName,
                avatar: route.params.avt,
            }
        };
        if (message.content)
            newMessage.text = message.content;
        else {
            newMessage.image = message.url;
        }
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
    }

    function onError(error) {
        console.log('Could not connect to WebSocket server. Please refresh and try again!');
    }

    function sendMessage(id, type) {
        if (stompClient.current) {
            var chatMessage = {
                id: id,
                messageType: type,
                sender: { id: sender.id },
                receiver: { id: route.params.id },
            };
            if (mess && type === 'Text')
                chatMessage.content = mess;
            else {
                const titleFile = uriImage.substring(uriImage.lastIndexOf("/") + 1);
                chatMessage.size = 10;
                chatMessage.titleFile = titleFile;
                chatMessage.url = uriImage;
                console.log("chatMes", chatMessage);
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
        const fileType = uriImage.substring(uriImage.lastIndexOf(".") + 1);
        sendMessage(id, fileType)
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
    };

    const handleFocusText = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    return (
        <View style={{ width: width, flex: 1, height: height - 80, justifyContent: 'space-between' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}
                keyboardVerticalOffset={50}
                behavior={Platform.OS == "ios" ? "padding" : undefined}
            >
                <PaperProvider>
                    <Portal>
                        <Modal visible={visible} onDismiss={hideModal}
                            contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20 }}
                        >
                            <Text>Example Modal.  Click outside this area to dismiss.</Text>
                        </Modal>
                    </Portal>
                    <View style={{ height: height - 80, backgroundColor: 'lightgray', marginBottom: 25 }}>
                        <GiftedChat
                            renderInputToolbar={(props) =>
                                <View style={{ flexDirection: 'row', width: width, backgroundColor: 'white', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 10, width: width - 45, height: 80, justifyContent: 'space-between', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowEmoji(!showEmoji);
                                                handleFocusText();
                                            }}
                                        >
                                            <Entypo name="emoji-happy" size={35} color={colorEmoji} />
                                        </TouchableOpacity>
                                        <View style={{ marginHorizontal: 10, width: width - 200 }}>
                                            <TextInput placeholder="Tin nhắn" 
                                                style={{ backgroundColor: 'white', 
                                                fontSize: 20, 
                                                width: '100%'
                                             }}
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
                            onLongPress={(context, message) => {
                                showModal();
                            }}
                        />
                    </View>
                </PaperProvider>
            </KeyboardAvoidingView>
            {showEmoji &&
                <EmojiPicker onEmojiSelected={emoji => {
                    if (mess !== '')
                        setMess(mess.substring(0, position.start) + emoji.emoji + mess.substring(position.end))
                    else
                        setMess(emoji.emoji)
                }}
                    open={showEmoji} onClose={() => setShowEmoji(false)}
                />}
        </View>
    );
}

export default Chat;
