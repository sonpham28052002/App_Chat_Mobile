import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Modal, Portal, PaperProvider } from 'react-native-paper';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import EmojiPicker from 'rn-emoji-keyboard'
import { Dialog } from '@rneui/themed';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { saveReceiverId, saveMess } from '../../../Redux/slice';
import axios from 'axios';
import ImagePickerComponent from '../../../components/ImagePickerComponent';
import FilePickerComponent from '../../../components/FilePickerComponent';
import MessageForward from './components/MessageForward';
import { getMessage } from '../../../function/socket/loadMessage';
import ModalOperationMessage from './components/ModalOperationMessage';
import GiftedChatComponent from './components/GiftedChatComponent';
import { convertMessageGiftedChatToMessage } from '../../../function/convertMessageGiftedChatToMessage';
import host from '../../../configHost'
import { useFocusEffect } from '@react-navigation/native';
import 'react-native-get-random-values';
const { v4: uuidv4 } = require('uuid');

const Chat = ({ navigation, route }) => {
    const { width, height } = Dimensions.get('window');
    const dispatch = useDispatch();
    var stompClient = useRef(null);
    const [mess, setMess] = useState('');
    const textInputRef = useRef(null);
    const [position, setPosition] = useState({ start: 0, end: 0 });
    const [showEmoji, setShowEmoji] = useState(false);
    const [messLoad, setMessLoad] = useState([]);

    // message when long press
    const [messTarget, setMessTarget] = useState();

    // message when reply
    const [messageReply, setMessageReply] = useState(null);

    // account reducer
    const sender = useSelector((state) => state.account);

    // message reducer
    const receiverId = useSelector((state) => state.message.id);
    const messages = useSelector((state) => state.message.messages);

    const [uriImage, setUriImage] = useState(null);
    const [uriFile, setUriFile] = useState(null);
    const [uriVideo, setUriVideo] = useState(null);
    const [audio, setAudio] = useState(null);
    const [size, setSize] = useState(0);
    const [sizeImage, setSizeImage] = useState(0);
    const [sizeVideo, setSizeVideo] = useState(0);
    const [sizeAudio, setSizeAudio] = useState(0);
    const [durationInSeconds, setdurationInSeconds] = useState(0);

    let listMember = useRef([]);

    // visible modal recall message, forward message, delete message
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    // visible modal select image, file
    const [visible2, setVisible2] = useState(false);
    const showModal2 = () => setVisible2(true);
    const hideModal2 = () => setVisible2(false);

    // visible modal loading
    const [visible3, setVisible3] = useState(false);
    const toggleDialog3 = () => setVisible3(!visible3);

    // visible modal forward message
    const [visibleMessageForward, setVisibleMessageForward] = useState(false);
    const showModalMessageForward = () => setVisibleMessageForward(true);
    const hideModalMessageForward = () => setVisibleMessageForward(false);

    useEffect(() => {
        navigation.setOptions({
            title: route.params.userName ? route.params.userName : route.params.nameGroup,
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

        const socket = new SockJS(`${host}ws`);
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, onConnected, onError);

        if (receiverId !== route.params.id) {
            toggleDialog3();
            dispatch(saveReceiverId(route.params.id));
            dispatch(saveMess([]));
            if (route.params.nameGroup) {
                getListMember().then(() => {
                    getMessage(sender, { id: route.params.id, members: listMember.current }).then(messages => {
                        if (messages.length > 0) setMessLoad(messages);
                        else {
                            setVisible3(false);
                        };
                    });
                })
            } else
                getMessage(sender, route.params).then(messages => {
                    if (messages.length > 0) setMessLoad(messages);
                    else setVisible3(false);
                });
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                if (stompClient.current) {
                    stompClient.current.disconnect();
                }
            }
        }, [])
    );

    useEffect(() => {
        if (messLoad.length > 0){
            dispatch(saveMess(messLoad.reverse()));
            toggleDialog3();
        }
    }, [messLoad]);

    useEffect(() => {
        hideModal()
    }, [messages]);

    const getListMember = async () => {
        let api = `${host}messages/getMemberByIdSenderAndIdGroup?idSender=${sender.id}&idGroup=${route.params.id}`
        const result = await axios.get(api)
        try {
            if (result.data){
                listMember.current = [...result.data];
            }
        } catch (error) {
            console.log(error);
        }
    }

    function onConnected() {
        stompClient.current.subscribe('/user/' + sender.id + '/removeMemberInGroup', (payload)=>{
            let message = JSON.parse(payload.body)
            let members = message.members;
            let isRemove = members.filter(item => item.member.id == sender.id && item.memberType == "LEFT_MEMBER");
            if(route.params.id === message.idGroup && isRemove.length > 0){
                Alert.alert("Bạn đã bị xóa khỏi nhóm chat");
                navigation.navigate('ListChat')
            }
        })
    }

    function onError(error) {
        console.log('Could not connect to WebSocket server. Please refresh and try again!');
    }

    function sendMessage(id, type) {
        if (stompClient.current) {
            var chatMessage = {
                id: id,
                sender: { id: sender.id },
                replyMessage: messageReply? convertMessageGiftedChatToMessage(messageReply, sender.id, route.params.id, getFileExtension) : null,
                reply: messageReply? convertMessageGiftedChatToMessage(messageReply, sender.id, route.params.id, getFileExtension) : null
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
        let dataMessage = convertMessageGiftedChatToMessage(messTarget, sender.id, route.params.id, getFileExtension);
        let listMessage = dataSend.map(item => ({ ...dataMessage, sender:{ id: sender.id }, receiver: item.id.indexOf('-') === -1? { id: item.id } : { id: "group_" + item.id}}));
        stompClient.current.send("/app/forward-message", {}, JSON.stringify(listMessage));
        hideModalMessageForward();
    }

    const handleSend = () => {
        if (mess.trim() === '' && !uriImage && !uriFile && !uriVideo && !audio) {
            Alert.alert("Chưa gửi tin nhắn hoặc chọn ảnh, video hoặc file");
        } else {
            const id = uuidv4();
            if (mess.trim() !== '') {
                sendMessage(id, 'Text');
                setMess(''); // Clear the TextInput value after sending
            } else if (uriImage) {
                sendMessage(id, "Image");
                setUriImage(null);
            } else if (uriFile) {
                sendMessage(id, 'File');
                setUriFile(null);
            } else if (uriVideo) {
                sendMessage(id, "Video");
                setUriVideo(null);
            } else if (audio) {
                sendMessage(id, "Audio");
                setAudio(null);
            }
            setMessageReply(null);
        }
    };

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

    const getFileExtension = (uri) => {
        return uri.substring(uri.lastIndexOf(".") + 1);
    };

    const handleFocusText = () => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };

    return (
        <View style={{ width: width, flex: 1, height: height - 80, justifyContent: 'space-between' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}
                keyboardVerticalOffset={50}
                behavior={Platform.OS == "ios" ? "padding" : undefined}
            >
                <PaperProvider>
                    <Portal style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <ModalOperationMessage visible={visible} onDismiss={hideModal} messTarget={messTarget} senderId={sender.id} 
                            onPressRecall={() => {
                                if (stompClient.current) {
                                    let messSend = convertMessageGiftedChatToMessage(messTarget, sender.id, route.params.id, getFileExtension)
                                    if(route.params.nameGroup)
                                        messSend = { ...messSend, receiver: { id: "group_"+route.params.id } }
                                    stompClient.current.send("/app/retrieve-message", {},
                                        JSON.stringify(messSend));
                                }
                            }}
                            onPressForward={() => {
                                hideModal();
                                showModalMessageForward();
                            }}
                            onPressDelete={() => {
                                if (stompClient.current) {
                                    let deleteMessage = convertMessageGiftedChatToMessage(messTarget, sender.id, route.params.id, getFileExtension)
                                    delete deleteMessage.senderDate
                                    let idGroup = route.params.nameGroup? route.params.id : ''
                                    let ownerId = sender.id
                                    stompClient.current.send("/app/delete-message", {},
                                        JSON.stringify({ ...deleteMessage, idGroup, ownerId }));
                                }
                            }}
                            onPressReply={() => {
                                setMessageReply(messTarget);
                                handleFocusText();
                                hideModal();
                            }}
                        />
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
                        <MessageForward visible={visibleMessageForward} onDismiss={hideModalMessageForward} sender={sender} onSend={forwardMessage} />
                        {/* <StipopSender/> */}
                        <Dialog isVisible={visible3}>
                            <Dialog.Loading/>
                        </Dialog>
                    </Portal>
                    <View style={{ height: height - 80, backgroundColor: 'lightgray', marginBottom: 25 }}>
                        <GiftedChatComponent messages={messages} mess={mess} onChangeText={setMess} position={position} textInputRef={textInputRef} 
                            onCloseReply={()=>{setMessageReply(null)}} messageReply={messageReply} status={route.params.status? route.params.status : null} memberType={route.params.memberType? route.params.memberType : null} senderId={sender.id} fileExtension={getFileExtension}
                            onPress={() => {
                                setShowEmoji(!showEmoji);
                                handleFocusText();
                            }}
                            user={{
                                _id: sender.id,
                                name: sender.userName,
                                avatar: sender.avt
                            }}
                            onLongPress={(context, message) => {
                                showModal();
                                setMessTarget(message);
                            }}
                            // renderMessage={(messageProps) => renderMessage(messageProps)}
                            onSelectionChange={event => setPosition(event.nativeEvent.selection)}
                            onPressModal2={showModal2}
                            onSelectAudio={handleAudioSelect}
                            handleSend={handleSend}
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

export default Chat;