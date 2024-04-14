import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, SectionList } from 'react-native';
import { Icon } from 'react-native-elements';
import ContactAction from './ContactAction';
import User from './user/User';
import { useSelector } from 'react-redux';
import SectionListGetItemLayout from 'react-native-section-list-get-item-layout';

export default function ContactScreen({ navigation }) {
  const friendList = useSelector(state => state.account.friendList);

  // Sort and group friendList alphabetically by userName
  const groupedFriendList = friendList.slice().sort((a, b) => a.user.userName.localeCompare(b.user.userName))
    .reduce((acc, item) => {
      const initial = item.user.userName.charAt(0).toUpperCase();
      if (!acc[initial]) {
        acc[initial] = [];
      }
      acc[initial].push(item);
      return acc;
    }, {});

  // Convert groupedFriendList to SectionList data format
  const sections = Object.keys(groupedFriendList).map(initial => ({
    title: initial,
    data: groupedFriendList[initial],
  }));

  // Render item for SectionList
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Chat', { item })}>
      <View style={styles.friendItemContainer}>
        <View style={styles.friendItem}>
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
        handlePress={() => navigation.navigate('FriendRequests')}
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
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
