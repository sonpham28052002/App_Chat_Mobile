import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import axios from 'axios'; 
import { useSelector, useDispatch } from 'react-redux';

const User = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [accountList, setAccountList] = useState([]); 
  const [matchingIds, setMatchingIds] = useState([]);
  const [matchingPhones, setMatchingPhones] = useState([]);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(useSelector(state => state.account));
  const friendList = useSelector(state => state.account.friendList);

  useEffect(() => {
    const fetchAccountList = async () => {
      try {
        
        const userRes = await axios.get('https://deploybackend-production.up.railway.app/account/all');
        if (userRes.data && Array.isArray(userRes.data)) {
          setAccountList(userRes.data);
          const ids = userRes.data.map(account => account.id);
          setMatchingIds(ids);
          const phones = userRes.data.map(account => account.phone);
          setMatchingPhones(phones);
        }
      } catch (error) {
        console.error('Error fetching account list:', error);
      }
    };

    fetchAccountList(); 
  }, []);

  useEffect(() => {
    const getContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data.map(contact => ({
            ...contact,
            isRegistered: false
          })));
        }
      } else {
        console.log('Permission denied');
      }
    };

    getContacts();
  }, []);

  useEffect(() => {
    const updatedContacts = [...contacts];
    updatedContacts.forEach(contact => {
      const normalizedPhoneNumber = normalizePhoneNumber(contact.phoneNumbers && contact.phoneNumbers.length > 0 ? contact.phoneNumbers[0].number : '');
      contact.isRegistered = matchingIds.includes(contact.id) || matchingPhones.includes(normalizedPhoneNumber);
      if (friendList && friendList.user) {
        contact.isFriend = friendList.some(friend => friend.user.id === contact.id);
      }
    });
    setContacts(updatedContacts);
  }, [matchingIds, matchingPhones, friendList]);


  const renderItem = ({ item }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        <Text>{item.name}</Text>
        <Text>{item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : 'N/A'}</Text>
      </View>
      {item.isRegistered ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddFriend(item.phoneNumbers[0].number)}
        >
          <Text style={styles.addButtonText}>Kết bạn</Text>
        </TouchableOpacity>
      ) : item.isFriend ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleSendMessage(item.id)}
        >
          <Text style={styles.addButtonText}>Nhắn tin</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.notRegisteredText}>Chưa đăng ký</Text>
      )}
    </View>
  );

const handleAddFriend = async (phoneNumber) => {
  try {
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
    const formattedPhoneNumberWithPrefix = formattedPhoneNumber.startsWith('84') ? formattedPhoneNumber : `84${formattedPhoneNumber.replace(/^0/, '')}`;
    console.log(`Add friend with phone number: ${formattedPhoneNumberWithPrefix}`);
    const account = accountList.find(account => account.phone === formattedPhoneNumberWithPrefix);
    if (account) {
      // console.log('Account:', account);
      const accountId = account.id;
      // console.log(accountId);
      const userRes = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${accountId}`);
      if (userRes.data) {
        navigation.navigate('UserDetailAddFriend',{user: userRes.data})
      } else {
        console.log('User not found for account ID:', accountId);
      }
    } else {
      console.log('Account not found for phone number:', formattedPhoneNumberWithPrefix);
    }
  } catch (error) {
    console.error('Error fetching user by account ID:', error);
  }
};




  const handleSendMessage = (userId) => {
    console.log(`Send message to user with ID: ${userId}`);
  };

  const normalizePhoneNumber = (phoneNumber) => {
    let normalizedNumber = phoneNumber.replace(/[^\d]/g, '');
    if (normalizedNumber.startsWith('0')) {
      normalizedNumber = '84' + normalizedNumber.slice(1);
    }

    return normalizedNumber;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  contactInfo: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#006AF5', 
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notRegisteredText: {
    color: '#999999',
    fontStyle: 'italic',
  },
});

export default User;
