import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';

const UserDetailAddFriend = ({ route,navigation }) => {
  const currentUser = useSelector((state) => state.account);
  const [userFriend, setUserFriend] = useState([]);
  const [isFriend, setIsFriend] = useState(true);
  var stompClient = useRef(null);
  const { user } = route.params;

  const getContacts = async () => {
    try {
      const userRes = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${user.id}`);
      if (userRes.data) {
        setUserFriend(userRes.data)
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
  }, [])

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
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.userName}>{user.userName}</Text>
        {isFriend ? (
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Chat", user)}>
          <Text style={styles.addButtonText}>Nhắn tin</Text>
        </TouchableOpacity>
      ) : (
         <View style={styles.container2}>
         <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Chat", user)}>
          <Text style={styles.addButtonText}>Nhắn tin</Text>
        </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
            <Text style={styles.addButtonText}>Gửi yêu cầu kết bạn</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
    container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
    marginTop: 10,
  },
  avatarContainer: {
    position: 'absolute',
    top: '40%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    top: '10%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#006AF5',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
});

export default UserDetailAddFriend;
