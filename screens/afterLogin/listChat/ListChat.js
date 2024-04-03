import { View, Text, TouchableOpacity ,Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons'; 
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

  return (
    <View style={{ marginTop: 40, marginLeft: 20,flexDirection:"row"}}>
      <View>
      <TouchableOpacity onPress={() => navigation.navigate("Chat", 
          id == 'jgfqCBTFdEgDmpHHXaNHdZV8B982'?
          'N7B7os8xFOMceSxRSIzQlkwr3N43' : 'jgfqCBTFdEgDmpHHXaNHdZV8B982'
          )}>
        <Text>Chat với Sơn Phạm</Text>
      </TouchableOpacity>
      <Image source={{ uri: avt }} style={{ width: 50, height: 50, borderRadius: 25 }} />
      </View>
   <View style={{marginLeft:"60%"}}>
   <TouchableOpacity onPress={() => navigation.navigate("ScanQR", route.params)}>
        <FontAwesome name="qrcode" size={30} color="black" />
      </TouchableOpacity>
   </View>
    </View>
  );
}

export default ListChat;
