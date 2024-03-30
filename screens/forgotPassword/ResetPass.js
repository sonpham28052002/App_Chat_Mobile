import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet
} from "react-native";

const ForgotPassword = ({ navigation, route }) => {
  const [mkMoi, setMkMoi] = useState("");
  const [confirmMk, setConfirmMk] = useState("");
  const [notification, setNotification] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  function handleResetPass() {
    if (mkMoi !== confirmMk) {
      setNotification("Mật khẩu không khớp");
    } else {
      setNotification("");
      fetch(`https://deploybackend-production.up.railway.app/account/forgotPasswordAccount?id=5&passwordNew=${mkMoi}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({})
      })
      .then(response => response.json())
      .then(data => {
        console.log("reset password success", data);
        setModalVisible(true); // Hiển thị modal khi reset mật khẩu thành công
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
    }
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TextInput
        style={styles.input}
        placeholder="Nhập mã mật khẩu mới"
        placeholderTextColor="#635b5b"
        value={mkMoi}
        autoCapitalize="none"
        onChangeText={(text) => setMkMoi(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu mới"
        placeholderTextColor="#635b5b"
        value={confirmMk}
        autoCapitalize="none"
        onChangeText={(text) => setConfirmMk(text)}
      />
      <Text style={{ color: "red", marginBottom: 10 }}>{notification}</Text>
      <TouchableOpacity
        onPress={handleResetPass}
        style={[styles.button, { backgroundColor: "#1faeeb" }]}
      >
        <Text style={{ fontSize: 20, color: "white", margin: "auto" }}>
          Tiếp tục
        </Text>
      </TouchableOpacity>

      {/* Modal hiển thị thông báo reset mật khẩu thành công */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
              Reset mật khẩu thành công!
            </Text>
            <Button
              title="OK"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Login"); // Điều hướng về trang Home
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    color: "#635b5b",
    fontSize: 18,
    width: "85%",
    marginBottom: 10,
  },
  button: {
    width: "50%",
    height: 40,
    borderRadius: 20,
    marginHorizontal: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default ForgotPassword;
