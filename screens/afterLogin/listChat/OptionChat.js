import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { Entypo, FontAwesome, Feather,AntDesign,FontAwesome6   } from "@expo/vector-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { Button } from "react-native-web";
const flastListData = [
  {
    icon: "edit",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "star",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "history",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "images",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "user-friends",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "user-plus",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "users",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "map-pin",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "eye-slash",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "phone-volume",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "user-cog",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "clock",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "warning",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "search",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "search",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "search",
    title: "Tìm tin nhắn",
    Button: "search",
  },
  {
    icon: "search",
    title: "Tìm tin nhắn",
    Button: "search",
  },
];
const OptionChat = () => {
  return (
    <View style={styles.container}>
      <View style={styles.ViewTop}>
        <Image
          style={{ width: 90, height: 90, borderRadius: 50 }}
          source={require("../../../assets/profile.png")}
        />
        <Text>A cục shit</Text>
        <View style={styles.ViewBottomTop}>
          <View style={styles.ViewItemTop}>
            <TouchableOpacity style={styles.ViewButtonTop}>
              <FontAwesome name="search" size={24} color="black" />
            </TouchableOpacity>

            <Text
              style={{
                width: 60,
                height: 50,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Tìm{"\n"}tin nhắn
            </Text>
          </View>
          <View style={styles.ViewItemTop}>
            <TouchableOpacity style={styles.ViewButtonTop}>
              <FontAwesome name="search" size={24} color="black" />
            </TouchableOpacity>

            <Text
              style={{
                width: 60,
                height: 50,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Trang{"\n"}cá nhân
            </Text>
          </View>
          <View style={styles.ViewItemTop}>
            <TouchableOpacity style={styles.ViewButtonTop}>
              <FontAwesome name="search" size={24} color="black" />
            </TouchableOpacity>

            <Text
              style={{
                width: 60,
                height: 50,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Đổi{"\n"}hình nền
            </Text>
          </View>
          <View style={styles.ViewItemTop}>
            <TouchableOpacity style={styles.ViewButtonTop}>
              <FontAwesome name="search" size={24} color="black" />
            </TouchableOpacity>

            <Text
              style={{
                width: 60,
                height: 50,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Tắt{"\n"}thông báo
            </Text>
          </View>
        </View>
      </View>
      <FlatList
        data={flastListData}
        renderItem={({ item }) => {
          return (
            <View style={styles.FlatListItem}>
              <FontAwesome6  name={item.icon}  size={24} color="black" />

            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E9EBED",
    alignItems: "center",
    gap: 10,
  },
  ViewTop: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  ViewBottomTop: {
    width: "80%",
    height: 140,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  ViewItemTop: {
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
    gap: 7,
  },
  ViewButtonTop: {
    width: 45,
    height: 45,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
  },
  FlatListItem: {
    width: "90%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default OptionChat;
