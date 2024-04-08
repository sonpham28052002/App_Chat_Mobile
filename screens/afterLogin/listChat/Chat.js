import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Text, Linking } from 'react-native';
import { GiftedChat, Message } from 'react-native-gifted-chat';
import { TextInput, Modal, Portal, PaperProvider } from 'react-native-paper';
import { Entypo, FontAwesome, MaterialIcons, FontAwesome6, Ionicons } from '@expo/vector-icons';
import EmojiPicker from 'rn-emoji-keyboard'
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { save, saveReceiverId, saveMess, addMess, retreiveMess, deleteMess } from '../../../Redux/slice';
import axios from 'axios';
import ImagePickerComponent from '../../../components/ImagePickerComponent';
import FilePickerComponent from '../../../components/FilePickerComponent';
import 'react-native-get-random-values';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AudioRecorder from '../../../components/AudioRecorder';
import VideoMessage from '../../../components/VideoMesssage';
import AudioMessage from '../../../components/AudioMessage';
import MessageForward from './components/MessageForward';
const { v4: uuidv4 } = require('uuid');

const Chat = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const sender = useSelector((state) => state.account);
    // const [messages, setMessages] = useState([]);
    const messages = useSelector((state) => state.message.messages);
    const receiverId = useSelector((state) => state.message.receiverId);
    var stompClient = useRef(null);
    const [uriImage, setUriImage] = useState(null);
    const [uriFile, setUriFile] = useState(null);
    const [uriVideo, setUriVideo] = useState(null);
    const textInputRef = useRef(null);
    const [position, setPosition] = useState({ start: 0, end: 0 });
    const [mess, setMess] = useState('');
    const [colorEmoji, setColorEmoji] = useState('black');
    const { width, height } = Dimensions.get('window');
    const [showEmoji, setShowEmoji] = useState(false);
    const [audio, setAudio] = useState(null);
    const [size, setSize] = useState(0);
    //    const [messagesVideo, setMessagesVideo] = useState([]);
    //     const [isVideoPlayed, setIsVideoPlayed] = useState({});
    //     const [currentVideoUri, setCurrentVideoUri] = useState(null);

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

        if (receiverId !== route.params.id) {
            dispatch(saveReceiverId(route.params.id));
            getMessage();
        }
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
        let messages = []
        if(response.data.length <= 20) messages = [...response.data]
        messages = response.data.slice(-20).map(message => {
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
            if (message.messageType === 'RETRIEVE')
                newMess.text = "Tin nhắn đã bị thu hồi!";
            else if (message.content)
                newMess.text = message.content
            else if (message.messageType == 'PNG'
                || message.messageType == 'JPG'
                || message.messageType == 'JPEG')
                newMess.image = message.url
            else if (message.messageType == 'PDF'
                || message.messageType == 'DOC'
                || message.messageType == 'DOCX'
                || message.messageType == 'XLS'
                || message.messageType == 'XLSX'
                || message.messageType == 'PPT'
                || message.messageType == 'PPTX'
                || message.messageType == 'RAR'
                || message.messageType == 'ZIP')
                newMess.file = message.url
            else if (message.messageType == 'VIDEO')
                newMess.video = message.url
            else if (message.messageType == 'AUDIO')
                newMess.audio = message.url
            return newMess;
        });
        setMessLoad(messages);
    }

    const loadMessage = () => {
        dispatch(saveMess(messLoad.reverse()));
    }

    function onConnected() {
        stompClient.current.subscribe('/user/' + sender.id + '/singleChat', onMessageReceived)
        stompClient.current.subscribe('/user/' + sender.id + '/retrieveMessage', onRetrieveMessage)
        stompClient.current.subscribe('/user/' + sender.id + '/deleteMessage', onDeleteResult)
    }

    function onDeleteResult(payload) {
        let message = JSON.parse(payload.body)
        dispatch(deleteMess(message.id));
        hideModal();
    }

    function onRetrieveMessage(payload) {
        let message = JSON.parse(payload.body)
        if (message.messageType === 'RETRIEVE') {
            const index = [...messages].findIndex((item) => item._id === message.id)
            if (index === -1) getMessage();
            if (index !== -1) {
                let date = new Date(message.senderDate);
                dispatch(retreiveMess({
                    index: index, mess: {
                        _id: message.sender.id,
                        text: "Tin nhắn đã bị thu hồi!",
                        createdAt: date.setUTCHours(date.getUTCHours() + 7),
                        user: {
                            _id: sender.id,
                            name: sender.userName,
                            avatar: sender.avt,
                        }
                    }
                }));
            }
            hideModal();
            updateMess();
        }
    }

    function onMessageReceived(payload) {
        const message = JSON.parse(payload.body);
        updateMess();
        let date = new Date(message.senderDate);
        let newMessage = {
            _id: message.id,
            createdAt: date.setUTCHours(date.getUTCHours() + 7),
            user: {
                _id: message.sender.id === sender.id ? sender.id : route.params.id,
                name: message.sender.id === sender.id ? sender.userName : route.params.userName,
                avatar: message.sender.id === sender.id ? sender.avt : route.params.avt,
            }
        };
        if (message.content)
            newMessage.text = message.content;
        else if (message.url)
            newMessage.image = message.url;
        else if (message.file)
            newMessage.file = message.file;
        else if (message.video)
            newMessage.video = message.video;
        // setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
        dispatch(addMess(newMessage));
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
            if (mess && type === 'Text') {
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
                const uri = uriFile.substring(uriFile.lastIndexOf("/") + 1);
                const titleFile = uri.substring(uri.indexOf("_") + 1);
                chatMessage.size = size;
                chatMessage.messageType = getFileExtension(uriFile).toUpperCase();
                chatMessage.titleFile = titleFile;
                chatMessage.url = uriFile;
            }
            else if (type === 'Video') {
                const titleFile = uriVideo.substring(uriVideo.lastIndexOf("/") + 1);
                chatMessage.size = 10;
                chatMessage.messageType = getFileExtension(uriVideo) == 'mp3' ? 'AUDIO' : 'VIDEO';
                chatMessage.titleFile = titleFile;
                chatMessage.url = uriVideo;
            } else if (type === 'Audio') {
                const titleFile = audio.substring(audio.lastIndexOf("/") + 1);
                chatMessage.size = 10;
                chatMessage.messageType = "AUDIO";
                chatMessage.titleFile = titleFile;
                chatMessage.url = audio;
            }
            stompClient.current.send("/app/private-single-message", {}, JSON.stringify(chatMessage));
        }
    }

    const fowardMessage = (data) => {
        let dataSend = data.filter(item => item.checked);
        let dataMessage = convertMessageGiftedChatToMessage(messTarget);
        let listMessage = dataSend.map(item => ({ ...dataMessage, receiver: { id: item.id } }));
        stompClient.current.send("/app/forward-message", {}, JSON.stringify(listMessage));
        hideModalMessageFoward();
    }

    const handleSend = () => {
        if (mess.trim() === '' && !uriImage && !uriFile && !uriVideo && !audio) {
            Alert.alert("Chưa gửi tin nhắn hoặc chọn ảnh, video hoặc file");
        } else {
            if (mess.trim() !== '') {
                const id = uuidv4();
                const newMessage = {
                    _id: id,
                    text: mess.trim(),
                    createdAt: new Date() + "",
                    user: {
                        _id: sender.id,
                        name: sender.userName,
                        avatar: sender.avt,
                    }
                };
                dispatch(addMess(newMessage));
                sendMessage(id, 'Text');
                // setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
                setMess(''); // Clear the TextInput value after sending
            } else if (uriImage) {
                handleSendImage();
                setUriImage(null);
            } else if (uriFile) {
                handleSendFile();
                setUriFile(null);
            } else if (uriVideo) {
                handleSendVideo();
                setUriVideo(null);
            } else if (audio) {
                console.log(audio);
                hadleSendAudio();
                setAudio(null);
            }
        }
    };

    const handleImageSelect = (uri, type) => {
        if (type === "image") {
            setUriImage(uri);
        } else {
            setUriVideo(uri);
        }
        hideModal2();
    };
    const handleFileSelect = (uri, size) => {
        setUriFile(uri);
        setSize((parseInt(size) / 1024).toFixed(2))
        hideModal2();
    };
    const handleAudioSelect = (uri) => {
        setAudio(uri);
        hideModal2();
    };
    const handleSendImage = () => {
        const id = uuidv4();
        const newMessage = {
            _id: id,
            image: uriImage,
            createdAt: new Date() + "",
            user: {
                _id: sender.id,
                name: sender.userName,
                avatar: sender.avt,
            }
        };
        const fileType = uriImage.substring(uriImage.lastIndexOf(".") + 1);
        sendMessage(id, "Image");
        // setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
        dispatch(addMess(newMessage));
    };
    const hadleSendAudio = () => {
        const id = uuidv4();
        const newMessage = {
            _id: id,
            audio: audio,
            createdAt: new Date() + "",
            user: {
                _id: sender.id,
                name: sender.userName,
                avatar: sender.avt,
            },
        };
        const fileType = audio.substring(audio.lastIndexOf(".") + 1);
        sendMessage(id, "Audio");
        dispatch(addMess(newMessage));
    };

    const handleSendVideo = () => {
        const id = uuidv4();
        if (uriVideo) {
            const newMessage = {
                _id: id,
                video: uriVideo,
                createdAt: new Date() + "",
                user: {
                    _id: sender.id,
                    name: sender.userName,
                    avatar: sender.avt,
                }
            };
            const fileType = uriVideo.substring(uriVideo.lastIndexOf(".") + 1);
            sendMessage(id, "Video");
            // setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
            dispatch(addMess(newMessage));
        }
    };

    const handleSendFile = () => {
        if (uriFile) {
            const id = uuidv4();
            const newMessage = {
                _id: id,
                file: uriFile,
                createdAt: new Date() + "",
                user: {
                    _id: sender.id,
                    name: sender.userName,
                    avatar: sender.avt,
                }
            };
            sendMessage(id, 'File');
            // setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
            dispatch(addMess(newMessage));
        } else {
            Alert.alert("Chọn file cần gửi.");
        }
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
            case 'mov':
            case 'mp4':
            case 'mp3':
                iconName = 'file-video';
                break;
            default:
                iconName = 'file';
                colorIcon = '#111111';
        }
        const uri = currentMessage.file.substring(currentMessage.file.lastIndexOf("/") + 1)
        const titleFile = uri.substring(uri.indexOf("_") + 1);
        return (
            <View style={[styles.fileMessageContainer, {
                marginLeft: currentMessage.user._id !== sender.id ? 53 : width - 252,
                backgroundColor: currentMessage.user._id !== sender.id ? 'white' : '#1E90FF',
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                borderBottomLeftRadius: currentMessage.user._id !== sender.id ? 0 : 20,
                borderBottomRightRadius: currentMessage.user._id !== sender.id ? 20 : 0,
                width: width - 150
            }]}>
                <TouchableOpacity style={{ flexDirection: 'row', width: width - 220, justifyContent: 'space-between', alignItems: 'center' }}
                    onLongPress={() => {
                        showModal()
                        setMessTarget(currentMessage)
                    }}
                >
                    <TouchableOpacity onPress={() => Linking.openURL(currentMessage.file)}>
                        <MaterialCommunityIcons name={iconName} size={50} color={colorIcon} />
                    </TouchableOpacity>
                    <Text numberOfLines={2}
                        style={{ color: currentMessage.user._id !== sender.id ? 'black' : 'white', }}
                    >{titleFile}</Text>
                </TouchableOpacity>
                {/* <Text style={{color:'#111111',fontSize:10}}>{currentMessage.file.substring(currentMessage.file.lastIndexOf("/") + 1)}</Text> */}
                {/* <Text style={{
                    fontSize: 11, marginLeft: 10,
                    color: currentMessage.user._id !== sender.id ? 'grey' : 'white',
                    textAlign: currentMessage.user._id !== sender.id ? 'left' : 'right'
                }}>{parseInt((currentMessage.file.substring(currentMessage.file.lastIndexOf("_")+1) / 1024).toFixed(2))}KB</Text> */}
                <Text style={{
                    color: 'grey', fontSize: 11, marginLeft: 10,
                    color: currentMessage.user._id !== sender.id ? 'grey' : 'white',
                    textAlign: currentMessage.user._id !== sender.id ? 'left' : 'right'
                }}>{new Date(currentMessage.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
            </View>
        );
    };

    const handleFocusText = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [visible2, setVisible2] = useState(false);
    const showModal2 = () => setVisible2(true);
    const hideModal2 = () => setVisible2(false);

    const [visibleMessageFoward, setVisibleMessageFoward] = useState(false);
    const showModalMessageFoward = () => setVisibleMessageFoward(true);
    const hideModalMessageFoward = () => setVisibleMessageFoward(false);

    const [messTarget, setMessTarget] = useState();

    const renderMessage = (messageProps) => {
        const { currentMessage } = messageProps;
        if (currentMessage.file) {
            return <FileMessage {...messageProps} currentMessage={currentMessage} />;
        } else if (currentMessage.text) {
            return (
                <Message {...messageProps} />
            );
        } else if (currentMessage.image) {
            return (
                <Message {...messageProps} />
            );
        } else if (currentMessage.video) {
            return <VideoMessage videoUri={currentMessage} sender={currentMessage.user._id == sender.id ? true : false}
                onLongPress={(message) => {
                    showModal();
                    setMessTarget(message);
                }}
            />;
        } else if (currentMessage.audio) {
            return <AudioMessage key={currentMessage._id} audioUri={currentMessage} sender={currentMessage.user._id == sender.id ? true : false}
                onLongPress={(message) => {
                    showModal();
                    setMessTarget(message);
                }}
            />;
        }
        return null;
    };

    function convertMessageGiftedChatToMessage(giftedMessage) {
        let chatMessage = {
            id: giftedMessage._id,
            senderDate: new Date(giftedMessage.createdAt)
        };
        if (giftedMessage.user._id === sender.id) {
            chatMessage.sender = { id: sender.id },
                chatMessage.receiver = { id: route.params.id }
        } else {
            chatMessage.receiver = { id: sender.id },
                chatMessage.sender = { id: route.params.id }
        }
        if (giftedMessage.text) {
            chatMessage.content = giftedMessage.text
            chatMessage.messageType = "Text"
        }
        // else if (messTarget.image) {
        //     const titleFile = messTarget.image.substring(messTarget.image.lastIndexOf("/") + 1);
        //     chatMessage.size = 10;
        //     chatMessage.messageType = getFileExtension(uriImage).toUpperCase();
        //     chatMessage.titleFile = titleFile;
        //     chatMessage.url = uriImage;
        // } else if (type === 'File') {
        //     const titleFile = uriFile.substring(uriFile.lastIndexOf("/") + 1);
        //     chatMessage.size = 10;
        //     chatMessage.messageType = getFileExtension(uriFile).toUpperCase();
        //     chatMessage.titleFile = titleFile;
        //     chatMessage.url = uriFile;
        // }
        // else if (type === 'Video') {
        //     const titleFile = uriVideo.substring(uriVideo.lastIndexOf("/") + 1);
        //     chatMessage.size = 10;
        //     chatMessage.messageType = getFileExtension(uriVideo)=='mp3'? 'AUDIO':'VIDEO';
        //     chatMessage.titleFile = titleFile;
        //     chatMessage.url = uriVideo;
        // }
        return chatMessage;
    }

    return (
        <View style={{ width: width, flex: 1, height: height - 80, justifyContent: 'space-between' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}
                keyboardVerticalOffset={50}
                behavior={Platform.OS == "ios" ? "padding" : undefined}
            >
                <PaperProvider>
                    <Portal style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Modal visible={visible} onDismiss={hideModal}
                            contentContainerStyle={{ backgroundColor: 'white', padding: 20, width: width * 0.8, marginHorizontal: width * 0.1 }}
                        >
                            {messTarget &&
                                <Text style={{ fontSize: 20, marginBottom: 10 }}>{messTarget.text}</Text>
                            }
                            { messTarget && messTarget.user._id == sender.id &&
                             <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => {
                                    if (stompClient.current) {
                                        stompClient.current.send("/app/retrieve-message", {},
                                            JSON.stringify(convertMessageGiftedChatToMessage(messTarget)));
                                    }
                                }}
                            >
                                <FontAwesome6 name="arrows-rotate" size={40} color="red" />
                                <Text style={{ fontSize: 20, marginLeft: 5 }}>Thu hồi tin nhắn</Text>
                            </TouchableOpacity>}
                            { messTarget && messTarget.user._id == sender.id &&
                                <TouchableOpacity style={{
                                width: '100%', flexDirection: 'row', alignItems: 'center',
                                marginVertical: 10
                            }}
                                onPress={() => {
                                    hideModal();
                                    showModalMessageFoward();
                                }}
                            >
                                <Ionicons name="arrow-undo" size={40} color="black" />
                                <Text style={{ fontSize: 20, marginLeft: 5 }}>Chuyển tiếp tin nhắn</Text>
                            </TouchableOpacity>}
                            <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => {
                                    if (stompClient.current) {
                                        let deleteMessage = convertMessageGiftedChatToMessage(messTarget)
                                        delete deleteMessage.senderDate
                                        let idGroup = ""
                                        let ownerId = sender.id
                                        stompClient.current.send("/app/delete-message", {},
                                            JSON.stringify({ ...deleteMessage, idGroup, ownerId }));
                                    }
                                }}
                            >
                                <MaterialIcons name="delete" size={40} color="red" />
                                <Text style={{ fontSize: 20, marginLeft: 5 }}>Xoá tin nhắn</Text>
                            </TouchableOpacity>
                        </Modal>
                        <Modal visible={visible2} onDismiss={hideModal2}
                            contentContainerStyle={{
                                backgroundColor: 'white',
                                padding: 20,
                                height: 120,
                                width: 270,
                                marginLeft: width - 270,
                                marginTop: height - 375
                            }}>
                            <FilePickerComponent onSelectFile={handleFileSelect} />
                            <ImagePickerComponent onSelectImage={handleImageSelect} />
                        </Modal>
                        <MessageForward visible={visibleMessageFoward} onDismiss={hideModalMessageFoward} senderId={sender.id} onSend={fowardMessage} />
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
                                        <View style={{ marginHorizontal: 10, width: width - 180 }}>
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
                                        <TouchableOpacity style={{ flexDirection: 'row', width: 75, justifyContent: 'space-between' }}
                                            onPress={showModal2}
                                        >
                                            <Entypo name="dots-three-horizontal" size={35} color="black" />
                                            <AudioRecorder onSelectAudio={handleAudioSelect} />
                                        </TouchableOpacity>
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
                            // onSend={handleSend}
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
                            renderMessage={(messageProps) => renderMessage(messageProps)}
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
                />
            }
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
