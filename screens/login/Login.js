import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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
import InputPassword from "../../components/InputPassword";
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("0123456789Cc");
  const [showPassword, setShowPassword] = useState(false);
  const [account, setAccount] = useState([]);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [showError, setShowError] = useState(false);
  const dispatch = useDispatch();
  const phoneInput = useRef(null);
  const [phoneNumberWithoutPlus, setPhoneNumberWithoutPlus] = useState('84814929002');

  const handleLogin = async () => {
    let found = false;

    try {
      // Gọi API để kiểm tra tài khoản
      const accountRes = await axios.get(`https://deploybackend-production.up.railway.app/account/getAccountPhoneAndPassword?phone=${phoneNumberWithoutPlus}&password=${password}`);
      if (accountRes.data) {
        // console.log(accountRes.data);
        const userId = accountRes.data.id;
        const userRes = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${userId}`);
        if (userRes.data) {
          // console.log(userRes.data);
          const account=userRes.data
          console.log("account",account);
          dispatch(save(userRes.data));
          found = true;
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('userData', JSON.stringify({account}));
          navigation.navigate("TabHome", { id: userRes.data.id });
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
 useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
          const account = await AsyncStorage.getItem('account');
          if (account) {
            console.log(account);
            dispatch(save(account));
          }
           navigation.navigate("TabHome");
        } else {
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient style={{ flex: 1, paddingBottom: 17 }}
        colors={['#7cc0d8', '#FED9B7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={{ width: '100%', height: 50, paddingVertical: 10, alignItems: "center", justifyContent: 'center', backgroundColor: "#1fadea" }}>
          <Text style={{ color: "#fdf8f8", fontSize: 30 }}>Đăng nhập</Text>
        </TouchableOpacity>
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Image source={require('../../assets/bgr.png')} style={{ width: 200, height: 200 }} />
        </View>
        {showError && (
          <Text style={{ color: "red", fontSize: 16, marginHorizontal: 15 }}>{error}</Text>
        )}
        <View style={{ justifyContent: 'center', height: 100, marginTop:10, alignContent: 'center', paddingHorizontal: 10 }}>
          <View style={{ flex: 1, justifyContent: 'center', width: '100%' }}>
            <PhoneInput ref={phoneInput}
              initialCountry='vn'
              onChangePhoneNumber={(phoneNumber) => {
                const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber.slice(1) : phoneNumber;
                setPhoneNumberWithoutPlus(formattedPhoneNumber);
              }}
              style={{
                height: 50,
                paddingLeft: 10,
                fontSize: 20,
                borderColor: 'black',
                backgroundColor: 'white',
                borderWidth: 2,
                borderRadius: 5,
              }}
              textStyle={{
                paddingHorizontal: 10,
                fontSize: 20,
                height: 40,
                borderLeftWidth: 1,
              }}
              cancelText='Hủy'
              cancelTextStyle={{ fontSize: 20, color: 'red' }}
              confirmText='Xác nhận'
              confirmTextStyle={{ fontSize: 20, color: 'green' }}
              pickerItemStyle={{ fontSize: 20 }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <InputPassword setPassword={setPassword} placeholder="Nhập mật khẩu" />
          </View>
        </View>
        <View style={{ marginTop: 10, height: 50}}>
          <Text style={{ color: "#2752eb", marginLeft: 10, fontSize: 20, textDecorationLine: "underline", textDecorationColor: "#2752eb" }} onPress={handleForgotPassword}>Lấy lại mật khẩu</Text>
        </View>

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
        <Text style={{ color: "#635b5b", fontSize: 12, marginLeft: 126}}>Các câu hỏi thường gặp</Text>
      </LinearGradient>
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
    // flex: 1,
    alignItems: "center",
    backgroundColor: "#1faeeb",
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonOtpContainer: {
    margin: 10
  }
});

export default Login;
