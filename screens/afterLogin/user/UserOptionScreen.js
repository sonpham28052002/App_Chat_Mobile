import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';

const UserOptionsScreen = ({navigation,route}) => {
  const [isBestFriend, setIsBestFriend] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const { user } = route.params;
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{user.userName}</Text>
      </TouchableOpacity>
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
           <TouchableOpacity style={styles.optionButton}>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
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
