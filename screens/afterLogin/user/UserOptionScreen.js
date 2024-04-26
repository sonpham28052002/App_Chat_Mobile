import React, { useState,useEffect,useRef } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet,Alert } from 'react-native';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import host from '../../../configHost'
import { useSelector, useDispatch } from 'react-redux';
import { removeFriend } from "../../../Redux/slice";
const UserOptionsScreen = ({ navigation, route }) => {
  const [isBestFriend, setIsBestFriend] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isReported, setIsReported] = useState(false);
const currentUser = useSelector((state) => state.account);
  const { user } = route.params;
    const dispatch = useDispatch();
var stompClient = useRef(null);
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
  const toggleBestFriend = () => {
    setIsBestFriend(previousState => !previousState);
  };

  const toggleBlocked = () => {
    setIsBlocked(previousState => !previousState);
  };

  const toggleHidden = () => {
    setIsHidden(previousState => !previousState);
  };

  const toggleReported = () => {
    setIsReported(previousState => !previousState);
  };
    const handleDeleteFriend = async () => {
    try {
      const confirmDelete = () => {
        Alert.alert(
          'Xóa bạn',
          'Bạn có chắc chắn muốn xóa bạn này?',
          [
            {
              text: 'Hủy',
              style: 'cancel',
            },
            {
              text: 'Xóa',
              onPress: () => {
                const mes = {
                  ownerId: currentUser.id,
                  userId: user.id
                };
                stompClient.current.send("/app/unfriend", {}, JSON.stringify(mes));
                dispatch(removeFriend(user.id));
                navigation.goBack()
              },
            },
          ],
          { cancelable: false }
        );
      };

      confirmDelete();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.userName}>{user.userName}</Text>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Thông tin</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Đổi tên gợi nhớ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Đánh dấu bạn thân</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isBestFriend ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleBestFriend}
          value={isBestFriend}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Chặn xem nhật ký</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isBlocked ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleBlocked}
          value={isBlocked}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Ẩn nhật ký</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isHidden ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleHidden}
          value={isHidden}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Báo xấu</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isReported ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleReported}
          value={isReported}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handleDeleteFriend}>
        <Text style={[styles.optionText, { color: 'red' }]}>Xóa bạn</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  userName: {
    fontSize: 24,
    marginBottom: 20,
  },
  optionButton: {
    width: '90%',
    paddingVertical: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 18,
    flex: 1,
  },
});

export default UserOptionsScreen;
