import { View, Text, TouchableOpacity, Dimensions, Image, FlatList, SafeAreaView, Platform } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { save } from '../../../Redux/slice';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
const ListChat = ({ navigation }) => {
  // const name = useSelector((state) => state.account.userName);
  // const avt = useSelector((state) => state.account.avt);
  const { width } = Dimensions.get('window');
  var stompClient = useRef(null);
  const dispatch = useDispatch();
  const id = useSelector((state) => state.account.id);
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

  // const name = account?.userName || "Unknown";
  // const avt = account?.avt || "Unknown";
  // const id = account?.id || "Unknown";

  useEffect(() => {
    const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, onConnected, onError);
  },[])

  const onConnected = () => {
    stompClient.current.subscribe('/user/' + id + '/singleChat', onReceiveFromSocket)
    // stompClient.current.subscribe('/user/' + id + '/retrieveMessage', onReceiveFromSocket)
    // stompClient.current.subscribe('/user/' + id + '/deleteMessage', onReceiveFromSocket)
  }

  const onReceiveFromSocket = async (payload) => {
      const result = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${id}`)
      try {
          if (result.data) {
              dispatch(save(result.data));
          }
      } catch (error) {
          console.log(error);
      }
  }

  const onError = (error) => {
    console.log('Could not connect to WebSocket server. Please refresh and try again!');
  }

  let obj = useSelector((state) => state.account);
  let data = useSelector((state) => state.account.conversation);

  const calcTime = (time) => {
    const date = new Date(time)
    date.setUTCHours(date.getUTCHours() + 7)
    const now = new Date()
    const diff = now - date
    const seconds = diff / 1000
    if(seconds < 60) return 'Vừa xong'

    const minutes = seconds / 60
    if(minutes < 60) return `${Math.floor(minutes)} phút`
    const hours = minutes / 60
    if(hours < 24) return `${Math.floor(hours)} giờ`
    const days = hours / 24
    if(days < 7) return `${Math.floor(days)} ngày`
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      { Platform.OS == "android" && <View style={{height: 30}}/>}
      <View style={{
        backgroundColor: 'cyan',
        height: 50, flexDirection: 'row',
        width: '100%', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <View style={{width:45, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}>
        <FontAwesome name="search" size={40} color="white" />
        </View>
        <TextInput style={{
          fontSize: 20, height: 40, width: '60%',
          backgroundColor: 'white', borderRadius: 5, borderWidth: 1
        }}
          placeholder='Tìm kiếm...'
          placeholderTextColor={'grey'}
        />
        <TouchableOpacity onPress={() => navigation.navigate("ScanQR")}>
          <FontAwesome name="qrcode" size={35} color="white" />
        </TouchableOpacity>
        <View style={{ marginRight: 10}}>
        <TouchableOpacity onPress={() => navigation.navigate('CreateMessager')}>
          <AntDesign name="adduser" size={35} color="white" />
        </TouchableOpacity>
        </View>
      </View>
      <View>
        <FlatList data={data}
          renderItem={({ item }) => (
            item.user &&
            <TouchableOpacity style={{
              height: 70, flexDirection: 'row', alignItems: 'center',
              flex: 1
            }}
              onPress={() => navigation.navigate("Chat", item.user)}
            >
              <View style={{ width: 65, paddingHorizontal: 7, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: item.user.avt }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              </View>
              <View style={{width: width - 65, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey'}}>
                <View style={{
                  width: width - 145, paddingHorizontal: 10,
                  height: 70, justifyContent: 'center'
                }}>
                  <Text style={{ fontSize: 20 }} numberOfLines={1}>{item.user.userName}</Text>
                  {item.lastMessage.sender.id == obj.id?
                    <Text style={{ fontSize: 14, color: 'grey'}} numberOfLines={1}>{
                      item.lastMessage.messageType == 'RETRIEVE'? 'Bạn đã thu hồi một tin nhắn' :
                      item.lastMessage.messageType == 'PNG' || item.lastMessage.messageType == 'JPG' || item.lastMessage.messageType == 'JPEG'?
                        'Bạn: [Hình ảnh]' : item.lastMessage.messageType == 'PDF' || item.lastMessage.messageType == 'DOC' || item.lastMessage.messageType == 'DOCX'
                        || item.lastMessage.messageType == 'XLS' || item.lastMessage.messageType == 'XLSX' || item.lastMessage.messageType == 'PPT'
                        || item.lastMessage.messageType == 'PPTX' || item.lastMessage.messageType == 'RAR' || item.lastMessage.messageType == 'ZIP'?
                        'Bạn: ' + item.lastMessage.titleFile : 
                        item.lastMessage.messageType == 'AUDIO'? 'Bạn: [Audio]' : item.lastMessage.messageType == 'VIDEO'?
                        'Bạn: [Video]' : 'Bạn: ' + item.lastMessage.content}</Text>
                  : <Text style={{ fontSize: 14, color: item.lastMessage.seen? 'grey':'black',
                    fontWeight: item.lastMessage.seen? 'normal':'bold'}} numberOfLines={1}>
                      {
                        item.lastMessage.messageType == 'RETRIEVE'? 'Đã thu hồi một tin nhắn' :
                      item.lastMessage.messageType == 'PNG' || item.lastMessage.messageType == 'JPG' || item.lastMessage.messageType == 'JPEG'?
                        '[Hình ảnh]' : item.lastMessage.messageType == 'PDF' || item.lastMessage.messageType == 'DOC' || item.lastMessage.messageType == 'DOCX'
                        || item.lastMessage.messageType == 'XLS' || item.lastMessage.messageType == 'XLSX' || item.lastMessage.messageType == 'PPT'
                        || item.lastMessage.messageType == 'PPTX' || item.lastMessage.messageType == 'RAR' || item.lastMessage.messageType == 'ZIP'?
                        item.lastMessage.titleFile :
                        item.lastMessage.messageType == 'AUDIO'? '[Audio]' : item.lastMessage.messageType == 'VIDEO'?
                        '[Video]' : item.lastMessage.content}</Text>
                  }
                </View>
                <View style={{ width: 70, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: 'grey' }} numberOfLines={1}>{calcTime(item.lastMessage.senderDate)}</Text>
                  <View style={{ backgroundColor: 'red', borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 30 }}>
                    <Text style={{ fontSize: 16, color: 'white' }}>1</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
          }
          keyExtractor={(item) => item.updateLast}
        />
      </View>
    </SafeAreaView >
  );
}

export default ListChat;
