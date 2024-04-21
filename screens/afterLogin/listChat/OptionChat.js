import React, { useState, useEffect, useRef } from "react";
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
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

const OptionChat = ({ navigation, route }) => {
  const [showModal, setShowModal] = useState(false);
  const account = useSelector((state) => state.account);
  const [isGroup, setIsGroup] = useState(false);
  const [dataMember, setDataMember] = useState([]);
  const [member, setMember] = useState("");
  var stompClient = useRef(null);
  function getMember() {
    axios
      .get(
        `https://deploybackend-production.up.railway.app/messages/getMemberByIdSenderAndIdGroup?idSender=${account.id}&idGroup=${route.params.id}`
      )
      .then((res) => {
      setDataMember(res.data);
      let arr = res.data.filter((item) => item.memberType !== "LEFT_MEMBER");
        setMember(arr.length);
      })
      .catch((err) => {
        console.log("get member error", err);
      });
  }
  useEffect(() => {
    if (route.params.nameGroup) {
      getImageFileLinkGroup();
      getMember();
      setIsGroup(true);
    } else {
      getImageFileLink();
      setIsGroup(false);
    }
    const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, onConnected, onError);
  }, []);

  const onConnected = () => {
    stompClient.current.subscribe('/user/' + account.id + '/outGroup', (payload)=>{
      navigation.navigate("ListChat")
    })
    // stompClient.current.subscribe('/user/' + id + '/singleChat', onReceiveFromSocket)
  }

  const addMember = (data) => {
    stompClient.current.send('/app/addMemberIntoGroup', {}, JSON.stringify(data));
  }

  const onError = (error) => {
    console.log('Could not connect to WebSocket server. Please refresh and try again!');
  }

  // get danh sách 4 ảnh file đầu tiên của group chat
  const [firtFourImageGroup, setFirtFourImageGroup] = useState([]);
  async function getImageFileLinkGroup() {
    try {
      const res = await axios.get(
        `https://deploybackend-production.up.railway.app/messages/getMessageAndMemberByIdSenderAndIdGroup?idSender=${account.id}&idGroup=${route.params.id}`
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
        setFirtFourImageGroup(image.slice(0, 4));
      }
    } catch (error) {
      console.log("get image file link group error", error);
    }
  }

  const outGroup = (data) => {
    stompClient.current.send('/app/outGroup', {}, JSON.stringify(data));
  }

  // biến lưu trữ danh sách tin nhắn dạng file image sort theo thời gian gửi

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
          <TouchableOpacity activeOpacity={0.8}>
            <Image
              style={{ width: 90, height: 90, borderRadius: 50 }}
              source={{ uri: route.params?.avt }}
            />
          </TouchableOpacity>

          {isGroup ? (
            <Text style={{ fontSize: 17, fontWeight: 500, marginTop: 7 }}>
              {route.params?.nameGroup}
            </Text>
          ) : (
            <Text>{route.params?.userName}</Text>
          )}
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
            {isGroup ? (
              <View style={styles.ViewItemTop}>
                <TouchableOpacity style={styles.ViewButtonTop}>
                  <AntDesign name="addusergroup" size={24} color="black" />
                </TouchableOpacity>

                <Text
                  style={{
                    width: 60,
                    height: 50,
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  Thêm{"\n"}thành viên
                </Text>
              </View>
            ) : (
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
            )}

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
          {isGroup ? null : (<View
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
        </View>)}
        
        {isGroup ? null : ( <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <Feather name="edit-3" size={22} color="#767A7F" />
              <Text style={styles.text}>Đổi tên gợi nhớ </Text>
            </View>
          </TouchableOpacity>
        </View>)}
       

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
                  {isGroup? firtFourImageGroup.map((item, index) => {
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
                  }):firtFourImage.map((item, index) => {
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

        {isGroup ? (<View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <Ionicons name="calendar-outline" size={22} color="#767A7F" />
              <Text style={styles.text}>
                Lịch nhóm
              </Text>
            </View>
          </TouchableOpacity>
        </View>): (<View
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
        </View>)}

        {isGroup ? (<View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <AntDesign name="pushpino" size={22} color="#767A7F" />
              <Text style={styles.text}>
                Tin nhắn đã ghim
              </Text>
            </View>
          </TouchableOpacity>
        </View>) : (<View
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
        </View>)}

        {isGroup ? (   <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity 
          onPress={() => {
            navigation.navigate("ListMemberGroup", { member: dataMember, idGroup: route.params.id});
          }}
          style={styles.item}>
            <View style={styles.contentButton}>
              <Feather name="users" size={22} color="#767A7F" />
              <Text style={styles.text}>Xem thành viên ({member})</Text>
            </View>
          </TouchableOpacity>
        </View>):(   <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 1 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <Feather name="users" size={22} color="#767A7F" />
              <Text style={styles.text}>Xem nhóm chung</Text>
            </View>
          </TouchableOpacity>
        </View>)}

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

        {isGroup ? (<View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <Entypo name="link" size={22} color="#767A7F" />
              <Text style={styles.text}>Link tham gia nhóm</Text>
            </View>
          </TouchableOpacity>
        </View>) :  <View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <Feather name="phone-incoming" size={22} color="#767A7F" />
              <Text style={styles.text}>Báo cuộc gọi đến</Text>
            </View>
          </TouchableOpacity>
        </View>}

        {isGroup ? (<View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <AntDesign name="pushpino" size={24} color="black" />
              <Text style={styles.text}>Ghim trò chuyện</Text>
            </View>
          </TouchableOpacity>
        </View>) : (<View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <FontAwesome5 name="user-cog" size={22} color="#767A7F" />
              <Text style={styles.text}>Cài đặt cá nhân</Text>
            </View>
          </TouchableOpacity>
        </View>)}

        {isGroup ? (<View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
            <FontAwesome5 name="user-cog" size={22} color="#767A7F" />
              <Text style={styles.text}>Cài đặt cá nhân</Text>
            </View>
          </TouchableOpacity>
        </View>) : (<View
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
        </View>)}

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

        {isGroup ? (<View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item} 
            onPress={()=>{
              let datasend = {
                userId : account.id,
                idGroup: route.params.id
              }
              outGroup(datasend)
            }}
          >
            <View style={styles.contentButton}>
            <Feather name="log-out" size={22} color="red" />
              <Text style={styles.text}>Rời nhóm</Text>
            </View>
          </TouchableOpacity>
        </View>) : (<View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <Entypo name="block" size={22} color="#767A7F" />
              <Text style={styles.text}>Quản lý chặn</Text>
            </View>
          </TouchableOpacity>
        </View>)}

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

        {isGroup ? (<View
          style={{ backgroundColor: "white", width: "100%", marginVertical: 2 }}
        >
          <TouchableOpacity style={styles.item}>
            <View style={styles.contentButton}>
              <MaterialCommunityIcons
                name="delete-outline"
                size={22}
                color="black"
              />
              <Text style={styles.text}>Xóa lịch sử trò chuyện </Text>
            </View>
          </TouchableOpacity>
        </View>) : (<View
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
        </View>)}
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
