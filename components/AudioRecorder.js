import React, { useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import axios from 'axios';
import * as FileSystem from 'expo-file-system'; 
const AudioRecorder = ({ onSelectAudio }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);

    const startRecording = async () => {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Bat dau ghi...........');
            if (!recording) {
                const newRecording = new Audio.Recording();
                await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                await newRecording.startAsync();
                setRecording(newRecording);
                setIsRecording(true);
                console.log('Recording started');
            }
        } catch (error) {
            console.error('Failed to start recording', error);
        }
    };

    const stopRecording = async () => {
        console.log('Dung...........');
        console.log('Recording:', recording);
        console.log('isRecording:', isRecording);
        setIsRecording(false);
        try {
            if (recording) {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                const durationInSeconds = recording._finalDurationMillis;
                // const durationInSeconds = durationInMillis / 1000;
                console.log('Sgiay:', durationInSeconds);
                console.log('Uri', uri);
                uploadMedia(uri,durationInSeconds);
                setRecording(null);
            }
        } catch (error) {
            console.error('Loi stop', error);
        }
    };

    const handlePress = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const uploadMedia = async (uri,durationInSeconds) => {
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
                type: 'audio/mp3',  
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
            onSelectAudio(response.data,fileSize,durationInSeconds);
        } catch (error) {
            console.error('Lỗi upload media', error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <MaterialIcons name="mic" size={35} color={isRecording ? 'red' : 'black'} />
        </TouchableWithoutFeedback>
    );
};

export default AudioRecorder;
