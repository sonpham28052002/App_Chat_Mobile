import * as ImagePicker from "expo-image-picker";

export const selectImage = async (isAvatar) => {
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
    return result.assets[0].uri;
  } else {
    console.log("Không có hình ảnh được chọn");
    return null;
  }
};