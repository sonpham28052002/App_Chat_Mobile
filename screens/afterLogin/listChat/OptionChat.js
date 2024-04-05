import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SectionList,
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
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { Button } from "react-native-web";

// // const sectionData = [
// //   {
// //     title: "Section 1",
// //     data: [
// //       {
// //         icon: "edit",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "star",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "history",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "images",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "user-friends",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "user-plus",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "users",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "map-pin",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "eye-slash",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "phone-volume",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "user-cog",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "clock",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "warning",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "search",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "search",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "search",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //       {
// //         icon: "search",
// //         title: "Tìm tin nhắn",
// //         Button: "search",
// //       },
// //     ],
//   },
// ];

const OptionChat = ({route}) => {
  console.log("object", route.params);
  return (
    <View style={styles.container}>
       <ScrollView style={{width:"100%", height:"100%"}}>
      <View style={styles.ViewTop}>
        <Image
          style={{ width: 90, height: 90, borderRadius: 50 }}
          source={{uri: route.params?.avt}}
        />
        <Text>{route.params?.userName}</Text>
        <View style={styles.ViewBottomTop}>
          <View style={styles.ViewItemTop}>
            <TouchableOpacity style={styles.ViewButtonTop}>
            <AntDesign name="search1" size={24} color="black" />
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
            <Feather name="user" size={24} color="black" />
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
            <Ionicons name="color-palette-outline" size={24} color="black" />
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
            <SimpleLineIcons name="bell" size={24} color="black" />
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
     
        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <MaterialIcons name="lock-outline" size={22} color="#767A7F" />
              <Text style={styles.text}>Mã hóa đầu cuối</Text>
            </View>
            <Text style={{ marginLeft: 30, color: "gray" }}>
              {" "}
              Chưa nâng cấp
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <Feather name="edit-3" size={22} color="#767A7F" />
              <Text style={styles.text}>Đổi tên gợi nhớ</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <Ionicons name="folder-outline" size={22} color="#767A7F" />
              <Text style={styles.text}>Ảnh, file, link đã gửi</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <AntDesign name="addusergroup" size={22} color="#767A7F" />
              <Text style={styles.text}>Tạo nhóm với {route.params.userName}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <SimpleLineIcons name="user-follow" size={22} color="#767A7F" />
              <Text style={styles.text}>Thêm {route.params.userName} vào nhóm</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <Feather name="users" size={22} color="#767A7F" />
              <Text style={styles.text}>Xem nhóm chung</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <Entypo name="eye-with-line" size={22} color="#767A7F" />
              <Text style={styles.text}>Ẩn trò chuyện</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <Feather name="phone-incoming" size={22} color="#767A7F" />
              <Text style={styles.text}>Báo cuộc gọi đến</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <FontAwesome5 name="user-cog" size={22} color="#767A7F" />
              <Text style={styles.text}>Cài đặt cá nhân</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <MaterialCommunityIcons name="message-text-clock-outline" size={22} color="#767A7F" />
              <Text style={styles.text}>Tin nhắn tự xóa</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <AntDesign name="warning" size={22} color="#767A7F" />
              <Text style={styles.text}>Báo xấu</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <Entypo name="block" size={22} color="#767A7F" />
              <Text style={styles.text}>Quản lý chặn</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <Ionicons name="pie-chart-outline" size={22} color="#767A7F" />
              <Text style={styles.text}>Dung lượng trò chuyện</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <MaterialCommunityIcons name="delete-outline" size={22} color="#767A7F" />
              <Text style={styles.text}>Xóa lịch sử trò chuyện </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    height: 235,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  ViewBottomTop: {
    width: "80%",
    height: 120,
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
    backgroundColor: "#F4F5F6",
  },
  FlatListItem: {
    width: "90%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
//   touchableOpacity: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     borderColor: "#DDDDDD",
//     borderBottomWidth: 1,
//     width: "100%",
// },
  item: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginHorizontal: 14,
    height:55,
  },
  contentButton: {
    gap:10,
    marginTop: 10,
    flexDirection: "row",
  },
  text: {
    fontSize: 19,
    color: "black",
  },
});

export default OptionChat;
