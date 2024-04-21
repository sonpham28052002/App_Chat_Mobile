import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, SectionList, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import ContactAction from './ContactAction';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function ContactScreen({ navigation }) {
  const userId = useSelector(state => state.account.id);
  const [friendList, setFriendList] = useState([]);

  const getContacts = async () => {
    try {
      const userRes = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${userId}`);
      if (userRes.data) {
        setFriendList(userRes.data.friendList);
      }
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getContacts();
    });

    return unsubscribe;
  }, [navigation]);

  const groupedFriendList = friendList
    .slice()
    .sort((a, b) => a.user.userName.localeCompare(b.user.userName))
    .reduce((acc, item) => {
      const initial = item.user.userName.charAt(0).toUpperCase();
      if (!acc[initial]) {
        acc[initial] = [];
      }
      acc[initial].push(item);
      return acc;
    }, {});

  const sections = Object.keys(groupedFriendList).map(initial => ({
    title: initial,
    data: groupedFriendList[initial],
  }));

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Chat", item.user ? item.user :
      { id: item.idGroup, avt: item.avtGroup, nameGroup: item.nameGroup, status: item.status })}>
      <View style={styles.friendItemContainer}>
        <View style={styles.friendItem}>
          <Image source={{ uri: item.user ? item.user.avt : item.avtGroup }} style={{ width: 50, height: 50, borderRadius: 25 }} />
          <Text style={styles.userNameText}>{item.user.userName}</Text>
        </View>
        <View style={styles.friendItemContainer}>
          <View style={styles.callIcons}>
            <Icon name="call" type="material" color={"#006AF5"} onPress={() => console.log('Voice call')} />
          </View>
          <View style={styles.callIcons}>
            <Icon name="videocam" type="material" color={"#006AF5"} onPress={() => console.log('Video call')} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ContactAction
        name="search"
        type="ionicon"
        title="Tìm kiếm bạn bè"
        backgroundColor="#006AF5"
        // handlePress={() => navigation.navigate('AddFriend')}
      />
      <ContactAction
        name="group"
        type="material"
        title="Lời mời kết bạn"
        backgroundColor="#006AF5"
        handlePress={() => {
          navigation.navigate('FriendRequests');
          getContacts(); // Cập nhật friendList khi quay lại từ màn hình FriendRequests
        }}
      />
      <ContactAction
        name="phone-square"
        type="font-awesome"
        title="Bạn từ danh bạ máy"
        backgroundColor="#006AF5"
        handlePress={() => navigation.navigate('User')}
      />
      <View style={styles.empty}>
        <SafeAreaView style={{ flex: 1 }}>
          {friendList.length > 0 ? (
            <SectionList
              sections={sections}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionHeader}>{title}</Text>
              )}
            />
          ) : (
            <View style={styles.empty}>
              <Icon name="warning" type="antdesign" />
              <Text style={styles.text}>Chưa có bạn bè</Text>
            </View>
          )}
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#006AF5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignSelf: 'flex-end',
    borderRadius: 5,
    marginRight: 15,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  friendItem: {
    padding: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: '#DDD',
    flexDirection: 'row',
    margin: 10,
    alignContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    marginTop: 10,
  },
  friendItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  userNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
