import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet, Platform, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { save, updateAvatar, updateCoverImage } from "../../../Redux/slice";
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import profileImage from '../../../assets/profile.png';
import ButtonWithAudio from '../../../components/ButtonWithAudio';
import host from '../../../configHost';

const EditProfile = ({ navigation }) => {
  const coverImage = useSelector((state) => state.account.coverImage);
  const name = useSelector((state) => state.account.userName);
  const avt = useSelector((state) => state.account.avt);
  const bio = useSelector((state) => state.account.bio);
  const userNewData = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(avt);
  const [selectedCoverImage, setSelectedCoverImage] = useState(coverImage);

  useEffect(() => {
    dispatch(updateAvatar(avatar));
  }, [avatar]);

  useEffect(() => {
    dispatch(updateCoverImage(selectedCoverImage));
  }, [selectedCoverImage]);

  const selectAvatar = async () => {
    if (Platform.OS === 'web') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.cancelled) {
        uploadImage(result.assets[0].uri, 'avt');
      }
    } else {
      Alert.alert(
        "Chọn ảnh",
        "Chọn tùy chọn ảnh",
        [
          {
            text: "Chụp ảnh mới",
            onPress: () => captureAvatar(), // Chụp ảnh mới trên thiết bị di động
          },
          {
            text: "Chọn ảnh từ thư viện",
            onPress: () => pickAvatar(), // Chọn ảnh từ thư viện trên thiết bị di động
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

  const captureAvatar = async () => {
    let result;
    try {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.cancelled) {
        uploadImage(result.assets[0].uri, 'avt');
      }
    } catch (error) {
      console.error('Lỗi khi chụp ảnh', error);
    }
  };

  const pickAvatar = async () => {
    let result;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      console.log(result);
      if (!result.cancelled) {
        uploadImage(result.assets[0].uri, 'avt');
      }
    } catch (error) {
      console.error('Lỗi khi chọn ảnh từ thư viện', error);
    }
  };

  const selectCoverImage = async () => {
    let result;
    if (Platform.OS === 'web') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });
    } else {
      Alert.alert(
        "Chọn ảnh",
        "Chọn tùy chọn ảnh",
        [
          {
            text: "Chụp ảnh mới",
            onPress: () => captureCoverImage(), // Chụp ảnh mới trên thiết bị di động
          },
          {
            text: "Chọn ảnh từ thư viện",
            onPress: () => pickCoverImage(), // Chọn ảnh từ thư viện trên thiết bị di động
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    }

    if (result && result.assets && result.assets.length > 0 && result.assets[0].uri) {
      uploadImage(result.assets[0].uri, 'coverImage');
    } else {
      console.log("Không có hình ảnh được chọn");
    }
  };

  const captureCoverImage = async () => {
    let result;
    try {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });
      if (!result.cancelled) {
        uploadImage(result.assets[0].uri, 'coverImage');
      }
    } catch (error) {
      console.error('Lỗi khi chụp ảnh', error);
    }
  };

  const pickCoverImage = async () => {
    let result;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });
      if (!result.cancelled) {
        uploadImage(result.assets[0].uri, 'coverImage');
      }
    } catch (error) {
      console.error('Lỗi khi chọn ảnh từ thư viện', error);
    }
  };

  const uploadImage = async (uri, type) => {
    try {
      if (!uri) {
        console.log("Không có địa chỉ URL hợp lệ");
        console.log("Không có hình ảnh được chọn");
        return;
      }

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
      if (response.data ) {
        if (type === 'avt') {
          dispatch(updateAvatar(response.data));
          setAvatar(response.data);
        } else if (type === 'coverImage') {
          dispatch(updateCoverImage(response.data));
          setSelectedCoverImage(response.data);
        }

        const updatedUserData = { ...userNewData, [type]: response.data };
        const updateUserResponse = await axios.put(`${host}users/updateUser`, updatedUserData);
        dispatch(save(updatedUserData));
      } else {
        console.log("Không có địa chỉ URL hợp lệ từ phản hồi");
      }
    } catch (error) {
      console.error('Lỗi upload ảnh', error);
    }
  };

  const handleNavigationEdit = () => {
    navigation.navigate('ButtonEditUserProfile');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1.5 / 3 }}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={30} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: '80%' }}>
            <TouchableOpacity onPress={handleNavigationEdit}>
              <Feather name="more-horizontal" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonAudio}>
          <ButtonWithAudio />
        </View>
<TouchableOpacity onPress={selectCoverImage} style={styles.coverImageContainer}>
  {selectedCoverImage && (
    <Image
      source={{ uri: selectedCoverImage }}
      style={styles.coverImage}
    />
  )}
</TouchableOpacity>
        <View style={styles.userInfoContainer}>
          <TouchableOpacity onPress={selectAvatar}>
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
          <TouchableOpacity onPress={selectCoverImage}>
            <Text style={styles.selectCoverText}>Chọn ảnh bìa</Text>
          </TouchableOpacity>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>
      </View>
      <View style={styles.headerScrollView}>
        <ScrollView horizontal style={styles.buttonScrollView}>
          <TouchableOpacity style={styles.button} onPress={() => { }}>
            <Fontisto name="applemusic" size={24} color="#2196f3" />
            <Text style={styles.buttonText}>Nhạc chờ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { }}>
            <FontAwesome5 name="file-import" size={24} color="#2196f3" />
            <Text style={styles.buttonText}>Nhập từ Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { }}>
            <FontAwesome6 name="image" size={24} color="#2196f3" />
            <Text style={styles.buttonText}>Ảnh</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <View style={styles.centerScreen}>
        <Image
          source={profileImage}
          style={styles.imageCenter}
        />
      </View>
      <View style={styles.centerScreen}>
        <Text style={styles.centerText}>Hôm nay {name} có gì vui?</Text>
      </View>
      <View style={styles.footerScreen}>
        <TouchableOpacity style={styles.buttonNK}>
          <Text style={styles.buttonTextNK}>Đăng lên nhật kí</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  coverImage: {
    width: "100%",
    height: "100%",
    // position: "absolute",
    // zIndex: -1,
  },
    coverImageContainer: {
    width: "100%",
    height: "60%",
    position: "absolute",
    zIndex: -1,
  },
  userInfoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    margin: 10
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
  selectCoverText: {
    marginTop: 10,
    color: "blue",
    fontSize: 16,
  },
  userName: {
    marginTop: 10,
    fontSize: 24,
  },
  bio: {
    marginTop: 10,
    fontSize: 18,
    color: '#CCCCCC'
  },
  buttonScrollView: {
    flexDirection: "row",
  },
  headerScrollView: {
    flex: 0.5 / 3
  },
  centerScreen: {
    flex: 0.5 / 3,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: 50
  },
  imageCenter: {
    width: 200,
    height: 200,
  },
  buttonNK: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    width: '50%'
  },
  buttonTextNK: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "bold",
  },
  footerScreen: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  buttonAudio: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 30,
    marginTop: 10
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfile;
