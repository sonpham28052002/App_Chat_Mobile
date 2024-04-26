import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Platform, Alert, ScrollView, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { save, updateAvatar } from "../../../Redux/slice";
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 
import host from '../../../configHost'

const ButtonEditUserProfile = ({ navigation }) => {
    const userNewData = useSelector((state) => state.account);
  const { avt, userName, phone, gender, dob, bio,coverImage } = userNewData;
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(avt);
  const [selectedGender, setSelectedGender] = useState(gender);
  const [selectedDate, setSelectedDate] = useState(new Date(dob));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
const [nameUpdate,setNameUpdate]=useState(userName)
const [phoneUpdate,setPhoneUpdate]=useState(phone)
const [bioUpdate,setBioUpdate]=useState(bio)
const [userNewUpdate,setUserNewUpdate]=useState(userNewData)
  useEffect(() => {
    dispatch(updateAvatar(avatar));
  }, [avatar]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'&&Platform.OS === 'android');
    setSelectedDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };
//đổi giới tính
  const handleGenderChange = (value) => {
    setSelectedGender(value);
    setPickerVisible(false); 
  };
//hiện giới tính
  const showDatePickerr = () => {
    setDatePickerVisibility(true);
  };
//ẩn giới tính
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
//Chọn ngày sinh
  const handleConfirmDate = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };
//chọn ảnh tư từ thư viện
  const selectImage = async (isAvatar) => {
    let result;
    if (Platform.OS === 'web' && isAvatar) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
    } else {
      if (isAvatar) {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });
      } else {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });
      }
    }

    console.log("Result:", result);
    if (result && result.assets && result.assets.length > 0 && result.assets[0].uri) {
      uploadImage(result.assets[0].uri);
      console.log("Uri", result.assets[0].uri);
    } else {
      console.log("Không có hình ảnh được chọn");
    }
  };
//up ảnh
  const uploadImage = async (uri) => {
    try {
      let filename = uri.split('/').pop();

      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'image/jpeg',
        name: filename,
      });
      formData.append('name', filename);

      const response = await axios.post(`${host}azure/changeImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);

      dispatch(updateAvatar(response.data));
      setAvatar(response.data);

      const updatedUserData = { ...userNewData, avt: response.data };

      const updateUserResponse = await axios.put(`${host}users/updateUser`, updatedUserData);
      dispatch(save(updatedUserData));
    } catch (error) {
      console.error('Lỗi upload ảnh', error);
    }
  };
  // Chọn ảnh
  const handleSelectOption = () => {
    if (Platform.OS === 'web') {
      selectImage(true);
    } else {
      Alert.alert(
        "Chọn ảnh",
        "Chọn tùy chọn ảnh",
        [
          {
            text: "Xem ảnh đại diện",
            onPress: () => console.log("Xem ảnh đại diện"),
          },
          {
            text: "Chụp ảnh mới",
            onPress: () => selectImage(false),
          },
          {
            text: "Chọn ảnh từ thư viện",
            onPress: () => selectImage(true),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    }
  };
  //Cập nhật User
   const handleUpdateUser = async () => {
  try {
    const updatedUserData = {
      ...userNewData,
      userName: nameUpdate,
      phone: phoneUpdate,
      gender: selectedGender,
      dob:selectedDate.toISOString(),
      bio: bioUpdate,
    };

    const response = await axios.put(`${host}users/updateUser`, updatedUserData);

    if (response && response.status === 200) {
      dispatch(save(updatedUserData));
      Alert.alert("Cập nhật thành công");
    } else {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật thông tin người dùng. Vui lòng thử lại sau.");
    }
  } catch (error) {
    Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật thông tin người dùng. Vui lòng thử lại sau.");
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
  }
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Ảnh nền và ảnh đại diện */}
          {coverImage && (
            <Image
              source={{ uri: coverImage }}
              style={styles.coverImage}
            />
          )}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.userInfoContainer}>
            <TouchableOpacity onPress={handleSelectOption}>
              <View style={styles.avatarContainer}>
                {avatar && (
                  <Image
                    source={{ uri: avatar }}
                    style={styles.avatar}
                  />
                )}
                {!avatar && (
                  <Text style={styles.selectAvatarText}>Chọn ảnh đại diện</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ margin: '5%' }}>
            {/* Họ tên */}
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Họ tên</Text>
              <View style={{flexDirection:'row'}}>
                <View style={{width:'90%'}}>
   <TextInput
                style={styles.input}
                value={nameUpdate}
                onChangeText={setNameUpdate}
              />
                </View>
                   <View>
                    <TouchableOpacity>
  <Feather name="edit" size={24} color="black" />
                    </TouchableOpacity>
                
              </View>
              </View>
           
            </View>
            {/* Số điện thoại */}
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Số điện thoại</Text>
              <View style={{flexDirection:'row'}}>
                <View style={{width:'90%'}}>
   <TextInput
                style={styles.input}
                value={phoneUpdate}
                onChangeText={setPhoneUpdate}
              />
                </View>
                   <View>
                    <TouchableOpacity>
  <Feather name="edit" size={24} color="black" />
                    </TouchableOpacity>
                
              </View>
              </View>
           
            </View>
            {/* Giới tính */}
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Giới tính</Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={{width:'90%'}}>
                  <Text style={styles.input}>{selectedGender}</Text>
                </View>
                <View style={{}}>
                  <TouchableOpacity onPress={() => setPickerVisible(true)}>
                    <Feather name="edit" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              {pickerVisible && (
                <Picker
                  selectedValue={selectedGender}
                  onValueChange={(itemValue, itemIndex) =>
                    handleGenderChange(itemValue)
                  }>
                  <Picker.Item label="Nam" value="Nam" />
                  <Picker.Item label="Nữ" value="Nữ" />
                </Picker>
              )}
            </View>
            {/* Ngày sinh */}
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Ngày sinh</Text>
              <TouchableOpacity onPress={showDatePickerr}>
                <Text>{selectedDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
              />
            </View>
            {/* Tiểu sử */}
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Tiểu sử</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                multiline={true}
                value={bioUpdate}
                onChangeText={setBioUpdate}
              />
            </View>
            {/* Nút đăng nhập */}
            <View>
              <TouchableOpacity style={styles.buttonUpdateUser} onPress={handleUpdateUser}>
  <Text style={styles.textUpdate}>Cập nhật thông tin</Text>
</TouchableOpacity>

            </View>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  coverImage: {
    width: "100%",
    height: Dimensions.get("window").height / 3,
    position: "absolute",
    zIndex: -1,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 10 : 40,
    left: 10,
    zIndex: 1,
  },
  userInfoContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 20,
    marginTop: Dimensions.get("window").height / 3 - 100,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "white",
  },
  selectAvatarText: {
    marginTop: 10,
  },
  userName: {
    marginTop: 10,
    fontSize: 24,
    color: 'white'
  },
  infoContainer: {
    width: "100%",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    marginBottom: 10, 
  },
  picker: {
    fontSize: 16,
    paddingVertical: 0,
    height: 40,
    marginBottom: 10, 
  },
  buttonUpdateUser:{
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
  textUpdate:{
    fontStyle:'normal',
    fontWeight:'bold',
    color:'white'
  }
});

export default ButtonEditUserProfile;
