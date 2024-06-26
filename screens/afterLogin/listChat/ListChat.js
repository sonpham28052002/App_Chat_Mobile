import { View, Text, TouchableOpacity, Dimensions, Image, FlatList, SafeAreaView, Platform, Alert } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { addLastMessage, retrieveLastMessage, addLastConversation, deleteConv, 
  retrieveMess, addMess, deleteMess, initSocket, visibleModal, notify, addFriendRequest, reactMessage, seenMessage, saveCall,updateListUserOnline,setListUserOnline } from '../../../Redux/slice';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import ModalAddChat from './components/ModalAddChat';
import ModalCreateGroup from './components/ModalCreateGroup';
import ModalAddFriend from './components/ModalAddFriend';
import { onMessageReceive } from '../../../function/socket/onReceiveMessage';
import { getConversation } from '../../../function/getLastConversationByUserId';
import host from '../../../configHost'
import * as ZIM from 'zego-zim-react-native';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZPNs from 'zego-zpns-react-native';
import 'react-native-get-random-values';
import { getFriendByUser } from '../../../function/getListFriendByUser';
const { v4: uuidv4 } = require('uuid');

const ListChat = ({ navigation,route }) => {
  const { width } = Dimensions.get('window');
  var stompClient = useRef(null);
  const socketConnected = useSelector((state) => state.socket.connected);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  const routeId = route.params.id;
  const account = useSelector((state) => state.account);
  const idFromRedux = account ? account.id : undefined;
  const id = idFromRedux !== undefined ? idFromRedux : routeId;
            
  // account reducer
  // const id = useSelector((state) => state.account.id);
  const currentUser = useSelector((state) => state.account);
  const [conversations, setConversations] = useState(currentUser.conversation);
  let conversationsRef = useRef(conversations);

  // message reducer
  const receiverId = useSelector((state) => state.message.id);
  let r = useRef('');

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);

  // visible modal option (add friend, create group)
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // visible modal add friend
  const [visibleAddFriend, setVisibleAddFriend] = useState(false);
  const showModalAddFriend = () => setVisibleAddFriend(true);
  const hideModalAddFriend = () => setVisibleAddFriend(false);

  // visible modal create group
  const [visibleCreateGroup, setVisibleCreateGroup] = useState(false);
  const showModalCreateGroup = () => setVisibleCreateGroup(true);
  const hideModalCreateGroup = () => setVisibleCreateGroup(false);
//user online
  const usersOnline = useSelector((state) => state.user.listUserOnline);
  const [online, setOnline] = useState(false);
  const [userStatus, setUserStatus] = useState(online?"Đang hoạt động":"Offline");

  const [deleteTimeout, setDeleteTimeout] = useState(null);

  useEffect(() => {
    r.current = receiverId;
  }, [receiverId]);

  useEffect(() => {
    setConversations(currentUser.conversation);
  }, [currentUser.conversation]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    if (!socketConnected) {
      let socket = new SockJS(`${host}ws`);
      stompClient.current = Stomp.over(socket);
      stompClient.current.connect({login:id}, onConnected, onError);
      setIsConnected(true);
      dispatch(initSocket(true));
    }
    onUserLogin(id, currentUser.userName);
  }, [id])

  useEffect(() => {
    if (!socketConnected && isConnected) {
      stompClient.current.disconnect(() => console.log('Socket disconnected'));
      setIsConnected(false);
    }
  }, [socketConnected])

  const onConnected = () => {
    stompClient.current.subscribe('/user/' + id + '/singleChat', onReceiveMessage)
    stompClient.current.subscribe('/user/' + id + '/groupChat', onGroupMessageReceived)
    stompClient.current.subscribe('/user/' + id + '/retrieveMessage', onRetrieveMessage)
    stompClient.current.subscribe('/user/' + id + '/deleteMessage', onDeleteResult)
    stompClient.current.subscribe('/user/' + id + '/createGroup', onCreateGroup)
    stompClient.current.subscribe('/user/' + id + '/deleteConversation', onReceiveDeleteConversationResponse);
    stompClient.current.subscribe('/user/' + id + '/requestAddFriend', onRequestAddFriend)
    stompClient.current.subscribe('/user/' + id + '/acceptAddFriend', onAcceptAddFriend)
    stompClient.current.subscribe('/user/' + id + '/react-message', onReactMessage)
    stompClient.current.subscribe('/user/' + id + '/removeMemberInGroup', onRemoveMemberInGroup)
    // stompClient.current.subscribe('/user/' + id + '/addMemberIntoGroup', onCreateGroup)
    // stompClient.current.subscribe('/user/' + id + '/outGroup', onCreateGroup)
     stompClient.current.subscribe('/user/' + id + '/ListUserOnline', onListUserOnline)
    stompClient.current.subscribe('/user/' + id + '/outGroup', onOutGroup)
  }
  useEffect(() => {
    console.log('Danh sách người dùng trực tuyến đã thay đổi:', usersOnline);
  }, [usersOnline]);

 const onListUserOnline = (payload) => {
    console.log("Màn hình ListChat", payload.body);
    const newUsersOnlineData = JSON.parse(payload.body);
    console.log(newUsersOnlineData);
    dispatch(updateListUserOnline(newUsersOnlineData));

    const isSingleChat = conversations.some(conv => conv.conversationType === "single" && newUsersOnlineData.includes(conv.user.id));
    if (isSingleChat) {
        setOnline(true);
        console.log(online);
    } else {
        setOnline(false);
    }
};
useEffect(() => {
    setUserStatus(online ? "Đang hoạt động" : "Offline");
    console.log("Trạng thái người dùng:", userStatus);
}, [online]);

  const onCreateGroup = (payload) => {
    const conversation = JSON.parse(payload.body);
    dispatch(addLastConversation(conversation));
  }

  const checkIsChatting = (senderId, messageReceiverId) => {
    if (messageReceiverId.indexOf('_') === -1) {
      if ((senderId === id && messageReceiverId === r.current)
        || (senderId === r.current && messageReceiverId === id))
        return true;
      return false;
    } else {// receriverId is group
      let idGroup = messageReceiverId.split('_')[1];
      return idGroup === r.current;
    }
  }

  const onReceiveMessage = (payload) => {
    const message = JSON.parse(payload.body);
    let userId = message.sender.id == id ? message.receiver.id : message.sender.id;
    let index = conversationsRef.current.findIndex(conv => conv.user && conv.user.id === userId);
    //update message in listchat
    const dispatchNotification = (conv) => {
      if (message.sender.id !== id) {
        dispatch(notify({
          userName: conv.user.userName, avt: conv.user.avt,
          content: message.messageType === "CALLSINGLE" ? message.titleFile.startsWith('Cuộc gọi') ? '[Cuộc gọi]' : '[Cuộc gọi nhỡ]'
          : message.messageType === "STICKER" ? '[Sticker]'
          : message.messageType === "Text" ? message.content :
              message.messageType === "PNG" || message.messageType === "JPG" || message.messageType === "JPEG" ? '[Hình ảnh]' :
                message.messageType === "PDF" || message.messageType === "DOC" || message.messageType === "DOCX" ||
                  message.messageType === "XLS" || message.messageType === "XLSX" || message.messageType === "PPT" ||
                  message.messageType === "PPTX" || message.messageType === "RAR" || message.messageType === "ZIP" ? message.titleFile :
                  message.messageType === "AUDIO" ? '[Audio]' : message.messageType === "VIDEO" ? '[Video]' : '',
          type: 'single-chat'
        }));
        dispatch(visibleModal(true));
      }
    }
    if (index === -1) {
      getConversation(id).then(conv => {
        dispatchNotification(conv);
        dispatch(addLastConversation(conv));
      })
    } else {
      dispatchNotification(conversations[index]);
      dispatch(addLastMessage({ message: message, index: index }));
      // kiểm tra xem tin nhắn nhận được có phải tin nhắn với người dùng đang chat hay không
      if (checkIsChatting(message.sender.id, message.receiver.id)) {
        let newMess = onMessageReceive(message,
          { id: currentUser.id, userName: currentUser.userName, avt: currentUser.avt },
          conversations[index].user)
        if (newMess)
          dispatch(addMess(newMess))
      }
    }
  }

  const onGroupMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    let idGroup = message.receiver.id.split('_')[1];
    let index = conversationsRef.current.findIndex(conv => conv.idGroup === idGroup);
    const dispatchNotification = (conv) => {
      if (message.sender.id !== id) {
        dispatch(notify({
          userName: conv.nameGroup,
          avt: conv.avtGroup,
          content: message.messageType === "NOTIFICATION" ? "Bạn đã được thêm vào nhóm" :
          message.messageType === "CALLGROUP" ? "[Cuộc gọi nhóm]" :
          message.messageType === "STICKER" ? '[Sticker]' :  
          message.messageType === "Text" ? message.content :
              message.messageType === "PNG" || message.messageType === "JPG" || message.messageType === "JPEG" ? '[Hình ảnh]' :
                message.messageType === "PDF" || message.messageType === "DOC" || message.messageType === "DOCX" ||
                  message.messageType === "XLS" || message.messageType === "XLSX" || message.messageType === "PPT" ||
                  message.messageType === "PPTX" || message.messageType === "RAR" || message.messageType === "ZIP" ? message.titleFile :
                  message.messageType === "AUDIO" ? '[Audio]' : message.messageType === "VIDEO" ? '[Video]' : '',
          type: 'group-chat'
        }));
        if (message.messageType !== 'NOTIFICATION' || (message.messageType === 'NOTIFICATION' && message.notificationType === 'ADD_MEMBER') ) dispatch(visibleModal(true));
      }
    };

    if(message.titleFile && message.titleFile === 'Bắt đầu cuộc gọi nhóm') 
      dispatch(saveCall({idGroup: idGroup, url: message.url}));
    if(index == -1)
      getConversation(id).then(conv => {
        dispatchNotification(conv);
        dispatch(addLastConversation(conv));
      })
    else {
      dispatchNotification(conversationsRef.current[index]);
      dispatch(addLastMessage({ message: message, index: index }));
      // kiểm tra xem tin nhắn nhận được có phải tin nhắn trong group đang chat hay không
      if (checkIsChatting(message.sender.id, message.receiver.id)) {
        getListMember(id, idGroup).then(members => {
          let newMess = onMessageReceive(message,
            { id: currentUser.id, userName: currentUser.userName, avt: currentUser.avt },
            { id: idGroup, members: members })
          if (newMess)
            dispatch(addMess(newMess))
        })
      }
    }
    
  }

  const onRetrieveMessage = (payload) => {
    let message = JSON.parse(payload.body)
    let index = conversationsRef.current.findIndex(conv => conv.lastMessage?.id === message.id);
    if (index !== -1)
      dispatch(retrieveLastMessage(index));
    if (checkIsChatting(message.sender.id, message.receiver.id))
      dispatch(retrieveMess(message.id));
  }

  const onDeleteResult = (payload) => {
    let message = JSON.parse(payload.body)
    if (checkIsChatting(message.sender.id, message.receiver.id)) {
      dispatch(deleteMess(message.id));
    }
  }

  const onReceiveDeleteConversationResponse = async (payload) => {
    const conversation = JSON.parse(payload.body);
    if (conversation.idGroup)
      dispatch(deleteConv(conversation.idGroup));
    else dispatch(deleteConv(conversation.user.id));
  }

  const onRemoveMemberInGroup = (payload) => {
    const message = JSON.parse(payload.body);
    const userRemovedId = message.lastMessage.user.id;
    if(userRemovedId === id){
      Alert.alert(`Bạn đã bị xoá ra khỏi nhóm chat \"${message.nameGroup}\"`)
      dispatch(deleteConv(message.idGroup));
      navigation.navigate('ListChat');
    }
  }

  const onOutGroup = (payload) => {

  }

  const onRequestAddFriend = (payload) => {
    const friendRequest = JSON.parse(payload.body);
    dispatch(addFriendRequest(friendRequest));
    if (friendRequest.sender.id !== id) {
      dispatch(notify({
        userName: friendRequest.sender.userName, avt: friendRequest.sender.avt,
        type: "request-add-friend"
      }));
      dispatch(visibleModal(true));
    }
  }

  const onAcceptAddFriend = (payload) => {
    const friendRequest = JSON.parse(payload.body);
    if (friendRequest.sender.id === id) {
      getFriendByUser(id, friendRequest.receiver.id).then(friend => {
        dispatch(notify({
          userName: friend.user.userName, avt: friend.user.avt,
          type: "accept-add-friend"
        }));
        dispatch(visibleModal(true));
      })
    }
  }

  const onReactMessage = (payload) => {
    const message = JSON.parse(payload.body);
    dispatch(reactMessage({ id: message.id, react: message.react }));
  }

  const onError = (error) => {
    console.log('Could not connect to WebSocket server. Please refresh and try again!');
  }

  const calcTime = (time) => {
    const date = new Date(time);
    date.setUTCHours(date.getUTCHours() + 7);
    const now = new Date();
    const diff = now - date;
    const seconds = diff / 1000;
    if (seconds < 60) return 'Vừa xong';

    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)} phút`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)} giờ`;
    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)} ngày`;
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const handleShowModalCreateGroup = () => {
    hideModal();
    showModalCreateGroup();
  }

  const handleShowModalAddFriend = () => {
    hideModal();
    showModalAddFriend();
  }

  const createGroup = (data) => {
    stompClient.current.send('/app/createGroup', {}, JSON.stringify(data));
    hideModalCreateGroup();
  }
  const [secondsLeft, setSecondsLeft] = useState(10);

  // const handleDelete = (item) => {
  //   setSelectedItem(item);
  //   setDeleteMode(true);
  //   setSecondsLeft(10);
  //   setIsRes(true)
  //   startDeleteTimeout();
  // };

  const cancelDelete = () => {
    clearTimeout(deleteTimeout);
    setDeleteMode(false);
  };

  // const restoreConversation = () => {
  //   cancelDelete();
  //   setIsRes(false)
  // };

  const startDeleteTimeout = () => {
    const timeout = setInterval(() => {
      setSecondsLeft(prevSeconds => prevSeconds - 1);
      if (secondsLeft === 1) {
        clearInterval(timeout);
        deleteConversation(selectedItem);
        setDeleteMode(false);
      }
    }, 1000);

    setDeleteTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      clearTimeout(deleteTimeout);
    };
  }, [deleteMode]);

  const deleteConversation = (item) => {
    if (!item) {
      console.error("Item Error:", item);
      return;
    }

    const con = {
      ownerId: id,
      idUser: "",
      idGroup: ""
    };

    if (item.conversationType === "group" && item.idGroup) {
      con.idGroup = item.idGroup;
    } else if (item.user && item.user.id) {
      con.idUser = item.user.id;
    } else {
      console.error("Invalid Item:", item);
      return;
    }
    stompClient.current.send('/app/deleteConversation', {}, JSON.stringify(con));

    // const updatedConversations = conversations.filter(conv => {
    //   if (item.conversationType === "group") {
    //     return conv.idGroup !== item.idGroup;
    //   } else {
    //     return conv.user.id !== item.user.id;
    //   }
    // });

    // setConversations(updatedConversations);

    setSelectedItem(null);
    setDeleteMode(false);
  }

  const addFriend = (data) => {
    stompClient.current.send('/app/request-add-friend', {}, JSON.stringify(data));
    hideModalAddFriend();
  }

  const getMember = (data, id) => {
    return data.filter(item => item.member.id == id)[0]
  }

  const getListMember = async (senderId, groupId) => {
    let api = `${host}messages/getMemberByIdSenderAndIdGroup?idSender=${senderId}&idGroup=${groupId}`
    const result = await axios.get(api)
    try {
      if (result.data) {
        return result.data
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onUserLogin = async (userID, userName) => {
    var a = ZegoUIKitPrebuiltCallService.init(
      940263346, // You can get it from ZEGOCLOUD's console
      '40da48b6a31a24ddfc594d8c998e7bb36a542e86f83697fb889f2b85bf1c572a', // You can get it from ZEGOCLOUD's console
      userID, // It can be any valid characters, but we recommend using a phone number.
      userName,
      [ZIM, ZPNs],
      {
        onIncomingCallDeclineButtonPressed: (navigation) => {
          console.log('onIncomingCallDeclineButtonPressed: ', navigation);
        },
        onIncomingCallAcceptButtonPressed: (navigation) => {
          console.log('onIncomingCallAcceptButtonPressed: ', navigation);
        },
        onOutgoingCallCancelButtonPressed: (navigation, callID, invitees, type) => {
          console.log('onOutgoingCallCancelButtonPressed: ', navigation, callID, invitees, type);
        },
        onIncomingCallReceived: (callID, type, invitees) => {
          console.log('Incoming call: ', callID, type, invitees)
        },
        onIncomingCallCanceled: (callID, inviter) => {
          console.log('Incoming call canceled: ', callID, inviter)
        },
        onOutgoingCallAccepted: (callID, invitee) => {
          console.log('Outgoing call accepted: ', callID, invitee)
          var chatMessage = {
            id: uuidv4(),
            sender: { id: id },
            seen: [{ id: id }],
            replyMessage: null,
            reply: null,
            messageType: 'CALLSINGLE',
            receiver: { id: invitee.userID },
            react: [],
            size: 0,
            titleFile: 'Cuộc gọi video từ ',
            url: null
          };
          stompClient.current.send('/app/private-single-message', {}, JSON.stringify(chatMessage));
        },
        // onOutgoingCallRejectedCauseBusy: (callID, invitee) => {
        //   console.log('onOutgoingCallRejectedCauseBusy: ', callID, invitee);
        // },
        onOutgoingCallDeclined: (callID, invitee) => {
          console.log('Outgoing call declined: ', callID, invitee);
          var chatMessage = {
            id: uuidv4(),
            sender: { id: id },
            seen: [{ id: id }],
            replyMessage: null,
            reply: null,
            messageType: 'CALLSINGLE',
            receiver: { id: invitee.userID },
            react: [],
            size: 0,
            titleFile: ' từ chối cuộc gọi video từ ',
            url: null
          };
          stompClient.current.send('/app/private-single-message', {}, JSON.stringify(chatMessage));
        },
        onIncomingCallTimeout: (callID, inviter) => {
          console.log('Incoming call timeout: ', callID, inviter)
          var chatMessage = {
            id: uuidv4(),
            sender: { id: id },
            seen: [{ id: id }],
            replyMessage: null,
            reply: null,
            messageType: 'CALLSINGLE',
            receiver: { id: inviter.userID },
            react: [],
            size: 0,
            titleFile: 'bị nhở cuộc gọi video từ ',
            url: null
          };
          stompClient.current.send('/app/private-single-message', {}, JSON.stringify(chatMessage));
        },
        onOutgoingCallTimeout: (callID, invitees) => {
          console.log('Outgoing call timeout: ', callID, invitees)
          var chatMessage = {
            id: uuidv4(),
            sender: { id: id },
            seen: [{ id: id }],
            replyMessage: null,
            reply: null,
            messageType: 'CALLSINGLE',
            receiver: { id: invitees[0].userID },
            react: [],
            size: 0,
            titleFile: 'bị nhở cuộc gọi video từ ',
            url: null
          };
          stompClient.current.send('/app/private-single-message', {}, JSON.stringify(chatMessage));
        },
        ringtoneConfig: {
          incomingCallFileName: require('../../../assets/ringtone-205162.mp3'),
          outgoingCallFileName: require('../../../assets/happy-pop-1-185286.mp3'),
        },
        androidNotificationConfig: {
          channelID: 'ZegoUIKit',
          channelName: 'ZegoUIKit',
        },
      },
    );
    return a;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableOpacity onPress={() => navigation.navigate('Search')}
        style={{
          backgroundColor: 'cyan',
          height: 50, flexDirection: 'row',
          width: '100%', justifyContent: 'space-between', alignItems: 'center'
        }}>
        <View style={{ width: 45, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
          <FontAwesome name="search" size={40} color="white" />
        </View>
        <View style={{
          fontSize: 20, height: 40, width: '60%',
          backgroundColor: 'white', borderRadius: 5, borderWidth: 1, justifyContent: 'center', paddingLeft: 5
        }}>
          <Text style={{ fontSize: 18 }}>Tìm kiếm...</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("ScanQR")}>
          <FontAwesome name="qrcode" size={35} color="white" />
        </TouchableOpacity>
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity onPress={() =>
            // navigation.navigate('CreateMessager')
            showModal()
          }>
            <AntDesign name="adduser" size={35} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View>
        <FlatList
          scrollEnabled={true}
          data={conversations}
          renderItem={({ item }) => (
            (item.user || (item.status && item.status !== "DISBANDED" && getMember(item.members, id) && getMember(item.members, id).memberType != "LEFT_MEMBER")) &&
            <View>
              <TouchableOpacity
                style={{
                  height: 70, flexDirection: 'row', alignItems: 'center',
                  flex: 1
                }}
                onPress={() => {
                  let index = -1
                  if(item.user)
                    index = conversationsRef.current.findIndex(conv => conv.user && conv.user.id === item.user.id);
                  else
                    index = conversationsRef.current.findIndex(conv => conv.idGroup && conv.idGroup === item.idGroup);
                  dispatch(seenMessage({id: id, index: index}));
                  navigation.navigate("Chat", item.user ? item.user :
                  { online: item.user ? usersOnline.some(user => user.id === item.user.id) : false,
                  id: item.idGroup, avt: item.avtGroup, nameGroup: item.nameGroup, status: item.status, members: item.members, memberType: getMember(item.members, id).memberType})}
                }
                onLongPress={() => {
                  setSelectedItem(item);
                  setDeleteMode(true);
                }}
              >
                <View style={{ width: 65, paddingHorizontal: 7, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={{ uri: item.user ? item.user.avt : item.avtGroup }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                </View>
                <View style={{ width: width - 65, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                  <View style={{
                    width: width - 145, paddingHorizontal: 10,
                    height: 70, justifyContent: 'center'
                  }}>
                    <Text style={{ fontSize: 20 }} numberOfLines={1}>{item.user ? item.user.userName : item.nameGroup}</Text>
                    {
                      deleteMode && selectedItem === item && // Hiển thị nút xóa nếu ở trạng thái xóa và mục được chọn
                      <TouchableOpacity onPress={() => deleteConversation(item)}>
                        <AntDesign name="delete" size={24} color="red" />
                      </TouchableOpacity>
                    }
                    {
                        item.lastMessage ? item.lastMessage.sender.id === id ?
                          <Text style={{ fontSize: 14, color: 'grey' }} numberOfLines={1}>
                            {
                            item.lastMessage.messageType == 'STICKER' ? 'Bạn: [Sticker]' :
                            item.lastMessage.messageType == 'CALLSINGLE' ? 'Bạn: [Cuộc gọi]' :
                            item.lastMessage.messageType == 'CALLGROUP' ? '[Cuộc gọi nhóm]' :
                            item.lastMessage.messageType == 'RETRIEVE' ? 'Bạn đã thu hồi một tin nhắn' :
                            item.lastMessage.messageType == 'PNG' || item.lastMessage.messageType == 'JPG' || item.lastMessage.messageType == 'JPEG' ?
                              'Bạn: [Hình ảnh]' : item.lastMessage.messageType == 'PDF' || item.lastMessage.messageType == 'DOC' || item.lastMessage.messageType == 'DOCX'
                            || item.lastMessage.messageType == 'XLS' || item.lastMessage.messageType == 'XLSX' || item.lastMessage.messageType == 'PPT'
                            || item.lastMessage.messageType == 'PPTX' || item.lastMessage.messageType == 'RAR' || item.lastMessage.messageType == 'ZIP' ?
                              'Bạn: ' + item.lastMessage.titleFile :
                            item.lastMessage.messageType == 'AUDIO' ? 'Bạn: [Audio]' : item.lastMessage.messageType == 'VIDEO' ?
                              'Bạn: [Video]' : item.lastMessage.messageType == 'Text' ? 'Bạn: ' + item.lastMessage.content :
                              item.lastMessage.content === "đã tham gia cuộc gọi."? 'Bạn đã tham gia cuộc gọi nhóm' :
                            item.lastMessage.content.includes('tạo') ? 'Bạn đã là thành viên của nhóm' :
                            item.lastMessage.content.includes('ảnh') ? 'Bạn đã thay đổi ảnh nhóm' :
                            item.lastMessage.content.includes('đã thay đổi tên nhóm') ? 'Bạn ' + item.lastMessage.content :
                            item.lastMessage.content.includes('tham gia') ? 'Bạn đã tham gia cuộc gọi nhóm' :
                            item.lastMessage.content.includes('rời') ? 'Một thành viên đã rời khỏi nhóm' :
                            item.lastMessage.content.includes('thêm') ? 'Một thành viên mới được thêm vào nhóm' :
                            item.lastMessage.content.includes('phân') ? 'Một thành viên được phân làm phó nhóm' :
                            item.lastMessage.content.includes('tước') ? 'Một phó nhóm đã bị tước quyền' :
                            item.lastMessage.content.includes('nhường') ? 'Trưởng nhóm đã nhường quyền lại cho một thành viên' :
                            item.lastMessage.content.includes('mời') ? 'Một thành viên đã bị xoá ra khỏi nhóm' :
                            item.lastMessage.content.includes('thêm') ? 'Một thành viên mới được thêm vào nhóm' :
                            item.lastMessage.content.includes('phân') ? 'Một thành viên được phân làm phó nhóm' :
                            item.lastMessage.content.includes('tước') ? 'Một phó nhóm đã bị tước quyền' :
                            item.lastMessage.content.includes('nhường') ? 'Trưởng nhóm đã nhường quyền lại cho một thành viên' : ''}
                          </Text>
                          :
                          <Text style={{
                            fontSize: 14, color: item.lastMessage && item.lastMessage.seen?.some(item => item.id === id)? 'grey' : 'black',
                            fontWeight: item.lastMessage && item.lastMessage.seen?.some(item => item.id === id)? 'normal' : 'bold'
                          }} numberOfLines={1}>
                            {
                              item.lastMessage.messageType == 'STICKER' ? '[Sticker]' :
                              item.lastMessage.messageType == 'CALLSINGLE' ? '[Cuộc gọi]' :
                              item.lastMessage.messageType == 'CALLGROUP' ? '[Cuộc gọi nhóm]' :
                              item.lastMessage.messageType == 'RETRIEVE' ? 'Đã thu hồi một tin nhắn' :
                              item.lastMessage.messageType == 'PNG' || item.lastMessage.messageType == 'JPG' || item.lastMessage.messageType == 'JPEG' ?
                                '[Hình ảnh]' : item.lastMessage.messageType == 'PDF' || item.lastMessage.messageType == 'DOC' || item.lastMessage.messageType == 'DOCX'
                              || item.lastMessage.messageType == 'XLS' || item.lastMessage.messageType == 'XLSX' || item.lastMessage.messageType == 'PPT'
                              || item.lastMessage.messageType == 'PPTX' || item.lastMessage.messageType == 'RAR' || item.lastMessage.messageType == 'ZIP' ?
                              item.lastMessage.titleFile :
                              item.lastMessage.messageType == 'AUDIO' ? '[Audio]' : item.lastMessage.messageType == 'VIDEO' ?
                                '[Video]' : item.lastMessage.messageType == 'Text' ? item.lastMessage.content :
                              item.lastMessage.content === "đã tham gia cuộc gọi."? 'Ai đó đã tham gia cuộc gọi nhóm' :
                              item.lastMessage.content.includes('tham gia') ? 'Ai đó đã tham gia cuộc gọi nhóm' :
                              item.lastMessage.content.includes('tạo') ? 'Bạn đã là thành viên của nhóm' :
                              item.lastMessage.content.includes('đã thay đổi tên nhóm') ? 'Ai đó ' + item.lastMessage.content :
                              item.lastMessage.content.includes('ảnh') ? 'Ai đó đã thay đổi ảnh nhóm' :
                              item.lastMessage.content.includes('rời') ? 'Một thành viên đã rời khỏi nhóm' :
                              item.lastMessage.content.includes('mời') ? 'Một người tham gia đã bị xoá ra khỏi nhóm' :
                              item.lastMessage.content.includes('thêm') ? item.lastMessage.user.id === id ? 'Bạn đã được thêm vào nhóm' : 'Một thành viên mới được thêm vào nhóm' :
                              item.lastMessage.content.includes('phân') ? 'Một thành viên được phân làm phó nhóm' :
                              item.lastMessage.content.includes('tước') ? 'Một phó nhóm đã bị tước quyền' :
                              item.lastMessage.content.includes('nhường') ? 'Trưởng nhóm đã nhường quyền lại cho một thành viên' : ''
                            }
                            </Text>
                          : null
                    }
                  </View>
                  <View style={{ width: 70, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                    {item.lastMessage && <Text style={{ fontSize: 12, color: 'grey' }} numberOfLines={1}>{calcTime(item.lastMessage.senderDate)}</Text>}
                  </View>
                </View>
              </TouchableOpacity>
              {deleteMode && selectedItem === item && (
                <View style={{}}>
                  {/* <TouchableOpacity onPress={restoreConversation}>
                    <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', height: 50 }}>
                      <Text style={{ fontSize: 14, color: 'red' }}>{secondsLeft} giây còn lại</Text>
                      <Text style={{ color: 'red' }}>Khôi phục</Text>
                    </View>
                  </TouchableOpacity> */}
                  <TouchableOpacity onPress={() => setDeleteMode(false)}>
                    <View style={{ backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center', height: 50 }}>
                      <Text style={{ color: 'white' }}>Hủy Xóa</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )
          }
          keyExtractor={(item) => item.updateLast}
        />
      </View>
      <ModalAddChat visible={visible} onDismiss={hideModal} handleShowModalAddFriend={handleShowModalAddFriend} handleShowModalCreateGroup={handleShowModalCreateGroup} />
      <ModalCreateGroup visible={visibleCreateGroup} senderId={id} onPress={createGroup} onDismiss={hideModalCreateGroup} />
      <ModalAddFriend visible={visibleAddFriend} onDismiss={hideModalAddFriend} onPress={addFriend} />
    </SafeAreaView >
  );
}

export default ListChat;