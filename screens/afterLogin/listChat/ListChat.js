import { View, Text, TouchableOpacity, Dimensions, Image, FlatList, SafeAreaView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { save } from "../../../Redux/slice";
import axios from 'axios';

const ListChat = ({ navigation, route }) => {
  const { width } = Dimensions.get('window');
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.account);
  const [conversations, setConversations] = useState(currentUser.conversation);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false); 

  // Xóa cuộc trò chuyện
  const deleteConversation = async (userId) => {
    try {
      const updatedConversations = conversations.filter(conversation => {
        if (conversation.user && conversation.user.id !== userId) {
          return true; 
        } else if (conversation.conversationType === 'group') {
          return false; 
        }
        return false; 
      });
      setConversations(updatedConversations);
      setDeleteMode(false); 

      const updatedUser = { ...currentUser, conversation: updatedConversations };
      const updateUserResponse = await axios.put('https://deploybackend-production.up.railway.app/users/updateUser', updatedUser);

      if (updateUserResponse.status === 200) {
        dispatch(save(updateUserResponse.data));
        console.log('Cập nhật người dùng thành công', updateUserResponse.data);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng', error);
    }
  };

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {Platform.OS == "android" && <View style={{ height: 30 }} />}
      <View style={{
        backgroundColor: 'cyan',
        height: 50, flexDirection: 'row',
        width: '100%', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <View style={{ width: 45, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
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
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('CreateMessager')}>
            <AntDesign name="adduser" size={35} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <FlatList
          data={conversations}
          renderItem={({ item }) => (
            item.user &&
            <TouchableOpacity
              style={{
                height: 70, flexDirection: 'row', alignItems: 'center',
                flex: 1
              }}
              onPress={() => navigation.navigate("Chat", item.user)} 
              onLongPress={() => { 
                setSelectedItem(item);
                setDeleteMode(true); 
              }}
            >
              <View style={{ width: 65, paddingHorizontal: 7, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: item.user.avt }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              </View>
              <View style={{ width: width - 65, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                <View style={{
                  width: width - 145, paddingHorizontal: 10,
                  height: 70, justifyContent: 'center'
                }}>
                  <Text style={{ fontSize: 20 }} numberOfLines={1}>{item.user.userName}</Text>
                  {
                    deleteMode && selectedItem === item && // Hiển thị nút xóa nếu ở trạng thái xóa và mục được chọn
                    <TouchableOpacity onPress={() => deleteConversation(item.user.id)}>
                      <AntDesign name="delete" size={24} color="red" />
                    </TouchableOpacity>
                  }
                  <Text style={{ fontSize: 14, color: item.lastMessage.sender.id === currentUser.id ? 'grey' : item.lastMessage.seen ? 'grey' : 'black', fontWeight: item.lastMessage.sender.id === currentUser.id ? 'normal' : item.lastMessage.seen ? 'normal' : 'bold' }} numberOfLines={1}>
                    {
                      item.lastMessage.messageType === 'RETRIEVE' ? 'Đã thu hồi một tin nhắn' :
                        item.lastMessage.messageType === 'PNG' || item.lastMessage.messageType === 'JPG' || item.lastMessage.messageType === 'JPEG' ?
                          '[Hình ảnh]' : item.lastMessage.messageType === 'PDF' || item.lastMessage.messageType === 'DOC' || item.lastMessage.messageType === 'DOCX'
                          || item.lastMessage.messageType === 'XLS' || item.lastMessage.messageType === 'XLSX' || item.lastMessage.messageType === 'PPT'
                          || item.lastMessage.messageType === 'PPTX' || item.lastMessage.messageType === 'RAR' || item.lastMessage.messageType === 'ZIP' ?
                          item.lastMessage.titleFile :
                          item.lastMessage.messageType === 'AUDIO' || item.lastMessage.messageType === 'VIDEO' ?
                            '[Video]' : item.lastMessage.content
                    }
                  </Text>
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
        {deleteMode && (
          <TouchableOpacity onPress={() => setDeleteMode(false)}>
            <View style={{ backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center', height: 50 }}>
              <Text style={{ color: 'white' }}>Hủy Xóa</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView >
  );
}

export default ListChat;
