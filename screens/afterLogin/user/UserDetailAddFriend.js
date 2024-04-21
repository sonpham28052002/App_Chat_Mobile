
import React,{useEffect,useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image,Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
const UserDetailAddFriend = ({ route }) => {
  const currentUser = useSelector((state) => state.account);
  var stompClient = useRef(null);
  const { user } = route.params;
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
                  source={{ uri: user.coverImage }}
                  style={styles.coverImage}
                />
          <Image
                  source={{ uri: user.avt }}
                  style={styles.avatar}
                />
      <Text style={styles.userName}>{user.userName}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
        <Text style={styles.addButtonText}>Gửi yêu cầu kết bạn</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 20,
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
    height: "60%",
    position: "absolute",
    zIndex: -1,
  },
});

export default UserDetailAddFriend;
