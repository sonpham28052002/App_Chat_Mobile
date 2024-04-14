// UserDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';

const UserDetailAddFriend = ({ route }) => {
  const { user } = route.params;
  return (
    <View style={styles.container}>
          <Image
                  source={{ uri: user.avt }}
                  style={styles.avatar}
                />
      <Text style={styles.userName}>{user.userName}</Text>
      <TouchableOpacity style={styles.addButton}>
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
