import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SectionList,
  Modal,
  FlatList,
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
  const renderItem = ({ item }) => {
    return (
      <View style={styles.FlatListTatCa}>
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
           ( memberType === "DEPUTY_LEADER" &&item.member.id != account.id ) || (memberType === "GROUP_LEADER" &&item.member.id != account.id)
            ? 
            (
              <TouchableOpacity>
                <Entypo name="remove-user" size={24} color="red" />
              </TouchableOpacity>
            ) : <View style={{width:20}}>
                </View>
        }
          
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, color: "blue" }}>
        Thành viên ({route.params.members.length})
      </Text>
      <FlatList data={dataMember} renderItem={renderItem} />
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
        initialParams={{ members: route.params.member }}
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
