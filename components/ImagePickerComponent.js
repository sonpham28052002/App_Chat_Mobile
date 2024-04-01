import React from 'react';
import { Platform, Alert,TouchableOpacity,Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ImagePickerComponent = ({ onSelectImage }) => {

    const selectImage = async (isAvatar) => {
        let result;
        if (Platform.OS === 'web'&&isAvatar) {
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
          console.log("Uri",result.assets[0].uri);
        } else {
          console.log("Không có hình ảnh đươc chọn");
        }
      };
  //Hàm xử lí chọn ảnh khi nhấn vào ảnh đại diện
  const handleSelectOption = () => {
    if (Platform.OS === 'web') {
      selectImage(true); // Chọn ảnh từ thư viện trên web
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
            onPress: () => selectImage(false), // Chụp ảnh mới trên thiết bị di động
          },
          {
            text: "Chọn ảnh từ thư viện",
            onPress: () => selectImage(true), // Chọn ảnh từ thư viện trên thiết bị di động
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

  const uploadImage = async (uri) => {
    try {
      // Lấy tên của file từ URI
      let filename = uri.split('/').pop();
      //upload ảnh lên azure
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'image/jpeg',
        name: filename,
      });
      formData.append('name', filename);
      console.log("FormData", formData);
      const response = await axios.post('https://deploybackend-production.up.railway.app/azure/changeImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      // Gọi hàm onSelectImage để truyền URI của ảnh đã upload ra bên ngoài
      onSelectImage(response.data);
    } catch (error) {
      console.error('Lỗi upload ảnh', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleSelectOption} style={{height:50,width:50}}>
    <Text>Chọn ảnh</Text>
    </TouchableOpacity>
  );
};

export default ImagePickerComponent;
