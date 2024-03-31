import React, { useState, useEffect,useRef } from "react";
import { SafeAreaView, View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
// import store from "../../Redux/Redux";
import { useDispatch } from 'react-redux';
import { save } from "../../Redux/slice";
import PhoneInputText from "../../components/PhoneInputText";
import PhoneInput from "react-native-phone-input";
import { Entypo } from '@expo/vector-icons';
import LoginOtp from "./LoginOtp";
import LoginController from "./LoginController";
import Home from '../afterLogin/listChat/HomeChat'  
const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("84814929002");
  const [password, setPassword] = useState("cuongdacap123");
  const [showPassword, setShowPassword] = useState(false);
  const [account, setAccount] = useState([]);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [showError, setShowError] = useState(false);
  const dispatch = useDispatch();
  const  phoneInput = useRef(null);
  var [eye1, setEye1] = useState('eye-with-line')
    var [eye2, setEye2] = useState('eye-with-line')
  var [secureTextEntry1, setSecureTextEntry1] = useState(true)
  var [secureTextEntry2, setSecureTextEntry2] = useState(true)
  const [phoneNumberWithoutPlus, setPhoneNumberWithoutPlus] = useState('');

  const handleLogin = async () => {
     let found = false;
    try {
      console.log(phoneNumber);
      console.log(password);
      // Gọi API để kiểm tra tài khoản
      const accountRes = await axios.get(`https://deploybackend-production.up.railway.app/account/getAccountPhoneAndPassword?phone=${phoneNumberWithoutPlus}&password=${password}`);
      if (accountRes.data) {
        console.log(accountRes.data);
        const userId = accountRes.data.id;
        const userRes = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${userId}`);
        if (userRes.data) {
          console.log(userRes.data);
          dispatch(save(userRes.data));
          found = true;
          navigation.navigate("Home");
        }
      } else {
          if (!found) { 
    setError("Số điện thoại hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại");
    setShowError(true);
  } else { 
    setError("");
    setShowError(false);
  }
        setShowError(true);
      }
    } catch (error) {
      console.log(error);
      setShowError(true);
    }
  };
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleLoginOtp = (user) => {
    navigation.navigate('LoginController');
};


  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setError("");
      setShowError(false);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#ffffff", paddingBottom: 17 }}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#1fadea", paddingVertical: 17, paddingHorizontal: 14 }}>
          <Text style={{ color: "#fdf8f8", fontSize: 20, flex: 1 }}>Đăng nhập</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: "#d9d9d9", paddingVertical: 7, paddingHorizontal: 14, marginBottom: 32 }}>
          <Text style={{ color: "#000000", fontSize: 20 }}>Vui lòng nhập số điện thoại và mật khẩu đăng nhập</Text>
        </View>
        {showError && ( 
          <Text style={{ color: "red", fontSize: 16, marginHorizontal: 15 }}>{error}</Text>
        )}
      <View style={{flex: 1, justifyContent: 'center'}}>
      <PhoneInput ref={phoneInput}
        initialCountry='vn'
        onChangePhoneNumber={(phoneNumber) => {
          const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber.slice(1) : phoneNumber;
          setPhoneNumberWithoutPlus(formattedPhoneNumber);
        }}
        style={{
          paddingLeft: 10,
          width: '100%',
          height: 80,
          borderColor: 'black',
          borderTopWidth:1,
          borderBottomWidth:1,
          // borderRadius: 5,
          marginVertical: 10
        }}
        textStyle={{
          paddingHorizontal: 10,
          fontSize: 20,
          height: 80,
          borderLeftWidth: 1,
        }}
        cancelText='Hủy'
        cancelTextStyle={{ fontSize: 20, color: 'red' }}
        confirmText='Xác nhận'
        confirmTextStyle={{ fontSize: 20, color: 'green' }}
        pickerItemStyle={{ fontSize: 20 }}
      />
      </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <TextInput
            style={{ flex: 1, height: 80, color: "#635b5b", fontSize: 20 }}
            placeholder="Mật khẩu"
            placeholderTextColor="#635b5b"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={secureTextEntry1}
          />
            <View style={{ width: '12%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                if (eye1 == 'eye') {
                                    setEye1('eye-with-line')
                                    setSecureTextEntry1(!secureTextEntry1)
                                }
                                else {
                                    setEye1('eye')
                                    setSecureTextEntry1(!secureTextEntry1)
                                }
                            }}>
                                <Entypo name={eye1} size={30} color="black" />
                            </TouchableOpacity>
                        </View>
        </View>
        <Text style={{ color: "#2752eb", fontSize: 20, marginBottom: 49, marginLeft: 15, textDecorationLine: "underline", textDecorationColor: "#2752eb" }} onPress={handleForgotPassword}>Lấy lại mật khẩu</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
            <Text style={styles.buttonTextLogin}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonRegis} onPress={handleRegister}>
            <Text style={styles.buttonTextRegis}>Đăng kí</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonOtpContainer}>
        <TouchableOpacity style={styles.buttonOtp} onPress={handleLoginOtp}>
            <Text style={styles.buttonTextOtp}>Đăng nhập bằng OTP</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: "#635b5b", fontSize: 12, marginLeft: 126, marginBottom: 50 }}>Các câu hỏi thường gặp</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  buttonLogin: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1faeeb",
    borderRadius: 20,
    paddingVertical: 13,
    marginBottom: 20,
    marginRight: 5,
  },
  buttonRegis: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    borderRadius: 20,
    paddingVertical: 13,
    marginBottom: 20,
    marginRight: 5,
  },
  buttonOtp: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1faeeb",
    borderRadius: 20,
    paddingVertical: 13,
    marginBottom: 20,
    marginRight: 5,
  },
  buttonTextLogin: {
    color: "#ffffff",
    fontSize: 20,
  },
  buttonTextRegis: {
    color: "#000000",
    fontSize: 20,
  },
  buttonTextOtp: {
    color: "#ffffff",
    fontSize: 20,
  },
  buttonOtpContainer:{
    margin:10
  }
});

export default Login;
