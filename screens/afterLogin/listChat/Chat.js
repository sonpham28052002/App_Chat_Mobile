import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Text, Linking } from 'react-native';
import { GiftedChat, Message } from 'react-native-gifted-chat';
import { TextInput, Modal, Portal, PaperProvider } from 'react-native-paper';
import { Entypo, FontAwesome, MaterialIcons, FontAwesome6, Ionicons } from '@expo/vector-icons';
// import EmojiSelector, { Categories } from "react-native-emoji-selector";
import EmojiPicker from 'rn-emoji-keyboard'
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { save } from '../../../Redux/slice';
import axios from 'axios';
import ImagePickerComponent from '../../../components/ImagePickerComponent';
import FilePickerComponent from '../../../components/FilePickerComponent';
import 'react-native-get-random-values';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { v4: uuidv4 } = require('uuid');
const Chat = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const sender = useSelector((state) => state.account);
    const [messages, setMessages] = useState([])
    var stompClient = useRef(null);
    const [uriImage, setUriImage] = useState(null);
    const [uriFile, setUriFile] = useState(null);
    const textInputRef = useRef(null);
    const [position, setPosition] = useState({ start: 0, end: 0 });
    const [mess, setMess] = useState('');
    const [colorEmoji, setColorEmoji] = useState('black');
    const { width, height } = Dimensions.get('window');
    // const animate = useRef(new Animated.Value(height - 50)).current;
    // const [extend, setExtend] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [fileSelected, setFileSelected] = useState(false);

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

        getMessage();
    }, []);

    const [messLoad, setMessLoad] = useState([]);

    useEffect(() => {
        loadMessage();
    }, [messLoad]);

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

    const getMessage = async () => {
        const response = await axios.get(`https://deploybackend-production.up.railway.app/users/getMessageByIdSenderAndIsReceiver?idSender=${sender.id}&idReceiver=${route.params.id}`);
        const messages = response.data.slice(-20).map(message => {
            let date = new Date(message.senderDate);
            let newMess = {
                _id: message.id,
                createdAt: date.setUTCHours(date.getUTCHours() + 7),
                user: {
                    _id: message.sender.id,
                    name: message.sender.id == sender.id ? sender.userName : route.params.userName,
                    avatar: message.sender.id == sender.id ? sender.avt : route.params.avt,
                }
            }
            if(message.content)
                newMess.text = message.content
            else if(message.messageType == 'PNG' 
            || message.messageType == 'JPG' 
            || message.messageType == 'JPEG')
                newMess.image = message.url
            else if(message.messageType == 'PDF' 
            || message.messageType == 'DOC' 
            || message.messageType == 'DOCX' 
            || message.messageType == 'XLS' 
            || message.messageType == 'XLSX' 
            || message.messageType == 'PPT' 
            || message.messageType == 'PPTX'
            || message.messageType == 'RAR'
            || message.messageType == 'ZIP')
                newMess.file = message.url
            return newMess;
        });
        setMessLoad(messages);
    }
    const loadMessage = () => {
        messLoad.forEach(function (newMessage) {
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
        else if (message.url)
            newMessage.image = message.url;
        else if (message.file)
            newMessage.file = message.file;
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
    }

    function onError(error) {
        console.log('Could not connect to WebSocket server. Please refresh and try again!');
    }

    function sendMessage(id, type) {
        if (stompClient.current) {
            var chatMessage = {
                id: id,
                sender: { id: sender.id },
                receiver: { id: route.params.id }
            };
            if (mess && type === 'Text'){
                chatMessage.content = mess
                chatMessage.messageType = type
            }
            else if (type === 'Image') {
                const titleFile = uriImage.substring(uriImage.lastIndexOf("/") + 1);
                chatMessage.size = 10;
                chatMessage.messageType = getFileExtension(uriImage).toUpperCase();
                chatMessage.titleFile = titleFile;
                chatMessage.url = uriImage;
            } else if (type === 'File') {
                const titleFile = uriFile.substring(uriFile.lastIndexOf("/") + 1);
                chatMessage.size = 10;
                chatMessage.messageType = getFileExtension(uriFile).toUpperCase();
                chatMessage.titleFile = titleFile;
                chatMessage.url = uriFile;
            }
            console.log("Chat message: ", chatMessage);
            stompClient.current.send("/app/private-single-message", {}, JSON.stringify(chatMessage));
        }
    }

    const handleSend = () => {
        if (mess.trim() === '' && !uriImage && !uriFile) {
            Alert.alert("Chưa gửi tin nhắn hoặc chọn ảnh hoặc file");
        } else {
            if (mess.trim() !== '') {
                const id = uuidv4();
                const newMessage = {
                    _id: id,
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
            } else if (uriFile) {
                handleSendFile();
                setUriFile(null);
            }
        }
    };

    const handleImageSelect = (uri) => {
        setUriImage(uri);
    };
    const handleFileSelect = (uri) => {
        setUriFile(uri);
    };
    //Gửi hình ảnh
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
        sendMessage(id, "Image")
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
    };

    const getFileExtension = (uri) => {
        return uri.substring(uri.lastIndexOf(".") + 1);
    };

    const FileMessage = ({ currentMessage }) => {
        const fileExtension = getFileExtension(currentMessage.file);
        let iconName;
        let colorIcon;
        switch (fileExtension) {
            case 'pdf':
                iconName = 'file-pdf-box';
                colorIcon = '#F28585';
                break;
            case 'doc':
            case 'docx':
                iconName = 'file-word';
                colorIcon = 'blue';
                break;
            case 'xls':
            case 'xlsx':
                iconName = 'file-excel';
                colorIcon = '#0A7641';
                break;
            case 'ppt':
            case 'pptx':
                iconName = 'file-powerpoint';
                colorIcon = '#D34C2C';
                break;
            default:
                iconName = 'file';
                colorIcon = '#111111';
        }

        return (
            <View style={[styles.fileMessageContainer, {marginLeft: currentMessage.user._id!==sender.id? 53:width-252,
                backgroundColor: currentMessage.user._id!==sender.id?'white':'#1E90FF',
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                borderBottomLeftRadius: currentMessage.user._id!==sender.id?0:20,
                borderBottomRightRadius: currentMessage.user._id!==sender.id?20:0,
                width: width - 150
            }]}>
                <View style={{flexDirection: 'row', width: width - 220, justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => Linking.openURL(currentMessage.file)}
                    onLongPress={() => showModal()}
                    >
                    <MaterialCommunityIcons name={iconName} size={50} color={colorIcon} />
                </TouchableOpacity>
                    <Text numberOfLines={2}
                        style={{ color: currentMessage.user._id!==sender.id?'black':'white',}}
                    >{currentMessage.file.substring(currentMessage.file.lastIndexOf("/") + 1)}</Text>
                </View>
                {/* <Text style={{color:'#111111',fontSize:10}}>{currentMessage.file.substring(currentMessage.file.lastIndexOf("/") + 1)}</Text> */}
                <Text style={{ color: 'grey', fontSize: 11, marginLeft: 10,
                    color: currentMessage.user._id!==sender.id?'grey':'white',
                    textAlign: currentMessage.user._id!==sender.id?'left':'right'
            }}>{new Date(currentMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
            </View>
        );
    };
    //Gửi file
    const handleSendFile = () => {
        if (uriFile) {
            const id = uuidv4();
            const newMessage = {
                _id: id,
                file: uriFile,
                createdAt: new Date(),
                user: {
                    _id: sender.id,
                    name: sender.userName,
                    avatar: sender.avt,
                },
            };
            sendMessage(id, 'File');
            setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
            setFileSelected(true);
        } else {
            Alert.alert("Chọn file cần gửi.");
        }
    };
    const handleFocusText = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };
    const renderMessage = (messageProps) => {
        const { currentMessage } = messageProps;
        if (currentMessage.file) {
            return <FileMessage currentMessage={currentMessage} />;
            //  <Message {...messageProps} />;
        } else if (currentMessage.text) {
            return (
                <Message {...messageProps} />
            );
        } else if (currentMessage.image) {
            return (
                <Message {...messageProps} />
            );
        }
        return null;
    };

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [messTarget, setMessTarget] = useState();

    return (
        <View style={{ width: width, flex: 1, height: height - 80, justifyContent: 'space-between' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}
                keyboardVerticalOffset={50}
                behavior={Platform.OS == "ios" ? "padding" : undefined}
            >
                <PaperProvider>
                    <Portal style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Modal visible={visible} onDismiss={hideModal}
                            contentContainerStyle={{ backgroundColor: 'white', padding: 20, width: width * 0.8, marginHorizontal: width * 0.1 }}
                        >
                            {/* <Text style={{ fontSize: 20, marginBottom: 10 }}>{messTarget.text}</Text> */}
                            <TouchableOpacity style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                                <FontAwesome6 name="arrows-rotate" size={40} color="red" />
                                <Text style={{ fontSize: 20, marginLeft: 5 }}>Thu hồi tin nhắn</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width: '100%', flexDirection: 'row', alignItems: 'center',
                                marginVertical: 10
                        }}>
                                <Ionicons name="arrow-undo" size={40} color="black" />
                                <Text style={{ fontSize: 20, marginLeft: 5  }}>Chuyển tiếp tin nhắn</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <MaterialIcons name="delete" size={40} color="red" />
                                <Text style={{ fontSize: 20, marginLeft: 5  }}>Xoá tin nhắn</Text>
                            </TouchableOpacity>
                        </Modal>
                    </Portal>
                    <View style={{ height: height - 95, backgroundColor: 'lightgray', marginBottom: 25 }}>
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
                                            {/* <Entypo name="dots-three-horizontal" size={35} color="black" /> */}
                                            <FilePickerComponent onSelectFile={handleFileSelect} />
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
                                console.log(message);
                                setMessTarget(message);
                            }}
                            renderMessage={renderMessage}
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
const styles = StyleSheet.create({
    fileMessageContainer: {
        // alignItems: 'center',
        // alignContent: 'flex-end',
        // justifyContent: 'flex-end',
        borderRadius: 5,
        paddingRight: 10,
        paddingVertical: 10,
        paddingLeft: 5,
        // margin: 5,
        marginBottom: 5,
        //backgroundColor: '#1E90FF',
    },
    fileMessageText: {
        fontSize: 16,
        marginBottom: 10,
    }
});

export default Chat;
