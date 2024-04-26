import { View, ScrollView, Image, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react'
// import { firebaseConfig } from "../../config/firebase.js";
// import CountryPicker from "react-native-country-picker-modal";
import PhoneNumber from "libphonenumber-js";
import axios from 'axios';
import host from "../../configHost";

const ForgotPassword = ({ navigation }) => {
  const [sdt, setsdt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFocusedSdt, setIsFocusedSdt] = useState(false);
  useEffect(() => {
    setIsFieldsFilled(sdt !== "");
  }, [sdt]);
  const [isFieldsFilled, setIsFieldsFilled] = useState(false);
  const [countryCode, setCountryCode] = useState("VN");
  const [callingCode, setCallingCode] = useState("+84");
  const handleCountryChange = (country) => {
    setCountryCode(country.cca2);
    setCallingCode("+" + country.callingCode.join(""));
  };
  async function forgotpass() {
    try {
      const phoneNumber = PhoneNumber.isPossibleNumber(sdt, countryCode);
      if (phoneNumber) {
        const formatPhone = '84' + sdt.replace(/^0/, '');
        const res = await axios.get(`${host}account/getAccountByPhone?phone=${formatPhone}`);
        if (res.data) {
          // console.log("res", res.data.id);
          navigation.navigate('AuthenOtp', { sdt: formatPhone, id: res.data.id });

        }
        else {
          setErrorMessage("Số điện thoại chưa được đăng kí");
        }
      } else {
        setErrorMessage("Số điện thoại không hợp lệ cho quốc gia đã chọn");
      }
      // format số điện thoại, bỏ số 0 ở đầu và thêm 84

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.ViewTop}>
        <Text>Vui lòng nhập số điện thoại để lấy lại mật khẩu</Text>
      </View>
      <View style={styles.ViewInput}>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            height: 50,
            borderBottomColor: isFocusedSdt ? "blue" : "gray",
          }}
        >
          {/* <CountryPicker
          containerButtonStyle={{ marginTop: 0 }}
          withCallingCode
          withFilter
          withFlag
          onSelect={handleCountryChange}
          countryCode={countryCode}
        /> */}
          <TextInput
            style={[styles.input]}
            placeholder="Số điện thoại"
            autoCapitalize="none"
            keyboardType="phone-pad"
            autoFocus={true}
            value={sdt}
            onFocus={() => setIsFocusedSdt(true)}
            onBlur={() => setIsFocusedSdt(false)}
            onChangeText={(text) => setsdt(text)}
          />
        </View>
      </View>
      <Text
        style={{ fontSize: 18, color: "red", marginLeft: 17 }}
      >
        {errorMessage}
      </Text>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            forgotpass();
          }}
          style={{
            borderRadius: 19,
            width: 100,
            height: 39,
            backgroundColor: isFieldsFilled ? "#006AF5" : "gray",
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled={!isFieldsFilled}
        >
          <Text style={{ color: "white" }}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ViewTop: {
    width: "100%",
    height: 50,
    backgroundColor: "#E9EBED",
    justifyContent: "center",
    alignItems: "center",
  },
  ViewInput: {
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  inputPass: {
    width: "90%",
    height: 50,
    fontSize: 19,
  },
  input: {
    width: "90%",
    height: 50,
    fontSize: 19,
  },
  ViewBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    bottom: 20,
    position: "absolute",
  },
});
export default ForgotPassword;

