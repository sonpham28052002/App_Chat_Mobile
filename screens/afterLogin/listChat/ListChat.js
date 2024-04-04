import { View, Text, TouchableOpacity, Dimensions, Image, FlatList, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
// import store from '../../../Redux/Redux';
import { useSelector } from 'react-redux';
import { func } from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { save } from "../../../Redux/slice";
const ListChat = ({ navigation, route }) => {
  // const name = useSelector((state) => state.account.userName);
  // const avt = useSelector((state) => state.account.avt);
  const { width } = Dimensions.get('window');
  // const id = useSelector((state) => state.account.id);
// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Image } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';

// const ListChat = ({ navigation, route }) => {
  const [account, setAccount] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const storedAccount = await AsyncStorage.getItem('account');
        if (storedAccount !== null) {
          const parsedAccount = JSON.parse(storedAccount);
          setAccount(parsedAccount.account);
          dispatch(save(parsedAccount.account));
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
      }
    };
    fetchAccount();
  }, []);

  const name = account?.userName || "Unknown";
  const avt = account?.avt || "Unknown";
  const id = account?.id || "Unknown";

  const obj = useSelector((state) => state.account);
  console.log(obj);

  const calcTime = (time) => {
    const date = new Date(time)
    date.setUTCHours(date.getUTCHours() + 7)
    const now = new Date()
    const diff = now - date
    const seconds = diff / 1000
    if(seconds < 60) return 'Vừa xong'
    const minutes = seconds / 60
    if(minutes < 60) return `${Math.floor(minutes)} phút`
    const hours = minutes / 60
    if(hours < 24) return `${Math.floor(hours)} giờ`
    const days = hours / 24
    if(days < 7) return `${Math.floor(days)} ngày`
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{
        backgroundColor: 'cyan',
        height: 50, flexDirection: 'row',
        width: '100%', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <View style={{width:45, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}>
        <FontAwesome name="search" size={40} color="white" />
        </View>
        <TextInput style={{
          fontSize: 20, height: 40, width: '60%',
          backgroundColor: 'white', borderRadius: 5, borderWidth: 1
        }}
          placeholder='Tìm kiếm...'
          placeholderTextColor={'grey'}
        />
        <TouchableOpacity onPress={() => navigation.navigate("ScanQR", route.params)}>
          <FontAwesome name="qrcode" size={35} color="white" />
        </TouchableOpacity>
        <View style={{ marginRight: 10}}>
        <AntDesign name="adduser" size={35} color="white" />
        </View>
      </View>
      <View>
        <FlatList data={obj.conversation}
          renderItem={({ item }) => (
            item.user &&
            <TouchableOpacity style={{
              height: 70, flexDirection: 'row', alignItems: 'center',
              flex: 1
            }}
              onPress={() => navigation.navigate("Chat", item.user.id)}
            >
              <View style={{ width: 65, paddingHorizontal: 7, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: item.user.avt }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              </View>
              <View style={{width: width - 65, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey'}}>
                <View style={{
                  width: width - 145, paddingHorizontal: 10,
                  height: 70, justifyContent: 'center'
                }}>
                  <Text style={{ fontSize: 20 }} numberOfLines={1}>{item.user.username}</Text>
                  <Text style={{ fontSize: 16, color: 'grey' }}>{item.lastMessage.content}</Text>
                </View>
                <View style={{ width: 70, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: 'grey' }}>{calcTime(item.lastMessage.senderDate)}</Text>
                  <View style={{ backgroundColor: 'red', borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 30 }}>
                    <Text style={{ fontSize: 16, color: 'white' }}>1</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
          }
          keyExtractor={(item) => item.updateLast}
        />
      </View>
    </SafeAreaView >
  );
}

export default ListChat;
