import { View, ScrollView, Image, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react'
// import { firebaseConfig } from "../../config/firebase.js";
import firebase from "firebase/compat/app";

const ForgotPassword = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  // console.log("object", phoneNumber);
  function forgotpass (){
    navigation.navigate('AuthenOtp', { sdt: phoneNumber });
  }
  return (
    <View>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1fadea",
        paddingVertical: 17,
        paddingHorizontal: 14,
      }}>
        <Text style={{
          color: "#fdf8f8",
          fontSize: 20,
          flex: 1,
          fontWeight: 'bold',
        }}> Lấy lại mật khẩu</Text>
      </View>
      <View
        style={{
          backgroundColor: "#d9d9d9",
          paddingVertical: 7,
          paddingHorizontal: 14,
          marginBottom: 32,
        }}>
        <Text
          style={{
            color: "#000000",
            fontSize: 16,
          }}>
          Nhập số điện thoại để lấy lại mật khẩu
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBlockColor: "#06c3ff", width: "95%", marginBottom: 16, marginHorizontal: 15 }}>
        <TextInput
          style={{
            height: 40,
            color: "#635b5b",
            fontSize: 18,
            width: "85%",
          }}
          placeholder="Nhập số điện thoại"
          placeholderTextColor="#635b5b"
          value={phoneNumber}
          autoCapitalize="none"
          keyboardType="phone-pad"
          autoFocus={true}
          onChangeText={(text) => setPhoneNumber(text)}
        />
        <TouchableOpacity style={{ marginLeft: 'auto' }}>
          <Text style={{ fontSize: 18, color: "#B0B4BB" }}>x</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={forgotpass}
       style={{ width: '50%', height: '40px', backgroundColor: '#1faeeb', borderRadius: 20, marginHorizontal: 'auto' }}>
        <Text style={{ fontSize: 20, color: 'white', margin: 'auto' }}>
         Tiếp tục
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ForgotPassword;
