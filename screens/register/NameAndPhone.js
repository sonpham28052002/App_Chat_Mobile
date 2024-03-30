// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
// import React, { useRef, useState} from 'react'
// import ButtonCustom from '../../components/button'
// import { RadioButton } from 'react-native-paper';
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import { firebaseConfig } from '../../config'
// import { sendVerification } from '../../function/sendVerification';
// import PhoneInputText from '../../components/PhoneInputText';

// const NameAndPhone = ({ navigation }) => {
//   var [phone, setPhone] = useState('')
//   var [name, setName] = useState('')
//   const [checked, setChecked] = useState('Nam');

//   const recaptchaVerifier = useRef(null);
//   const [verificationId, setVerificationId] = useState(null);

//   return (
//     <View style={{ backgroundColor: 'lightblue', width: '100%', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
//       <View style={{ alignItems: 'center', justifyContent: 'center', width: '80%', flex: 1 }}>
//         <Text style={{ fontSize: 30, fontWeight: 700 }}>ĐĂNG KÝ TÀI KHOẢN</Text>
//       </View>
//       <View style={{ flex: 4, width: '90%' }}>
//         <View style={{ justifyContent: 'space-between', paddingVertical: 20 }}>
//           <Text style={styles.text}>Tên:</Text>
//           <TextInput style={{
//             padding: 10,
//             height: 40,
//             fontSize: 20,
//             borderColor: 'black',
//             borderWidth: 1,
//             borderRadius: 5
//           }}
//             value={name}
//             onChangeText={setName}
//             placeholder={'Nhập tên tài khoản'}
//             placeholderTextColor={'gray'}
//           />
//           <Text style={styles.text}>Giới tính:</Text>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <RadioButton
//               value="Nam"
//               status={checked === 'Nam' ? 'checked' : 'unchecked'}
//               onPress={() => setChecked('Nam')}
//             />
//             <Text style={styles.text}>Nam</Text>
//             <RadioButton
//               value="Nữ"
//               status={checked === 'Nữ' ? 'checked' : 'unchecked'}
//               onPress={() => setChecked('Nữ')}
//             />
//             <Text style={styles.text}>Nữ</Text>
//           </View>
//           <Text style={styles.text}>Số điện thoại:</Text>
//           <PhoneInputText onChangePhoneNumber={(text) => setPhone(text)} />
//         </View>
//         <FirebaseRecaptchaVerifierModal
//         ref={recaptchaVerifier}
//         firebaseConfig={firebaseConfig}
//       />
//         <ButtonCustom title={'Gửi mã OTP'} backgroundColor={'cyan'} 
//         onPress={() => {
//           sendVerification(phone, recaptchaVerifier, (data)=>{setVerificationId(data)})
//         }}
//         />
//         {
//           verificationId && <ButtonCustom title={'Xác thực OTP'} backgroundColor={'cyan'}
//           onPress={()=>{
//             navigation.navigate('AuthenticateOTP', {
//               phone: phone,
//               verificationId: verificationId,
//               callBack: (uid) => { // hàm thực thi sau khi xác thực thành công
//                 navigation.navigate('CreatePassword', {
//                   id: uid,
//                   phone: phone,
//                   name: name,
//                   gender: checked
//                 })
//               }
//             })
//           }}
//           />
//         }
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginVertical: 5
//   }
// })

// export default NameAndPhone