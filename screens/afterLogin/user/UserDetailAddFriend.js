// UserDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
 const handleAddFriend = async () => {
        try {
            const request = {
                id: id,
                receiverId: receiverId.current
            };
            onPress(request);
            // stompClient.send("/app/request-add-friend", {}, JSON.stringify(request));
            Alert.alert('Kết bạn', 'Yêu cầu kết bạn đã được gửi.');
            // navigation.navigate("Contact")
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };
const UserDetailAddFriend = ({ route }) => {
  const { user } = route.params;
  return (
    <View style={styles.container}>
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
});

export default UserDetailAddFriend;
