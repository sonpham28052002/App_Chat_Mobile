import { View, Text, TouchableOpacity, Dimensions, Image, FlatList, SafeAreaView, Platform } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
// import { TextInput, Portal, PaperProvider, Modal } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { save, addLastMessage, retrieveLastMessage, addLastConversation, retrieveMess, addMess, deleteMess, initSocket } from '../../../Redux/slice';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import ModalAddChat from './components/ModalAddChat';
import ModalCreateGroup from './components/ModalCreateGroup';
import ModalAddFriend from './components/ModalAddFriend';
import { onMessageReceive } from '../../../function/socket/onReceiveMessage';
import { getConversation } from '../../../function/getLastConversationByUserId';
// import AsyncStorage from '@react-native-async-storage/async-storage';
const ListChat = ({ navigation }) => {
  const { width } = Dimensions.get('window');
  var stompClient = useRef(null);
  const socketConnected = useSelector((state) => state.socket.connected);
  const dispatch = useDispatch();
  // const [account, setAccount] = useState(null);
  // useEffect(() => {
  //   const fetchAccount = async () => {
  //     try {
  //       const storedAccount = await AsyncStorage.getItem('account');
  //       if (storedAccount !== null) {
  //         const parsedAccount = JSON.parse(storedAccount);
  //         setAccount(parsedAccount.account);
  //         dispatch(save(parsedAccount.account));
  //       }
  //     } catch (error) {
  //       console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
  //     }
  //   };
  //   fetchAccount();
  // }, []);
            
  // account reducer
  const id = useSelector((state) => state.account.id);
  const currentUser = useSelector((state) => state.account);
  // const stateConversations = useSelector((state) => state.account.conversation);
  const [conversations, setConversations] = useState(currentUser.conversation);
  let conversation = useRef({})

  // message reducer
  const receiverId = useSelector((state) => state.message.id);
  let r = useRef('');
  const messages = useSelector((state) => state.message.messages);

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isRes, setIsRes] = useState(false);

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

  // // Xóa cuộc trò chuyện
  // const deleteConversationAction = async (userId) => {
  //   try {

  //     setDeleteMode(false);
  //     const updatedConversations = conversations.filter(conversation => {
  //       if (conversation.user && conversation.user.id !== userId) {
  //         return true;
  //       } else if (conversation.conversationType === 'group') {
  //         return false;
  //       }
  //       return false;
  //     });
  //     setConversations(updatedConversations);
  //     const updatedUser = { ...currentUser, conversation: updatedConversations };
  //     const updateUserResponse = await axios.put('https://deploybackend-production.up.railway.app/users/updateUser', updatedUser);

  //     if (updateUserResponse.status === 200) {
  //       // dispatch(deleteConversationAction(userId));
  //       dispatch(save(updateUserResponse.data));
  //       console.log('Cập nhật người dùng thành công', updateUserResponse.data);
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi cập nhật người dùng', error);
  //   }
  // };

  const [deleteTimeout, setDeleteTimeout] = useState(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    r.current = receiverId;
  }, [receiverId]);

  useEffect(() => {
    setConversations(currentUser.conversation);
  }, [currentUser.conversation]);

  useEffect(() => {
    if (!socketConnected) {
      const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
      stompClient.current = Stomp.over(socket);
      stompClient.current.connect({}, onConnected, onError);
      dispatch(initSocket(true));
    }
  }, [])

  const onConnected = () => {
    stompClient.current.subscribe('/user/' + id + '/singleChat', onReceiveMessage)
    stompClient.current.subscribe('/user/' + id + '/groupChat', onGroupMessageReceived)
    stompClient.current.subscribe('/user/' + id + '/retrieveMessage', onRetrieveMessage)
    stompClient.current.subscribe('/user/' + id + '/deleteMessage', onDeleteResult)

    stompClient.current.subscribe('/user/' + id + '/deleteConversation', onReceiveDeleteConversationResponse);
    stompClient.current.subscribe('/user/' + id + '/createGroup', onCreateGroup)
    stompClient.current.subscribe('/user/' + id + '/addMemberIntoGroup', onCreateGroup)
    stompClient.current.subscribe('/user/' + id + '/removeMemberInGroup', onCreateGroup)
    stompClient.current.subscribe('/user/' + id + '/outGroup', onCreateGroup)
    // stompClient.current.subscribe('/user/' + id + '/retrieveMessage', onReceiveFromSocket)
    // stompClient.current.subscribe('/user/' + id + '/deleteMessage', onReceiveFromSocket)
  }

  const onCreateGroup = (message) => {
    updateMess();
  }

  const checkIsChatting = (senderId, messageReceiverId) => {
    if(messageReceiverId.indexOf('_') === -1){
      if ((senderId === id && messageReceiverId === r.current)
        || (senderId === r.current && messageReceiverId === id))
        return true;
      return false;
    } else{// receriverId is group
      let idGroup = messageReceiverId.split('_')[1];
      return idGroup === r.current;
    }
  }

  const onReceiveMessage = (payload) => {
    const message = JSON.parse(payload.body);
    let userId = message.sender.id == id ? message.receiver.id : message.sender.id;
    let index = conversations.findIndex(conv => conv.user && conv.user.id === userId);
    //update message in listchat
    console.log('index:', index);
    if( index === -1 ){
      getConversation(id).then(conv => {
        dispatch(addLastConversation(conv));
        // kiểm tra xem tin nhắn nhận được có phải tin nhắn với người dùng đang chat hay không
        if (checkIsChatting(message.sender.id, message.receiver.id)){
          let newMess = onMessageReceive(message,
            { id: currentUser.id, userName: currentUser.userName, avt: currentUser.avt },
            conv.user)
          if (newMess)
            dispatch(addMess(newMess))
        }
      })
        // conversation.current = getConversation(id);
    } else {
      dispatch(addLastMessage({ message: message, index: index }));
      // kiểm tra xem tin nhắn nhận được có phải tin nhắn với người dùng đang chat hay không
      if (checkIsChatting(message.sender.id, message.receiver.id)) {
        let newMess = onMessageReceive(message,
          { id: currentUser.id, userName: currentUser.userName, avt: currentUser.avt },
          conversation.current.user)
        if (newMess)
          dispatch(addMess(newMess))
      }
    }
  }

  const onGroupMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    let idGroup = message.receiver.id.split('_')[1];
    let index = 0
    while (index < conversations.length && conversations[index].idGroup !== idGroup) {
      index++;
    }
    dispatch(addLastMessage({ message: message, index: index }));

    // kiểm tra xem tin nhắn nhận được có phải tin nhắn trong group đang chat hay không
    if (checkIsChatting(message.sender.id, message.receiver.id)){
      let newMess = onMessageReceive(message,
        { id: currentUser.id, userName: currentUser.userName, avt: currentUser.avt },
        { id: idGroup, members: conversations[index].members })
      if (newMess)
        dispatch(addMess(newMess))
    }
  }

  const checkLastMessageIsRetrieve = (id) => {
    let index = 0
    while (index < conversations.length && conversations[index].lastMessage?.id !== id) {
      index++;
    }
    return index === conversations.length ? -1 : index;
  }

  const onRetrieveMessage = (payload) => {
    let message = JSON.parse(payload.body)
    let index = checkLastMessageIsRetrieve(message.id);
    if(index !== -1)
      dispatch(retrieveLastMessage(index));
    if(checkIsChatting(message.sender.id, message.receiver.id))
      dispatch(retrieveMess(message.id));
  }

  const onDeleteResult = (payload) => {
    let message = JSON.parse(payload.body)
    if(checkIsChatting(message.sender.id, message.receiver.id)){
      dispatch(deleteMess(message.id));
    }
  }

  const onReceiveDeleteConversationResponse = async (message) => {
    const conversation = JSON.parse(message.body);
    if (conversation) {
      console.log('Cuộc trò chuyện đã được xóa thành công:', conversation);
      // const updatedConversations = conversations.filter(conv => conv.ownerId.idGroup !== conversation.ownerId.idGroup);
      // setConversations(updatedConversations);
      const result = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${id}`)
      try {
        if (result.data) {
          dispatch(save(result.data));
        }
      } catch (error) {
        console.log(error);
      }

    } else {
      console.log('Xóa cuộc trò chuyện không thành công:', conversation);
    }
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

  const handleDelete = (item) => {
    setSelectedItem(item);
    setDeleteMode(true);
    setSecondsLeft(10);
    setIsRes(true)
    startDeleteTimeout();
  };

  const cancelDelete = () => {
    clearTimeout(deleteTimeout);
    setDeleteMode(false);
  };

  const restoreConversation = () => {
    cancelDelete();
    setIsRes(false)
  };

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
  console.log('con:', con);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {Platform.OS == "android" && <View style={{ height: 30 }} />}
      <TouchableOpacity onPress={() => navigation.navigate('Search')}
        style={{
          backgroundColor: 'cyan',
          height: 50, flexDirection: 'row',
          width: '100%', justifyContent: 'space-between', alignItems: 'center'
        }}>
        <View style={{ width: 45, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
          <FontAwesome name="search" size={40} color="white" />
        </View>
        {/* <TextInput style={{
          fontSize: 20, height: 40, width: '60%',
          backgroundColor: 'white', borderRadius: 5, borderWidth: 1
        }}
          placeholder='Tìm kiếm...'
          placeholderTextColor={'grey'}
        /> */}
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
                onPress={() => navigation.navigate("Chat", item.user ? item.user :
                  { id: item.idGroup, avt: item.avtGroup, nameGroup: item.nameGroup, status: item.status })}
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
                      item.lastMessage ? item.lastMessage.sender.id == id ?
                        <Text style={{ fontSize: 14, color: 'grey' }} numberOfLines={1}>{
                          item.lastMessage.messageType == 'RETRIEVE' ? 'Bạn đã thu hồi một tin nhắn' :
                            item.lastMessage.messageType == 'PNG' || item.lastMessage.messageType == 'JPG' || item.lastMessage.messageType == 'JPEG' ?
                              'Bạn: [Hình ảnh]' : item.lastMessage.messageType == 'PDF' || item.lastMessage.messageType == 'DOC' || item.lastMessage.messageType == 'DOCX'
                                || item.lastMessage.messageType == 'XLS' || item.lastMessage.messageType == 'XLSX' || item.lastMessage.messageType == 'PPT'
                                || item.lastMessage.messageType == 'PPTX' || item.lastMessage.messageType == 'RAR' || item.lastMessage.messageType == 'ZIP' ?
                                'Bạn: ' + item.lastMessage.titleFile :
                                item.lastMessage.messageType == 'AUDIO' ? 'Bạn: [Audio]' : item.lastMessage.messageType == 'VIDEO' ?
                                  'Bạn: [Video]' : 'Bạn: ' + item.lastMessage.content}</Text>
                        : <Text style={{
                          fontSize: 14, color: item.lastMessage && item.lastMessage.seen ? 'grey' : 'black',
                          fontWeight: item.lastMessage && item.lastMessage.seen ? 'normal' : 'bold'
                        }} numberOfLines={1}>
                          {
                            item.lastMessage.messageType == 'RETRIEVE' ? 'Đã thu hồi một tin nhắn' :
                              item.lastMessage.messageType == 'PNG' || item.lastMessage.messageType == 'JPG' || item.lastMessage.messageType == 'JPEG' ?
                                '[Hình ảnh]' : item.lastMessage.messageType == 'PDF' || item.lastMessage.messageType == 'DOC' || item.lastMessage.messageType == 'DOCX'
                                  || item.lastMessage.messageType == 'XLS' || item.lastMessage.messageType == 'XLSX' || item.lastMessage.messageType == 'PPT'
                                  || item.lastMessage.messageType == 'PPTX' || item.lastMessage.messageType == 'RAR' || item.lastMessage.messageType == 'ZIP' ?
                                  item.lastMessage.titleFile :
                                  item.lastMessage.messageType == 'AUDIO' ? '[Audio]' : item.lastMessage.messageType == 'VIDEO' ?
                                    '[Video]' : item.lastMessage.content
                          }</Text> : null
                    }
                  </View>
                  <View style={{ width: 70, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                    {item.lastMessage && <Text style={{ fontSize: 12, color: 'grey' }} numberOfLines={1}>{calcTime(item.lastMessage.senderDate)}</Text>}
                    <View style={{ backgroundColor: 'red', borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 30 }}>
                      <Text style={{ fontSize: 16, color: 'white' }}>1</Text>
                    </View>
                  </View>
                </View>
                {/* {deleteMode && (
          <TouchableOpacity onPress={() => setDeleteMode(false)}>
            <View style={{ backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center', height: 50 }}>
              <Text style={{ color: 'white' }}>Hủy Xóa</Text>
            </View>
          </TouchableOpacity>
        )} */}
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
                // <TouchableOpacity onPress={() => setDeleteMode(false)}>
                //   <View style={{ backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center', height: 50 }}>
                //     <Text style={{ color: 'white' }}>Hủy Xóa</Text>
                //   </View>
                // </TouchableOpacity>
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