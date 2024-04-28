import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { updateNickName } from "../../../Redux/slice";
import host from '../../../configHost'

const UserDetailAddFriend = ({ route, navigation }) => {
  const currentUser = useSelector((state) => state.account);
  const [userFriend, setUserFriend] = useState({});
  const [isFriend, setIsFriend] = useState(true);
  const [nickName, setNickName] = useState('');
  const [newNickName, setNewNickName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  var stompClient = useRef(null);
  const { user } = route.params;

  const getContacts = async () => {
    try {
      const userRes = await axios.get(`${host}users/getUserById?id=${user.id}`);
      if (userRes.data) {
        const formattedPhone = `0${userRes.data.phone.substring(2)}`;
        const formattedDob = userRes.data.dob ? userRes.data.dob.split('-').reverse().join('-') : null;

        setUserFriend({
          ...userRes.data,
          phone: formattedPhone,
          dob: formattedDob
        });

        const friend = currentUser.friendList.find(friend => friend.user.id === user.id);
        setIsFriend(!!friend);
        if (friend) {
          setNickName(friend.nickName);
          setNewNickName(friend.nickName);
        }
      }
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
  };

  useEffect(() => {
    getContacts();
  }, [currentUser.friendList]);

  useEffect(() => {
    const socket = new SockJS(`${host}ws`);
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, onConnected, onError);
  }, []);

  const onError = (error) => {
    console.log('Could not connect to WebSocket server. Please refresh and try again!');
  }

  const onConnected = () => {
  }

  const handleAddFriend = async () => {
    try {
      const request = {
        id: currentUser.id,
        receiverId: user.id
      };
      stompClient.current.send("/app/request-add-friend", {}, JSON.stringify(request));
      Alert.alert('Kết bạn', 'Yêu cầu kết bạn đã được gửi.');
      // navigation.navigate("Contact")
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const update = async () => {
    if (!newNickName) {
      Alert.alert('Cập nhật không thành công');
      return;
    }
    
    try {
      dispatch(updateNickName({ userId: user.id, newNickName }));
      // await axios.put('https://deploybackend-production.up.railway.app/users/updateUser', currentUser);
      // console.log('User updated:', currentUser);
      setModalVisible(false);
      Alert.alert('Cập nhật tên gợi nhớ ' + newNickName + ' thành công');
    } catch (error) {
      console.log('Error updating user:', error);
      Alert.alert('Cập nhật không thành công');
    }
  }

  const renderUserInfo = (label, value, defaultValue = 'Chưa cập nhật') => (
    <View style={styles.profileItem}>
      <Text style={styles.label}>{label}:</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>{value ? value : defaultValue}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
     <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate("UserOptionsScreen", { user: user })}>
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              onChangeText={text => setNewNickName(text)}
              value={newNickName}
              placeholder="Nhập nickname mới"
            />
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={update}
            >
              <Text style={styles.textStyle}>Cập nhật</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#2196F3", marginTop: 5 }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Image
        source={{ uri: userFriend.coverImage }}
        style={styles.coverImage}
      />
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user.avt }}
          style={styles.avatar}
        />
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.userName}>{isFriend ? nickName : user.userName}</Text>
          {isFriend && (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Feather name="edit-3" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.textContainer}>
        {isFriend ? (
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Chat", user)}>
            <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 10, padding: 10, borderColor: '#99CCFF', backgroundColor: "#99CCFF" }}>
              <Text style={styles.addButtonText}>Nhắn tin</Text>
              <Ionicons name="chatbox-ellipses-outline" size={24} color="#006AF5" />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.container2}>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Chat", user)}>
              <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 10, padding: 10, borderColor: '#99CCFF', backgroundColor: "#99CCFF" }}>
                <Text style={styles.addButtonText}>Nhắn tin</Text>
                <Ionicons name="chatbox-ellipses-outline" size={24} color="#006AF5" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
              <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 10, padding: 10, borderColor: '#006AF5', }}>
                <AntDesign name="adduser" size={24} color="#006AF5" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.profile}>
        {renderUserInfo('Số điện thoại', userFriend.phone)}
        {renderUserInfo('Giới tính', userFriend.gender)}
        {renderUserInfo('Sinh nhật', userFriend.dob)}
        {renderUserInfo('Tiểu sử', userFriend.bio)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
    borderColor: '#ccc',
    borderRadius: 10
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  profile: {
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  profileItem: {
    flexDirection: 'row',
    marginBottom: 10,
    borderColor: '#006AF5',
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: '20%',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#006AF5',
    fontWeight: 'bold',
    fontSize: 18,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "white",
  },
  coverImage: {
    width: "100%",
    height: "50%",
    position: "absolute",
    top: 0,
    zIndex: -1,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  infoContainer: {
    flex: 1,
  },
  info: {
    flex: 1,
  },
  optionButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  }
});

export default UserDetailAddFriend;
