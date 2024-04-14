import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import {
  Ionicons,
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import { useNavigation } from "@react-navigation/native";

function FormatTenQuaDai(text, maxLength) {
  return text.length > maxLength
    ? text.substring(0, maxLength - 3) + "..."
    : text;
}
export default function User() {
  const account = useSelector((state) => state.account);
  const [searchText, setSearchText] = useState("");
  const [firends, setFirends] = useState([]);
  const navigation = useNavigation();
  // lấy danh sách bạn bè của user hiện hành
  const fetchUserData = async () => {
    try {

     setFirends(account.friendList);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUserData();
    });
    return unsubscribe;
  }, [navigation]);

  //hàm render danh sách liên hệ đẫ tìm
  const renderLienHeDaTim = ({ item }) => (
    <TouchableOpacity onPress={() => {}}>
      <View style={{ alignItems: "center", width: 100 }}>
        <Image
          style={{
            width: 55,
            height: 55,
            borderRadius: 50 / 2,
          }}
          source={{ uri: item.user.avt }}
        />
        <Text style={{ fontSize: 20, fontWeight: "400", textAlign: "center" }}>
          {FormatTenQuaDai(item.user.userName, 18)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Lọc danh sách bạn liên hệ theo tên, kết quả tìm kiếm sẽ được hiển thị sau 300ms
  const [filteredFriend, setFilteredFriend] = useState([]);
  useEffect(() => {
    const timerId = setTimeout(() => {
      handleSearch();
    }, 200);

    return () => clearTimeout(timerId);
  }, [searchText]);

  const handleSearch = async () => {
    const filtered = firends.filter((user) =>
      user.user.userName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFriend(filtered);
  };

  //Hàm render danh sách tìm kiếm
  const renderUserItemSearch = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Chat", item.user)
      }}
    >
      <View
        style={{
          alignItems: "center",
          width: "100%",
          flexDirection: "row",
          padding: 15,
          paddingRight: 25,
          justifyContent: "space-between",
        }}
      >
        <View style={{ alignItems: "center", flexDirection: "row", gap: 15 }}>
          <Image
            style={{
              width: 55,
              height: 55,
              borderRadius: 50 / 2,
            }}
            source={{ uri: item.user.avt }}
          />
          <Text
            style={{ fontSize: 20, fontWeight: "400", textAlign: "center" }}
          >
            {FormatTenQuaDai(item.user.userName, 18)}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            backgroundColor: "#E0FFFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="phone" size={20} color="#006AF5" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          height: 56,
          alignItems: "center",
          backgroundColor: "cyan",
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back-outline" size={28} color="white" />
        </TouchableOpacity>

        <View
          style={{
            marginLeft: 20,
            fontWeight: "bold",
            backgroundColor: "white",
            borderRadius: 8,
            width: 255,
            height: 33,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 8,
            marginRight: 20,
          }}
        >
          <Feather name="search" size={24} color="#767A7F" />
          <TextInput
            placeholder="Tìm kiếm"
            autoFocus={true}
            placeholderTextColor={"#767A7F"}
            style={{
              marginLeft: 10,
              fontWeight: "400",
              fontSize: 18,
              width: 180,
              height: 28,
              color: "black",
            }}
            onChangeText={(text) => setSearchText(text)}
            value={searchText}
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <MaterialIcons name="cancel" size={24} color="#767A7F" />
            </TouchableOpacity>
          )}
        </View>
        <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
      </View>
      {/* ======================================= */}
      {/* Nếu không nhập gì vào textimput thì sẽ trả về danh sách bạn bè đã tìm trước đó, */}
      {searchText.length == 0 ? (
        <View style={{ flex: 1, padding: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 600 }}>Liên hệ đã tìm</Text>
          <FlatList
            data={firends}
            horizontal
            //   keyExtractor={(item) => item.id.toString()}
            renderItem={renderLienHeDaTim}
            //   contentContainerStyle={styles.userList}
          />
        </View>
      ) : (
        // Hiển thị danh sách kết quả tìm kiếm
        <FlatList
          data={filteredFriend}
          renderItem={renderUserItemSearch}
          //   keyExtractor={(item) => item.id.toString()}
          //   contentContainerStyle={styles.userList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6D9DC",
  },
  FlatList: {
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
