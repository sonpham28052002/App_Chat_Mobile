import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Text, Linking } from 'react-native';
import { GiftedChat, Message } from 'react-native-gifted-chat';
import { TextInput, Modal, Portal, PaperProvider } from 'react-native-paper';
import { Entypo, FontAwesome, MaterialIcons, FontAwesome6, Ionicons } from '@expo/vector-icons';
import EmojiPicker, { id } from 'rn-emoji-keyboard'
import { Dialog } from '@rneui/themed';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { save, saveReceiverId, saveMess, addMess, retrieveMess, deleteMess } from '../../../Redux/slice';
import axios from 'axios';
// import { onMessageReceive } from '../../../function/socket/onReceiveMessage';
import ImagePickerComponent from '../../../components/ImagePickerComponent';
import FilePickerComponent from '../../../components/FilePickerComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AudioRecorder from '../../../components/AudioRecorder';
import VideoMessage from '../../../components/VideoMesssage';
import AudioMessage from '../../../components/AudioMessage';
import MessageForward from './components/MessageForward';
import { getMessage } from '../../../function/socket/loadMessage';
import 'react-native-get-random-values';
const { v4: uuidv4 } = require('uuid');

const Chat = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const sender = useSelector((state) => state.account);
    const receiverId = useSelector((state) => state.message.id);
    const messages = useSelector((state) => state.message.messages);
    // const receiverId = useRef(route.params.id).current;
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
    const [sizeImage, setSizeImage] = useState(0);
    const [sizeVideo, setSizeVideo] = useState(0);
    const [sizeAudio, setSizeAudio] = useState(0);
    const [durationInSeconds, setdurationInSeconds] = useState(0);
    const [messLoad, setMessLoad] = useState([]);

    let listMember = useRef([]);

    useEffect(() => {
        navigation.setOptions({
            title: route.params.userName? route.params.userName: route.params.nameGroup,
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
            toggleDialog3();
            // setVisible3(true)
            dispatch(saveReceiverId(route.params.id));
            dispatch(saveMess([]));
            if (route.params.nameGroup) {
                getListMember().then(() => {
                    getMessage(sender, { id: route.params.id, members: listMember.current }).then(messages => {
                        if(messages.length > 0) setMessLoad(messages);
                        else {
                            // toggleDialog3()
                            setVisible3(false);
                        };
                    });
                })
            } else
                getMessage(sender, route.params).then(messages => {
                    if(messages.length > 0) setMessLoad(messages);
                    else setVisible3(false);
                });
        }
        }, []);
        
    useEffect(() => {
        if (messLoad.length > 0){
            dispatch(saveMess(messLoad.reverse()));
            toggleDialog3();
        }
        // setVisible3(false);
    }, [messLoad]);

    const getListMember = async () => {
        let api = `https://deploybackend-production.up.railway.app/messages/getMemberByIdSenderAndIdGroup?idSender=${sender.id}&idGroup=${route.params.id}`
        const result = await axios.get(api)
        try {
            if (result.data){
                listMember.current = [...result.data];
            }
        } catch (error) {
            console.log(error);
        }
    }

    // const getMember = (id) => {
    //     return listMember.current.find(item => item.member.id === id);
    // }

    // const getMessage = async () => {
    //     let response = null;
    //     let api = ''
    //     if(route.params.nameGroup)
    //         api = `https://deploybackend-production.up.railway.app/messages/getMessageAndMemberByIdSenderAndIdGroup?idSender=${sender.id}&idGroup=${route.params.id}`
    //     else 
    //         api = `https://deploybackend-production.up.railway.app/users/getMessageByIdSenderAndIsReceiver?idSender=${sender.id}&idReceiver=${route.params.id}`
    //     response = await axios.get(api);
    //     let messages = []
    //     if (response.data.length <= 20) messages = [...response.data]
    //     else messages = response.data.slice(-20)
    //     messages = messages.map(message => {
    //         let date = new Date(message.senderDate);
    //         let newMess = {
    //             _id: message.id,
    //             createdAt: date.setUTCHours(date.getUTCHours() + 7),
    //             user: {
    //                 _id: message.sender.id,
    //                 name: message.sender.id == sender.id ? sender.userName : route.params.nameGroup? getMember(message.sender.id).member.userName : route.params.userName,
    //                 avatar: message.sender.id == sender.id ? sender.avt : route.params.nameGroup? getMember(message.sender.id).member.avt : route.params.avt,
    //             }
    //         }
    //         if (message.messageType === 'RETRIEVE')
    //             newMess.text = "Tin nhắn đã bị thu hồi!";
    //         else if (message.content)
    //             newMess.text = message.content
    //         else if (message.messageType == 'PNG'
    //             || message.messageType == 'JPG'
    //             || message.messageType == 'JPEG')
    //             newMess.image = message.url
    //         else if (message.messageType == 'PDF'
    //             || message.messageType == 'DOC'
    //             || message.messageType == 'DOCX'
    //             || message.messageType == 'XLS'
    //             || message.messageType == 'XLSX'
    //             || message.messageType == 'PPT'
    //             || message.messageType == 'PPTX'
    //             || message.messageType == 'RAR'
    //             || message.messageType == 'ZIP')
    //             newMess.file = message.url
    //         else if (message.messageType == 'VIDEO')
    //             newMess.video = message.url
    //         else if (message.messageType == 'AUDIO')
    //             newMess.audio = message.url
    //         return newMess;
    //     });
    //     setMessLoad(messages);
    // }

    function onConnected() {
        // stompClient.current.subscribe('/user/' + sender.id + '/retrieveMessage', onRetrieveMessage)
        // // stompClient.current.subscribe('/user/' + sender.id + '/deleteMessage', onDeleteResult)
        // stompClient.current.subscribe('/user/' + sender.id + '/removeMemberInGroup', (payload) => {
        //     let message = JSON.parse(payload.body)
        //     let members = message.members;
        //     let isRemove = members.filter(item => item.id == sender.id && item.memberType == "LEFT_MEMBER");
        //     if (route.params.id === message.idGroup && isRemove.length > 0) {
        //         Alert.alert("Bạn đã bị xóa khỏi nhóm chat");
        //         navigation.navigate('ListChat')
        //     }
        // })
    }

    // function onDeleteResult(payload) {
    //     let message = JSON.parse(payload.body)
    //     dispatch(deleteMess(message.id));
    //     hideModal();
    // }

    // function onRetrieveMessage(payload) {
    //     let message = JSON.parse(payload.body)
    //     if (message.messageType === 'RETRIEVE') {
    //         const index = [...messages].findIndex((item) => item._id === message.id)
    //         if (index === -1) getMessage();
    //         if (index !== -1) {
    //             let date = new Date(message.senderDate);
    //             dispatch(retreiveMess({
    //                 index: index, mess: {
    //                     _id: message.sender.id,
    //                     text: "Tin nhắn đã bị thu hồi!",
    //                     createdAt: date.setUTCHours(date.getUTCHours() + 7),
    //                     user: {
    //                         _id: sender.id,
    //                         name: sender.userName,
    //                         avatar: sender.avt,
    //                     }
    //                 }
    //             }));
    //         }
    //         hideModal();
    //         // updateMess();
    //     }
    // }

    // function addMessage(message, type){
    //     let date = new Date(message.senderDate);
    //     let newMessage = {
    //         _id: message.id,
    //         createdAt: date.setUTCHours(date.getUTCHours() + 7),
    //         user: {
    //             _id: message.sender.id,
    //             name: message.sender.id === sender.id ? sender.userName : type == "group"? getMember(message.sender.id).member.userName : route.params.userName,
    //             avatar: message.sender.id === sender.id ? sender.avt : type == "group"? getMember(message.sender.id).member.avt : route.params.avt,
    //         }
    //     };
    //     if (message.content)
    //         newMessage.text = message.content;
    //     else {
    //         if (message.messageType == 'PNG' || message.messageType == 'JPG' || message.messageType == 'JPEG')
    //             newMessage.image = message.url;
    //         else if (message.messageType == 'AUDIO')
    //             newMessage.audio = message.url;
    //         else if (message.messageType == 'VIDEO')
    //             newMessage.video = message.url;
    //         else if (message.messageType == 'PDF' || message.messageType == 'DOC'
    //             || message.messageType == 'DOCX' || message.messageType == 'XLS'
    //             || message.messageType == 'XLSX' || message.messageType == 'PPT'
    //             || message.messageType == 'PPTX' || message.messageType == 'RAR'
    //             || message.messageType == 'ZIP' || message.messageType == 'TXT'
    //             || message.messageType == 'JSON' || message.messageType == 'XML'
    //             || message.messageType == 'CSV' || message.messageType == 'HTML')
    //             newMessage.file = message.url;
    //     }
    //     dispatch(addMess(newMessage));
    // }

    // function onMessageReceived(payload) {
    //     const message = JSON.parse(payload.body);
    //     updateMess();
    //     if (message.sender.id === sender.id && message.receiver.id === receiverId)
    //         addMessage(message, "single");
    // }

    function onError(error) {
        console.log('Could not connect to WebSocket server. Please refresh and try again!');
    }

    function sendMessage(id, type) {
        if (stompClient.current) {
            var chatMessage = {
                id: id,
                sender: { id: sender.id },
            };
            if (mess && type === 'Text') {
                chatMessage.content = mess
                chatMessage.messageType = type
            }
            else if (type === 'Image') {
                // const uri = uriImage.substring(uriImage.lastIndexOf("/") + 1);
                // const type = getFileExtension(uriImage);
                // const titleFile = uri.substring(uri.indexOf("_") + 1, uri.lastIndexOf("_"))+"."+type;
                const titleFile = uriImage.substring(uriImage.lastIndexOf("/") + 1);
                chatMessage.size = sizeImage;
                chatMessage.messageType = getFileExtension(uriImage).toUpperCase();
                chatMessage.titleFile = titleFile;
                // chatMessage.size = uri.substring(uri.lastIndexOf("_") + 1, uri.lastIndexOf("."));
                // chatMessage.messageType = type.toUpperCase();
                chatMessage.url = uriImage;
            } else if (type === 'File') {
                // const uri = uriFile.substring(uriFile.lastIndexOf("/") + 1);
                // const type = getFileExtension(uriFile);
                // const titleFile = uri.substring(uri.indexOf("_") + 1, uri.lastIndexOf("_")) + "." + type;
                // chatMessage.titleFile = titleFile;
                // chatMessage.size = uri.substring(uri.lastIndexOf("_") + 1, uri.lastIndexOf("."));
                // chatMessage.messageType = type.toUpperCase();
                // chatMessage.url = uriFile;
                const uri = uriFile.substring(uriFile.lastIndexOf("/") + 1);
                const titleFile = uri.substring(uri.indexOf("_") + 1);
                chatMessage.size = size;
                chatMessage.messageType = getFileExtension(uriFile).toUpperCase();
                chatMessage.titleFile = titleFile;
                chatMessage.url = uriFile;
            }
            else if (type === 'Video') {
                const titleFile = uriVideo.substring(uriVideo.lastIndexOf("/") + 1);
                chatMessage.size = sizeVideo;
                chatMessage.messageType = getFileExtension(uriVideo) == 'mp3' ? 'AUDIO' : 'VIDEO';
                chatMessage.titleFile = titleFile;
                chatMessage.url = uriVideo;
            } else if (type === 'Audio') {
                const titleFile = audio.substring(audio.lastIndexOf("/") + 1);
                chatMessage.size = sizeAudio;
                chatMessage.messageType = "AUDIO";
                chatMessage.titleFile = titleFile;
                chatMessage.url = audio;
            }
            let messageSend = null
            if(route.params.nameGroup)
                messageSend = { ...chatMessage, receiver: { id: "group_" + route.params.id}}
            else
                messageSend = { ...chatMessage, receiver: { id: route.params.id }}
            stompClient.current.send("/app/private-single-message", {}, JSON.stringify(messageSend));
        }
    }

    const forwardMessage = (data) => {
        let dataSend = data.filter(item => item.checked);
        let dataMessage = convertMessageGiftedChatToMessage(messTarget);
        let listMessage = dataSend.map(item => ({ ...dataMessage, sender:{ id: sender.id }, receiver: route.params.nameGroup? { id: "group_"+route.params.id} : { id: item.id } }));
        stompClient.current.send("/app/forward-message", {}, JSON.stringify(listMessage));
        hideModalMessageForward();
    }

    const handleSend = () => {
        if (mess.trim() === '' && !uriImage && !uriFile && !uriVideo && !audio) {
            Alert.alert("Chưa gửi tin nhắn hoặc chọn ảnh, video hoặc file");
        } else {
            if (mess.trim() !== '') {
                const id = uuidv4();
                // const newMessage = {
                //     _id: id,
                //     text: mess.trim(),
                //     createdAt: new Date() + "",
                //     user: {
                //         _id: sender.id,
                //         name: sender.userName,
                //         avatar: sender.avt,
                //     }
                // };
                // dispatch(addMess(newMessage));
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
                hadleSendAudio();
                setAudio(null);
            }
        }
    };

    // const handleImageSelect = (uri, type, size) => {
    //     const uriType = uri.substring(uri.lastIndexOf(".") + 1);
    //     const uriFile = uri.substring(0, uri.lastIndexOf("."));
    //     const newUri = uriFile + "_" + size + "." + uriType;
    //     if (type === "image") {
    //         setUriImage(newUri);
    //     } else {
    //         setUriVideo(newUri);
    const handleImageSelect = (uri, type, fileSize) => {
        if (type === "image") {
            setUriImage(uri);
            setSizeImage(fileSize)
        } else {
            setUriVideo(uri);
            setSizeVideo(fileSize)
        }
        hideModal2();
    };
    const handleFileSelect = (uri, size) => {
        // const type = uri.substring(uri.lastIndexOf(".") + 1);
        // const uriFile = uri.substring(0, uri.lastIndexOf("."));
        // setUriFile(uriFile + "_" + size + "." + type);
        // hideModal2();
        setUriFile(uri);
        setSize((parseInt(size) / 1024).toFixed(2))
        hideModal2();
    };
    const handleAudioSelect = (uri,fileSize,durationInSeconds) => {
        setAudio(uri);
        setSizeAudio(fileSize);
        setdurationInSeconds(durationInSeconds);
        hideModal2();
    };
    const handleSendImage = () => {
        const id = uuidv4();
        const newMessage = {
            _id: id,
            image: uriImage,
            // size:sizeImage,
            createdAt: new Date() + "",
            user: {
                _id: sender.id,
                name: sender.userName,
                avatar: sender.avt,
            }
        };
        // const fileType = uriImage.substring(uriImage.lastIndexOf(".") + 1);
        sendMessage(id, "Image");
        // setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
        // dispatch(addMess(newMessage));
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
        // dispatch(addMess(newMessage));
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
            // dispatch(addMess(newMessage));
        }
    };

    const handleSendFile = () => {
        if (uriFile) {
            const id = uuidv4();
            const newMessage = {
                _id: id,
                file: uriFile,
                fileSize:size,
                createdAt: new Date() + "",
                user: {
                    _id: sender.id,
                    name: sender.userName,
                    avatar: sender.avt,
                }
            };
            sendMessage(id, 'File');
            // setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
            // dispatch(addMess(newMessage));
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
        const type = uri.substring(uri.lastIndexOf(".") + 1);
        const titleFile = uri.substring(uri.indexOf("_") + 1, uri.lastIndexOf("_")) + "." + type;
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
                    {/* <Text style={{ color: currentMessage.user._id !== sender.id ? 'black' : 'white', }}
                    >{currentMessage.fileSize}</Text> */}
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

    const [visible3, setVisible3] = useState(false);
    const toggleDialog3 = () => setVisible3(!visible3);

    const [visibleMessageForward, setVisibleMessageForward] = useState(false);
    const showModalMessageForward = () => setVisibleMessageForward(true);
    const hideModalMessageForward = () => setVisibleMessageForward(false);

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
                durationInSeconds={currentMessage.durationInSeconds}
            />;
        }
        return null;
    };

    function convertMessageGiftedChatToMessage(giftedMessage) {
        let chatMessage = {
            id: giftedMessage._id,
            senderDate: new Date(giftedMessage.createdAt)
        };
        chatMessage.sender = { id: giftedMessage.user._id}
        chatMessage.receiver = giftedMessage.user._id === sender.id?
            { id: route.params.id } : { id: sender.id }
        if (giftedMessage.text) {
            chatMessage.content = giftedMessage.text
            chatMessage.messageType = "Text"
        }
        else { // image, file, video, audio
            const u = giftedMessage.image ? giftedMessage.image : giftedMessage.file ? giftedMessage.file : giftedMessage.video ? giftedMessage.video : giftedMessage.audio;
            const uri = u.substring(u.lastIndexOf("/") + 1);
            const type = uri.substring(uri.lastIndexOf(".") + 1);
            // const size = uri.substring(uri.lastIndexOf("_") + 1, uri.lastIndexOf("."));
            // const titleFile = uri.substring(uri.indexOf("_") + 1, uri.lastIndexOf("_")) + "." + type;
            // chatMessage.size = size;
            // chatMessage.titleFile = titleFile;
            if (giftedMessage.image) {
                chatMessage.messageType = type.toUpperCase();
                chatMessage.url = giftedMessage.image;
            } else if (giftedMessage.file) {
                chatMessage.messageType = getFileExtension(giftedMessage.file).toUpperCase();
                chatMessage.url = giftedMessage.file;
            } else if (giftedMessage.video) {
                chatMessage.messageType = "VIDEO";
                chatMessage.url = giftedMessage.video;
            } else if (giftedMessage.audio) {
                chatMessage.messageType = "AUDIO";
                chatMessage.url = giftedMessage.audio;
            }
        }
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
                            {messTarget && messTarget.user._id == sender.id &&
                                <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {
                                        if (stompClient.current) {
                                            let messSend = convertMessageGiftedChatToMessage(messTarget)
                                            if(route.params.nameGroup)
                                                messSend = { ...messSend, receiver: { id: "group_"+route.params.id } }
                                            stompClient.current.send("/app/retrieve-message", {},
                                                JSON.stringify(messSend));
                                        }
                                    }}
                                >
                                    <FontAwesome6 name="arrows-rotate" size={40} color="red" />
                                    <Text style={{ fontSize: 20, marginLeft: 5 }}>Thu hồi tin nhắn</Text>
                                </TouchableOpacity>}
                            <TouchableOpacity style={{
                                width: '100%', flexDirection: 'row', alignItems: 'center',
                                marginVertical: 10
                            }}
                                onPress={() => {
                                    hideModal();
                                    showModalMessageForward();
                                }}
                            >
                                <Ionicons name="arrow-undo" size={40} color="black" />
                                <Text style={{ fontSize: 20, marginLeft: 5 }}>Chuyển tiếp tin nhắn</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => {
                                    if (stompClient.current) {
                                        let deleteMessage = convertMessageGiftedChatToMessage(messTarget)
                                        delete deleteMessage.senderDate
                                        let idGroup = route.params.id
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
                            <ImagePickerComponent onSelectImage={handleImageSelect}  buttonText="Chọn ảnh/video" />
                        </Modal>
                        <MessageForward visible={visibleMessageForward} onDismiss={hideModalMessageForward} senderId={sender.id} onSend={forwardMessage} />
                        {/* <StipopSender/> */}
                        <Dialog isVisible={visible3}>
                            <Dialog.Loading/>
                        </Dialog>
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