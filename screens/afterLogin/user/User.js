import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import axios from 'axios'; 
import { useSelector, useDispatch } from 'react-redux';
import host from '../../../configHost';

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
        const userRes = await axios.get(`${host}account/all`);
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
          fields: [Contacts.Fields.Image,Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data.map(contact => ({
            ...contact,
            isRegistered: false,
            isFriend: false, 
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
    const phoneNumber = contact.phoneNumbers && contact.phoneNumbers.length > 0 ? contact.phoneNumbers[0].number : null;
    if (phoneNumber) {
      const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
      const formattedPhoneNumberWithPrefix = formattedPhoneNumber.startsWith('84') ? formattedPhoneNumber : `84${formattedPhoneNumber.replace(/^0/, '')}`;
      const matchedAccount = accountList.find(account => account.phone === formattedPhoneNumberWithPrefix);
      const accountId = matchedAccount ? matchedAccount.id : null;
      // console.log('accountId', accountId);
      const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
      const isFriend = friendList && friendList.length > 0 && friendList.some(friend => friend.user.id === accountId);
      if (isFriend) {
        contact.isFriend = true;
      } else {
        contact.isRegistered = matchingIds.includes(contact.id) || matchingPhones.includes(normalizedPhoneNumber);
      }
    } else {
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
        <View style={{flexDirection:'row'}}>
          <View style={{margin:10}}><Text style={styles.notRegisteredText}>Đã là bạn bè</Text></View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleSendMessage(item.phoneNumbers[0].number)}
        >
          <Text style={styles.addButtonText}>Nhắn tin</Text>
        </TouchableOpacity>
        </View>
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
        const accountId = account.id;
        const userRes = await axios.get(`${host}users/getUserById?id=${accountId}`);
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

 const handleSendMessage = async (phoneNumber) => {
    try {
      const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
      const formattedPhoneNumberWithPrefix = formattedPhoneNumber.startsWith('84') ? formattedPhoneNumber : `84${formattedPhoneNumber.replace(/^0/, '')}`;
      console.log(`Add friend with phone number: ${formattedPhoneNumberWithPrefix}`);
      const account = accountList.find(account => account.phone === formattedPhoneNumberWithPrefix);
      if (account) {
        const accountId = account.id;
        const userRes = await axios.get(`${host}users/getUserById?id=${accountId}`);
        if (userRes.data) {
          navigation.navigate('Chat',userRes.data)
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
