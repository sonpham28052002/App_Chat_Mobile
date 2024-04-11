import React, { useState } from 'react';
import { Platform, Alert, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { SimpleLineIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system'; 

const ImagePickerComponent = ({ onSelectImage }) => {
    const [isVideo, setIsVideo] = useState(false);

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
            } else if (isAvatar === false && isVideo === false) {
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.5,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                    allowsEditing: true,
                    aspect: [16, 9],
                    quality: 0.5,
                });
            }
        }

        if (result && result.assets && result.assets.length > 0 && result.assets[0].uri) {
            uploadMedia(result.assets[0].uri, result.assets[0].mimeType, result.assets[0].type);
        } else {
            console.log("Không có hình ảnh hoặc video được chọn");
        }
    };

    const handleSelectOption = () => {
        if (Platform.OS === 'web') {
            selectImage(true);
        } else {
            Alert.alert(
                "Chọn media",
                "Chọn tùy chọn media",
                [
                    {
                        text: "Chụp ảnh mới",
                        onPress: () => selectImage(false),
                    },
                    {
                        text: "Chọn ảnh từ thư viện",
                        onPress: () => selectImage(true),
                    },
                    {
                        text: "Chọn video từ thư viện",
                        onPress: () => {
                            selectImage(false);
                            setIsVideo(true);
                        }
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

    const uploadMedia = async (uri, mimeType, type) => {
        try {
            let filename = uri.split('/').pop();
            let fileInfo = await FileSystem.getInfoAsync(uri);
            let fileSize = fileInfo.size / (1024 * 1024);
            if (fileSize > 10) {
                Alert.alert('Thông báo', 'Kích thước tệp quá lớn. Vui lòng chọn một tệp có kích thước nhỏ hơn 10MB.');
                return;
            }

            const formData = new FormData();
            formData.append('file', {
                uri: uri,
                type: mimeType,
                name: filename,
            });
            formData.append('name', filename);

            const response = await axios.post('https://deploybackend-production.up.railway.app/azure/changeImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onSelectImage(response.data, type,fileSize);
        } catch (error) {
            console.error('Lỗi upload media', error);
        }
    };

    return (
        <TouchableOpacity onPress={handleSelectOption} style={{ height: 50, flexDirection: 'row', alignItems: 'center' }}>
            <SimpleLineIcons name="picture" size={35} color="black" />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>Chọn ảnh/video</Text>
        </TouchableOpacity>
    );
};

export default ImagePickerComponent;
