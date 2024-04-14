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
} from "react-native";
import { Video, ResizeMode } from "expo-av";

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
import { icon } from "@fortawesome/fontawesome-svg-core";
import { Button } from "react-native-web";
import { useSelector, useDispatch } from "react-redux";
import { ro } from "rn-emoji-keyboard";

const OptionChat = ({ navigation, route }) => {
  const [showModal, setShowModal] = useState(false);
  const account = useSelector((state) => state.account);
  console.log("aaa", route.params);
  useEffect(() => {
    getImageFileLink();
  }, []);
  // biến lưu trữ danh sách tin nhắn dạng file image sort theo thời gian gửi
  const [imageSortByTime, setImageSortByTime] = useState([]);
  const [fileSortByTime, setfileSortByTime] = useState([]);
  const [firtFourImage, setFirtFourImage] = useState([]);
  async function getImageFileLink() {
    try {
      const res = await axios.get(
        `https://deploybackend-production.up.railway.app/users/getMessageByIdSenderAndIsReceiver?idSender=${account.id}&idReceiver=${route.params.id}`
      );

      if (res.data) {
        const sort = res.data.sort(
          (a, b) => new Date(a.senderDate) - new Date(b.senderDate)
        );
        const image = sort.filter((item) => {
          return (
            item.messageType === "PNG" ||
            item.messageType === "JPEG" ||
            item.messageType === "JPG" ||
            item.messageType === "VIDEO"
          );
        });
        setFirtFourImage(image.slice(0, 4));
        // setImageSortByTime(sort);
      }
    } catch (error) {
      console.log("get image file link error", error);
    }
  }
  return (
    <View style={styles.container}>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        <View style={styles.ViewTop}>
          <Image
            style={{ width: 90, height: 90, borderRadius: 50 }}
            source={{ uri: route.params?.avt }}
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
                <Ionicons
                  name="color-palette-outline"
                  size={24}
                  color="black"
                />
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
              <TouchableOpacity
                style={styles.ViewButtonTop}
                onPress={() => setShowModal(true)}
              >
                <SimpleLineIcons name="bell" size={24} color="black" />
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.modalOption}>
                      <Text style={{ color: "#767A7F", fontSize: 12 }}>
                        Không thông báo tin nhắn tới của hội thoại này
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOption}>
                      <Text style={styles.modalText}>Trong 1 giờ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOption}>
                      <Text style={styles.modalText}>Trong 4 giờ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOption}>
                      <Text style={styles.modalText}>Đến 8 giờ sáng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalOption}>
                      <Text style={styles.modalText}>
                        Cho đến khi được mở lại
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalOption, { borderBottomWidth: 0 }]}
                      onPress={() => setShowModal(false)} // Đóng modal khi nhấn vào
                    >
                      <Text
                        style={{
                          color: "#006AF5",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        Hủy
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

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
              <Text style={styles.text}>Đổi tên gợi nhớ </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity
            onPress={() => {
              // truyền dữ liệu qua màn hình OptionChat2 là account của người đang chat với user hiện tại
              navigation.navigate("OptionChat2", { account: route.params });
            }}
            activeOpacity={0.7}
            style={[styles.item, { height: 140 }]}
          >
            <View style={[styles.contentButton]}>
              <Ionicons name="folder-outline" size={22} color="#767A7F" />
              <View style={{}}>
                <Text style={styles.text}>Ảnh, file, link đã gửi</Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                  {firtFourImage.map((item, index) => {
                    return item.messageType === "VIDEO" ? (
                      <Video
                        key={index}
                        source={{ uri: item.url }}
                        style={{ width: 57, height: 67, borderRadius: 10 }}
                        useNativeControls
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        key={index}
                        source={{ uri: item.url }}
                        style={{ width: 57, height: 67, borderRadius: 10 }}
                      />
                    );
                  })}
                  <View
                    style={{
                      width: 57,
                      height: 67,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#B9BDC1",
                    }}
                  >
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <AntDesign name="addusergroup" size={22} color="#767A7F" />
              <Text style={styles.text}>
                Tạo nhóm với {route.params.userName}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <SimpleLineIcons name="user-follow" size={22} color="#767A7F" />
              <Text style={styles.text}>
                Thêm {route.params.userName} vào nhóm
              </Text>
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
              <MaterialCommunityIcons
                name="message-text-clock-outline"
                size={22}
                color="#767A7F"
              />
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
              <MaterialCommunityIcons
                name="delete-outline"
                size={22}
                color="#DC1F18"
              />
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
    height: 55,
  },
  contentButton: {
    gap: 10,
    marginTop: 10,
    flexDirection: "row",
  },
  text: {
    fontSize: 19,
    color: "black",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "98%",
    marginBottom: 6,
  },
  modalContent: {
    backgroundColor: "white",
    width: "98%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalOption: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#006AF5",
  },
});

export default OptionChat;
