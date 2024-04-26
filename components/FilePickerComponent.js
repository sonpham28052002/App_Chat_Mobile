import React from 'react';
import { Platform, Alert, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'; 
import axios from 'axios';
import host from '../configHost'

const FilePickerComponent = ({ onSelectFile }) => {
    const selectFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
            console.log("result",result);
            if (result && result.assets && result.assets.length > 0 && result.assets[0].uri) {
          uploadFile(result.assets[0].uri,result.assets[0].name,result.assets[0].size);
          console.log("Uri",result.assets[0].uri);
        }
            
        } catch (error) {
            console.error('Lỗi chọn file:', error);
        }
    };

    const handleSelectOption = () => {
        if (Platform.OS === 'web') {
            selectFile();
        } else {
            Alert.alert(
                'Chọn tệp',
                'Chọn tùy chọn tệp',
                [
                    {
                        text: 'Chọn tệp từ thư viện',
                        onPress: () => selectFile(),
                    },
                    {
                        text: 'Hủy',
                        style: 'cancel',
                    },
                ],
                { cancelable: true }
            );
        }
    };

    const uploadFile = async (uri,name,size) => {
        try {
            if(name==null){
            name= uri.split('/').pop();
            }
            let fileInfo = await FileSystem.getInfoAsync(uri);
            let fileSize = fileInfo.size / (1024 * 1024);
            if (fileSize > 10) {
                Alert.alert('Thông báo', 'Kích thước tệp quá lớn. Vui lòng chọn một tệp có kích thước nhỏ hơn 10MB.');
                return;
            }
            const formData = new FormData();
            formData.append('file', {
                uri: uri,
                type: 'application/octet-stream',
                name: name
            });
            formData.append('name', name);
            const response = await axios.post(
                `${host}azure/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            onSelectFile(response.data, size);
            console.log(response.data);
        } catch (error) {
            console.error('Lỗi upload file:', error);
        }
    };

    return (
        <TouchableOpacity onPress={handleSelectOption} style={{ height: 50, flexDirection: 'row', alignItems:'center' }}>
            <Ionicons name="document-attach-outline" size={35} color="black" />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>Chọn tệp</Text>
        </TouchableOpacity>
    );
};

export default FilePickerComponent;
