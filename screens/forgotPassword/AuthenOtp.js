// import { View, ScrollView, Image, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import React, { useState,useRef,useEffect } from 'react'
// import { firebaseConfig } from '../../config.js';
// import firebase from "firebase/compat/app";
// import { FontAwesome5 } from "@expo/vector-icons";

// import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha';
// const AuthenOtp = ({navigation,route}) => {
//   const [verificationCode, setVerificationCode] = useState("");
//   const [isEnterCode, setIsEnterCode] = useState(false);
//   const phoneNumber =  '+'+ route.params.sdt;
//   const [verificationId, setVerificationId] = useState(null);
//   const recaptchaVerifier = useRef(null);

//   const senVerification = () => {
//     let phoneProvider = new firebase.auth.PhoneAuthProvider();
//     phoneProvider
//       .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
//       .then((verificationId) => {
//         setVerificationId(verificationId);
//       })
//       .catch((error) => {
//         console.log("Error sending OTP:", error);
//       });
//   };
//   useEffect(() => {
//     if (verificationCode.length === 6) {
//       setIsEnterCode(true);
//     } else {
//       setIsEnterCode(false);
//     }
//   }, [verificationCode.length]);
//   useEffect(() => {
//     senVerification();
//   }, []);



//   function tiepTuc(){
//     const credential = firebase.auth.PhoneAuthProvider.credential(
//       verificationId,
//       verificationCode
//     );
//     firebase.auth().signInWithCredential(credential).then(async (result) => {
//       navigation.navigate('ResetPass', { id: route.params.id });
//     }).catch((err) => {
//       // console.log(err);
//       setErrorCode("Mã OTP không đúng, vui lòng kiểm tra lại.");
//     });
//   }
//   const [errorCode, setErrorCode] = useState("");

//   return (
//     <View style={styles.container}>
//       <FirebaseRecaptchaVerifierModal
//         ref={recaptchaVerifier}
//         firebaseConfig={firebaseConfig}
//       />
//       <View style={styles.ViewTop}>
//         <Text>Vui lòng không chia sẻ mã xác thực để tránh mất tài khoản</Text>
//       </View>
//       <View style={styles.ViewBottom}>
//         <View
//           style={{
//             width: 66,
//             height: 66,
//             borderWidth: 1,
//             borderColor: "gray",
//             justifyContent: "center",
//             alignItems: "center",
//             borderRadius: 100,
//           }}
//         >
//           <FontAwesome5 name="sms" size={49} color="green" />
//         </View>
//         <Text style={{ fontSize: 17, marginTop: 10, fontWeight: 700 }}>
//           Đang gửi mã OTP đến số {"(+"}
//           {route.params.sdt}
//           {") "}
//         </Text>
//         <Text style={{ fontSize: 16, marginTop: 10, fontWeight: 300 }}>
//           Vui lòng nhập mã xác thực{" "}
//         </Text>
//         <View style={styles.verificationContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="•  •  •  •  •  •"
//             maxLength={6}
//             keyboardType="numeric"
//             value={verificationCode}
//             onChangeText={(text) => setVerificationCode(text)}
//           />
//         </View>
//         <Text
//           style={{ fontSize: 16, marginTop: 10, fontWeight: 500, color: "red" }}
//         >
//           {errorCode}
//         </Text>
//         <TouchableOpacity
//           style={{
//             borderRadius: 50,
//             width: 150,
//             height: 50,
//             backgroundColor: isEnterCode ? "blue" : "gray",
//             justifyContent: "center",
//             alignItems: "center",
//             marginTop: 20,
//           }}
//           disabled={!isEnterCode}
//           onPress={tiepTuc}
//         >
//           <Text style={{ fontSize: 18, color: "white", fontWeight: 700 }}>
//             Tiếp tục
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   ViewTop: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "gray",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   ViewBottom: {
//     width: "100%",
//     padding: 20,
//     alignItems: "center",
//   },
//   verificationContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 27,
//   },
//   input: {
//     width: 120,
//     height: 40,
//     borderBottomWidth: 1,
//     borderBottomColor: "black",
//     marginHorizontal: 5,
//     fontSize: 24,
//     textAlign: "center",
//   },
// });
// export default AuthenOtp;
