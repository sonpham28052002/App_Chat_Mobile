import { View, Text, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
// import store from '../../../Redux/Redux';
import { useSelector } from 'react-redux';
const ListChat = ({ navigation, route }) => {
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity onPress={() => navigation.replace('NewScreen')}>
  //         <Text>Replace</Text>
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);
  const name = useSelector((state) => state.account.userName);
  const avt = useSelector((state) => state.account.avt);

  const id = useSelector((state) => state.account.id);

  const obj = useSelector((state) => state.account);
  console.log(obj);
  // const obj = {
  //   id: "RGpCgF0lR1aGVcttckhAbBHWcSp2",
  //   userName: "Nguyễn Thanh Sơn",
  //   phone: "84387866829",
  //   gender: "Nam",
  //   avt: "https://projectappchat.blob.core.windows.net/containerapp/dadeb8a7-fae6-45fc-ab34-40588bcb0c40.jpeg",
  //   coverImage: null,
  //   logOut: null,
  //   conversation: [
  //     {
  //       updateLast: "2024-04-03T08:28:54.222",
  //       conversationType: "single",
  //       user: {
  //         id: "jgfqCBTFdEgDmpHHXaNHdZV8B982"
  //       },
  //       lastMessage: {
  //         id: "ccd4fb61-8c44-43aa-b72c-5ca04532d4ab",
  //         messageType: "Text",
  //         senderDate: "2024-04-03T08:28:54.062",
  //         sender: {
  //           id: "RGpCgF0lR1aGVcttckhAbBHWcSp2"
  //         },
  //         receiver: {
  //           id: "jgfqCBTFdEgDmpHHXaNHdZV8B982"
  //         },
  //         react: null,
  //         seen: null,
  //         replyMessage: null,
  //         content: "Ha🤣ha"
  //       }
  //     }
  //   ],
  //   friendList: [

  //   ],
  //   bio: null,
  //   dob: null
  // }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{
        backgroundColor: 'cyan', paddingHorizontal: 10,
        height: 50, flexDirection: 'row',
        width: '100%', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <FontAwesome name="search" size={35} color="white" />
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
        <AntDesign name="adduser" size={35} color="white" />
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        <FlatList data={obj.conversation}
          renderItem={({ item }) => (
            item.user &&
            <TouchableOpacity style={{ height: 70, flexDirection: 'row',
             justifyContent: 'space-between', alignItems: 'center',
            paddingVertical: 5}}
              onPress={() => navigation.navigate("Chat",
                id == 'jgfqCBTFdEgDmpHHXaNHdZV8B982' ?
                  'RGpCgF0lR1aGVcttckhAbBHWcSp2' : 'jgfqCBTFdEgDmpHHXaNHdZV8B982'
              )}
            >
              <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg' }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              </View>
              <View style={{
                width: '70%', paddingHorizontal: 10,
                borderBottomWidth: 1, borderBottomColor: 'grey',
                height: 70, justifyContent: 'center', alignItems: 'flex-start'
              }}>
                <Text style={{ fontSize: 20 }} numberOfLines={1}>{item.user.id}</Text>
                <Text style={{ fontSize: 16, color: 'grey' }}>{item.lastMessage.content}</Text>
              </View>
              <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: 'grey' }}>4 giờ</Text>
                <View style={{ backgroundColor: 'red', borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                  <Text style={{ fontSize: 16, color: 'white' }}>1</Text>
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
