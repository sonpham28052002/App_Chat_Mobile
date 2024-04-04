import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListChat = ({ navigation, route }) => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const storedAccount = await AsyncStorage.getItem('account');
        if (storedAccount !== null) {
          const parsedAccount = JSON.parse(storedAccount);
          setAccount(parsedAccount.account);
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

  return (
    <View style={{ marginTop: 40, marginLeft: 20, flexDirection: "row" }}>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Chat",
          id == 'jgfqCBTFdEgDmpHHXaNHdZV8B982' ?
            'RGpCgF0lR1aGVcttckhAbBHWcSp2' : 'jgfqCBTFdEgDmpHHXaNHdZV8B982'
        )}>
          <Text>Chat với Sơn Phạm</Text>
        </TouchableOpacity>
        <Image source={{ uri: avt }} style={{ width: 50, height: 50, borderRadius: 25 }} />
      </View>
      <View style={{ marginLeft: "60%" }}>
        <TouchableOpacity onPress={() => navigation.navigate("ScanQR", route.params)}>
          <FontAwesome name="qrcode" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ListChat;
