import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Entypo, FontAwesome, MaterialIcons, Feather, Clarity} from "@expo/vector-icons";

const OptionChat = () => {
  return (
    <View style={styles.container}>
      <View style={styles.ViewTop}>
        <View style={styles.icon}>
        <Feather name="arrow-left" size={24} color="#015CE0" />
        </View>
        {/* Text 'Tùy chọn' */}
        <Text style={styles.text}>Tùy chọn</Text>
      </View>

      <View style={styles.ViewAvatar}>
        <Image
          source={require("../../../assets/bgr.png")}
          style={{ width: 90, height: 90, borderRadius: 50 }}
        />
        <Text style={{ fontSize: 20, color: "black", marginTop: 10 }}>
          Nguyễn Văn A
        </Text>
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity style={{}}>
        <FontAwesome name="search" size={24} color="#015CE0" />
          <View style={styles.contentButton}> 
            <Text style={{ width: 25, height: 50, fontSize:10 }}>Tìm tin nhắn</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{}}>
        <Feather name="user" size={24} color="#015CE0" />
          <View style={styles.contentButton}>
            <Text style={{ width: 25, height: 40, fontSize:10 }}>Trang cá nhân</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
        <Entypo name="lock" size={24} color="#015CE0" />
          <View style={styles.contentButton}>
            <Text style={{ width: 25, height: 40, fontSize:10 }}>Đổi hình nền</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
        <Feather name="bell" size={24} color="#015CE0" />
          <View style={styles.contentButton}>
            <Text style={{ width: 25, height: 40, fontSize:10 }}>Tắt thông báo</Text>
          </View>
        </TouchableOpacity>
        
        </View>
      </View>
      <View style={styles.touchableOpacity}>
        <View style={{ backgroundColor:"white", width:'100%', marginVertical: 2 }}>
        <TouchableOpacity style={styles.item}>
          <View style={styles.contentButton}>
            <Entypo name="lock" size={22} color="#015CE0" />
            <Text style={styles.text}>Mã hóa đầu cuối</Text>
          </View>
          <Text style={{marginLeft:20, color:"gray"}} > Chưa nâng cấp</Text>
        </TouchableOpacity>
        </View>

        <View style={{ backgroundColor:"white", width:'100%', marginVertical: 1 }}>
        <TouchableOpacity style={styles.item}>
          <View style={styles.contentButton}>
            <Feather name="edit-3" size={22} color="#015CE0" />
            <Text style={styles.text}>Đổi tên gợi nhớ</Text>
          </View>
        </TouchableOpacity>
        </View>

        <View style={{ backgroundColor:"white", width:'100%', marginVertical: 1 }}>
        <TouchableOpacity style={styles.item}>
          <View style={styles.contentButton}>
            <Entypo name="folder-images" size={22} color="#015CE0" />
            <Text style={styles.text}>Ảnh, file, link đã gửi</Text>
          </View>
        </TouchableOpacity>
        </View>

        <View style={{ backgroundColor:"white", width:'100%', marginVertical: 1 }}>
        <TouchableOpacity style={styles.item}>
          <View style={styles.contentButton}>
            <Feather name="users" size={22} color="#015CE0" />
            <Text style={styles.text}>Xem nhóm chung</Text>
          </View>
          </TouchableOpacity>
          </View>
          
          <View style={{ backgroundColor:"white", width:'100%', marginVertical: 1 }}>
        <TouchableOpacity style={styles.item}>
          <View style={styles.contentButton}>
            <Entypo name="eye-with-line" size={22} color="#015CE0" />
            <Text style={styles.text}>Ẩn trò chuyện</Text>
          </View>
        </TouchableOpacity>
        </View>

        <View style={{ backgroundColor:"white", width:'100%', marginVertical: 2 }}>
        <TouchableOpacity style={styles.item}>
          <View style={styles.contentButton}>
            <Feather name="phone-incoming" size={22} color="#015CE0" />
            <Text style={styles.text}>Báo cuộc gọi đến</Text>
          </View>
        </TouchableOpacity>
        </View>

        <View style={{ backgroundColor:"white", width:'100%', marginVertical: 2 }}>
        <TouchableOpacity style={styles.item}>
          <View style={styles.contentButton}>
            <FontAwesome name="cogs" size={22} color="#015CE0" />
            <Text style={styles.text}>Cài đặt cá nhân</Text>
          </View>
        </TouchableOpacity>
        </View>
        
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EBED",
  },
  ViewTop: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 2,
    height: 50,
    backgroundColor: "lightblue",
    paddingLeft: 1,
  },
  icon: {
    marginRight: 10,
    marginLeft: 1,
  },
  text: {
    fontSize: 19,
    color: "black",
  },
  ViewAvatar: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    backgroundColor: "#FFFFFF",
  },
  touchableOpacity: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderColor: "#DDDDDD",
    borderBottomWidth: 1,
},
  description: {
    color: "#635b5b",
    fontSize: 15,
    marginBottom: 10,
},
item: {
  alignItems: "flex-start",
  justifyContent: "flex-start",
  marginHorizontal: 14,
  marginBottom: 20,
},
contentButton: {
  marginTop: 10,
  flexDirection: "row",
},
});

export default OptionChat;
