import { View, ScrollView, Image, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react'
// import { firebaseConfig } from "../../config/firebase.js";
import firebase from "firebase/compat/app";

const ForgotPassword = ({navigation,route}) => {
  const [otpEnter, setOtpEnter] = useState("");
  function tiepTuc(){
    navigation.navigate('ResetPass', { sdt: route.params.sdt });
  }
  return (
    <View>
     <Text>
      Nhập mã otp gửi đến số: {route.params.sdt}
     </Text>
     <TextInput
          style={{
            height: 40,
            color: "#635b5b",
            fontSize: 18,
            width: "85%",
          }}
          placeholder="Nhập mã otp"
          placeholderTextColor="#635b5b"
          value={otpEnter}
          autoCapitalize="none"
          keyboardType="phone-pad"
          autoFocus={true}
          onChangeText={(text) => setOtpEnter(text)}
        />
        <TouchableOpacity onPress={()=>{
          tiepTuc()
        }}
       style={{ width: '50%', height: '40px', backgroundColor: '#1faeeb', borderRadius: 20, marginHorizontal: 'auto' }}>
        <Text style={{ fontSize: 20, color: 'white', margin: 'auto' }}>
         Tiếp tục
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ForgotPassword;
