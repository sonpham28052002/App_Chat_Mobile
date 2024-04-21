import React, { useState, useEffect, useRef } from "react";
import ButtonCustom from "../../../components/button";
import { Modal, TextInput } from "react-native-paper";
import { CheckBox } from '@rneui/themed';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SectionList,
  FlatList,
  Dimensions
} from "react-native";
import {
  EvilIcons,
  MaterialIcons,
  Ionicons,
  SimpleLineIcons,
  Entypo,
  FontAwesome,
  Feather,
  AntDesign,
  FontAwesome6,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();
function TatCa({ route }) {
  const account = useSelector((state) => state.account);
  const [dataMember, setDataMember] = useState([]);
  //biến kiểm tra xem chức vụ của account hiện hành trong nhóm
  const [memberType, setMemberType] = useState("");
  useEffect(() => {
    setDataMember(route.params.members);
    setMemberType(route.params.members.find((item) => item.member.id === account.id).memberType);
  }, []);

  const [visibleRemove, setVisibleRemove] = useState(false);

  const [memberTarget, setMemberTarget] = useState('');

  const renderItem = ({ item }) => {
    return (
      item.memberType !== "LEFT_MEMBER"? <TouchableOpacity style={styles.FlatListTatCa}
        onLongPress={() => {
          if(memberType === "GROUP_LEADER" && account.id !== item.member.id){
              setMemberTarget(item.member.id)
              setVisibleRemove(true)
            }
        }}
      >
        <Image
          style={{ width: 50, height: 50, borderRadius: 50 }}
          source={{ uri: item.member.avt }}
        />
        <View style={{width:'75%'}}>
          {item.member.id === account.id ? (<Text style={{ fontSize: 18, fontWeight: 500 }}>Bạn</Text>):(<Text style={{ fontSize: 18, fontWeight: 500 }}>
            {item.member.userName}
          </Text>)}
          {item.memberType === "GROUP_LEADER" ? (
            <Text style={{ fontSize: 16, fontWeight: 400, color: "gray" }}>
              Trưởng nhóm
            </Text>
          ) : item.memberType === "DEPUTY_LEADER" ? (
            <Text style={{ fontSize: 16, fontWeight: 400, color: "gray" }}>
              Phó nhóm
            </Text>
          ) : (
            <Text>Thành viên</Text>
          )}
        </View>
        {
           ( memberType === "DEPUTY_LEADER" && item.member.id != account.id 
                  && item.memberType != "DEPUTY_LEADER" && item.memberType != "GROUP_LEADER") 
            || (memberType === "GROUP_LEADER" && item.member.id != account.id)
            ? 
            (
              <TouchableOpacity onPress={()=>{
                let dataSend = {
                  userId: item.member.id,
                  idGroup: route.params.idGroup,
                  ownerId: account.id
                }
                removeMember(dataSend)
              }}>
                <Entypo name="remove-user" size={24} color="red" />
              </TouchableOpacity>
            ) : <View style={{width:20}}>
                </View>
        }
      </TouchableOpacity>
    : null
    );
  };

  const [visible, setVisible] = useState(false);
  const { width, height } = Dimensions.get("window");
  const [data, setData] = useState(account.friendList.map((item) => ({ ...item.user, checked: false })));
  var stompClient = useRef(null);

  useEffect(() => {
    const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, onConnected, onError);
  }, []);

  const removeMember = (data) => {
   stompClient.current.send('/app/removeMemberInGroup', {}, JSON.stringify(data));
   loadAllMember()
  }

  const onConnected = () => {
    // stompClient.current.subscribe('/user/' + id + '/singleChat', onReceiveFromSocket)
  }

  const addMember = (data) => {
    stompClient.current.send('/app/addMemberIntoGroup', {}, JSON.stringify(data));
    setVisible(false);
    loadAllMember()
  }

  const onError = (error) => {
    console.log('Could not connect to WebSocket server. Please refresh and try again!');
  }

  const grantMember = (data) => {
    stompClient.current.send('/app/grantRoleMember_DEPUTY_LEADER', {}, JSON.stringify(data));
    loadAllMember()
  }

  const loadAllMember = async () =>{
    const result = await axios.get(`https://deploybackend-production.up.railway.app/messages/getMemberByIdSenderAndIdGroup?idSender=${account.id}&idGroup=${route.params.idGroup}`)
    try{
      if(result.data){
        setDataMember(result.data)
      }
    }catch(error){
    console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      {/* <Text style={{ fontSize: 18, color: "blue" }}>
        Thành viên ({route.params.members.length})
      </Text> */}
      <FlatList data={dataMember} renderItem={renderItem} />
      {memberType != "MEMBER" && <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center'}}><ButtonCustom width={50} title="+" backgroundColor="cyan" onPress={()=>setVisible(true)}/></View>}
      <Modal visible={visible} onDismiss={()=>setVisible(false)}
            contentContainerStyle={{
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                width: width * 0.9,
                marginHorizontal: width * 0.05,
                padding: 10,
                height: height * 0.8
                // height: 200,
                // marginLeft: width - width * 0.4,
                // marginBottom: height * 0.5 + 150
            }}
        >
          <Text style={{ fontSize: 25 }}>Thêm thành viên nhóm</Text>
          <TextInput style={{ backgroundColor: 'white', width: '100%' }} 
                placeholder='Tìm kiếm' placeholderTextColor={'gray'}
            />
                <View style={{ height: height * 0.8 - 170 }}>
                <FlatList data={data}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                            <CheckBox
                                checked={item.checked}
                                onPress={() => {
                                    setData(data.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i))
                                }}
                            />
                            <Image source={{ uri: item.avt }} style={{ width: 50, height: 50 }} />
                            <Text style={{ fontSize: 20, marginHorizontal: 10 }}>{item.userName}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <ButtonCustom title='Thêm' backgroundColor='cyan' border={true} onPress={()=> {
                let dataSelect = data.filter(item => item.checked)
                let arr = []
                dataSelect.map(item => arr.push({member: { id: item.id }}))
                let dataSend = {
                    idGroup: route.params.idGroup,
                    ownerID: account.id,
                    members: arr
                }
                addMember(dataSend)
            }}/>
        </Modal>
        <Modal visible={visibleRemove} onDismiss={()=>setVisibleRemove(false)}
            contentContainerStyle={{
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                width: width * 0.7,
                marginHorizontal: width * 0.15,
                // width: 280,
                // padding: 10,
                // height: height * 0.3
                height: 50,
                // marginLeft: width - width * 0.4,
                marginBottom: height * 0.5 + 255
            }}
        >
          <ButtonCustom title='Chọn làm phó nhóm' backgroundColor='white' border={true} onPress={()=>{
            let dataSend = {
              members: [{ member: { id: memberTarget}}],
              idGroup: route.params.idGroup,
              ownerID: account.id
            }
            grantMember(dataSend)
            setVisibleRemove(false)}}/>
        </Modal>
    </View>
  );
}

function DaMoi({ route }) {
  return (
    <View style={styles.container}>
      <Text>Đã mời</Text>
    </View>
  );
}

const ThanhVien = ({ navigation, route }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Tất cả"
        initialParams={{ members: route.params.member, idGroup: route.params.idGroup}}
        component={TatCa}
      />

      <Tab.Screen
        name="Đã mời"
        component={DaMoi}
        initialParams={{ members: route.params.member }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EBED",
    padding: 10,
  },
  FlatListTatCa: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
});
export default ThanhVien;
