import React, { useState } from 'react';
import { Platform, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { SimpleLineIcons } from '@expo/vector-icons';

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
        //       try {
        //     const result = await DocumentPicker.getDocumentAsync({ type: "video/*" });
        //     console.log("Result:", result);
        //     if (result.assets[0].uri) {
        //         uploadMedia(result.assets[0].uri, result.assets[0].uri);
        //     } else {
        //         console.log("Không có video được chọn");
        //     }
        // } catch (error) {
        //     console.error("Lỗi khi chọn video từ tệp:", error);
        // }
            }
        }

        console.log("Result:", result);
            if (result && result.assets && result.assets.length > 0 && result.assets[0].uri) {
             uploadMedia(result.assets[0].uri, result.assets[0].mimeType,result.assets[0].type)
             console.log("Type", result.assets[0].type);
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

    const uploadMedia = async (uri,mimeType,type) => {
        try {
            let filename = uri.split('/').pop();
            const formData = new FormData();
            formData.append('file', {
                uri: uri,
                type: mimeType,
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
            onSelectImage(response.data,type);
            console.log(type);
        } catch (error) {
            console.error('Lỗi upload media', error);
        }
    };

    return (
        <TouchableOpacity onPress={handleSelectOption} style={{ height: 50, width: 50 }}>
            <SimpleLineIcons name="picture" size={35} color="black" />
        </TouchableOpacity>
    );
};

export default ImagePickerComponent;
 