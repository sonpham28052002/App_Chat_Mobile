import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
const UserDetailAddFriend = ({ route, navigation }) => {
  const currentUser = useSelector((state) => state.account);
  const [userFriend, setUserFriend] = useState([]);
  const [isFriend, setIsFriend] = useState(true);
  var stompClient = useRef(null);
  const { user } = route.params;

  const getContacts = async () => {
    try {
      const userRes = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${user.id}`);
      if (userRes.data) {
        const formattedPhone = `0${userRes.data.phone.substring(2)}`;
        const formattedDob = userRes.data.dob.split('-').reverse().join('-');
        
        setUserFriend({
          ...userRes.data,
          phone: formattedPhone,
          dob: formattedDob
        });

        const isFriend = currentUser.friendList.some(friend => friend.user.id === user.id);
        setIsFriend(isFriend ? true : false);
      }
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
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

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: userFriend.coverImage }}
        style={styles.coverImage}
      />
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user.avt }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user.userName}</Text>
      </View>
      <View style={styles.textContainer}>
        {isFriend ? (
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Chat", user)}>
               <View style={{flexDirection:'row',borderWidth:1,borderRadius:10,padding:10,borderColor: '#99CCFF',backgroundColor:"#99CCFF"}}>
                 <Text style={styles.addButtonText}>Nhắn tin</Text>
                 <Ionicons name="chatbox-ellipses-outline" size={24} color="#006AF5" />
                </View>
          </TouchableOpacity>
        ) : (
            <View style={styles.container2}>
              <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Chat", user)}>
                <View style={{flexDirection:'row',borderWidth:1,borderRadius:10,padding:10,borderColor: '#99CCFF',backgroundColor:"#99CCFF"}}>
                 <Text style={styles.addButtonText}>Nhắn tin</Text>
                 <Ionicons name="chatbox-ellipses-outline" size={24} color="#006AF5" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
                  <View style={{flexDirection:'row',borderWidth:1,borderRadius:10,padding:10,borderColor: '#006AF5',}}>
                {/* <Text style={styles.addButtonText}>Gửi yêu cầu kết bạn</Text> */}
                <AntDesign name="adduser" size={24} color="#006AF5" />
                </View>
              </TouchableOpacity>
            </View>
          )}
      </View>
      <View style={styles.profile}>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.info}>{userFriend.phone}</Text>
          </View>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Giới tính:</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.info}>{userFriend.gender}</Text>
          </View>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Sinh nhật:</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.info}>{userFriend.dob}</Text>
          </View>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.label}>Tiểu sử:</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.info}>{userFriend.bio}</Text>
          </View>
        </View>
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
   // backgroundColor: '#006AF5',
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
});

export default UserDetailAddFriend;
