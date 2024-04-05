import React, { useEffect, useState, useRef } from 'react';
import { Button,View,StyleSheet, Dimensions, Animated, TouchableOpacity, Alert, KeyboardAvoidingView, Platform,Text,Linking, Image} from 'react-native';
import { GiftedChat, Message} from 'react-native-gifted-chat';
import { TextInput } from 'react-native-paper';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
// import EmojiSelector, { Categories } from "react-native-emoji-selector";
import EmojiPicker from 'rn-emoji-keyboard'
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useSelector } from 'react-redux';
import ImagePickerComponent from '../../../components/ImagePickerComponent';
import FilePickerComponent from '../../../components/FilePickerComponent';
import 'react-native-get-random-values';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { v4: uuidv4 } = require('uuid');
const Chat = ({ navigation, route }) => {
    console.log('Receive:', route.params);
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
                        onPress={() => navigation.navigate('OptionChat', route.params)}>
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
        if(message.sender.id === sender.id || message.sender.id !== route.params) return;
        let date = new Date(message.senderDate);
        const newMessage = {
            _id: message.id,
            createdAt: date.setUTCHours(date.getUTCHours() + 7),
            user: {
                _id: route.params,
                name: sender.userName,
                avatar: sender.avt,
            }
        };
        if(message.content)
            newMessage.text = message.content;
        else if(message.url)
            newMessage.image = message.url;
        else if(message.file)
            newMessage.file = message.file;
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
            else if (type === 'Image') {
                const titleFile = uriImage.substring(uriImage.lastIndexOf("/") + 1);
                chatMessage.size = 10;
                chatMessage.titleFile = titleFile;
                chatMessage.url = uriImage;
            } else if (type === 'File') {
                const titleFile = uriFile.substring(uriFile.lastIndexOf("/") + 1);
                chatMessage.size = 10;
                chatMessage.titleFile = titleFile;
                chatMessage.url = uriFile;
            }
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
        // const id=new Date();

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

    switch (fileExtension) {
        case 'pdf':
            iconName = 'file-pdf-box';
            break;
        case 'doc':
        case 'docx':
            iconName = 'file-word';
            break;
        case 'xls':
        case 'xlsx':
            iconName = 'file-excel';
            break;
        case 'ppt':
        case 'pptx':
            iconName = 'file-powerpoint';
            break;
        default:
            iconName = 'file';
    }

    return (
        <View style={styles.fileMessageContainer}>
            <TouchableOpacity onPress={() => Linking.openURL(currentMessage.file)}>
                <MaterialCommunityIcons name={iconName} size={50} color="#1E90FF" />
            </TouchableOpacity>
            {/* <Text style={{color:'#111111',fontSize:10}}>{currentMessage.file.substring(currentMessage.file.lastIndexOf("/") + 1)}</Text> */}
            <Text style={{color:'#111111',fontSize:10}}>{new Date(currentMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
        </View>
    );
};
    //Gửi file
 const handleSendFile = () => {
        if (uriFile) {
            const id = uuidv4();
            const newMessage = {
                _id: id,
                text: 'Mở file',
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
        return  <FileMessage currentMessage={currentMessage} />;
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
    return (
        <View style={{ width: width, flex: 1, height: height - 80, justifyContent: 'space-between' }}>
            <KeyboardAvoidingView style={{flex: 1}}
                keyboardVerticalOffset={50}
                behavior={Platform.OS == "ios"? "padding" : undefined}
            >
            <View style={{ height: height - 110, backgroundColor: 'lightgray', marginBottom: 25 }}>
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
                                    {/* <Entypo name="dots-three-horizontal" size={35} color="black" /> */}
                                    <FilePickerComponent onSelectFile={handleFileSelect}/>
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

                      renderMessage={renderMessage}
                />
            </View>
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
        alignItems: 'center',
        alignContent:'flex-end',
        justifyContent: 'flex-end',
        borderRadius: 5,
        margin: 5,
        width:'30%',
        marginLeft: '75%',
        //backgroundColor: '#1E90FF',
    },
    fileMessageText: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default Chat;
